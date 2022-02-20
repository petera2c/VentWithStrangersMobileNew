import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  get,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { db, db2 } from "../../config/firebase_init";
import { showMessage } from "react-native-flash-message";

import {
  getEndAtValueTimestamp,
  getEndAtValueTimestampFirst,
} from "../../util";

export const conversationListener = (currentConversation, setConversations) => {
  const unsubscribe = onSnapshot(
    doc(db, "conversations", currentConversation.id),
    (doc) => {
      const updatedConversation = { id: doc.id, ...doc.data() };

      setConversations((oldConversations) => {
        const indexOfUpdatedConversation = oldConversations.findIndex(
          (conversation) => conversation.id === updatedConversation.id
        );

        for (let index in updatedConversation) {
          if (!oldConversations[indexOfUpdatedConversation]) continue;
          oldConversations[indexOfUpdatedConversation][index] =
            updatedConversation[index];
        }

        oldConversations.sort((a, b) =>
          a.last_updated < b.last_updated ? 1 : -1
        );

        return [...oldConversations];
      });
    }
  );

  return unsubscribe;
};

export const deleteConversation = async (
  conversationID,
  navigation,
  setActiveConversation,
  setConversations,
  userID
) => {
  setConversations((oldConversations) => {
    const deleteIndex = oldConversations.findIndex(
      (conversation) => conversation.id === conversationID
    );
    oldConversations.splice(deleteIndex, 1);
    return [...oldConversations];
  });

  await updateDoc(doc(db, "conversations", conversationID), {
    [userID]: deleteField(),
    members: arrayRemove(userID),
  });

  setActiveConversation(false);
  navigation.jumpTo("Chats");

  showMessage({
    message: "Success :)!",
    type: "success",
  });
};

export const deleteMessage = async (conversationID, messageID, setMessages) => {
  await deleteDoc(
    doc(db, "conversation_extra_data", conversationID, "messages", messageID)
  );

  setMessages((messages) => {
    messages.splice(
      messages.findIndex((message) => message.id === messageID),
      1
    );
    return [...messages];
  });
  showMessage({
    message: "Message deleted!",
    type: "success",
  });
};

export const getConversationPartnerUserID = (members, userID) => {
  if (members && members.length === 2)
    for (let index in members) {
      if (members[index] !== userID) return members[index];
    }
  return false;
};

export const getIsChatMuted = (conversationID, setIsMuted, userID) => {
  get(ref(db2, "muted/" + conversationID + "/" + userID)).then((doc) => {
    setIsMuted(doc.val());
  });
};

export const isUserTypingListener = (
  conversationID,
  isUserTypingTimeout,
  partnerID,
  scrollToBottom,
  setNumberOfUsersTyping,
  setShowPartnerIsTyping,
  userID
) => {
  let dbRef;
  if (partnerID) {
    dbRef = ref(db2, "is_typing/" + conversationID + "/" + partnerID);

    onValue(dbRef, (snapshot) => {
      if (isTimestampWithinSeconds(snapshot.val())) {
        setShowPartnerIsTyping(true);
        setTimeout(scrollToBottom, 400);

        if (isUserTypingTimeout.current) {
          clearTimeout(isUserTypingTimeout.current);
        }
        isUserTypingTimeout.current = setTimeout(() => {
          setShowPartnerIsTyping(false);
        }, 3000);
      } else {
        setShowPartnerIsTyping(false);
      }
    });
  } else {
    dbRef = ref(db2, conversationID);

    onValue(dbRef, (snapshot) => {
      const test = snapshot.val();
      for (let index in test) {
        if (index === userID) continue;
        if (isTimestampWithinSeconds(test[index])) {
          setNumberOfUsersTyping((currentArray) => {
            if (currentArray.findIndex((userID) => userID === index) !== -1)
              return currentArray;
            else {
              currentArray.push(index);
              return [...currentArray];
            }
          });
          setTimeout(scrollToBottom, 400);

          if (isUserTypingTimeout.current) {
            clearTimeout(isUserTypingTimeout.current);
          }
          isUserTypingTimeout.current = setTimeout(() => {
            setNumberOfUsersTyping((currentArray) => {
              currentArray.splice(
                currentArray.findIndex((userID) => userID === index),
                1
              );
              return [...currentArray];
            });
          }, 3000);
        }
      }
    });
  }

  return dbRef;
};

export const isTimestampWithinSeconds = (timestamp) => {
  return Timestamp.now().toMillis() - timestamp < 4000;
};

export const messageListener = (
  conversationID,
  scrollToBottom,
  setMessages,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversation_extra_data", conversationID, "messages"),
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
          setMessages((oldMessages) => [
            ...oldMessages,
            {
              id: querySnapshot.docs[0].id,
              ...querySnapshot.docs[0].data(),
              doc: querySnapshot.docs[0],
            },
          ]);
          setTimeout(() => {
            scrollToBottom();
          }, 200);
        }
      }
    }
  );

  return unsubscribe;
};

export const getConversations = async (
  conversations,
  setConversations,
  userID
) => {
  const startAt = getEndAtValueTimestamp(conversations);

  const conversationsQuerySnapshot = await getDocs(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      orderBy("last_updated", "desc"),
      startAfter(startAt),
      limit(5)
    )
  );

  let newConversations = [];
  conversationsQuerySnapshot.docs.forEach((item, i) => {
    newConversations.push({
      id: item.id,
      ...item.data(),
      doc: conversationsQuerySnapshot.docs[i],
    });
  });

  setConversations(newConversations);
};

export const getMessages = async (
  conversationID,
  messages,
  scrollToBottom,
  setCanLoadMore,
  setMessages,
  first = true
) => {
  let startAt = getEndAtValueTimestampFirst(messages);
  if (first) startAt = getEndAtValueTimestampFirst([]);

  const snapshot = await getDocs(
    query(
      collection(db, "conversation_extra_data", conversationID, "messages"),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newMessages = [];
    snapshot.docs.forEach((doc) => {
      newMessages.unshift({ id: doc.id, doc, ...doc.data() });
    });

    if (newMessages.length < 10) setCanLoadMore(false);
    if (first) {
      setMessages(newMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } else {
      setMessages((oldMessages) => {
        if (oldMessages) return [...newMessages, ...oldMessages];
        else return newMessages;
      });
    }
  } else {
    setMessages([]);
    setCanLoadMore(false);
  }
};

export const mostRecentConversationListener = (
  setConversations,
  userID,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      where("last_updated", ">=", Timestamp.now().toMillis()),
      orderBy("last_updated", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      const conversationDoc = querySnapshot.docs[0];

      if (first) {
        first = false;
      } else if (conversationDoc) {
        setConversations((oldConversations) => {
          const isConversationAlreadyListening = oldConversations.some(
            (obj) => obj.id === conversationDoc.id
          );

          if (!isConversationAlreadyListening)
            return [
              ...oldConversations,
              {
                doc: conversationDoc,
                id: conversationDoc.id,
                ...conversationDoc.data(),
              },
            ];
          else return oldConversations;
        });
      }
    }
  );

  return unsubscribe;
};

export const muteChat = async (conversationID, userID, value) => {
  set(ref(db2, "muted/" + conversationID + "/" + userID), value);
};

export const readConversation = async (conversation, userID) => {
  await updateDoc(doc(db, "conversations", conversation.id), {
    [userID]: true,
    go_to_inbox: false,
  });
};

export const sendMessage = async (conversationID, message, userID) => {
  await addDoc(
    collection(db, "conversation_extra_data", conversationID, "messages"),
    {
      body: message,
      server_timestamp: Timestamp.now().toMillis(),
      userID,
    }
  );
};

export const setConversationIsTyping = (
  conversationID,
  finishedTyping,
  userID
) => {
  if (conversationID && userID)
    update(ref(db2, "is_typing/" + conversationID), {
      [userID]: finishedTyping ? false : serverTimestamp(),
    });
};

export const setInitialConversationsAndActiveConversation = async (
  newConversations,
  openFirstChat,
  route,
  setActiveConversation,
  setCanLoadMore,
  setConversations
) => {
  const search =
    route && route.params && route.params.chatID ? route.params.chatID : null;

  console.log(search);

  if (newConversations.length < 5) setCanLoadMore(false);

  if (search) {
    const foundConversation = newConversations.find(
      (conversation) => conversation.id === search
    );

    if (foundConversation) setActiveConversation(foundConversation);
    else {
      try {
        const conversationDoc = await getDoc(doc(db, "conversations", search));

        if (conversationDoc.exists())
          setActiveConversation({
            id: conversationDoc.id,
            doc: conversationDoc,
            ...conversationDoc.data(),
          });
        else setActiveConversation(false);
      } catch (e) {
        console.log(e);
      }
    }
  } else if (openFirstChat && newConversations.length > 0) {
    setActiveConversation(newConversations[0]);
  } else setActiveConversation(false);

  setConversations(newConversations);
};
