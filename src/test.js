//const connection = require('../config/db');
const credentials = require('./credencialesgmail.json')
const functions = require('./helpers/functionshelper')

functions.generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}
//const randomstring = generateRandomString(10);
//console.log(randomstring)

//var text = functions.capitalizarPrimeraLetra("prueba");
//console.log(text)
//var text1 = "aaaaaa"
//console.log(text1.toUpperCase());

const date = Date.now();
const hoy = new Date(date);
const fecha_actual = hoy.toISOString().slice(0,10);

console.log(hoy.toLocaleDateString())
console.log("")
console.log(fecha_actual)

/*
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: credentials.email,
      pass: credentials.password,
    },
  },);
  
  var mailOptions = {
    from: credentials.email,
    to: 'fbr009@alumnos.ucn.cl',
    subject: 'Sending Email using Node.js',
    text: 'Probando'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


*/

/*
const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}
const { exec } = require("child_process");
const getPath = () =>{
    exec("echo %cd%", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
*/