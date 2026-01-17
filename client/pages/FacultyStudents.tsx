import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  department: string;
  semester: number;
  leaveBalance: {
    casual: { used: number; total: number };
    medical: { used: number; total: number };
  };
  totalRequests: number;
  approvedRequests: number;
}

export default function FacultyStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Raj Patel",
      registrationNumber: "REG2024001",
      email: "raj.patel@college.edu",
      department: "Computer Science",
      semester: 4,
      leaveBalance: {
        casual: { used: 4, total: 12 },
        medical: { used: 1, total: 5 },
      },
      totalRequests: 5,
      approvedRequests: 4,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      registrationNumber: "REG2024015",
      email: "sarah.johnson@college.edu",
      department: "Computer Science",
      semester: 4,
      leaveBalance: {
        casual: { used: 2, total: 12 },
        medical: { used: 0, total: 5 },
      },
      totalRequests: 2,
      approvedRequests: 2,
    },
    {
      id: "3",
      name: "Mike Chen",
      registrationNumber: "REG2024008",
      email: "mike.chen@college.edu",
      department: "Computer Science",
      semester: 4,
      leaveBalance: {
        casual: { used: 5, total: 12 },
        medical: { used: 2, total: 5 },
      },
      totalRequests: 8,
      approvedRequests: 7,
    },
    {
      id: "4",
      name: "Emily Davis",
      registrationNumber: "REG2024020",
      email: "emily.davis@college.edu",
      department: "Computer Science",
      semester: 4,
      leaveBalance: {
        casual: { used: 3, total: 12 },
        medical: { used: 1, total: 5 },
      },
      totalRequests: 4,
      approvedRequests: 4,
    },
    {
      id: "5",
      name: "John Wilson",
      registrationNumber: "REG2024010",
      email: "john.wilson@college.edu",
      department: "Computer Science",
      semester: 4,
      leaveBalance: {
        casual: { used: 6, total: 12 },
        medical: { used: 2, total: 5 },
      },
      totalRequests: 9,
      approvedRequests: 8,
    },
    {
      id: "6",
      name: "Priya Sharma",
      registrationNumber: "REG2024025",
      email: "priya.sharma@college.edu",
      department: "Computer Science",
      semester: 4,
      leaveBalance: {
        casual: { used: 1, total: 12 },
        medical: { used: 0, total: 5 },
      },
      totalRequests: 1,
      approvedRequests: 1,
    },
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Student Profiles
        </h1>
        <p className="text-muted-foreground">
          View and manage your class students
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, registration number, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Students</p>
            <p className="text-3xl font-bold text-primary">{students.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Avg Requests</p>
            <p className="text-3xl font-bold text-accent">
              {(
                students.reduce((sum, s) => sum + s.totalRequests, 0) /
                students.length
              ).toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-success">
              {(
                (students.reduce((sum, s) => sum + s.approvedRequests, 0) /
                  students.reduce((sum, s) => sum + s.totalRequests, 0)) *
                100
              ).toFixed(0)}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Results ({filteredStudents.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {student.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {student.registrationNumber}
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground break-all">
                      {student.email}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium text-foreground">
                        {student.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Semester</p>
                      <p className="text-sm font-medium text-foreground">
                        {student.semester}
                      </p>
                    </div>
                  </div>

                  {/* Leave Balance */}
                  <div className="pt-2 border-t border-border space-y-2">
                    <p className="text-xs font-semibold text-foreground">
                      Leave Balance
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Casual
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {student.leaveBalance.casual.total -
                            student.leaveBalance.casual.used}{" "}
                          / {student.leaveBalance.casual.total}
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{
                            width: `${
                              ((student.leaveBalance.casual.total -
                                student.leaveBalance.casual.used) /
                                student.leaveBalance.casual.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Medical
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {student.leaveBalance.medical.total -
                            student.leaveBalance.medical.used}{" "}
                          / {student.leaveBalance.medical.total}
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full"
                          style={{
                            width: `${
                              ((student.leaveBalance.medical.total -
                                student.leaveBalance.medical.used) /
                                student.leaveBalance.medical.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Requests
                      </span>
                      <span className="font-semibold text-foreground">
                        {student.totalRequests}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Approved</span>
                      <span className="font-semibold text-success">
                        {student.approvedRequests}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
