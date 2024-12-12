import React, { useState } from "react";
import ErrorMessage from "../../components/shared/ErrorMessage";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app, auth, db } from "../../firebase/firebaseConfig";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import EmojiPickerComponent from "../../utils/EmojiPickerComponent";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [TemporaryImageUrl, setTemporaryImageURL] = useState<string>("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const createPost = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      if (title.trim() === "") {
        throw new Error("Title is required");
      } else if (content.trim() === "") {
        throw new Error("Content is required");
      } else {
        setUploading(true);
        const imageId = uuidv4();
        const storage = getStorage(app);
        const storageRef = ref(
          storage,
          `posts/${auth.currentUser?.uid}/${imageId}-${
            image
              ? image.name.replace(/\s+/g, "").replace(/[^\w.-]+/g, "-")
              : ""
          }`
        );
        if (image) {
          await uploadBytes(storageRef, image);
        }
        const downloadUrl = image ? await getDownloadURL(storageRef) : "";
        savePostsDetails(title, content, downloadUrl);
        setTemporaryImageURL("");
        setTitle("");
        setContent("");
        setErrorMessage("Post created successfully!");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setErrorMessage(error.message);
      }
    } finally {
      setUploading(false);
      setOpenEmojiPicker(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = e.target.files ? e.target.files[0] : undefined;
    if (chosenFile) {
      try {
        const compressedFile = await compressImage(chosenFile);
        setImage(compressedFile);
        const TemporaryImageUrl = URL.createObjectURL(compressedFile);
        setTemporaryImageURL(TemporaryImageUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: "image/webp",
    };

    return await imageCompression(file, options);
  };

  const savePostsDetails = async (
    title: string,
    content: string,
    imageURL?: string
  ) => {
    const postsCollectionRef = collection(
      db,
      "posts",
      auth.currentUser!.uid,
      "userPosts"
    );

    await addDoc(postsCollectionRef, {
      authorId: auth.currentUser?.uid,
      author: auth.currentUser?.displayName,
      title,
      content,
      imageURL: imageURL || "",
      likesCount: 0,
      dislikesCount: 0,
      date: Timestamp.fromDate(new Date()),
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(content + emoji);
  };

  return (
    <main className="bg-bgColor w-full min-h-screen flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold text-primary">Create Post</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-11/12 sm:w-4/5 lg:w-3/5 bg-secondary flex flex-col justify-center items-start border-2 border-primary rounded-lg p-8 max-[500px]:p-4"
      >
        <div className="flex flex-col-reverse md:flex-row justify-center items-end mb-6">
          <div>
            <label className="text-xs font-semibold text-primary px-1">
              Image (optional):
            </label>
            <input
              onChange={handleImageChange}
              type="file"
              className="w-full rounded-lg px-2 outline-none mb-2 bg-none"
            />
          </div>
          <div>
            {TemporaryImageUrl && <img src={TemporaryImageUrl} width={480} />}
          </div>
        </div>
        <label className="text-xs font-semibold text-primary px-1">
          Title:
        </label>
        <input
          onChange={handleTitleChange}
          value={title}
          type="text"
          className="w-full rounded-lg px-2 outline-none mb-2 bg-bgColorSecondary"
        />
        <label className="text-xs font-semibold text-primary px-1">
          Content:
        </label>
        <textarea
          onChange={handleContentChange}
          value={content}
          className="w-full rounded-lg px-2 py-1 outline-none bg-bgColorSecondary"
        />
        <EmojiPickerComponent
          open={openEmojiPicker}
          setOpen={setOpenEmojiPicker}
          onEmojiSelect={handleEmojiSelect}
        />
        <button
          onClick={createPost}
          className="bg-primary px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500 mx-auto mt-8 text-white"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload post"}
        </button>
        <div className="mx-auto">
          <ErrorMessage message={errorMessage} />
        </div>
      </form>
    </main>
  );
};

export default CreatePost;
