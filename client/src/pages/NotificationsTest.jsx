import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NotificationsTest() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Notifications</h1>

      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3 flex-1">
              <span className="material-symbols-outlined text-xl">mail</span>
              <div>
                <Label htmlFor="email-notif" className="text-sm font-medium">Notifications par e-mail</Label>
                <p className="text-xs text-gray-600 mt-1">Résumé hebdomadaire des dépenses et tâches</p>
              </div>
            </div>
            <Switch
              id="email-notif"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3 flex-1">
              <span className="material-symbols-outlined text-xl">notifications_active</span>
              <div>
                <Label htmlFor="push-notif" className="text-sm font-medium">Notifications Push</Label>
                <p className="text-xs text-gray-600 mt-1">Alertes immédiates pour nouvelles tâches et messages</p>
              </div>
            </div>
            <Switch
              id="push-notif"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm"><strong>Email notifications:</strong> {String(emailNotifications)}</p>
        <p className="text-sm"><strong>Push notifications:</strong> {String(pushNotifications)}</p>
      </div>
    </div>
  )
}
