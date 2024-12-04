import { useEffect, useState } from "react";
import { ProfileProps } from "./../types";
import Female from "../../assets/female.png";
import Male from "../../assets/male.png";
import Other from "../../assets/other.png";
import Post from "../../components/features/posts/Post";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ErrorMessage from "../../components/shared/ErrorMessage";
import { useFetchPosts } from "../../hooks/useFetchPosts";

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

  const username = auth.currentUser?.displayName;
  const { posts } = useFetchPosts({ username });

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

    if (userDetails?.gender === "Male") {
      profilePhoto = Male;
    } else if (userDetails?.gender === "Female") {
      profilePhoto = Female;
    } else {
      profilePhoto = Other;
    }

    return profilePhoto;
  };

  const toggleEditMode = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (editMode) {
      fetchUserData();
      console.log("Profile update cancelled");
      setErrorMessage("");
    }
    setEditMode(!editMode);
  };

  const handleProfileUpdate = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const allInputFields = Object.values(userDetails).every(
      (value) => value !== ""
    );

    if (allInputFields) {
      try {
        const docRef = doc(db, "users", auth.currentUser!.uid);
        updateDoc(docRef, { ...userDetails });
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

  return (
    <main className="bg-bgColor w-full flex flex-col items-center gap-4 justify-start">
      <div className="w-4/5 h-fit mx-auto bg-bgColorSecondary rounded-lg flex flex-col lg:flex-row gap-4 items-center justify-center mt-20 px-2 sm:px-4 py-12">
        <div className="w-full sm:w-4/5 lg:w-1/2 xl:w-1/3 flex justify-center">
          <img
            width={400}
            className="w-full max-w-96 max-h-80"
            src={setProfilePhoto()}
            alt="profile photo"
          />
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
                />
                <label>Female</label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={userDetails.gender === "Female"}
                  onChange={handleGenderCheckbox}
                />
                <label>Other</label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={userDetails.gender === "Other"}
                  onChange={handleGenderCheckbox}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 text-white">
            <button
              onClick={toggleEditMode}
              className="bg-primary px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500"
            >
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </button>
            {editMode && (
              <button
                onClick={handleProfileUpdate}
                className="bg-primary px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500"
              >
                Save Profile
              </button>
            )}
          </div>
          {<ErrorMessage message={errorMessage} />}
        </form>
      </div>
      <h2>Your posts</h2>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </main>
  );
};

export default Profile;
