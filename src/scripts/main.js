/* MIS SCRIPT */

// Notificaciones
$(document).ready(function () {
    $(".show-toast").click(function () {
        $("#myToast").toast('show');
    });
});

// Transiciones
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});