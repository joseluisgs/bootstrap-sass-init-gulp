/* MIS SCRIPT */

// Notificaciones con JQuery
$(document).ready(function () {
    $(".show-toast").click(function () {
        $("#myToast").toast('show');
     });
});


// Notificaciones con Vanila JS
// document.querySelector('.show-toast').addEventListener('click', function () {
//     document.querySelector('#myToast').toast('show');
// });


// Transiciones Vanila JS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});