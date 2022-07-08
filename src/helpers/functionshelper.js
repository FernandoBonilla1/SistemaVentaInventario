const credenciales = require("../credencialesgmail.json")

const functions = {}

functions.generateRandomString = (num) => { //Se crea un string random con cantidad de caracteres definidas
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}

functions.capitalizarPrimeraLetra = (str) => {  //Se capitaliza un string
    return str.charAt(0).toUpperCase() + str.slice(1);
}

functions.getCurrentDate = () => { //Se obtiene la fecha en formato YYYY-MM-DD
    const date = Date.now();
    const hoy = new Date(date);
    const fecha_actual = hoy.toISOString().slice(0,10);
    return fecha_actual;
}

functions.getCurrentDateDDMMYYYY = () => { //Se obtiene la fecha en formado DD-MM-YYYY
    const date = Date.now();
    const hoy = new Date(date);
    const fecha_actual = hoy.toLocaleDateString();
    return fecha_actual;
}
functions.getHtmlForgotPassword = (randomstring) => { //Formato correo para reiniciar contraseña
    const html = `<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
    <tr>
        <td>
            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="height:40px;">&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding:0 35px;">
                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Ha solicitado restablecer su contraseña</h1>
                                    <span
                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                        No podemos simplemente enviarle su antigua contraseña. Se ha generado para usted una nueva
                                        contraseña. Para restablecer su contraseña a una que usted escoja. Debe ingresar con  
                                        el codigo que le entregamos a continuación a su sesión y en su perfil modificar la contraseña a una que
                                        a usted le acomode. 
                                    </p>
                                    <br>
                                    <br>
                                    <h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Su nueva contraseña es: <strong>${randomstring}</strong></h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                <tr>
                    <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="height:80px;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>
</table>`

    return html
}

functions.getCreateNewEmployee = (randomstring) => { //Formato correo para nuevos funcionarios
    const html = `<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
    <tr>
        <td>
            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="height:40px;">&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding:0 35px;">
                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Se te creo una cuenta de nivel funcionario</h1>
                                    <span
                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                        Ahora eres parte del equipo de trabajo de una de las empresas mas importantes a nivel nacional en la venta de insumos de contruccion y maquinarias. Se creo una contraseña para acceder por el portal de empleados. 
                                    </p>
                                    <br>
                                    <br>
                                    <h2 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Su nueva es: <strong>${randomstring}</strong></h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                <tr>
                    <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="height:80px;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>
</table>`

    return html
}


module.exports = functions