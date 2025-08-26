document.addEventListener('DOMContentLoaded', () => {
    // Objeto do menu e mapa de ícones
    const menu = {
        pao: [ { id: 'pao-italiano', name: 'Italiano Branco', price: 5.00 }, { id: 'pao-integral', name: '9 Grãos', price: 5.50 }, { id: 'pao-parmesao', name: 'Parmesão e Orégano', price: 6.00 }, ],
        proteina: [ { id: 'prot-frango', name: 'Frango Grelhado', price: 8.00 }, { id: 'prot-carne', name: 'Carne Desfiada', price: 9.50 }, { id: 'prot-veggie', name: 'Hambúrguer Veggie', price: 8.50 }, ],
        queijo: [ { id: 'queijo-prato', name: 'Prato', price: 3.00 }, { id: 'queijo-cheddar', name: 'Cheddar', price: 3.50 }, { id: 'queijo-suico', name: 'Suíço', price: 4.00 }, ],
        salada: [ { id: 'salada-alface', name: 'Alface', price: 1.50 }, { id: 'salada-tomate', name: 'Tomate', price: 1.50 }, { id: 'salada-cebola', name: 'Cebola Roxa', price: 1.00 }, ],
        molho: [ { id: 'molho-chipotle', name: 'Chipotle', price: 2.00 }, { id: 'molho-mostarda', name: 'Mostarda e Mel', price: 2.00 }, { id: 'molho-barbecue', name: 'Barbecue', price: 2.00 }, ]
    };
    const iconMap = { pao: 'fa-solid fa-bread-slice', proteina: 'fa-solid fa-burger', queijo: 'fa-solid fa-cheese', salada: 'fa-solid fa-leaf', molho: 'fa-solid fa-bottle-droplet' };
    const coupons = { 'PROMO10': 0.10, 'GUIWAY20': 0.20, 'ETEC50': 0.50 };
    let pedido = {};
    let cupomAplicado = null;

    // --- Elementos do DOM ---
    const resumoListaEl = document.getElementById('resumo-pedido-lista');
    const subtotalEl = document.getElementById('subtotal');
    const freteEl = document.getElementById('frete');
    const descontoEl = document.getElementById('desconto');
    const linhaDescontoEl = document.getElementById('linha-desconto');
    const totalEl = document.getElementById('total');
    const opcoesFrete = document.querySelectorAll('input[name="frete"]');
    const aplicarCupomBtn = document.getElementById('aplicar-cupom-btn');
    const paymentForm = document.getElementById('payment-form');
    const deliveryTimeEl = document.getElementById('delivery-time');
    const paymentContents = document.querySelectorAll('.payment-content');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const pixPaidBtn = document.getElementById('pix-paid-btn');
    const modals = {
        success: document.getElementById('payment-success-modal'),
        tracking: document.getElementById('tracking-modal'),
        feedback: document.getElementById('feedback-modal'),
    };
    const ratingStars = document.querySelectorAll('.rating-stars i');

    // --- Funções ---
    function formatPrice(price) { return `R$ ${price.toFixed(2).replace('.', ',')}`; }
    
    function calcularEAtualizarTotal() {
        let subtotal = 0;
        Object.values(pedido).forEach(item => subtotal += item.price);
        const freteSelecionado = document.querySelector('input[name="frete"]:checked');
        const custoFrete = freteSelecionado ? parseFloat(freteSelecionado.value) : 0;
        let valorDesconto = 0;
        if (cupomAplicado && coupons[cupomAplicado]) {
            valorDesconto = subtotal * coupons[cupomAplicado];
            linhaDescontoEl.classList.add('visible');
        } else {
            linhaDescontoEl.classList.remove('visible');
        }
        const total = subtotal - valorDesconto + custoFrete;
        subtotalEl.textContent = formatPrice(subtotal);
        freteEl.textContent = formatPrice(custoFrete);
        descontoEl.textContent = `- ${formatPrice(valorDesconto)}`;
        totalEl.textContent = formatPrice(total);
        if (deliveryTimeEl && freteSelecionado) {
            deliveryTimeEl.textContent = freteSelecionado.id === 'frete-express' ? '15-25 minutos' : '30-45 minutos';
        }
    }

    function carregarResumoPedido() {
        resumoListaEl.innerHTML = '';
        for (const categoria in pedido) {
            const item = pedido[categoria];
            const iconClass = iconMap[categoria] || 'fa-solid fa-circle-question';
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<i class="${iconClass}"></i><span>${item.name}</span>`;
            resumoListaEl.appendChild(div);
        }
    }

    function preencherFormulario() {
        document.getElementById('nome-cartao').value = 'Fulano de Tal';
        document.getElementById('num-cartao').value = '1234 5678 9012 3456';
        document.getElementById('validade').value = '12/29';
        document.getElementById('cvv').value = '123';
    }

    function iniciarProcessoDeSucesso(event) {
        if (event) event.preventDefault();
        modals.success.classList.add('show');
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    const params = new URLSearchParams(window.location.search);
    const pedidoData = params.get('pedido');
    if (pedidoData) {
        try {
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
    preencherFormulario();

    // --- EVENT LISTENERS ---

    // Listeners que não precisam de delegação
    opcoesFrete.forEach(radio => radio.addEventListener('change', calcularEAtualizarTotal));
    aplicarCupomBtn.addEventListener('click', () => {
        const cupomInput = document.getElementById('cupom-input');
        const codigoCupom = cupomInput.value.toUpperCase();
        if (coupons[codigoCupom]) {
            cupomAplicado = codigoCupom;
            alert(`Cupom "${codigoCupom}" aplicado!`);
        } else {
            cupomAplicado = null;
            alert("Cupom inválido.");
        }
        cupomInput.value = '';
        calcularEAtualizarTotal();
    });
    paymentForm.addEventListener('submit', iniciarProcessoDeSucesso);
    pixPaidBtn.addEventListener('click', iniciarProcessoDeSucesso);
    tabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
            tabBtns.forEach(t => t.classList.remove('active'));
            paymentContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // Listener Global para cliques (Delegação de Eventos)
    document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.closest('#track-order-btn')) {
            modals.success.classList.remove('show');
            modals.tracking.classList.add('show');
        }
        if (target.closest('#go-home-btn')) {
            window.location.href = 'index.html';
        }
        if (target.closest('#order-received-btn')) {
            modals.tracking.classList.remove('show');
            modals.feedback.classList.add('show');
        }
        if (target.closest('#submit-feedback-btn')) {
            alert('Obrigado pelo seu feedback!');
            window.location.href = 'index.html';
        }
        if (target.matches('.rating-stars i')) {
            const clickValue = target.dataset.value;
            target.parentElement.dataset.rating = clickValue;
        }
    });

    // Efeitos de HOVER para as estrelas
    document.querySelector('.rating-stars').addEventListener('mouseover', (event) => {
        if (event.target.matches('i')) {
            const hoverValue = event.target.dataset.value;
            ratingStars.forEach(s => {
                s.classList.toggle('active', s.dataset.value <= hoverValue);
            });
        }
    });
    
    document.querySelector('.rating-stars').addEventListener('mouseout', () => {
        ratingStars.forEach(s => {
            const isClicked = s.parentElement.dataset.rating >= s.dataset.value;
            s.classList.toggle('active', isClicked);
        });
    });
});