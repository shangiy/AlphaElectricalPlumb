import { uploadToStorageAdmin } from '@/app/actions/storage-actions';

/**
 * Robust Image Upload Utility:
 * Routes all uploads through a Server Action using the Service Role key
 * to prevent RLS (Row Level Security) violation errors.
 * Updated to handle serialized Server Action responses.
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
            // 2. FILE NAME SANITIZATION
            const sanitizedBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            fileName = `${Date.now()}_${sanitizedBaseName}`;
            fileToUpload = file;
        } else if (typeof file === 'string' && file.startsWith('data:')) {
            // Handle Data URIs (Base64)
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

        // Execute server action with a try-catch for framework-level fetch failures
        let result;
        try {
            result = await uploadToStorageAdmin(formData);
        } catch (fetchError: any) {
            console.error("Action Fetch Failure (Timeout or Size Limit):", fetchError);
            throw new Error("The server could not process the upload (likely a timeout or size limit). Please try a smaller file.");
        }
        
        if (!result.success) {
            throw new Error(result.error || "Storage sync failed.");
        }

        if (!result.publicUrl) {
            throw new Error("The server completed the operation but returned an empty asset URL.");
        }

        return result.publicUrl;
    } catch (error: any) {
        console.error("Storage Service Sync Failure:", error.message || error);
        throw error;
    }
}
