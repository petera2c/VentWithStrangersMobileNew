import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase_init";
import { showMessage } from "react-native-flash-message";

import {
  getEndAtValueTimestamp,
  getEndAtValueTimestampAsc,
  userSignUpProgress,
} from "../../util";

const incrementVentCounter = (attributeToIncrement, shouldIncrease, vent) => {
  const newVent = { ...vent };
  if (shouldIncrease)
    newVent[attributeToIncrement] = newVent[attributeToIncrement] + 1;
  else newVent[attributeToIncrement] = newVent[attributeToIncrement] - 1;
  return newVent;
};

export const commentVent = async (
  commentString,
  setVent,
  user,
  vent,
  ventID
) => {
  let commentObj = {
    like_counter: 0,
    server_timestamp: Timestamp.now().toMillis(),
    text: commentString,
    userID: user.uid,
    ventID,
  };

  setVent(incrementVentCounter("comment_counter", true, vent));

  await addDoc(collection(db, "comments"), commentObj);

  return true;
};

export const deleteVent = async (navigation, ventID) => {
  await deleteDoc(doc(db, "vents", ventID));

  showMessage({
    message: "Vent deleted!",
    type: "success",
  });

  navigation.jumpTo("Feed");
};

export const findPossibleUsersToTag = async (
  currentTypingWord,
  ventID,
  callback
) => {
  if (currentTypingWord) {
    const snapshot = await getDocs(
      query(
        collection(db, "users_display_name"),
        where("displayName", ">=", currentTypingWord),
        where("displayName", "<=", currentTypingWord + "\uf8ff"),
        limit(10)
      )
    );
    let users;

    if (snapshot && snapshot.docs && snapshot.docs.length > 0)
      users = snapshot.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,
        doc,
      }));

    if (users)
      callback(
        users.map((user, index) => {
          return { id: user.id, display: user.displayName, ...user };
        })
      );
  }
};

export const getVent = async (setVent, ventID) => {
  const ventDoc = await getDoc(doc(db, "vents", ventID));

  if (!ventDoc.exists()) return;
  const newVent = ventDoc.data();

  setVent({
    id: ventDoc.id,
    ...newVent,
  });
};

export const getVentFullLink = (vent) => {
  const partialLink =
    "/vent/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  return "https://www.ventwithstrangers.com" + partialLink;
};

export const getVentPartialLink = (vent) => {
  return (
    "/vent/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

export const newVentCommentListener = (
  setCanLoadMoreComments,
  setComments,
  userID,
  ventID,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "comments"),
      where("ventID", "==", ventID),
      where("server_timestamp", ">=", Timestamp.now().toMillis()),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        if (
          querySnapshot.docChanges()[0].type === "added" ||
          querySnapshot.docChanges()[0].type === "removed"
        ) {
          if (querySnapshot.docs[0].data().userID === userID)
            setComments((oldComments) => [
              ...oldComments,
              {
                ...querySnapshot.docs[0].data(),
                id: querySnapshot.docs[0].id,
                doc: querySnapshot.docs[0],
                useToPaginate: false,
              },
            ]);
          else setCanLoadMoreComments(true);
        }
      }
    }
  );

  return unsubscribe;
};

export const getVentComments = async (
  activeSort,
  comments,
  setCanLoadMoreComments,
  setComments,
  useOldComments,
  ventID
) => {
  let snapshot;
  if (activeSort === "First") {
    snapshot = await getDocs(
      query(
        collection(db, "comments"),
        where("ventID", "==", ventID),
        orderBy("server_timestamp"),
        startAfter(getEndAtValueTimestampAsc(comments)),
        limit(10)
      )
    );
  } else if (activeSort === "Best") {
    snapshot = await getDocs(
      query(
        collection(db, "comments"),
        where("ventID", "==", ventID),
        orderBy("like_counter", "desc"),
        startAfter(getEndAtValueTimestamp(comments)),
        limit(10)
      )
    );
  } else if (activeSort === "Last") {
    snapshot = await getDocs(
      query(
        collection(db, "comments"),
        where("ventID", "==", ventID),
        orderBy("server_timestamp", "desc"),
        startAfter(getEndAtValueTimestamp(comments)),
        limit(10)
      )
    );
  }

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newComments = [];
    snapshot.docs.forEach((doc, index) => {
      if (comments && comments.find((comment) => comment.id === doc.id)) return;
      else
        newComments.push({
          ...doc.data(),
          id: doc.id,
          doc,
          useToPaginate: true,
        });
    });

    if (newComments.length < 10) setCanLoadMoreComments(false);
    else setCanLoadMoreComments(true);

    setComments((oldComments) => {
      if (oldComments && useOldComments) {
        let returnComments = [...oldComments, ...newComments];

        if (activeSort === "first") {
          returnComments.sort((a, b) => {
            if (a.server_timestamp < b.server_timestamp) return -1;
            if (a.server_timestamp > b.server_timestamp) return 1;
            return 0;
          });
        } else if (activeSort === "best") {
          returnComments.sort((a, b) => {
            if (a.like_counter < b.like_counter) return 1;
            if (a.like_counter > b.like_counter) return -1;

            if (a.server_timestamp < b.server_timestamp) return -1;
            if (a.server_timestamp > b.server_timestamp) return 1;
            return 0;
          });
        } else if (activeSort === "last") {
          returnComments.sort((a, b) => {
            if (a.server_timestamp < b.server_timestamp) return 1;
            if (a.server_timestamp > b.server_timestamp) return -1;
            return 0;
          });
        }

        return returnComments;
      } else return newComments;
    });
  } else {
    setComments([]);
  }
};

export const ventHasLiked = async (setHasLiked, userID, ventID) => {
  const ventHasLikedDoc = await getDoc(
    doc(db, "vent_likes", ventID + "|||" + userID)
  );

  if (!ventHasLikedDoc.exists()) return;
  let value = ventHasLikedDoc.data();
  if (value) value = value.liked;

  setHasLiked(Boolean(value));
};

export const likeOrUnlikeVent = async (
  hasLiked,
  setHasLiked,
  setVent,
  user,
  vent
) => {
  setHasLiked(!hasLiked);

  setVent(incrementVentCounter("like_counter", !hasLiked, vent));

  await setDoc(doc(db, "vent_likes", vent.id + "|||" + user.uid), {
    liked: !hasLiked,
    userID: user.uid,
    ventID: vent.id,
  });
};

export const reportVent = async (userID, ventID) => {
  await setDoc(doc(db, "vent_reports", ventID + "|||" + userID), {
    userID,
    ventID,
  });

  showMessage({
    message: "Report successful :)",
    type: "success",
  });
};

export const tagUser = (
  callback,
  commentString,
  currentTypingIndex,
  taggedUsers,
  user
) => {
  if (!callback || !commentString || !currentTypingIndex || !user) return;

  const taggedUser = {
    display: user._id,
    id: user._id,
  };

  taggedUsers.push(taggedUser);

  return callback({
    commentString,
    possibleUsersToTag: undefined,
    taggedUsers,
  });
};

export const startConversation = async (navigation, user, ventUserID) => {
  const userInteractionIssues = userSignUpProgress(user);
  if (userInteractionIssues) return false;

  const sortedMemberIDs = [user.uid, ventUserID].sort();
  const conversationQuerySnapshot = await getDocs(
    query(
      collection(db, "conversations"),
      where("members", "==", sortedMemberIDs)
    )
  );

  const goToPage = (conversationID) => {
    navigation.navigate("Chat", { conversationID });
  };

  let found;
  for (let index in conversationQuerySnapshot.docs) {
    if (!conversationQuerySnapshot.docs[index].data().is_group)
      found = conversationQuerySnapshot.docs[index].id;
  }

  if (found) {
    goToPage(found);
  } else {
    let tempHasSeenObject = {};
    for (let index in sortedMemberIDs) {
      tempHasSeenObject[sortedMemberIDs[index]] = false;
    }

    const conversationDocNew = await addDoc(collection(db, "conversations"), {
      last_updated: Timestamp.now().toMillis(),
      members: sortedMemberIDs,
      server_timestamp: Timestamp.now().toMillis(),
      ...tempHasSeenObject,
    });
    goToPage(conversationDocNew.id);
  }
};
