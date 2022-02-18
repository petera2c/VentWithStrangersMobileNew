import React, { useEffect, useState } from "react";
import { View } from "react-native";

import LoginModal from "../Login";
import SignUpModal from "../SignUp";
import ForgotPasswordModal from "../ForgotPassword";

function StarterModal({
  activeModal = "",
  navigation,
  setActiveModal,
  visible,
}) {
  const [localActiveModal, setLocalActiveModal] = useState(activeModal);

  useEffect(() => {
    if (activeModal !== localActiveModal) setLocalActiveModal(activeModal);
  }, [activeModal]);

  if (localActiveModal === "signUp")
    return (
      <SignUpModal
        navigation={navigation}
        setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        visible={visible}
      />
    );
  else if (localActiveModal === "forgotPassword")
    return (
      <ForgotPasswordModal
        setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        visible={visible}
      />
    );
  else
    return (
      <LoginModal
        setActiveModal={setActiveModal ? setActiveModal : setLocalActiveModal}
        visible={visible}
      />
    );
}

export default StarterModal;
