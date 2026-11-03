/* Glossary concept cards. Captions stay in server-rendered HTML, so the no-JS
   and reduced-motion versions show the finished diagram with every caption.
   With motion, a card plays by itself while it is on screen, loops, pauses
   when it scrolls away, and restarts when tapped. No buttons. */
window.startNativeGlossaryMotion = function () {
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

    var disclosure = card.closest('details.gm-expand');
    if (disclosure) disclosure.addEventListener('toggle', function () {
      if (disclosure.open) { pause(); reset(); if (!document.hidden) play(); }
      else pause();
    });

    card.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) return;
      pause(); reset(); play(); 
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
};
(function () {
  async function mount() {
    var root = document.getElementById('article-container');
    if (!root || !root.querySelector('#crypto-term-search') || root.dataset.nativeMotion) return;
    root.dataset.nativeMotion = 'loading';
    try {
      var response = await fetch('/assets/crypto-glossary/concept-scenes.json');
      if (!response.ok) throw new Error('Animation data unavailable');
      var scenes = await response.json();
      var targets = {
        stablecoin:'稳定币',usdc:'USDC',onramp:'入金 / 出金',premium:'溢价 / 折价',kyc:'KYC', '2fa':'双重验证',antiphishing:'防钓鱼码',whitelist:'提币白名单',por:'储备金证明',
        trc20:'网络与代币标准',memo:'Memo / Tag',txid:'交易哈希',gas:'Gas /',selfcustody:'托管钱包',seed:'私钥 / 助记词',approve:'智能合约与授权',halving:'减半',spot:'现货（',limit:'限价单',slippage:'滑点',spread:'买一 / 卖一',convert:'闪兑',pin:'插针',
        perp:'永续合约',futures:'交割合约',umargined:'U 本位',long:'做多 / 做空',margin:'保证金（',cross:'全仓 / 逐仓',liqprice:'强平价格 /',mmr:'维持保证金',markprice:'标记价格',tpsl:'止盈 / 止损',adl:'自动减仓',
        bucang:'补仓',jiacang:'加仓',gunchang:'滚仓',positionsize:'以损定仓',rr:'盈亏比',basis:'期现套利',ahr999:'AHR999',fng:'恐惧与贪婪指数',rainbow:'彩虹图',ath:'历史最高价',dominance:'比特币市值占比',bull:'牛市 / 熊市'
      };
      var headings = Array.from(root.querySelectorAll('h3'));
      scenes.forEach(function (scene) {
        var heading = headings.find(function (h) { return h.textContent.includes(targets[scene.key]); });
        if (!heading) throw new Error('Missing animation target: ' + scene.key);
        var captions = window.glossarySceneCaptions[scene.key];
        if (!captions || captions.length !== 5) throw new Error('Missing animation captions: ' + scene.key);
        var template = document.createElement('template');
        template.innerHTML = scene.html;
        var card = template.content.firstElementChild;
        card.querySelectorAll('.gm-steps li').forEach(function (line, index) {
          var spans = line.querySelectorAll('span');
          if (spans.length) spans[spans.length - 1].textContent = captions[index];
        });
        card.dataset.blogNative = 'true';
        var mounted = card;
        if (!['stablecoin','usdc','onramp','premium','kyc'].includes(scene.key)) {
          var disclosure = document.createElement('details');
          disclosure.className = 'gm-expand';
          disclosure.dataset.blogNative = 'true';
          disclosure.dataset.conceptDisclosure = scene.key;
          var summary = document.createElement('summary');
          summary.textContent = '查看概念动画 ↗';
          summary.setAttribute('aria-label', (card.getAttribute('aria-label') || heading.textContent.trim()) + '：查看概念动画');
          disclosure.append(summary, card);
          mounted = disclosure;
        }
        var old = heading.nextElementSibling;
        while (old && !/^H[23]$/.test(old.tagName)) {
          var next = old.nextElementSibling;
          if (old.classList.contains('term-animation')) old.remove();
          old = next;
        }
        var after = heading.nextElementSibling;
        while (after && after.nextElementSibling && after.nextElementSibling.dataset.blogNative) after = after.nextElementSibling;
        if (after) after.after(mounted); else heading.after(mounted);
      });
      var inlineResponse = await fetch('/assets/crypto-glossary/inline-scenes.json');
      if (!inlineResponse.ok) throw new Error('Inline animation data unavailable');
      var inlineScenes = await inlineResponse.json();
      var inlineTargets = {usdt:'USDT / U',c2c:'C2C / P2P',network:'区块链 / 公链',poison:'地址投毒',maker:'挂单 / 吃单',leverage:'杠杆（',liquidation:'强平 / 爆仓',funding:'资金费率（',dca:'定投（',grid:'网格交易'};
      inlineScenes.forEach(function (scene) {
        var heading = headings.find(function (h) { return h.textContent.includes(inlineTargets[scene.key]); });
        if (!heading) throw new Error('Missing animation target: ' + scene.key);
        var template = document.createElement('template');
        template.innerHTML = scene.html;
        var card = template.content.firstElementChild;
        card.dataset.inlineConcept = scene.key;
        card.dataset.blogNative = 'true';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', heading.textContent.trim() + '：点击重播动画');
        function replay() { card.classList.remove('play'); void card.offsetWidth; card.classList.add('play'); }
        card.addEventListener('click', replay);
        card.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); replay(); } });
        var after = heading.nextElementSibling;
        if (after) after.after(card); else heading.after(card);
        if ('IntersectionObserver' in window) {
          var observer = new IntersectionObserver(function (entries) { card.classList.toggle('play', entries[0].isIntersecting); }, {threshold:.2});
          observer.observe(card);
        } else card.classList.add('play');
      });
      root.dataset.nativeMotion = 'ready';
      window.startNativeGlossaryMotion();
    } catch (error) {
      root.dataset.nativeMotion = 'failed';
      console.error('Glossary animation loading failed', error);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  document.addEventListener('pjax:complete', mount);
})();

