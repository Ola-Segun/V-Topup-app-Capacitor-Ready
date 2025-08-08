'use client'

import { UserSettings } from '@/components/settings+/user-settings'

export default function SettingsPage() {
  // In a real app, get user data from auth context
  const userId = 'user_123'
  const userEmail = 'john.doe@example.com'
  const userName = 'John Doe'

  return (
    // <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    //   <div className="container mx-auto px-4 py-8">
    //     <div className="max-w-4xl mx-auto">
    //       <div className="mb-6">
    //         <h1 className="text-2xl font-bold mb-2">Settings</h1>
    //         <p className="text-muted-foreground">Manage your account settings and preferences</p>
    //       </div>
          
    //       <UserSettings 
    //         userId={userId}
    //         userEmail={userEmail}
    //         userName={userName}
    //       />
    //     </div>
    //   </div>
    // </div>

    <div>
                <UserSettings 
            userId={userId}
            userEmail={userEmail}
            userName={userName}
          />
    </div>
  )
}
