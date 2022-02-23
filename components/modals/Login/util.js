import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { showMessage } from "react-native-flash-message";

import { registerForPushNotificationsAsync } from "../../../screens/util";

export const login = ({ email, password }, setActiveModal) => {
  signInWithEmailAndPassword(getAuth(), email.replace(/ /g, ""), password)
    .then((res) => {
      registerForPushNotificationsAsync(res.user);
      setActiveModal();
    })
    .catch((error) => {
      showMessage({ message: error.message, type: "error" });
    });
};
