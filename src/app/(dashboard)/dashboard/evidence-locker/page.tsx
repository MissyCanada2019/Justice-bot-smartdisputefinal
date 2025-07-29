'use client';

import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, UploadCloud, FileText, Trash2, Download, Package, Loader2, Image, RefreshCw, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useFileUpload, FileWithPreview } from '@/hooks/use-file-upload';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Image preview component
const ImagePreview = ({ file }: { file: FileWithPreview }) => {
  if (!file.preview) return null;
  
  return (
    <div className="relative">
      <img 
        src={file.preview} 
        alt={file.file.name}
        className="w-16 h-16 object-cover rounded border"
      />
      {file.error && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded">
          <AlertCircle className="h-4 w-4 text-red-600" />
        </div>
      )}
    </div>
  );
};

// File icon component
const FileIcon = ({ file }: { file: FileWithPreview }) => {
  if (file.preview) {
    return <ImagePreview file={file} />;
  }
  
  if (file.file.type === 'application/pdf') {
    return <FileText className="h-6 w-6 text-red-500" />;
  }
  
  return <FileText className="h-6 w-6 text-muted-foreground" />;
};

export default function EvidenceLockerPage() {
  const { 
    files, 
    isUploading, 
    addFiles, 
    removeFile, 
    uploadFiles, 
    clearFiles,
    retryFailedUploads,
    hasFiles,
    hasUploadedFiles,
    hasFailedFiles
  } = useFileUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB limit
    disabled: isUploading
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <FolderOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Evidence Locker</h1>
          <p className="text-muted-foreground">Upload, manage, and bundle your case evidence securely.</p>
        </div>
      </div>

      {/* Show retry option for failed uploads */}
      {hasFailedFiles && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Some files failed to upload. Check your connection and try again.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryFailedUploads}
              disabled={isUploading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Failed
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Evidence</CardTitle>
          <CardDescription>
            Drag and drop files here, or click to select. Supported formats: PDF, JPG, PNG, WEBP, TXT, DOC, DOCX (max 10MB each).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/10' 
                : isUploading 
                  ? 'border-muted bg-muted/50 cursor-not-allowed' 
                  : 'bg-card hover:bg-muted'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className={`w-10 h-10 mb-3 ${isUploading ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">
                  {isUploading ? 'Uploading...' : 'Click to upload'}
                </span> 
                {!isUploading && ' or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">PDF, PNG, JPG, WEBP, TXT, DOC, DOCX (max 10MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasFiles && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>File Queue ({files.length})</span>
              <div className="flex gap-2">
                {hasUploadedFiles && (
                  <Badge variant="secondary" className="text-green-600">
                    {files.filter(f => f.uploaded).length} uploaded
                  </Badge>
                )}
                {hasFailedFiles && (
                  <Badge variant="destructive">
                    {files.filter(f => f.error).length} failed
                  </Badge>
                )}
              </div>
            </CardTitle>
            <CardDescription>Review your selected files before uploading.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map(fileData => (
              <div key={fileData.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <FileIcon file={fileData} />
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{fileData.file.name}</p>
                    {fileData.uploaded && (
                      <Badge variant="secondary" className="text-green-600">Uploaded</Badge>
                    )}
                    {fileData.error && (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                    {isUploading && fileData.progress > 0 && fileData.progress < 100 && (
                      <Badge variant="outline">Uploading...</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(fileData.file.size / 1024).toFixed(2)} KB
                    {fileData.file.type.startsWith('image/') && ' • Image'}
                    {fileData.file.type === 'application/pdf' && ' • PDF Document'}
                  </p>
                  {fileData.error && (
                    <p className="text-sm text-red-600 mt-1">{fileData.error}</p>
                  )}
                  {(isUploading || fileData.progress > 0) && fileData.progress < 100 && (
                    <Progress value={fileData.progress} className="w-full mt-2" />
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(fileData.id)} 
                  disabled={isUploading}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-wrap gap-4">
            <Button
              onClick={uploadFiles}
              disabled={isUploading || !files.some(f => !f.uploaded && !f.error)}
              className="min-w-[200px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Files...
                </>
              ) : hasUploadedFiles ? (
                'Upload More Files'
              ) : (
                'Upload and Save Files'
              )}
            </Button>
            
            {hasFiles && (
              <Button 
                variant="outline" 
                onClick={clearFiles}
                disabled={isUploading}
              >
                Clear All Files
              </Button>
            )}
            
            {hasUploadedFiles && (
              <Button variant="outline" disabled>
                <Package className="mr-2 h-4 w-4" />
                Download as Court-Ready Bundle
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {hasUploadedFiles && (
        <Card>
          <CardHeader>
            <CardTitle>Evidence Summary</CardTitle>
            <CardDescription>Your uploaded evidence files are now secured and ready for legal proceedings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{files.filter(f => f.uploaded).length}</p>
                <p className="text-sm text-muted-foreground">Files Secured</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Image className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{files.filter(f => f.uploaded && f.file.type.startsWith('image/')).length}</p>
                <p className="text-sm text-muted-foreground">Images</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Ready</p>
                <p className="text-sm text-muted-foreground">For Bundling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
