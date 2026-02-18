import { decryptResponse, getClientPublicKey } from "@/utils/clientCrypto";
import axios from "axios";
import { JSEncrypt } from "jsencrypt";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔥 important
});
const refreshAPI = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let publicKey = null;

/* 🔐 Fetch Public Key */
const fetchPublicKey = async () => {
  if (publicKey) return publicKey;

  const res = await API.get("/public-key");
  publicKey = res?.data?.publickKey;

  if (!publicKey) {
    throw new Error("Public key not received");
  }

  return publicKey;
};

API.interceptors.request.use(
  async (config) => {
    const clientPublicKey = getClientPublicKey();

    if (clientPublicKey) {
      // 🔥 Remove line breaks before sending
      const singleLineKey = clientPublicKey
        .replace(/\n/g, "")
        .replace(/\r/g, "");

      config.headers["x-client-public-key"] = singleLineKey;
    }

    // Encrypt body if exists
    if (config.data) {
      const backendPublicKey = await fetchPublicKey();

      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(backendPublicKey);

      const encryptedData = encryptor.encrypt(JSON.stringify(config.data));

      config.data = { encryptedData };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => {
    // 🔓 Decrypt only if encryptedData exists
    if (response.data?.encryptedData) {
      try {
        const decrypted = decryptResponse(response.data.encryptedData);

        response.data = decrypted; // replace encrypted response
      } catch (err) {
        console.log("Decryption failed:", err);
      }
    }

    return response;
  },

  async (error) => {
    if (!error.config) {
      console.log("No config in error:", error);
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (!error.response) {
      console.log("Network / CORS error:", error);
      return Promise.reject(error);
    }

    // 🔁 Refresh Token Logic
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAPI.post("/auth/refresh");

        return API(originalRequest);
      } catch (err) {
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
