const projects = {
  ecofeed: {
    title: 'EcoFeed — Food Waste Management System',
    intro: 'A web application designed to connect food donors with NGOs and support efficient food redistribution.',
    overview: 'EcoFeed focuses on making food donation and redistribution more organized through a simple web experience.',
    problem: 'Usable surplus food can be difficult to route efficiently to organizations that can redistribute it.',
    solution: 'A donor-to-NGO workflow for managing food donations and requests in one place.',
    contribution: 'Developed the web application interface and implemented donation and request management flows.',
    features: ['Donation management','Request management','Responsive web interface','Donor and NGO connection'],
    tags: ['HTML','CSS','JavaScript','React'], github: '', live: ''
  },
  portfolio: {
    title: 'Personal Portfolio Website',
    intro: 'A responsive portfolio website built to showcase projects, skills, certifications and contact information.',
    overview: 'A personal web presence focused on clear information architecture, responsive design and smooth navigation.',
    problem: 'Recruiters need a quick way to understand a candidate’s projects, skills, experience and achievements.',
    solution: 'A responsive, user-friendly portfolio that brings core professional information into one polished experience.',
    contribution: 'Designed and developed the responsive interface, visual system and interaction patterns using HTML, CSS and JavaScript.',
    features: ['Responsive design','Project showcase','Skills and certification sections','Smooth navigation'],
    tags: ['HTML','CSS','JavaScript'], github: '', live: ''
  }
};

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const progress = $('#progress');
const navMenu = $('#navMenu');
const menuToggle = $('#menuToggle');

window.addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (height ? window.scrollY / height * 100 : 0) + '%';
}, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

$$('#navMenu a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const sections = [...$$('main section[id]')];
const navLinks = [...$$('#navMenu a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-38% 0px -52% 0px' });
sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12 });
$$('.reveal').forEach(element => revealObserver.observe(element));

/* subtle cursor-following light */
const cursorGlow = $('.cursor-glow');
window.addEventListener('pointermove', event => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  cursorGlow.style.left = event.clientX + 'px';
  cursorGlow.style.top = event.clientY + 'px';
}, { passive: true });

/* magnetic buttons */
$$('.magnetic').forEach(button => {
  button.addEventListener('mousemove', event => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * .10;
    const y = (event.clientY - rect.top - rect.height / 2) * .10;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('mouseleave', () => { button.style.transform = ''; });
});

/* project case studies */
const projectModal = $('#projectModal');
function openProject(id) {
  const project = projects[id];
  if (!project) return;
  $('#modalTitle').textContent = project.title;
  $('#modalIntro').textContent = project.intro;
  $('#modalOverview').textContent = project.overview;
  $('#modalProblem').textContent = project.problem;
  $('#modalSolution').textContent = project.solution;
  $('#modalContribution').textContent = project.contribution;
  $('#modalFeatures').innerHTML = project.features.map(item => `<span>${item}</span>`).join('');
  $('#modalTags').innerHTML = project.tags.map(item => `<span>${item}</span>`).join('');
  const github = $('#modalGithub');
  const live = $('#modalLive');
  github.style.display = project.github ? 'inline-flex' : 'none';
  live.style.display = project.live ? 'inline-flex' : 'none';
  if (project.github) github.href = project.github;
  if (project.live) live.href = project.live;
  openModal(projectModal);
}
$$('[data-project]').forEach(element => element.addEventListener('click', () => openProject(element.dataset.project)));

/* certificate viewer — used by both Experience and Certifications */
const certModal = $('#certModal');
function openCertificate(file, title) {
  $('#certTitle').textContent = title || 'Certificate preview';
  $('#certFrame').src = file;
  openModal(certModal);
}
$$('.view-cert').forEach(button => button.addEventListener('click', event => {
  event.stopPropagation();
  openCertificate(button.dataset.cert, button.dataset.certTitle);
}));
$$('.cert-card.clickable').forEach(card => card.addEventListener('click', () => {
  openCertificate(card.dataset.cert, card.dataset.certTitle);
}));

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const modal = $('#' + id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (id === 'certModal') $('#certFrame').src = '';
  document.body.style.overflow = '';
}
$$('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
$$('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', () => closeModal(backdrop.parentElement.id)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') $$('.modal.open').forEach(modal => closeModal(modal.id));
});

/* count-up achievements */
const counters = $$('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const duration = 850;
    const start = performance.now();
    const tick = now => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = Math.round(target * eased) + suffix;
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(element);
  });
}, { threshold: .7 });
counters.forEach(counter => countObserver.observe(counter));

/* contact validation */
$('#contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = $('#name');
  const email = $('#email');
  const message = $('#message');
  const checks = [
    [name, name.value.trim() ? '' : 'Please enter your name.'],
    [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Please enter a valid email.'],
    [message, message.value.trim().length >= 10 ? '' : 'Please enter at least 10 characters.']
  ];
  let valid = true;
  checks.forEach(([input, error]) => {
    input.parentElement.querySelector('small').textContent = error;
    if (error) valid = false;
  });
  if (!valid) return;
  const subject = encodeURIComponent('Portfolio enquiry from ' + name.value.trim());
  const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`);
  $('#formNote').textContent = 'Opening your email client…';
  window.location.href = `mailto:nandhiniramu04@gmail.com?subject=${subject}&body=${body}`;
});

$('#year').textContent = new Date().getFullYear();
