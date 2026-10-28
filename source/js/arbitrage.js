(() => {
  const app = document.querySelector('.arbitrage-app');
  if (!app) return;

  const nav = app.querySelector('#strategyNav');
  const viewer = app.querySelector('#strategyViewer');
  const name = app.querySelector('#strategyName');
  const open = app.querySelector('#openStrategy');
  const quantLightbox = app.querySelector('#quantLightbox');
  const quantTriggers = [...app.querySelectorAll('.quant-showcase-trigger')];
  const quantImage = app.querySelector('#quantLightboxImage');
  const quantCaption = app.querySelector('#quantLightboxCaption');
  let quantIndex = 0;

  const renderQuantImage = index => {
    quantIndex = (index + quantTriggers.length) % quantTriggers.length;
    const trigger = quantTriggers[quantIndex];
    const image = trigger.querySelector('img');
    quantImage.src = image.currentSrc || image.src;
    quantImage.alt = image.alt;
    quantCaption.textContent = trigger.querySelector('.quant-showcase-caption').textContent;
  };

  const closeQuantLightbox = () => {
    quantLightbox.hidden = true;
    document.body.classList.remove('quant-lightbox-open');
    quantTriggers[quantIndex]?.focus();
  };

  const openQuantLightbox = index => {
    renderQuantImage(index);
    quantLightbox.hidden = false;
    document.body.classList.add('quant-lightbox-open');
    quantLightbox.querySelector('[data-quant-lightbox="close"]').focus();
  };

  quantTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openQuantLightbox(index));
  });

  quantLightbox.addEventListener('click', event => {
    if (event.target === quantLightbox) closeQuantLightbox();
    if (event.target.closest('[data-quant-lightbox="close"]')) closeQuantLightbox();
    if (event.target.closest('[data-quant-lightbox="previous"]')) renderQuantImage(quantIndex - 1);
    if (event.target.closest('[data-quant-lightbox="next"]')) renderQuantImage(quantIndex + 1);
  });

  document.addEventListener('keydown', event => {
    if (quantLightbox.hidden) return;
    if (event.key === 'Escape') closeQuantLightbox();
    if (event.key === 'ArrowLeft') renderQuantImage(quantIndex - 1);
    if (event.key === 'ArrowRight') renderQuantImage(quantIndex + 1);
  });

  nav.addEventListener('click', event => {
    const card = event.target.closest('.strategy-card');
    if (!card) return;

    nav.querySelectorAll('.strategy-card').forEach(item => item.classList.remove('active'));
    card.classList.add('active');
    viewer.src = card.dataset.src;
    viewer.title = `${card.dataset.name}策略内容`;
    name.textContent = card.dataset.name;
    open.href = card.dataset.src;

    if (window.innerWidth <= 900) {
      app.querySelector('.strategy-reader').scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
