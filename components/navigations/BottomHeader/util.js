import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebase_init";
import { getEndAtValueTimestamp } from "../../../util";

export const conversationsListener = (navigation, userID) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      orderBy("last_updated", "desc"),
      limit(1)
    ),
    (snapshot) => {
      if (snapshot.docs && snapshot.docs[0]) {
        const doc = snapshot.docs[0];
        if (doc.data().go_to_inbox)
          navigation.navigate("Chats", { chatID: doc.id });
      }
    }
  );

  return unsubscribe;
};

export const getNotifications = async (
  notifications,
  setCanShowLoadMore,
  setNotificationCounter,
  setNotifications,
  user
) => {
  let startAt = getEndAtValueTimestamp(notifications);

  const snapshot = await getDocs(
    query(
      collection(db, "notifications"),
      where("userID", "==", user.uid),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  let newNotifications = [];

  let notificationCounter = 0;
  for (let index in snapshot.docs) {
    if (!snapshot.docs[index].data().hasSeen) notificationCounter++;

    newNotifications.push({
      id: snapshot.docs[index].id,
      ...snapshot.docs[index].data(),
      doc: snapshot.docs[index],
    });
  }
  if (setNotificationCounter) setNotificationCounter(notificationCounter);

  if (newNotifications.length < 10 && setCanShowLoadMore)
    setCanShowLoadMore(false);

  setNotifications((oldNotifications) => {
    if (
      oldNotifications &&
      oldNotifications.length > 0 &&
      notifications &&
      notifications.length > 0
    )
      return [...oldNotifications, ...newNotifications];
    else return newNotifications;
  });
};

export const newNotificationsListener = (
  setNotificationCounter,
  setNotifications,
  user,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "notifications"),
      where("userID", "==", user.uid),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (snapshot) => {
      if (first) {
        first = false;
      } else if (
        snapshot.docs &&
        snapshot.docs[0] &&
        !snapshot.docs[0].data().hasSeen
      ) {
        setNotificationCounter((oldAmount) => {
          oldAmount++;
          return oldAmount;
        });

        setNotifications((oldNotifications) => [
          {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
            doc: snapshot.docs[0],
          },
          ...oldNotifications,
        ]);
      }
    }
  );
  return unsubscribe;
};

export const getUnreadConversations = (
  pathname,
  setUnreadConversations,
  userID
) => {
  const unsubscribe = onSnapshot(
    doc(db, "unread_conversations_count", userID),
    (doc) => {
      if (doc.data() && doc.data().count) {
        if (pathname === "/chat" && doc.data().count > 0) {
          return resetUnreadConversationCount(setUnreadConversations, userID);
        }

        setUnreadConversations(doc.data().count);
      } else {
        setUnreadConversations(0);
      }
    }
  );

  return unsubscribe;
};

export const howCompleteIsUserProfile = (
  setMissingAccountPercentage,
  userBasicInfo
) => {
  let percentage = 0;

  if (userBasicInfo.gender) percentage += 0.125;
  if (userBasicInfo.pronouns) percentage += 0.125;
  if (userBasicInfo.birth_date) percentage += 0.125;
  if (userBasicInfo.partying) percentage += 0.125;
  if (userBasicInfo.politicalBeliefs) percentage += 0.125;
  if (userBasicInfo.education) percentage += 0.125;
  if (userBasicInfo.kids) percentage += 0.125;
  if (userBasicInfo.avatar) percentage += 0.125;

  setMissingAccountPercentage(percentage);
};

export const readNotifications = (notifications, setNotificationCounter) => {
  for (let index in notifications) {
    const notification = notifications[index];
    if (!notification.hasSeen) {
      updateDoc(doc(db, "notifications", notification.id), {
        hasSeen: true,
      });
    }
  }
  if (setNotificationCounter) setNotificationCounter(0);
};

export const resetUnreadConversationCount = (
  setUnreadConversationsCount,
  userID
) => {
  setDoc(doc(db, "unread_conversations_count", userID), { count: 0 });
  setUnreadConversationsCount(0);
};
