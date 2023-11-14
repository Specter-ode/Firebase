import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.config";

const authService = {
  signUp: async (user, role) => {
    try {
      const { name, email, password, phone } = user;
      // создание аккаунта
      const data = await createUserWithEmailAndPassword(auth, email, password);
      console.log("data: ", data);

      // добавление имени юзеру при регистрации
      await updateProfile(auth.currentUser, { displayName: name });
      // обновление юзера
      // первый параметр database, второй - имя коллекции, userID в коллекции которому нужно внести изменения
      await setDoc(doc(db, "users", `${auth.currentUser.uid}`), {
        role,
        phoneNumber: phone,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
      });
      return data;
    } catch (error) {}
  },

  signIn: async (email, password) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    return data;
  },

  logOut: async () => {
    await signOut(auth);
  },

  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);
    return data;
  },
  signInWithFacebook: async () => {
    const provider = new FacebookAuthProvider();
    const data = await signInWithPopup(auth, provider);
    return data;
  },

  resetEmail: async (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Ссылка для сброса пароля отправлена
        console.log("Password reset email sent");
      })
      .catch((error) => {
        // Обработка ошибок отправки
        console.error(error);
      });
  },
  //  oobCode - Код сброса пароля из URL

  changePassword: async (oobCode, newPassword) => {
    confirmPasswordReset(auth, oobCode, newPassword)
      .then(() => {
        // Пароль успешно обновлен
        console.log("Password has been changed successfully");
        // Теперь пользователь может войти с новым паролем
      })
      .catch((error) => {
        // Ошибка в процессе сброса пароля
        console.error("Error in password reset", error);
      });
  },
};

export default authService;
