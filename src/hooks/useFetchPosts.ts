import { collection, DocumentData, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../firebase/firebaseConfig";
import { PostProps } from "../pages/types";


export const useFetchPosts = ( { userEmail = null }: { userEmail?: string | null } = {} ) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [lastVisibile, setLastVisible] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const fetchPosts = async ( isInitialFetch = false ) => {
        if( loading || !isInitialFetch && !hasMore) return;

        setLoading(true);
        try {
            let q = query(
                collection(db, 'posts'),
                orderBy('date', 'desc'),
                limit(5)
            )

            if( userEmail ) {
                q = query(
                    collection(db, 'posts'),
                    where('author', "==", userEmail),
                    limit(5)
                );
            }

            if(!isInitialFetch && lastVisibile) {
                q = query(q, startAfter(lastVisibile));
            }

            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty){
                setHasMore(false);
                setLoading(false);
                return;
            }

            const data = querySnapshot.docs.map((doc) => {
                const docData = doc.data();

                return {
                    id: doc.id,
                    title: docData.title,
                    content: docData.content,
                    date: docData.date.seconds,
                    author: docData.author,
                    comments: docData.comments,
                    like: docData.like,
                    dislike: docData.dislike,
                    imageURL: docData.imageURL,
                  };
                }) as PostProps[];

            setPosts((prev) => (isInitialFetch ? data : [...prev, ...data]));
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        } catch (error) {
            if(error instanceof Error) {
                console.log(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts(true)
    }, [userEmail]);

    return { posts, loading, hasMore, fetchMorePosts: () => fetchPosts(false) };
}