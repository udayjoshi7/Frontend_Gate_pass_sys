import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Html5QrcodeScanner } from "html5-qrcode";
import { dbService, LeaveRequest } from "@/lib/db";
import { CheckCircle, XCircle, Search, LogOut } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function SecurityDashboard() {
    const { user, logout } = useAuth();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean;
        message: string;
        request?: LeaveRequest;
    } | null>(null);
    const [manualToken, setManualToken] = useState("");
    const [scanActive, setScanActive] = useState(false);

    useEffect(() => {
        if (scanActive) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    setScanResult(decodedText);
                    handleVerify(decodedText);
                    scanner.clear();
                    setScanActive(false);
                },
                (error) => {
                    // ignore scan errors
                }
            );

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            };
        }
    }, [scanActive]);

    const handleVerify = async (token: string) => {
        const result = await dbService.scanQRCode(token);
        setVerificationResult(result);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const clearResult = () => {
        setScanResult(null);
        setVerificationResult(null);
        setManualToken("");
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Security Post</h1>
                        <p className="text-muted-foreground">Verify Student Leave Passes</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Officer: {user?.name}</span>
                        <Button variant="outline" size="sm" onClick={logout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Scanner Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Scan QR Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!scanActive ? (
                                <div className="text-center space-y-4">
                                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                                        <p className="text-muted-foreground">Camera inactive</p>
                                    </div>
                                    <Button onClick={() => setScanActive(true)} className="w-full">
                                        Activate Scanner
                                    </Button>
                                </div>
                            ) : (
                                <div id="reader" className="w-full"></div>
                            )}

                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Or enter code manually
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Input
                                        placeholder="Enter QR Token..."
                                        value={manualToken}
                                        onChange={(e) => setManualToken(e.target.value)}
                                    />
                                    <Button onClick={() => handleVerify(manualToken)}>
                                        <Search className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Result Section */}
                    <Card className={verificationResult ? (verificationResult.success ? "border-green-500" : "border-red-500") : ""}>
                        <CardHeader>
                            <CardTitle>Verification Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {verificationResult ? (
                                <div className="space-y-6">
                                    <div className={`p-4 rounded-lg flex items-center gap-4 ${verificationResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {verificationResult.success ? (
                                            <CheckCircle className="w-8 h-8" />
                                        ) : (
                                            <XCircle className="w-8 h-8" />
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg">{verificationResult.message}</h3>
                                            <p className="text-sm opacity-90">
                                                {verificationResult.success ? "Student is authorized to leave." : "Do not allow exit."}
                                            </p>
                                        </div>
                                    </div>

                                    {verificationResult.request && (
                                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <span className="text-muted-foreground">Student Name:</span>
                                                <span className="font-medium text-right">{verificationResult.request.studentName}</span>

                                                <span className="text-muted-foreground">Reg Number:</span>
                                                <span className="font-medium text-right">{verificationResult.request.registrationNumber}</span>

                                                <span className="text-muted-foreground">Leave Type:</span>
                                                <span className="font-medium text-right capitalize">{verificationResult.request.type}</span>

                                                <span className="text-muted-foreground">Period:</span>
                                                <span className="font-medium text-right">{verificationResult.request.startDate} - {verificationResult.request.endDate}</span>
                                            </div>

                                            <div className="pt-2 border-t mt-2">
                                                <span className="text-xs text-muted-foreground block mb-1">Pass Expiry:</span>
                                                <span className="font-mono text-xs">
                                                    {new Date(verificationResult.request.qrCodeExpiresAt!).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <Button variant="outline" className="w-full" onClick={clearResult}>
                                        Scan Next
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
                                    <Search className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Scan a QR code to see details here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
