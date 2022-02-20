import React, { useState } from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { faEdit } from "@fortawesome/pro-solid-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../styles";

import { blockUser } from "../../util";

function OptionsComponent({
  canUserInteractFunction,
  deleteFunction,
  editFunction,
  objectID,
  objectUserID,
  reportFunction,
  userID,
}) {
  const [showOptionsModal, setOptionsModal] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setOptionsModal(true)}>
        <FontAwesomeIcon
          icon={faEllipsisV}
          size={24}
          style={{ ...styles.colorGrey9 }}
        />
      </TouchableOpacity>

      <OptionsModal
        blockUser={blockUser}
        canUserInteractFunction={canUserInteractFunction}
        deleteFunction={deleteFunction}
        editFunction={editFunction}
        objectID={objectID}
        objectUserID={objectUserID}
        reportFunction={reportFunction}
        setOptionsModal={setOptionsModal}
        userID={userID}
        visible={showOptionsModal}
      />
    </View>
  );
}

function OptionsModal({
  blockUser,
  canUserInteractFunction,
  deleteFunction,
  editFunction,
  objectID,
  objectUserID,
  reportFunction,
  setOptionsModal,
  userID,
  visible,
}) {
  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView behavior="padding" style={{ ...styles.flexFill }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setOptionsModal(false);
            Keyboard.dismiss();
          }}
          style={{
            ...styles.fill,
            ...styles.justifyEnd,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <TouchableWithoutFeedback>
            <SafeAreaView
              style={{
                ...styles.bgWhite,
                overflow: "hidden",
                ...styles.br8,
              }}
            >
              <View style={{ ...styles.bgBlue1, ...styles.pa16 }}>
                <Text style={{ ...styles.title }}>Options</Text>
              </View>
              <View style={{ ...styles.pa16 }}>
                {objectUserID === userID && (
                  <TouchableOpacity
                    onPress={() => {
                      editFunction(objectID);
                      setOptionsModal(false);
                    }}
                    style={{
                      ...styles.buttonSecondary,
                      ...styles.fullCenter,
                      ...styles.mb8,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.fs20,
                        ...styles.colorMain,
                        ...styles.tac,
                        ...styles.mr8,
                      }}
                    >
                      Edit
                    </Text>
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{
                        ...styles.colorMain,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {objectUserID === userID && (
                  <TouchableOpacity
                    onPress={() => {
                      deleteFunction(objectID);
                      setOptionsModal(false);
                    }}
                    style={{
                      ...styles.buttonSecondary,
                      ...styles.fullCenter,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.fs20,
                        ...styles.colorMain,
                        ...styles.tac,
                        ...styles.mr8,
                      }}
                    >
                      Delete
                    </Text>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        ...styles.colorMain,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {objectUserID !== userID && (
                  <TouchableOpacity
                    onPress={() => {
                      if (canUserInteractFunction)
                        return canUserInteractFunction();

                      reportFunction();
                      setOptionsModal(false);
                    }}
                    style={{
                      ...styles.buttonSecondary,
                      ...styles.fullCenter,
                      ...styles.mb8,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      style={{
                        ...styles.colorMain,
                        ...styles.mr8,
                      }}
                    />
                    <Text
                      style={{
                        ...styles.fs20,
                        ...styles.colorMain,
                        ...styles.tac,
                      }}
                    >
                      Report
                    </Text>
                  </TouchableOpacity>
                )}
                {objectUserID !== userID && (
                  <TouchableOpacity
                    onPress={() => {
                      if (canUserInteractFunction)
                        return canUserInteractFunction();

                      blockUser(userID, objectUserID);
                    }}
                    style={{
                      ...styles.buttonSecondary,
                      ...styles.fullCenter,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserLock}
                      style={{
                        ...styles.colorMain,
                        ...styles.mr8,
                      }}
                    />
                    <Text
                      style={{
                        ...styles.fs20,
                        ...styles.colorMain,
                        ...styles.tac,
                      }}
                    >
                      Block User
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default OptionsComponent;
