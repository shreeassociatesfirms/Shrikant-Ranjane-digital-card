/* ==========================================================================
   COMPANY NAME — script.js
   Vanilla JS: nav toggle, scroll reveal, FAQ accordion, ripple buttons,
   back-to-top, vCard download, contact form (placeholder handler).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shadow + scroll progress bar ---------- */
  const header = document.getElementById('siteHeader');
  const scrollProgress = document.getElementById('scrollProgress');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
    backToTop.classList.toggle('visible', window.scrollY > 500);

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  };

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  // Close mobile nav after clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal (fade-in on scroll) with cascading stagger ---------- */
  // Grids where children should reveal in a staggered cascade rather than all at once
  const staggerGroups = [
    '.service-grid', '.team-grid', '.gallery-grid',
    '.case-list', '#testimonialRow', '.accordion', '.chip-row'
  ];
  staggerGroups.forEach(selector => {
    document.querySelectorAll(`${selector} > *`).forEach((child, i) => {
      child.style.setProperty('--delay', `${Math.min(i * 90, 450)}ms`);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(item => revealObserver.observe(item));

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Magnetic buttons (desktop only): buttons drift gently toward the cursor ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Hero cursor spotlight ---------- */
  const heroSection = document.getElementById('heroSection');
  const heroSpotlight = document.getElementById('heroSpotlight');
  const heroOrbit = document.getElementById('heroOrbit');
  if (heroSection && window.matchMedia('(hover: hover)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      heroSpotlight.style.setProperty('--sx', `${px}%`);
      heroSpotlight.style.setProperty('--sy', `${py}%`);
      // subtle parallax on the orbit rings/dots
      const dx = (px - 50) * 0.15;
      const dy = (py - 50) * 0.15;
      heroOrbit.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }

  /* ---------- Scrollspy: highlight the active nav link as sections pass ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const spySections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  spySections.forEach(section => spyObserver.observe(section));

  /* ---------- Subtle card tilt on hover (desktop only) ---------- */
  const tiltEls = document.querySelectorAll('[data-tilt]');
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  if (supportsHover) {
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- WhatsApp button ---------- */
  const waBtn = document.querySelector('[data-whatsapp]');
  if (waBtn) {
    waBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '919769573939'; // Shree Associates WhatsApp number
      const message = encodeURIComponent('Hi Shree Associates, I found your digital card and would like to know more about your services.');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener');
    });
  }

  /* ---------- vCard download ---------- */
  const vcardBtn = document.getElementById('vcardBtn');
  if (vcardBtn) {
    vcardBtn.addEventListener('click', () => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Ranjane;Shrikant;;;',
        'FN:Shrikant Prabhakar Ranjane',
        'ORG:Shree Associates',
        'TITLE:Founder & Proprietor',
        'TEL;TYPE=WORK,VOICE:+91-97695-73939',
        'TEL;TYPE=WORK,VOICE:+91-97693-73939',
        'EMAIL:shree.associates.entp@gmail.com',
        'ADR;TYPE=WORK:;;Kohinoor Residency CHS Ltd, Office No. 01, Plot No. 2, Sec. 11, Opp. AXIS Bank, Kamothe;Navi Mumbai;Maharashtra;410209;India',
        'END:VCARD'
      ].join('\n');
      const blob = new Blob([vcard], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shree-associates.vcf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  /* ---------- Testimonials: data-driven cards with avatar initials ---------- */
  const testimonialData = [
    { name: 'Shivaji Gorde', meta: '1 review', rating: 5, time: 'a week ago', quote: 'Excellent' },
    { name: 'Raviraj Rathod', meta: '3 reviews', rating: 5, time: '2 weeks ago', quote: 'Shree Associates operates very efficiently; all my legal matters were handled smoothly after I engaged their services.' },
    { name: 'Raunak Pandey', meta: '2 reviews', rating: 5, time: '2 weeks ago', quote: 'Very best service' },
    { name: 'Gaurang Mestry', meta: 'Local Guide · 76 reviews · 41 photos', rating: 4, time: '6 years ago', quote: 'Service is good. It\'s not visible from the road but there is a board stating about it.' },
    { name: 'M Khan', meta: 'Local Guide · 238 reviews · 298 photos', rating: 3, time: '7 years ago', quote: 'Good service' }
  ];
  const testimonialRow = document.getElementById('testimonialRow');
  if (testimonialRow) {
    testimonialData.forEach(t => {
      const initials = t.name.split(' ').map(w => w[0]).join('');
      const starIcons = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      const card = document.createElement('div');
      card.className = 'testimonial-card fade-in';
      card.innerHTML = `
        <div class="stars" aria-label="${t.rating} out of 5 stars">${starIcons}</div>
        <p>"${t.quote}"</p>
        <div class="client-row">
          <span class="client-avatar" aria-hidden="true">${initials}</span>
          <span>
            <span class="client-name">${t.name}</span>
            <span class="client-role">${t.meta} · ${t.time}</span>
          </span>
        </div>
      `;
      testimonialRow.appendChild(card);
      revealObserver.observe(card);
    });
    // Re-apply stagger delays now that cards exist
    Array.from(testimonialRow.children).forEach((child, i) => {
      child.style.setProperty('--delay', `${Math.min(i * 90, 450)}ms`);
    });
  }

  /* ---------- Hero entrance: staggered reveal on page load (not just on scroll) ---------- */
  document.querySelectorAll('.hero .fade-in').forEach((el, i) => {
    el.style.setProperty('--delay', `${i * 120}ms`);
  });

  /* ---------- FAQ data + accordion build ---------- */
  const faqData = [
    { q: 'What services does Shree Associates provide?', a: 'We offer end-to-end legal and property compliance services: society registration (Housing, Credit, Seva societies, Trusts &amp; Mandals), conveyance and deemed conveyance, CIDCO flat/shop/plot transfer, stamp duty &amp; registration, society accounting and statutory audit, redevelopment legal advisory, and civil, criminal, consumer, and co-operative society dispute resolution.' },
    { q: 'How long does housing society registration take?', a: 'With complete documentation, registration typically takes 2 to 3 months. We manage the full process — paperwork, government liaison, and follow-up — to avoid unnecessary delays.' },
    { q: 'What is Deemed Conveyance and do I need it?', a: 'Deemed Conveyance transfers land and building ownership from the builder to the society even without the builder\'s cooperation. It is essential for societies whose builders have delayed or refused to execute a standard conveyance deed.' },
    { q: 'Can you help with CIDCO flat, shop, or plot transfers?', a: 'Yes, we manage the complete CIDCO transfer process including lease matters, NOC, documentation, and mortgage clearance for flats, shops, and plots, ensuring a smooth and legally sound transfer.' },
    { q: 'Do you provide society audit and accounting services?', a: 'Yes, our team handles society accounts management, statutory audit, monthly billing, financial reporting, and administrative support, keeping your society fully compliant and transparent.' },
    { q: 'How can Shree Associates help with redevelopment?', a: 'We provide legal advisory throughout the redevelopment process, including PMC appointment guidance, developer agreement drafting and review, and protecting member interests at every stage.' },
    { q: 'What areas do you serve and where are your offices?', a: 'We serve Navi Mumbai and Mumbai, with offices in Kamothe, Ulwe, and Fort (Mumbai), open Monday to Sunday from 10:00 AM to 6:00 PM. We have assisted over 1000 societies across the region since 2006.' },
    { q: 'Do you handle individual property matters, or only societies?', a: 'Both. While a large part of our work involves cooperative societies, we also assist individual property owners with stamp duty, registration, transfers, and legal advisory.' },
    { q: 'What documents do I need to get started?', a: 'Requirements vary by service, but generally include society formation documents, prior agreements, identity proofs, and property-related paperwork. Our team will guide you on the exact list for your specific case.' },
    { q: 'How do I get in touch with Shree Associates?', a: 'You can reach us via the WhatsApp or Email buttons above, call any of our three offices directly, or fill out the contact form below — our team typically responds within 24 hours.' }
  ];

  const accordion = document.getElementById('accordion');
  faqData.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'accordion-item fade-in';
    el.innerHTML = `
      <button class="accordion-question" aria-expanded="false">
        <span>${item.q}</span>
        <span class="accordion-icon" aria-hidden="true"></span>
      </button>
      <div class="accordion-answer">
        <p>${item.a}</p>
      </div>
    `;
    el.style.setProperty('--delay', `${Math.min(i * 70, 420)}ms`);
    accordion.appendChild(el);
    revealObserver.observe(el);
  });

  accordion.addEventListener('click', (e) => {
    const question = e.target.closest('.accordion-question');
    if (!question) return;
    const item = question.closest('.accordion-item');
    const answer = item.querySelector('.accordion-answer');
    const isOpen = item.classList.contains('open');

    // Close all other open items for a clean single-open accordion
    accordion.querySelectorAll('.accordion-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.accordion-answer').style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      question.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Contact form (placeholder handler — wire up to your backend) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'Thank you for reaching out! Our team will get back to you within 24 hours.';
      contactForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
