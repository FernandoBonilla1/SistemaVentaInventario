const connection = require('../config/db');
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
/*
functionQueries.updateCurriculum = (req, res, next) => {
    let query = `INSERT INTO curriculum (id, nombres, apellidos, fecha_nac, comuna, ciudad, celular, correo, otros) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE nombres=?, apellidos=?, fecha_nac=?, comuna=?, ciudad=?, celular=?, correo=?, otros=?`;
    let queryData = [res.locals.currentUser.id, req.body.nombres, req.body.apellidos, new Date(req.body.fechaNacimiento + "T00:01"), req.body.comuna,
        req.body.ciudad, req.body.celular, req.body.correo, req.body.otros,
        req.body.nombres, req.body.apellidos, new Date(req.body.fechaNacimiento + "T00:01"), req.body.comuna,
        req.body.ciudad, req.body.celular, req.body.correo, req.body.otros
    ];
    let queryDeleteExtra = `DELETE FROM actividad_extra WHERE actividad_extra.id_postulante=?;`;
    let queryDeleteCientifica = `DELETE FROM actividad_cientifica WHERE actividad_cientifica.id_postulante=?;`;
    let queryDeleteTitulo = `DELETE FROM titulo WHERE titulo.id_postulante=?;`;
    let queryDeletePrevias = `DELETE FROM ayudantias_previas WHERE ayudantias_previas.id_postulante=?;`;
    let queryDeleteData = [res.locals.currentUser.id];

    let queryExtra = `INSERT INTO actividad_extra (id_postulante, nombre, institucion_docente , descripcion, periodo) 
                 VALUES `;
    let extra = req.body.extra;
    let queryExtraData = [];
    let isExtraEmpty = true;
    for (let i = 0; i < extra.length / 4; i++) {
        if (extra[4 * i] != '' || extra[4 * i + 1] != '' || extra[4 * i + 2] != '' || extra[4 * i + 3] != '') {
            queryExtra += '(?, ?, ?, ?, ?),';
            queryExtraData.push(res.locals.currentUser.id, extra[4 * i], extra[4 * i + 1], extra[4 * i + 2], extra[4 * i + 3]);
            isExtraEmpty = false;
        }
    }
    queryExtra = queryExtra.slice(0, -1) + ';';

    let queryCientifica = `INSERT INTO actividad_cientifica (id_postulante, nombre, descripcion, periodo) 
                       VALUES `;
    let cientifica = req.body.cientificas;
    let queryCientificaData = [];
    let isCientificaEmpty = true;
    for (let i = 0; i < cientifica.length / 3; i++) {
        if (cientifica[3 * i] != '' || cientifica[3 * i + 1] != '' || cientifica[3 * i + 2] != '') {
            queryCientifica += '(?, ?, ?, ?),';
            queryCientificaData.push(res.locals.currentUser.id, cientifica[3 * i], cientifica[3 * i + 1], cientifica[3 * i + 2]);
            isCientificaEmpty = false;
        }
    }
    queryCientifica = queryCientifica.slice(0, -1) + ';';

    let queryPrevias = `INSERT INTO ayudantias_previas (id_postulante, nombre, coordinador, evaluacion) 
                       VALUES `;
    let previas = req.body.previas;
    let queryPreviasData = [];
    let isPreviasEmpty = true;
    for (let i = 0; i < previas.length / 3; i++) {
        if (previas[3 * i] != '' || previas[3 * i + 1] != '' || previas[3 * i + 2] != '') {
            queryPrevias += '(?, ?, ?, ?),';
            queryPreviasData.push(res.locals.currentUser.id, previas[3 * i], previas[3 * i + 1], previas[3 * i + 2]);
            isPreviasEmpty = false;
        }
    }
    queryPrevias = queryPrevias.slice(0, -1) + ';';

    let queryTitulo = `INSERT INTO titulo (id_postulante, nombre, institucion, anno) 
                       VALUES `;
    let titulo = req.body.cursos;
    let queryTituloData = [];
    let isTituloEmpty = true;
    for (let i = 0; i < titulo.length / 3; i++) {
        if (titulo[3 * i] != '' || titulo[3 * i + 1] != '' || titulo[3 * i + 2] != null) {
            queryTitulo += '(?, ?, ?, ?),';
            queryTituloData.push(res.locals.currentUser.id, titulo[3 * i], titulo[3 * i + 1], titulo[3 * i + 2]);
            isTituloEmpty = false
        }
    }
    queryTitulo = queryTitulo.slice(0, -1) + ';';
    try {
        if(req.files && req.files.photo && req.files.photo.size > maxPhotoSizeBytes) {
            throw {code: "ER_TOO_BIG", msg:"La imagen es demasiado grande."};
        }
        connection.then(pool => {
                return pool.getConnection()
                    .then((conn) => {
                        let t = conn;
                        return t.query(queryStart)
                            .then(() => {
                                return t.query(query, queryData);
                            })
                            .then(() => {
                                return t.query(queryDeleteExtra, queryDeleteData);
                            })
                            .then(() => {
                                return t.query(queryDeleteCientifica, queryDeleteData);
                            })
                            .then(() => {
                                return t.query(queryDeleteTitulo, queryDeleteData);
                            })
                            .then(() => {
                                return t.query(queryDeletePrevias, queryDeleteData);
                            })
                            .then(() => {
                                if (!isExtraEmpty) return t.query(queryExtra, queryExtraData);
                                else return [];
                            })
                            .then(() => {
                                if (!isCientificaEmpty) return t.query(queryCientifica, queryCientificaData);
                                else return [];
                            })
                            .then(() => {
                                if (!isPreviasEmpty) return t.query(queryPrevias, queryPreviasData);
                                else return [];
                            })
                            .then(() => {
                                if (!isTituloEmpty) return t.query(queryTitulo, queryTituloData);
                                else return [];
                            })
                            .then(() => {
                                if(req.files && req.files.photo){
                                    let nombre = res.locals.currentUser.id;
                                    return req.files.photo.mv('src/fotos/' + nombre + '.jpg');
                                }
                                else return 0;
                            })
                            .then(() => {
                                return t.query(queryCommit);
                            })
                            .then(() => {
                                return t.release();
                            })
                            .then(() => {
                                res.status(200).json({ msg: "Se actualizo el currículum." })
                                return next();
                            })
                            .catch(err => {
                                return databaseError(err, t, res);
                            });
                    })
                    .catch(err => {
                        res.status(503).json({ err, msg: "Connection Error" })
                    });
            })
            .catch(err => {
                res.status(503).json({ err, msg: "Pool Error" })
            });
    } catch (err) {
        res.status(503).json({ err, msg: "Unknown Error" })
    }
}
*/