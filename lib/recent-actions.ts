export interface RecentAction {
  id: string
  type: "airtime" | "data" | "cable" | "electricity" | "wallet_funding"
  network?: string
  phoneNumber?: string
  amount?: number
  package?: string
  provider?: string
  paymentMethod?: string
  timestamp: string
  [key: string]: any
}

const STORAGE_KEY = "vtopup_recent_actions"
const MAX_ACTIONS_PER_TYPE = 3 // Reduced to 3 for smaller display
const EXPIRY_DAYS = 30

export function saveRecentAction(action: Omit<RecentAction, "id" | "timestamp">) {
  try {
    const existingActions = getRecentActions()

    // Create new action with ID and timestamp
    const newAction: RecentAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    // Filter out expired actions and duplicates
    const validActions = existingActions.filter((existing) => {
      const actionDate = new Date(existing.timestamp)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() - EXPIRY_DAYS)

      // Keep if not expired and not a duplicate
      return actionDate > expiryDate && !isDuplicate(existing, newAction)
    })

    // Add new action
    validActions.unshift(newAction)

    // Keep only the latest actions per type
    const actionsByType: { [key: string]: RecentAction[] } = {}
    validActions.forEach((action) => {
      if (!actionsByType[action.type]) {
        actionsByType[action.type] = []
      }
      if (actionsByType[action.type].length < MAX_ACTIONS_PER_TYPE) {
        actionsByType[action.type].push(action)
      }
    })

    // Flatten back to array
    const finalActions = Object.values(actionsByType).flat()

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalActions))
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('recentActionsUpdated'))
  } catch (error) {
    console.error("Failed to save recent action:", error)
  }
}

export function getRecentActions(): RecentAction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const actions: RecentAction[] = JSON.parse(stored)

    // Filter out expired actions
    const validActions = actions.filter((action) => {
      const actionDate = new Date(action.timestamp)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() - EXPIRY_DAYS)
      return actionDate > expiryDate
    })

    // Update storage if we filtered out expired actions
    if (validActions.length !== actions.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validActions))
    }

    return validActions
  } catch (error) {
    console.error("Failed to get recent actions:", error)
    return []
  }
}

export function getRecentActionsByType(type: string): RecentAction[] {
  return getRecentActions()
    .filter((action) => action.type === type)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, MAX_ACTIONS_PER_TYPE)
}

export function clearRecentActions() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('recentActionsUpdated'))
  } catch (error) {
    console.error("Failed to clear recent actions:", error)
  }
}

function isDuplicate(existing: RecentAction, newAction: RecentAction): boolean {
  if (existing.type !== newAction.type) return false

  // Check for duplicate based on type-specific criteria
  switch (newAction.type) {
    case "airtime":
    case "data":
      return (
        existing.network === newAction.network &&
        existing.phoneNumber === newAction.phoneNumber &&
        existing.amount === newAction.amount
      )
    case "cable":
    case "electricity":
      return existing.provider === newAction.provider && existing.amount === newAction.amount
    case "wallet_funding":
      return existing.amount === newAction.amount
    default:
      return false
  }
}
