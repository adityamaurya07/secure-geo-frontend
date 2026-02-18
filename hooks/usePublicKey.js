"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function usePublicKey() {
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    const fetchKey = async () => {
      const res = await axios.get("http://localhost:5000/api/public-key");

      setPublicKey(res.data.publicKey);
    };

    fetchKey();
  }, []);

  return publicKey;
}
