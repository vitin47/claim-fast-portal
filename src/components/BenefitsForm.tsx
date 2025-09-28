import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTimer } from '@/hooks/useTimer';
import usFlagImage from '@/assets/us-flag.png';

const formSchema = z.object({
  fullName: z.string()
    .trim()
    .nonempty({ message: "Full name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s\-'\.]+$/, { message: "Please enter a valid name" })
});

type FormData = z.infer<typeof formSchema>;

export const BenefitsForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAmount, setShowAmount] = useState(false);
  const { formatTime, isExpired } = useTimer(15);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: ""
    }
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setShowSuccess(true);
    
    setTimeout(() => {
      setCurrentStep(2);
      setShowSuccess(false);
      setShowLoading(true);
      
      setTimeout(() => {
        setShowLoading(false);
        setShowAmount(true);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <img 
                src={usFlagImage} 
                alt="US Flag" 
                className="w-16 h-12 object-cover rounded-md border border-border"
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-foreground">U.S. Benefits Portal</h1>
                <p className="text-sm text-muted-foreground">Department of Public Services</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mt-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Secure
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Private
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Accessible
            </span>
          </div>
        </div>
      </header>

      {/* Emergency Banner */}
      <div className="bg-emergency text-emergency-foreground py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚡</span>
            <span className="font-semibold">
              High volume detected - Complete your claim within 15 minutes to secure priority processing
            </span>
          </div>
          <div className="bg-background/20 px-3 py-1 rounded font-mono text-sm">
            {formatTime()}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-8">
              {[
                { number: 1, label: 'Identity' },
                { number: 2, label: 'Analysis' },
                { number: 3, label: 'Estimate' },
                { number: 4, label: 'Payout' }
              ].map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {step.number}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{step.label}</span>
                  </div>
                  {step.number < 4 && (
                    <div className={`w-16 h-0.5 ml-4 mr-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          {currentStep === 1 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Confirm your identity</h2>
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center bg-emergency/10 text-emergency px-3 py-1 rounded-full text-sm font-medium">
                    URGENT
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 text-center">
                  Enter your full name to check outstanding balances and eligible claims. 
                  Your information stays 100% safe on this website.
                </p>
                <div className="flex items-center justify-center text-emergency text-sm font-medium">
                  <span className="mr-2">⏰</span>
                  Time-sensitive claim detected for your area
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full legal name"
                            className="h-12 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                    disabled={isExpired}
                  >
                    {isExpired ? 'Time Expired' : 'Continue →'}
                  </Button>
                </form>
              </Form>

              {showSuccess && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-emerald-700 text-sm font-medium text-center">
                    ✅ Identity verification successful! Redirecting to analysis...
                  </p>
                </div>
              )}

              {isExpired && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm font-medium">
                    ⚠️ Session expired. Please refresh the page to restart your application.
                  </p>
                </div>
              )}
            </>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Your estimated claim</h2>
              <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-lg font-bold mb-4">
                APPROVED
              </div>
              <p className="text-muted-foreground mb-8">
                Based on your information, this is your current eligible amount.
              </p>

              {showLoading && (
                <div className="flex justify-center mb-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}

              {showAmount && (
                <div className="space-y-6">
                  <div className="bg-emergency/10 border-2 border-emergency rounded-lg p-6">
                    <div className="text-emergency font-bold text-sm mb-2">LIMITED TIME</div>
                    <div className="text-4xl font-bold text-foreground mb-2">$2,324.00</div>
                    <div className="text-emerald-700 font-bold text-lg mb-4">APPROVED</div>
                    <div className="text-emergency text-sm font-medium">
                      ⏰ Claim Expires: This amount is reserved for 15 minutes only
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Proceed to choose how you'd like to receive funds.
                  </p>
                  <Button className="w-full h-12 text-base font-medium bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                    Continue to Payout Options →
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};