import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTimer } from '@/hooks/useTimer';
import usFlagImage from '@/assets/us-flag.png';
import paypalLogo from '@/assets/paypal-logo.png';

const formSchema = z.object({
  fullName: z.string()
    .trim()
    .nonempty({ message: "Full name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, { message: "Please enter a valid name" })
    .refine((name) => {
      const words = name.trim().split(/\s+/);
      return words.length >= 2 && words.every(word => word.length >= 2);
    }, { message: "Please enter your name correctly" })
});

type FormData = z.infer<typeof formSchema>;

export const BenefitsForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAmount, setShowAmount] = useState(false);
  const [videoScriptLoaded, setVideoScriptLoaded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'bank' | null>(null);
  const { formatTime, isExpired } = useTimer(15);

  // Load video script when reaching step 4
  useEffect(() => {
    if (currentStep === 4 && !videoScriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://scripts.converteai.net/7fa7ad44-7b14-4fcc-805a-1257ccc47e90/players/68d8a308d682a389eb6ed723/v4/player.js";
      script.async = true;
      script.onload = () => {
        // Create the video player after script loads
        const videoContainer = document.getElementById('video-container');
        if (videoContainer) {
          videoContainer.innerHTML = '<vturb-smartplayer id="vid-68d8a308d682a389eb6ed723" style="display: block; margin: 0 auto; width: 100%; height: 100%;"></vturb-smartplayer>';
        }
      };
      document.head.appendChild(script);
      setVideoScriptLoaded(true);
    }
  }, [currentStep, videoScriptLoaded]);
  
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
                <h1 className="text-xl font-medium text-foreground">U.S. Benefits Portal</h1>
                <p className="text-sm text-muted-foreground">Department of Public Services</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center space-x-6 text-sm text-muted-foreground mt-4">
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
      <div className="bg-emergency text-emergency-foreground py-2 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg md:text-base">⚡</span>
              <div className="text-sm md:text-base font-medium leading-tight">
                {currentStep === 4 ? 'Claim Expires Soon' : 'High volume detected - Complete your claim within 15 minutes to secure priority processing'}
              </div>
              {currentStep !== 4 && (
                <div className="bg-white text-emergency px-3 py-1 rounded font-mono text-sm ml-4">
                  {formatTime()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {currentStep !== 4 && (
        <div className="bg-muted/50 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center space-x-2 md:space-x-8 overflow-x-auto w-full">
                {[
                  { number: 1, label: 'Identity' },
                  { number: 2, label: 'Analysis' },
                  { number: 3, label: 'Estimate' },
                  { number: 4, label: 'Payout' }
                ].map((step) => (
                  <div key={step.number} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                        (step.number === 1 || step.number === 2 || (step.number === 3 && currentStep > 3)) && currentStep >= step.number
                          ? 'bg-emerald-600 text-white'
                          : currentStep === step.number 
                          ? 'bg-blue-600 text-white'
                          : currentStep > step.number
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {step.number}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 whitespace-nowrap">{step.label}</span>
                    </div>
                    {step.number < 4 && (
                      <div className={`w-8 md:w-16 h-0.5 ml-2 mr-2 md:ml-4 md:mr-4 ${
                        (step.number === 1 && currentStep >= 2) || (step.number === 2 && currentStep >= 3 && currentStep < 4) || (step.number === 2 && currentStep >= 4) || (step.number === 3 && currentStep >= 4)
                          ? (step.number === 2 && currentStep === 3) || (step.number === 3 && currentStep >= 4) ? 'bg-blue-600' : 'bg-emerald-600'
                          : currentStep > step.number ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentStep !== 4 ? (
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            {currentStep === 1 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-medium text-foreground mb-2 text-center">Confirm your identity</h2>
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center bg-emergency/10 text-emergency px-3 py-1 rounded-full text-sm font-medium">
                      URGENT
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 text-center">
                    Enter your full name to check outstanding balances and eligible claims. 
                    Your information stays 100% safe on this website.
                  </p>
                  <div className="flex items-center justify-center text-emergency text-sm font-normal">
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
                          <FormLabel className="text-base font-normal">
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
                      className="w-full h-12 text-base font-normal bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                      disabled={isExpired}
                    >
                      {isExpired ? 'Time Expired' : 'Continue →'}
                    </Button>
                  </form>
                </Form>

                {showSuccess && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-700 text-sm font-normal text-center">
                      ✅ Identity verification successful! Redirecting to analysis...
                    </p>
                  </div>
                )}

                {isExpired && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm font-normal">
                      ⚠️ Session expired. Please refresh the page to restart your application.
                    </p>
                  </div>
                )}
              </>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <h2 className="text-2xl font-medium text-foreground mb-2">Your estimated claim</h2>
                
                {!showLoading && !showAmount && (
                  <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-lg font-medium mb-4">
                    APPROVED
                  </div>
                )}
                
                {!showAmount && (
                  <p className="text-muted-foreground mb-8">
                    Based on your information, this is your current eligible amount.
                  </p>
                )}

                {showLoading && (
                  <div className="flex justify-center mb-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}

                {showAmount && !showLoading && (
                  <div className="space-y-6">
                    <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-lg font-medium mb-4">
                      APPROVED
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-6">
                      <div className="text-emerald-700 font-medium text-sm mb-2">LIMITED TIME</div>
                      <div className="text-4xl font-medium text-foreground mb-2">$2,324.00</div>
                      <div className="text-emerald-700 font-medium text-lg mb-4">APPROVED</div>
                      <div className="text-emerald-700 text-sm font-normal">
                        ⏰ Claim Expires: This amount is reserved for 15 minutes only
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Proceed to choose how you'd like to receive funds.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <Button 
                        className="w-full h-12 text-base font-normal bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setCurrentStep(3)}
                      >
                        Secure My Funds
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-12"
                        onClick={() => setCurrentStep(1)}
                      >
                        ← Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <h2 className="text-2xl font-medium text-foreground mb-2">Choose payout method</h2>
                <p className="text-muted-foreground mb-6">
                  Select how you'd like to receive your funds. Processing will begin immediately.
                </p>

                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-4 mb-6">
                  <div className="text-sm text-emerald-700 mb-1">Estimated claim for e. rt</div>
                  <div className="text-3xl font-medium text-foreground mb-2">$2,324.00</div>
                  <div className="bg-orange-100 border border-orange-300 rounded px-3 py-1 inline-block">
                    <span className="text-orange-600 font-medium text-sm">EXPIRES SOON</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <button 
                    className={`w-full p-4 border-2 rounded-lg hover:bg-primary/5 transition-colors text-left ${
                      selectedPaymentMethod === 'paypal' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={paypalLogo} alt="PayPal" className="w-8 h-8 object-contain" />
                        <div>
                          <div className="font-medium text-foreground">PayPal</div>
                          <div className="text-sm text-muted-foreground">Instant transfer</div>
                        </div>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                        INSTANT
                      </div>
                    </div>
                  </button>

                  <button 
                    className={`w-full p-4 border-2 rounded-lg hover:bg-accent transition-colors text-left ${
                      selectedPaymentMethod === 'bank' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => setSelectedPaymentMethod('bank')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white font-bold text-sm">🏦</div>
                        <div>
                          <div className="font-medium text-foreground">Bank Deposit</div>
                          <div className="text-sm text-muted-foreground">Direct to account</div>
                        </div>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                        INSTANT
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button 
                    className="w-full h-12 text-base font-normal bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                    onClick={() => setCurrentStep(4)}
                    disabled={!selectedPaymentMethod}
                  >
                    Continue to Claim Funds
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  {selectedPaymentMethod ? 'Ready to proceed' : 'Please select a payment method above'}
                </p>
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="w-full h-screen bg-black">
          <h2 className="text-2xl font-medium text-white pt-4 pb-2 text-center flex items-center justify-center px-4">
            <span className="mr-2">🚨</span>
            Watch this important message
          </h2>
          
          <div 
            id="video-container" 
            className="w-full" 
            style={{ height: 'calc(100vh - 80px)' }}
          >
            {!videoScriptLoaded && (
              <div className="flex items-center justify-center h-full text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};