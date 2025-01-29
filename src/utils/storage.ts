import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface UploadResult {
  url: string;
  path: string;
}

// Upload file
export const uploadFile = async (file: File, path: string): Promise<UploadResult> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload nhiều files
export const uploadFiles = async (files: File[], basePath: string): Promise<UploadResult[]> => {
  try {
    const uploads = files.map((file) => {
      const path = `${basePath}/${Date.now()}_${file.name}`;
      return uploadFile(file, path);
    });
    
    return await Promise.all(uploads);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

// Xóa file
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}; 