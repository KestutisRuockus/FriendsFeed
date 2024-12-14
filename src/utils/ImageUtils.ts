import {
  deleteObject,
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { app, auth } from "../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

export const deletePostImageFromFirebaseStorage = async (
  imgUrl: string | null
) => {
  if (imgUrl) {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, imgUrl);
      await deleteObject(fileRef);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
};

export const saveImageToFirebaseStorage = async (
  currentImage: string | null = null,
  newImage: File,
  dbCollectionName: string
) => {
  const imageId = uuidv4();
  const storage = getStorage(app);
  const storageRef = ref(
    storage,
    `${dbCollectionName}/${auth.currentUser?.uid}/${imageId}-${newImage?.name
      .replace(/\s+/g, "")
      .replace(/[^\w.-]+/g, "-")}`
  );
  await uploadBytes(storageRef, newImage);
  if (currentImage) {
    deletePostImageFromFirebaseStorage(currentImage);
  }
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/webp",
  };

  return await imageCompression(file, options);
};
