
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
import { Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGooglePicker } from '@/hooks/use-google-picker';
import { Icons } from '@/components/icons';

const formSchema = z.object({
  caseName: z.string().min(5, { message: "Case name must be at least 5 characters." }),
  caseClassification: z.string({ required_error: "Please select a case type." }),
  disputeDetails: z.string().min(20, { message: "Please provide at least 20 characters of detail." }),
  files: z.custom<FileList | File[]>().refine(files => files && files.length > 0, { message: 'At least one file is required.' }),
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
      files: [],
    },
  });

  const { openPicker } = useGooglePicker((files) => {
    // When files are picked from Google Drive, update the form's file list
    const currentFiles = Array.from(form.getValues('files') || []);
    const newFiles = [...currentFiles, ...files];
    form.setValue('files', newFiles);
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
    
    // Handle both FileList and Array<File>
    const files = data.files;
    if (files instanceof FileList) {
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
    } else if (Array.isArray(files)) {
        files.forEach(file => {
            formData.append('files', file);
        });
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

  const currentFiles = form.watch('files');

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
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <label className="flex-1 cursor-pointer rounded-md border-2 border-dashed border-input p-4 text-center hover:bg-accent hover:text-accent-foreground">
                            <UploadCloud className="mx-auto h-8 w-8" />
                            <span className="mt-2 block text-sm">Click to upload or drag & drop</span>
                            <Input 
                                type="file" 
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                  const currentFiles = Array.from(form.getValues('files') || []);
                                  const newFiles = Array.from(e.target.files || []);
                                  form.setValue('files', [...currentFiles, ...newFiles]);
                                }}
                            />
                        </label>
                        <Button type="button" variant="outline" className="flex-1" onClick={openPicker}>
                            <Icons.googleDrive className="mr-2 h-6 w-6" />
                            Upload from Google Drive
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {currentFiles && currentFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {Array.from(currentFiles).map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

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
