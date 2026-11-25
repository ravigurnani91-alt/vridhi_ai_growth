const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }));
}
document.querySelectorAll('.answer-option').forEach(button => {
  button.addEventListener('click', () => {
    const feedback = document.querySelector('.answer-feedback');
    document.querySelectorAll('.answer-option').forEach(option => {
      option.disabled = true;
      if (option.dataset.answer === 'right') option.classList.add('correct');
    });
    if (button.dataset.answer === 'right') {
      feedback.textContent = 'That’s right. Excess nutrients, warmth and sunlight can encourage algae to multiply. The exact causes and risks depend on the lake and should be investigated with water-quality evidence.';
    } else {
      button.classList.add('incorrect');
      feedback.textContent = 'Not quite. Algal growth is often linked to excess nutrients, sunlight and suitable temperatures. Some blooms can affect water quality and aquatic life.';
    }
  });
});
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Division-page subject and issue filters. All filtering happens locally in the browser.
document.querySelectorAll('.filter-search, .filter-category').forEach(control => {
  control.addEventListener('input', applyLocalFilter);
  control.addEventListener('change', applyLocalFilter);
});
function applyLocalFilter() {
  const search = (document.querySelector('.filter-search')?.value || '').trim().toLowerCase();
  const category = document.querySelector('.filter-category')?.value || 'all';
  document.querySelectorAll('[data-searchable]').forEach(card => {
    const text = (card.textContent || '').toLowerCase();
    const matchesText = !search || text.includes(search);
    const matchesCategory = category === 'all' || card.dataset.category === category;
    card.hidden = !(matchesText && matchesCategory);
  });
}

// Reusable, client-side quiz interaction.
document.querySelectorAll('.interactive-quiz').forEach(quiz => {
  const result = quiz.querySelector('.quiz-result');
  const answer = quiz.dataset.answer;
  quiz.querySelectorAll('.quiz-choice').forEach(choice => {
    choice.addEventListener('click', () => {
      quiz.querySelectorAll('.quiz-choice').forEach(button => {
        button.disabled = true;
        if (button.dataset.choice === answer) button.style.borderColor = '#55765e';
      });
      const correct = choice.dataset.choice === answer;
      if (!correct) choice.style.borderColor = '#c96e4d';
      result.textContent = (correct ? 'Correct. ' : 'Not quite. ') + quiz.dataset.explanation;
    });
  });
});

// Lightweight converters; inputs remain on-device and are not transmitted.
function bindConverter(inputId, modeId, outputId, convert) {
  const input = document.getElementById(inputId);
  const mode = document.getElementById(modeId);
  const output = document.getElementById(outputId);
  if (!input || !mode || !output) return;
  const update = () => {
    if (input.value === '') { output.textContent = 'Result appears here'; return; }
    const value = Number(input.value);
    if (!Number.isFinite(value)) { output.textContent = 'Enter a valid number'; return; }
    const result = convert(value, mode.value);
    output.textContent = result.text;
  };
  input.addEventListener('input', update);
  mode.addEventListener('change', update);
}
bindConverter('distance-value', 'distance-mode', 'distance-output', (v, mode) =>
  mode === 'km'
    ? {text: (v * 0.621371).toLocaleString(undefined, {maximumFractionDigits: 4}) + ' miles'}
    : {text: (v * 1.609344).toLocaleString(undefined, {maximumFractionDigits: 4}) + ' kilometres'}
);
bindConverter('temperature-value', 'temperature-mode', 'temperature-output', (v, mode) =>
  mode === 'c'
    ? {text: ((v * 9 / 5) + 32).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' °F'}
    : {text: ((v - 32) * 5 / 9).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' °C'}
);


// Curiosity roulette: lightweight, accessible discovery prompts on the homepage.
const surpriseIdeas = [
  {question:'What if a forgotten village holds clues to how an entire civilisation lived?',url:'discover/'},
  {question:'How can a lake look beautiful and still be in ecological trouble?',url:'earth/'},
  {question:'What made ancient astronomers build instruments the size of buildings?',url:'journal/jantar-mantar-jaipur-astronomy-architecture/'},
  {question:'Why do some cities become magnets for people, money and ideas?',url:'discover/'},
  {question:'What happens to a community when its water source begins to disappear?',url:'earth/'},
  {question:'Which stories about haunted places are folklore, and which have a documented history?',url:'journal/'},
  {question:'Can one small invention change how millions of people live?',url:'discover/'}
];
const surpriseButton = document.getElementById('surprise-button');
if (surpriseButton) {
  let lastSurprise = -1;
  surpriseButton.addEventListener('click', () => {
    let next = Math.floor(Math.random() * surpriseIdeas.length);
    if (surpriseIdeas.length > 1 && next === lastSurprise) next = (next + 1) % surpriseIdeas.length;
    lastSurprise = next;
    const idea = surpriseIdeas[next];
    const question = document.getElementById('surprise-question');
    const link = document.getElementById('surprise-link');
    if (question) question.textContent = idea.question;
    if (link) link.href = idea.url;
  });
}


// Homepage story carousel controls and progress indicator.
const storyCarousel = document.getElementById('story-carousel');
if (storyCarousel) {
  const prev = document.querySelector('.slide-prev');
  const next = document.querySelector('.slide-next');
  const progress = document.querySelector('.carousel-progress span');
  const updateCarouselProgress = () => {
    const max = storyCarousel.scrollWidth - storyCarousel.clientWidth;
    const ratio = max > 0 ? storyCarousel.scrollLeft / max : 0;
    if (progress) progress.style.width = (20 + ratio * 80) + '%';
  };
  prev?.addEventListener('click', () => storyCarousel.scrollBy({left: -storyCarousel.clientWidth * .72, behavior: 'smooth'}));
  next?.addEventListener('click', () => storyCarousel.scrollBy({left: storyCarousel.clientWidth * .72, behavior: 'smooth'}));
  storyCarousel.addEventListener('scroll', updateCarouselProgress, {passive:true});
  window.addEventListener('resize', updateCarouselProgress);
  updateCarouselProgress();
}

// Homepage daily-question widget.
document.querySelectorAll('[data-home-answer]').forEach(button => {
  button.addEventListener('click', () => {
    const widget = button.closest('.widget-question');
    const feedback = widget?.querySelector('.home-answer-feedback');
    widget?.querySelectorAll('[data-home-answer]').forEach(option => {
      option.disabled = true;
      if (option.dataset.homeAnswer === 'right') option.style.borderColor = '#55765e';
    });
    if (button.dataset.homeAnswer !== 'right') button.style.borderColor = '#c96e4d';
    if (feedback) feedback.textContent = button.dataset.homeAnswer === 'right'
      ? 'Correct. Excess nutrients, warmth and sunlight can encourage algae to multiply. Some blooms can affect water quality and aquatic life.'
      : 'Not quite. Algal growth can be encouraged by excess nutrients, sunlight and suitable temperatures. Some blooms can affect water quality and aquatic life.';
  });
});


// News homepage: responsive nav, horizontal story sliders and daily quiz.
document.querySelector('.mobile-menu')?.addEventListener('click', event => {
  const nav = document.querySelector('.paper-nav');
  const open = nav?.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(Boolean(open)));
});
document.querySelectorAll('[data-target]').forEach(button => {
  button.addEventListener('click', () => {
    const slider = document.getElementById(button.dataset.target);
    if (!slider) return;
    slider.scrollBy({left:(button.classList.contains('paper-slider-prev') ? -1 : 1) * slider.clientWidth * .78,behavior:'smooth'});
  });
});
document.querySelectorAll('[data-answer]').forEach(button => {
  button.addEventListener('click', () => {
    const widget = button.closest('.quiz-widget');
    if (!widget) return;
    widget.querySelectorAll('[data-answer]').forEach(option => {
      option.disabled = true;
      if (option.dataset.answer === 'right') {
        option.style.borderColor = '#4f7558';
        option.style.background = '#e1eadf';
      }
    });
    if (button.dataset.answer !== 'right') {
      button.style.borderColor = '#c96e4d';
      button.style.background = '#f4e3dc';
    }
    const feedback = widget.querySelector('.quiz-feedback');
    if (feedback) feedback.textContent = button.dataset.answer === 'right'
      ? 'Correct. Excess nutrients, sunlight and suitable temperatures can trigger rapid algal growth. Some blooms can harm water quality and aquatic life.'
      : 'Not quite. Algae can multiply rapidly when water contains excess nutrients and conditions are favourable. Some blooms can harm water quality and aquatic life.';
  });
});
const dateNode = document.getElementById('today-date');
if (dateNode) {
  const now = new Date();
  dateNode.textContent = new Intl.DateTimeFormat('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(now).toUpperCase();
}
document.querySelectorAll('#year').forEach(node => node.textContent = new Date().getFullYear());


/* Topic-follow controls personalise the current reading view locally; no account or tracking required. */
document.querySelectorAll('[data-follow-topic]').forEach(button => {
  button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(active));
    button.textContent = (active ? '✓ ' : '+ ') + button.dataset.followTopic;
    const chosen = [...document.querySelectorAll('[data-follow-topic][aria-pressed="true"]')].map(item => item.dataset.followTopic);
    const feedback = document.querySelector('.follow-feedback');
    if (feedback) feedback.textContent = chosen.length
      ? 'Following on this visit: ' + chosen.join(' · ') + '. Your selected topics are highlighted in this reading feed.'
      : 'Choose topics to build your local reading interests.';
    document.querySelectorAll('.explore-card').forEach(card => {
      card.classList.toggle('topic-followed', chosen.includes(card.dataset.interest));
    });
  });
});


// Attributed live source desk. Publisher excerpts remain clearly labelled as third-party material.
async function loadVridhiLiveSignals() {
  const lists = [
    document.getElementById('live-signals-list'),
    document.getElementById('home-live-signals-list')
  ].filter(Boolean);
  if (!lists.length) return;
  const updated = document.getElementById('live-signals-updated');
  try {
    const response = await fetch('/journal/briefs/live-signals.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Feed unavailable');
    const feed = await response.json();
    const items = Array.isArray(feed.items) ? feed.items : [];
    if (updated) {
      const date = feed.updated ? new Date(feed.updated) : null;
      updated.textContent = date && !Number.isNaN(date.getTime())
        ? 'SOURCE FEED LAST REFRESHED · ' + new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(date) + ' IST'
        : 'SOURCE FEED · AWAITING FIRST AUTOMATED REFRESH';
    }
    lists.forEach(list => {
      list.replaceChildren();
      const limit = list.id === 'home-live-signals-list' ? 4 : 12;
      const shown = items.slice(0, limit);
      if (!shown.length) {
        const empty = document.createElement('article');
        empty.className = 'info-card';
        empty.textContent = 'The source desk is waiting for its first successful feed refresh. Browse the researched Vridhi explainers in the Journal meanwhile.';
        list.appendChild(empty);
        return;
      }
      shown.forEach(item => {
        const card = document.createElement('article');
        card.className = 'info-card';
        const label = document.createElement('p');
        label.className = 'eyebrow';
        label.textContent = (item.source || 'Publisher') + (item.published ? ' · ' + new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeZone:'Asia/Kolkata'}).format(new Date(item.published)) : '');
        const heading = document.createElement('h3');
        const link = document.createElement('a');
        link.textContent = item.title || 'Open source story';
        try {
          const url = new URL(item.url);
          if (url.protocol !== 'https:') throw new Error('Unsafe URL');
          link.href = url.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        } catch (_) {
          link.href = '/journal/briefs/';
        }
        heading.appendChild(link);
        const summary = document.createElement('p');
        summary.textContent = item.summary || 'Open the publisher’s page for the full story and context.';
        const source = document.createElement('p');
        source.className = 'eyebrow';
        source.textContent = 'PUBLISHER SUMMARY · NOT INDEPENDENT VRIDHI REPORTING';
        card.append(label, heading, summary, source);
        list.appendChild(card);
      });
    });
  } catch (error) {
    if (updated) updated.textContent = 'SOURCE FEED TEMPORARILY UNAVAILABLE · PLEASE TRY AGAIN LATER';
    lists.forEach(list => {
      list.replaceChildren();
      const message = document.createElement('article');
      message.className = 'info-card';
      message.textContent = 'Live source updates are temporarily unavailable. Existing researched articles remain available in the Journal.';
      list.appendChild(message);
    });
  }
}
loadVridhiLiveSignals();


// Live Vridhi Now ticker: source-linked world, entertainment, celebrity, AI and business headlines.
async function loadVridhiBreakingTicker() {
  const track = document.getElementById('breaking-live-track');
  if (!track) return;
  try {
    const response = await fetch('/journal/briefs/live-signals.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Ticker feed unavailable');
    const data = await response.json();
    const items = (Array.isArray(data.items) ? data.items : []).slice(0, 18);
    if (!items.length) return;
    track.replaceChildren();
    const tickerItems = [...items, ...items];
    tickerItems.forEach((item, index) => {
      if (index) {
        const separator = document.createElement('b');
        separator.textContent = '◆';
        track.appendChild(separator);
      }
      const link = document.createElement('a');
      link.className = 'breaking-item';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const category = document.createElement('strong');
      category.textContent = item.category || 'LATEST';
      const headline = document.createElement('span');
      headline.textContent = item.title || 'Open latest story';
      link.append(category, headline);
      link.title = (item.source || 'Source') + (item.summary ? ' — ' + item.summary : '');
      track.appendChild(link);
    });
    track.setAttribute('aria-label', 'Latest source-linked headlines');
  } catch (error) {
    // Keep the editorial fallback ticker visible if the feed is unavailable.
  }
}
loadVridhiBreakingTicker();


/* VRIDHI_GA4_COMPREHENSIVE_TRACKING_V1 */
(function installVridhiAnalytics() {
  const measurementId = 'G-KP51276K9G';

  // Some older pages already load gtag in their HTML; initialise it only where absent.
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: true });
  }
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }

  const send = (name, params) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      page_path: window.location.pathname
    }, params || {}));
  };

  // Scroll depth: one event per threshold per page view.
  const depthsSent = new Set();
  const thresholds = [25, 50, 75, 90];
  const measureScroll = () => {
    const root = document.documentElement;
    const total = Math.max(root.scrollHeight, document.body ? document.body.scrollHeight : 0) - window.innerHeight;
    if (total <= 0) return;
    const percent = Math.min(100, Math.round((window.scrollY / total) * 100));
    thresholds.forEach(depth => {
      if (percent >= depth && !depthsSent.has(depth)) {
        depthsSent.add(depth);
        send('content_scroll', { percent_scrolled: depth });
      }
    });
  };
  window.addEventListener('scroll', measureScroll, { passive: true });
  window.addEventListener('load', measureScroll);

  // Mark meaningful reading time without recording text or personal information.
  const path = window.location.pathname;
  const isEditorialPage = /^\/(journal|originals|discover|earth|explore)\//.test(path)
    && !/\/(index\.html)?$/.test(path);
  if (isEditorialPage) {
    [30, 60].forEach(seconds => {
      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          send('article_engagement', { engagement_seconds: seconds });
        }
      }, seconds * 1000);
    });
  }

  // Track search and filter use without transmitting the words a reader types.
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const searchInput = form.querySelector('input[type="search"], input[name="q"], input[name="query"], .filter-search');
    if (searchInput) {
      send('site_search', { search_method: searchInput.type === 'search' ? 'search_input' : 'site_filter' });
      return;
    }
    const formLabel = ((form.id || '') + ' ' + (form.className || '')).toLowerCase();
    if (/newsletter|subscribe|contact|lead/.test(formLabel)) {
      send('generate_lead', { form_id: String(form.id || 'unlabelled').slice(0, 60) });
    } else {
      send('form_submit', { form_id: String(form.id || 'unlabelled').slice(0, 60) });
    }
  }, true);

  document.addEventListener('change', event => {
    const target = event.target;
    if (target && (target.matches('.filter-category, .filter-search, [data-search-filter]'))) {
      send('content_filter_used', { filter_type: target.matches('.filter-category') ? 'category' : 'text' });
    }
  }, true);

  // Delegated click tracking covers dynamically generated cards and controls too.
  document.addEventListener('click', event => {
    const target = event.target && event.target.closest
      ? event.target.closest('a, button, [role="button"]')
      : null;
    if (!target || target.hasAttribute('data-no-analytics') || target.disabled) return;

    if (target.matches('.nav-search, [aria-label*="search" i], [data-search-open]')) {
      send('search_open');
    }
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      send('ui_interaction', {
        element_id: String(target.id || 'unlabelled').slice(0, 60),
        component_type: target.classList.contains('nav-search') ? 'search_control' : 'button'
      });
    }
    if (target.hasAttribute('data-follow-topic')) {
      send('topic_follow', { topic: String(target.dataset.followTopic || 'unknown').slice(0, 60) });
    }
    if (target.matches('[data-answer], [data-home-answer], .quiz-choice, .answer-option')) {
      send('quiz_answer', { quiz_type: target.closest('.interactive-quiz') ? 'interactive' : 'homepage' });
    }
    if (target.matches('[data-target], .slide-prev, .slide-next, .paper-slider-prev, .paper-slider-next')) {
      send('carousel_interaction');
    }

    if (target.tagName === 'A') {
      const href = target.getAttribute('href') || '';
      if (/^(mailto:|tel:)/i.test(href)) {
        send('contact_click', { contact_method: href.toLowerCase().startsWith('mailto:') ? 'email' : 'phone' });
        return;
      }
      let url;
      try { url = new URL(href, window.location.href); } catch (_) { return; }
      if (/\.(pdf|docx?|xlsx?|pptx?|csv|zip)$/i.test(url.pathname)) {
        send('file_download', { file_extension: url.pathname.split('.').pop().toLowerCase() });
      }
      if (url.hostname && url.hostname !== window.location.hostname) {
        send('outbound_click', { link_domain: url.hostname });
      } else if (url.pathname !== window.location.pathname || url.hash) {
        const area = target.closest('nav') ? 'navigation'
          : target.closest('footer') ? 'footer'
          : target.closest('main') ? 'content' : 'other';
        send('internal_link_click', { link_path: url.pathname, link_area: area });
      }
    }
  }, true);
})();


// Latest-headlines banner strip, populated from the same verified article index.
(function () {
  const strip = document.querySelector('#homepage-headline-strip .headline-strip-items');
  if (!strip) return;
  fetch('/articles.json',{cache:'no-cache'}).then(r=>r.json()).then(data=>{
    const items=(Array.isArray(data.articles)?data.articles:[]).slice(0,8);
    strip.replaceChildren();
    items.forEach(a=>{
      const link=document.createElement('a');
      const raw=String(a.url||'');
      link.href=raw.startsWith('/')?raw:'/'+raw.replace(/^\/+/, '');
      link.textContent=a.title;
      strip.appendChild(link);
    });
  }).catch(()=>{strip.textContent='Explore the latest stories across Vridhi';});
})();

// Dynamic multi-story front page. Editorial priority keeps the homepage broad, not locked to one topic.
(function () {
  const root = document.getElementById('front-page-grid');
  if (!root) return;
  const clean = value => String(value || '').trim();
  const safePath = value => {
    try { const u = new URL(value, location.origin); return u.origin === location.origin ? u.pathname.replace(/\/?$/, '/') : ''; }
    catch (_) { return ''; }
  };
  const safeImage = value => {
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; }
    catch (_) { return ''; }
  };
  const editorialOrder = [
    '/journal/vaibhav-sooryavanshi-204-record-innings/',
    '/discover/intimacy/the-last-table/',
    '/journal/india-groundwater-rajasthan-2025/',
    '/journal/dholavira-water-city/',
    '/originals/aravalli-definition-deadline-2026/',
    '/originals/history/thiruparankundram-history-timeline/'
  ];
  const artClass = section => section === 'Earth' ? 'earth-art' : section === 'Originals' ? 'originals-art' : 'discover-art';
  function card(article, kind) {
    const el = document.createElement('article');
    el.className = 'front-story front-' + kind;
    const link = document.createElement('a');
    link.className = 'front-story-visual ' + (article.image ? 'has-image' : artClass(article.section));
    link.href = article.path;
    if (article.image) {
      const img = document.createElement('img');
      img.src = article.image; img.alt = ''; img.loading = 'lazy';
      link.appendChild(img);
    } else {
      const mark = document.createElement('span');
      mark.className = 'front-visual-mark';
      mark.textContent = article.section === 'Earth' ? 'E' : article.section === 'Originals' ? 'V' : 'D';
      link.appendChild(mark);
    }
    const copy = document.createElement('div');
    copy.className = 'front-story-copy';
    const meta = document.createElement('div');
    meta.className = 'front-story-meta';
    meta.textContent = article.section + '  /  ' + article.topic;
    const title = document.createElement('a');
    title.className = 'front-story-title'; title.href = article.path; title.textContent = article.title;
    const desc = document.createElement('p'); desc.textContent = article.description;
    copy.append(meta,title,desc);
    el.append(link,copy);
    return el;
  }
  fetch('/articles.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('index unavailable');return r.json();}).then(data=>{
    const seen=new Set();
    const all=(Array.isArray(data.articles)?data.articles:[]).map((a,i)=>({
      ...a,path:safePath(a.url),image:safeImage(a.image),section:['Earth','Discover','Originals'].includes(a.section)?a.section:'Discover',
      topic:clean(a.topic)||'Research',title:clean(a.title),description:clean(a.description),_i:i
    })).filter(a=>a.path&&a.title&&!seen.has(a.path)&&seen.add(a.path));
    const byPath=new Map(all.map(a=>[a.path,a]));
    const featured=editorialOrder.map(p=>byPath.get(p)).filter(Boolean);
    const used=new Set(featured.map(a=>a.path));
    const recent=all.filter(a=>!used.has(a.path)).sort((a,b)=>(Date.parse(b.published||'')||0)-(Date.parse(a.published||'')||0)||a._i-b._i);
    const lead=featured[0]||recent.shift();
    const side=[...featured.slice(1),...recent].filter(a=>a&&a.path!==lead?.path).slice(0,4);
    if(!lead){root.textContent='New stories are on their way.';return;}
    root.replaceChildren();
    const leadCard=card(lead,'lead');
    const sideWrap=document.createElement('div');sideWrap.className='front-side-stories';
    side.forEach(a=>sideWrap.appendChild(card(a,'side')));
    const rail=document.createElement('aside');rail.className='front-latest-rail';
    const railHead=document.createElement('h2');railHead.textContent='MORE TO EXPLORE';
    rail.appendChild(railHead);
    [...featured.slice(0,0),...recent].slice(0,6).forEach(a=>{
      const item=document.createElement('a');item.href=a.path;item.className='front-rail-item';
      const label=document.createElement('small');label.textContent=a.section+' · '+a.topic;
      const title=document.createElement('span');title.textContent=a.title;
      item.append(label,title);rail.appendChild(item);
    });
    root.append(leadCard,sideWrap,rail);
  }).catch(()=>{root.textContent='Stories are temporarily unavailable.';});
})();

// Homepage feed: one central index, newest first, deduplicated, filterable by Vridhi division.
(function () {
  const grid = document.getElementById('live-article-grid');
  if (!grid) return;
  const frontPagePaths = new Set([
    '/journal/vaibhav-sooryavanshi-204-record-innings/',
    '/journal/india-groundwater-rajasthan-2025/',
    '/journal/dholavira-water-city/',
    '/originals/aravalli-definition-deadline-2026/',
    '/originals/history/thiruparankundram-history-timeline/'
  ]);
  const filters = [...document.querySelectorAll('[data-article-filter]')];
  const search = document.getElementById('article-feed-search');
  const topicsNode = document.getElementById('article-feed-topics');
  let allArticles = [];
  let activeDivision = 'all';
  let activeTopic = '';

  const cleanText = value => String(value || '').trim();
  const safeInternalPath = value => {
    try {
      const url = new URL(value, window.location.origin);
      if (url.origin !== window.location.origin || !url.pathname.startsWith('/')) return null;
      return url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
    } catch (_) { return null; }
  };
  const safeImageUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : '';
    } catch (_) { return ''; }
  };
  const formatDate = value => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-IN', {day:'numeric', month:'short', year:'numeric', timeZone:'Asia/Kolkata'}).format(date);
  };

  function renderTopics() {
    if (!topicsNode) return;
    const counts = new Map();
    allArticles.forEach(article => {
      const topic = cleanText(article.topic);
      if (topic) counts.set(topic, (counts.get(topic) || 0) + 1);
    });
    topicsNode.replaceChildren();
    if (!counts.size) return;
    const label = document.createElement('span');
    label.className = 'article-topics-label';
    label.textContent = 'EXPLORE TOPICS';
    topicsNode.appendChild(label);
    [...counts.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0])).slice(0,7).forEach(([topic]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'article-topic-chip';
      button.textContent = topic;
      button.setAttribute('aria-pressed', String(activeTopic === topic));
      button.addEventListener('click', () => {
        activeTopic = activeTopic === topic ? '' : topic;
        renderTopics();
        render();
      });
      topicsNode.appendChild(button);
    });
  }

  function render() {
    const query = cleanText(search?.value).toLowerCase();
    const matches = allArticles.filter(article => {
      const divisionMatch = activeDivision === 'all' || article.section === activeDivision;
      const topicMatch = !activeTopic || cleanText(article.topic) === activeTopic;
      const text = [article.title, article.description, article.topic, article.section].join(' ').toLowerCase();
      return divisionMatch && topicMatch && (!query || text.includes(query));
    });
    let visible = matches.slice(0, 9);
    if (activeDivision === 'all' && !activeTopic && !query) {
      const chosen = [], usedTopics = new Set(), sectionCounts = {Earth:0, Discover:0, Originals:0};
      const sectionLimits = {Earth:3, Discover:4, Originals:2};
      for (const article of matches) {
        if (chosen.length >= 9) break;
        if (!usedTopics.has(article.topic) && sectionCounts[article.section] < sectionLimits[article.section]) {
          chosen.push(article); usedTopics.add(article.topic); sectionCounts[article.section]++;
        }
      }
      for (const article of matches) {
        if (chosen.length >= 9) break;
        if (!chosen.includes(article) && sectionCounts[article.section] < sectionLimits[article.section]) {
          chosen.push(article); sectionCounts[article.section]++;
        }
      }
      visible = chosen;
    }

    grid.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('p');
      empty.className = 'article-feed-status';
      empty.textContent = 'No matching stories yet. Try another topic or division.';
      grid.appendChild(empty);
      return;
    }
    visible.forEach(article => {
      const card = document.createElement('article');
      card.className = 'live-article-card';
      const imageLink = document.createElement('a');
      imageLink.className = 'live-article-image';
      imageLink.href = article.path;
      if (article.image) {
        const image = document.createElement('img');
        image.loading = 'lazy';
        image.alt = article.title;
        image.src = article.image;
        imageLink.appendChild(image);
      }

      const copy = document.createElement('div');
      copy.className = 'live-article-copy';
      const meta = document.createElement('div');
      meta.className = 'live-article-meta';
      const section = document.createElement('span');
      section.textContent = article.section;
      const topic = document.createElement('span');
      topic.textContent = article.topic;
      meta.append(section, topic);
      if (article.published) {
        const date = document.createElement('time');
        date.dateTime = article.published;
        date.textContent = formatDate(article.published);
        meta.appendChild(date);
      }
      const heading = document.createElement('h3');
      const title = document.createElement('a');
      title.href = article.path;
      title.textContent = article.title;
      heading.appendChild(title);
      const description = document.createElement('p');
      description.textContent = article.description;
      const read = document.createElement('a');
      read.className = 'live-article-read';
      read.href = article.path;
      read.textContent = 'READ STORY ↗';
      copy.append(meta, heading, description, read);
      card.append(imageLink, copy);
      grid.appendChild(card);
    });
  }

  filters.forEach(button => button.addEventListener('click', () => {
    activeDivision = button.dataset.articleFilter || 'all';
    activeTopic = '';
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderTopics();
    render();
  }));
  search?.addEventListener('input', render);

  fetch('/articles.json', {cache:'no-cache'})
    .then(response => { if (!response.ok) throw new Error('Article index unavailable'); return response.json(); })
    .then(data => {
      const source = Array.isArray(data.articles) ? data.articles : [];
      const seenPaths = new Set();
      const seenTitles = new Set();
      allArticles = source.map((article, index) => {
        const path = safeInternalPath(article.url);
        const title = cleanText(article.title);
        if (!path || !title || frontPagePaths.has(path)) return null;
        const titleKey = title.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
        if (seenPaths.has(path) || seenTitles.has(titleKey)) return null;
        seenPaths.add(path);
        seenTitles.add(titleKey);
        return {
          ...article,
          title,
          path,
          section: ['Earth','Discover','Originals'].includes(article.section) ? article.section : 'Discover',
          topic: cleanText(article.topic) || 'Research',
          description: cleanText(article.description),
          image: safeImageUrl(article.image),
          _order: index
        };
      }).filter(Boolean).sort((a,b) => {
        const da = Date.parse(a.published || '') || 0;
        const db = Date.parse(b.published || '') || 0;
        return db - da || a._order - b._order;
      });
      renderTopics();
      render();
    })
    .catch(() => {
      grid.textContent = 'Stories are temporarily unavailable. Please try again shortly.';
    });
})();
