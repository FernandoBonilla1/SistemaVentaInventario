const crypto = require('crypto');

const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const message = "1";
const Securitykey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
let encryptedData = cipher.update(message, "utf-8", "hex");

encryptedData += cipher.final("hex");

//console.log("Encrypted message: " + encryptedData);


const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

//console.log("Decrypted message: " + decryptedData);