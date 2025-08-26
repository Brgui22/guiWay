document.addEventListener('DOMContentLoaded', () => {

    // IMPORTANTE: Em um projeto real, os dados do menu (especialmente os preços)
    // viriam de um servidor/banco de dados para garantir a segurança e consistência.
    // Como este é um projeto front-end, duplicamos o menu aqui para poder consultar os preços.
    const menu = {
        pao: [
            { id: 'pao-italiano', name: 'Italiano Branco', price: 5.00 },
            { id: 'pao-integral', name: '9 Grãos', price: 5.50 },
            { id: 'pao-parmesao', name: 'Parmesão e Orégano', price: 6.00 },
        ],
        proteina: [
            { id: 'prot-frango', name: 'Frango Grelhado', price: 8.00 },
            { id: 'prot-carne', name: 'Carne Desfiada', price: 9.50 },
            { id: 'prot-veggie', name: 'Hambúrguer Veggie', price: 8.50 },
        ],
        queijo: [
            { id: 'queijo-prato', name: 'Prato', price: 3.00 },
            { id: 'queijo-cheddar', name: 'Cheddar', price: 3.50 },
            { id: 'queijo-suico', name: 'Suíço', price: 4.00 },
        ],
        salada: [
            { id: 'salada-alface', name: 'Alface', price: 1.50 },
            { id: 'salada-tomate', name: 'Tomate', price: 1.50 },
            { id: 'salada-cebola', name: 'Cebola Roxa', price: 1.00 },
        ],
        molho: [
             { id: 'molho-chipotle', name: 'Chipotle', price: 2.00 },
             { id: 'molho-mostarda', name: 'Mostarda e Mel', price: 2.00 },
             { id: 'molho-barbecue', name: 'Barbecue', price: 2.00 },
        ]
    };
    
    const iconMap = {
        pao: 'fa-solid fa-bread-slice',
        proteina: 'fa-solid fa-burger',
        queijo: 'fa-solid fa-cheese',
        salada: 'fa-solid fa-leaf',
        molho: 'fa-solid fa-bottle-droplet'
    };

    // ALTERADO: Adicionado o novo cupom ETEC50
    const coupons = { 
        'PROMO10': 0.10, 
        'GUIWAY20': 0.20,
        'ETEC50': 0.50  // 50% de desconto
    };
    let pedido = {};
    let cupomAplicado = null;

    // Elementos do DOM
    const resumoListaEl = document.getElementById('resumo-pedido-lista');
    const subtotalEl = document.getElementById('subtotal');
    const freteEl = document.getElementById('frete');
    const descontoEl = document.getElementById('desconto');
    const linhaDescontoEl = document.getElementById('linha-desconto');
    const totalEl = document.getElementById('total');
    const opcoesFrete = document.querySelectorAll('input[name="frete"]');
    const aplicarCupomBtn = document.getElementById('aplicar-cupom-btn');
    const paymentForm = document.getElementById('payment-form');
    const paymentSuccessOverlay = document.getElementById('payment-success');
    const trackingInfo = document.getElementById('tracking-info');
    const orderReceivedBtn = document.getElementById('order-received-btn');
    const evaluationSection = document.getElementById('evaluation-section');
    const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const deliveryTimeEl = document.getElementById('delivery-time');

    function formatPrice(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }

    function calcularEAtualizarTotal() {
        let subtotal = 0;
        for (const categoria in pedido) {
            const item = pedido[categoria];
            // Encontra o item correspondente no menu para pegar o preço seguro
            const menuItem = menu[categoria].find(m => m.id === item.id);
            if (menuItem) {
                subtotal += menuItem.price;
            }
        }

        const freteSelecionado = document.querySelector('input[name="frete"]:checked');
        const custoFrete = freteSelecionado ? parseFloat(freteSelecionado.value) : 0;

        let valorDesconto = 0;
        if (cupomAplicado && coupons[cupomAplicado]) {
            valorDesconto = subtotal * coupons[cupomAplicado];
            linhaDescontoEl.classList.add('visible'); // Efeito de transição
        } else {
            linhaDescontoEl.classList.remove('visible');
        }

        const total = subtotal - valorDesconto + custoFrete;

        subtotalEl.textContent = formatPrice(subtotal);
        freteEl.textContent = formatPrice(custoFrete);
        descontoEl.textContent = `- ${formatPrice(valorDesconto)}`;
        totalEl.textContent = formatPrice(total);

        // Atualiza o tempo de entrega com base na opção de frete
        if (freteSelecionado && freteSelecionado.id === 'frete-express') {
            deliveryTimeEl.textContent = '15-25 minutos';
        } else {
            deliveryTimeEl.textContent = '30-45 minutos';
        }
    }

    function carregarResumoPedido() {
        resumoListaEl.innerHTML = ''; // Limpa a lista
        for (const categoria in pedido) {
            const item = pedido[categoria];
            // Pega o ícone correspondente do mapa de ícones
            const iconClass = iconMap[categoria] || 'fa-solid fa-circle-question';
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    <i class="${iconClass}"></i>
                    <span>${item.name}</span>
                </div>
                <span class="item-price">${formatPrice(item.price)}</span>
            `;
            resumoListaEl.appendChild(li);
        }
    }

    // NOVO: Função para preencher o formulário com dados de exemplo
    function preencherFormulario() {
        document.getElementById('nome-cartao').value = 'Guilherme Way';
        document.getElementById('num-cartao').value = '4002 8922 1234 5678';
        document.getElementById('validade').value = '10/28';
        document.getElementById('cvv').value = '321';
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    const params = new URLSearchParams(window.location.search);
    const pedidoData = params.get('pedido');

    if (pedidoData) {
        try {
            // Decodifica e converte a string da URL de volta para um objeto
            pedido = JSON.parse(decodeURIComponent(pedidoData));
            carregarResumoPedido();
            calcularEAtualizarTotal();
        } catch (e) {
            console.error("Erro ao processar o pedido:", e);
            resumoListaEl.innerHTML = '<li>Ocorreu um erro ao carregar seu pedido.</li>';
        }
    } else {
        resumoListaEl.innerHTML = '<li>Seu carrinho está vazio.</li>';
    }

    preencherFormulario(); // NOVO: Chama a função para preencher os dados

    // --- EVENT LISTENERS ---
    opcoesFrete.forEach(radio => {
        radio.addEventListener('change', calcularEAtualizarTotal);
    });
    
    aplicarCupomBtn.addEventListener('click', () => {
        const cupomInput = document.getElementById('cupom-input');
        const codigoCupom = cupomInput.value.toUpperCase();
        if(coupons[codigoCupom]) {
            cupomAplicado = codigoCupom;
            alert(`Cupom "${codigoCupom}" aplicado!`);
        } else {
            cupomAplicado = null;
            alert("Cupom inválido.");
        }
        cupomInput.value = '';
        calcularEAtualizarTotal();
    });

    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        
        // Simulação de pagamento sendo processado...
        const pagarBtn = event.target.querySelector('.pagar-btn');
        pagarBtn.innerHTML = '<i class="fa-solid fa-spinner fa-pulse"></i> Processando...';
        pagarBtn.disabled = true;

        // Mostra a tela de sucesso após um pequeno delay
        setTimeout(() => {
            paymentSuccessOverlay.style.display = 'flex'; // Exibe a camada de sucesso
            paymentSuccessOverlay.classList.add('show');
            
            // Inicia a exibição do rastreamento
            setTimeout(() => {
                trackingInfo.style.display = 'block';
            }, 1500); // Mostra o rastreio 1.5s após a mensagem de sucesso

        }, 2000); // Simula 2 segundos de processamento
    });

    orderReceivedBtn.addEventListener('click', () => {
        // Oculta a informação de rastreio e exibe a avaliação
        trackingInfo.style.display = 'none';
        evaluationSection.style.display = 'block';
    });

    ratingStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Lógica para colorir as estrelas da avaliação
            ratingStars.forEach((s, i) => {
                s.classList.remove('fa-solid');
                s.classList.add('fa-regular');
                if (i <= index) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                }
            });
        });
    });

    submitFeedbackBtn.addEventListener('click', () => {
        // Simula o envio e redireciona para a página inicial
        alert('Obrigado pelo seu feedback!');
        window.location.href = 'index.html'; // Redireciona para a página inicial
    });
});