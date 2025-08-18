
'use client';


import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  GenerateLegalFormOutput,
} from '@/ai/flows/generate-legal-form';
import { AssessDisputeMeritOutput } from '@/ai/flows/assess-dispute-merit';
import { FilePlus2, Loader2, AlertCircle, Download, FileText, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';
import { useAuth } from '@/hooks/use-auth';
import { getLatestCaseAssessment } from '@/lib/firestoreService';
import { getActiveSubscription, hasSinglePurchase, useSinglePurchase } from '@/lib/subscription';
import { useRouter } from 'next/navigation';

export default function GenerateFormPage() {
  const [assessment, setAssessment] = useState<AssessDisputeMeritOutput | null>(null);
  const [formContent, setFormContent] = useState<GenerateLegalFormOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canDownload, setCanDownload] = useState(false);
  const { toast } = useToast();
  const { user, isFreeTier } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const updateAccessStatus = () => {
       const activeSub = getActiveSubscription();
       const singlePurchase = hasSinglePurchase();
       setCanDownload(isFreeTier || !!activeSub || singlePurchase);
    };

    if (user) {
        setLoadingInitialData(true);
        getLatestCaseAssessment()
            .then(data => {
                if (data) {
                    setAssessment(data);
                }
            })
            .catch(err => {
                console.error("Error loading case data from Firestore", err);
                setError("Could not load your case data. Please submit your dispute again.");
            })
            .finally(() => setLoadingInitialData(false));
    } else {
        setLoadingInitialData(false);
    }
    
    updateAccessStatus();
    // Listen for storage changes to update payment status across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'justiceBotPurchases') {
        updateAccessStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [user, isFreeTier]);

  const handleGenerateClick = async () => {
    if (!assessment) {
        toast({
            title: 'No Case Data',
            description: 'Please submit a dispute before generating a form.',
            variant: 'destructive'
        });
        return;
    }
    setLoading(true);
    setError(null);
    setFormContent(null);
    try {
        const response = await fetch('/api/generate-legal-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                caseClassification: assessment.caseClassification,
                disputeDetails: assessment.analysis, // Using analysis for better context
                suggestedAvenues: assessment.suggestedAvenues,
                userEmail: user?.email || undefined,
                userName: user?.displayName || undefined,
                userLocation: (assessment as any).userLocation || undefined,
                province: (assessment as any).province || undefined,
                caseName: (assessment as any).caseName || undefined,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const output = await response.json();
        setFormContent(output);
    } catch (err) {
        console.error(err);
        setError('Failed to generate the form content. The AI may be experiencing high load. Please try again later.');
        toast({
            title: 'Form Generation Failed',
            description: 'An error occurred while generating the form.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  }

  const handleDownloadPdf = () => {
    if (!formContent || !canDownload) return;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const safeFilename = formContent.suggestedForm.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    doc.setProperties({
        title: `${formContent.suggestedForm} - Pre-filled Legal Form`
    });
    
    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(formContent.suggestedForm, 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated by JusticeBot.AI on ${new Date().toLocaleDateString()}`, 15, 26);
    doc.text(`User: ${user?.displayName || user?.email || 'N/A'}`, 15, 30);
    doc.line(15, 33, 195, 33);

    let y = 45;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const rightMargin = 195;

    formContent.formSections.forEach(section => {
        // Check if we need a new page for section header
        if (y + 25 > pageHeight - margin) {
            doc.addPage();
            y = 20;
        }

        // Section title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(section.sectionTitle, margin, y);
        y += 8;

        // Section instructions
        if (section.instructions) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            const instructionLines = doc.splitTextToSize(section.instructions, rightMargin - margin);
            doc.text(instructionLines, margin, y);
            y += instructionLines.length * 4 + 5;
        }

        // Form fields
        section.fields.forEach(field => {
            if (y + 15 > pageHeight - margin) {
                doc.addPage();
                y = 20;
            }

            // Field label
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(field.fieldLabel, margin, y);
            y += 5;

            // Field value
            doc.setFont('helvetica', 'normal');
            if (field.fieldType === 'textarea') {
                const fieldValue = field.fieldValue || '[To be completed]';
                const valueLines = doc.splitTextToSize(fieldValue, rightMargin - margin - 5);
                
                // Draw border around textarea
                const boxHeight = Math.max(15, valueLines.length * 4 + 6);
                doc.rect(margin + 5, y - 2, rightMargin - margin - 10, boxHeight);
                
                doc.text(valueLines, margin + 8, y + 3);
                y += boxHeight + 5;
            } else if (field.fieldType === 'checkbox') {
                // Draw checkbox
                doc.rect(margin + 5, y - 3, 4, 4);
                if (field.fieldValue === 'true') {
                    doc.text('✓', margin + 6, y);
                }
                doc.text(field.fieldValue === 'true' ? 'Yes' : 'No', margin + 12, y);
                y += 8;
            } else {
                // Regular text field
                const fieldValue = field.fieldValue || '[To be completed]';
                doc.rect(margin + 5, y - 2, rightMargin - margin - 10, 6);
                doc.text(fieldValue, margin + 8, y + 2);
                y += 10;
            }
            
            y += 3; // Extra spacing between fields
        });

        y += 8; // Extra spacing between sections
    });

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This form was generated by JusticeBot.AI. Please review all information before submission.', margin, footerY);

    doc.save(`${safeFilename}_form.pdf`);
    
    // Handle payment/subscription logic
    if (!getActiveSubscription() && !isFreeTier) {
      useSinglePurchase();
      setCanDownload(false);
       toast({
        title: 'Document Credit Used',
        description: 'Your single document purchase has been used. Form downloaded successfully.',
      });
    } else {
      toast({
        title: 'Form Downloaded',
        description: 'Your pre-filled legal form has been downloaded successfully. Starting your guided legal journey...',
      });
      
      // Redirect to legal journey after successful download
      setTimeout(() => {
        router.push('/dashboard/legal-journey');
      }, 2000);
    }
  };

  if (loadingInitialData) {
      return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
             <CardContent>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
                <p className="text-center text-muted-foreground">Loading your case data...</p>
            </CardContent>
        </Card>
      );
  }

  if (!assessment && !loading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Case Data Found</AlertTitle>
        <AlertDescription>
          You need to submit a dispute for analysis before a form can be generated.
          <Button asChild className="mt-4">
            <Link href="/dashboard/submit-dispute">Submit a Dispute</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4">
            <FilePlus2 className="h-8 w-8 text-primary" />
            <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                AI Form Generator
            </h1>
            <p className="text-muted-foreground">
                Auto-fill legal forms based on your case details.
            </p>
            </div>
        </div>

        {assessment && !formContent && (
            <Card>
                <CardHeader>
                    <CardTitle>Ready to Generate Your Form?</CardTitle>
                    <CardDescription>
                        Based on your case assessment for <span className="font-semibold text-primary">{assessment.caseClassification}</span>, we can generate a draft of the relevant legal form.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        The AI will structure the information you provided into the standard sections of the legal form. You can review and edit the content before downloading.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateClick} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : 'Generate Form Content'}
                    </Button>
                </CardFooter>
            </Card>
        )}

        {loading && (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </CardContent>
            </Card>
        )}
        
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {formContent && (
            <Card className="border-primary">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Generated Form: {formContent.suggestedForm}</CardTitle>
                    <CardDescription>
                        Below is a preview of your auto-filled form. Review each section carefully. This is not legal advice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {formContent.formSections.map((section, sectionIndex) => (
                        <Card key={sectionIndex}>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 font-headline">
                                    <FileText className="h-5 w-5"/>
                                    {section.sectionTitle}
                                </CardTitle>
                                {section.instructions && (
                                    <CardDescription>{section.instructions}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                    {section.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">
                                                {field.fieldLabel}
                                            </label>
                                            {field.fieldType === 'textarea' ? (
                                                <div className="min-h-[80px] p-3 border rounded-md bg-muted/20">
                                                    <p className="text-sm whitespace-pre-wrap">
                                                        {field.fieldValue || '[To be filled]'}
                                                    </p>
                                                </div>
                                            ) : field.fieldType === 'checkbox' ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border rounded bg-muted/20 flex items-center justify-center">
                                                        {field.fieldValue === 'true' && '✓'}
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {field.fieldValue === 'true' ? 'Checked' : 'Unchecked'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="p-3 border rounded-md bg-muted/20">
                                                    <p className="text-sm">
                                                        {field.fieldValue || '[To be filled]'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
                <CardFooter className="flex-wrap gap-4">
                    {canDownload ? (
                        <Button onClick={handleDownloadPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            Download as PDF
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/dashboard/billing">
                                <Lock className="mr-2 h-4 w-4" />
                                Choose a Plan to Download
                            </Link>
                        </Button>
                    )}
                    
                    {isFreeTier ? (
                        <p className="text-sm text-muted-foreground">
                            Your free lifetime access includes unlimited PDF downloads.
                        </p>
                    ) : getActiveSubscription() ? (
                         <p className="text-sm text-muted-foreground">
                            Your active plan includes unlimited PDF downloads.
                        </p>
                    ) : hasSinglePurchase() ? (
                         <p className="text-sm text-muted-foreground">
                            You have a single document credit available for download.
                        </p>
                    ): (
                        <p className="text-sm text-muted-foreground">
                            A subscription or single document purchase is required to download.
                        </p>
                    )}
                </CardFooter>
            </Card>
        )}
    </div>
  );
}
