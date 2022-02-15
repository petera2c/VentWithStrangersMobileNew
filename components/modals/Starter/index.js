import React, { useEffect, useState } from "react";
import { View } from "react-native";

import LoginModal from "../Login";
import SignUpModal from "../SignUp";
import ForgotPasswordModal from "../ForgotPassword";

function StarterModal({ activeModal = "", setActiveModal }) {
  const [localActiveModal, setLocalActiveModal] = useState(activeModal);

  useEffect(() => {
    setLocalActiveModal(activeModal);
  }, [activeModal]);

  return (
    <View>
      {(localActiveModal === "login" || localActiveModal === true) && (
        <LoginModal
          setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        />
      )}
      {localActiveModal === "signUp" && (
        <SignUpModal
          setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        />
      )}
      {localActiveModal === "forgotPassword" && (
        <ForgotPasswordModal
          setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        />
      )}
    </View>
  );
}

export default StarterModal;
