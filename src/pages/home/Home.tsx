import { useCallback, useRef } from "react";
import Post from "../../components/features/posts/Post";
import { useFetchPosts } from "../../hooks/useFetchPosts";
import LoadingPostSkeleton from "../../utils/LoadingPostSkeleton";

const Home = () => {
  const {
    posts,
    loading,
    hasMore,
    fetchPosts,
    removeDeletedPostFromPostsStateById,
    updatePostsStateById,
  } = useFetchPosts();

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

  return (
    <main className="bg-bgColor w-full flex gap-4 flex-col items-center py-8">
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

export default Home;
