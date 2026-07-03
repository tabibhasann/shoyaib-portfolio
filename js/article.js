/* ============================================
   SHOYAIB — Premium Portfolio
   Article Page JavaScript
   ============================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof gsap !== "undefined";
  var hasScrollTrigger = hasGSAP && typeof ScrollTrigger !== "undefined";
  var hasLenis = typeof Lenis !== "undefined";
  var isTouch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (reduceMotion || !hasGSAP) {
    document.body.classList.add("no-anim");
  }

  if (isTouch) {
    document.body.classList.add("no-cursor");
  }

  /* ---------- Page Load ---------- */
  function initPageLoad() {
    requestAnimationFrame(function () {
      document.body.classList.add("page-loaded");
    });
  }

  /* ---------- Split Words ---------- */
  function splitWords(el) {
    var text = el.innerHTML;
    var temp = document.createElement("div");
    temp.innerHTML = text;
    processNode(temp);
    el.innerHTML = temp.innerHTML;
  }

  function processNode(node) {
    var children = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      children.push(node.childNodes[i]);
    }
    children.forEach(function (child) {
      if (child.nodeType === 3) {
        var words = child.textContent.split(" ");
        var frag = document.createDocumentFragment();
        words.forEach(function (word, idx) {
          if (word.trim() === "") {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          var wrapper = document.createElement("span");
          wrapper.className = "split-word";
          var inner = document.createElement("span");
          inner.textContent = word;
          wrapper.appendChild(inner);
          frag.appendChild(wrapper);
          if (idx < words.length - 1) {
            frag.appendChild(document.createTextNode(" "));
          }
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.childNodes.length > 0) {
        if (child.classList && child.classList.contains("split-word")) return;
        processNode(child);
      }
    });
  }

  /* ---------- Custom Cursor ---------- */
  function initCursor() {
    if (document.body.classList.contains("no-anim")) return;
    if (document.body.classList.contains("no-cursor")) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var visible = true;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    });

    document.addEventListener("mouseleave", function () {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", function () {
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Press spring
    document.addEventListener("mousedown", function () {
      dot.classList.add("pressed");
      ring.classList.add("pressed");
    });
    document.addEventListener("mouseup", function () {
      dot.classList.remove("pressed");
      ring.classList.remove("pressed");
    });

    var hoverEls = document.querySelectorAll("a, button, .magnetic");
    hoverEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        ring.classList.add("hover");
      });
      el.addEventListener("mouseleave", function () {
        ring.classList.remove("hover");
      });
    });

    // Text cursor
    var textEls = document.querySelectorAll("[data-cursor-text]");
    textEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        ring.classList.add("text");
        ring.setAttribute("data-cursor-text", el.getAttribute("data-cursor-text"));
      });
      el.addEventListener("mouseleave", function () {
        ring.classList.remove("text");
        ring.removeAttribute("data-cursor-text");
      });
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var ticking = false;
    function onScroll() {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    var burger = document.querySelector(".nav-burger");
    var links = document.querySelector(".nav-links");
    if (burger && links) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Toggle navigation menu");

      burger.addEventListener("click", function () {
        var isOpen = links.classList.toggle("open");
        burger.classList.toggle("active");
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      burger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          burger.click();
        }
      });
      links.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          burger.classList.remove("active");
          links.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && links.classList.contains("open")) {
          burger.classList.remove("active");
          links.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
          burger.focus();
        }
      });
    }
  }

  /* ---------- Lenis ---------- */
  function initLenis() {
    if (document.body.classList.contains("no-anim")) return;
    if (!hasLenis) return;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    window._lenis = lenis;
    return lenis;
  }

  /* ---------- Article Animations ---------- */
  function initArticleAnimations() {
    if (document.body.classList.contains("no-anim")) return;

    // Hero title split
    var title = document.querySelector(".article-hero h1");
    if (title && hasGSAP) {
      splitWords(title);
      var words = title.querySelectorAll(".split-word span");
      gsap.set(words, { y: "110%" });
      gsap.to(words, {
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power4.out",
        delay: 0.2
      });
    }

    // Hero meta fade in
    if (hasGSAP) {
      gsap.from(".article-hero .eyebrow, .article-hero .meta-date, .article-hero-sub", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1
      });
    }

    // Article body paragraphs
    if (hasScrollTrigger && hasGSAP) {
      var paragraphs = document.querySelectorAll(".article-body p, .article-body h3, .article-body ul, .article-body table");
      paragraphs.forEach(function (p) {
        gsap.from(p, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: p,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      });
    }

    // Page header split for non-article pages
    var splitHeadings = document.querySelectorAll("[data-split]");
    splitHeadings.forEach(function (heading) {
      splitWords(heading);
      var words = heading.querySelectorAll(".split-word span");
      if (hasScrollTrigger && hasGSAP) {
        gsap.set(words, { y: "110%" });
        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          onEnter: function () {
            gsap.to(words, {
              y: 0,
              duration: 0.8,
              stagger: 0.04,
              ease: "power4.out"
            });
          }
        });
      }
    });

    // Reveal elements
    var reveals = document.querySelectorAll(".reveal");
    if (hasScrollTrigger) {
      reveals.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: function () {
            el.classList.add("in");
          }
        });
      });
    } else if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      }, { threshold: 0.15 });
      reveals.forEach(function (el) { obs.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }

    // Service card stagger
    var serviceCards = document.querySelectorAll(".service-card");
    if (serviceCards.length && hasScrollTrigger && hasGSAP) {
      gsap.from(serviceCards, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: serviceCards[0],
          start: "top 80%"
        }
      });
    }

    // Footer reveal
    var footer = document.querySelector(".footer");
    if (footer) {
      if (hasScrollTrigger) {
        ScrollTrigger.create({
          trigger: footer,
          start: "top 95%",
          onEnter: function () {
            footer.classList.add("in");
          }
        });
      } else {
        footer.classList.add("in");
      }
    }
  }

  /* ---------- Reading Progress / Scroll Progress ---------- */
  function initReadingProgress() {
    var bar = document.querySelector(".reading-progress, .scroll-progress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Back to Top ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 600) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    btn.addEventListener("click", function () {
      if (hasLenis && window._lenis) {
        window._lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ---------- Resize Handler ---------- */
  function initResize() {
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (hasScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 250);
    });
  }

  /* ---------- Reading Time ---------- */
  function initReadingTime() {
    var article = document.querySelector(".article-body article");
    if (!article) return;
    var text = article.textContent.trim();
    var wordCount = text.split(/\s+/).length;
    var readTime = Math.max(1, Math.ceil(wordCount / 200));
    var badge = document.createElement("p");
    badge.className = "reading-time";
    badge.textContent = readTime + " min read";
    var hero = document.querySelector(".article-hero .container-narrow");
    if (hero) hero.appendChild(badge);
  }

  /* ---------- Magnetic Buttons ---------- */
  function initMagnetic() {
    if (document.body.classList.contains("no-anim")) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    var magnets = document.querySelectorAll(".magnetic");
    magnets.forEach(function (el) {
      var xTo, yTo;
      if (hasGSAP) {
        xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
        yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });
      }

      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var strength = 0.3;
        if (hasGSAP) {
          xTo(x * strength);
          yTo(y * strength);
        } else {
          el.style.transform = "translate(" + (x * strength) + "px, " + (y * strength) + "px)";
        }
      });

      el.addEventListener("mouseleave", function () {
        if (hasGSAP) {
          xTo(0);
          yTo(0);
        } else {
          el.style.transform = "translate(0, 0)";
        }
      });
    });
  }

  /* ---------- Service Card Mouse Track ---------- */
  function initCardGlow() {
    if (document.body.classList.contains("no-anim")) return;
    var cards = document.querySelectorAll(".service-card");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      });
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initPageLoad();
    initNav();
    initCursor();
    initMagnetic();
    initCardGlow();
    initLenis();
    initReadingProgress();
    initReadingTime();
    initBackToTop();
    initResize();
    initArticleAnimations();
    if (hasScrollTrigger) ScrollTrigger.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
