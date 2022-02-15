import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export const sendPasswordReset = ({ email }) => {
  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      // Email sent.
      alert("Email password reset link sent!");
    })
    .catch((error) => {
      message.error(error);
    });
};
