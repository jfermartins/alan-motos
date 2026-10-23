document.addEventListener('DOMContentLoaded', () => {
  // Elementos do formulário e container de depoimentos
  const reviewForm = document.getElementById('review-form');
  const testimonialsList = document.getElementById('testimonials-list');
  const reviewResult = document.getElementById('review-result');

  // Chave usada no localStorage
  const LOCAL_STORAGE_KEY = 'alan_mecanica_depoimentos';

  // 1. Função para carregar depoimentos salvos do localStorage
  function carregarDepoimentosSalvos() {
    const depoimentosSalvos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    depoimentosSalvos.forEach((depoimento) => {
      adicionarCardNaTela(depoimento.nome, depoimento.moto, depoimento.texto);
    });
  }

  // 2. Função auxiliar para renderizar o HTML do card de depoimento
  function adicionarCardNaTela(nome, moto, texto) {
    if (!testimonialsList) return;

    const card = document.createElement('div');
    card.classList.add('testimonial-card');

    card.innerHTML = `
      <div class="testimonial-stars" aria-hidden="true">★★★★★</div>
      <p class="testimonial-text">"${texto}"</p>
      <span class="testimonial-author">${nome}</span>
      <span class="testimonial-bike">${moto}</span>
    `;

    // Adiciona o novo depoimento no topo da lista
    testimonialsList.prepend(card);
  }

  // 3. Listener do evento de submissão do formulário
  if (reviewForm) {
    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Impede o recarregamento automático da página

      // Captura os valores digitados nos campos
      const nomeInput = document.getElementById('review-name');
      const motoInput = document.getElementById('review-bike');
      const textoInput = document.getElementById('review-text');

      const nome = nomeInput.value.trim();
      const moto = motoInput.value.trim();
      const texto = textoInput.value.trim();

      if (!nome || !moto || !texto) return;

      const novoDepoimento = { nome, moto, texto };

      // Obtém depoimentos já existentes e insere o novo
      const depoimentosSalvos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      depoimentosSalvos.push(novoDepoimento);

      // Salva a lista atualizada no localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(depoimentosSalvos));

      // Injeta o card do depoimento na tela imediatamente
      adicionarCardNaTela(nome, moto, texto);

      // Feedback visual simples e limpeza do formulário
      if (reviewResult) {
        reviewResult.textContent = 'Avaliação publicada com sucesso!';
        reviewResult.hidden = false;
        setTimeout(() => {
          reviewResult.hidden = true;
        }, 4000);
      }

      reviewForm.reset();
    });
  }

  // Inicializa o carregamento dos depoimentos salvos assim que o DOM estiver pronto
  carregarDepoimentosSalvos();
});