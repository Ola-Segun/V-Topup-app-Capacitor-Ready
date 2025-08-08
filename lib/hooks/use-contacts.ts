import { useState, useEffect } from 'react'
import { contactService, PhoneContact } from '@/lib/services/contact-service'
import { Database } from '@/lib/supabase/database.types'

type Contact = Database['public']['Tables']['contacts']['Row']

export function useContacts(userId?: string) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    if (userId) {
      loadContacts()
    }
  }, [userId])

  const loadContacts = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const userContacts = await contactService.getUserContacts(userId)
      setContacts(userContacts)
    } catch (error) {
      console.error('Failed to load contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const requestContactPermission = async () => {
    setIsLoading(true)
    try {
      const permission = await contactService.requestContactPermission()
      setHasPermission(permission)
      return permission
    } finally {
      setIsLoading(false)
    }
  }

  const loadPhoneContacts = async () => {
    setIsLoading(true)
    try {
      const contacts = await contactService.getPhoneContacts()
      setPhoneContacts(contacts)
      return contacts
    } catch (error) {
      console.error('Failed to load phone contacts:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const syncContacts = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      await contactService.syncPhoneContacts(userId)
      await loadContacts()
    } catch (error) {
      console.error('Failed to sync contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addContact = async (name: string, phone: string, email?: string) => {
    if (!userId) return null

    try {
      const contact = await contactService.saveContact(userId, {
        name,
        phone: contactService.formatPhoneNumber(phone),
        email: email || null,
        favorite: false
      })
      setContacts(prev => [...prev, contact])
      return contact
    } catch (error) {
      console.error('Failed to add contact:', error)
      return null
    }
  }

  const toggleFavorite = async (contactId: string) => {
    try {
      const updatedContact = await contactService.toggleFavorite(contactId)
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId ? updatedContact : contact
        )
      )
      return updatedContact
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      return null
    }
  }

  const deleteContact = async (contactId: string) => {
    try {
      await contactService.deleteContact(contactId)
      setContacts(prev => prev.filter(contact => contact.id !== contactId))
      return true
    } catch (error) {
      console.error('Failed to delete contact:', error)
      return false
    }
  }

  const searchContacts = async (query: string) => {
    if (!userId) return []

    try {
      const results = await contactService.searchContacts(userId, query)
      return results
    } catch (error) {
      console.error('Failed to search contacts:', error)
      return []
    }
  }

  return {
    contacts,
    phoneContacts,
    isLoading,
    hasPermission,
    requestContactPermission,
    loadPhoneContacts,
    syncContacts,
    addContact,
    toggleFavorite,
    deleteContact,
    searchContacts,
    refreshContacts: loadContacts
  }
}
