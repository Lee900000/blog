/* Glossary concept cards. Captions stay in server-rendered HTML, so the no-JS
   and reduced-motion versions show the finished diagram with every caption.
   With motion, a card plays by itself while it is on screen, loops, pauses
   when it scrolls away, and restarts when tapped. No buttons. */
(function () {
  "use strict";
  var cards = document.querySelectorAll("[data-concept-anim]");
  if (!cards.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // How long each step stays on screen (ms): the opening frame, three
  // middle steps, then the finished diagram before the loop starts again.
  var HOLD = [1400, 2200, 2200, 2200, 3200];

  var controllers = [];
  cards.forEach(function (card) {
    var stage = card.querySelector(".gm-stage");
    var captions = card.querySelectorAll("[data-motion-step]");
    var frames = card.querySelectorAll("[data-motion-frame]");
    var dots = card.querySelectorAll(".gm-dots b");
    var step = 0, timer = null;

    function render() {
      stage.dataset.step = String(step);
      stage.dataset.focus = captions[step].getAttribute("data-motion-focus") || "0";
      captions.forEach(function (line, i) { line.hidden = i !== step; });
      frames.forEach(function (frame, i) {
        frame.hidden = i !== step;
        if (i === step) stage.style.setProperty("--gm-position", Number(frame.dataset.position) + "%");
      });
      dots.forEach(function (dot, i) { dot.classList.toggle("on", i < step); });
    }
    // Jump back to the opening frame without animating the way there.
    function reset() {
      card.classList.add("is-resetting");
      step = 0;
      render();
      stage.getBoundingClientRect();
      card.classList.remove("is-resetting");
    }
    function tick() {
      timer = window.setTimeout(function () {
        if (step === 4) reset(); else { step += 1; render(); }
        tick();
      }, HOLD[step]);
    }
    function play() { if (!timer) tick(); }
    function pause() { window.clearTimeout(timer); timer = null; }

    card.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) return;
      pause(); reset(); play();
      if (typeof window.gtag === "function") window.gtag("event", "anim_replay", { term: card.dataset.conceptAnim, page_path: location.pathname });
    });
    card.classList.add("is-ready");
    card.querySelector(".gm-dots").hidden = false;
    reset();
    controllers.push({ card: card, play: play, pause: pause, seen: false });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      controllers.forEach(function (c) {
        if (c.card !== entry.target) return;
        c.seen = entry.isIntersecting;
        if (c.seen && !document.hidden) c.play(); else c.pause();
      });
    });
  }, { threshold: 0.5 });
  controllers.forEach(function (c) { observer.observe(c.card); });
  document.addEventListener("visibilitychange", function () {
    controllers.forEach(function (c) { if (document.hidden) c.pause(); else if (c.seen) c.play(); });
  });
})();

