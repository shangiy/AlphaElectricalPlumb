import { v4 as uuidv4 } from 'uuid';
import { uploadToStorageAdmin } from '@/app/actions/storage-actions';

/**
 * Robust Image Upload Utility:
 * Routes all uploads through a Server Action using the Service Role key
 * to prevent RLS (Row Level Security) violation errors.
 */
export async function uploadImage(file: File | string): Promise<string> {
    try {
        const fileName = `${uuidv4()}.webp`;
        const filePath = `uploads/${fileName}`;
        
        let fileToUpload: File;

        // Handle Data URIs (Base64) from camera captures
        if (typeof file === 'string' && file.startsWith('data:')) {
            const response = await fetch(file);
            const blob = await response.blob();
            fileToUpload = new File([blob], fileName, { type: blob.type || 'image/webp' });
        } 
        // Handle standard File objects from input fields
        else if (file instanceof File) {
            fileToUpload = file;
        } 
        else {
            throw new Error("Unsupported file format provided to uploadImage.");
        }

        // Prepare FormData for the Server Action
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('path', filePath);

        // Execute the server-side upload to bypass client-side RLS constraints
        const result = await uploadToStorageAdmin(formData);
        
        if (!result.publicUrl) {
            throw new Error("Upload succeeded but no public URL was returned.");
        }

        return result.publicUrl;
    } catch (error: any) {
        console.error("Storage Service Error: ", error.message);
        throw new Error(error.message || "Failed to upload image to Supabase Storage.");
    }
}
