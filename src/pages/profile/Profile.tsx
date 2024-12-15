import { useCallback, useEffect, useRef, useState } from "react";
import { ProfileProps } from "./../types";
import Female from "../../assets/female.jpg";
import Male from "../../assets/male.jpg";
import Other from "../../assets/other.jpg";
import Post from "../../components/features/posts/Post";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ErrorMessage from "../../components/shared/ErrorMessage";
import { useFetchPosts } from "../../hooks/useFetchPosts";
import {
  compressImage,
  deletePostImageFromFirebaseStorage,
  saveImageToFirebaseStorage,
} from "../../utils/ImageUtils";
import { updateProfile } from "firebase/auth";
import LoadingPostSkeleton from "../../utils/LoadingPostSkeleton";

const Profile = () => {
  const [userDetails, setUserDetails] = useState<ProfileProps>({
    name: "",
    email: "",
    birthdate: "",
    location: "",
    gender: "",
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [temporaryProfileImageUrl, setTemporaryProfileImageURL] =
    useState<string>("");
  const [isProfileImageRemoved, setIsProfileImageRemoved] =
    useState<boolean>(false);

  const username = auth.currentUser?.displayName;
  const {
    posts,
    loading,
    hasMore,
    fetchPosts,
    removeDeletedPostFromPostsStateById,
    updatePostsStateById,
  } = useFetchPosts({
    username,
  });

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserDetails({ ...userDetails, name: e.target.value });
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserDetails({ ...userDetails, email: e.target.value });
  const handleBirthdateInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserDetails({ ...userDetails, birthdate: e.target.value });
  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserDetails({ ...userDetails, location: e.target.value });
  const handleGenderCheckbox = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserDetails({ ...userDetails, gender: e.target.value });

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, fetchPosts]
  );

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("User is not authenticated");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as ProfileProps;
          setUserDetails({
            name: data.name || "",
            email: data.email ?? null,
            birthdate: data.birthdate || "",
            location: data.location || "",
            gender: data.gender || "",
          });
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const setProfilePhoto = () => {
    let profilePhoto;

    if (editMode && isProfileImageRemoved) {
      if (userDetails?.gender === "Male") {
        profilePhoto = Male;
      } else if (userDetails?.gender === "Female") {
        profilePhoto = Female;
      } else {
        profilePhoto = Other;
      }
    } else if (temporaryProfileImageUrl) {
      profilePhoto = temporaryProfileImageUrl;
    } else if (auth.currentUser?.photoURL) {
      profilePhoto = auth.currentUser?.photoURL;
    } else {
      if (userDetails?.gender === "Male") {
        profilePhoto = Male;
      } else if (userDetails?.gender === "Female") {
        profilePhoto = Female;
      } else {
        profilePhoto = Other;
      }
    }

    return profilePhoto;
  };

  const toggleEditMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (editMode) {
      fetchUserData();
      setErrorMessage("");
      setIsProfileImageRemoved(false);
      setTemporaryProfileImageURL("");
    }
    setEditMode(!editMode);
  };

  const handleProfileUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const allInputFields = Object.values(userDetails).every(
      (value) => value !== ""
    );

    if (allInputFields) {
      try {
        const docRef = doc(db, "users", auth.currentUser!.uid);
        updateDoc(docRef, { ...userDetails });

        if (profileImage) {
          const newImageUrl = await saveImageToFirebaseStorage(
            auth.currentUser?.photoURL,
            profileImage,
            "profileImages"
          );

          if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
              photoURL: newImageUrl,
            });
          }
        } else if (isProfileImageRemoved) {
          if (auth.currentUser) {
            const previousImageUrl = auth.currentUser.photoURL;
            await updateProfile(auth.currentUser, {
              photoURL: "",
            });
            await auth.currentUser.reload();
            deletePostImageFromFirebaseStorage(previousImageUrl);
          }
          setIsProfileImageRemoved(false);
        }

        console.log(`Profile updated successfully`);
        setErrorMessage("Profile updated successfully");
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    } else {
      console.log("Some fields are missing!");
      setErrorMessage("Some fields are missing!");
      return;
    }

    setEditMode(!editMode);
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const chosenFile = e.target.files ? e.target.files[0] : undefined;
    if (chosenFile) {
      try {
        const compressedFile = await compressImage(chosenFile);
        setProfileImage(compressedFile);
        const temporaryUrl = URL.createObjectURL(compressedFile);
        setTemporaryProfileImageURL(temporaryUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
  };

  const removeProfileImage = () => {
    setTemporaryProfileImageURL("");
    setProfileImage(null);
    setIsProfileImageRemoved(true);
  };

  return (
    <main className="bg-gradient-to-r from-bgColor to-bgColorSecondary w-full flex flex-col items-center gap-4 pb-8 justify-start">
      <div className="w-4/5 h-fit mx-auto rounded-lg flex flex-col lg:flex-row gap-4 items-center justify-center mt-20 px-2 sm:px-4 py-12">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="w-1/2 sm:w-4/5 lg:w-1/2 xl:w-1/3 flex justify-center">
            <img
              className="rounded-full w-full aspect-square"
              src={
                temporaryProfileImageUrl
                  ? temporaryProfileImageUrl
                  : setProfilePhoto()
              }
              alt="profile photo"
            />
          </div>
          {editMode && (
            <div className="w-4/5 px-2">
              <label className="text-xs font-semibold text-primary">
                Profile Image (optional):
              </label>
              <input
                onChange={handleProfileImageChange}
                type="file"
                className="w-full outline-none mb-2 bg-none"
              />
              <button
                onClick={removeProfileImage}
                className="bg-primary text-secondary font-semibold px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500 w-full"
              >
                Remove Profile Image
              </button>
            </div>
          )}
        </div>
        <form className="w-full sm:w-4/5 lg:w-1/2 xl:w-1/3 flex flex-col text-white">
          <label className="rounded-lg ps-2 font-semibold text-primary text-xs">
            Name:
          </label>
          <input
            onChange={handleNameInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2`}
            disabled={editMode ? false : true}
            value={userDetails.name}
            type="text"
          />
          <label className="rounded-lg ps-2 font-semibold text-primary text-xs">
            Email:
          </label>
          <input
            onChange={handleEmailInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2`}
            disabled
            value={userDetails.email ?? ""}
            type="email"
          />
          <label className="rounded-lg ps-2 font-semibold text-primary text-xs">
            Birthdate:
          </label>
          <input
            onChange={handleBirthdateInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2`}
            disabled={editMode ? false : true}
            value={userDetails.birthdate}
            type="date"
          />
          <label className="rounded-lg ps-2 font-semibold text-primary text-xs">
            Living location:
          </label>
          <input
            onChange={handleLocationInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2 appearance-none`}
            disabled={editMode ? false : true}
            value={userDetails.location}
            type="text"
          />
          <label className="rounded-lg ps-2 font-semibold text-primary text-xs">
            Gender:
          </label>
          <div className="flex flex-col bg-primary rounded-lg text-secondary text-lg font-semibold mb-8">
            <p className={`ps-2 w-1/5`}>{userDetails.gender}</p>
            {editMode && (
              <div className="flex justify-center gap-2 w-4/5 m-auto">
                <label>Male</label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={userDetails.gender === "Male"}
                  onChange={handleGenderCheckbox}
                  className="cursor-pointer"
                />
                <label>Female</label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={userDetails.gender === "Female"}
                  onChange={handleGenderCheckbox}
                  className="cursor-pointer"
                />
                <label>Other</label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={userDetails.gender === "Other"}
                  onChange={handleGenderCheckbox}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 text-white">
            <button
              onClick={toggleEditMode}
              className="bg-primary text-secondary font-semibold px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500"
            >
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </button>
            {editMode && (
              <button
                onClick={handleProfileUpdate}
                className="bg-primary text-secondary font-semibold px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500"
              >
                Save Profile
              </button>
            )}
          </div>
          {<ErrorMessage message={errorMessage} />}
        </form>
      </div>
      <h2 className="text-3xl font-bold text-primary">YOUR POSTS</h2>
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          className="w-full flex justify-center"
        >
          <Post
            post={post}
            removeDeletedPostFromPostsStateById={
              removeDeletedPostFromPostsStateById
            }
            updatePostsStateById={updatePostsStateById}
          />
        </div>
      ))}
      {loading && <LoadingPostSkeleton />}
    </main>
  );
};

export default Profile;
