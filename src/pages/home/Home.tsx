import Post from "../../components/features/posts/Post";
import { useFetchPosts } from "../../hooks/useFetchPosts";
import LoadingPostSkeleton from "../../utils/LoadingPostSkeleton";

const Home = () => {
  const {
    posts,
    loading,
    removeDeletedPostFromPostsStateById,
    updatePostsStateById,
  } = useFetchPosts();

  if (loading) {
    return <LoadingPostSkeleton />;
  }

  return (
    <main className="bg-bgColor w-full flex gap-4 flex-col items-center py-8">
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
