/* =========================================================
   پنل مدیریت سایت امیرعلی گل‌چینی
   ---------------------------------------------------------
   - ورود با کلید شخصی گیت‌هاب (Fine-grained token)
   - خواندن و نوشتن فایل‌های _data/*.json در همین مخزن
   - فشرده‌سازی عکس‌ها در مرورگر قبل از آپلود
   - همه تغییرات در «یک» کامیت منتشر می‌شوند
   هیچ رمز یا کلیدی داخل این فایل نیست.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------- تنظیمات ---------------- */
  const CONFIG = {
    owner: 'amirgol-ir',
    repo: 'amirgol-ir.github.io',
    siteRoot: '../',          // مسیر ریشه سایت نسبت به /admin/
    files: {
      profile: '_data/profile.json',
      mission: '_data/mission.json',
      skills: '_data/skills.json',
      experience: '_data/experience.json',
      portfolio: '_data/portfolio.json'
    }
  };
  const API = 'https://api.github.com';
  const TOKEN_KEY = 'aag_admin_token';

  /* آیکون‌های ثابت سایت (از روی خود سایت کپی شده‌اند) */
  const SKILL_SVGS = {"dv": "<svg width=\"30\" height=\"30\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"7\" r=\"3.5\" fill=\"#ef4444\" /><circle cx=\"7\" cy=\"15\" r=\"3.5\" fill=\"#3b82f6\" /><circle cx=\"17\" cy=\"15\" r=\"3.5\" fill=\"#10b981\" /></svg>", "aip": "<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#ffffff\"><path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5zM12 2l1.2 2.8L16 6l-2.8 1.2L12 10l-1.2-2.8L8 6l2.8-1.2L12 2z\"/></svg>", "aiv": "<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#ffffff\"><path d=\"M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 13l1.25-2.25L13.5 12l-2.25 3.25zM17 15.5l-3.5-2 3.5-2v4z\"/></svg>", "aim": "<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#ffffff\"><path d=\"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm4 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z\"/></svg>", "cam": "<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#ffffff\"><path d=\"M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z\"/></svg>", "km": "<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"#ffffff\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v3.25L13.75 8H16l-3.5 4.5L16 16h-2.25L11 12.75V16z\"/></svg>"};
  const CAT_SVGS = {"ai": "<svg fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\"/></svg>", "editing": "<svg fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M7 4v16M17 4v16M3 8h18M3 16h18M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z\"/></svg>", "motion": "<svg fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\"/></svg>", "graphic": "<svg fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01\"/></svg>"};
  const INFO_SVGS = {"phone": "<svg viewBox=\"0 0 24 24\"><path d=\"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z\"/></svg>", "email": "<svg viewBox=\"0 0 24 24\"><path d=\"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z\"/></svg>", "instagram": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z\"/></svg>", "city": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\"/></svg>", "marital": "<svg viewBox=\"0 0 24 24\"> <path d=\"M7.5 4a5.5 5.5 0 0 0-5.5 5.5c0 2.58 1.78 4.75 4.18 5.34a6.5 6.5 0 0 0 2.32-.84 5.5 5.5 0 1 0 7.22-7.22 6.5 6.5 0 0 0-.84 2.32A5.5 5.5 0 0 0 7.5 4zm0 2c1.93 0 3.5 1.57 3.5 3.5a3.5 3.5 0 0 1-.45 1.72 5.5 5.5 0 0 0-1.27-1.27A3.5 3.5 0 0 1 7.5 6zm9 3c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5a3.5 3.5 0 0 1-1.72-.45 5.5 5.5 0 0 0 1.27-1.27A3.5 3.5 0 0 1 16.5 9z\"/> </svg>", "military": "<svg viewBox=\"0 0 24 24\"> <path d=\"M12 2C6.48 2 2 6.48 2 12c0 2.38.83 4.57 2.21 6.3L3.5 21h17l-.71-2.7C21.17 16.57 22 14.38 22 12c0-5.52-4.48-10-10-10zm0 2.2c4.3 0 7.8 3.5 7.8 7.8 0 .8-.13 1.57-.37 2.29l-3.92-1.31a7.6 7.6 0 0 0-7.02 0l-3.92 1.31c-.24-.72-.37-1.49-.37-2.29 0-4.3 3.5-7.8 7.8-7.8z\"/> </svg>"};

  const SKILL_STYLES = {
    pr: { name: 'Premiere (بنفش)', g: ['#685aff', '#4c3cf3'], label: 'Pr' },
    ae: { name: 'After Effects (ارغوانی)', g: ['#9d4edd', '#7b2cbf'], label: 'Ae' },
    ps: { name: 'Photoshop (آبی)', g: ['#00a2ff', '#006ec7'], label: 'Ps' },
    ai: { name: 'Illustrator (نارنجی)', g: ['#ff9400', '#e66c00'], label: 'Ai' },
    dv: { name: 'DaVinci (سه دایره)', g: ['#333d4e', '#1c222b'] },
    aip: { name: 'تصویر هوش مصنوعی', g: ['#10b981', '#047857'] },
    aiv: { name: 'ویدیو هوش مصنوعی', g: ['#d946ef', '#a21caf'] },
    aim: { name: 'موسیقی هوش مصنوعی', g: ['#6366f1', '#4338ca'] },
    cam: { name: 'دوربین', g: ['#b91c47', '#881337'] },
    km: { name: 'KineMaster', g: ['#ff3366', '#d90429'] },
    text: { name: 'حروف دلخواه' }
  };
  const CAT_ICON_NAMES = { ai: 'مانیتور', editing: 'فیلم', motion: 'شکلک', graphic: 'قلم‌مو' };

  /* پیش‌تنظیم فشرده‌سازی عکس برای هر جای سایت */
  const PRESETS = {
    profile: { maxW: 600, folder: 'profile', alpha: true, q: 0.85 },
    photo: { maxW: 760, folder: 'mission', q: 0.82 },
    logo: { maxW: 160, folder: 'logos', alpha: true, q: 0.88 },
    cover: { maxW: 720, folder: 'covers', q: 0.8 },
    graphicCover: { maxW: 720, folder: 'covers', alpha: true, q: 0.85 },
    gallery: { maxSide: 1800, folder: 'gallery', q: 0.8 }
  };

  /* ---------------- وضعیت ---------------- */
  let token = null;
  let user = null;
  let branch = 'main';
  let loadedHead = null;
  const data = {};
  const orig = {};
  const shas = {};
  const uploads = new Map();    // مسیر ← عکس آماده آپلود
  const published = new Map();  // مسیر ← پیش‌نمایش محلی (تا وقتی روی سایت بیاید)
  let current = 'profile';
  let portfolioCat = 0;

  const $ = (id) => document.getElementById(id);

  /* ---------------- ابزارهای کوچک ---------------- */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style') el.style.cssText = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'value') el.value = v;
        else if (k === 'checked') el.checked = !!v;
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  // فقط برای SVGهای ثابت داخل همین فایل (هیچ‌وقت برای داده کاربر)
  function svg(markup) {
    const t = document.createElement('template');
    t.innerHTML = String(markup || '').trim();
    return t.content.firstElementChild || document.createTextNode('');
  }

  const I = {
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.8-1.8 2-2.7 3.5-2.7s2.7.9 3.5 2.7M15 10h3M15 14h3"/></svg>',
    mission: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M4 10h10M4 15h16M4 20h7"/></svg>',
    skills: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M4 12h16M4 18h7"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="18" r="2"/></svg>',
    experience: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
    portfolio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 9h20M2 15h20M6 5v4M6 15v4M18 5v4M18 15v4M10 11l4 1-4 1z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
  };

  const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const fa = (v) => String(v).replace(/\d/g, (d) => FA[d]);
  const toLatin = (v) => String(v).replace(/[۰-۹]/g, (d) => FA.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function toast(msg, type = 'ok', ms = 4200) {
    const t = h('div', { class: 'toast ' + type, role: 'status' }, msg);
    $('toasts').append(t);
    setTimeout(() => t.remove(), ms);
  }

  function imgSrc(path) {
    if (!path) return '';
    if (uploads.has(path)) return uploads.get(path).url;
    if (published.has(path)) return published.get(path);
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
    return CONFIG.siteRoot + path.replace(/^\/+/, '');
  }

  function move(arr, i, d) {
    const j = i + d;
    if (j < 0 || j >= arr.length) return false;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return true;
  }

  /* ---------------- پنجره تأیید ---------------- */
  function confirmBox(title, text, okText = 'حذف شود', danger = true) {
    return new Promise((resolve) => {
      const back = h('div', { class: 'drawer-backdrop open', style: 'z-index:80' });
      const card = h('div', {
        role: 'alertdialog', 'aria-modal': 'true',
        style: 'position:fixed;z-index:81;inset:0;margin:auto;height:fit-content;width:min(400px,calc(100% - 32px));background:#fff;border-radius:20px;padding:24px;box-shadow:0 30px 80px rgba(28,3,10,.4);display:grid;gap:10px'
      },
        h('h3', { style: 'font-size:1.1rem;font-weight:800' }, title),
        h('p', { style: 'color:var(--mist);font-size:.92rem' }, text),
        h('div', { style: 'display:flex;gap:10px;justify-content:flex-start;margin-top:8px' },
          h('button', { class: 'btn ' + (danger ? 'btn-primary' : 'btn-primary'), type: 'button', onclick: () => done(true) }, okText),
          h('button', { class: 'btn', type: 'button', onclick: () => done(false) }, 'انصراف')
        )
      );
      function done(v) { back.remove(); card.remove(); document.removeEventListener('keydown', esc); resolve(v); }
      function esc(e) { if (e.key === 'Escape') done(false); }
      back.addEventListener('click', () => done(false));
      document.addEventListener('keydown', esc);
      document.body.append(back, card);
      card.querySelector('button').focus();
    });
  }

  /* ---------------- ارتباط با گیت‌هاب ---------------- */
  async function gh(path, opts = {}) {
    let res;
    try {
      res = await fetch(API + path, {
        method: opts.method || 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(opts.body ? { 'Content-Type': 'application/json' } : {})
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        cache: 'no-store'
      });
    } catch (e) {
      const err = new Error('اتصال به گیت‌هاب برقرار نشد. اینترنت یا فیلترشکن را بررسی کنید.');
      err.status = 0;
      throw err;
    }
    if (!res.ok) {
      let msg = '';
      try { msg = (await res.json()).message || ''; } catch (e) {}
      const err = new Error(msg || ('HTTP ' + res.status));
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }
  const repoPath = (p) => `/repos/${CONFIG.owner}/${CONFIG.repo}${p}`;

  function b64ToText(b64) {
    const bin = atob(b64.replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  // محاسبه شناسه گیت یک فایل (برای تشخیص اینکه فایل جای دیگری عوض شده یا نه)
  async function gitBlobSha(text) {
    const body = new TextEncoder().encode(text);
    const head = new TextEncoder().encode('blob ' + body.length + '\0');
    const all = new Uint8Array(head.length + body.length);
    all.set(head); all.set(body, head.length);
    const dig = await crypto.subtle.digest('SHA-1', all);
    return [...new Uint8Array(dig)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const serialize = (key) => JSON.stringify(data[key], null, 2) + '\n';

  async function loadAll() {
    const repo = await gh(repoPath(''));
    branch = repo.default_branch || 'main';
    const ref = await gh(repoPath(`/git/ref/heads/${encodeURIComponent(branch)}`));
    loadedHead = ref.object.sha;
    for (const [key, path] of Object.entries(CONFIG.files)) {
      let file;
      try {
        file = await gh(repoPath(`/contents/${path}?ref=${loadedHead}`));
      } catch (e) {
        if (e.status === 404) {
          const err = new Error('فایل‌های محتوای سایت در مخزن پیدا نشد. اول نسخه جدید سایت (همراه با پوشه _data) را در گیت‌هاب آپلود کنید.');
          err.status = 404;
          throw err;
        }
        throw e;
      }
      const text = b64ToText(file.content);
      data[key] = JSON.parse(text);
      orig[key] = JSON.stringify(data[key]);
      shas[key] = file.sha;
    }
  }

  /* ---------------- تغییرات ---------------- */
  function changedKeys() {
    return Object.keys(CONFIG.files).filter((k) => JSON.stringify(data[k]) !== orig[k]);
  }
  function referencedUploads() {
    const all = Object.keys(CONFIG.files).map((k) => JSON.stringify(data[k])).join('\n');
    return [...uploads.keys()].filter((p) => all.includes(JSON.stringify(p)));
  }
  let dirtyRaf = 0;
  function markDirty() {
    if (dirtyRaf) return;
    dirtyRaf = requestAnimationFrame(() => {
      dirtyRaf = 0;
      const keys = changedKeys();
      const bar = $('publishBar');
      bar.classList.toggle('show', keys.length > 0);
      $('publishMsg').replaceChildren(
        keys.length ? h('span', null, h('b', null, fa(keys.length)), ' بخش تغییر کرده و هنوز منتشر نشده') : ''
      );
      document.querySelectorAll('.nav-btn').forEach((b) => {
        const dot = b.querySelector('.nav-dot');
        if (dot) dot.hidden = !keys.includes(b.dataset.view);
      });
    });
  }
  window.addEventListener('beforeunload', (e) => {
    if (token && changedKeys().length) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------------- فرم‌ها ---------------- */
  function field(label, obj, key, opts = {}) {
    const id = 'f' + Math.random().toString(36).slice(2, 9);
    const tag = opts.multiline ? 'textarea' : 'input';
    const el = h(tag, {
      id, class: (opts.multiline ? 'textarea' : 'input') + (opts.ltr ? ' ltr' : ''),
      type: tag === 'input' ? (opts.type || 'text') : null,
      placeholder: opts.placeholder || null,
      dir: opts.ltr ? 'ltr' : (opts.auto ? 'auto' : null),
      rows: opts.rows || null
    });
    el.value = opts.get ? opts.get(obj[key]) : (obj[key] ?? '');
    el.addEventListener('input', () => {
      obj[key] = opts.set ? opts.set(el.value) : el.value;
      if (opts.oninput) opts.oninput(el.value, el);
      markDirty();
    });
    if (opts.onchange) el.addEventListener('change', () => opts.onchange(el.value, el));
    return h('div', { class: 'field' },
      label ? h('label', { class: 'field-label', for: id }, label) : null,
      opts.tools || null,
      el,
      opts.hint ? h('div', { class: 'field-hint' }, opts.hint) : null
    );
  }

  // متن‌های رسالت: در فرم، **متن** = قرمز پررنگ؛ در سایت به HTML امن تبدیل می‌شود
  const HL_OPEN = '<span class="highlight-light-red">';
  function htmlToEditable(html) {
    const marked = String(html || '')
      .replace(/<span class="highlight-light-red">([\s\S]*?)<\/span>/g, '**$1**')
      .replace(/<br\s*\/?>/g, '\n');
    const doc = new DOMParser().parseFromString('<div>' + marked + '</div>', 'text/html');
    return doc.body.textContent;
  }
  function editableToHtml(text) {
    const esc = String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/\*\*([\s\S]+?)\*\*/g, HL_OPEN + '$1</span>')
      .replace(/\r?\n/g, '<br>');
  }
  function richField(label, obj, key, hint) {
    const wrap = field(label, obj, key, {
      multiline: true, rows: 7, get: htmlToEditable, set: editableToHtml,
      hint: hint || 'برای قرمز و پررنگ شدن بخشی از متن، آن را انتخاب کنید و دکمه «قرمز پررنگ» را بزنید (یا دور متن ** بگذارید).'
    });
    const ta = wrap.querySelector('textarea');
    const btn = h('button', {
      class: 'mark-btn', type: 'button', onclick: () => {
        const s = ta.selectionStart, e = ta.selectionEnd;
        if (s === e) { toast('اول بخشی از متن را انتخاب کنید.', 'info'); return; }
        ta.setRangeText('**' + ta.value.slice(s, e) + '**', s, e, 'end');
        ta.dispatchEvent(new Event('input'));
        ta.focus();
      }
    }, 'قرمز پررنگ');
    wrap.insertBefore(h('div', { class: 'text-tools' }, btn), ta);
    return wrap;
  }

  /* ---------------- فشرده‌سازی و آپلود عکس ---------------- */
  async function loadBitmap(file) {
    if (window.createImageBitmap && !/svg/.test(file.type)) {
      try { return await createImageBitmap(file); } catch (e) {}
    }
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error('این فایل عکس قابل خواندن نیست.'));
      img.src = URL.createObjectURL(file);
    });
  }
  function canvasBlob(canvas, type, q) {
    return new Promise((res) => canvas.toBlob(res, type, q));
  }
  async function processImage(file, presetName) {
    const p = PRESETS[presetName];
    if (!/^image\//.test(file.type)) throw new Error('فقط فایل عکس قابل انتخاب است.');
    if (file.size > 30 * 1024 * 1024) throw new Error('حجم عکس بیشتر از ۳۰ مگابایت است.');
    const bmp = await loadBitmap(file);
    const w0 = bmp.width || bmp.naturalWidth, h0 = bmp.height || bmp.naturalHeight;
    let s = 1;
    if (p.maxW && w0 > p.maxW) s = p.maxW / w0;
    if (p.maxSide && Math.max(w0, h0) > p.maxSide) s = Math.min(s, p.maxSide / Math.max(w0, h0));
    const w = Math.max(1, Math.round(w0 * s)), hh = Math.max(1, Math.round(h0 * s));
    const c = document.createElement('canvas');
    c.width = w; c.height = hh;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    if (!p.alpha) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, hh); }
    ctx.drawImage(bmp, 0, 0, w, hh);
    let blob = await canvasBlob(c, 'image/webp', p.q);
    let ext = 'webp';
    if (!blob || blob.type !== 'image/webp') {
      // مرورگرهایی که WebP نمی‌سازند (مثل سافاری قدیمی)
      if (p.alpha) { blob = await canvasBlob(c, 'image/png'); ext = 'png'; }
      else { blob = await canvasBlob(c, 'image/jpeg', 0.85); ext = 'jpg'; }
    }
    const b64 = await new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result).split(',')[1]);
      fr.readAsDataURL(blob);
    });
    const d = new Date();
    const stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    const path = `uploads/${p.folder}/${stamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    uploads.set(path, { b64, url: URL.createObjectURL(blob), size: blob.size });
    return path;
  }

  function uploader(obj, key, preset, opts = {}) {
    const input = h('input', { type: 'file', accept: 'image/*' });
    const box = h('div', {
      class: 'uploader' + (opts.cover ? ' cover' : '') + (opts.dark ? ' dark' : ''), role: 'button', tabindex: '0',
      'aria-label': opts.label || 'انتخاب عکس', style: opts.style || null
    });
    function paint() {
      box.replaceChildren(input);
      if (obj[key]) {
        box.append(h('img', { src: imgSrc(obj[key]), alt: '' }));
        box.append(h('span', { class: 'uploader-cta' }, svg(I.upload), 'تعویض عکس'));
      } else {
        box.append(h('div', { class: 'uploader-empty' }, svg(I.image), 'برای انتخاب عکس کلیک کنید یا عکس را اینجا بکشید'));
      }
    }
    async function take(file) {
      if (!file) return;
      const busy = h('div', { class: 'busy' }, h('div', { class: 'spinner' }));
      box.append(busy);
      try {
        obj[key] = await processImage(file, preset);
        markDirty();
        if (opts.onchange) opts.onchange();
        const kb = Math.round(uploads.get(obj[key]).size / 1024);
        toast(`عکس آماده شد (${fa(kb)} کیلوبایت). بعد از «انتشار در سایت» روی سایت می‌آید.`);
      } catch (e) {
        toast(e.message, 'err');
      }
      paint();
    }
    box.addEventListener('click', () => input.click());
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('change', () => { take(input.files[0]); input.value = ''; });
    box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('drag'); });
    box.addEventListener('dragleave', () => box.classList.remove('drag'));
    box.addEventListener('drop', (e) => { e.preventDefault(); box.classList.remove('drag'); take(e.dataTransfer.files[0]); });
    paint();
    return box;
  }

  function rowTools(arr, i, rerender, opts = {}) {
    return h('div', { class: 'row-tools' },
      h('button', { class: 'icon-btn', type: 'button', title: opts.upTitle || 'بالاتر', 'aria-label': 'بالاتر', disabled: i === 0, onclick: (e) => { e.stopPropagation(); if (move(arr, i, -1)) { markDirty(); rerender(); } } }, svg(opts.horizontal ? I.right : I.up)),
      h('button', { class: 'icon-btn', type: 'button', title: opts.downTitle || 'پایین‌تر', 'aria-label': 'پایین‌تر', disabled: i === arr.length - 1, onclick: (e) => { e.stopPropagation(); if (move(arr, i, 1)) { markDirty(); rerender(); } } }, svg(opts.horizontal ? I.left : I.down)),
      opts.extra || null,
      h('button', {
        class: 'icon-btn danger', type: 'button', title: 'حذف', 'aria-label': 'حذف', onclick: async (e) => {
          e.stopPropagation();
          if (opts.confirm === false || await confirmBox(opts.confirmTitle || 'حذف شود؟', opts.confirmText || 'این مورد از سایت حذف می‌شود. تا وقتی «انتشار در سایت» را نزنید، می‌توانید با «لغو تغییرات» برش گردانید.')) {
            arr.splice(i, 1); markDirty(); rerender();
          }
        }
      }, svg(I.trash))
    );
  }

  /* ---------------- کشوی ویرایش ---------------- */
  let drawerEls = null;
  function openDrawer(title, build, foot) {
    closeDrawer(true);
    const back = h('div', { class: 'drawer-backdrop' });
    const body = h('div', { class: 'drawer-body' });
    const dr = h('aside', { class: 'drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('div', { class: 'drawer-head' },
        h('h3', null, title),
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'بستن', onclick: () => closeDrawer() }, svg(I.close))
      ),
      body,
      h('div', { class: 'drawer-foot' }, foot || null, h('div', { class: 'spacer' }), h('button', { class: 'btn btn-primary', type: 'button', onclick: () => closeDrawer() }, 'تمام'))
    );
    back.addEventListener('click', () => closeDrawer());
    document.body.append(back, dr);
    drawerEls = { back, dr, body, build };
    build(body);
    requestAnimationFrame(() => { back.classList.add('open'); dr.classList.add('open'); });
    const first = body.querySelector('input,textarea');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 250);
  }
  function rebuildDrawer() {
    if (!drawerEls) return;
    const st = drawerEls.body.scrollTop;
    drawerEls.body.replaceChildren();
    drawerEls.build(drawerEls.body);
    drawerEls.body.scrollTop = st;
  }
  function closeDrawer(instant) {
    if (!drawerEls) return;
    const { back, dr } = drawerEls;
    drawerEls = null;
    if (instant) { back.remove(); dr.remove(); return; }
    back.classList.remove('open'); dr.classList.remove('open');
    setTimeout(() => { back.remove(); dr.remove(); }, 280);
    render();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawerEls && !document.querySelector('[role="alertdialog"]')) closeDrawer(); });

  /* =========================================================
     بخش‌های پنل
     ========================================================= */
  const VIEWS = {
    profile: { title: 'کارت معرفی', desc: 'عکس، نام و اطلاعات بالای صفحه اصلی', render: viewProfile },
    mission: { title: 'رسالت من', desc: 'متن‌ها و عکس‌های بخش رسالت', render: viewMission },
    skills: { title: 'مهارت‌ها', desc: 'نام مهارت‌ها و درصد تسلط', render: viewSkills },
    experience: { title: 'تجربه کاری', desc: 'کارت‌های سوابق کاری؛ کارت اول جدیدترین سابقه است', render: viewExperience },
    portfolio: { title: 'نمونه‌کارها', desc: 'دسته‌بندی‌ها، ویدیوها و گالری‌های تصویر', render: viewPortfolio }
  };

  function buildNav() {
    $('nav').replaceChildren(...Object.entries(VIEWS).map(([k, v]) =>
      h('button', { class: 'nav-btn', type: 'button', 'data-view': k, 'aria-current': k === current ? 'page' : null, onclick: () => go(k) },
        svg(I[k]), v.title, h('span', { class: 'nav-dot', hidden: true, title: 'تغییر منتشرنشده' }))
    ));
  }
  function go(k) {
    current = k;
    try { sessionStorage.setItem('aag_view', k); } catch (e) {}
    document.querySelectorAll('.nav-btn').forEach((b) => { if (b.dataset.view === k) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    render();
    window.scrollTo({ top: 0 });
  }
  function render() {
    const v = VIEWS[current];
    $('viewTitle').textContent = v.title;
    $('viewDesc').textContent = v.desc;
    const view = $('view');
    view.replaceChildren(...[].concat(v.render()));
    markDirty();
  }

  function panel(title, desc, ...kids) {
    return h('section', { class: 'panel' },
      (title || desc) ? h('div', { class: 'panel-head' }, h('div', null, title ? h('h3', null, title) : null, desc ? h('p', null, desc) : null)) : null,
      ...kids);
  }

  /* ---------- ۱. کارت معرفی ---------- */
  function viewProfile() {
    const p = data.profile;
    const infoDefs = [
      ['phone', 'شماره تماس', { ltr: true, placeholder: '۰۹۱۲…' }],
      ['email', 'ایمیل', { ltr: true, placeholder: 'name@example.com' }],
      ['instagram', 'آیدی اینستاگرام', {
        ltr: true, placeholder: 'amiraligolchini',
        set: (v) => v.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@/, '')
      }],
      ['city', 'شهر محل سکونت', {}],
      ['marital', 'وضعیت تأهل', {}],
      ['military', 'وضعیت نظام وظیفه', {}]
    ];
    return [
      panel('عکس و نام', 'عکس با پس‌زمینه شفاف (PNG) بهترین نتیجه را دارد. عکس خودکار کوچک و فشرده می‌شود.',
        h('div', { class: 'profile-grid' },
          uploader(p, 'photo', 'profile', { label: 'عکس پروفایل' }),
          h('div', { class: 'stack' },
            field('نام', p, 'name'),
            field('عنوان زیر نام', p, 'headline', { hint: 'مثلاً: تدوین‌گر | فعال در حوزه هوش مصنوعی' }),
            field('توضیح عکس برای گوگل', p, 'photo_alt', { hint: 'گوگل و نرم‌افزارهای نابینایان از این متن استفاده می‌کنند.' })
          )
        )
      ),
      panel('اطلاعات زیر نام', 'هر ردیفی را خالی بگذارید، در سایت نمایش داده نمی‌شود.',
        h('div', { class: 'info-fields' }, infoDefs.map(([k, label, o]) => {
          const f = field(label, p, k, o);
          const lab = f.querySelector('label');
          return h('div', { class: 'info-field' }, h('div', { class: 'info-ic', 'aria-hidden': 'true' }, svg(INFO_SVGS[k])), lab, f.querySelector('input'));
        }))
      )
    ];
  }

  /* ---------- ۲. رسالت من ---------- */
  function viewMission() {
    const m = data.mission;
    const rer = () => render();
    const cul = m.cultural, com = m.commercial;
    const modeBtn = (val, txt) => h('button', { type: 'button', 'aria-pressed': String((m.active_mode || 'cultural') === val), onclick: () => { m.active_mode = val; markDirty(); rer(); } }, txt);
    const blocks = (cul.blocks || (cul.blocks = [])).map((b, i) =>
      h('div', { class: 'block-row' },
        h('div', { class: 'stack' },
          h('div', { style: 'display:flex;align-items:center;gap:8px' },
            h('b', { style: 'flex:1' }, 'بند ' + fa(i + 1), i % 2 ? h('span', { class: 'field-hint' }, ' — عکس سمت راست') : h('span', { class: 'field-hint' }, ' — عکس سمت چپ')),
            rowTools(cul.blocks, i, rer, { confirmTitle: 'این بند حذف شود؟' })
          ),
          richField('متن', b, 'text'),
          field('توضیح عکس', b, 'photo_alt')
        ),
        uploader(b, 'photo', 'photo', { cover: true })
      ));
    return [
      panel('نسخه نمایش داده‌شده', 'سایت دو نسخه متن دارد؛ هر کدام را انتخاب کنید همان روی سایت نمایش داده می‌شود.',
        h('div', { class: 'seg', role: 'group' }, modeBtn('cultural', 'فرهنگی و سازمانی'), modeBtn('commercial', 'تجاری و بازار کار'))
      ),
      panel('نسخه فرهنگی و سازمانی', (m.active_mode || 'cultural') === 'cultural' ? 'این نسخه الان روی سایت است.' : 'این نسخه الان مخفی است.',
        h('div', { class: 'grid-2' }, field('تیتر', cul, 'title'), field('زیرتیتر', cul, 'subtitle')),
        h('div', { class: 'stack', style: 'margin-top:16px' }, blocks,
          h('button', { class: 'btn', type: 'button', style: 'justify-self:start', onclick: () => { cul.blocks.push({ text: '', photo: '', photo_alt: '' }); markDirty(); rer(); } }, svg(I.plus), 'افزودن بند متن و عکس'))
      ),
      panel('نسخه تجاری و بازار کار', m.active_mode === 'commercial' ? 'این نسخه الان روی سایت است.' : 'این نسخه الان مخفی است.',
        h('div', { class: 'grid-2' }, field('تیتر', com, 'title'), field('زیرتیتر', com, 'subtitle')),
        h('div', { class: 'block-row', style: 'margin-top:16px' },
          h('div', { class: 'stack' }, richField('پاراگراف اول', com, 'p1'), richField('پاراگراف دوم', com, 'p2'), field('توضیح عکس', com, 'photo_alt')),
          uploader(com, 'photo', 'photo', { cover: true })
        )
      )
    ];
  }

  /* ---------- ۳. مهارت‌ها ---------- */
  function skillIcon(sk) {
    const st = SKILL_STYLES[sk.icon === 'text' ? (sk.color || 'pr') : sk.icon] || SKILL_STYLES.pr;
    const el = h('div', { class: 'skill-ic', style: `background:linear-gradient(145deg,${st.g[0]},${st.g[1]})`, 'aria-hidden': 'true' });
    if (SKILL_SVGS[sk.icon]) el.append(svg(SKILL_SVGS[sk.icon]));
    else el.append(sk.label || '?');
    return el;
  }
  function viewSkills() {
    const s = data.skills;
    while (s.columns.length < 2) s.columns.push([]);
    const rer = () => render();
    const openExtra = new Set(viewSkills._open || []);
    const col = (ci, name) => h('div', { class: 'skill-col' },
      h('h4', null, name),
      h('div', { class: 'skill-list' }, s.columns[ci].map((sk, i) => {
        const key = ci + ':' + i;
        const pctNum = h('input', { class: 'pct-num', type: 'text', inputmode: 'numeric', value: fa(sk.percent), 'aria-label': 'درصد' });
        const range = h('input', { type: 'range', min: '0', max: '100', step: '1', value: sk.percent, 'aria-label': 'درصد ' + sk.name });
        const setPct = (v, from) => {
          let n = parseInt(toLatin(v), 10);
          if (isNaN(n)) return;
          n = Math.max(0, Math.min(100, n));
          sk.percent = n;
          if (from !== 'range') range.value = n;
          if (from !== 'num') pctNum.value = fa(n);
          markDirty();
        };
        range.addEventListener('input', () => setPct(range.value, 'range'));
        pctNum.addEventListener('input', () => setPct(pctNum.value, 'num'));
        pctNum.addEventListener('blur', () => { pctNum.value = fa(sk.percent); });
        const extraOpen = openExtra.has(key);
        let itemRef = null;
        const item = itemRef = h('div', { class: 'skill-item' },
          skillIcon(sk),
          h('div', { class: 'skill-body' },
            (() => { const n = h('input', { class: 'skill-name', value: sk.name, dir: 'auto', 'aria-label': 'نام مهارت' }); n.addEventListener('input', () => { sk.name = n.value; markDirty(); }); return n; })(),
            h('div', { class: 'pct-row' }, range, pctNum)
          ),
          h('div', { class: 'row-tools' },
            h('button', { class: 'icon-btn', type: 'button', title: 'بالاتر', 'aria-label': 'بالاتر', disabled: i === 0, onclick: () => { move(s.columns[ci], i, -1) && (markDirty(), rer()); } }, svg(I.up)),
            h('button', { class: 'icon-btn', type: 'button', title: 'پایین‌تر', 'aria-label': 'پایین‌تر', disabled: i === s.columns[ci].length - 1, onclick: () => { move(s.columns[ci], i, 1) && (markDirty(), rer()); } }, svg(I.down)),
            h('button', { class: 'icon-btn', type: 'button', title: 'تنظیمات آیکون و جابه‌جایی', 'aria-label': 'تنظیمات', onclick: () => { extraOpen ? openExtra.delete(key) : openExtra.add(key); viewSkills._open = [...openExtra]; rer(); } }, svg(I.gear))
          ),
          extraOpen ? h('div', { class: 'skill-extra' },
            h('div', { class: 'field' }, h('label', { class: 'field-label' }, 'آیکون'),
              (() => {
                const sel = h('select', { class: 'select' }, Object.entries(SKILL_STYLES).map(([k, v]) => h('option', { value: k }, v.name)));
                sel.value = sk.icon;
                sel.addEventListener('change', () => {
                  sk.icon = sel.value;
                  if (SKILL_STYLES[sk.icon].label) sk.label = SKILL_STYLES[sk.icon].label;
                  if (sk.icon === 'text') { sk.color = sk.color || 'pr'; sk.label = sk.label || sk.name.slice(0, 2); } else delete sk.color;
                  if (SKILL_SVGS[sk.icon]) sk.label = '';
                  markDirty(); rer();
                });
                return sel;
              })()),
            sk.icon === 'text' ? field('حروف روی آیکون', sk, 'label', { ltr: true, oninput: () => { const ic = itemRef && itemRef.querySelector('.skill-ic'); if (ic) ic.replaceWith(skillIcon(sk)); } }) : null,
            sk.icon === 'text' ? h('div', { class: 'field' }, h('label', { class: 'field-label' }, 'رنگ'),
              (() => {
                const sel = h('select', { class: 'select' }, Object.entries(SKILL_STYLES).filter(([k]) => k !== 'text').map(([k, v]) => h('option', { value: k }, v.name)));
                sel.value = sk.color || 'pr';
                sel.addEventListener('change', () => { sk.color = sel.value; markDirty(); rer(); });
                return sel;
              })()) : null,
            h('div', { style: 'display:flex;gap:8px;align-items:end;grid-column:1/-1' },
              h('button', { class: 'btn btn-sm', type: 'button', onclick: () => { const [x] = s.columns[ci].splice(i, 1); s.columns[1 - ci].push(x); openExtra.clear(); viewSkills._open = []; markDirty(); rer(); } }, svg(I.swap), 'انتقال به ستون دیگر'),
              h('button', { class: 'btn btn-sm btn-danger', type: 'button', onclick: async () => { if (await confirmBox('این مهارت حذف شود؟', `«${sk.name}» از سایت حذف می‌شود.`)) { s.columns[ci].splice(i, 1); openExtra.clear(); viewSkills._open = []; markDirty(); rer(); } } }, svg(I.trash), 'حذف مهارت')
            )
          ) : null
        );
        return item;
      })),
      h('button', {
        class: 'btn', type: 'button', style: 'margin-top:12px', onclick: () => {
          s.columns[ci].push({ name: 'مهارت جدید', percent: 50, icon: 'text', label: 'Ne', color: 'pr', sway: 1 + Math.floor(Math.random() * 5) });
          openExtra.add(ci + ':' + (s.columns[ci].length - 1)); viewSkills._open = [...openExtra];
          markDirty(); rer();
        }
      }, svg(I.plus), 'افزودن مهارت')
    );
    return [
      panel(null, null, field('تیتر بخش', s, 'title')),
      panel('فهرست مهارت‌ها', 'درصد را با نوار یا عدد تغییر دهید. با دکمه چرخ‌دنده، آیکون یا ستون مهارت را عوض کنید.',
        h('div', { class: 'skill-cols' }, col(0, 'ستون راست (نرم‌افزارها)'), col(1, 'ستون چپ'))
      )
    ];
  }

  /* ---------- ۴. تجربه کاری ---------- */
  function editExperience(idx) {
    const list = data.experience;
    openDrawer('ویرایش سابقه کاری', (body) => {
      const ex = list[idx];
      if (!ex) { closeDrawer(); return; }
      ex.bullets = ex.bullets || [];
      body.append(
        h('div', { style: 'display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:start' },
          h('div', { class: 'field' }, h('span', { class: 'field-label' }, 'لوگو'), uploader(ex, 'logo', 'logo', { dark: true, style: 'aspect-ratio:1' })),
          h('div', { class: 'stack' }, field('عنوان', ex, 'title', { placeholder: 'همکاری با مجموعه …' }), field('بازه زمانی', ex, 'period', { placeholder: '۱۴۰۳ تا ۱۴۰۵' }))
        ),
        field('برچسب پایین کارت', ex, 'tag', { placeholder: 'تدوینگر و تولید رسانه' }),
        h('div', { class: 'field' },
          h('span', { class: 'field-label' }, 'کارها و دستاوردها'),
          h('div', { class: 'stack', style: 'gap:8px' }, ex.bullets.map((b, bi) => {
            const inp = h('input', { class: 'input', value: b, 'aria-label': 'مورد ' + (bi + 1) });
            inp.addEventListener('input', () => { ex.bullets[bi] = inp.value; markDirty(); });
            return h('div', { style: 'display:flex;gap:6px;align-items:center' }, inp,
              h('button', { class: 'icon-btn danger', type: 'button', 'aria-label': 'حذف مورد', onclick: () => { ex.bullets.splice(bi, 1); markDirty(); rebuildDrawer(); } }, svg(I.trash)));
          })),
          h('button', { class: 'btn btn-sm', type: 'button', style: 'justify-self:start;margin-top:4px', onclick: () => { ex.bullets.push(''); markDirty(); rebuildDrawer(); const ins = drawerEls.body.querySelectorAll('.stack input'); ins[ins.length - 1]?.focus(); } }, svg(I.plus), 'افزودن مورد')
        )
      );
    }, h('button', {
      class: 'btn btn-danger', type: 'button', onclick: async () => {
        if (await confirmBox('این سابقه حذف شود؟', 'کارت این سابقه از سایت حذف می‌شود.')) { list.splice(idx, 1); markDirty(); closeDrawer(); }
      }
    }, svg(I.trash), 'حذف سابقه'));
  }
  function viewExperience() {
    const list = data.experience;
    const rer = () => render();
    return panel('کارت‌های سوابق', `${fa(list.length)} کارت — ترتیب این فهرست همان ترتیب نمایش در سایت است.`,
      h('div', { style: 'margin-bottom:14px' },
        h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { list.unshift({ title: '', period: '', logo: '', bullets: ['', '', ''], tag: '' }); markDirty(); render(); editExperience(0); } }, svg(I.plus), 'افزودن سابقه جدید (اول فهرست)')
      ),
      h('div', { class: 'list' }, list.map((ex, i) =>
        h('div', { class: 'list-item', role: 'button', tabindex: '0', onclick: () => editExperience(i), onkeydown: (e) => { if (e.key === 'Enter') editExperience(i); } },
          h('div', { class: 'thumb' }, ex.logo ? h('img', { src: imgSrc(ex.logo), alt: '' }) : svg(I.experience)),
          h('div', { class: 't' }, h('b', null, ex.title || 'سابقه بدون عنوان'), h('span', null, [ex.period, ex.tag].filter(Boolean).join(' / '))),
          rowTools(list, i, rer, { confirmTitle: 'این سابقه حذف شود؟' })
        )
      ))
    );
  }

  /* ---------- ۵. نمونه‌کارها ---------- */
  function parseVideo(v) {
    const s = String(v || '').trim();
    if (!s) return { url: '', note: null };
    const src = (s.match(/src=["']([^"']+)["']/) || [])[1] || s;
    let m = src.match(/aparat\.com\/(?:v|video\/video\/embed\/videohash)\/([A-Za-z0-9]+)/);
    if (!m && /^[A-Za-z0-9]{4,12}$/.test(src)) m = [null, src];
    if (m) return { url: `https://www.aparat.com/video/video/embed/videohash/${m[1]}/vt/frame`, hash: m[1] };
    return { url: src, note: 'این لینک آپارات نیست؛ همان لینک استفاده می‌شود و ممکن است داخل سایت پخش نشود.' };
  }

  function editWork(cat, idx) {
    openDrawer(cat.type === 'gallery' ? 'ویرایش نمونه‌کار گرافیک' : 'ویرایش نمونه‌کار ویدیویی', (body) => {
      const it = cat.items[idx];
      if (!it) { closeDrawer(); return; }
      const isG = cat.type === 'gallery';
      const vStatus = h('div');
      const paintV = () => {
        const p = parseVideo(it.video);
        vStatus.replaceChildren(
          p.hash ? h('span', { class: 'video-ok' }, '✓ ویدیوی آپارات شناسایی شد — ', h('a', { href: 'https://www.aparat.com/v/' + p.hash, target: '_blank', rel: 'noopener noreferrer' }, 'دیدن در آپارات'))
            : p.note ? h('span', { class: 'video-bad' }, p.note) : h('span', { class: 'field-hint' }, 'لینک صفحه ویدیو در آپارات را اینجا بچسبانید، مثل aparat.com/v/abc123')
        );
      };
      body.append(
        h('div', { class: 'field' }, h('span', { class: 'field-label' }, isG ? 'لوگو یا کاور کارت' : 'کاور ویدیو (افقی ۱۶ در ۹)'),
          uploader(it, 'cover', isG ? 'graphicCover' : 'cover', { cover: !isG, dark: isG, style: isG ? 'aspect-ratio:720/500' : 'aspect-ratio:16/9' })),
        field('عنوان', it, 'title'),
        field('توضیح کوتاه', it, 'desc', { multiline: true, rows: 3 }),
        h('div', { class: 'grid-2' },
          field('برچسب', it, 'tag', { placeholder: isG ? 'طراحی بسته‌بندی' : 'تیزر تبلیغاتی' }),
          field('سال', it, 'year', { placeholder: '۱۴۰۵' })
        ),
        isG ? null : h('div', { class: 'grid-2' },
          field('لینک ویدیو در آپارات', it, 'video', {
            ltr: true, placeholder: 'https://www.aparat.com/v/…',
            set: (v) => parseVideo(v).url,
            onchange: (v, el) => { el.value = it.video; paintV(); },
            oninput: () => paintV()
          }),
          field('مدت ویدیو', it, 'duration', { ltr: true, placeholder: '01:30' })
        ),
        isG ? null : vStatus,
        isG ? galleryManager(it) : null,
        h('details', null,
          h('summary', { class: 'field-hint', style: 'cursor:pointer' }, 'تنظیمات بیشتر'),
          h('div', { class: 'stack', style: 'margin-top:12px' },
            field('عنوان داخل پنجره پخش', it, 'modal_title', { hint: 'اگر خالی باشد، همان عنوان کارت نشان داده می‌شود.' }),
            field('توضیح عکس کاور برای گوگل', it, 'cover_alt', { hint: 'اگر خالی باشد، عنوان کارت استفاده می‌شود.' })
          ))
      );
      if (!isG) paintV();
    }, h('div', { style: 'display:flex;gap:6px' },
      h('button', { class: 'btn btn-danger', type: 'button', onclick: async () => { if (await confirmBox('این نمونه‌کار حذف شود؟', 'کارت این نمونه‌کار از سایت حذف می‌شود.')) { cat.items.splice(idx, 1); markDirty(); closeDrawer(); } } }, svg(I.trash), 'حذف')
    ));
  }

  function galleryManager(it) {
    it.images = it.images || [];
    const input = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
    const wrap = h('div', { class: 'field' });
    const paint = () => {
      wrap.replaceChildren(
        h('span', { class: 'field-label' }, `عکس‌های گالری (${fa(it.images.length)} عکس)`),
        h('div', { class: 'field-hint' }, 'ترتیب عکس‌ها همان ترتیب نمایش در گالری است. عکس‌ها خودکار کوچک و فشرده می‌شوند.'),
        h('div', { class: 'thumbs' },
          it.images.map((p, i) => h('div', { class: 'thumb-cell' },
            h('img', { src: imgSrc(p), alt: '', loading: 'lazy' }),
            h('div', { class: 'tools' },
              h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'قبلی', disabled: i === 0, onclick: () => { move(it.images, i, -1); markDirty(); paint(); } }, svg(I.right)),
              h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'حذف عکس', onclick: () => { it.images.splice(i, 1); markDirty(); paint(); } }, svg(I.trash)),
              h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'بعدی', disabled: i === it.images.length - 1, onclick: () => { move(it.images, i, 1); markDirty(); paint(); } }, svg(I.left))
            )
          )),
          h('button', { class: 'thumb-add', type: 'button', onclick: () => input.click() }, svg(I.plus), 'افزودن عکس')
        ),
        input
      );
    };
    input.addEventListener('change', async () => {
      const files = [...input.files];
      input.value = '';
      for (const [n, f] of files.entries()) {
        toast(`در حال آماده‌سازی عکس ${fa(n + 1)} از ${fa(files.length)}…`, 'info', 1800);
        try { it.images.push(await processImage(f, 'gallery')); markDirty(); paint(); } catch (e) { toast(e.message, 'err'); }
      }
    });
    paint();
    return wrap;
  }

  function editCategory(ci) {
    const cats = data.portfolio.categories;
    openDrawer('تنظیمات دسته', (body) => {
      const c = cats[ci];
      if (!c) { closeDrawer(); return; }
      const iconSel = h('select', { class: 'select' }, Object.keys(CAT_SVGS).map((k) => h('option', { value: k }, CAT_ICON_NAMES[k] || k)));
      iconSel.value = CAT_SVGS[c.icon] ? c.icon : 'ai';
      iconSel.addEventListener('change', () => { c.icon = iconSel.value; markDirty(); rebuildDrawer(); });
      body.append(
        field('نام دسته', c, 'title'),
        field('زیرعنوان (انگلیسی یا فارسی)', c, 'subtitle', { auto: true }),
        h('div', { class: 'grid-2' },
          h('div', { class: 'field' }, h('label', { class: 'field-label' }, 'آیکون دسته'), iconSel),
          h('div', { class: 'field' }, h('span', { class: 'field-label' }, 'پیش‌نمایش'), h('div', { class: 'info-ic', style: 'width:44px;height:44px' }, svg(CAT_SVGS[c.icon] || CAT_SVGS.ai)))
        ),
        h('div', { class: 'field-hint' }, 'نوع دسته: ' + (c.type === 'gallery' ? 'گالری تصاویر' : 'ویدیو')),
        h('div', { class: 'panel', style: 'padding:16px;box-shadow:none' },
          h('div', { class: 'panel-head', style: 'margin-bottom:10px' }, h('div', null, h('h3', null, 'دکمه لینک زیر دسته (اختیاری)'), h('p', null, 'مثلاً لینک کانال بله برای دیدن نمونه‌های بیشتر. خالی بگذارید تا دکمه نمایش داده نشود.'))),
          h('div', { class: 'stack' },
            field('لینک', c, 'cta_url', { ltr: true, placeholder: 'https://ble.ir/…' }),
            field('متن دکمه', c, 'cta_text', { placeholder: 'برای مشاهده نمونه‌های بیشتر کلیک کنید' })
          )
        )
      );
    }, h('div', { style: 'display:flex;gap:6px' },
      h('button', { class: 'icon-btn', type: 'button', title: 'دسته قبلی', disabled: ci === 0, onclick: () => { move(cats, ci, -1); portfolioCat = ci - 1; markDirty(); closeDrawer(); } }, svg(I.up)),
      h('button', { class: 'icon-btn', type: 'button', title: 'دسته بعدی', disabled: ci === cats.length - 1, onclick: () => { move(cats, ci, 1); portfolioCat = ci + 1; markDirty(); closeDrawer(); } }, svg(I.down)),
      h('button', {
        class: 'btn btn-danger', type: 'button', onclick: async () => {
          if (await confirmBox('کل این دسته حذف شود؟', `دسته «${cats[ci].title}» با ${fa(cats[ci].items.length)} نمونه‌کار از سایت حذف می‌شود.`)) {
            cats.splice(ci, 1); portfolioCat = 0; markDirty(); closeDrawer();
          }
        }
      }, svg(I.trash), 'حذف دسته')
    ));
  }

  function newCategory() {
    const tmp = { title: '', type: 'video', icon: 'ai' };
    openDrawer('دسته جدید', (body) => {
      const typeSeg = h('div', { class: 'seg' },
        h('button', { type: 'button', 'aria-pressed': String(tmp.type === 'video'), onclick: () => { tmp.type = 'video'; rebuildDrawer(); } }, 'ویدیو'),
        h('button', { type: 'button', 'aria-pressed': String(tmp.type === 'gallery'), onclick: () => { tmp.type = 'gallery'; rebuildDrawer(); } }, 'گالری تصاویر'));
      body.append(
        field('نام دسته', tmp, 'title', { placeholder: 'مثلاً: عکاسی' }),
        h('div', { class: 'field' }, h('span', { class: 'field-label' }, 'نوع نمونه‌کارها'), typeSeg,
          h('div', { class: 'field-hint' }, tmp.type === 'video' ? 'هر کارت یک ویدیوی آپارات پخش می‌کند.' : 'هر کارت یک آلبوم عکس باز می‌کند.')),
        h('button', {
          class: 'btn btn-primary', type: 'button', style: 'justify-self:start', onclick: () => {
            if (!tmp.title.trim()) { toast('نام دسته را بنویسید.', 'info'); return; }
            data.portfolio.categories.push({ id: 'c' + Date.now().toString(36), type: tmp.type, icon: tmp.type === 'gallery' ? 'graphic' : 'editing', title: tmp.title.trim(), subtitle: '', cta_url: '', cta_text: '', items: [] });
            portfolioCat = data.portfolio.categories.length - 1;
            markDirty(); closeDrawer();
          }
        }, svg(I.plus), 'ساخت دسته')
      );
    });
  }

  function viewPortfolio() {
    const pf = data.portfolio;
    const cats = pf.categories;
    if (portfolioCat >= cats.length) portfolioCat = Math.max(0, cats.length - 1);
    const c = cats[portfolioCat];
    const tabs = h('div', { class: 'cat-tabs', role: 'tablist' },
      cats.map((cat, i) => h('button', { class: 'cat-tab', role: 'tab', type: 'button', 'aria-selected': String(i === portfolioCat), onclick: () => { portfolioCat = i; render(); } },
        svg(CAT_SVGS[cat.icon] || CAT_SVGS.ai), cat.title || 'بدون نام', h('span', { class: 'n' }, fa(cat.items.length)))),
      h('button', { class: 'cat-tab', type: 'button', onclick: newCategory }, svg(I.plus), 'دسته جدید')
    );
    const out = [
      panel('تیتر بخش نمونه‌کارها', 'در سایت، بخش دوم تیتر قرمز نمایش داده می‌شود.',
        h('div', { class: 'grid-2' }, field('تیتر', pf, 'title'), field('بخش قرمز تیتر', pf, 'title_highlight')),
        h('div', { style: 'margin-top:16px' }, field('توضیح زیر تیتر', pf, 'description'))
      ),
      h('section', { class: 'panel' }, tabs)
    ];
    if (!c) {
      out.push(panel(null, null, h('div', { class: 'empty-note' }, 'هنوز دسته‌ای ندارید. با «دسته جدید» اولین دسته را بسازید.')));
      return out;
    }
    const isG = c.type === 'gallery';
    out.push(h('section', { class: 'panel' },
      h('div', { class: 'panel-head' },
        h('div', { class: 'info-ic' }, svg(CAT_SVGS[c.icon] || CAT_SVGS.ai)),
        h('div', null, h('h3', null, c.title || 'بدون نام'), h('p', null, `${fa(c.items.length)} نمونه‌کار — ${isG ? 'گالری تصاویر' : 'ویدیو'}. روی هر کارت بزنید تا ویرایش شود.`)),
        h('div', { class: 'spacer' }),
        h('button', { class: 'btn btn-sm', type: 'button', onclick: () => editCategory(portfolioCat) }, svg(I.gear), 'تنظیمات دسته')
      ),
      h('div', { class: 'works' },
        h('button', {
          class: 'work-add', type: 'button', onclick: () => {
            const it = isG ? { title: '', modal_title: '', desc: '', cover: '', cover_alt: '', tag: '', year: '', images: [] }
              : { title: '', modal_title: '', desc: '', cover: '', cover_alt: '', tag: '', year: '', video: '', duration: '' };
            c.items.unshift(it); markDirty(); render(); editWork(c, 0);
          }
        }, svg(I.plus), 'افزودن نمونه‌کار'),
        c.items.map((it, i) => h('div', {
          class: 'work' + (isG ? ' gallery' : ''), role: 'button', tabindex: '0',
          onclick: () => editWork(c, i), onkeydown: (e) => { if (e.key === 'Enter') editWork(c, i); }
        },
          h('div', { class: 'cov' }, it.cover ? h('img', { src: imgSrc(it.cover), alt: '', loading: 'lazy' }) : svg(I.image)),
          h('span', { class: 'pos' }, fa(i + 1)),
          h('div', { class: 'meta' },
            h('b', null, it.title || 'بدون عنوان'),
            h('span', null, [it.year, isG ? fa((it.images || []).length) + ' عکس' : it.duration].filter(Boolean).join(' / ')),
            h('div', { style: 'display:flex;justify-content:space-between;margin-top:4px' },
              h('div', { class: 'row-tools' },
                h('button', { class: 'icon-btn', type: 'button', title: 'جلوتر', 'aria-label': 'جلوتر', disabled: i === 0, onclick: (e) => { e.stopPropagation(); move(c.items, i, -1); markDirty(); render(); } }, svg(I.right)),
                h('button', { class: 'icon-btn', type: 'button', title: 'عقب‌تر', 'aria-label': 'عقب‌تر', disabled: i === c.items.length - 1, onclick: (e) => { e.stopPropagation(); move(c.items, i, 1); markDirty(); render(); } }, svg(I.left))
              ),
              h('button', { class: 'icon-btn danger', type: 'button', title: 'حذف', 'aria-label': 'حذف', onclick: async (e) => { e.stopPropagation(); if (await confirmBox('این نمونه‌کار حذف شود؟', `«${it.title || 'بدون عنوان'}» از سایت حذف می‌شود.`)) { c.items.splice(i, 1); markDirty(); render(); } } }, svg(I.trash))
            )
          )
        ))
      )
    ));
    return out;
  }

  /* =========================================================
     انتشار
     ========================================================= */
  let publishing = false;
  async function publish() {
    if (publishing) return;
    const keys = changedKeys();
    if (!keys.length) return;
    // اعتبارسنجی ساده
    for (const cat of data.portfolio.categories) {
      for (const it of cat.items) {
        if (!String(it.title || '').trim()) { toast(`یک نمونه‌کار در دسته «${cat.title}» عنوان ندارد.`, 'err'); return; }
      }
    }
    publishing = true;
    const btn = $('publishBtn');
    btn.disabled = true;
    btn.replaceChildren(h('span', { class: 'spinner' }), 'در حال انتشار…');
    try {
      const ref = await gh(repoPath(`/git/ref/heads/${encodeURIComponent(branch)}`));
      const head = ref.object.sha;
      // اگر فایلی جای دیگری (مثلاً مستقیم در گیت‌هاب) عوض شده باشد، هشدار بده
      if (head !== loadedHead) {
        const conflicts = [];
        for (const k of keys) {
          try {
            const f = await gh(repoPath(`/contents/${CONFIG.files[k]}?ref=${head}`));
            if (f.sha !== shas[k]) conflicts.push(VIEWS[k].title);
          } catch (e) { if (e.status !== 404) throw e; }
        }
        if (conflicts.length && !await confirmBox('این بخش‌ها جای دیگری هم تغییر کرده‌اند',
          `«${conflicts.join('، ')}» بعد از باز شدن پنل، مستقیم در گیت‌هاب عوض شده. اگر ادامه دهید، نسخه این پنل جایگزین می‌شود.`, 'جایگزین کن', false)) {
          throw Object.assign(new Error('انتشار لغو شد.'), { quiet: true });
        }
      }
      const commit = await gh(repoPath(`/git/commits/${head}`));
      const tree = [];
      for (const k of keys) tree.push({ path: CONFIG.files[k], mode: '100644', type: 'blob', content: serialize(k) });
      const ups = referencedUploads();
      for (const [n, p] of ups.entries()) {
        btn.replaceChildren(h('span', { class: 'spinner' }), `آپلود عکس ${fa(n + 1)} از ${fa(ups.length)}…`);
        const blob = await gh(repoPath('/git/blobs'), { method: 'POST', body: { content: uploads.get(p).b64, encoding: 'base64' } });
        tree.push({ path: p, mode: '100644', type: 'blob', sha: blob.sha });
      }
      btn.replaceChildren(h('span', { class: 'spinner' }), 'در حال ثبت…');
      const newTree = await gh(repoPath('/git/trees'), { method: 'POST', body: { base_tree: commit.tree.sha, tree } });
      const who = { name: user.name || user.login, email: `${user.id}+${user.login}@users.noreply.github.com`, date: new Date().toISOString() };
      const names = keys.map((k) => VIEWS[k].title).join('، ');
      const newCommit = await gh(repoPath('/git/commits'), {
        method: 'POST',
        body: { message: `به‌روزرسانی از پنل مدیریت: ${names}`, tree: newTree.sha, parents: [head], author: who, committer: who }
      });
      await gh(repoPath(`/git/refs/heads/${encodeURIComponent(branch)}`), { method: 'PATCH', body: { sha: newCommit.sha } });

      for (const k of keys) { orig[k] = JSON.stringify(data[k]); shas[k] = await gitBlobSha(serialize(k)); }
      for (const p of ups) published.set(p, uploads.get(p).url);
      uploads.clear();
      loadedHead = newCommit.sha;
      toast('تغییرات ثبت شد. سایت تا یکی دو دقیقه دیگر به‌روز می‌شود.');
      watchDeploy(newCommit.sha);
    } catch (e) {
      if (!e.quiet) {
        let msg = e.message;
        if (e.status === 403 || e.status === 404) msg = 'کلید ورود اجازه نوشتن در مخزن را ندارد. در تنظیمات کلید، دسترسی Contents را روی Read and write بگذارید.';
        if (e.status === 401) msg = 'کلید ورود منقضی یا باطل شده. دوباره وارد شوید.';
        if (e.status === 409 || e.status === 422) msg = 'هم‌زمان تغییر دیگری در مخزن ثبت شد. یک بار دیگر «انتشار در سایت» را بزنید.';
        toast('انتشار انجام نشد: ' + msg, 'err', 9000);
      } else toast(e.message, 'info');
    } finally {
      publishing = false;
      btn.disabled = false;
      btn.replaceChildren('انتشار در سایت');
      markDirty();
      if (drawerEls) rebuildDrawer(); else render();
    }
  }

  let deployTimer = null;
  function setDeploy(state, text) {
    const pill = $('deployPill');
    pill.hidden = false;
    pill.className = 'deploy-pill ' + state;
    $('deployText').textContent = text;
  }
  function watchDeploy(sha) {
    clearTimeout(deployTimer);
    const started = Date.now();
    setDeploy('busy', 'در حال به‌روزرسانی سایت…');
    const tick = async () => {
      if (Date.now() - started > 6 * 60 * 1000) { setDeploy('', 'به‌روزرسانی بیشتر از حد معمول طول کشید'); return; }
      try {
        const r = await gh(repoPath(`/actions/runs?head_sha=${sha}&per_page=10`));
        const run = (r.workflow_runs || []).find((w) => /pages/i.test(w.name || '')) || (r.workflow_runs || [])[0];
        if (run && run.status === 'completed') {
          if (run.conclusion === 'success') { setDeploy('ok', 'سایت به‌روز شد'); toast('سایت به‌روز شد و تغییرات روی amiraligolchini.ir دیده می‌شود.'); return; }
          setDeploy('err', 'ساخت سایت خطا داد'); toast('ساخت سایت در گیت‌هاب خطا داد. در مخزن، تب Actions را باز کنید و متن خطا را ببینید.', 'err', 12000); return;
        }
        if (!run && Date.now() - started > 90 * 1000) { setDeploy('ok', 'ثبت شد؛ سایت چند دقیقه دیگر به‌روز می‌شود'); return; }
      } catch (e) {
        if (Date.now() - started > 30 * 1000) { setDeploy('ok', 'ثبت شد؛ سایت چند دقیقه دیگر به‌روز می‌شود'); return; }
      }
      deployTimer = setTimeout(tick, 6000);
    };
    deployTimer = setTimeout(tick, 5000);
  }

  async function discard() {
    if (!await confirmBox('همه تغییرات منتشرنشده لغو شود؟', 'پنل به آخرین نسخه منتشرشده برمی‌گردد.', 'لغو تغییرات')) return;
    for (const k of Object.keys(CONFIG.files)) data[k] = JSON.parse(orig[k]);
    uploads.clear();
    closeDrawer(true);
    render();
    toast('تغییرات لغو شد.', 'info');
  }

  /* =========================================================
     ورود و راه‌اندازی
     ========================================================= */
  function storedToken() {
    try { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function saveToken(t, remember) {
    try {
      localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY);
      (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, t);
    } catch (e) {}
  }
  function clearToken() {
    try { localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY); } catch (e) {}
  }

  async function startReel() {
    const reel = $('reel');
    if (reel.childElementCount) return;
    try {
      const res = await fetch(CONFIG.siteRoot + 'sample_video/sample_video.html', { cache: 'force-cache' });
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      let srcs = [...doc.querySelectorAll('img.card-cover-img')].map((i) => i.getAttribute('src')).filter((s) => s && !s.includes('{'));
      srcs = srcs.map((s) => s.startsWith('/') ? CONFIG.siteRoot + s.slice(1) : (s.startsWith('http') ? s : CONFIG.siteRoot + 'sample_video/' + s.replace(/^\.\//, '')));
      if (srcs.length < 3) return;
      for (let r = 0; r < 3; r++) {
        const shift = srcs.slice(r * 4).concat(srcs.slice(0, r * 4));
        const row = shift.slice(0, 10);
        const strip = h('div', { class: 'reel-strip' }, [...row, ...row].map((s) => h('div', { class: 'reel-frame' }, h('img', { src: s, alt: '', loading: 'lazy', decoding: 'async' }))));
        reel.append(strip);
      }
      setTimeout(() => reel.classList.add('ready'), 150);
    } catch (e) { /* بدون نوار فیلم هم صفحه ورود کار می‌کند */ }
  }

  function showLogin(msg) {
    $('app').hidden = true;
    $('loading').hidden = true;
    $('login').hidden = false;
    $('publishBar').classList.remove('show');
    const err = $('loginError');
    err.hidden = !msg;
    err.textContent = msg || '';
    startReel();
    setTimeout(() => $('tokenInput').focus(), 50);
  }

  async function enter(t) {
    token = t.trim();
    $('login').hidden = true;
    $('loading').hidden = false;
    $('loadingText').textContent = 'در حال بررسی کلید ورود…';
    try {
      user = await gh('/user');
      $('loadingText').textContent = 'در حال خواندن محتوای سایت…';
      await loadAll();
    } catch (e) {
      token = null;
      let msg = e.message;
      if (e.status === 401) msg = 'این کلید معتبر نیست یا منقضی شده. یک کلید جدید بسازید.';
      else if (e.status === 403 && /rate limit/i.test(e.message)) msg = 'گیت‌هاب موقتاً درخواست‌ها را محدود کرده. چند دقیقه دیگر دوباره امتحان کنید.';
      else if (e.status === 404 && !/فایل/.test(e.message)) msg = 'این کلید به مخزن amirgol-ir.github.io دسترسی ندارد. هنگام ساخت کلید، همین مخزن را انتخاب کنید.';
      if (e.status === 401 || e.status === 404) clearToken();
      showLogin(msg);
      return false;
    }
    $('userAvatar').src = user.avatar_url ? user.avatar_url + '&s=80' : '';
    $('userName').textContent = user.name || user.login;
    $('loading').hidden = true;
    $('app').hidden = false;
    try { const v = sessionStorage.getItem('aag_view'); if (VIEWS[v]) current = v; } catch (e) {}
    buildNav();
    render();
    return true;
  }

  function init() {
    $('tokenEye').addEventListener('click', () => {
      const i = $('tokenInput');
      i.type = i.type === 'password' ? 'text' : 'password';
    });
    $('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = $('tokenInput').value.trim();
      if (!t) { showLogin('کلید ورود را وارد کنید.'); return; }
      if (!/^(github_pat_|ghp_|gho_|ghu_)[A-Za-z0-9_]+$/.test(t)) { showLogin('این متن شبیه کلید گیت‌هاب نیست. کلید با github_pat_ شروع می‌شود.'); return; }
      const ok = await enter(t);
      if (ok) { saveToken(t, $('rememberMe').checked); $('tokenInput').value = ''; }
    });
    $('logoutBtn').addEventListener('click', async () => {
      if (changedKeys().length && !await confirmBox('خروج بدون انتشار؟', 'تغییرات منتشرنشده از بین می‌روند.', 'خروج')) return;
      clearToken();
      token = null;
      for (const k of Object.keys(orig)) delete orig[k];
      location.reload();
    });
    $('publishBtn').addEventListener('click', publish);
    $('discardBtn').addEventListener('click', discard);
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (token) publish(); }
    });

    const t = storedToken();
    if (t) enter(t); else showLogin();
  }

  init();
})();
