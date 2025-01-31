import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data.data, isUsersLoading: false });
    } catch (error) {
      toast.error("Failed to load users!");
      set({ isUsersLoading: false });
      // toast.error("Failed to load users!");
      console.error("Failed to send message:", error);
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data.data, isMessagesLoading: false });
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.error("Failed to load messages!", error.message);
      set({ isMessagesLoading: false });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // sendMessage: async (messageData) => {
  //   const { selectedUser, messages } = get();
  //   try {
  //     const res = await axiosInstance.post(
  //       `/message/send/${selectedUser._id}`,
  //       messageData
  //     );
  //     set({ messages: [...messages, res.data] });
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // },

  sendMessage: async (messageData) => {
    try {
      const { selectedUser } = get();
      const authUser = useAuthStore.getState().authUser; // Ensure authUser is properly populated
      if (!authUser) return; // Return early if no user is logged in

      const timestamp = new Date().toISOString();
      // Create temporary message with a unique ID and "pending" state
      const tempMessage = {
        text: messageData.text,
        image: messageData.image,
        _id: `temp-${Date.now()}`, // Temporary ID
        sender: selectedUser._id, // Adjust as needed
        createdAt: timestamp,
        pending: true, // Mark as pending
      };

      // Immediately update the UI with the temporary message
      set((state) => ({
        messages: [...state.messages, tempMessage],
      }));

      const freshMessageData = {
        ...messageData,
        timestamp, // Include the fresh timestamp here
      };
      // Send the message to the backend
      const response = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        freshMessageData 
      );

      // Replace the temporary message with the confirmed one
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempMessage._id
            ? { ...msg, ...response.data, pending: false }
            : msg
        ),
      }));
    } catch (error) {
      toast.error("Failed to send message!");
      console.error("Failed to send message:", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
