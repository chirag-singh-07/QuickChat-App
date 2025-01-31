import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      set({ authUser: response.data, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // toast.success()
      set({ isSigningUp: false, authUser: response.data.data });
      toast.success("Account created successfully!");

      get().connectSocket();
    } catch (error) {
      console.error("Error signing up user:", error);
      set({ isSigningUp: false });
      toast.error("Failed to create account!");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out user:", error);
      toast.error("Failed to log out!");
    }
  },

  login: async (formData) => {
    set({ isLogingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      set({ isLogingIn: false, authUser: response.data });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      console.error("Error logging in user:", error);
      set({ isLogingIn: false });
      toast.error("Failed to log in!");
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ isUpdatingProfile: false, authUser: response.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = new io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
