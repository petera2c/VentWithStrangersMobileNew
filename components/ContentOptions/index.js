import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { faEdit } from "@fortawesome/pro-solid-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

//import ConfirmAlertModal from "../modals/ConfirmAlert";
//import ReportModal from "../modals/Report";

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
  const [blockModal, setBlockModal] = useState();
  const [reportModal, setReportModal] = useState();
  const [showOptionsModal, setOptionsModal] = useState();

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOptionsModal(true)}
        style={{ ...styles.pa16 }}
      >
        <FontAwesomeIcon icon={faEllipsisV} style={{ ...styles.colorGrey9 }} />
      </TouchableOpacity>

      {reportModal && (
        <ReportModal
          close={() => setReportModal(false)}
          submit={(option) => {
            if (canUserInteractFunction) return canUserInteractFunction();

            reportFunction(option);
          }}
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their content. Are you sure you would like to block this user?"
          submit={() => {
            if (canUserInteractFunction) return canUserInteractFunction();

            blockUser(userID, objectUserID);
          }}
          title="Block User"
        />
      )}
    </View>
  );
}

function SomeModal() {
  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView behavior="padding" style={{ ...styles.flexFill }}>
        {objectUserID === userID && (
          <View
            className="button-8 clickable align-center justify-between gap8"
            onClick={(e) => {
              e.preventDefault();
              editFunction(objectID);
            }}
          >
            <Text className="ic">Edit</Text>
            <FontAwesomeIcon icon={faEdit} />
          </View>
        )}
        {objectUserID === userID && (
          <View
            className="button-8 clickable align-center justify-between gap8"
            onClick={(e) => {
              e.preventDefault();
              deleteFunction(objectID);
            }}
          >
            <Text className="ic">Delete</Text>
            <FontAwesomeIcon icon={faTrash} />
          </View>
        )}
        {objectUserID !== userID && (
          <View
            className="button-8 clickable align-center justify-between gap8"
            onClick={(e) => {
              e.preventDefault();
              if (canUserInteractFunction) return canUserInteractFunction();

              setReportModal(!reportModal);
            }}
          >
            <Text className="ic">Report</Text>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </View>
        )}
        {objectUserID !== userID && (
          <View
            className="button-8 clickable align-center justify-between gap8"
            onClick={(e) => {
              e.preventDefault();
              if (canUserInteractFunction) return canUserInteractFunction();

              setBlockModal(!blockModal);
            }}
          >
            <Text className="ic">Block User</Text>
            <FontAwesomeIcon icon={faUserLock} />
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default OptionsComponent;
