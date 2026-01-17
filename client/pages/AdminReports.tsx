import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Download } from "lucide-react";

interface ReportData {
  month: string;
  requests: number;
  approved: number;
  rejected: number;
  pending: number;
}

export default function AdminReports() {
  const [reportData] = useState<ReportData[]>([
    { month: "January", requests: 85, approved: 78, rejected: 5, pending: 2 },
    { month: "February", requests: 120, approved: 110, rejected: 8, pending: 2 },
    { month: "March", requests: 98, approved: 92, rejected: 4, pending: 2 },
    { month: "April", requests: 145, approved: 135, rejected: 8, pending: 2 },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          System Reports
        </h1>
        <p className="text-muted-foreground">
          View analytics and generate reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Requests</p>
            <p className="text-3xl font-bold text-primary">448</p>
            <p className="text-xs text-muted-foreground mt-2">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Approved</p>
            <p className="text-3xl font-bold text-success">415</p>
            <p className="text-xs text-muted-foreground mt-2">92.6% approval rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Rejected</p>
            <p className="text-3xl font-bold text-destructive">25</p>
            <p className="text-xs text-muted-foreground mt-2">5.6% rejection rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Average Days</p>
            <p className="text-3xl font-bold text-accent">2.3</p>
            <p className="text-xs text-muted-foreground mt-2">Response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Month
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Total Requests
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Approved
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Rejected
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Pending
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((data, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-primary-50/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {data.month}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-primary">
                      {data.requests}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-success">
                      {data.approved}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-destructive">
                      {data.rejected}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-warning">
                      {data.pending}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Department Stats */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Computer Science", requests: 145, approval: 94 },
              { name: "Electrical Engineering", requests: 98, approval: 91 },
              { name: "Mechanical Engineering", requests: 102, approval: 88 },
              { name: "Civil Engineering", requests: 103, approval: 92 },
            ].map((dept, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {dept.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {dept.requests} requests • {dept.approval}% approved
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${dept.approval}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary-600 text-white gap-2">
          <Download className="w-4 h-4" />
          Export as PDF
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export as CSV
        </Button>
      </div>
    </div>
  );
}
