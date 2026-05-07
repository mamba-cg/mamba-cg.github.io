(function () {
  "use strict";

  var revealItems = document.querySelectorAll(".section-reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var tabButtons = document.querySelectorAll(".tab-button");
  var tabPanels = document.querySelectorAll(".workflow-panel");

  function activateWorkflowTab(button) {
    if (!button) return;
    var targetId = button.getAttribute("data-tab");

    tabButtons.forEach(function (btn) {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
    });

    tabPanels.forEach(function (panel) {
      panel.classList.remove("is-active");
    });

    button.classList.add("is-active");
    button.setAttribute("aria-selected", "true");

    var targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add("is-active");
    }
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activateWorkflowTab(button);
    });
  });

  if (tabButtons.length > 1 && tabPanels.length > 1) {
    window.setInterval(function () {
      var activeIndex = -1;
      tabButtons.forEach(function (btn, idx) {
        if (btn.classList.contains("is-active")) {
          activeIndex = idx;
        }
      });

      var nextIndex = (activeIndex + 1) % tabButtons.length;
      activateWorkflowTab(tabButtons[nextIndex]);
    }, 2000);
  }

  var faqItems = document.querySelectorAll(".faq-list details");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.removeAttribute("open");
        }
      });
    });
  });

  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 620) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
