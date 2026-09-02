// Dr. Yuri Dantas — script principal

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- menu mobile ---------- */
(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---------- header: sombra ao rolar ---------- */
(function(){
  var header = document.querySelector('header.site');
  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---------- menu: destaca a seção atual (scrollspy) ---------- */
(function(){
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#navLinks a[href^="#"]'));
  if(!navLinks.length) return;
  var sections = navLinks
    .map(function(a){ return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if(!sections.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = navLinks.find(function(a){ return a.getAttribute('href') === '#' + entry.target.id; });
      if(!link) return;
      if(entry.isIntersecting){
        navLinks.forEach(function(a){ a.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function(s){ observer.observe(s); });
})();

/* ---------- revelação suave ao rolar ---------- */
(function(){
  var targets = document.querySelectorAll('.reveal');
  if(!targets.length) return;
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    targets.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function(el){ observer.observe(el); });
})();

/* ---------- formulário de agendamento ---------- */
(function(){
  var overlay = document.getElementById('schedOverlay');
  var closeBtn = document.getElementById('schedClose');
  var form = document.getElementById('schedForm');
  var errorEl = document.getElementById('schedError');
  var stepForm = document.getElementById('schedStepForm');
  var stepDone = document.getElementById('schedStepDone');
  var waLink = document.getElementById('schedWaLink');
  var lastFocused = null;
  var WHATSAPP_NUMBER = '5513955432674';

  function openModal(){
    lastFocused = document.activeElement;
    resetToForm();
    overlay.hidden = false;
    requestAnimationFrame(function(){ overlay.classList.add('visible'); });
    document.body.style.overflow = 'hidden';
    var firstField = document.getElementById('schedName');
    if(firstField) firstField.focus();
  }

  function closeModal(){
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(function(){ overlay.hidden = true; }, 200);
    if(lastFocused) lastFocused.focus();
  }

  function resetToForm(){
    stepDone.hidden = true;
    stepForm.hidden = false;
    errorEl.hidden = true;
  }

  document.querySelectorAll('[data-schedule-trigger]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = form.schedName.value.trim();
    var last = form.schedLast.value.trim();
    var email = form.schedEmail.value.trim();
    var phone = form.schedPhone.value.trim();
    var procedure = form.schedProcedure.value;

    if(!name || !last || !email || !phone || !procedure){
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    var message = 'Olá! Meu nome é ' + name + ' ' + last + '.\n\n' +
      'Gostaria de agendar: ' + procedure + '\n\n' +
      'E-mail: ' + email + '\n' +
      'Telefone: ' + phone;

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    waLink.setAttribute('href', url);

    stepForm.hidden = true;
    stepDone.hidden = false;

    window.open(url, '_blank', 'noopener');
  });
})();

/* ---------- widget do whatsapp ---------- */
(function(){
  var bubble = document.getElementById('waBubble');
  var closeBtn = document.getElementById('waBubbleClose');
  var fab = document.getElementById('waFab');
  var textEl = document.getElementById('waBubbleText');

  var hour = new Date().getHours();
  var greeting = hour < 12 ? 'Bom dia' : (hour < 18 ? 'Boa tarde' : 'Boa noite');
  textEl.textContent = greeting + '! Temos horários disponíveis esta semana. Entre em contato!';

  var dismissed = false;
  try { dismissed = sessionStorage.getItem('waBubbleDismissed') === '1'; } catch(e){}

  if(!dismissed){
    setTimeout(function(){ bubble.classList.add('visible'); }, 1600);
  }

  closeBtn.addEventListener('click', function(){
    bubble.classList.remove('visible');
    try { sessionStorage.setItem('waBubbleDismissed','1'); } catch(e){}
  });
  // O clique do botão flutuante (waFab) é tratado pelo listener genérico
  // de [data-schedule-trigger], que abre o formulário de agendamento.
})();
