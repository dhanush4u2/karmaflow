import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings as SettingsIcon, Building, User, Bell, Shield } from "lucide-react"

export function Settings() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your industry profile and platform preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Industry Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Industry Profile
            </CardTitle>
            <CardDescription>
              Update your industry information and registration details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry-name">Industry Name</Label>
              <Input id="industry-name" value="Karnataka Steel Industries Ltd." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry-type">Industry Type</Label>
              <Input id="industry-type" value="Steel Manufacturing" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-id">Registration ID</Label>
              <Input id="registration-id" value="KSPCB/2020/12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value="Bangalore, Karnataka" />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Account
            </CardTitle>
            <CardDescription>
              Manage your personal account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" value="Rajesh Kumar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value="rajesh.kumar@ksteel.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value="Environment Manager" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value="+91 98765 43210" />
            </div>
            <Button>Update Account</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emissions Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when emissions exceed thresholds</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Market Updates</Label>
                <p className="text-sm text-muted-foreground">Receive carbon credit market price changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compliance Deadlines</Label>
                <p className="text-sm text-muted-foreground">Reminders for upcoming report submissions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Recommendations</Label>
                <p className="text-sm text-muted-foreground">Weekly insights and optimization suggestions</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your account security and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Change Password</Label>
              <Button variant="outline" className="w-full justify-start">
                Update Password
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                <Switch />
              </div>
            </div>
            <div className="space-y-2">
              <Label>API Access</Label>
              <Button variant="outline" className="w-full justify-start">
                Manage API Keys
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Session Management</Label>
              <Button variant="outline" className="w-full justify-start">
                View Active Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}