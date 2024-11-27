import Post from "../components/posts/Post"
import { auth } from "../firebase/firebaseConfig";

const Home = () => {
  console.log(auth.currentUser);
  return (
    <main className="bg-bgColor w-full flex flex-col items-center py-8">
      <Post />
    </main>
  )
}

export default Home