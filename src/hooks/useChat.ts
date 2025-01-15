import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";

type ChatData = {
  id: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
};

type Messages = {
  id: string;
  content: string;
  sender: string;
  timestamp?: Date | undefined;
};

const useChat = (userId1: string, userId2: string) => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<Messages[]>([]);

  const sendMessage = async (content: string, senderId: string) => {
    if (!chatData) {
      console.error("Chat not initialized");
      return;
    }

    try {
      const message = {
        senderId,
        content,
        timestamp: serverTimestamp(),
      };

      const messageRef = collection(db, "chats", chatData!.id, "messages");
      await addDoc(messageRef, message);

      const chatRef = doc(db, "chats", chatData!.id);
      await updateDoc(chatRef, {
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatId =
          userId1 > userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
        const chatsRef = doc(db, "chats", chatId);

        const chatSnap = await getDoc(chatsRef);

        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          setChatData({
            id: chatSnap.id,
            participants: chatData.participants || [],
            createdAt: chatData.createdAt?.toDate() || new Date(),
            updatedAt: chatData.updatedAt?.toDate() || new Date(),
          });

          const messageRef = collection(db, "chats", chatSnap.id, "messages");
          const messageQuery = query(messageRef, orderBy("timestamp", "asc"));

          const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
            const fetchedMessages: Messages[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              const message: Messages = {
                id: doc.id,
                content: data.content,
                sender: data.senderId,
                timestamp: data.timestamp?.toDate(),
              };
              fetchedMessages.push(message);
            });
            setMessages(fetchedMessages);
          });

          return () => unsubscribe();
        } else {
          const newChat = {
            participants: [userId1, userId2],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await setDoc(chatsRef, newChat);
          setChatData({ id: chatId, ...newChat });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [userId1, userId2]);

  return { chatData, loading, sendMessage, messages };
};

export default useChat;
