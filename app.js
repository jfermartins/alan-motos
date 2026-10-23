(() => {
  const mapPinUrl = 'https://maps.app.goo.gl/pfnxiieCVBbkC4uQ8';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const year = document.querySelector('#current-year');
  const form = document.querySelector('#contact-form');
  const result = document.querySelector('#form-result');
  const config = window.ALAN_SITE_CONFIG || {};
  const configuredWhatsApp = String(config.whatsapp || '5513991077633').replace(/\D/g, '');
  const floatingContact = document.querySelector('.floating-contact');
  const siteFooter = document.querySelector('.site-footer');

  const contactWhatsApp = document.querySelector('.contact-pending');
  if (contactWhatsApp && configuredWhatsApp.startsWith('55') && configuredWhatsApp.length >= 12) {
    const contactLink = document.createElement('a');
    contactLink.href = `https://wa.me/${configuredWhatsApp}`;
    contactLink.target = '_blank';
    contactLink.rel = 'noopener noreferrer';
    contactLink.textContent = configuredWhatsApp.length === 13
      ? `+55 (${configuredWhatsApp.slice(2, 4)}) ${configuredWhatsApp.slice(4, 9)}-${configuredWhatsApp.slice(9)}`
      : `+${configuredWhatsApp}`;
    contactWhatsApp.replaceWith(contactLink);

    if (floatingContact) {
      floatingContact.href = `https://wa.me/${configuredWhatsApp}?text=${encodeURIComponent('Olá! Gostaria de conversar sobre minha moto.')}`;
      floatingContact.target = '_blank';
      floatingContact.rel = 'noopener noreferrer';
      floatingContact.setAttribute('aria-label', 'Falar com a oficina pelo WhatsApp');
      floatingContact.title = 'Falar com a oficina pelo WhatsApp';
    }
  }

  if (floatingContact && siteFooter && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver(([entry]) => {
      floatingContact.classList.toggle('is-footer-visible', Boolean(entry?.isIntersecting));
    }, { threshold: 0.01 });
    footerObserver.observe(siteFooter);
  }

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('is-open');
    }));
  }

  // Lógica do formulário de contato principal
  if (form && result) {
    const buildMessage = (data) => [
      `Olá! Meu nome é ${data.name}.`,
      `Minha moto é ${data.bike}.`,
      `Preciso de ajuda com: ${data.service}.`,
      data.message ? `Detalhes: ${data.message}` : '',
      'Podemos conversar sobre o atendimento?'
    ].filter(Boolean).join('\n');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const values = new FormData(form);
      const message = buildMessage({
        name: String(values.get('name') || '').trim(),
        bike: String(values.get('bike') || '').trim(),
        service: String(values.get('service') || '').trim(),
        message: String(values.get('message') || '').trim()
      });
      const digits = String(config.whatsapp || '5513991077633').replace(/\D/g, '');

      result.hidden = false;
      result.replaceChildren();
      const note = document.createElement('p');

      if (digits.startsWith('55') && digits.length >= 12) {
        note.textContent = 'Sua solicitação está pronta. O WhatsApp será aberto com a mensagem para você revisar antes de enviar.';
        const link = document.createElement('a');
        link.className = 'copy-message';
        link.href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Abrir conversa no WhatsApp ↗';
        result.append(note, link);
      } else {
        note.textContent = 'O número oficial da oficina ainda não foi cadastrado no site.';
      }
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Lógica do formulário de depoimentos/avaliações na própria página
  const reviewForm = document.querySelector('#review-form');
  const reviewResult = document.querySelector('#review-result');
  const testimonialsList = document.querySelector('#testimonials-list');

  if (reviewForm && reviewResult && testimonialsList) {
    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!reviewForm.reportValidity()) return;

      const values = new FormData(reviewForm);
      const name = String(values.get('reviewName') || '').trim();
      const bike = String(values.get('reviewBike') || '').trim();
      const text = String(values.get('reviewText') || '').trim();

      // Criar o elemento do card de depoimento
      const card = document.createElement('div');
      card.className = 'testimonial-card';

      const stars = document.createElement('div');
      stars.className = 'testimonial-stars';
      stars.setAttribute('aria-hidden', 'true');
      stars.textContent = '★★★★★';

      const comment = document.createElement('p');
      comment.className = 'testimonial-text';
      comment.textContent = `"${text}"`;

      const author = document.createElement('span');
      author.className = 'testimonial-author';
      author.textContent = name;

      const bikeModel = document.createElement('span');
      bikeModel.className = 'testimonial-bike';
      bikeModel.textContent = bike;

      card.append(stars, comment, author, bikeModel);

      // Insere o novo depoimento no topo da lista
      testimonialsList.prepend(card);

      // Feedback de sucesso no formulário
      reviewResult.hidden = false;
      reviewResult.replaceChildren();
      const note = document.createElement('p');
      note.textContent = 'Obrigado! Sua avaliação foi publicada com sucesso nesta página.';
      reviewResult.append(note);

      // Reseta os campos do formulário
      reviewForm.reset();
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();