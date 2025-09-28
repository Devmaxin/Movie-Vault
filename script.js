let header = document.querySelector('header');

window.addEventListener('scroll', () =>{
  header.classList.toggle('shadow', window.scrollY > 0)
})

  const menuToggle = document.getElementById('menu-icon');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('bx-x');
        navMenu.classList.toggle('active');
    });

    window.addEventListener('scroll', function() {
        menuToggle.classList.remove('bx-x');
        navMenu.classList.remove('active');
    });

    // Swiper


var swiper = new Swiper(".home", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
       
      });

      

      // Swiper

      // var swiper = new swiper(".coming-container", {
      //   spaceBetween: 20,
      //   loop:true,
      //   autoplay: {
      //     delay: 55000,
      //     disableOnInteraction: false,
      //   },
      //   centeredSlides: true,
      //   breakpoints: {
      //     0: {
      //       slidesPerview: 2,
      //     },
      //     568: {
      //       slidesPerview: 3,
      //     },
      //     768: {
      //       slidesPerview: 4,
      //     },
      //     968: {
      //       slidesPerview: 5,
      //     },
      //   },
      // });


