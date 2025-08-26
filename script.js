document.addEventListener('DOMContentLoaded', () => {

    const menu = {
        pao: [
            { id: 'pao-italiano', name: 'Italiano Branco', price: 5.00, image: 'https://catracalivre.com.br/wp-content/uploads/2023/07/pao-italiano.jpg' },
            { id: 'pao-integral', name: '9 Grãos', price: 5.50, image: 'https://i.panelinha.com.br/i1/bk-5103-blog-ayu6207-editado.webp' },
            { id: 'pao-parmesao', name: 'Parmesão e Orégano', price: 6.00, image: 'https://images.tcdn.com.br/img/img_prod/1021202/hamburguer_com_parmesao_6_und_33_1_21673f7863952304c3b93292ddf71166.jpg' },
        ],
        proteina: [
            { id: 'prot-frango', name: 'Frango Grelhado', price: 8.00, image: 'https://cdn.atletis.com.br/atletis-website/base/f31/051/baf/proteina-peito-frango.jpg' },
            { id: 'prot-carne', name: 'Carne Desfiada', price: 9.50, image: 'https://media.istockphoto.com/id/535786572/pt/foto/sagital-bife-grelhado.jpg?s=612x612&w=0&k=20&c=h9JZuPdEFSGvdTZGl5IcYg4DsPLlB3x5CLsGKB341g8=' },
            { id: 'prot-veggie', name: 'Hambúrguer Veggie', price: 8.50, image: 'https://truffle-assets.tastemadecontent.net/6ba7c292-hamburguer-vegetariano_l_thumb.jpg' },
        ],
        queijo: [
            { id: 'queijo-prato', name: 'Prato', price: 3.00, image: 'https://laticiniosholandes.com.br/wp-content/uploads/2023/10/blog_03_QueijoPrato.png' },
            { id: 'queijo-cheddar', name: 'Cheddar', price: 3.50, image: 'https://www.estadao.com.br/resizer/v2/QI2ER33FRRFM5FCK3PKM2JMWXI.jpeg?quality=80&auth=f6d90fe9c67ba71b6ccb99b9a44bcc26802ad86269baf741c67e47e375f8bc89&width=1075&height=527&focal=2880,1770' },
            { id: 'queijo-suico', name: 'Suíço', price: 4.00, image: 'https://media.istockphoto.com/id/531009927/pt/foto/fatias-de-queijo.jpg?s=612x612&w=0&k=20&c=xAquzlDx2oPSuFbsKlJK6Nds12GOwvc3XTiYEiFKdTU=' },
        ],
        salada: [
            { id: 'salada-alface', name: 'Alface', price: 1.50, image: 'https://receitanatureba.com/wp-content/uploads/2021/03/Salada-Simples-de-Alface.jpg' },
            { id: 'salada-tomate', name: 'Tomate', price: 1.50, image: 'https://static.itdg.com.br/images/640-440/6b184210aca499af964d7edd6eb29c78/320098-original.jpg' },
            { id: 'salada-cebola', name: 'Cebola Roxa', price: 1.00, image: 'https://img.freepik.com/fotos-gratis/vista-do-close-up-de-tigela-cheia-de-cebola-fatiada-na-superficie-preta_141793-5360.jpg?semt=ais_hybrid&w=740&q=80' },
        ],
        molho: [
             { id: 'molho-chipotle', name: 'Chipotle', price: 2.00, image: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=600,height=400,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/f3f7f62d-f833-43bd-a7fc-e0296e50aeba.jpg' },
             { id: 'molho-mostarda', name: 'Mostarda e Mel', price: 2.00, image: 'https://dicasaudavel.emporioquatroestrelas.com.br/wp-content/uploads/2024/03/mostarda-1-1689x1080.webp' },
             { id: 'molho-barbecue', name: 'Barbecue', price: 2.00, image: 'https://conteudo.imguol.com.br/0c/2019/11/22/molho-barbecue-1574434196857_v2_1x1.jpg' },
        ]
    };
    
    const stepTitles = {
        pao: "1. Escolha seu Pão",
        proteina: "2. Qual será a Proteína?",
        queijo: "3. Selecione o Queijo",
        salada: "4. Adicione Saladas",
        molho: "5. Para finalizar, o Molho!"
    };

    let currentStep = 0;
    const menuSteps = Object.keys(menu);
    let order = {};
    const deliveryFee = 5.00;
    const coupons = { 'PROMO10': 0.10, 'GUIWAY20': 0.20 };
    let appliedCoupon = null;

    const stepTitleEl = document.getElementById('step-title');
    const optionsGridEl = document.getElementById('options-grid');
    const summaryListEl = document.getElementById('summary-list');
    const subtotalEl = document.getElementById('subtotal');
    const nextStepBtn = document.getElementById('next-step-btn');
    const sandwichVisualEl = document.getElementById('sandwich-visual');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const progressBarEl = document.getElementById('progress-bar');
    const stepCounterEl = document.getElementById('step-counter');

    function formatPrice(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }

    function updateProgress() {
        const totalSteps = menuSteps.length;
        const currentStepNumber = currentStep + 1;
        const progressPercentage = (currentStepNumber / totalSteps) * 100;
        progressBarEl.style.width = `${progressPercentage}%`;
        stepCounterEl.textContent = `Passo ${currentStepNumber} de ${totalSteps}`;
    }

    function renderStep() {
        const stepKey = menuSteps[currentStep];
        stepTitleEl.textContent = stepTitles[stepKey];
        optionsGridEl.innerHTML = '';
        optionsGridEl.style.opacity = 0;

        menu[stepKey].forEach(item => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.id = item.id;
            card.dataset.key = stepKey;
            
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>
            `;
            
            if (order[stepKey] && order[stepKey].id === item.id) {
                card.classList.add('selected');
            }

            card.addEventListener('click', () => selectItem(stepKey, item.id));
            optionsGridEl.appendChild(card);
        });
        
        setTimeout(() => { optionsGridEl.style.opacity = 1; }, 50);

        updateNextButton();
        updateProgress();
    }
    
    function selectItem(stepKey, itemId) {
        const selectedItem = menu[stepKey].find(item => item.id === itemId);
        order[stepKey] = selectedItem;
        
        const allCardsInStep = optionsGridEl.querySelectorAll('.option-card');
        allCardsInStep.forEach(card => card.classList.remove('selected'));
        optionsGridEl.querySelector(`[data-id="${itemId}"]`).classList.add('selected');

        updateSummary();
        updateTotal();
        updateNextButton();
    }

    function updateSummary() {
        summaryListEl.innerHTML = '';
        sandwichVisualEl.innerHTML = '';
        
        let zIndex = 1;
        menuSteps.forEach(stepKey => {
            if (order[stepKey]) {
                const item = order[stepKey];
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.name}</span><strong>${formatPrice(item.price)}</strong>`;
                summaryListEl.appendChild(li);

                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name;
                img.style.zIndex = zIndex++;
                sandwichVisualEl.appendChild(img);
            }
        });
    }

    function updateTotal() {
        const subtotal = Object.values(order).reduce((acc, item) => acc + item.price, 0);
        subtotalEl.textContent = formatPrice(subtotal);
        return subtotal;
    }

    function updateNextButton() {
        const currentStepKey = menuSteps[currentStep];
        if (order[currentStepKey]) {
            nextStepBtn.disabled = false;
        } else {
            nextStepBtn.disabled = true;
        }

        if (currentStep === menuSteps.length - 1) {
            nextStepBtn.innerHTML = 'Finalizar Pedido <i class="fa-solid fa-check"></i>';
        } else {
            nextStepBtn.innerHTML = 'Próxima Etapa <i class="fa-solid fa-arrow-right"></i>';
        }
    }

    // #########  FUNÇÃO CORRIGIDA ##########
    function handleNextStep() {
        if (currentStep < menuSteps.length - 1) {
            currentStep++;
            renderStep();
        } else {
            // AGORA, NA ÚLTIMA ETAPA, O BOTÃO REDIRECIONA DIRETAMENTE
            if (Object.keys(order).length === 0) {
                alert('Você ainda não montou seu lanche!');
                return;
            }
            const orderJSON = JSON.stringify(order);
            const encodedOrder = encodeURIComponent(orderJSON);
            window.location.href = `pagar.html?pedido=${encodedOrder}`;
        }
    }
    
    // As funções showCheckout, updateFinalTotal e applyCoupon não são mais usadas aqui,
    // pois essa lógica agora está na página 'pagar.html'. Mas podemos mantê-las caso
    // você queira reutilizar o modal para outro propósito no futuro.
    function showCheckout() {
        const finalSummaryEl = document.getElementById('final-summary');
        finalSummaryEl.innerHTML = summaryListEl.innerHTML;
        const subtotal = updateTotal();
        document.getElementById('final-subtotal').textContent = formatPrice(subtotal);
        document.getElementById('delivery-fee').textContent = formatPrice(deliveryFee);
        updateFinalTotal(subtotal);
        checkoutModal.classList.add('show');
    }

    function updateFinalTotal() {
        let subtotal = Object.values(order).reduce((acc, item) => acc + item.price, 0);
        let discount = 0;
        if(appliedCoupon && coupons[appliedCoupon]) {
            discount = subtotal * coupons[appliedCoupon];
        }
        const total = subtotal - discount + deliveryFee;
        document.getElementById('final-total').textContent = formatPrice(total);
    }
    
    function applyCoupon() {
        const couponInput = document.getElementById('coupon-input');
        const couponCode = couponInput.value.toUpperCase();
        if (coupons[couponCode]) {
            appliedCoupon = couponCode;
            alert(`Cupom "${couponCode}" aplicado com sucesso!`);
        } else {
            appliedCoupon = null;
            alert('Cupom inválido!');
        }
        updateFinalTotal();
        couponInput.value = '';
    }

    nextStepBtn.addEventListener('click', handleNextStep);
    closeModalBtn.addEventListener('click', () => checkoutModal.classList.remove('show'));
    document.getElementById('apply-coupon-btn').addEventListener('click', applyCoupon);

    // Inicia a aplicação
    updateProgress();
    renderStep();

    // O bloco de código extra que estava aqui foi REMOVIDO pois a lógica foi movida para a função handleNextStep.
});