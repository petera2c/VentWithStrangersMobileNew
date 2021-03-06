import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase_init";
import { showMessage } from "react-native-flash-message";

import { styles } from "../../styles";

export const deleteComment = async (commentID, setComments) => {
  await deleteDoc(doc(db, "comments", commentID));

  if (setComments)
    setComments((comments) => {
      comments.splice(
        comments.findIndex((comment) => comment.id === commentID),
        1
      );
      return [...comments];
    });
  showMessage({
    message: "Comment deleted!",
    type: "success",
  });
};

export const getCommentHasLiked = async (commentID, setHasLiked, userID) => {
  const snapshot = await getDoc(
    doc(db, "comment_likes", commentID + "|||" + userID)
  );

  if (!snapshot || !snapshot.data()) return;
  let value = snapshot.data();
  value = value.liked;
  setHasLiked(Boolean(value));
};

export const likeOrUnlikeComment = async (comment, hasLiked, user) => {
  if (!user)
    return showMessage({
      message: "You must sign in or register an account to support a comment!",
      type: "info",
    });

  await setDoc(doc(db, "comment_likes", comment.id + "|||" + user.uid), {
    liked: !hasLiked,
    commentID: comment.id,
    userID: user.uid,
  });
};

export const reportComment = async (commentID, userID, ventID) => {
  await setDoc(doc(db, "comment_reports", commentID + "|||" + userID), {
    commentID,
    userID,
    ventID,
  });

  showMessage({
    message: "Report successful :)",
    type: "success",
  });
};

export const swapTags = (commentText, navigation) => {
  if (!commentText) return;
  const regexFull = /@\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\([\x21-\x5A|\x61-\x7A]+\)/gi;
  const regexDisplay = /\[[\x21-\x5A|\x61-\x7A|\x5f]+\]/gi;

  let listOfTaggedDisplayNames = [];

  commentText.replace(regexFull, (possibleTag, index) => {
    const displayNameArray = possibleTag.match(regexDisplay);

    if (displayNameArray && displayNameArray[0]) {
      let displayTag = displayNameArray[0];
      if (displayTag)
        displayTag = "@" + displayTag.slice(1, displayTag.length - 1);

      listOfTaggedDisplayNames.push({
        start: index,
        end: possibleTag.length + index,
        value: displayTag,
        id: displayTag[1],
      });
      return displayNameArray[0];
    } else return possibleTag;
  });

  if (listOfTaggedDisplayNames.length === 0) return commentText;
  else {
    return [
      ...listOfTaggedDisplayNames.map((obj, index) => {
        return [
          commentText.slice(0, obj.start),
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Profile", { userID: obj.id })}
            style={{
              marginBottom: -3,
            }}
          >
            <Text style={{ ...styles.fs20, ...styles.colorMain }}>
              {obj.value}
            </Text>
          </TouchableOpacity>,
        ];
      }),
      commentText.slice(
        listOfTaggedDisplayNames[listOfTaggedDisplayNames.length - 1].end,
        commentText.length
      ),
    ];
  }
};
