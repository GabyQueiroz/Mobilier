// Dados iniciais da empresa
const companyData = {
    name: "Mobiliér - Mobiliário para Eventos",
    instagram: "@mobilier_mobiliario",
    phone: "(41) 99999-9999",
    email: "contato@mobilier.com.br",
    deliveryStates: ["PR", "SC"],
    cepRanges: {
        'PR': ['80000', '83000', '84000'],
        'SC': ['88000', '89000', '90000']
    }
};

// Dados de produtos (estoque inicial)
let products = [
    {
        id: 1,
        name: "Cadeira de Madeira Maciça",
        description: "Cadeira rústica em madeira maciça, ideal para casamentos e eventos rurais.",
        price: 15.00,
        stock: 250,
        bulkDiscount: {
            quantity: 200,
            price: 14.00
        },
        image: "fas fa-chair",
        category: "Cadeiras"
    },
    {
        id: 2,
        name: "Mesa Redonda 1,5m",
        description: "Mesa redonda para 8 pessoas, estrutura em metal e tampo de MDF.",
        price: 120.00,
        stock: 50,
        bulkDiscount: {
            quantity: 10,
            price: 110.00
        },
        image: "fas fa-table",
        category: "Mesas"
    },
    {
        id: 3,
        name: "Puff de Couro Sintético",
        description: "Puff moderno em couro sintético, disponível em várias cores.",
        price: 45.00,
        stock: 100,
        bulkDiscount: null,
        image: "fas fa-couch",
        category: "Assentos"
    },
    {
        id: 4,
        name: "Biombo Decorativo",
        description: "Biombo em madeira com detalhes em tecido para divisórias.",
        price: 180.00,
        stock: 20,
        bulkDiscount: null,
        image: "fas fa-border-none",
        category: "Decoração"
    },
    {
        id: 5,
        name: "Cadeira Dobrável Plastico",
        description: "Cadeira dobrável em plástico resistente, fácil transporte e armazenamento.",
        price: 12.00,
        stock: 300,
        bulkDiscount: {
            quantity: 100,
            price: 10.50
        },
        image: "fas fa-chair",
        category: "Cadeiras"
    },
    {
        id: 6,
        name: "Mesa Retangular 2m",
        description: "Mesa retangular para banquetes e eventos corporativos.",
        price: 150.00,
        stock: 30,
        bulkDiscount: {
            quantity: 5,
            price: 140.00
        },
        image: "fas fa-table",
        category: "Mesas"
    },
    {
        id: 7,
        name: "Sofá de Canto",
        description: "Sofá de canto em tecido resistente, ideal para área de descanso.",
        price: 350.00,
        stock: 10,
        bulkDiscount: null,
        image: "fas fa-couch",
        category: "Assentos"
    },
    {
        id: 8,
        name: "Barril de Cerveja Decorativo",
        description: "Barril decorativo para servir drinks ou como elemento cenográfico.",
        price: 220.00,
        stock: 15,
        bulkDiscount: null,
        image: "fas fa-wine-bottle",
        category: "Decoração"
    }
];

// Carrinho de compras
let cart = [];
let freightValue = 0;

// Sistema de usuários
let users = [];
let currentUser = null;

// Orçamentos salvos
let savedBudgets = [];

// Credenciais do admin (podem ser alteradas)
const ADMIN_CREDENTIALS = {
    email: "admin@mobilier.com.br",
    password: "admin123",
    name: "Administrador",
    isAdmin: true
};

// Inicialização quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobiliér - Sistema iniciando...');
    
    // Carrega dados do localStorage
    loadFromLocalStorage();
    
    // Inicializa usuários (se for primeira vez, cria admin)
    initializeUsers();
    
    // Inicializa elementos da interface
    initMobileMenu();
    initUserMenu();
    initLoginModal();
    initModals();
    
    // Renderiza conteúdo inicial
    renderProducts();
    renderBudgetItems();
    updateCartDisplay();
    updateBudgetSummary();
    initAdminPanel();
    
    // Atualiza estado do usuário
    updateUserState();
    
    // Adiciona event listeners globais
    setupEventListeners();
    
    console.log('Sistema inicializado com sucesso!');
});

// ============================================
// FUNÇÕES DE INICIALIZAÇÃO
// ============================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (!mobileMenuBtn || !mainNav) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        const isVisible = mainNav.style.display === 'block';
        mainNav.style.display = isVisible ? 'none' : 'block';
        this.innerHTML = isVisible ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });
    
    // Fecha menu ao clicar em um link
    mainNav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            this.style.display = 'none';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Ajusta menu em redimensionamento
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.style.display = '';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            mainNav.style.display = 'none';
        }
    });
}

function initUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (!userMenuBtn) return;
    
    // Cria dropdown do usuário
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <ul>
            <li><a href="#" id="myBudgetsLink"><i class="fas fa-file-invoice-dollar"></i> Meus Orçamentos</a></li>
            <li><a href="#" id="myProfileLink"><i class="fas fa-user-cog"></i> Meu Perfil</a></li>
            <li class="divider"></li>
            <li><button id="logoutButton"><i class="fas fa-sign-out-alt"></i> Sair</button></li>
        </ul>
    `;
    
    userMenuBtn.parentNode.appendChild(dropdown);
    
    userMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentUser) {
            dropdown.classList.toggle('active');
        } else {
            openLoginModal();
        }
    });
    
    // Fecha dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Event listeners do dropdown
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('myBudgetsLink').addEventListener('click', function(e) {
        e.preventDefault();
        showMyBudgets();
        dropdown.classList.remove('active');
    });
    document.getElementById('myProfileLink').addEventListener('click', function(e) {
        e.preventDefault();
        showMyProfile();
        dropdown.classList.remove('active');
    });
}

function initLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close-login-modal');
    const loginBtn = document.getElementById('loginButton');
    const registerBtn = document.getElementById('registerButton');
    
    if (!loginModal || !closeBtn || !loginBtn || !registerBtn) return;
    
    closeBtn.addEventListener('click', closeLoginModal);
    
    loginBtn.addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });
    
    registerBtn.addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        register(email, password);
    });
    
    // Permitir login com Enter
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            login(email, password);
        }
    });
}

function initModals() {
    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

function setupEventListeners() {
    // Orçamento
    document.getElementById('checkCep')?.addEventListener('click', checkCep);
    document.getElementById('saveBudget')?.addEventListener('click', saveBudget);
    document.getElementById('clearBudget')?.addEventListener('click', clearBudget);
    
    // IA Assistant
    document.getElementById('aiSuggest')?.addEventListener('click', getAISuggestions);
    
    // CEP input formatting
    document.getElementById('cep')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        e.target.value = value;
    });
    
    // Admin
    document.querySelector('.close-modal')?.addEventListener('click', closeAdminModal);
    
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchAdminTab(tabId);
        });
    });
    
    document.getElementById('addProduct')?.addEventListener('click', addNewProduct);
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
}

// ============================================
// SISTEMA DE USUÁRIOS
// ============================================

function initializeUsers() {
    // Se não há usuários no localStorage, cria o admin
    if (users.length === 0) {
        users.push({
            id: 1,
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
            name: ADMIN_CREDENTIALS.name,
            isAdmin: true,
            createdAt: new Date().toISOString()
        });
        console.log('Usuário admin criado:', ADMIN_CREDENTIALS.email);
        saveToLocalStorage();
    }
    
    // Verifica se há usuário na sessão
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('Usuário recuperado da sessão:', currentUser.email);
        } catch (e) {
            console.error('Erro ao recuperar usuário da sessão:', e);
            sessionStorage.removeItem('currentUser');
        }
    }
}

function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginMessage').textContent = '';
        document.getElementById('loginEmail').focus();
    }
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
}

function login(email, password) {
    const loginMessage = document.getElementById('loginMessage');
    
    if (!email || !password) {
        showLoginMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Verifica se é o admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentUser = {
            id: 0,
            email: ADMIN_CREDENTIALS.email,
            name: ADMIN_CREDENTIALS.name,
            isAdmin: true
        };
        
        // Salva na sessão
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        closeLoginModal();
        updateUserState();
        showMessage('Login como administrador realizado com sucesso!', 'success');
        return;
    }
    
    // Verifica usuários comuns
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false
        };
        
        // Salva na sessão
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        closeLoginModal();
        updateUserState();
        showMessage(`Bem-vindo(a), ${user.name}!`, 'success');
    } else {
        showLoginMessage('E-mail ou senha incorretos.', 'error');
    }
}

function register(email, password) {
    const loginMessage = document.getElementById('loginMessage');
    
    if (!email || !password) {
        showLoginMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showLoginMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    // Verifica se email já existe
    if (users.some(u => u.email === email)) {
        showLoginMessage('Este e-mail já está cadastrado.', 'error');
        return;
    }
    
    // Validação de senha
    if (password.length < 6) {
        showLoginMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    // Cria novo usuário
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        email: email,
        password: password,
        name: email.split('@')[0],
        isAdmin: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToLocalStorage();
    
    // Faz login automaticamente
    currentUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isAdmin: false
    };
    
    // Salva na sessão
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeLoginModal();
    updateUserState();
    showMessage(`Conta criada com sucesso! Bem-vindo(a), ${newUser.name}!`, 'success');
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    updateUserState();
    showMessage('Logout realizado com sucesso.', 'success');
}

function updateUserState() {
    const userNameSpan = document.getElementById('userName');
    const userMenuBtn = document.querySelector('.user-menu-btn i');
    const userDropdown = document.querySelector('.user-dropdown ul');
    
    if (!userNameSpan || !userMenuBtn) return;
    
    if (currentUser) {
        userNameSpan.textContent = currentUser.name;
        userMenuBtn.className = 'fas fa-user-check';
        
        // Adiciona badge de admin se for administrador
        if (currentUser.isAdmin) {
            userNameSpan.innerHTML = `${currentUser.name} <span class="admin-badge">ADMIN</span>`;
            
            // Adiciona link para admin no dropdown
            if (userDropdown && !document.querySelector('#adminLink')) {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = '<a href="#" id="adminLink"><i class="fas fa-tools"></i> Painel Admin</a>';
                userDropdown.insertBefore(adminLi, userDropdown.firstChild);
                
                document.getElementById('adminLink').addEventListener('click', function(e) {
                    e.preventDefault();
                    openAdminModal();
                    document.querySelector('.user-dropdown').classList.remove('active');
                });
            }
        }
    } else {
        userNameSpan.textContent = 'Entrar';
        userMenuBtn.className = 'fas fa-user';
        
        // Remove link do admin se existir
        const adminLink = document.querySelector('#adminLink');
        if (adminLink) {
            adminLink.parentNode.remove();
        }
    }
}

function showLoginMessage(message, type = 'error') {
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
    }
}

// ============================================
// FUNÇÕES DE PRODUTOS E ORÇAMENTO
// ============================================

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="empty-message">Nenhum produto cadastrado.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Determina classe de estoque
        let stockClass = 'available';
        let stockText = `${product.stock} unidades disponíveis`;
        let stockIcon = '<i class="fas fa-check-circle"></i>';
        
        if (product.stock === 0) {
            stockClass = 'out';
            stockText = 'Esgotado';
            stockIcon = '<i class="fas fa-times-circle"></i>';
        } else if (product.stock < 20) {
            stockClass = 'low';
            stockText = `${product.stock} unidades (estoque baixo)`;
            stockIcon = '<i class="fas fa-exclamation-circle"></i>';
        }
        
        // Verifica se tem desconto por quantidade
        let priceText = `R$ ${product.price.toFixed(2).replace('.', ',')} cada`;
        if (product.bulkDiscount) {
            priceText += `<small>${product.bulkDiscount.quantity}+ unidades: R$ ${product.bulkDiscount.price.toFixed(2).replace('.', ',')} cada</small>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${priceText}</p>
                <p class="product-stock ${stockClass}">${stockIcon} ${stockText}</p>
                <div class="product-actions">
                    <button class="btn-secondary add-to-budget" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                    <button class="btn-outline view-details" data-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Adiciona event listeners aos botões
    document.querySelectorAll('.add-to-budget').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToBudget(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            viewProductDetails(productId);
        });
    });
}

function renderBudgetItems() {
    const itemsContainer = document.querySelector('.items-selection');
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    
    products.forEach(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'item-select';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${product.name}</h4>
                <p class="item-price">R$ ${product.price.toFixed(2).replace('.', ',')} cada</p>
                <p class="item-stock">${product.stock} unidades disponíveis</p>
            </div>
            <div class="item-quantity">
                <button class="btn-small decrease-quantity" data-id="${product.id}" ${quantity === 0 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="quantity-input" data-id="${product.id}" value="${quantity}" 
                       min="0" max="${product.stock}" ${product.stock === 0 ? 'disabled' : ''}>
                <button class="btn-small increase-quantity" data-id="${product.id}" 
                        ${quantity >= product.stock ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        
        itemsContainer.appendChild(itemElement);
    });
    
    // Adiciona event listeners aos controles de quantidade
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value) || 0;
            updateCartQuantity(productId, quantity, true);
        });
    });
}

function addToBudget(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock === 0) {
        showMessage('Este produto está esgotado no momento.', 'error');
        return;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity += 1;
        } else {
            showMessage(`Não há estoque suficiente. Máximo: ${product.stock} unidades.`, 'error');
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            bulkDiscount: product.bulkDiscount
        });
    }
    
    updateCartDisplay();
    updateBudgetSummary();
    renderBudgetItems();
    
    showMessage(`${product.name} adicionado ao orçamento.`, 'success');
}

function updateCartQuantity(productId, change, setAbsolute = false) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cartItem = cart.find(item => item.id === productId);
    
    if (setAbsolute) {
        const newQuantity = Math.max(0, Math.min(change, product.stock));
        
        if (newQuantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        } else if (cartItem) {
            cartItem.quantity = newQuantity;
        } else if (newQuantity > 0) {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: newQuantity,
                bulkDiscount: product.bulkDiscount
            });
        }
    } else {
        if (!cartItem && change > 0) {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                bulkDiscount: product.bulkDiscount
            });
        } else if (cartItem) {
            const newQuantity = cartItem.quantity + change;
            
            if (newQuantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            } else if (newQuantity > product.stock) {
                showMessage(`Não há estoque suficiente. Máximo: ${product.stock} unidades.`, 'error');
                return;
            } else {
                cartItem.quantity = newQuantity;
            }
        }
    }
    
    updateCartDisplay();
    updateBudgetSummary();
    renderBudgetItems();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalItemsElement = document.getElementById('totalItems');
    
    if (!cartItemsContainer || !totalItemsElement) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Nenhum item adicionado</p>';
        totalItemsElement.textContent = '0';
        return;
    }
    
    let cartHTML = '';
    let totalItems = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        
        let itemPrice = item.price;
        if (item.bulkDiscount && item.quantity >= item.bulkDiscount.quantity) {
            itemPrice = item.bulkDiscount.price;
        }
        
        const itemTotal = itemPrice * item.quantity;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-quantity">${item.quantity}x</div>
                <div class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalItemsElement.textContent = totalItems.toString();
}

function updateBudgetSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const freightElement = document.getElementById('freight');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !freightElement || !totalElement) return;
    
    let subtotal = 0;
    
    cart.forEach(item => {
        let itemPrice = item.price;
        
        if (item.bulkDiscount && item.quantity >= item.bulkDiscount.quantity) {
            itemPrice = item.bulkDiscount.price;
        }
        
        subtotal += itemPrice * item.quantity;
    });
    
    const total = subtotal + freightValue;
    
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    freightElement.textContent = `R$ ${freightValue.toFixed(2).replace('.', ',')}`;
    totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ============================================
// SISTEMA DE CEP E FRETE
// ============================================

function checkCep() {
    const cepInput = document.getElementById('cep');
    const cepMessage = document.getElementById('cepMessage');
    
    if (!cepInput || !cepMessage) return;
    
    let cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showCepMessage('CEP inválido. Digite um CEP com 8 dígitos.', 'error');
        freightValue = 0;
        updateBudgetSummary();
        return;
    }
    
    // Formata CEP
    cep = cep.substring(0, 5) + '-' + cep.substring(5);
    cepInput.value = cep;
    
    showCepMessage('Consultando CEP...', 'info');
    
    // Simulação de consulta de CEP (substituir por API real)
    setTimeout(() => {
        simulateCepCheck(cep, cepMessage);
    }, 1000);
}

// ============================================
// SISTEMA DE CEP E FRETE (CORRIGIDO)
// ============================================

function simulateCepCheck(cep, cepMessage) {
    const cepNumbers = cep.replace(/\D/g, '');
    const cepPrefix = cepNumbers.substring(0, 5);
    
    console.log('Verificando CEP:', cep, 'Prefixo:', cepPrefix);
    
    // Faixas de CEP atualizadas para PR e SC
    const cepRanges = {
        'PR': [
            '80000', '81000', '82000', '83000', '84000', '85000', '86000', '87000'
        ],
        'SC': [
            '88000', '89000', '90000'
        ]
    };
    
    // Verifica se o CEP pertence a PR ou SC
    let state = '';
    
    // Para PR: verifica se começa com os 5 primeiros dígitos dentro das faixas
    if (cepRanges.PR.some(prefix => cepPrefix.startsWith(prefix.substring(0, 2)))) {
        state = 'PR';
    }
    // Para SC: verifica se começa com os 5 primeiros dígitos dentro das faixas
    else if (cepRanges.SC.some(prefix => cepPrefix.startsWith(prefix.substring(0, 2)))) {
        state = 'SC';
    }
    
    console.log('Estado detectado:', state);
    
    if (state === 'PR' || state === 'SC') {
        // Calcula frete baseado no valor total
        let subtotal = 0;
        cart.forEach(item => {
            let itemPrice = item.price;
            if (item.bulkDiscount && item.quantity >= item.bulkDiscount.quantity) {
                itemPrice = item.bulkDiscount.price;
            }
            subtotal += itemPrice * item.quantity;
        });
        
        // Frete baseado no estado e valor
        if (subtotal >= 1000) {
            freightValue = 0;
            showCepMessage(`🎉 Frete grátis para ${state}! CEP ${cep} atendido.`, 'success');
        } else {
            // Frete diferenciado por faixa de CEP dentro do estado
            if (state === 'PR') {
                // Região Metropolitana de Curitiba (faixas 80000-83000)
                if (cepPrefix >= '80000' && cepPrefix <= '83000') {
                    freightValue = 40.00;
                    showCepMessage(`🚚 Frete para Curitiba e região: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
                } 
                // Ponta Grossa e região (faixa 84000)
                else if (cepPrefix >= '84000' && cepPrefix <= '84999') {
                    freightValue = 60.00;
                    showCepMessage(`🚚 Frete para Ponta Grossa/PR: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
                }
                // Outras regiões do PR
                else {
                    freightValue = 80.00;
                    showCepMessage(`🚚 Frete para ${state}: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
                }
            } else if (state === 'SC') {
                // Florianópolis e região (faixa 88000)
                if (cepPrefix >= '88000' && cepPrefix <= '88999') {
                    freightValue = 50.00;
                    showCepMessage(`🚚 Frete para Florianópolis/SC: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
                } else {
                    freightValue = 90.00;
                    showCepMessage(`🚚 Frete para ${state}: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
                }
            }
        }
        
        // Atualiza a tela para mostrar que é de Ponta Grossa
        if (cepPrefix >= '84000' && cepPrefix <= '84100') {
            showCepMessage(`📍 Ponta Grossa/PR - Frete: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
        }
    } else {
        freightValue = 0;
        showCepMessage(`❌ Não atendemos este CEP (${cep}). Atendemos apenas Paraná (PR) e Santa Catarina (SC).`, 'error');
    }
    
    updateBudgetSummary();
}

function showCepMessage(message, type = 'info') {
    const cepMessage = document.getElementById('cepMessage');
    if (cepMessage) {
        cepMessage.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${message}`;
        cepMessage.className = `message ${type}`;
    }
}

// ============================================
// SISTEMA DE ORÇAMENTOS
// ============================================

function saveBudget() {
    if (cart.length === 0) {
        showMessage('Adicione itens ao orçamento antes de salvar.', 'error');
        return;
    }
    
    const cepInput = document.getElementById('cep');
    if (!cepInput || !cepInput.value || freightValue === 0) {
        showMessage('Informe um CEP válido para calcular o frete antes de salvar.', 'error');
        return;
    }
    
    if (!currentUser) {
        showMessage('Faça login para salvar seu orçamento.', 'error');
        openLoginModal();
        return;
    }
    
    // Calcula totais
    let subtotal = 0;
    const itemsDetails = [];
    
    cart.forEach(item => {
        let itemPrice = item.price;
        if (item.bulkDiscount && item.quantity >= item.bulkDiscount.quantity) {
            itemPrice = item.bulkDiscount.price;
        }
        
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        itemsDetails.push({
            name: item.name,
            quantity: item.quantity,
            price: itemPrice,
            total: itemTotal
        });
    });
    
    const total = subtotal + freightValue;
    
    // Cria objeto do orçamento
    const budget = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        date: new Date().toLocaleString('pt-BR'),
        items: [...itemsDetails],
        subtotal: subtotal,
        freight: freightValue,
        total: total,
        cep: cepInput.value,
        status: 'Pendente'
    };
    
    // Adiciona à lista de orçamentos
    savedBudgets.push(budget);
    
    // Salva no localStorage
    saveToLocalStorage();
    
    // Atualiza exibição no painel admin
    updateAdminBudgetsList();
    
    showMessage(`Orçamento salvo com sucesso! Total: R$ ${total.toFixed(2).replace('.', ',')}`, 'success');
    
    // Limpa carrinho
    clearBudget();
}

function clearBudget() {
    cart = [];
    freightValue = 0;
    
    const cepInput = document.getElementById('cep');
    const cepMessage = document.getElementById('cepMessage');
    
    if (cepInput) cepInput.value = '';
    if (cepMessage) cepMessage.innerHTML = '';
    
    updateCartDisplay();
    updateBudgetSummary();
    renderBudgetItems();
    
    showMessage('Orçamento limpo com sucesso.', 'success');
}

// ============================================
// ASSISTENTE IA
// ============================================

function getAISuggestions() {
    const eventDescription = document.getElementById('eventDescription').value.trim();
    const suggestionsContainer = document.getElementById('aiSuggestions');
    
    if (!eventDescription) {
        showMessage('Descreva seu evento para receber sugestões.', 'error');
        return;
    }
    
    showMessage('Analisando seu evento e gerando sugestões...', 'info');
    
    // Simulação de processamento por IA
    setTimeout(() => {
        const suggestions = generateAISuggestions(eventDescription);
        renderAISuggestions(suggestions, suggestionsContainer);
        showMessage('Sugestões geradas com sucesso!', 'success');
    }, 1500);
}

function generateAISuggestions(description) {
    const text = description.toLowerCase();
    let suggestions = [];
    
    // Análise de palavras-chave
    if (text.includes('casamento') || text.includes('noivado') || text.includes('bodas')) {
        suggestions.push({
            title: "Para Casamentos",
            icon: "fas fa-ring",
            items: [
                "Cadeira de Madeira Maciça: 1 por convidado (estilo rústico)",
                "Mesa Redonda 1,5m: 1 para cada 8 convidados",
                "Biombo Decorativo: 2-3 unidades para divisórias e fotos",
                "Puff de Couro Sintético: 5-10 unidades para área de descanso"
            ],
            totalGuests: extractNumber(text) || 100,
            note: "Para casamentos, recomendamos móveis elegantes e confortáveis."
        });
    }
    
    if (text.includes('corporativo') || text.includes('empresa') || text.includes('conferência')) {
        suggestions.push({
            title: "Para Eventos Corporativos",
            icon: "fas fa-briefcase",
            items: [
                "Cadeira Dobrável Plástico: 1 por participante (prática e fácil transporte)",
                "Mesa Retangular 2m: Para cabines e estações de trabalho",
                "Sofá de Canto: 1-2 unidades para área de networking",
                "Mesa Redonda 1,5m: Para coffee breaks e reuniões"
            ],
            totalGuests: extractNumber(text) || 50,
            note: "Eventos corporativos exigem mobiliário profissional e funcional."
        });
    }
    
    if (text.includes('aniversário') || text.includes('infantil') || text.includes('criança')) {
        suggestions.push({
            title: "Para Festas Infantis",
            icon: "fas fa-birthday-cake",
            items: [
                "Cadeira Dobrável Plástico: 1-2 por criança (leves e coloridas)",
                "Mesa Redonda 1,5m: Para atividades e lanches",
                "Puff de Couro Sintético: Para área dos pais",
                "Barril de Cerveja Decorativo: Para drinks especiais"
            ],
            totalGuests: extractNumber(text) || 30,
            note: "Cores vibrantes e móveis seguros são ideais para festas infantis."
        });
    }
    
    if (text.includes('externo') || text.includes('jardim') || text.includes('praia') || text.includes('ar livre')) {
        suggestions.push({
            title: "Para Eventos ao Ar Livre",
            icon: "fas fa-umbrella-beach",
            items: [
                "Cadeira Dobrável Plástico: Resistente à umidade",
                "Mesa Redonda 1,5m: Com estrutura estável",
                "Puff de Couro Sintético: Fácil limpeza",
                "Biombo Decorativo: Para criar ambientes"
            ],
            note: "Recomendamos móveis resistentes às condições climáticas."
        });
    }
    
    // Sugestão genérica se não identificou tipo específico
    if (suggestions.length === 0) {
        suggestions.push({
            title: "Sugestões Gerais",
            icon: "fas fa-lightbulb",
            items: [
                "Cadeira de Madeira Maciça: Para eventos formais e elegantes",
                "Cadeira Dobrável Plástico: Para eventos informais e grandes quantidades",
                "Mesa Redonda 1,5m: Ideal para refeições em grupo",
                "Puff de Couro Sintético: Conforto adicional para áreas de descanso"
            ],
            note: "Considere a quantidade de convidados e o estilo do evento."
        });
    }
    
    return suggestions;
}

function extractNumber(text) {
    const match = text.match(/\d+/g);
    return match ? parseInt(match[0]) : null;
}

function renderAISuggestions(suggestions, container) {
    if (!container) return;
    
    let suggestionsHTML = '';
    
    suggestions.forEach(suggestion => {
        suggestionsHTML += `
            <div class="ai-suggestion-item">
                <h4><i class="${suggestion.icon}"></i> ${suggestion.title}</h4>
                <ul>
                    ${suggestion.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                ${suggestion.totalGuests ? `<p><strong>Estimativa para ${suggestion.totalGuests} convidados</strong></p>` : ''}
                ${suggestion.note ? `<p><em>${suggestion.note}</em></p>` : ''}
            </div>
        `;
    });
    
    // Adiciona botão para aplicar sugestões
    suggestionsHTML += `
        <div style="margin-top: 20px; text-align: center;">
            <button id="applySuggestions" class="cta-button">
                <i class="fas fa-magic"></i> Aplicar Sugestões ao Orçamento
            </button>
        </div>
    `;
    
    container.innerHTML = suggestionsHTML;
    
    // Adiciona event listener ao botão
    document.getElementById('applySuggestions').addEventListener('click', function() {
        applyAISuggestions(suggestions);
    });
}

function applyAISuggestions(suggestions) {
    // Limpa carrinho atual
    cart = [];
    
    // Aplica as sugestões da primeira categoria
    const firstSuggestion = suggestions[0];
    
    // Mapeia nomes de produtos para IDs
    const productNameToId = {
        "Cadeira de Madeira Maciça": 1,
        "Mesa Redonda 1,5m": 2,
        "Puff de Couro Sintético": 3,
        "Biombo Decorativo": 4,
        "Cadeira Dobrável Plástico": 5,
        "Mesa Retangular 2m": 6,
        "Sofá de Canto": 7,
        "Barril de Cerveja Decorativo": 8
    };
    
    // Processa cada item sugerido
    let addedItems = 0;
    
    firstSuggestion.items.forEach(itemText => {
        const productName = itemText.split(':')[0].trim();
        const productId = productNameToId[productName];
        
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product && product.stock > 0) {
                // Tenta extrair quantidade do texto
                let quantity = 1;
                const match = itemText.match(/\d+/g);
                if (match) {
                    quantity = parseInt(match[0]);
                }
                
                // Se tem estimativa de convidados, ajusta quantidades
                if (firstSuggestion.totalGuests) {
                    if (productName.includes("Cadeira")) {
                        quantity = Math.ceil(firstSuggestion.totalGuests * 1.1); // 10% a mais
                    } else if (productName.includes("Mesa")) {
                        const guestsPerTable = productName.includes("Redonda") ? 8 : 10;
                        quantity = Math.ceil(firstSuggestion.totalGuests / guestsPerTable);
                    }
                }
                
                // Limita pela quantidade em estoque
                quantity = Math.min(quantity, product.stock);
                
                if (quantity > 0) {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        quantity: quantity,
                        bulkDiscount: product.bulkDiscount
                    });
                    addedItems++;
                }
            }
        }
    });
    
    // Atualiza a interface
    updateCartDisplay();
    updateBudgetSummary();
    renderBudgetItems();
    
    if (addedItems > 0) {
        showMessage(`${addedItems} itens adicionados ao orçamento!`, 'success');
        // Rola até a seção de orçamento
        document.getElementById('budget').scrollIntoView({ behavior: 'smooth' });
    } else {
        showMessage('Nenhum item pôde ser adicionado ao orçamento.', 'warning');
    }
}

// ============================================
// FUNÇÕES DE DETALHES DO PRODUTO
// ============================================

function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let detailsHTML = `
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 1; text-align: center;">
                <i class="${product.image}" style="font-size: 80px; color: var(--primary);"></i>
            </div>
            <div style="flex: 2;">
                <h3>${product.name}</h3>
                <p><strong>Categoria:</strong> ${product.category}</p>
                <p><strong>Preço unitário:</strong> R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <p><strong>Estoque disponível:</strong> ${product.stock} unidades</p>
            </div>
        </div>
    `;
    
    if (product.bulkDiscount) {
        detailsHTML += `
            <div class="message info">
                <i class="fas fa-percentage"></i>
                <strong>Desconto por quantidade:</strong> ${product.bulkDiscount.quantity}+ unidades por R$ ${product.bulkDiscount.price.toFixed(2).replace('.', ',')} cada
            </div>
        `;
    }
    
    detailsHTML += `
        <div class="product-description-full">
            <h4>Descrição</h4>
            <p>${product.description}</p>
        </div>
    `;
    
    // Cria modal de detalhes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Detalhes do Produto</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                ${detailsHTML}
                <div style="text-align: center; margin-top: 30px;">
                    <button class="cta-button add-to-budget-from-modal" data-id="${productId}" style="padding: 12px 30px;">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Orçamento
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners para o modal
    const closeBtn = modal.querySelector('.close-modal');
    const addBtn = modal.querySelector('.add-to-budget-from-modal');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    addBtn.addEventListener('click', function() {
        addToBudget(productId);
        document.body.removeChild(modal);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// ============================================
// PAINEL ADMINISTRATIVO
// ============================================

function openAdminModal() {
    if (!currentUser || !currentUser.isAdmin) {
        showMessage('Acesso restrito. Faça login como administrador.', 'error');
        openLoginModal();
        return;
    }
    
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        adminModal.style.display = 'block';
        updateAdminProductsList();
        updateAdminBudgetsList();
    }
}

function closeAdminModal() {
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
        adminModal.style.display = 'none';
    }
}

function switchAdminTab(tabId) {
    // Atualiza tabs ativas
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });
    
    // Atualiza conteúdo das tabs
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}Tab`) {
            content.classList.add('active');
        }
    });
}

function updateAdminProductsList() {
    const adminProductsList = document.getElementById('adminProductsList');
    if (!adminProductsList) return;
    
    if (products.length === 0) {
        adminProductsList.innerHTML = '<p class="empty-message">Nenhum produto cadastrado.</p>';
        return;
    }
    
    let productsHTML = '';
    
    products.forEach(product => {
        productsHTML += `
            <div class="admin-product" data-id="${product.id}">
                <div class="admin-product-info">
                    <h4>${product.name}</h4>
                    <p>Estoque: ${product.stock} | Preço: R$ ${product.price.toFixed(2).replace('.', ',')} | Categoria: ${product.category}</p>
                    ${product.bulkDiscount ? 
                        `<p><small>Desconto: ${product.bulkDiscount.quantity}+ por R$ ${product.bulkDiscount.price.toFixed(2).replace('.', ',')}</small></p>` : 
                        ''
                    }
                </div>
                <div class="admin-product-actions">
                    <button class="btn-small btn-edit edit-product" data-id="${product.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete delete-product" data-id="${product.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    adminProductsList.innerHTML = productsHTML;
    
    // Adiciona event listeners
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

function addNewProduct() {
    const productId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: productId,
        name: "Novo Produto",
        description: "Descrição do novo produto",
        price: 0.00,
        stock: 0,
        bulkDiscount: null,
        image: "fas fa-box",
        category: "Outros"
    };
    
    products.push(newProduct);
    saveToLocalStorage();
    updateAdminProductsList();
    renderProducts();
    
    showMessage('Produto adicionado. Edite as informações conforme necessário.', 'success');
    
    // Abre a edição do novo produto
    setTimeout(() => editProduct(productId), 300);
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Cria formulário de edição
    const editHTML = `
        <h3>Editar Produto</h3>
        <div class="form-group">
            <label for="editName">Nome do Produto</label>
            <input type="text" id="editName" value="${product.name}" required>
        </div>
        <div class="form-group">
            <label for="editDescription">Descrição</label>
            <textarea id="editDescription" rows="3" required>${product.description}</textarea>
        </div>
        <div class="form-group">
            <label for="editPrice">Preço (R$)</label>
            <input type="number" id="editPrice" step="0.01" min="0" value="${product.price}" required>
        </div>
        <div class="form-group">
            <label for="editStock">Estoque</label>
            <input type="number" id="editStock" min="0" value="${product.stock}" required>
        </div>
        <div class="form-group">
            <label for="editCategory">Categoria</label>
            <select id="editCategory">
                <option value="Cadeiras" ${product.category === 'Cadeiras' ? 'selected' : ''}>Cadeiras</option>
                <option value="Mesas" ${product.category === 'Mesas' ? 'selected' : ''}>Mesas</option>
                <option value="Assentos" ${product.category === 'Assentos' ? 'selected' : ''}>Assentos</option>
                <option value="Decoração" ${product.category === 'Decoração' ? 'selected' : ''}>Decoração</option>
                <option value="Outros" ${product.category === 'Outros' ? 'selected' : ''}>Outros</option>
            </select>
        </div>
        <div class="form-group">
            <label for="editIcon">Ícone</label>
            <select id="editIcon">
                <option value="fas fa-chair" ${product.image === 'fas fa-chair' ? 'selected' : ''}>Cadeira</option>
                <option value="fas fa-table" ${product.image === 'fas fa-table' ? 'selected' : ''}>Mesa</option>
                <option value="fas fa-couch" ${product.image === 'fas fa-couch' ? 'selected' : ''}>Sofá/Puff</option>
                <option value="fas fa-border-none" ${product.image === 'fas fa-border-none' ? 'selected' : ''}>Biombo</option>
                <option value="fas fa-wine-bottle" ${product.image === 'fas fa-wine-bottle' ? 'selected' : ''}>Bar/Decoração</option>
                <option value="fas fa-box" ${product.image === 'fas fa-box' ? 'selected' : ''}>Geral</option>
            </select>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" id="editHasDiscount" ${product.bulkDiscount ? 'checked' : ''}>
                Oferecer desconto por quantidade
            </label>
        </div>
        <div id="discountFields" style="${product.bulkDiscount ? '' : 'display: none;'}">
            <div class="form-group">
                <label for="editDiscountQuantity">Quantidade mínima para desconto</label>
                <input type="number" id="editDiscountQuantity" min="2" value="${product.bulkDiscount ? product.bulkDiscount.quantity : ''}">
            </div>
            <div class="form-group">
                <label for="editDiscountPrice">Preço com desconto (R$)</label>
                <input type="number" id="editDiscountPrice" step="0.01" min="0" value="${product.bulkDiscount ? product.bulkDiscount.price : ''}">
            </div>
        </div>
        <div class="form-actions" style="display: flex; gap: 10px; margin-top: 30px;">
            <button class="cta-button save-product-edit" data-id="${productId}">Salvar Alterações</button>
            <button class="btn-outline cancel-edit">Cancelar</button>
        </div>
    `;
    
    // Cria modal de edição
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Editar Produto #${productId}</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                ${editHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-edit');
    const saveBtn = modal.querySelector('.save-product-edit');
    const discountCheckbox = modal.querySelector('#editHasDiscount');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    cancelBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Mostrar/ocultar campos de desconto
    discountCheckbox.addEventListener('change', function() {
        const discountFields = modal.querySelector('#discountFields');
        discountFields.style.display = this.checked ? 'block' : 'none';
    });
    
    // Salvar edição
    saveBtn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            showMessage('Produto não encontrado.', 'error');
            return;
        }
        
        // Validações
        const name = modal.querySelector('#editName').value.trim();
        const description = modal.querySelector('#editDescription').value.trim();
        const price = parseFloat(modal.querySelector('#editPrice').value);
        const stock = parseInt(modal.querySelector('#editStock').value);
        
        if (!name || !description) {
            showMessage('Nome e descrição são obrigatórios.', 'error');
            return;
        }
        
        if (isNaN(price) || price < 0) {
            showMessage('Preço inválido.', 'error');
            return;
        }
        
        if (isNaN(stock) || stock < 0) {
            showMessage('Estoque inválido.', 'error');
            return;
        }
        
        // Atualiza produto
        products[productIndex].name = name;
        products[productIndex].description = description;
        products[productIndex].price = price;
        products[productIndex].stock = stock;
        products[productIndex].category = modal.querySelector('#editCategory').value;
        products[productIndex].image = modal.querySelector('#editIcon').value;
        
        if (discountCheckbox.checked) {
            const discountQuantity = parseInt(modal.querySelector('#editDiscountQuantity').value);
            const discountPrice = parseFloat(modal.querySelector('#editDiscountPrice').value);
            
            if (discountQuantity && discountPrice && discountQuantity > 1 && discountPrice > 0) {
                products[productIndex].bulkDiscount = {
                    quantity: discountQuantity,
                    price: discountPrice
                };
            } else {
                products[productIndex].bulkDiscount = null;
            }
        } else {
            products[productIndex].bulkDiscount = null;
        }
        
        saveToLocalStorage();
        updateAdminProductsList();
        renderProducts();
        
        document.body.removeChild(modal);
        showMessage('Produto atualizado com sucesso!', 'success');
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
}

function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showMessage('Produto não encontrado.', 'error');
        return;
    }
    
    // Remove do array de produtos
    products.splice(productIndex, 1);
    
    // Remove do carrinho se estiver lá
    cart = cart.filter(item => item.id !== productId);
    
    saveToLocalStorage();
    updateAdminProductsList();
    renderProducts();
    updateCartDisplay();
    updateBudgetSummary();
    
    showMessage('Produto excluído com sucesso!', 'success');
}

function updateAdminBudgetsList() {
    const budgetsList = document.getElementById('budgetsList');
    if (!budgetsList) return;
    
    if (savedBudgets.length === 0) {
        budgetsList.innerHTML = '<p class="empty-message">Nenhum orçamento salvo ainda.</p>';
        return;
    }
    
    let budgetsHTML = '';
    
    // Ordena por data (mais recente primeiro)
    const sortedBudgets = [...savedBudgets].sort((a, b) => b.id - a.id);
    
    sortedBudgets.forEach(budget => {
        // Formata lista de itens
        const itemsList = budget.items.map(item => 
            `${item.quantity}x ${item.name.substring(0, 30)}${item.name.length > 30 ? '...' : ''}`
        ).join(', ');
        
        budgetsHTML += `
            <div class="budget-item">
                <div class="budget-item-header">
                    <div>
                        <span class="budget-item-date">${budget.date}</span>
                        <p><small>Cliente: ${budget.userName}</small></p>
                    </div>
                    <span class="budget-item-total">R$ ${budget.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <p><strong>CEP:</strong> ${budget.cep}</p>
                <p><strong>Itens:</strong> ${itemsList}</p>
                <p><strong>Status:</strong> 
                    <span class="budget-status ${budget.status.toLowerCase()}">${budget.status}</span>
                </p>
                <div class="budget-item-actions">
                    <button class="btn-small view-budget" data-id="${budget.id}">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                    <button class="btn-small delete-budget" data-id="${budget.id}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    });
    
    budgetsList.innerHTML = budgetsHTML;
    
    // Adiciona event listeners
    document.querySelectorAll('.view-budget').forEach(button => {
        button.addEventListener('click', function() {
            const budgetId = parseInt(this.getAttribute('data-id'));
            viewBudgetDetails(budgetId);
        });
    });
    
    document.querySelectorAll('.delete-budget').forEach(button => {
        button.addEventListener('click', function() {
            const budgetId = parseInt(this.getAttribute('data-id'));
            deleteBudget(budgetId);
        });
    });
}

function viewBudgetDetails(budgetId) {
    const budget = savedBudgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    // Cria HTML com detalhes
    let itemsHTML = '';
    budget.items.forEach((item, index) => {
        itemsHTML += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.total.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
    });
    
    const detailsHTML = `
        <h3>Detalhes do Orçamento #${budget.id}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div>
                <p><strong>Data:</strong> ${budget.date}</p>
                <p><strong>Cliente:</strong> ${budget.userName}</p>
                <p><strong>ID do Cliente:</strong> ${budget.userId}</p>
            </div>
            <div>
                <p><strong>CEP:</strong> ${budget.cep}</p>
                <p><strong>Status:</strong> <span class="budget-status ${budget.status.toLowerCase()}">${budget.status}</span></p>
            </div>
        </div>
        
        <h4>Itens do Orçamento</h4>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: var(--light-gray);">
                        <th style="padding: 10px; text-align: left;">#</th>
                        <th style="padding: 10px; text-align: left;">Produto</th>
                        <th style="padding: 10px; text-align: center;">Quantidade</th>
                        <th style="padding: 10px; text-align: right;">Preço Unit.</th>
                        <th style="padding: 10px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        </div>
        
        <div style="text-align: right; font-weight: bold; background-color: var(--light); padding: 20px; border-radius: 8px;">
            <p style="font-size: 1.1rem;">Subtotal: R$ ${budget.subtotal.toFixed(2).replace('.', ',')}</p>
            <p style="font-size: 1.1rem;">Frete: R$ ${budget.freight.toFixed(2).replace('.', ',')}</p>
            <p style="font-size: 1.3rem; color: var(--primary); margin-top: 10px;">Total: R$ ${budget.total.toFixed(2).replace('.', ',')}</p>
        </div>
    `;
    
    // Cria modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>Orçamento #${budget.id}</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                ${detailsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
}

function deleteBudget(budgetId) {
    if (!confirm('Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const budgetIndex = savedBudgets.findIndex(b => b.id === budgetId);
    
    if (budgetIndex === -1) {
        showMessage('Orçamento não encontrado.', 'error');
        return;
    }
    
    savedBudgets.splice(budgetIndex, 1);
    saveToLocalStorage();
    updateAdminBudgetsList();
    showMessage('Orçamento excluído com sucesso!', 'success');
}

function initAdminPanel() {
    const companyNameInput = document.getElementById('companyName');
    if (companyNameInput) {
        companyNameInput.value = companyData.name;
    }
}

function saveSettings() {
    const companyNameInput = document.getElementById('companyName');
    if (!companyNameInput) return;
    
    const newName = companyNameInput.value.trim();
    
    if (!newName) {
        showMessage('O nome da empresa é obrigatório.', 'error', document.getElementById('adminModal'));
        return;
    }
    
    companyData.name = newName;
    saveToLocalStorage();
    
    // Atualiza no cabeçalho
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.textContent = newName.split('-')[0].trim();
    }
    
    showMessage('Configurações salvas com sucesso!', 'success', document.getElementById('adminModal'));
}

// ============================================
// FUNÇÕES DO USUÁRIO (MEUS ORÇAMENTOS E PERFIL)
// ============================================

function showMyBudgets() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    // Filtra orçamentos do usuário atual
    const userBudgets = savedBudgets.filter(budget => budget.userId === currentUser.id);
    
    if (userBudgets.length === 0) {
        showMessage('Você não tem orçamentos salvos.', 'info');
        return;
    }
    
    // Cria modal com orçamentos do usuário
    let budgetsHTML = '<h3>Meus Orçamentos</h3>';
    
    // Ordena por data (mais recente primeiro)
    const sortedBudgets = userBudgets.sort((a, b) => b.id - a.id);
    
    sortedBudgets.forEach(budget => {
        const itemsList = budget.items.map(item => 
            `${item.quantity}x ${item.name.substring(0, 25)}${item.name.length > 25 ? '...' : ''}`
        ).join(', ');
        
        budgetsHTML += `
            <div class="budget-item">
                <div class="budget-item-header">
                    <span class="budget-item-date">${budget.date}</span>
                    <span class="budget-item-total">R$ ${budget.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <p><strong>Itens:</strong> ${itemsList}</p>
                <p><strong>Status:</strong> ${budget.status}</p>
                <div class="budget-item-actions">
                    <button class="btn-small view-my-budget" data-id="${budget.id}">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                </div>
            </div>
        `;
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Meus Orçamentos</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                ${budgetsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Ver detalhes dos orçamentos
    modal.querySelectorAll('.view-my-budget').forEach(button => {
        button.addEventListener('click', function() {
            const budgetId = parseInt(this.getAttribute('data-id'));
            document.body.removeChild(modal);
            viewBudgetDetails(budgetId);
        });
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
}

function showMyProfile() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    const profileHTML = `
        <h3>Meu Perfil</h3>
        <div class="profile-info" style="background-color: var(--light); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Nome:</strong> ${currentUser.name}</p>
            <p><strong>E-mail:</strong> ${currentUser.email}</p>
            <p><strong>Tipo de Conta:</strong> ${currentUser.isAdmin ? 'Administrador' : 'Cliente'}</p>
        </div>
        ${!currentUser.isAdmin ? `
        <div class="profile-actions">
            <button class="btn-secondary" id="changePasswordBtn" style="width: 100%; padding: 12px;">
                <i class="fas fa-key"></i> Alterar Senha
            </button>
        </div>
        ` : ''}
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Meu Perfil</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                ${profileHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    if (!currentUser.isAdmin) {
        const changePasswordBtn = modal.querySelector('#changePasswordBtn');
        changePasswordBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            showChangePasswordModal();
        });
    }
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
}

function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2>Alterar Senha</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="currentPassword">Senha Atual</label>
                    <input type="password" id="currentPassword" placeholder="Digite sua senha atual">
                </div>
                <div class="form-group">
                    <label for="newPassword">Nova Senha</label>
                    <input type="password" id="newPassword" placeholder="Digite a nova senha">
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirmar Nova Senha</label>
                    <input type="password" id="confirmPassword" placeholder="Confirme a nova senha">
                </div>
                <div class="form-actions">
                    <button class="cta-button" id="savePasswordBtn" style="width: 100%; padding: 12px;">
                        <i class="fas fa-save"></i> Salvar Nova Senha
                    </button>
                </div>
                <p id="passwordMessage" style="text-align: center; margin-top: 15px;"></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const saveBtn = modal.querySelector('#savePasswordBtn');
    const passwordMessage = modal.querySelector('#passwordMessage');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    saveBtn.addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validações
        if (!currentPassword || !newPassword || !confirmPassword) {
            passwordMessage.textContent = 'Por favor, preencha todos os campos.';
            passwordMessage.style.color = 'var(--danger)';
            return;
        }
        
        if (newPassword !== confirmPassword) {
            passwordMessage.textContent = 'As senhas não coincidem.';
            passwordMessage.style.color = 'var(--danger)';
            return;
        }
        
        if (newPassword.length < 6) {
            passwordMessage.textContent = 'A nova senha deve ter pelo menos 6 caracteres.';
            passwordMessage.style.color = 'var(--danger)';
            return;
        }
        
        // Encontra usuário
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            passwordMessage.textContent = 'Erro ao encontrar usuário.';
            passwordMessage.style.color = 'var(--danger)';
            return;
        }
        
        // Verifica senha atual
        if (users[userIndex].password !== currentPassword) {
            passwordMessage.textContent = 'Senha atual incorreta.';
            passwordMessage.style.color = 'var(--danger)';
            return;
        }
        
        // Atualiza senha
        users[userIndex].password = newPassword;
        saveToLocalStorage();
        
        document.body.removeChild(modal);
        showMessage('Senha alterada com sucesso!', 'success');
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(modal);
        }
    });
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function showMessage(message, type = 'info', container = null) {
    const messageElement = container ? 
        container.querySelector('.message') || createMessageElement(container) : 
        createTemporaryMessageElement();
    
    messageElement.innerHTML = `<i class="fas fa-${getIconForType(type)}"></i> ${message}`;
    messageElement.className = `message ${type}`;
    
    if (!container) {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}

function getIconForType(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'times-circle';
        case 'warning': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

function createTemporaryMessageElement() {
    const messageElement = document.createElement('div');
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.right = '20px';
    messageElement.style.zIndex = '9999';
    messageElement.style.maxWidth = '400px';
    messageElement.style.minWidth = '300px';
    document.body.appendChild(messageElement);
    
    return messageElement;
}

function createMessageElement(container) {
    const messageElement = document.createElement('div');
    container.appendChild(messageElement);
    return messageElement;
}

// ============================================
// LOCAL STORAGE
// ============================================

function saveToLocalStorage() {
    try {
        const data = {
            products: products,
            users: users,
            savedBudgets: savedBudgets,
            companyData: companyData
        };
        
        localStorage.setItem('mobilierData', JSON.stringify(data));
        console.log('Dados salvos no localStorage');
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
        showMessage('Erro ao salvar dados. Tente novamente.', 'error');
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('mobilierData');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            
            if (data.products) products = data.products;
            if (data.users) users = data.users;
            if (data.savedBudgets) savedBudgets = data.savedBudgets;
            if (data.companyData) Object.assign(companyData, data.companyData);
            
            console.log('Dados carregados do localStorage');
        }
    } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
        showMessage('Erro ao carregar dados. Algumas informações podem estar indisponíveis.', 'warning');
    }
}

// ============================================
// INICIALIZAÇÃO FINAL
// ============================================

// Adiciona estilos CSS dinâmicos
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .budget-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .budget-status.pendente {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .budget-status.aprovado {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .budget-status.cancelado {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .product-description-full {
            background-color: var(--light);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .product-description-full h4 {
            color: var(--primary);
            margin-bottom: 10px;
        }
        
        .product-description-full p {
            line-height: 1.6;
            color: var(--gray);
        }
    </style>
`);

// Adiciona tratamento de erros global
window.addEventListener('error', function(e) {
    console.error('Erro global:', e.error);
    showMessage('Ocorreu um erro inesperado. Por favor, recarregue a página.', 'error');
});

// Adiciona função para exportar dados (para debug)
window.exportData = function() {
    const data = {
        products: products,
        users: users,
        savedBudgets: savedBudgets,
        companyData: companyData,
        cart: cart,
        currentUser: currentUser
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mobilier-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showMessage('Dados exportados com sucesso!', 'success');
};

// Adiciona função para importar dados (para debug)
window.importData = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Esta ação substituirá todos os dados atuais. Continuar?')) {
                    products = data.products || products;
                    users = data.users || users;
                    savedBudgets = data.savedBudgets || savedBudgets;
                    Object.assign(companyData, data.companyData || {});
                    
                    saveToLocalStorage();
                    location.reload();
                }
            } catch (error) {
                showMessage('Erro ao importar dados. Verifique o arquivo.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

console.log('Sistema Mobiliér carregado com sucesso!');