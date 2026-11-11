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
        let fileToUpload: File;
        
        // 1. HARDCODE / NORMALIZE BUCKET NAME: Force lowercase and hyphenated format
        const targetBucket = (bucket || 'connect-us-video').toLowerCase().replace(/\s+/g, '-');

        if (file instanceof File) {
            // 2. FILE NAME SANITIZATION: Strip special characters and spaces
            // Implementation: Date.now() prefix + sanitized original name
            const sanitizedBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            fileName = `${Date.now()}_${sanitizedBaseName}`;
            fileToUpload = file;
        } else if (typeof file === 'string' && file.startsWith('data:')) {
            // Handle Data URIs (Base64) from camera captures
            const mimeTypeMatch = file.match(/^data:([^;]+);base64,/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : (file.startsWith('data:image') ? 'image/webp' : 'video/mp4');
            const extension = mimeType.split('/')[1] || 'bin';
            fileName = `${Date.now()}_capture.${extension}`;

            const response = await fetch(file);
            const blob = await response.blob();
            fileToUpload = new File([blob], fileName, { type: mimeType });
        } else {
            throw new Error("Unsupported file format provided to storage utility.");
        }

        const filePath = `${folder}/${fileName}`;

        // Prepare FormData for the Server Action
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('path', filePath);
        formData.append('bucket', targetBucket);

        // Execute the server-side upload to bypass client-side RLS constraints
        // Note: Next.js 15 server action body limits must be configured in next.config.ts for large files
        const result = await uploadToStorageAdmin(formData);
        
        if (!result || !result.publicUrl) {
            throw new Error("The server completed the operation but returned an empty asset URL.");
        }

        return result.publicUrl;
    } catch (error: any) {
        console.error("Storage Service Sync Failure:", error.message || error);
        
        // Provide contextual guidance for common failures
        const errorMessage = error.message === 'An unexpected response was received from the server.'
            ? "File size exceeds server limits. Please try a smaller file or contact technical support."
            : (error.message || `Failed to upload file to Supabase Storage bucket "${bucket}".`);
            
        throw new Error(errorMessage);
    }
}
