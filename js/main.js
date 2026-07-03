/* ============================================
   SHOYAIB — Premium Portfolio
   Main JavaScript
   ============================================ */

(function () {
  "use strict";

  document.body.classList.remove("no-js");

  /* ---------- Feature Detection ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof gsap !== "undefined";
  var hasScrollTrigger = hasGSAP && typeof ScrollTrigger !== "undefined";
  var hasLenis = typeof Lenis !== "undefined";

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  var isTouch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;

  if (reduceMotion) {
    document.body.classList.add("no-anim");
  }

  if (isTouch) {
    document.body.classList.add("no-cursor");
  }

  /* ---------- CDN Fallback Check ---------- */
  if (!hasGSAP) {
    document.body.classList.add("no-anim");
  }

  /* ---------- Page Load ---------- */
  function initPageLoad() {
    requestAnimationFrame(function () {
      document.body.classList.add("page-loaded");
    });
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    if (document.body.classList.contains("no-anim")) return;

    var preloader = document.querySelector(".preloader");
    var countEl = document.querySelector(".preloader-count");
    var barEl = document.querySelector(".preloader-bar-fill");
    if (!preloader || !countEl) return;

    var count = 0;
    var interval = setInterval(function () {
      count += Math.floor(Math.random() * 8) + 2;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        setTimeout(function () {
          if (hasGSAP) {
            gsap.to(preloader, {
              yPercent: -100,
              duration: 0.8,
              ease: "power4.inOut",
              onComplete: function () {
                preloader.style.display = "none";
                startHeroAnimations();
                if (hasScrollTrigger) ScrollTrigger.refresh();
              }
            });
          } else {
            preloader.style.display = "none";
            startHeroAnimations();
            if (hasScrollTrigger) ScrollTrigger.refresh();
          }
        }, 300);
      }
      countEl.textContent = count;
      if (barEl) barEl.style.width = count + "%";
    }, 40);
  }

  /* ---------- Hero Animations ---------- */
  function startHeroAnimations() {
    if (!hasGSAP) return;

    var tl = gsap.timeline();

    // Split hero title words
    var heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      splitWords(heroTitle);
      var words = heroTitle.querySelectorAll(".split-word span");
      tl.to(words, {
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power4.out"
      }, 0);
    }

    tl.to(".hero-eyebrow", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    }, 0.3);

    tl.to(".hero-sub", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    }, 0.5);

    tl.to(".hero-meta", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    }, 0.7);

    tl.to(".hero-scroll", {
      opacity: 1,
      duration: 0.6,
      ease: "power3.out"
    }, 1);
  }

  /* ---------- Split Words ---------- */
  function splitWords(el) {
    var text = el.innerHTML;
    // Preserve HTML tags but split text into words
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
        // Text node
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
        // Element node - check if it's a tag like <span class="accent-word">
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

    // Hover states
    var hoverEls = document.querySelectorAll("a, button, .work-item, .gallery-card, .service-card, .article-row, .magnetic, .back-to-top");
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

  /* ---------- Navigation ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var lastScroll = 0;
    var ticking = false;

    function onScroll() {
      var scroll = window.scrollY;

      if (scroll > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

      // Auto-hide/show nav
      if (scroll > 200 && scroll > lastScroll + 5) {
        nav.classList.add("hidden");
      } else if (scroll < lastScroll - 5) {
        nav.classList.remove("hidden");
      }

      lastScroll = scroll;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Mobile menu
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
      // Close menu on Escape
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

  /* ---------- Scroll Spy (active nav link) ---------- */
  function initScrollSpy() {
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-link[href^='#']");
    if (!sections.length || !navLinks.length) return;

    if ("IntersectionObserver" in window) {
      var spyObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach(function (sec) { spyObs.observe(sec); });
    } else {
      function updateActive() {
        var scrollY = window.scrollY + 120;
        var current = "";
        sections.forEach(function (sec) {
          if (scrollY >= sec.offsetTop) {
            current = sec.getAttribute("id");
          }
        });
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
          }
        });
      }
      window.addEventListener("scroll", updateActive, { passive: true });
      updateActive();
    }
  }

  /* ---------- Scroll Progress ---------- */
  function initScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
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

  /* ---------- Smooth Scroll (Lenis) ---------- */
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

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });

    return lenis;
  }

  /* ---------- Scroll Animations ---------- */
  function initScrollAnimations() {
    if (document.body.classList.contains("no-anim")) return;

    // Reveal elements
    var reveals = document.querySelectorAll(".reveal");
    if (hasScrollTrigger) {
      reveals.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: function () {
            el.classList.add("in");
          },
          onEnterBackwards: function () {
            el.classList.add("in");
          }
        });
      });
    } else {
      // Fallback with IntersectionObserver
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
            }
          });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { obs.observe(el); });
      } else {
        reveals.forEach(function (el) { el.classList.add("in"); });
      }
    }

    // Split word reveals for headings
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

    // Parallax on work items
    if (hasScrollTrigger && hasGSAP) {
      var parallaxEls = document.querySelectorAll("[data-parallax]");
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        gsap.to(el, {
          y: function () { return -window.innerHeight * speed; },
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    }

    // Work item clip-path reveals
    var workItems = document.querySelectorAll(".work-item");
    if (hasScrollTrigger) {
      workItems.forEach(function (item, idx) {
        item.classList.add("reveal-clip");
        ScrollTrigger.create({
          trigger: item,
          start: "top 88%",
          onEnter: function () {
            setTimeout(function () {
              item.classList.add("in");
            }, idx * 80);
          }
        });
      });
    } else {
      workItems.forEach(function (item) { item.classList.add("in"); });
    }

    // Service card stagger reveal
    var serviceCards = document.querySelectorAll(".service-card");
    if (hasScrollTrigger && hasGSAP) {
      gsap.set(serviceCards, { opacity: 0, y: 60 });
      ScrollTrigger.create({
        trigger: ".service-cards",
        start: "top 80%",
        onEnter: function () {
          gsap.to(serviceCards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power4.out"
          });
        }
      });
    }

    // Process steps stagger
    var processSteps = document.querySelectorAll(".process-step");
    if (hasScrollTrigger && hasGSAP) {
      processSteps.forEach(function (step) {
        gsap.from(step, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        });
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

    // Work item image scale on scroll
    if (hasScrollTrigger && hasGSAP) {
      var workMedia = document.querySelectorAll(".work-item img, .work-item video, .gallery-card img, .gallery-card video");
      workMedia.forEach(function (media) {
        gsap.fromTo(media, {
          scale: 1.15
        }, {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: media.closest(".work-item, .gallery-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
          }
        });
      });
    }

    // Stat counters
    var statNumbers = document.querySelectorAll("[data-count]");
    statNumbers.forEach(function (stat) {
      var target = parseFloat(stat.getAttribute("data-count"));
      var suffix = stat.getAttribute("data-suffix") || "";
      var decimals = parseInt(stat.getAttribute("data-decimals") || "0");
      var started = false;

      function startCount() {
        if (started) return;
        started = true;
        var obj = { val: 0 };
        if (hasGSAP) {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              stat.textContent = obj.val.toFixed(decimals) + suffix;
            }
          });
        } else {
          var start = 0;
          var duration = 2000;
          var startTime = performance.now();
          function step(now) {
            var progress = Math.min((now - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            stat.textContent = (eased * target).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      }

      if (hasScrollTrigger) {
        ScrollTrigger.create({
          trigger: stat,
          start: "top 85%",
          onEnter: startCount
        });
      } else if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) startCount();
        }, { threshold: 0.5 });
        obs.observe(stat);
      } else {
        startCount();
      }
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

  /* ---------- Video Hover Play ---------- */
  function initVideoHover() {
    if (isTouch) return;
    var videoItems = document.querySelectorAll(".work-item video, .gallery-card video");
    videoItems.forEach(function (video) {
      var container = video.closest(".work-item, .gallery-card");
      if (!container) return;
      video.setAttribute("aria-label", "Video preview");

      var playPromise = null;
      container.addEventListener("mouseenter", function () {
        playPromise = video.play();
        if (playPromise) playPromise.catch(function () {});
      });
      container.addEventListener("mouseleave", function () {
        if (playPromise !== undefined) {
          video.pause();
        }
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var lightbox = document.querySelector(".lightbox");
    if (!lightbox) return;
    var content = lightbox.querySelector(".lightbox-content");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    function openLightbox(src, type) {
      lastFocused = document.activeElement;
      content.innerHTML = "";
      if (type === "video") {
        var v = document.createElement("video");
        v.controls = true;
        v.autoplay = true;
        v.setAttribute("aria-label", "Video player");
        v.tabIndex = -1;
        v.src = src;
        content.appendChild(v);
      } else {
        var img = document.createElement("img");
        img.src = src;
        img.alt = "Full size view";
        img.tabIndex = -1;
        content.appendChild(img);
      }
      lightbox.classList.add("open");
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", "Media viewer");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.removeAttribute("role");
      lightbox.removeAttribute("aria-modal");
      lightbox.removeAttribute("aria-label");
      document.body.style.overflow = "";
      setTimeout(function () {
        content.innerHTML = "";
      }, 400);
      if (lastFocused) lastFocused.focus();
    }

    // Focus trap
    var focusableSelectors = "button, [href], input, select, textarea, video, img, [tabindex]:not([tabindex='-1'])";
    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && lightbox.classList.contains("open")) {
        var focusable = lightbox.querySelectorAll(focusableSelectors);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Video items
    document.querySelectorAll("[data-lightbox]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var src = el.getAttribute("data-lightbox");
        var type = el.getAttribute("data-lightbox-type") || "image";
        openLightbox(src, type);
      });
      // Keyboard support
      if (el.getAttribute("tabindex") === "0") {
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            var src = el.getAttribute("data-lightbox");
            var type = el.getAttribute("data-lightbox-type") || "image";
            openLightbox(src, type);
          }
        });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeLightbox);
    }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
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

  /* ---------- Marquee Clone ---------- */
  function initMarquee() {
    var tracks = document.querySelectorAll(".marquee-track");
    tracks.forEach(function (track) {
      var clone = track.cloneNode(true);
      track.parentNode.appendChild(clone);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initPageLoad();
    initMarquee();
    initNav();
    initScrollSpy();
    initScrollProgress();
    initBackToTop();
    initCursor();
    initMagnetic();
    initCardGlow();
    initVideoHover();
    initLightbox();
    initResize();
    var lenis = initLenis();
    if (lenis) window._lenis = lenis;
    initScrollAnimations();

    if (hasScrollTrigger) {
      ScrollTrigger.refresh();
    }

    // Start preloader after a tiny delay to ensure DOM is ready
    if (document.querySelector(".preloader")) {
      initPreloader();
    } else {
      startHeroAnimations();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
