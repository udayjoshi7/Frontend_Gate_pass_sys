import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    collegeeName: "XYZ College",
    academicYear: "2024-2025",
    casualLeaveDays: 12,
    medicalLeaveDays: 5,
    emergencyLeaveDays: 3,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences
        </p>
      </div>

      {/* General Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              College Name
            </label>
            <Input
              type="text"
              name="collegeeName"
              value={settings.collegeeName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Academic Year
            </label>
            <Input
              type="text"
              name="academicYear"
              value={settings.academicYear}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Leave Configuration */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Leave Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Casual Leave Days per Year
            </label>
            <Input
              type="number"
              name="casualLeaveDays"
              value={settings.casualLeaveDays}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum casual leave days students can apply for
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Medical Leave Days per Year
            </label>
            <Input
              type="number"
              name="medicalLeaveDays"
              value={settings.medicalLeaveDays}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Emergency Leave Days per Year
            </label>
            <Input
              type="number"
              name="emergencyLeaveDays"
              value={settings.emergencyLeaveDays}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Options */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>System Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Maintenance Mode
              </label>
              <p className="text-xs text-muted-foreground">
                Put the system in maintenance mode to prevent logins
              </p>
            </div>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-600 text-white gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
        {saved && (
          <div className="flex items-center text-success text-sm font-medium">
            ✓ Settings saved successfully
          </div>
        )}
      </div>

      {/* Information */}
      <Card className="bg-primary-50 border-primary-100">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">
            System Information
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>System Version: 1.0.0</li>
            <li>Last Backup: Today at 2:00 AM</li>
            <li>Database Size: 245 MB</li>
            <li>Active Sessions: 24</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
