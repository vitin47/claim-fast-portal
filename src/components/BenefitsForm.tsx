import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTimer } from '@/hooks/useTimer';

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
  const { formatTime, isExpired } = useTimer(15);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: ""
    }
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">US</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">U.S. Benefits Portal</h1>
                <p className="text-sm text-muted-foreground">Department of Public Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
          <div className="flex items-center space-x-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-0.5 ml-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
            <span className="text-sm text-muted-foreground ml-4">
              Step {currentStep} of 4
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Confirm your identity</h2>
            <div className="inline-flex items-center bg-emergency/10 text-emergency px-3 py-1 rounded-full text-sm font-medium mb-4">
              URGENT
            </div>
            <p className="text-muted-foreground mb-4">
              Enter your full name to check outstanding balances and eligible claims. 
              Your information stays 100% safe on this website.
            </p>
            <div className="flex items-center text-emergency text-sm font-medium">
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
                className="w-full h-12 text-base font-medium"
                disabled={isExpired}
              >
                {isExpired ? 'Time Expired' : 'Continue →'}
              </Button>
            </form>
          </Form>

          {isExpired && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm font-medium">
                ⚠️ Session expired. Please refresh the page to restart your application.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};