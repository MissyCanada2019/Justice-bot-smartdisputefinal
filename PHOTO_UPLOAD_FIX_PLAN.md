# Photo Upload Error Fix - Justice Bot

## 🔍 **Current Issues Identified**

### Problem Analysis
You're getting errors on the preview screen when trying to attach photos because:

1. **Evidence Locker** - Only simulates uploads (fake progress bars)
2. **Submit Dispute** - Only accepts text files, rejects images
3. **No Firebase Storage Integration** - Files aren't actually uploaded anywhere
4. **No Image Preview System** - No way to preview images before upload
5. **Missing Upload Service** - No real backend file handling

## 🛠️ **Solution Architecture**

### Phase 1: Create Firebase Storage Service
**File**: `src/lib/uploadService.ts`
```typescript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';

const storage = getStorage(app);

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

export const uploadFile = async (
  file: File, 
  userId: string, 
  folder: 'evidence' | 'documents' = 'evidence'
): Promise<UploadResult> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const storageRef = ref(storage, `${folder}/${userId}/${fileName}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  
  return {
    url,
    fileName: file.name,
    size: file.size,
    type: file.type
  };
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### Phase 2: Enhanced File Upload Hook
**File**: `src/hooks/use-file-upload.tsx`
```typescript
'use client';

import { useState, useCallback } from 'react';
import { uploadFile, createImagePreview, UploadResult } from '@/lib/uploadService';
import { useAuth } from '@/hooks/use-auth';
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
  const { user } = useAuth();
  const { toast } = useToast();

  const addFiles = useCallback(async (newFiles: File[]) => {
    const filesWithPreviews = await Promise.all(
      newFiles.map(async (file) => {
        const id = `${file.name}-${file.lastModified}`;
        let preview: string | undefined;
        
        if (file.type.startsWith('image/')) {
          try {
            preview = await createImagePreview(file);
          } catch (error) {
            console.error('Failed to create preview:', error);
          }
        }
        
        return {
          file,
          id,
          preview,
          progress: 0,
          uploaded: false
        };
      })
    );
    
    setFiles(prev => [...prev, ...filesWithPreviews]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const uploadFiles = useCallback(async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to upload files.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    
    const uploadPromises = files
      .filter(f => !f.uploaded)
      .map(async (fileWrapper) => {
        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setFiles(prev => prev.map(f => 
              f.id === fileWrapper.id ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
            ));
          }, 200);

          const result = await uploadFile(fileWrapper.file, user.uid);
          
          clearInterval(progressInterval);
          
          setFiles(prev => prev.map(f => 
            f.id === fileWrapper.id 
              ? { ...f, progress: 100, uploaded: true, result }
              : f
          ));
          
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === fileWrapper.id 
              ? { ...f, error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          ));
        }
      });

    await Promise.all(uploadPromises);
    setIsUploading(false);
    
    toast({
      title: 'Upload Complete',
      description: `${files.length} file(s) uploaded successfully.`
    });
  }, [files, user, toast]);

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    uploadFiles
  };
};
```

### Phase 3: Enhanced Evidence Locker with Real Uploads
**File**: `src/app/(dashboard)/dashboard/evidence-locker/page.tsx` (Updated sections)

**Key changes needed:**
```typescript
// Replace the simulated upload with real Firebase upload
import { useFileUpload } from '@/hooks/use-file-upload';

export default function EvidenceLockerPage() {
  const { files, isUploading, addFiles, removeFile, uploadFiles } = useFileUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles, // Use the real upload function
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  // Add image preview component
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
            <span className="text-xs text-red-600">Error</span>
          </div>
        )}
      </div>
    );
  };
}
```

### Phase 4: Fix Submit Dispute to Accept Images
**File**: `src/app/(dashboard)/dashboard/submit-dispute/page.tsx` (Updated sections)

**Key changes needed:**
```typescript
// Update the file handling to accept images
const handleFileUpload = async (fileList: FileList | null) => {
  if (!fileList || fileList.length === 0) return undefined;
  
  const file = fileList[0];
  
  // Accept both text and image files
  if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
    return await readFileAsText(file);
  } else if (file.type.startsWith('image/')) {
    // For images, upload to Firebase and return URL
    if (!user) throw new Error('Must be logged in to upload images');
    const result = await uploadFile(file, user.uid, 'evidence');
    return `[Image Evidence: ${file.name}](${result.url})`;
  } else {
    throw new Error('Unsupported file type. Please upload a text file or image.');
  }
};

// Update the dropzone to accept images
<p className="text-xs text-muted-foreground">
  Text files (.txt, .md) or Images (.jpg, .png, .pdf)
</p>
```

### Phase 5: Firebase Storage Rules
**Firebase Console → Storage → Rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /evidence/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /documents/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 **Implementation Priority**

### Phase 1: Immediate Fix (High Priority)
1. **Create Firebase Storage service** - Enable real file uploads
2. **Fix Evidence Locker** - Replace simulation with real uploads
3. **Add image preview** - Show thumbnails of uploaded images
4. **Enable Firebase Storage** - Set up storage rules

### Phase 2: Enhanced Features (Medium Priority)  
1. **Fix Submit Dispute** - Accept images as evidence
2. **Add file validation** - Size limits, type checking
3. **Progress indicators** - Real upload progress
4. **Error handling** - Proper error messages

### Phase 3: Professional Polish (Low Priority)
1. **Drag & drop improvements** - Better visual feedback
2. **File management** - Delete, rename files
3. **Bulk operations** - Upload multiple files
4. **Download functionality** - Court-ready bundles

## 🔧 **Required Firebase Setup**

### Enable Firebase Storage
1. **Firebase Console** → **Storage** → **Get Started**
2. **Choose production mode**
3. **Select storage location** (preferably same as Firestore)
4. **Update storage rules** as shown above

### Update package.json
```json
{
  "dependencies": {
    "firebase": "^11.10.0",
    "react-dropzone": "^14.2.3"
  }
}
```

## ✅ **Testing Checklist**

After implementation:
- [ ] Can upload photos in Evidence Locker
- [ ] Image previews show correctly  
- [ ] Progress bars show real upload progress
- [ ] Files are stored in Firebase Storage
- [ ] Submit Dispute accepts images
- [ ] Error handling works properly
- [ ] File size limits enforced
- [ ] Only authenticated users can upload

## 🎯 **Expected Results**

After implementing this plan:
1. **Photos upload successfully** to Firebase Storage
2. **Image previews** display properly before upload
3. **Real progress tracking** instead of simulation
4. **Secure file storage** with proper user isolation
5. **Enhanced user experience** with drag & drop
6. **Professional error handling** with clear messages

This comprehensive fix will resolve your photo upload errors and create a professional document management system for Justice Bot.