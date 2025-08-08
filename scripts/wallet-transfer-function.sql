-- Create wallet transfer function with proper validation and transaction handling
CREATE OR REPLACE FUNCTION transfer_wallet_funds(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_amount DECIMAL(15,2),
  p_reference VARCHAR(50),
  p_note TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_sender_balance DECIMAL(15,2);
  v_recipient_balance DECIMAL(15,2);
  v_transfer_id UUID;
  v_result JSON;
BEGIN
  -- Validate input parameters
  IF p_sender_id IS NULL OR p_recipient_id IS NULL OR p_amount IS NULL OR p_reference IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Missing required parameters',
      'code', 'INVALID_PARAMS'
    );
  END IF;

  -- Check if sender and recipient are different
  IF p_sender_id = p_recipient_id THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Cannot transfer to yourself',
      'code', 'SAME_USER'
    );
  END IF;

  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Transfer amount must be greater than zero',
      'code', 'INVALID_AMOUNT'
    );
  END IF;

  -- Check if reference already exists
  IF EXISTS (SELECT 1 FROM wallet_transfers WHERE reference = p_reference) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Transfer reference already exists',
      'code', 'DUPLICATE_REFERENCE'
    );
  END IF;

  -- Start transaction
  BEGIN
    -- Lock sender's profile for update
    SELECT wallet_balance INTO v_sender_balance
    FROM profiles
    WHERE id = p_sender_id
    FOR UPDATE;

    -- Check if sender exists
    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Sender not found',
        'code', 'SENDER_NOT_FOUND'
      );
    END IF;

    -- Check if sender has sufficient balance
    IF v_sender_balance < p_amount THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Insufficient balance',
        'code', 'INSUFFICIENT_BALANCE',
        'current_balance', v_sender_balance,
        'required_amount', p_amount
      );
    END IF;

    -- Lock recipient's profile for update
    SELECT wallet_balance INTO v_recipient_balance
    FROM profiles
    WHERE id = p_recipient_id
    FOR UPDATE;

    -- Check if recipient exists
    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Recipient not found',
        'code', 'RECIPIENT_NOT_FOUND'
      );
    END IF;

    -- Generate transfer ID
    v_transfer_id := gen_random_uuid();

    -- Create wallet transfer record
    INSERT INTO wallet_transfers (
      id,
      sender_id,
      recipient_id,
      amount,
      reference,
      note,
      status,
      created_at,
      updated_at
    ) VALUES (
      v_transfer_id,
      p_sender_id,
      p_recipient_id,
      p_amount,
      p_reference,
      p_note,
      'completed',
      NOW(),
      NOW()
    );

    -- Update sender's balance
    UPDATE profiles
    SET 
      wallet_balance = wallet_balance - p_amount,
      updated_at = NOW()
    WHERE id = p_sender_id;

    -- Update recipient's balance
    UPDATE profiles
    SET 
      wallet_balance = wallet_balance + p_amount,
      updated_at = NOW()
    WHERE id = p_recipient_id;

    -- Create transaction records for both users
    -- Sender transaction (debit)
    INSERT INTO transactions (
      id,
      user_id,
      type,
      amount,
      status,
      reference,
      description,
      metadata,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      p_sender_id,
      'wallet_transfer_out',
      p_amount,
      'completed',
      p_reference,
      COALESCE('Transfer to user: ' || p_note, 'Wallet transfer sent'),
      json_build_object(
        'transfer_id', v_transfer_id,
        'recipient_id', p_recipient_id,
        'transfer_type', 'outgoing'
      ),
      NOW(),
      NOW()
    );

    -- Recipient transaction (credit)
    INSERT INTO transactions (
      id,
      user_id,
      type,
      amount,
      status,
      reference,
      description,
      metadata,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      p_recipient_id,
      'wallet_transfer_in',
      p_amount,
      'completed',
      p_reference,
      COALESCE('Transfer from user: ' || p_note, 'Wallet transfer received'),
      json_build_object(
        'transfer_id', v_transfer_id,
        'sender_id', p_sender_id,
        'transfer_type', 'incoming'
      ),
      NOW(),
      NOW()
    );

    -- Get updated balances
    SELECT wallet_balance INTO v_sender_balance
    FROM profiles
    WHERE id = p_sender_id;

    SELECT wallet_balance INTO v_recipient_balance
    FROM profiles
    WHERE id = p_recipient_id;

    -- Return success response
    v_result := json_build_object(
      'success', true,
      'transfer_id', v_transfer_id,
      'reference', p_reference,
      'amount', p_amount,
      'sender_new_balance', v_sender_balance,
      'recipient_new_balance', v_recipient_balance,
      'created_at', NOW()
    );

    RETURN v_result;

  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback is automatic in PostgreSQL for failed transactions
      RETURN json_build_object(
        'success', false,
        'error', 'Transfer failed: ' || SQLERRM,
        'code', 'TRANSFER_FAILED'
      );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get transfer history for a user
CREATE OR REPLACE FUNCTION get_user_transfer_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
) RETURNS JSON AS $$
DECLARE
  v_transfers JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', wt.id,
      'amount', wt.amount,
      'reference', wt.reference,
      'note', wt.note,
      'status', wt.status,
      'type', CASE 
        WHEN wt.sender_id = p_user_id THEN 'outgoing'
        ELSE 'incoming'
      END,
      'other_user', CASE 
        WHEN wt.sender_id = p_user_id THEN 
          json_build_object(
            'id', rp.id,
            'full_name', rp.full_name,
            'phone_number', rp.phone_number
          )
        ELSE 
          json_build_object(
            'id', sp.id,
            'full_name', sp.full_name,
            'phone_number', sp.phone_number
          )
      END,
      'created_at', wt.created_at,
      'updated_at', wt.updated_at
    ) ORDER BY wt.created_at DESC
  ) INTO v_transfers
  FROM wallet_transfers wt
  LEFT JOIN profiles sp ON wt.sender_id = sp.id
  LEFT JOIN profiles rp ON wt.recipient_id = rp.id
  WHERE wt.sender_id = p_user_id OR wt.recipient_id = p_user_id
  LIMIT p_limit OFFSET p_offset;

  RETURN COALESCE(v_transfers, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION transfer_wallet_funds(UUID, UUID, DECIMAL, VARCHAR, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_transfer_history(UUID, INTEGER, INTEGER) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallet_transfers_sender_created ON wallet_transfers(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transfers_recipient_created ON wallet_transfers(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transfers_status ON wallet_transfers(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transfers_created_at ON wallet_transfers(created_at DESC);
