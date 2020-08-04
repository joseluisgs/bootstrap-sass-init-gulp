// Fichero de Gulp
const gulp = require("gulp"); // Requerimos Gulp
const browserSync = require("browser-sync").create(); // Refrescamos el navegador
const sass = require("gulp-sass"); // Convertimos Sass

// Tarea para crear los ficheros Sass
gulp.task("sass", () => {
  // Buscamos los fihceros fuentes de Bootstrap originales y los nuestros
  return (
    gulp
      .src(["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"])
      // Lo sacamos comprimidos en la carpeta src/css
      .pipe(sass({ outputStyle: "compressed" }))
      .pipe(gulp.dest("src/css"))
      .pipe(browserSync.stream())
  );
});

// Tareas para js
gulp.task("js", () => {
  // Buscamos los ficheros JS que necesitamos y los propios
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/popper.js/dist/umd/popper.min.js",
      "src/scripts/*.js",
    ])
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});

// Servidor para detectar los cambios solo en sass o sass y js
// gulp.task("serve", gulp.parallel('sass', 'js'), () => {
gulp.task('serve', gulp.series('sass',  function(done) {
  // indicamos donde debe iniciarse
  browserSync.init({
     server: "./src"  
  });

  // Detecta cambios y ejecuta la tarea para scss
  gulp.watch(
    [
      "node_modules/bootstrap/scss/bootstrap.min.scss",
      "node_modules/bootstrap/scss/bootstrap.scss",
      "src/scss/*.scss",
    ],
    gulp.series('sass')
  );

  // Detecta cambios y ejecuta la tarea para mis scripts js, opcional
  // gulp.watch(["src/scripts/*.js"], ["js"]);

  // si hay cambios en html...
  gulp.watch("src/*.html").on("change", browserSync.reload);
  done();
}));

// Tarea para obtener recursos
// iconos
gulp.task("font-awesome", () => {
  return gulp
    .src("node_modules/font-awesome/css/font-awesome.min.css")
    .pipe(gulp.dest("src/css"));
});
// fuentes
gulp.task("fonts", () => {
  return gulp
    .src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("src/fonts"));
});
// tareas por defecto
gulp.task("default", gulp.series(["js", "font-awesome", "fonts", "serve"]));
