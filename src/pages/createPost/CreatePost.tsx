import React, { useState } from "react";
import ErrorMessage from "../../components/shared/ErrorMessage";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app, auth, db } from "../../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import EmojiPickerComponent from "../../utils/EmojiPickerComponent";
import { compressImage } from "../../utils/ImageUtils";

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [temporaryImageUrl, setTemporaryImageURL] = useState<string>("");
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
        const temporaryUrl = URL.createObjectURL(compressedFile);
        setTemporaryImageURL(temporaryUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
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
      authorProfileImage: auth.currentUser?.photoURL,
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
            {temporaryImageUrl && <img src={temporaryImageUrl} width={480} />}
          </div>
        </div>
        <label className="text-xs font-semibold text-primary px-1">
          Title:<sup className="text-red-600 font-bold">*</sup>
        </label>
        <input
          onChange={handleTitleChange}
          value={title}
          type="text"
          className="w-full rounded-lg px-2 outline-none mb-2 bg-bgColorSecondary"
        />
        <label className="text-xs font-semibold text-primary px-1">
          Content:<sup className="text-red-600 font-bold">*</sup>
        </label>
        <textarea
          onChange={handleContentChange}
          value={content}
          className="w-full h-60 rounded-lg px-2 py-1 outline-none bg-bgColorSecondary"
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
