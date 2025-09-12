import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Report {
  id: string
  name: string
  type: string
  period: string
  status: "completed" | "pending" | "overdue"
  generatedDate: string
  submittedTo: string
  fileSize?: string
}

const reports: Report[] = [
  {
    id: "1",
    name: "Monthly Emissions Report",
    type: "Compliance",
    period: "November 2024",
    status: "completed",
    generatedDate: "2024-12-01",
    submittedTo: "KSPCB",
    fileSize: "2.4 MB"
  },
  {
    id: "2",
    name: "Annual Carbon Footprint",
    type: "Sustainability",
    period: "2024",
    status: "pending",
    generatedDate: "2024-12-10",
    submittedTo: "Ministry of Environment",
    fileSize: "5.1 MB"
  },
  {
    id: "3",
    name: "Quarterly Compliance Check",
    type: "Regulatory",
    period: "Q4 2024",
    status: "overdue",
    generatedDate: "",
    submittedTo: "KSPCB"
  }
]

function StatusIcon({ status }: { status: Report["status"] }) {
  if (status === "completed") return <CheckCircle className="h-4 w-4 text-success" />
  if (status === "pending") return <Clock className="h-4 w-4 text-warning" />
  return <AlertTriangle className="h-4 w-4 text-destructive" />
}

function StatusBadge({ status }: { status: Report["status"] }) {
  const variants = {
    completed: "bg-success-light text-success border-success",
    pending: "bg-warning-light text-warning border-warning",
    overdue: "bg-destructive/10 text-destructive border-destructive"
  }
  
  return (
    <Badge variant="outline" className={variants[status]}>
      {status}
    </Badge>
  )
}

export function Reporting() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance & Reporting</h1>
          <p className="text-muted-foreground">
            Generate and manage regulatory compliance reports
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Report Generation */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Quick Report Generation
          </CardTitle>
          <CardDescription>
            Generate compliance reports with custom parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">Monthly Emissions</div>
                <div className="text-xs text-muted-foreground">KSPCB compliance</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">Annual Footprint</div>
                <div className="text-xs text-muted-foreground">Sustainability report</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">Custom Report</div>
                <div className="text-xs text-muted-foreground">Choose parameters</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reports This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-1">Generated & submitted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">98%</div>
            <p className="text-xs text-muted-foreground mt-1">All requirements met</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">1</div>
            <p className="text-xs text-muted-foreground mt-1">Due this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Auto-Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">87%</div>
            <p className="text-xs text-muted-foreground mt-1">Of total reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Report History
          </CardTitle>
          <CardDescription>
            View and download past compliance reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                <div className="flex items-center space-x-4">
                  <StatusIcon status={report.status} />
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{report.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.period}</span>
                      <span>•</span>
                      <span>Submitted to {report.submittedTo}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {report.generatedDate && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Generated</div>
                      <div className="font-medium text-foreground">{report.generatedDate}</div>
                    </div>
                  )}
                  
                  {report.fileSize && (
                    <div className="text-sm text-muted-foreground">
                      {report.fileSize}
                    </div>
                  )}
                  
                  <StatusBadge status={report.status} />
                  
                  {report.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}