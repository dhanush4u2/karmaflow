import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Leaf, Zap, Fuel, Droplets, Trash2, Package, Truck, ArrowRight, ArrowLeft, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Reusable input component for consistency
function OnboardingInput({ id, label, icon: Icon, unit, ...props }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </Label>
      <div className="flex items-center">
        <Input id={id} className="rounded-r-none" {...props} />
        <span className="flex h-10 items-center rounded-md rounded-l-none border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}

export function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    electricityUsageKwh: '',
    fuelConsumptionLiters: '',
    waterUsageKl: '',
    wasteGeneratedTons: '',
    rawMaterialsDetails: '',
    employeeTravelKm: '',
    productionOutputDetails: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-initial-credits', {
        body: { 
            userId: user.id,
            industryName: (user.user_metadata as any)?.industry_name || 'N/A',
            ...Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value ? Number(value) : 0])),
            rawMaterialsDetails: formData.rawMaterialsDetails,
            productionOutputDetails: formData.productionOutputDetails
        },
      });

      if (error) throw error;

      toast({
        title: "Onboarding Complete!",
        description: `Congratulations! You've been credited with ${data.initialCredits} carbon credits.`,
      });

      // A small delay to allow the user to read the toast before redirecting.
      setTimeout(() => navigate('/'), 1000);

    } catch (err: any) {
      console.error("Onboarding submission error:", err);
      toast({
        title: "Submission Failed",
        description: err.message || "Could not process your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const totalSteps = 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
            <Leaf className="mx-auto h-10 w-10 text-primary mb-3"/>
            <h1 className="text-3xl font-bold text-foreground">Welcome to CarbonFlow</h1>
            <p className="text-muted-foreground">Let's set up your emissions profile in 3 quick steps.</p>
        </div>
        
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <Progress value={(step / totalSteps) * 100} className="w-full" />
            <CardDescription className="pt-4 text-center">Step {step} of {totalSteps}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="min-h-[300px]">
              {/* Step 1: Energy & Fuel */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in-50">
                    <h2 className="text-xl font-semibold text-center">Energy & Fuel Consumption</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <OnboardingInput id="electricity" label="Electricity Usage" icon={Zap} unit="kWh / month" type="number" placeholder="e.g., 10000" value={formData.electricityUsageKwh} onChange={(e: any) => handleInputChange('electricityUsageKwh', e.target.value)} />
                        <OnboardingInput id="fuel" label="Fuel Consumption" icon={Fuel} unit="Liters / month" type="number" placeholder="e.g., 500" value={formData.fuelConsumptionLiters} onChange={(e: any) => handleInputChange('fuelConsumptionLiters', e.target.value)} />
                    </div>
                </div>
              )}
              {/* Step 2: Resources, Waste & Materials */}
              {step === 2 && (
                 <div className="space-y-6 animate-in fade-in-50">
                    <h2 className="text-xl font-semibold text-center">Resources, Waste & Materials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <OnboardingInput id="water" label="Water Usage" icon={Droplets} unit="kL / month" type="number" placeholder="e.g., 250" value={formData.waterUsageKl} onChange={(e: any) => handleInputChange('waterUsageKl', e.target.value)} />
                        <OnboardingInput id="waste" label="Solid Waste Generated" icon={Trash2} unit="Tons / month" type="number" placeholder="e.g., 15" value={formData.wasteGeneratedTons} onChange={(e: any) => handleInputChange('wasteGeneratedTons', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rawMaterials" className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4" /> Key Raw Materials</Label>
                        <Textarea id="rawMaterials" placeholder="List materials and approx. monthly tonnage (e.g., Steel: 50 tons, Cement: 100 tons)..." value={formData.rawMaterialsDetails} onChange={(e) => handleInputChange('rawMaterialsDetails', e.target.value)} />
                    </div>
                 </div>
              )}
              {/* Step 3: Logistics & Production */}
              {step === 3 && (
                 <div className="space-y-6 animate-in fade-in-50">
                    <h2 className="text-xl font-semibold text-center">Logistics & Production</h2>
                    <OnboardingInput id="travel" label="Employee Travel & Logistics" icon={Truck} unit="km / month" type="number" placeholder="e.g., 20000" value={formData.employeeTravelKm} onChange={(e: any) => handleInputChange('employeeTravelKm', e.target.value)} />
                    <div className="space-y-2">
                        <Label htmlFor="production" className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4" /> Primary Production Output (Optional)</Label>
                        <Textarea id="production" placeholder="Describe your main monthly output (e.g., 500 tons of finished steel products)..." value={formData.productionOutputDetails} onChange={(e) => handleInputChange('productionOutputDetails', e.target.value)} />
                    </div>
                    <div className="p-3 bg-accent/50 rounded-md text-sm text-accent-foreground flex items-start gap-3">
                        <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p>This data will be analyzed by our AI to calculate your initial carbon credits. This is a one-time setup.</p>
                    </div>
                 </div>
              )}
            </CardContent>
            <CardFooter className="justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1 || loading}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              {step < totalSteps ? (
                <Button type="button" onClick={() => setStep(s => s + 1)}>
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : "Finish & Calculate Credits"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
