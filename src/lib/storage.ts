import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to convert data URI (base64) to a Blob object.
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
 * IMPORTANT: Ensure the bucket 'product-images' exists in Supabase.
 */
export async function uploadImage(file: File | string): Promise<string> {
    if (!supabase) {
        throw new Error("Supabase client is not available.");
    }

    try {
        const isBase64 = typeof file === 'string' && file.startsWith('data:');
        const imageBlob = isBase64 ? dataURItoBlob(file as string) : (file as File);
        
        const fileExtension = imageBlob.type.split('/')[1] || 'webp';
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `uploads/${fileName}`;

        // Upload to the 'product-images' bucket
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageBlob, {
                cacheControl: '3600',
                upsert: false,
                contentType: imageBlob.type
            });

        if (error) {
            console.error("Supabase Storage Error Details:", error);
            throw new Error(`Upload failed: ${error.message}. Ensure 'product-images' bucket exists and has public insert policies.`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error: any) {
        console.error("Storage Service Error: ", error);
        throw error;
    }
}
