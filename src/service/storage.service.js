import { auth, storage, db } from "../firebase.config";
import { nanoid } from "nanoid";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { setDoc, doc, collection, onSnapshot } from "firebase/firestore";

export const sendCV = async ({ email, password, name, document }) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const randomId = nanoid();
    const fileStorageRef = ref(storage, `files/${randomId}`);
    await uploadBytes(fileStorageRef, document.file);
    const documentURL = await getDownloadURL(fileStorageRef);
    const docInfoStorageRef = doc(db, "documents", randomId);
    await setDoc(docInfoStorageRef, {
      fileName: document.name,
      fileUrl: documentURL,
      owner: user.uid,
      creationDate: new Date().getTime(),
    });
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
    await signOut(auth);
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};

export const loadCV = async ({ email, password }) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const documentsStorageRef = collection(db, `documents`);
    let result;
    onSnapshot(documentsStorageRef, (data) => {
      if (data.docs.length) {
        const dbDocuments = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const document = dbDocuments.find((doc) => doc.owner === user.uid);
        result = { userName: user.displayName, document };
      }
    });
    await signOut(auth);
    return result;
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
};
