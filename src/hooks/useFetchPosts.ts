import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
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
import { getDownloadURL, getStorage, list, ref } from "firebase/storage";

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

      const postData = (await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const docData = doc.data();

          const commentsRef = collection(
            db,
            `posts/${docData.authorId}/userPosts/${doc.id}/comments`
          );
          const commentSnapshot = await getDocs(commentsRef);

          const comments = await Promise.all(
            commentSnapshot.docs.map(async (comment) => {
              const commentData = comment.data();
              const commentatorProfileImage = await getProfileImageByUserId(
                commentData.commentatorId
              );
              return {
                postAuthorId: commentData.postAuthorId,
                postId: commentData.postId,
                commentId: comment.id,
                commentatorProfileImage,
                commentatorId: commentData.commentatorId,
                commentText: commentData.commentText,
                date: commentData.date,
              };
            })
          );

          const sortedComments = comments.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

          return {
            id: doc.id,
            authorId: docData.authorId,
            authorProfileImage: await getProfileImageByUserId(docData.authorId),
            title: docData.title,
            content: docData.content,
            date: docData.date.seconds,
            author: docData.author,
            likesCount: docData.likesCount,
            dislikesCount: docData.dislikesCount,
            imageURL: docData.imageURL,
            comments: sortedComments,
          };
        })
      )) as PostProps[];

      const allCommentatorsIds = Array.from(
        new Set(
          postData.flatMap((post) =>
            post.comments?.map((comment) => comment.commentatorId)
          )
        )
      );

      const validCommentatorIds = allCommentatorsIds.filter(
        (id) => id !== undefined
      );

      const commentatorsDocs = await Promise.all(
        validCommentatorIds.map((id) => getDoc(doc(db, "users", id)))
      );

      const commentatorsNameMap = commentatorsDocs.reduce((map, docSnap) => {
        if (docSnap.exists()) {
          map[docSnap.id] = docSnap.data().name;
        }
        return map;
      }, {} as Record<string, string>);

      const updatedPosts: PostProps[] = postData.map((post) => ({
        ...post,
        comments: post.comments
          ? post.comments?.map((comment) => ({
              ...comment,
              commentatorName:
                commentatorsNameMap[comment.commentatorId] || "Unknown",
            }))
          : null,
      }));

      setPosts((prev) =>
        isInitialFetch ? updatedPosts : [...prev, ...updatedPosts]
      );
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

  const getProfileImageByUserId = async (userId: string) => {
    try {
      const storage = getStorage();
      const folderRef = ref(storage, `/profileImages/${userId}/`);

      const { items } = await list(folderRef, { maxResults: 1 });

      if (items.length > 0) {
        const firstItemRef = items[0];
        const url = await getDownloadURL(firstItemRef);
        return url;
      } else {
        console.warn("No profile image found in the folder.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }
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
