import {
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase_init";

export const isUserInQueueListener = (setIsUserInQueue, userID) => {
  const unsubscribe = onSnapshot(doc(db, "chat_queue", userID), (doc) => {
    if (doc.data() && doc.data().userID === userID) setIsUserInQueue(true);
    else setIsUserInQueue(false);
  });

  return unsubscribe;
};

export const joinQueue = async (userID) => {
  await setDoc(doc(db, "chat_queue", userID), {
    server_timestamp: Timestamp.now().toMillis(),
    userID,
  });
};

export const leaveQueue = async (userID) => {
  await deleteDoc(doc(db, "chat_queue", userID));
};
