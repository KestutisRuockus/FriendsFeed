import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useRef, useState } from "react";

type UsersProps = {
  userId: string;
  name: string;
};

export const useFetchUsers = () => {
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const hasFetched = useRef(false);

  const fetchUsers = async () => {
    const recordsLimitPerFetch = 20;

    if (loading || !hasMore) return;

    hasFetched.current = true;
    setLoading(true);
    try {
      let q = query(collection(db, "users"), limit(recordsLimitPerFetch));

      if (lastVisible) {
        q = query(
          collection(db, "users"),
          startAfter(lastVisible),
          limit(recordsLimitPerFetch)
        );
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const usersData = await Promise.all(
        querySnapshot.docs.map(async (doc) => ({
          userId: doc.id,
          name: doc.data().name,
        }))
      );

      setUsers((prev) => [...prev, ...usersData]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === recordsLimitPerFetch);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { users, fetchUsers, loading, hasMore };
};
