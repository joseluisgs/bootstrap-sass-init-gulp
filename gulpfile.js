// Ficheros y librerías de GULP
const gulp = require("gulp"); // Requerimos Gulp
const browserSync = require("browser-sync").create(); // Para usar liveServer
const sass = require("gulp-sass"); // Convertimos Sass
const minify = require("gulp-minify"); // Para hacer la versión mini de nuestras cosas
const concat = require("gulp-concat"); // Por si queremos concatenat ficheros
const imagemin = require("gulp-imagemin"); // Minimizar imagenes
const del = require('del'); // Para borrar el directorio dist

// Directorios de configuracion y nombre
var dirs = {
  "origin": "src",
  "dist": "dist",
  "assets": "assets",
}

// GULP Funciona con tareas y estas tareas son funciones a realizar

// Función para limpiar el directorio de destino
limpiar = async () => {
  return del.sync([dirs.dist + '/**', '!dist'], { force: true });
};

// Función para copiar los HTML en el path de destino
html = async () => {
  gulp
    .src(dirs.origin + '/*.html')
    .pipe(gulp.dest(dirs.dist))
    .pipe(browserSync.stream({ stream: true }))
};

// Función para procesar los estilos
estilos = async () => {
  // Buscamos los ficheros de estilos propios y de nuestro CSS Framework
  return (
    gulp
      .src([
        // scss de nuestros framework
        "node_modules/bootstrap/scss/bootstrap.scss",
        // Nuestros SCSS en origen/scss
        dirs.origin + '/scss/*.scss',
      ])
      // Lo sacamos comprimidos en la carpeta de destino /css
      .pipe(sass({ outputStyle: "compressed" }))
      .pipe(concat('estilos.css')) // Concatenamos todo en un fichero (Opcional)
      .pipe(gulp.dest(dirs.dist + '/' + dirs.assets + "/css"))
      // Lo mostramos en el servidor
      .pipe(browserSync.stream({ stream: true }))
  );
}

// Función para procesar los JSs
scripts = async () => {
  return gulp.
    src([
      // Aquí indicamos nuestros js de librerías que usemos
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'node_modules/popper.js/dist/popper.js',
      'node_modules/jquery/dist/jquery.js',
      // Ponemos nuestros propios ficheros JS de origen /scripts
      dirs.origin + '/scripts/*.js',

    ])
    // Los minimizamos todos para compatcar
    .pipe(
      minify({
        noSource: true,
        ignoreFiles: [".combo.js", ".min.js"],
      })
    )
    // .pipe(concat('scripts.js')) // Concatenamos todo en un fichero (Opcional)
    // copiamos a destino
    .pipe(gulp.dest(dirs.dist + '/' + dirs.assets + "/js"))
    // Pasamos a servidor
    .pipe(browserSync.stream({ stream: true }))
};

// Función para procesar las fuentes de FA
fuentes = async () => {
  return gulp
    .src([
      "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
      //"!node_modules/@fortawesome/fontawesome-free/{less,less/}",
      //"!node_modules/@fortawesome/fontawesome-free/{scss,scss/}",
      //"!node_modules/@fortawesome/fontawesome-free/.",
      //"!node_modules/@fortawesome/fontawesome-free/.{txt,json,md}",

    ])
    .pipe(gulp.dest(dirs.dist + '/' + dirs.assets + '/font-awesome/css'))
    .pipe(browserSync.stream({ stream: true }))
};

// Función para procesar los iconos de FA
iconos = async () => {
  return gulp
    .src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest(dirs.dist + '/' + dirs.assets + '/font-awesome/webfonts/'))
    .pipe(browserSync.stream({ stream: true }))
};

// Copiamos las imagenes minimizadas y optimizadas
imagenes = async () => (
  gulp.src(dirs.origin + '/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(dirs.dist + '/' + dirs.assets + "/images"))
    .pipe(browserSync.reload({ stream: true }))
);


// Función que detecta todos los cambios en los ficheros 
// Si modificamos alguno actualiza el servidor
watch = async () => {
  browserSync.init({
    server: {
      //Configuraciones: Directorio donde vamos a ver los  (destino)
      baseDir: './dist'
    },
    notify: false,
    injectChanges: true
  });



  // Donde nos fijamos o observamos y la función a realizar
  // Estilos, ene ste caso no cambiamos los por defecto, solo los nuestros
  gulp.watch([
    // 'node_modules/bootstrap/scss/bootstrap.scss', // si tocaramos ese fichero
    dirs.origin + '/scss/**/*.scss'],
    estilos);

  // Algunos son opcionales
  // Imagenes
  gulp.watch(dirs.origin + '/images/**/*', imagenes);

  // html
  gulp.watch(dirs.origin + '/*.html', html);

  //scripts
  gulp.watch([
    // 'node_modules/bootstrap/dist/js/bootstrap.min.js',
    // 'node_modules/jquery/dist/jquery.min.js',
    // 'node_modules/popper.js/dist/umd/popper.min.js',
    dirs.origin + '/scripts/**/*.js'], scripts);

  // Fonts los ignoro no va a cambiar

  // Si hay cambios en dist, los mostramos 
  gulp.watch('./dist/*').on('change', browserSync.reload);
}

// tareas por defecto
// En parallel le digo a gulp que revise cada una de las funciones que hemos declarado
gulp.task('build',
  gulp.parallel(limpiar, estilos, scripts, imagenes, fuentes, iconos, html))
//gulp.parallel(limpiar, fuentes))
// En series que levante BrowserSync con todo los cambios.
gulp.task('default',
  gulp.series('build', watch))