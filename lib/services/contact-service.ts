import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'

type Contact = Database['public']['Tables']['contacts']['Row']
type ContactInsert = Database['public']['Tables']['contacts']['Insert']

export interface PhoneContact {
  name: string
  phoneNumbers: string[]
  emails?: string[]
}

export class ContactService {
  private supabase = createClient()

  async requestContactPermission(): Promise<boolean> {
    // Check if Contacts API is available (limited browser support)
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const contacts = await (navigator as any).contacts.select(['name', 'tel'], { multiple: true })
        return contacts.length >= 0 // Permission granted if we get any result
      } catch (error) {
        console.error('Contact permission denied:', error)
        return false
      }
    }
    
    // Fallback: assume permission granted for demo
    return true
  }

  async getPhoneContacts(): Promise<PhoneContact[]> {
    try {
      // Check if Contacts API is available
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const contacts = await (navigator as any).contacts.select(
          ['name', 'tel', 'email'], 
          { multiple: true }
        )
        
        return contacts.map((contact: any) => ({
          name: contact.name?.[0] || 'Unknown',
          phoneNumbers: contact.tel || [],
          emails: contact.email || []
        }))
      }
      
      // Fallback: return mock contacts for demo
      return this.getMockContacts()
    } catch (error) {
      console.error('Failed to get contacts:', error)
      return this.getMockContacts()
    }
  }

  private getMockContacts(): PhoneContact[] {
    return [
      {
        name: 'John Doe',
        phoneNumbers: ['08012345678', '07098765432'],
        emails: ['john@example.com']
      },
      {
        name: 'Jane Smith',
        phoneNumbers: ['08087654321'],
        emails: ['jane@example.com']
      },
      {
        name: 'Mike Johnson',
        phoneNumbers: ['07012345678'],
        emails: []
      },
      {
        name: 'Sarah Wilson',
        phoneNumbers: ['08198765432', '09012345678'],
        emails: ['sarah@example.com']
      },
      {
        name: 'David Brown',
        phoneNumbers: ['08156789012'],
        emails: ['david@example.com']
      }
    ]
  }

  async saveContact(userId: string, contact: Omit<ContactInsert, 'id' | 'user_id' | 'created_at'>): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert({
        user_id: userId,
        ...contact
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserContacts(userId: string): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getFavoriteContacts(userId: string): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('favorite', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteContact(contactId: string): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)

    if (error) throw error
  }

  async toggleFavorite(contactId: string): Promise<Contact> {
    // Get current favorite status
    const { data: contact } = await this.supabase
      .from('contacts')
      .select('favorite')
      .eq('id', contactId)
      .single()

    if (!contact) throw new Error('Contact not found')

    // Toggle favorite status
    return this.updateContact(contactId, { favorite: !contact.favorite })
  }

  async searchContacts(userId: string, query: string): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async syncPhoneContacts(userId: string): Promise<void> {
    try {
      const phoneContacts = await this.getPhoneContacts()
      const existingContacts = await this.getUserContacts(userId)
      
      // Create a map of existing contacts by phone number
      const existingMap = new Map()
      existingContacts.forEach(contact => {
        existingMap.set(contact.phone, contact)
      })

      // Add new contacts
      for (const phoneContact of phoneContacts) {
        for (const phoneNumber of phoneContact.phoneNumbers) {
          if (!existingMap.has(phoneNumber)) {
            await this.saveContact(userId, {
              name: phoneContact.name,
              phone: phoneNumber,
              email: phoneContact.emails?.[0] || null,
              favorite: false
            })
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync phone contacts:', error)
      throw error
    }
  }

  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Format Nigerian phone numbers
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `+234${cleaned.slice(1)}`
    } else if (cleaned.length === 10) {
      return `+234${cleaned}`
    } else if (cleaned.length === 13 && cleaned.startsWith('234')) {
      return `+${cleaned}`
    }
    
    return phone // Return original if format not recognized
  }

  validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    
    // Nigerian phone number validation
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return /^0[789][01]\d{8}$/.test(cleaned)
    } else if (cleaned.length === 10) {
      return /^[789][01]\d{8}$/.test(cleaned)
    } else if (cleaned.length === 13 && cleaned.startsWith('234')) {
      return /^234[789][01]\d{8}$/.test(cleaned)
    }
    
    return false
  }
}

// Export singleton instance
export const contactService = new ContactService()
