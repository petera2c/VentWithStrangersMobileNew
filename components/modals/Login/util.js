import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { registerForPushNotificationsAsync } from "../../../screens/util";

export const login = ({ email, password }, setActiveModal) => {
  signInWithEmailAndPassword(getAuth(), email, password)
    .then((res) => {
      registerForPushNotificationsAsync(res.user);
      setActiveModal();
    })
    .catch((error) => {
      alert(error);
    });
};
