
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  caseName: z.string().min(5, { message: "Case name must be at least 5 characters." }),
  caseClassification: z.string({ required_error: "Please select a case type." }),
  disputeDetails: z.string().min(20, { message: "Please provide at least 20 characters of detail." }),
  files: z.instanceof(FileList).refine(files => files.length > 0, { message: 'At least one file is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitDisputePage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseName: '',
      caseClassification: '',
      disputeDetails: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to submit a dispute.', variant: 'destructive' });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('caseName', data.caseName);
    formData.append('caseClassification', data.caseClassification);
    formData.append('disputeDetails', data.disputeDetails);
    for (let i = 0; i < data.files.length; i++) {
        formData.append('files', data.files[i]);
    }
    
    try {
        const token = await user.getIdToken();
        const response = await fetch('/api/disputes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit dispute');
        }

        const result = await response.json();
        toast({
            title: 'Success!',
            description: result.message,
        });
        
        router.push(`/dashboard/case/${result.disputeId}`);

    } catch (error: any) {
        toast({
            title: 'Submission Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Dispute</CardTitle>
        <CardDescription>Fill out the form below and upload your evidence to start the process.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="caseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Name / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dispute with Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caseClassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Classification</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a legal area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Family Law">Family Law</SelectItem>
                      <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                      <SelectItem value="Landlord-Tenant Board">Landlord-Tenant Board</SelectItem>
                      <SelectItem value="Litigation">Litigation / Civil Court</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disputeDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details of the Dispute</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the situation in as much detail as possible..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Upload Evidence</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            multiple
                            onChange={(e) => field.onChange(e.target.files)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Dispute
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
