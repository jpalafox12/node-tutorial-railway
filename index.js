const express = require('express')
const mysql = require('mysql2') //por que no es mysql debe ser mysql2
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const app = express()

app.use(bodyParser.json())

const PUERTO = process.env.PORT || 5001;

const conexion = mysql.createConnection(
    {
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'pruebatt',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || '3306'
    }
)
app.listen(PUERTO,() =>{
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
})

conexion.connect(error =>{
    if(error) throw error
    console.log('Conexión exitosa en la base de datos');
})
app.get('/',(req,res)=>{
    res.send('API')
})

// GET - para obtener TODO lo que contenga la tabla usuarios --Este no tiene un uso solo era una prueba
app.get('/usuarios',(req,res) => {
    const query = `SELECT * FROM usuario;`
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)

        const obj = {}
        if(resultado.length > 0){
            obj.listaUsuarios = resultado //agrege s
            res.json(obj)
        } else{
            res.json(`No hay registros`)
        }
    })

})

// GET - para obtener el ID del correo que se ingresa de la tabla usuario (SABER ID DEL USUARIO QUE ENTRA) --listo
app.get('/usuario/:email_usuario',(req,res) => {
    const { email_usuario } = req.params
    const query = `SELECT * FROM usuario WHERE email_usuario = '${email_usuario}';`
    
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        if(resultado.length > 0){
            res.json(resultado[0])
        } else{
            res.json(`No hay registros`)
        }
    })

})

// POST - para agregar UN elemento de la tabla usuarios (REGISTRAR NUEVO USUARIO) --listo
app.post('/usuario/add',(req,res) => {

    const usuario = {
        nombre_usuario: req.body.nombre_usuario,
        apellido_usuario: req.body.apellido_usuario,
        telefono_usuario: req.body.telefono_usuario,
        email_usuario: req.body.email_usuario,
        estado_usuario: req.body.estado_usuario,
        ciudad_usuario: req.body.ciudad_usuario,
        colonia_usuario: req.body.colonia_usuario,
        cp_usuario: req.body.cp_usuario,
        calle_usuario: req.body.calle_usuario,
        num_ext_usuario: req.body.num_ext_usuario,
        password_usuario: req.body.password_usuario,
        id_veterinario: req.body.id_veterinario
    }
    const query = `INSERT INTO usuario (nombre_usuario, apellido_usuario, telefono_usuario,
        email_usuario,estado_usuario,ciudad_usuario,colonia_usuario,cp_usuario,calle_usuario,num_ext_usuario,password_usuario,id_veterinario,estatus_usuario,baja_usuario,foto_usuario)
     VALUES ('${nombre_usuario}', '${apellido_usuario}', '${telefono_usuario}','${email_usuario}', '${estado_usuario}','${ciudad_usuario}', '${colonia_usuario}',
      '${cp_usuario}','${calle_usuario}', '${num_ext_usuario}', '${password_usuario}','${id_veterinario}','0', '0', '');`
    conexion.query(query, usuario,(error)=>{

        if(error) return console.error(error.message)
        res.json(`Se agregó correctamente el usuario`)
    })

})

// GET - para obtener datos del id que se ingresa de la tabla usuario (USUARIO NO VERIFICADO / USUARIO VERIFICADO) ---listo
app.get('/usuario/noReg/:id_usuario',(req,res) => {
    const { id_usuario } = req.params
    const query = `SELECT nombre_usuario, apellido_usuario, telefono_usuario, email_usuario FROM usuario WHERE id_usuario = ${id_usuario};`
    
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        if(resultado.length > 0){
            res.json(resultado)
        } else{
            res.json(`No hay registros`)
        }
    })

})

// PUT - para actualizar UN elemento de la tabla usuario (ACTUALIZAR / EDITAR INFO USUARIO)--listo
app.put('/usuario/update/:id_usuario',(req,res) => {
    const {id_usuario} = req.params
    const { nombre_usuario, apellido_usuario, telefono_usuario, email_usuario, estado_usuario, 
        ciudad_usuario, colonia_usuario, cp_usuario, calle_usuario, num_ext_usuario, password_usuario, foto_usuario} = req.body

    const query = `UPDATE usuario SET nombre_usuario='${nombre_usuario}',apellido_usuario='${apellido_usuario}',telefono_usuario='${telefono_usuario}',
    email_usuario='${email_usuario}',estado_usuario='${estado_usuario}',ciudad_usuario='${ciudad_usuario}',colonia_usuario='${colonia_usuario}',
    cp_usuario='${cp_usuario}',calle_usuario='${calle_usuario}',num_ext_usuario='${num_ext_usuario}',password_usuario='${password_usuario}',foto_usuario='${foto_usuario}'
    WHERE id_usuario='${id_usuario}';`
    conexion.query(query,(error)=>{

        if(error)return console.error(error.message)
        res.json(`Se actualizó correctamente el usuario`)
    })

})

// GET - para obtener las mascotas del id del dueño que se ingresa de la tabla mascotas --Falta que traiga tambien la foto ---listo
app.get('/mascotas/:id_usuario',(req,res) => {
    const { id_usuario } = req.params
    const query = `SELECT * FROM mascotas WHERE id_usuario = ${id_usuario} AND baja_mascota = 0;`
    
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        const obj = {}
        if(resultado.length > 0){
            obj.listaMascotas = resultado
            res.json(obj)
        } else{
            obj.listaMascotas = resultado
            res.json(obj)
        }
    })

})

// DELETE - para eliminar UN elemento de la tabla mascotas (ELIMINAR MASCOTA DE UN USUARIO) ---listo
app.delete('/mascota/delete/:id_mascota',(req,res) => {
    const { id_mascota } = req.params
    const query = `DELETE FROM mascotas WHERE id_mascota = ${id};`
    conexion.query(query,(error)=>{
        if(error) console.error(error.message)
        res.json(`Se eliminó correctamente la mascota`)
    })
})

// GET - para obtener informacion de la mascota que se seleccione ---listo
app.get('/mascota/:id_mascota',(req,res) => {
    const { id_mascota } = req.params
    const query = `SELECT nombre_mascota, fecha_nacimiento_mascota, raza_mascota, padecimientos_mascota, sexo_mascota FROM mascotas WHERE id_mascota = ${id_mascota};`
    
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        if(resultado.length > 0){
            res.json(resultado)
        } else{
            res.json(`No hay registros`)
        }
    })

})

// GET - para obtener informacion del historial la mascota que se seleccione ---listo
app.get('/mascota/historialM/:id_mascota/:tipo_consulta',(req,res) => {
    const { id_mascota } = req.params
    const { tipo_consulta } = req.params
    const query = `SELECT * FROM consulta 
                WHERE id_mascota = ${id_mascota} AND tipo_consulta = '${tipo_consulta}';`
    
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        const obj = {}
        if(resultado.length > 0){
            obj.listaHistorialM = resultado
            res.json(obj)
        } else{
            obj.listaHistorialM = resultado
            res.json(obj)
            
        }
    })

})

// POST - para agregar UN elemento de la tabla mascota 
app.post('/mascota/add',(req,res) => {

    const mascota = {
        nombre_mascota: req.body.nombre_mascota,
        sexo_mascota: req.body.sexo_mascota,
        color_mascota: req.body.color_mascota,
        raza_mascota: req.body.raza_mascota,
        fecha_nacimiento_mascota: req.body.fecha_nacimiento_mascota,
        especie_mascota: req.body.especie_mascota,
        foto_mascota: req.body.foto_mascota,
        id_usuario: req.body.id_usuario
    }
    const query = `INSERT INTO mascotas (nombre_mascota, color_mascota, raza_mascota, especie_mascota, fecha_nacimiento_mascota, foto_mascota, baja_mascota,sexo_mascota, id_usuario)
  VALUES ('${mascota.nombre_mascota}', '${mascota.color_mascota}', '${mascota.raza_mascota}', '${mascota.especie_mascota}', '${mascota.fecha_nacimiento_mascota}', '${mascota.foto_mascota}', '0', '${mascota.sexo_mascota}', '${mascota.id_usuario}');`;

    conexion.query(query, mascota,(error)=>{

        if(error) return console.error(error.message)
        res.json(`Se agregó correctamente la mascota`)
    })

})

// PUT - para actualizar UN elemento de la tabla mascota  ---listo
app.put('/mascota/update/:id_mascota',(req,res) => {
    const {id_mascota} = req.params
    const { nombre_mascota, color_mascota, raza_mascota, fecha_nacimiento_mascota, foto_mascota } = req.body

    const query = `UPDATE mascotas SET nombre_mascota='${nombre_mascota}',color_mascota='${color_mascota}',raza_mascota='${raza_mascota}',
    fecha_nacimiento_mascota='${fecha_nacimiento_mascota}', foto_mascota='${foto_mascota}' WHERE id_mascota ='${id_mascota}';`
    conexion.query(query,(error)=>{

        if(error)return console.error(error.message)
        res.json(`Se actualizó correctamente la mascota`)
    })

})
// PUT - para cambiar baja_mascota ---- Listo
app.put('/mascota/darBaja/:id_mascota',(req,res) => {
    const {id_mascota} = req.params
    const {baja_mascota} = req.body

    const query = `UPDATE mascotas SET baja_mascota='${baja_mascota}' WHERE id_mascota ='${id_mascota}';`
    conexion.query(query,(error)=>{

        if(error)return console.error(error.message)
        res.json(`Se dió de baja correctamente la mascota`)
    })

})

// GET - para obtener si el usuario esta registrado
app.get('/usuarioLogin/:email_usuario/:password_usuario',(req,res) => {
    const { email_usuario } = req.params
    const { password_usuario } = req.params

    const query = `SELECT COUNT(*) AS existe_usuario
    FROM usuario
    WHERE email_usuario = '${email_usuario}' AND password_usuario = '${password_usuario}';`
        
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        if(resultado.length > 0){
            res.json(resultado[0])
        } else{
            res.json(`No hay registros`)
        }
    })

})

// GET - para obtener consultas totales del usuario ---
app.get('/usuario/consultas/:id_usuario',(req,res) => {
    const { id_usuario } = req.params
    const query = `SELECT COUNT(CASE WHEN consulta.tipo_consulta = 'estetica' THEN 1 ELSE NULL END) AS consulta_esteticas, 
                            COUNT(CASE WHEN consulta.tipo_consulta = 'medica' THEN 1 ELSE NULL END) AS consulta_medicas,  
                            COUNT(CASE WHEN consulta.tipo_consulta = 'vacunacion' THEN 1 ELSE NULL END) AS consulta_vacunacion 
                            FROM mascotas JOIN consulta ON mascotas.id_mascota = consulta.id_mascota 
                            WHERE mascotas.id_usuario = ${id_usuario};`
    
    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        if(resultado.length > 0){
            res.json(resultado[0])
        } else{
            res.json(`No hay registros`)
        }
    })

})

// GET - para obtener horas ocupadas ---
app.get('/citas/ocupadas/:fecha_cita',(req,res) => {
    const { fecha_cita } = req.params
    const query = `SELECT * FROM cita WHERE fecha_cita = '${fecha_cita}';`

    conexion.query(query,(error,resultado)=>{

        if(error)return console.error(error.message)
        const obj = {}
        if(resultado.length > 0){
            obj.listaHorasOcupadas = resultado
            res.json(obj)
        } else{
            obj.listaHorasOcupadas = resultado
            res.json(obj)
        }
    })

})



/* -------- C-I-T-A-S -----------------------------------------------------------------------------*/
//end point OBTENER TODOS LOS REGISTROS DE CITAS TODAS -- LISTO


/* Este ya esta listo */
app.get('/citas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const query = `SELECT * FROM cita WHERE id_usuario = ${id_usuario} AND estatus_cita = 0`;
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message);

        const obj = {};
        if (resultado.length > 0) {
            obj.listaCitas = resultado;
            res.json(obj);
        } else {
            obj.listaCitas = resultado;
            res.json(obj);
        }
    });
});

// POST - para agregar UN elemento de la tabla mascota 
app.post('/cita/add',(req,res) => {

    const cita = {
        tipo_cita: req.body.tipo_cita,
        descripcion_cita: req.body.descripcion_cita,
        observaciones_cita: req.body.observaciones_cita,
        fecha_cita: req.body.fecha_cita,
        hora_cita: req.body.hora_cita,
        id_mascota : req.body.id_mascota,
        id_usuario : req.body.id_usuario,
        id_veterinario : req.body.id_veterinario,
        estatus_cita : req.body.estatus_cita  
    }
    const query = `INSERT INTO cita SET ?`
    conexion.query(query, cita,(error)=>{

        if(error) return console.error(error.message)
        res.json(`Se agregó correctamente la cita`)
    })

})

// DELETE - para eliminar UN elemento de la tabla cita ----Listo
app.delete('/cita/delete/:id_cita',(req,res) => {
    const { id_cita } = req.params
    const query = `DELETE FROM cita WHERE id_cita = ${id_cita};`
    conexion.query(query,(error)=>{
        if(error) console.error(error.message)
        res.json(`Se eliminó correctamente la cita`)
    })
})


//Metodo para recuperar la contraseña---------------------------------------------------------------------------------
app.post('/enviarCorreo',async (req, res) => {

    const correoDestino = req.body.email_usuario
    const password = await obtenerPasswordDesdeLaBaseDeDatos(correoDestino) // Obtener la contraseña desde la base de datos

    if (!password) {
        // si const password no tiene nada guardado
        res.json(`El correo electrónico ingresado no está registrado en la app`)
      } else {
        // si const password tiene algo guardado
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
              user: 'alumnoupiiz9@gmail.com',
              pass: 'oyejotvnezmgkxpr'
            }
          })

          // Ruta de la imagen que deseas adjuntar
        //const imagePath = '';
        
          const mailOptions = {
            from: 'alumnoupiiz9@gmail.com',
            to: correoDestino,
            subject: 'Contraseña de tu cuenta MrCan',
            text: 'Tu contraseña es: ' + password
          }
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error)
              res.status(500).send(`Error al enviar el correo electrónico`)
            } else {
              console.log(`Correo electrónico enviado: ` + info.response)
              res.json(`Correo electrónico enviado correctamente`)
            }
          })
      }
  })
  
  function obtenerPasswordDesdeLaBaseDeDatos(email_usuario) { // Agrega el parámetro "correo"
    return new Promise((resolve, reject) => {
      const sql = `SELECT password_usuario FROM usuario WHERE email_usuario = ?;`
  
      conexion.query(sql, [email_usuario], (err, result) => { // Utiliza el parámetro "correo" en la consulta SQL
        if (err) {
          console.error(`Error al obtener la contraseña desde la base de datos:`, err)
          reject(err)
          return
        }
  
        if (result.length === 0) {
          console.warn(`No se encontró la contraseña en la base de datos`)
          resolve(``)
          return
        }
  
        const password_usuario = result[0].password_usuario
        resolve(password_usuario)
      })
    })
  }


