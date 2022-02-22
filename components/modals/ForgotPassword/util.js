import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { showMessage } from "react-native-flash-message";

export const sendPasswordReset = ({ email }) => {
  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      // Email sent.
      showMessage({
        message: "Email password reset link sent!",
        type: "success",
      });
    })
    .catch((error) => {
      showMessage({
        message: error.message,
        type: "error",
      });
    });
};
