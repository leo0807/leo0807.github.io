$(document).ready(function () {
    $(window).scroll(function () {
        if (this.scrollY > 20) {
            $('.navbar').addClass('sticky');
        } else {
            $('.navbar').removeClass('sticky');
        }
        if (this.scrollY > 500) {
            $('.scroll-up-btn').addClass('show');
        } else {
            $('.scroll-up-btn').removeClass('show');
        }
    });
    // Typing animation script
    const typed = new Typed(".typing", {
        strings: ["Web Developer", "Photographer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    })
    const typed2 = new Typed(".typing-2", {
        strings: ["Web Developer", "Photographer"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    })

    // Slide-up script
    $('.scroll-up-btn').click(function () {
        $('html').animate({ scrollTop: 0 });
    })

    // toggle menu/navbar
    $(".menu-btn").click(function () {
        $(".navbar .menu").toggleClass("active");
        $(".navbar i").toggleClass("active");
    });
    // owl carousel
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoPlayTimeout: 2000,
        autoPlayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3,
                nav: false
            },
        }
    })



    // Send Email
    const form = $("#form");
    const email = $("#emailBtn");
    const button = $(".contact .right form .button")
    const reponse = $("#response-message")
    function success() {
        form[0].reset();
        // console.log("success");
        button.css = ({ "visibility": "visible" });
        // reponse.innerHTML = "Thanks!";
    }

    function error() {
        // console.log("failure");
        response.text("Oops! There was a problem.");
        button.css = ({ "visibility": "visible" });
    }
    form.submit(function (event) {
        event.preventDefault();
        var data = new FormData(form[0]);
        console.log(form[0].method, form[0].action, data, form);
        ajax(form[0].method,
            form[0].action,
            data,
            success, error);
    });

    // helper function for sending an AJAX request

    function ajax(method, url, data, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
                success(xhr.response, xhr.responseType);
            } else {
                error(xhr.status, xhr.response, xhr.responseType);
            }
        };
        xhr.send(data);
    }
})