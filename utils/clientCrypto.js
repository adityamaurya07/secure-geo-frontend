import forge from "node-forge";

let privateKey = null;
let publicKeyPem = null;

export const initClientKeys = () => {
  if (!privateKey) {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

    privateKey = keypair.privateKey;
    publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  }
};

export const getClientPublicKey = () => {
  return publicKeyPem;
};
export const decryptResponse = (encryptedData) => {
  if (!privateKey) {
    throw new Error("Client keys not initialized");
  }

  const decrypted = privateKey.decrypt(
    forge.util.decode64(encryptedData),
    "RSA-OAEP",
  );

  return JSON.parse(decrypted);
};
