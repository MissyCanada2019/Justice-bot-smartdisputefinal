
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export const useGooglePicker = (onFilesPicked: (files: File[]) => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  const developerKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const scope = ['https://www.googleapis.com/auth/drive.readonly'];

  useEffect(() => {
    // Load the GAPI client script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:picker', () => {
        setGapiLoaded(true);
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createPicker = useCallback(() => {
    if (!gapiLoaded || !user) return;

    user.getIdToken(true).then(accessToken => {
      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
      view.setMimeTypes("application/pdf,image/png,image/jpeg,image/jpg,application/vnd.openxmlformats-officedocument.wordprocessingml.document");

      const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .setAppId(clientId!)
        .setOAuthToken(accessToken)
        .addView(view)
        .setDeveloperKey(developerKey!)
        .setCallback((data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const files = data.docs.map((doc: any) => {
                // This is a simplified representation.
                // In a real app, you would need to use the Drive API to download the file content.
                // For now, we'll create a placeholder File object.
                const placeholderContent = `Downloaded from Google Drive: ${doc.name}`;
                const blob = new Blob([placeholderContent], { type: doc.mimeType });
                return new File([blob], doc.name, { type: doc.mimeType });
            });
            onFilesPicked(files);
          }
        })
        .build();
      picker.setVisible(true);
    }).catch(error => {
        console.error("Error getting ID token for Picker:", error);
        toast({
            title: 'Authentication Error',
            description: 'Could not authenticate with Google Drive. Please try again.',
            variant: 'destructive',
        });
    });
  }, [gapiLoaded, user, developerKey, clientId, onFilesPicked, toast]);

  const openPicker = () => {
    if (gapiLoaded) {
      createPicker();
    } else {
        toast({
            title: 'Google Drive Not Ready',
            description: 'The file picker is still loading. Please try again in a moment.',
        });
    }
  };

  return { openPicker };
};
