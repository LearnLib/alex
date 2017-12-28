(function () {
    var slideIndex = 1;
    var interval = null;

    function showSlide(n) {
        var i;
        var slides = document.getElementsByClassName("slide");
        if (n > slides.length) {
            slideIndex = 1
        }
        if (n < 1) {
            slideIndex = slides.length
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }

    var slides = document.getElementById('slides');
    slides.querySelector('.next').addEventListener('click', function (e) {
        clearInterval(interval);
        e.preventDefault();
        showSlide(slideIndex += 1);
        interval = startInterval();
    }, false);
    slides.querySelector('.prev').addEventListener('click', function (e) {
        clearInterval(interval);
        e.preventDefault();
        showSlide(slideIndex -= 1);
        interval = startInterval();
    }, false);

    function startInterval() {
        return window.setInterval(function () {
            showSlide(slideIndex += 1);
        }, 8000);
    }

    showSlide(slideIndex);
    interval = startInterval();
}());