import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, Settings, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats] = useState({
    totalUsers: 385,
    students: 320,
    faculty: 45,
    admins: 5,
    totalRequests: 1240,
    pendingRequests: 23,
    approvalRate: 92.5,
    monthlyTrend: [
      { month: "Jan", value: 85 },
      { month: "Feb", value: 120 },
      { month: "Mar", value: 98 },
    ],
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          System overview and management tools
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Users</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total Requests
                </p>
                <p className="text-3xl font-bold text-accent">
                  {stats.totalRequests}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-accent opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Pending Review
                </p>
                <p className="text-3xl font-bold text-warning">
                  {stats.pendingRequests}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Approval Rate
                </p>
                <p className="text-3xl font-bold text-success">
                  {stats.approvalRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">User Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="text-sm font-medium text-foreground">
                      {stats.students}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(stats.students / stats.totalUsers) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Faculty</span>
                    <span className="text-sm font-medium text-foreground">
                      {stats.faculty}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{
                        width: `${(stats.faculty / stats.totalUsers) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Admins</span>
                    <span className="text-sm font-medium text-foreground">
                      {stats.admins}
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-destructive h-2 rounded-full"
                      style={{
                        width: `${(stats.admins / stats.totalUsers) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card md:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Monthly Requests</h3>
              <div className="flex items-end gap-2 h-40">
                {stats.monthlyTrend.map((item, idx) => {
                  const maxValue = Math.max(...stats.monthlyTrend.map(v => v.value));
                  const percentage = (item.value / maxValue) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${percentage}%` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users">
            <Button className="w-full h-12 bg-primary hover:bg-primary-600 text-white">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button
              variant="outline"
              className="w-full h-12"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button
              variant="outline"
              className="w-full h-12"
            >
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Important Info */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">System Status</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ All systems operational</li>
            <li>✓ Database backup completed today</li>
            <li>✓ No pending alerts or issues</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
