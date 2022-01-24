// Importacion de la biblioteca de terceros Express

const express = require('express')

// Crea una i8nstancia del objeto Express
const app = express()


// Base de datos de fotos
let fotos = []

// Configuro el color de H1 FOTOTECA
let colorTitulo = "#346135";

app.use(express.urlencoded({ extended: false}))

// Ofrece una carpeta del servidor, donde estarán todos los recursos
// que deben ser accedidos
app.use(express.static('public'));

// El metodo .set modifca una caracteristica de nuestro servidor.
// Mi motor por defecto de plantillas va a ser EJS
app.set('view engine', 'ejs')

// Definición de un endpoint a la URL '/', metodo GET y ejecuta la funcion callback
// del segundo parámetro cada vez que reciba una peticion
app.get('/', function (req, res) {
  res.render("index",{
    numeroFotos: fotos.length,
    fotos: fotos,
    colorTitulo // Si la propiedad y el valor se llaman igual no hace falta
  })
})
app.get('/nueva-foto', (req, res) =>{
    res.render("form",{
      error:""
    })
})

app.post('/nueva-foto', (req,res)=>{
  let tituloMay = tituloMayuscula(req.body.titulo);
  let formato = cambiarFormatoFecha(req.body.fecha);

   // Crear un nuevo objeto que almacene datos de las fotos
   console.log(req.body);
   let foto = {
      titulo: tituloMay,
      url: req.body.url,
      fecha: formato
   }
   let fotoExiste = existeFotoBBDD(req.body.url);
   if(fotoExiste){
     res.render("form",{
      error: `La url ${req.body.url} ya existe`
     })
     return;
   }
   

   // Luego añadir el objeto al array
   fotos.push(foto);
   
   ordenarFechaDecreciente(fotos);
   // Redirigimos al usuario a la primera página despues de la insercción
   res.redirect("/");

  
})

function existeFotoBBDD(url){
  let encontrado = fotos.some(foto => url ==foto.url)
  return encontrado;
}

function tituloMayuscula(titulo){
  let tituloM = titulo.toUpperCase();
  return tituloM;
}
function cambiarFormatoFecha(fecha){
  let cambiarFormato = fecha.split("-").reverse().join("-");
  return cambiarFormato;
}
function ordenarFechaDecreciente(fotos){
  fotos.sort((foto1, foto2)=>{
    if(foto1.fecha > foto2.fecha){
      return -1;
    }
    if (foto1.fecha < foto2.fecha){
      return 1;
    }
    return 0;
  })
}

app.listen(3000)