import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

const usersService = {
  addChatCompanion: async (user, item, projectId) => {
    await setDoc(doc(db, "users", `${user?.uid}`, "chats", `${item.uid}`), {
      companionId: user?.uid,
      ...item,
      project_name: projectId,
    });
  },

  addChatMessage: async (userId, companionId, options) => {
    await addDoc(
      collection(
        db,
        "users",
        `${userId}`,
        "chats",
        `${companionId}`,
        "messages"
      ),
      options
    );
    const messagesQuery = query(
      collection(
        db,
        "users",
        `${userId}`,
        "chats",
        `${companionId}`,
        "messages"
      ),
      orderBy("timestamp")
    );
    console.log("messagesQuery: ", messagesQuery);
  },
  addMilestone: async (user, companionId, options) => {
    await addDoc(
      collection(
        db,
        "users",
        `${user?.uid}`,
        "chats",
        `${companionId}`,
        "milestones"
      ),
      options
    );
  },
  milestoneConfirm: async (user, companionId, milestoneDocId, options) => {
    await updateDoc(
      doc(
        db,
        "users",
        `${user?.uid}`,
        "chats",
        `${companionId}`,
        "milestones",
        `${milestoneDocId}`
      ),
      options
    );
  },
};

export default usersService;
