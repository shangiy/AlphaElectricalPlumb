import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert data URI to Blob
function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export async function uploadImage(file: File | string): Promise<string> {
    const imageBlob = typeof file === 'string' ? dataURItoBlob(file) : file;
    const fileExtension = imageBlob.type.split('/')[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `product-images/${fileName}`);

    try {
        const snapshot = await uploadBytes(storageRef, imageBlob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw new Error("Image upload failed.");
    }
}
