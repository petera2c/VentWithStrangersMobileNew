import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { db, db2 } from "../config/firebase_init";
import dayjs from "dayjs";

export const getIsUsersBirthday = async (setIsUsersBirthday, userID) => {
  const userInfoDoc = await getDoc(doc(db, "users_info", userID));

  if (
    userInfoDoc.data() &&
    userInfoDoc.data().birth_date &&
    new dayjs(userInfoDoc.data().birth_date).format("MMDD") ===
      new dayjs().format("MMDD") &&
    (!userInfoDoc.data().last_birthday ||
      new dayjs().diff(new dayjs(userInfoDoc.data().last_birthday), "day") >=
        365)
  ) {
    setIsUsersBirthday(true);
    await updateDoc(doc(db, "users_info", userInfoDoc.id), {
      last_birthday: Timestamp.now().toMillis(),
    });
  }
};

export const getIsUserSubscribed = async (setUserSubscription, userID) => {
  const userSubscriptionDoc = await getDoc(
    doc(db, "user_subscription", userID)
  );

  if (userSubscriptionDoc.data())
    setUserSubscription(userSubscriptionDoc.data());
};

export const newRewardListener = (setNewReward, userID, first = true) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "rewards"),
      where("userID", "==", userID),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        setNewReward(() => {
          return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          };
        });
      }
    }
  );

  return unsubscribe;
};

export const registerForPushNotificationsAsync = async (user) => {
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    const userExpoTokensDoc = await db
      .collection("user_expo_tokens")
      .doc(user.uid)
      .get();

    let hasAlreadySavedToken = false;
    if (userExpoTokensDoc.data())
      for (let index in userExpoTokensDoc.data().tokens) {
        if (token === userExpoTokensDoc.data().tokens[index])
          hasAlreadySavedToken = true;
      }

    if (!hasAlreadySavedToken && !userExpoTokensDoc.exists) {
      await db
        .collection("user_expo_tokens")
        .doc(user.uid)
        .set({
          tokens: firebase.firestore.FieldValue.arrayUnion(token),
        });
    } else if (!hasAlreadySavedToken && userExpoTokensDoc.exists) {
      await db
        .collection("user_expo_tokens")
        .doc(user.uid)
        .update({
          tokens: firebase.firestore.FieldValue.arrayUnion(token),
        });
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

export const setUserOnlineStatus = async (status, uid) => {
  if (status === "online")
    await set(ref(db2, "status/" + uid), {
      index: new dayjs().valueOf(),
      last_online: serverTimestamp(),
      state: status,
    });
  else
    await set(ref(db2, "status/" + uid), {
      last_online: serverTimestamp(),
      state: status,
    });

  return;
};

export const setIsUserOnlineToDatabase = (uid) => {
  if (!uid) return;

  const connectedRef = ref(db2, ".info/connected");
  const userStatusDatabaseRef = ref(db2, "status/" + uid);

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      set(userStatusDatabaseRef, {
        index: new dayjs().valueOf(),
        last_online: serverTimestamp(),
        state: "online",
      });
      onDisconnect(userStatusDatabaseRef).set({
        last_online: serverTimestamp(),
        state: "offline",
      });
    }
  });
};
