/* ----- Menu tab switching ----- */
function showTab(name) {
  document.querySelectorAll('.menu-section').forEach(function(section) {
    section.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  var panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    if (btn.textContent.toLowerCase().includes(name)) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    }
  });
}

/* ----- Mobile nav toggle ----- */
var navToggle = document.querySelector('.nav-toggle');
var navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    if (window.innerWidth > 680) return;
    var isOpen = navLinks.classList.contains('mobile-open');
    if (isOpen) {
      navLinks.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    } else {
      navLinks.classList.add('mobile-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close navigation menu');
    }
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth > 680) return;
      navLinks.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 680) {
      navLinks.classList.remove('mobile-open');
      navLinks.style.cssText = '';
    }
  });
}

/* ----- Active nav link on scroll ----- */
var sections   = document.querySelectorAll('section[id]');
var navAnchors = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  var scrollPos = window.scrollY + 120;
  var found = false;
  sections.forEach(function(section) {
    if (!found && section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      navAnchors.forEach(function(a) { a.classList.remove('active-link'); a.style.color = ''; });
      var match = document.querySelector('.nav-links a[href="#' + section.id + '"]');
      if (match) { match.classList.add('active-link'); found = true; }
    }
  });
}
window.addEventListener('scroll', setActiveLink);
setActiveLink();

/* ----- Order Now popup ----- */
var orderBtn   = document.getElementById('orderNowBtn');
var orderPopup = document.getElementById('orderPopup');

if (orderBtn && orderPopup) {
  orderBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = orderPopup.classList.contains('open');
    orderPopup.classList.toggle('open');
    orderBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });
  document.addEventListener('click', function(e) {
    if (!orderBtn.contains(e.target) && !orderPopup.contains(e.target)) {
      orderPopup.classList.remove('open');
      orderBtn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      orderPopup.classList.remove('open');
      orderBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ----- Deal card tap to expand (mobile) ----- */
document.querySelectorAll('.deal-card').forEach(function(card) {
  card.addEventListener('click', function() {
    if (window.innerWidth <= 768) {
      var isOpen = card.classList.contains('open');
      document.querySelectorAll('.deal-card').forEach(function(c) { c.classList.remove('open'); });
      if (!isOpen) card.classList.add('open');
    }
  });
});

/* ----- Gallery Lightbox ----- */
var galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
var lightbox      = document.getElementById('lightbox');
var lbImg         = document.getElementById('lbImg');
var lbCaption     = document.getElementById('lbCaption');
var lbClose       = document.getElementById('lbClose');
var lbPrev        = document.getElementById('lbPrev');
var lbNext        = document.getElementById('lbNext');
var currentIndex  = 0;

function setupLightboxStyles() {
  if (!lightbox || document.getElementById('lightboxRuntimeStyles')) return;

  var styles = document.createElement('style');
  styles.id = 'lightboxRuntimeStyles';
  styles.textContent = [
    '.lightbox-overlay{display:none;position:fixed;inset:0;z-index:1000;background:rgba(26,16,8,.9);align-items:center;justify-content:center;padding:24px;}',
    '.lightbox-overlay.open{display:flex;}',
    '.lightbox-inner{position:relative;max-width:min(920px,100%);max-height:90vh;text-align:center;}',
    '.lightbox-inner img{max-width:100%;max-height:78vh;border-radius:16px;object-fit:contain;background:#1A1008;}',
    '.lightbox-close,.lightbox-prev,.lightbox-next{position:absolute;border:0;border-radius:999px;background:#FFFFFF;color:#2C2118;box-shadow:0 8px 24px rgba(0,0,0,.24);cursor:pointer;font:700 24px/1 var(--font-body,Arial,sans-serif);}',
    '.lightbox-close{top:-16px;right:-16px;width:44px;height:44px;}',
    '.lightbox-prev,.lightbox-next{top:50%;width:44px;height:44px;transform:translateY(-50%);}',
    '.lightbox-prev{left:-56px;}',
    '.lightbox-next{right:-56px;}',
    '.lightbox-caption{margin-top:12px;color:#FFF8F0;font-weight:700;}',
    '@media (max-width:680px){.lightbox-overlay{padding:16px;}.lightbox-prev{left:8px;}.lightbox-next{right:8px;}.lightbox-close{top:8px;right:8px;}}'
  ].join('');
  document.head.appendChild(styles);
}

function openLightbox(index) {
  if (!lightbox || !lbImg || !lbCaption || !galleryImages.length) return;

  currentIndex = index;
  var img = galleryImages[index];
  if (!img) return;

  lbImg.src             = img.src;
  lbImg.alt             = img.alt;
  lbCaption.textContent = img.alt;
  lightbox.removeAttribute('hidden');
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightbox.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function showPrev() {
  if (!galleryImages.length) return;

  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentIndex);
}

function showNext() {
  if (!galleryImages.length) return;

  currentIndex = (currentIndex + 1) % galleryImages.length;
  openLightbox(currentIndex);
}

if (lightbox && lbImg && lbCaption) {
  setupLightboxStyles();
  lightbox.setAttribute('hidden', '');

  galleryImages.forEach(function(img, i) {
    img.addEventListener('click', function() { openLightbox(i); });
  });
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click', showPrev);
if (lbNext)  lbNext.addEventListener('click', showNext);

if (lightbox) {
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', function(e) {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});
