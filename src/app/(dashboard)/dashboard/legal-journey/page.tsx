'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Calendar,
  MapPin,
  Users,
  Lightbulb,
  Target,
  ArrowRight,
  BookOpen,
  Phone
} from 'lucide-react';
import { GenerateLegalGuidanceOutput } from '@/ai/flows/generate-legal-guidance';
import { getLatestCaseAssessment } from '@/lib/firestoreService';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function LegalJourneyPage() {
  const [guidance, setGuidance] = useState<GenerateLegalGuidanceOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadGuidance = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const assessment = await getLatestCaseAssessment();
        
        if (!assessment) {
          toast({
            title: 'No Case Found',
            description: 'Please submit a dispute first to get legal guidance.',
            variant: 'destructive'
          });
          return;
        }

        const response = await fetch('/api/generate-legal-guidance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caseClassification: assessment.caseClassification,
            suggestedForm: 'Generated Legal Form', // This would come from the form generation
            province: (assessment as any).province || 'Ontario',
            userLocation: (assessment as any).userLocation,
            recommendedCourt: assessment.recommendedCourt,
            meritScore: assessment.meritScore,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate legal guidance');
        }

        const guidanceOutput = await response.json();

        setGuidance(guidanceOutput);
        
        // Load saved progress from localStorage
        const savedProgress = localStorage.getItem(`legal-journey-${user.uid}`);
        if (savedProgress) {
          const { completedSteps: saved, currentStep: savedStep } = JSON.parse(savedProgress);
          setCompletedSteps(new Set(saved));
          setCurrentStep(savedStep);
        }

      } catch (error) {
        console.error('Error loading legal guidance:', error);
        toast({
          title: 'Error Loading Guidance',
          description: 'Unable to load your legal guidance. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadGuidance();
  }, [user, toast]);

  const markStepCompleted = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepNumber);
    setCompletedSteps(newCompleted);
    
    // Auto-advance to next step
    if (stepNumber === currentStep && stepNumber < (guidance?.totalSteps || 0) - 1) {
      setCurrentStep(stepNumber + 1);
    }

    // Save progress
    if (user) {
      localStorage.setItem(`legal-journey-${user.uid}`, JSON.stringify({
        completedSteps: Array.from(newCompleted),
        currentStep: stepNumber === currentStep ? stepNumber + 1 : currentStep
      }));
    }

    toast({
      title: 'Step Completed!',
      description: `You've successfully completed step ${stepNumber + 1}. Keep going!`,
    });
  };

  const getStepIcon = (step: any, index: number) => {
    if (completedSteps.has(index)) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (step.importance === 'critical') return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (step.importance === 'important') return <Clock className="h-5 w-5 text-amber-600" />;
    return <FileText className="h-5 w-5 text-blue-600" />;
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'destructive';
      case 'important': return 'default';
      case 'recommended': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!guidance) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Unable to Load Guidance</AlertTitle>
        <AlertDescription>
          We couldn't generate your legal guidance. Please try refreshing the page or submit a new dispute.
        </AlertDescription>
      </Alert>
    );
  }

  const progressPercentage = (completedSteps.size / guidance.totalSteps) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Scale className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Your Pocket Lawyer</h1>
          <p className="text-muted-foreground">
            Complete step-by-step guidance for your legal journey
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Journey Progress
            </CardTitle>
            <Badge variant="outline">
              {completedSteps.size} of {guidance.totalSteps} completed
            </Badge>
          </div>
          <CardDescription>
            Estimated timeframe: {guidance.estimatedTimeframe}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="text-sm text-muted-foreground">
            {progressPercentage.toFixed(0)}% complete • Step {currentStep + 1} of {guidance.totalSteps}
          </div>
        </CardContent>
      </Card>

      {/* Critical Deadlines */}
      {guidance.keyDeadlines.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Calendar className="h-5 w-5" />
              Critical Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guidance.keyDeadlines.map((deadline, index) => (
              <Alert key={index} className="border-amber-200">
                <Clock className="h-4 w-4" />
                <AlertTitle>{deadline.deadline}</AlertTitle>
                <AlertDescription>
                  <strong>When:</strong> {deadline.timeframe}<br />
                  <strong>If missed:</strong> {deadline.consequences}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step-by-Step Guidance */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Your Legal Action Plan</h2>
        
        {guidance.guidanceSteps.map((step, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-200 ${
              index === currentStep 
                ? 'border-primary shadow-md' 
                : completedSteps.has(index)
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-border'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStepIcon(step, index)}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Step {step.stepNumber}: {step.stepTitle}
                      <Badge variant={getImportanceColor(step.importance)}>
                        {step.importance}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      {step.timeframe}
                    </CardDescription>
                  </div>
                </div>
                {!completedSteps.has(index) && (
                  <Button 
                    onClick={() => markStepCompleted(index)}
                    size="sm"
                    variant={index === currentStep ? "default" : "outline"}
                  >
                    Mark Complete
                  </Button>
                )}
                {completedSteps.has(index) && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{step.description}</p>
              
              {step.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    Documents Needed
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {step.documents.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {step.tips.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    Pro Tips
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {step.warningFlags.length > 0 && (
                <Alert className="border-amber-200 bg-amber-50/50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="space-y-1 mt-2">
                      {step.warningFlags.map((warning, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-amber-600 rounded-full mt-2" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-2 border-t">
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-1">
                  <ArrowRight className="h-4 w-4" />
                  What Happens Next
                </h4>
                <p className="text-sm text-muted-foreground">{step.nextSteps}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Resources */}
      {guidance.supportResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Support Resources
            </CardTitle>
            <CardDescription>
              Additional help available throughout your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {guidance.supportResources.map((resource, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-1">{resource.resource}</h4>
                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  {resource.contact}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Success Indicators */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Target className="h-5 w-5" />
            Signs of Success
          </CardTitle>
          <CardDescription>
            Look for these positive indicators as you progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {guidance.successIndicators.map((indicator, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                {indicator}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Journey Complete */}
      {completedSteps.size === guidance.totalSteps && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-6 w-6" />
              Congratulations! Journey Complete
            </CardTitle>
            <CardDescription>
              You've successfully completed all steps in your legal journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              You've navigated your legal case like a pro! Remember to keep all your documents 
              safe and stay informed about any future deadlines or requirements.
            </p>
            <Button className="w-full" size="lg">
              <BookOpen className="mr-2 h-4 w-4" />
              View Case Summary & Next Steps
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
