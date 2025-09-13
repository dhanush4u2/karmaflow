// Path: src/pages/Reporting.tsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, CheckCircle, AlertTriangle, Loader2, Brain, BarChart, FileJson, Quote } from "lucide-react";
import { useReportSummary } from "@/hooks/useReportSummary";
import { useUserWallet } from "@/hooks/useUserWallet";
import { useUserMetrics } from "@/hooks/useUserMetrics";
import { useTransactions } from "@/hooks/useTransactions";
import { generatePdfReport } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingSummary } from "@/hooks/useOnboardingSummary"; // 1. Import our new hook

// A small helper component to render the summary data points cleanly
const DataPoint = ({ label, value, unit }) => (
    <div className="flex justify-between text-sm py-2 border-b border-border/50">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value} {unit}</span>
    </div>
);

export function Reporting() {
  const { summary, loading: summaryLoading } = useReportSummary();
  const { profile, loading: profileLoading } = useUserWallet();
  const { metrics, loading: metricsLoading } = useUserMetrics();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { summary: onboardingSummary, loading: onboardingLoading } = useOnboardingSummary(); // 2. Call the new hook
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!profile || !metrics || !transactions) {
      toast({
        title: "Data Not Ready",
        description: "Please wait until all data has loaded before generating a report.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      generatePdfReport({ profile, metrics, transactions });
      toast({
        title: "Report Generated",
        description: "Your PDF report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const anyDataLoading = profileLoading || metricsLoading || transactionsLoading;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance & Reporting</h1>
          <p className="text-muted-foreground">
            Generate and manage comprehensive compliance reports.
          </p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating || anyDataLoading}>
          {isGenerating ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
          ) : (
            <><Download className="h-4 w-4 mr-2" />Generate & Download Report</>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* ... your existing summary cards for Transactions, Compliance Score, etc. ... */}
        {/* This part remains unchanged */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Transactions (Month)</CardTitle></CardHeader>
          <CardContent>
            {summaryLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold text-foreground">{summary?.reportsThisMonth ?? 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Total buy & sell trades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle></CardHeader>
          <CardContent>
            {summaryLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold text-success">{summary?.complianceScore ?? 0}%</div>}
            <p className="text-xs text-muted-foreground mt-1">Based on emission targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle></CardHeader>
          <CardContent>
            {summaryLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold text-warning">{summary?.pendingReports ?? 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Items requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Automation Rate</CardTitle></CardHeader>
          <CardContent>
            {summaryLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold text-primary">{summary?.autoGeneratedPercent ?? 0}%</div>}
            <p className="text-xs text-muted-foreground mt-1">Of data points & reports</p>
          </CardContent>
        </Card>
      </div>
      
      {/* --- NEW SECTION: Initial AI Assessment Summary --- */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Initial AI Assessment Summary
            </CardTitle>
            <CardDescription>
                This is a summary of the data you provided during onboarding and the initial analysis performed by our AI.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {onboardingLoading ? (
                <div className="grid md:grid-cols-2 gap-8">
                    <div><Skeleton className="h-4 w-48 mb-4" /><Skeleton className="h-24 w-full" /></div>
                    <div><Skeleton className="h-4 w-48 mb-4" /><Skeleton className="h-24 w-full" /></div>
                </div>
            ) : onboardingSummary ? (
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Column 1: Data Submitted by User */}
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><FileJson className="h-4 w-4 text-muted-foreground" />Your Submitted Data</h3>
                        <div className="space-y-1">
                            <DataPoint label="Electricity Usage" value={onboardingSummary.submission_data.electricityKwh} unit="kWh" />
                            <DataPoint label="Fuel Consumption" value={onboardingSummary.submission_data.fuelLiters} unit="Liters" />
                            <DataPoint label="Water Usage" value={onboardingSummary.submission_data.waterLiters} unit="Liters" />
                            <DataPoint label="Solid Waste" value={onboardingSummary.submission_data.wasteKg} unit="kg" />
                            <DataPoint label="Raw Materials" value={onboardingSummary.submission_data.rawMaterialTons} unit="Tons" />
                            <DataPoint label="Logistics Travel" value={onboardingSummary.submission_data.transportKm} unit="km" />
                        </div>
                    </div>
                    {/* Column 2: AI Analysis Results */}
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><BarChart className="h-4 w-4 text-muted-foreground" />AI Analysis Results</h3>
                        <div className="space-y-1">
                            <DataPoint label="Est. Monthly Emissions" value={onboardingSummary.ai_estimated_emissions} unit="tCO₂e" />
                            <DataPoint label="Initial Credit Allocation" value={onboardingSummary.ai_allocated_credits} unit="Credits" />
                        </div>
                        <div className="mt-6 bg-accent/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><Quote className="h-4 w-4 text-primary"/>AI Reasoning</h4>
                            <p className="text-sm text-muted-foreground italic">"{onboardingSummary.ai_reasoning}"</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No onboarding assessment data found.</p>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Report History Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Report Generation
          </CardTitle>
          <CardDescription>
            Click the "Generate & Download Report" button above to create a live, up-to-date PDF summary of all your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-muted/40 rounded-lg">
            <p className="text-muted-foreground">
              {anyDataLoading ? "Loading data for report..." : "Your report is ready to be generated."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}