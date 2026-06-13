const insightIcons = {
  learn: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3.75h7.5L18 7.25v13H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" stroke="#1c3466" stroke-width="1.8"/><path d="M14 4v4h4M9 12h6M9 15h6" stroke="#1c3466" stroke-width="1.8" stroke-linecap="round"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.5 11.25a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z" stroke="#1c3466" stroke-width="1.8"/><path d="M4.75 20.25c1.2-3.6 4-5.5 7.25-5.5s6.05 1.9 7.25 5.5" stroke="#1c3466" stroke-width="1.8" stroke-linecap="round"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.5 14.2 8.2l4.2.6-3 3 .7 4.2L12 13.8l-3.9 2.2.7-4.2-3-3 4.2-.6L12 4.5Z" stroke="#1c3466" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="11" r="6.5" stroke="#1c3466" stroke-width="1.4" stroke-dasharray="2 2"></circle></svg>'
};

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('event-detail-root');
  if (!root) return;

  await loadComponent('event-detail-root', '../components/event-detail.html?v=20260613-05');

  if (!root.querySelector('.event-detail-hero')) return;

  root.addEventListener('click', handleRootClick);
  renderEventDetail();
});

function renderEventDetail() {
  const root = document.getElementById('event-detail-container') || document;
  const event = getSelectedEvent();
  if (!root || !event) return;
  document.body.setAttribute('data-event-slug', event.slug);

  renderHero(root, event);
  renderMeta(root, event);
  renderInsights(root, event);
  renderGallery(root, event);
  renderRelatedEvents(root, event);

  root.dataset.eventSlug = event.slug;

  if (window.innerWidth <= 480) {
    injectMobileWaves(root);
  }

  document.title = `${event.title} | AWS Learning Club`;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', event.summary.slice(0, 160));
}

function getSelectedEvent() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('event') || eventDetailData[0].slug;
  return eventDetailData.find((item) => item.slug === slug) || eventDetailData[0];
}

function renderHero(root, event) {
  const hero = root.querySelector('.event-detail-hero');
  if (hero) hero.dataset.eventSlug = event.slug;

  const img = root.querySelector('[data-event-hero-image]');
  if (img) {
    img.src = event.heroImage;
    img.alt = `${event.title} poster`;
    img.style.setProperty('--event-hero-image-position', event.heroImagePosition || 'center');
  }

  const mobileTitleImg = root.querySelector('[data-mobile-title-img]');
  if (mobileTitleImg) {
    mobileTitleImg.src = event.mobileTitleImage || '';
    mobileTitleImg.alt = `${event.title} poster`;
  }

  setText(root, '[data-event-category]', event.category);
  setText(root, '[data-mobile-category]', event.category);
  setText(root, '[data-event-title]', event.title);
  setText(root, '[data-mobile-title]', event.title);

  const subtitleEl = root.querySelector('[data-event-subtitle]');
  if (subtitleEl) {
    subtitleEl.innerHTML = (event.subtitle || '').replace(/AI Shift/g, '<span class="subtitle-highlight">AI Shift</span>');
  }

  const mobileSubtitleEl = root.querySelector('[data-mobile-subtitle]');
  if (mobileSubtitleEl) {
    mobileSubtitleEl.innerHTML = (event.subtitle || '').replace(/AI Shift/g, '<span class="subtitle-highlight">AI Shift</span>');
  }

  const quoteEl = root.querySelector('[data-event-quote]');
  if (quoteEl) {
    quoteEl.innerHTML = (event.quote || '').replace(/KIRO/g, '<span class="quote-highlight">KIRO</span>');
  }

  const mobileQuoteEl = root.querySelector('[data-mobile-quote]');
  if (mobileQuoteEl) {
    mobileQuoteEl.innerHTML = (event.quote || '').replace(/KIRO/g, '<span class="quote-highlight">KIRO</span>');
  }

  setText(root, '[data-event-summary]', event.summary);
  setText(root, '[data-mobile-summary]', event.summary);
}

const metaIcons = {
  time: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#1c3466" stroke-width="1.8"/><path d="M12 7v5l3.5 2" stroke="#1c3466" stroke-width="1.8" stroke-linecap="round"/></svg>',
  date: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1c3466" stroke-width="1.8"/><path d="M3 10h18M8 2v4M16 2v4" stroke="#1c3466" stroke-width="1.8" stroke-linecap="round"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="#1c3466" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="#1c3466" stroke-width="1.8"/></svg>'
};

function renderMeta(root, event) {
  const labels = {
    date: 'DATE',
    time: 'DURATION',
    location: 'LOCATION'
  };
  const subValues = {
    time: event.mobileDurationSub || '',
    location: event.mobileLocationSub || ''
  };

  setText(root, '[data-mobile-date]', event.date);
  setText(root, '[data-mobile-time]', event.mobileDuration || event.time);
  setText(root, '[data-mobile-timesub]', event.mobileDurationSub || '');
  setText(root, '[data-mobile-location]', event.mobileLocation || event.location);
  setText(root, '[data-mobile-locationsub]', event.mobileLocationSub || '');

  [['time', event.time], ['date', event.date], ['location', event.location]].forEach(([key, value]) => {
    const card = root.querySelector(`[data-meta-card="${key}"]`);
    if (!card) return;
    card.hidden = !value;
    const strong = card.querySelector('strong');
    if (strong) strong.textContent = value || '';
    const icon = card.querySelector('[data-meta-icon]');
    if (icon && metaIcons[key]) icon.innerHTML = metaIcons[key];

    if (window.innerWidth <= 480) {
      let label = card.querySelector('.event-detail-meta-label');
      if (!label) {
        label = document.createElement('span');
        label.className = 'event-detail-meta-label';
        card.insertBefore(label, strong ? strong.nextSibling : null);
      }
      label.textContent = labels[key] || '';

      let sub = card.querySelector('.event-detail-meta-sub');
      if (!sub) {
        sub = document.createElement('span');
        sub.className = 'event-detail-meta-sub';
        card.appendChild(sub);
      }
      sub.textContent = subValues[key] || '';

      if (key === 'time') {
        strong.textContent = event.mobileDuration || value;
      }
      if (key === 'location') {
        strong.textContent = event.mobileLocation || value;
      }
    }
  });
}

function renderInsights(root, event) {
  const mobileTitles = {
    left: 'KEY TOPICS',
    right: 'LEARNING OUTCOME'
  };

  ['left', 'center', 'right'].forEach((key) => {
    const insight = (event.insights || []).find((i) => i.key === key);
    const card = root.querySelector(`[data-insight-card="${key}"]`);
    if (!card) return;
    if (!insight) { card.hidden = true; return; }

    card.hidden = false;
    const title = window.innerWidth <= 480 && mobileTitles[key] ? mobileTitles[key] : insight.title;
    setText(root, `[data-insight-title="${key}"]`, title);

    const icon = root.querySelector(`[data-insight-icon="${key}"]`);
    if (icon) icon.innerHTML = insightIcons[insight.type] || insightIcons.learn;

    const list = root.querySelector(`[data-insight-list="${key}"]`);
    if (!list) return;
    list.innerHTML = '';
    (insight.items || []).forEach((item) => list.appendChild(createItem(item)));
  });
}

function createItem(item) {
  const li = document.createElement('li');
  if (typeof item === 'string') { li.textContent = item; return li; }

  const wrapper = document.createElement('div');
  wrapper.className = 'event-detail-person';

  const name = document.createElement('strong');
  name.textContent = item.name || '';

  const role = document.createElement('span');
  role.innerHTML = [item.role, item.company].filter(Boolean).join('<br>');

  wrapper.append(name, role);
  li.appendChild(wrapper);
  return li;
}

function renderGallery(root, event) {
  const section = root.querySelector('[data-gallery-section]');
  const gallery = root.querySelector('[data-event-gallery]');
  if (!gallery) return;

  gallery.innerHTML = '';

  if (!Array.isArray(event.gallery) || event.gallery.length === 0) {
    if (section) section.hidden = true;
    return;
  }

  if (section) section.hidden = false;

  const headerSmall = root.querySelector('[data-gallery-small]');
  const headerLarge = root.querySelector('[data-gallery-large]');
  const headerTitle = root.querySelector('[data-gallery-event-title]');
  const headerPara = root.querySelector('[data-gallery-paragraph]');

  if (event.galleryHeader) {
    if (headerSmall) headerSmall.textContent = event.galleryHeader.smallText;
    if (headerLarge) headerLarge.textContent = event.galleryHeader.largeText;
    if (headerTitle) headerTitle.textContent = event.galleryHeader.title;
    if (headerPara) headerPara.textContent = event.galleryHeader.paragraph;
  } else {
    if (headerTitle) headerTitle.textContent = event.title;
  }

  const SPEED = 2.5; /* Increased to make the animation faster */
  const GAP = 20;
  let items = [];
  let animId = null;
  let resizeTimer = null;

  event.gallery.forEach((image) => {
    const figure = document.createElement('figure');
    figure.className = 'event-detail-gallery-item';

    const img = document.createElement('img');
    img.src = image;
    img.alt = `${event.title} gallery image`;
    img.loading = 'eager'; /* Forces the browser to load them immediately instead of waiting for scroll */

    figure.appendChild(img);
    gallery.appendChild(figure);
  });

  function destroyGalleryAnimation() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    items = [];
  }

  function positionStatic() {
    destroyGalleryAnimation();
    const figures = gallery.querySelectorAll('.event-detail-gallery-item');
    let x = 0;

    figures.forEach((figure) => {
      const w = figure.offsetWidth || 489;
      figure.style.transform = `translateX(${x}px)`;
      x += w + GAP;
    });
  }

  function startAnimation() {
    destroyGalleryAnimation();

    const figures = gallery.querySelectorAll('.event-detail-gallery-item');
    figures.forEach((figure) => {
      const width = figure.offsetWidth || 489;
      items.push({ el: figure, x: 0, width });
    });

    requestAnimationFrame(() => {
      const rowWidth = gallery.offsetWidth;
      let startX = rowWidth;

      items.forEach((item) => {
        item.x = startX;
        startX += item.width + GAP;
        item.el.style.transform = `translateX(${item.x}px)`;
      });

      function tick() {
        const rightmost = items.reduce((max, item) => (item.x + item.width) > (max.x + max.width) ? item : max);

        items.forEach((item) => {
          item.x -= SPEED;
          if (item.x + item.width < 0) {
            item.x = rightmost.x + rightmost.width + GAP;
          }
          item.el.style.transform = `translateX(${item.x}px)`;
        });

        animId = requestAnimationFrame(tick);
      }

      animId = requestAnimationFrame(tick);
    });
  }

  function refreshGallery() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 1280) positionStatic();
      else startAnimation();
    }, 150);
  }

  window.addEventListener('resize', refreshGallery);

  if (window.innerWidth <= 1280) positionStatic();
  else startAnimation();
}

function renderRelatedEvents(root, event) {
  const section = root.querySelector('[data-related-section]');
  const relatedRoot = root.querySelector('[data-event-related]');
  if (!relatedRoot) return;
  relatedRoot.innerHTML = '';

  const slugs = getRelatedSlugs(event);
  if (slugs.length === 0) { if (section) section.hidden = true; return; }
  if (section) section.hidden = false;

  slugs.forEach((slug) => {
    const relatedEvent = eventDetailData.find((item) => item.slug === slug);
    if (!relatedEvent) return;

    const link = document.createElement('a');
    link.className = 'event-detail-related-card';
    link.href = `event-detail.html?event=${encodeURIComponent(relatedEvent.slug)}`;

    const image = document.createElement('img');
    image.className = 'event-detail-related-card-img';
    image.src = relatedEvent.relatedHeroImage || relatedEvent.heroImage;
    image.alt = `${relatedEvent.title} poster`;
    image.loading = 'lazy';

    const title = document.createElement('h3');
    title.textContent = relatedEvent.title;

    const subtitle = document.createElement('p');
    subtitle.textContent = relatedEvent.subtitle;

    const action = document.createElement('span');
    action.className = 'event-detail-related-action';
    action.textContent = 'View Event Details';

    link.append(image, title, subtitle, action);
    relatedRoot.appendChild(link);
  });
}

function getRelatedSlugs(event) {
  if (Array.isArray(event.relatedEvents) && event.relatedEvents.length > 0) return event.relatedEvents;
  return eventDetailData.filter((item) => item.slug !== event.slug).map((item) => item.slug);
}

function setText(root, selector, value) {
  const el = root.querySelector(selector);
  if (el) el.textContent = value || '';
}

function injectMobileWaves(root) {
  const shell = root.querySelector('.event-detail-shell');
  if (!shell) return;
  const waveEl = document.createElement('div');
  waveEl.className = 'event-detail-mobile-waves';
  shell.appendChild(waveEl);

  const waves = ['wave-xl', 'wave-lg', 'wave-md', 'wave-mid', 'wave-sm', 'wave-bottom', 'wave-bottom-last'];
  waves.forEach((name) => {
    const img = document.createElement('img');
    img.className = `event-detail-wave event-detail-wave-${name}`;
    img.src = `../assets/events/mobile/${name}.svg`;
    img.alt = '';
    waveEl.appendChild(img);
  });
}

function handleRootClick(event) {
  const target = event.target instanceof Element ? event.target : event.target.parentElement;
  const backButton = target ? target.closest('[data-event-back]') : null;
  if (backButton) {
    window.location.href = 'events.html';
  }
}
