import { JSEncrypt } from "jsencrypt";

export const encryptRSA = (data, publicKey) => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);

  return encryptor.encrypt(JSON.stringify(data));
};
