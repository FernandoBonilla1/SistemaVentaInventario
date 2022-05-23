const crypto = require('crypto');

const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

/// Cipher

const message = 'zeratul1996';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

/// Encrypt

const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
console.log(`Encrypted: ${encryptedMessage}`);

/// Decrypt

const decipher = createDecipheriv('aes256', key, iv);
const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8');
console.log(`Deciphered: ${decryptedMessage.toString('utf-8')}`);

/*
const bcrypt = require ('bcrypt'); // require bcrypt





const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const message = "zeratul1";
const Securitykey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
let encryptedData = cipher.update(message, "utf-8", "hex");

encryptedData += cipher.final("hex");

console.log("Encrypted message: " + encryptedData);


const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

console.log("Decrypted message: " + decryptedData);

*/