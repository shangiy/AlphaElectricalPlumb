import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to convert data URI (base64) to a Blob object.
 * Used for capturing images from the camera/canvas in Visual Search.
 */
function dataURItoBlob(dataURI: string) {
    try {
        const parts = dataURI.split(',');
        if (parts.length < 2) throw new Error("Invalid data URI");
        
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1].split(';')[0];
        
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    } catch (e) {
        console.error("Error converting data URI to Blob:", e);
        throw new Error("Failed to process image data for upload.");
    }
}

/**
 * Uploads an image to Supabase Storage.
 * Replaces Firebase Storage to avoid "storage/quota-exceeded" errors.
 * 
 * @param file - The File object from an input or a base64 data URI string.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(file: File | string): Promise<string> {
    if (!supabase) {
        throw new Error("Supabase client is not available for storage operations.");
    }

    try {
        const imageBlob = typeof file === 'string' ? dataURItoBlob(file) : file;
        const fileExtension = imageBlob.type.split('/')[1] || 'webp';
        const fileName = `${uuidv4()}.${fileExtension}`;
        
        // We store new uploads in an 'uploads' directory within the bucket for organization
        const filePath = `uploads/${fileName}`;

        // Upload to the 'product-images' bucket in Supabase
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageBlob, {
                cacheControl: '3600',
                upsert: false,
                contentType: imageBlob.type
            });

        if (error) throw error;

        // Retrieve the public URL for the newly uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error: any) {
        console.error("Supabase Storage Upload Error: ", error);
        throw new Error(error.message || "Image upload to Supabase failed. Check bucket permissions.");
    }
}
