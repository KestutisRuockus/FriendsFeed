import Post from "../../components/posts/Post"
import { useFetchPosts } from "../../hooks/useFetchPosts"

const Home = () => {

  const { posts } = useFetchPosts();

  return (
    <main className="bg-bgColor w-full flex flex-col items-center py-8" >
      {posts.map((post) => <Post key={post.id} post={post}/>)}
    </main>
  )
}

export default Home