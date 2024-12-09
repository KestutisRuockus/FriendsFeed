import {
  collectionGroup,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { PostProps } from "../pages/types";

export const useFetchPosts = ({
  username = null,
}: { username?: string | null } = {}) => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [lastVisibile, setLastVisible] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const fetchPosts = async (isInitialFetch = false) => {
    if (loading || (!isInitialFetch && !hasMore)) return;

    setLoading(true);
    try {
      let q = query(
        collectionGroup(db, "userPosts"),
        orderBy("date", "desc"),
        limit(5)
      );

      if (username) {
        q = query(
          collectionGroup(db, "userPosts"),
          where("author", "==", username),
          orderBy("date", "desc"),
          limit(5)
        );
      }

      if (!isInitialFetch && lastVisibile) {
        q = query(q, startAfter(lastVisibile));
      }

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();

        return {
          id: doc.id,
          authorId: docData.authorId,
          title: docData.title,
          content: docData.content,
          date: docData.date.seconds,
          author: docData.author,
          comments: docData.comments,
          likesCount: docData.likesCount,
          dislikesCount: docData.dislikesCount,
          imageURL: docData.imageURL,
        };
      }) as PostProps[];

      setPosts((prev) => (isInitialFetch ? data : [...prev, ...data]));
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeDeletedPostFromPostsStateById = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const updatePostsStateById = (
    postId: string,
    newPostValues: Partial<PostProps>
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...newPostValues } : post
      )
    );
  };

  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return {
    posts,
    loading,
    hasMore,
    fetchMorePosts: () => fetchPosts(false),
    removeDeletedPostFromPostsStateById,
    updatePostsStateById,
  };
};
