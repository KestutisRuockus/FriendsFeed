import Post from "../../components/features/posts/Post";
import { useFetchPosts } from "../../hooks/useFetchPosts";

const Home = () => {
  const { posts, removeDeletedPostFromPostsStateById, updatePostsStateById } =
    useFetchPosts();

  return (
    <main className="bg-bgColor w-full flex flex-col items-center py-8">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          removeDeletedPostFromPostsStateById={
            removeDeletedPostFromPostsStateById
          }
          updatePostsStateById={updatePostsStateById}
        />
      ))}
    </main>
  );
};

export default Home;
