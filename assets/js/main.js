(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // Define a mapping of departments to doctors
  const doctorsByDepartment = {
    "arthritis": ["Dr. Ajay Seth", "Dr. Prakash Asati", "Dr. Susheel Patel, Dr. Deepak Mishra"],
    "medicine": ["Dr. Shobhan Ponikar", "Dr. Suresh Patel", "Dr. Aashish Patel", "Dr. Sameer Gupta", "Dr. Bhavesh Gupta"],
    "maxillofacial": ["Dr. Pranav Asati", "Dr. Jyotsana Jasooja Asati"],
    "general-surgery": ["Dr. Amit Gupta", "Dr. S.K Pandey","Suden Naag"],
    "maternity": ["Dr. Snehal Khandet Patel", "Dr. Palak Mehra","Sneha T Metwani "],
    "neuro-surgery": ["Dr. Yatin Kher"],
    "plastic-surgery": ["Dr. Sharad Thakur"],
    "surgeon": ["Dr. Harris", "Dr. Anoop Jain"],
    "child-specialist": ["Dr. G.L Kshatriya"],
    "heart-specialist": ["Dr. Raghuveer Patel"],
    "chest-specialist": ["Dr. Shreekant Ahirwal","Dr. Vikas Patel"],
    "neurology": ["Dr. Rajiv Nayak","Dr. Debyan Dutta"],
    "abdomen": ["Dr. Pankaj Asati", "Alok Basal"],
    "pathology": ["Dr. Sanjay Mishra"],
    "radiology": ["Dr. Susan Abrahim"],
    "anaesthesiology": ["Dr. Sunny Bhasin", "Dr. Sunita Parihar"],
    "joint-replacement": ["Dr. Sameer Mehra"],
    "kidney-specialist": ["Dr. Neeraj Jain"],
    "eye-specialist": ["Dr. Tarun Ahirwal"],
    "ent-specialist": ["Dr. Shreyas Pandey"]
  };

  // Event listener for department selection
  document.getElementById('department').addEventListener('change', function() {
    const selectedDepartment = this.value;
    const doctorSelect = document.getElementById('doctor');
    
    // Clear existing options
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    
    // Add doctors related to the selected department
    if (selectedDepartment && doctorsByDepartment[selectedDepartment]) {
      doctorsByDepartment[selectedDepartment].forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
      });
    }
  });


})();