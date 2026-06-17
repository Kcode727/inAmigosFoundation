document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
  }
  const navbar = document.getElementById("navbar");
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll(); 
  const revealElements = document.querySelectorAll(".reveal");
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  const statContainers = document.querySelectorAll(".stats-grid, .hero-strip, .causes");
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEls = entry.target.querySelectorAll(".stat-n, .hero-stat-num, .cause-metric-val");
        numEls.forEach(numEl => {
          if (!numEl.dataset.counted) {
            numEl.dataset.counted = "1";
            animateCountUp(numEl);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  statContainers.forEach(container => {
    countObserver.observe(container);
  });
  function animateCountUp(element) {
    const target = parseInt(element.getAttribute("data-target"), 10);
    const suffix = element.getAttribute("data-suffix") || "+";
    const duration = 2000; 
    const startTime = performance.now();
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      element.innerText = currentValue.toLocaleString() + (progress >= 1 ? suffix : "");
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.innerText = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(updateCount);
  }
  const openFormBtn = document.getElementById("openFormBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const formPanel = document.getElementById("formPanel");
  const ctaContainer = document.getElementById("ctaContainer");
  const joinForm = document.getElementById("joinCommunityForm");
  const successOverlay = document.getElementById("successOverlay");
  const successCloseBtn = document.getElementById("successCloseBtn");
  function openForm() {
    if (formPanel && ctaContainer) {
      formPanel.classList.add("active");
      ctaContainer.classList.add("fade");
      formPanel.querySelector(".form-scroll-container").scrollTop = 0;
      const ctaSection = document.getElementById("ctaSection");
      if (ctaSection) {
        ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  function closeForm() {
    if (formPanel && ctaContainer) {
      formPanel.classList.remove("active");
      ctaContainer.classList.remove("fade");
      closeCustomDropdown();
    }
  }
  window.openForm = openForm;
  window.closeForm = closeForm;
  if (openFormBtn) {
    openFormBtn.addEventListener("click", openForm);
  }
  if (closeFormBtn) {
    closeFormBtn.addEventListener("click", closeForm);
  }
  const selectWrapper = document.getElementById("interestSelectWrapper");
  const selectTrigger = document.getElementById("interestSelectTrigger");
  const selectOptions = document.getElementById("interestOptions");
  const selectText = document.getElementById("selectedOptionText");
  const interestInput = document.getElementById("interestInput");
  const optionItems = document.querySelectorAll(".custom-option");
  function toggleCustomDropdown(e) {
    e.stopPropagation();
    if (selectWrapper && selectOptions) {
      selectWrapper.classList.toggle("open");
      selectOptions.classList.toggle("open");
    }
  }
  function closeCustomDropdown() {
    if (selectWrapper && selectOptions) {
      selectWrapper.classList.remove("open");
      selectOptions.classList.remove("open");
    }
  }
  if (selectTrigger) {
    selectTrigger.addEventListener("click", toggleCustomDropdown);
    document.addEventListener("click", closeCustomDropdown);
  }
  optionItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = item.getAttribute("data-value");
      const text = item.innerText;
      if (selectText && interestInput && selectWrapper) {
        selectText.innerText = text;
        interestInput.value = val;
        selectWrapper.classList.add("has-val");
      }
      closeCustomDropdown();
    });
  });
  if (joinForm) {
    joinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("nameInput");
      const emailInput = document.getElementById("emailInput");
      const name = nameInput ? nameInput.value : "";
      const email = emailInput ? emailInput.value : "";
      const interest = interestInput ? interestInput.value : "";
      if (name.trim() === "" || email.trim() === "" || interest === "") {
        if (interest === "" && selectTrigger) {
          selectTrigger.style.borderColor = "var(--amber)";
        }
        return;
      }
      if (successOverlay) {
        successOverlay.classList.add("active");
      }
    });
  }
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => {
      if (successOverlay) successOverlay.classList.remove("active");
      if (joinForm) joinForm.reset();
      if (selectText) selectText.innerText = "Select Area of Interest";
      if (interestInput) interestInput.value = "";
      if (selectWrapper) selectWrapper.classList.remove("has-val");
      if (selectTrigger) selectTrigger.removeAttribute("style");
      closeForm();
    });
  }
  const joinModal = document.getElementById("joinModal");
  const modalForm = document.getElementById("mForm");
  const modalSuccess = document.getElementById("mSuccess");
  window.openModal = function() {
    if (joinModal) {
      joinModal.classList.add("open");
    }
  };
  window.closeModal = function() {
    if (joinModal) {
      joinModal.classList.remove("open");
      setTimeout(() => {
        if (modalForm) modalForm.classList.remove("hidden");
        if (modalSuccess) modalSuccess.classList.add("hidden");
      }, 400);
    }
  };
  window.submitModal = function() {
    const name = document.getElementById("mName") ? document.getElementById("mName").value.trim() : "";
    const email = document.getElementById("mEmail") ? document.getElementById("mEmail").value.trim() : "";
    const interest = document.getElementById("mInterest") ? document.getElementById("mInterest").value : "";
    if (!name || !email || !interest) {
      alert("Please fill in your name, email, and area of interest.");
      return;
    }
    if (modalForm && modalSuccess) {
      modalForm.classList.add("hidden");
      modalSuccess.classList.remove("hidden");
    }
  };
  if (joinModal) {
    joinModal.addEventListener("click", function(e) {
      if (e.target === this) closeModal();
    });
  }
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  if (track && prevBtn && nextBtn) {
    let index = 0;
    function getSlideWidth() {
      const slide = track.querySelector(".carousel-slide");
      return slide ? slide.getBoundingClientRect().width + 24 : 0; 
    }
    function getVisibleSlidesCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }
    function updateSlider() {
      const slideWidth = getSlideWidth();
      const visibleSlides = getVisibleSlidesCount();
      const maxIndex = track.children.length - visibleSlides;
      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
    prevBtn.addEventListener("click", () => {
      index--;
      updateSlider();
    });
    nextBtn.addEventListener("click", () => {
      index++;
      updateSlider();
    });
    window.addEventListener("resize", updateSlider);
    setTimeout(updateSlider, 200);
  }
});