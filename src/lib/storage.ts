import { v4 as uuidv4 } from 'uuid';
import { uploadToStorageAdmin } from '@/app/actions/storage-actions';

/**
 * Robust Image Upload Utility:
 * Routes all uploads through a Server Action using the Service Role key
 * to prevent RLS (Row Level Security) violation errors.
 */
export async function uploadImage(file: File | string, bucket: string = 'product-images'): Promise<string> {
    return uploadFile(file, bucket, 'uploads');
}

/**
 * Generic File Upload Utility:
 * Routes all uploads (Images, Videos, PDFs) through a Server Action using the Service Role key.
 */
export async function uploadFile(file: File | string, bucket: string, folder: string = 'uploads'): Promise<string> {
    try {
        let fileName: string;
        
        if (file instanceof File) {
            // Sanitize file names: Replace spaces or special characters with underscores to prevent 400 errors
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            fileName = `${uuidv4()}-${sanitizedName}`;
        } else if (typeof file === 'string' && file.startsWith('data:')) {
            // Handle Data URIs (Base64) from camera captures
            const extension = file.startsWith('data:image') ? 'webp' : 'mp4';
            fileName = `${uuidv4()}.${extension}`;
        } else {
            throw new Error("Unsupported file format provided to storage utility.");
        }

        const filePath = `${folder}/${fileName}`;
        
        let fileToUpload: File;

        // Convert Data URI to File if necessary
        if (typeof file === 'string' && file.startsWith('data:')) {
            const response = await fetch(file);
            const blob = await response.blob();
            fileToUpload = new File([blob], fileName, { type: blob.type });
        } 
        else if (file instanceof File) {
            fileToUpload = file;
        } 
        else {
            throw new Error("Unsupported file format provided to storage utility.");
        }

        // Prepare FormData for the Server Action
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('path', filePath);
        formData.append('bucket', bucket);

        // Execute the server-side upload to bypass client-side RLS constraints
        const result = await uploadToStorageAdmin(formData);
        
        if (!result.publicUrl) {
            throw new Error("Upload succeeded but no public URL was returned.");
        }

        return result.publicUrl;
    } catch (error: any) {
        console.error("Storage Service Error: ", error.message);
        throw new Error(error.message || `Failed to upload file to Supabase Storage bucket "${bucket}".`);
    }
}
