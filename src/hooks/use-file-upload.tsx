
'use client';

import { useState, useCallback } from 'react';
import { uploadFile, createImagePreview, validateFile, UploadResult } from '@/lib/uploadService';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface FileWithPreview {
  file: File;
  id: string;
  preview?: string;
  progress: number;
  uploaded: boolean;
  result?: UploadResult;
  error?: string;
}

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const addFiles = useCallback(async (newFiles: File[]) => {
    const validatedFiles: FileWithPreview[] = [];
    
    for (const file of newFiles) {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast({
          title: 'Invalid File',
          description: `${file.name}: ${validation.error}`,
          variant: 'destructive'
        });
        continue;
      }

      const id = `${file.name}-${file.lastModified}`;
      let preview: string | undefined;
      
      if (file.type.startsWith('image/')) {
        try {
          preview = await createImagePreview(file);
        } catch (error) {
          console.error('Failed to create preview:', error);
        }
      }
      
      validatedFiles.push({
        file,
        id,
        preview,
        progress: 0,
        uploaded: false
      });
    }
    
    setFiles(prev => [...prev, ...validatedFiles]);
  }, [toast]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const uploadFiles = useCallback(async () => {
    const filesToUpload = files.filter(f => !f.uploaded && !f.error);
    if (filesToUpload.length === 0) {
      toast({
        title: 'No Files to Upload',
        description: 'All files have already been uploaded or have errors.',
      });
      return;
    }

    setIsUploading(true);
    
    const uploadPromises = filesToUpload.map(async (fileWrapper) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('User session expired. Please log in again.');
        }

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileWrapper.id ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
          ));
        }, 200);

        const result = await uploadFile(fileWrapper.file);
        
        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.id === fileWrapper.id 
            ? { ...f, progress: 100, uploaded: true, result }
            : f
        ));
        
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileWrapper.id 
            ? { ...f, error: error instanceof Error ? error.message : 'Upload failed', progress: 0 }
            : f
        ));
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
    
    const successCount = files.filter(f => f.uploaded && !f.error).length;
    const errorCount = files.filter(f => f.error).length;
    
    if (successCount > 0) {
      toast({
        title: 'Upload Complete',
        description: `${successCount} file(s) uploaded successfully.${errorCount > 0 ? ` ${errorCount} failed.` : ''}`
      });
    }
  }, [files, toast]);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const retryFailedUploads = useCallback(async () => {
    
    // Reset error state for failed files
    setFiles(prev => prev.map(f => 
      f.error ? { ...f, error: undefined, progress: 0, uploaded: false } : f
    ));
    
    // Retry upload by calling uploadFiles after state has updated
    // Use a timeout to ensure state update has propagated before re-uploading
    setTimeout(() => {
        uploadFiles();
    }, 100);

  }, [uploadFiles]);

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    uploadFiles,
    clearFiles,
    retryFailedUploads,
    hasFiles: files.length > 0,
    hasUploadedFiles: files.some(f => f.uploaded),
    hasFailedFiles: files.some(f => f.error)
  };
};
