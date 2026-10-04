/**
 * useUploadImage Hook
 * React Query mutation hook لرفع الصور مع تتبع التقدم
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useState } from 'react';
import adminService from '../../services/admin.service';
import type { UploadImageResponse } from '../../services/types';

interface UploadImageVariables {
  file: File;
}

export const useUploadImage = (
  options?: Omit<UseMutationOptions<UploadImageResponse, Error, UploadImageVariables>, 'mutationFn'>
) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: async ({ file }: UploadImageVariables) => {
      setUploadProgress(0);
      
      const response = await adminService.uploadImage(file, (progressEvent) => {
        setUploadProgress(progressEvent.percentage);
      });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في رفع الصورة');
      }
      
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      setUploadProgress(100);
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      setUploadProgress(0);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });

  return {
    ...mutation,
    uploadProgress,
  };
};
