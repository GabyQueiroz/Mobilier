// ============================================
// DADOS DO SISTEMA
// ============================================

const companyData = {
    name: "Mobilier - Mobiliário para Eventos",
    instagram: "@mobilier_mobiliario",
    phone: "(41) 99999-9999",
    email: "contato@mobilier.com.br",
    deliveryStates: ["PR", "SC"]
};

let products = [
    {
        id: 1,
        name: "Cadeira de Madeira Maciça",
        description: "Cadeira rústica em madeira maciça, ideal para casamentos e eventos rurais.",
        price: 15.00,
        stock: 250,
        bulkDiscount: { quantity: 200, price: 14.00 },
        image: "fas fa-chair",
        category: "Cadeiras"
    },
    {
        id: 2,
        name: "Mesa Redonda 1,5m",
        description: "Mesa redonda para 8 pessoas, estrutura em metal e tampo de MDF.",
        price: 120.00,
        stock: 50,
        bulkDiscount: { quantity: 10, price: 110.00 },
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
        name: "Cadeira Dobrável Plástico",
        description: "Cadeira dobrável em plástico resistente, fácil transporte e armazenamento.",
        price: 12.00,
        stock: 300,
        bulkDiscount: { quantity: 100, price: 10.50 },
        image: "fas fa-chair",
        category: "Cadeiras"
    },
    {
        id: 6,
        name: "Mesa Retangular 2m",
        description: "Mesa retangular para banquetes e eventos corporativos.",
        price: 150.00,
        stock: 30,
        bulkDiscount: { quantity: 5, price: 140.00 },
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

let cart = [];
let freightValue = 0;
let users = [];
let currentUser = null;
let savedBudgets = [];

const ADMIN_CREDENTIALS = {
    email: "admin@mobilier.com.br",
    password: "admin123",
    name: "Administrador",
    isAdmin: true
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema Mobilier iniciando...');
    
    loadFromLocalStorage();
    initializeUsers();
    initUI();
    setupEventListeners();
    
    console.log('Sistema pronto!');
});

function initUI() {
    renderProducts();
    renderBudgetItems();
    updateCartDisplay();
    updateBudgetSummary();
    updateUserState();
}

function setupEventListeners() {
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            this.innerHTML = navMenu.classList.contains('show') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }
    
    // User menu
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (currentUser) {
                showUserMenu();
            } else {
                openLoginModal();
            }
        });
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', function() {
        closeUserMenu();
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) navMenu.classList.remove('show');
    });
    
    // Login modal
    document.querySelector('.close-login-modal')?.addEventListener('click', closeLoginModal);
    document.getElementById('loginButton')?.addEventListener('click', handleLogin);
    document.getElementById('registerButton')?.addEventListener('click', handleRegister);
    
    // CEP
    document.getElementById('checkCep')?.addEventListener('click', checkCep);
    document.getElementById('saveBudget')?.addEventListener('click', saveBudget);
    document.getElementById('clearBudget')?.addEventListener('click', clearBudget);
    
    // AI Assistant
    document.getElementById('aiSuggest')?.addEventListener('click', getAISuggestions);
    
    // Admin modal
    document.querySelector('.close-modal')?.addEventListener('click', closeAdminModal);
    
    // Admin tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchAdminTab(this.getAttribute('data-tab'));
        });
    });
    
    // Admin buttons
    document.getElementById('addProduct')?.addEventListener('click', addNewProduct);
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    
    // CEP formatting
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
        
        cepInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkCep();
            }
        });
    }
}

// ============================================
// SISTEMA DE USUÁRIOS
// ============================================

function initializeUsers() {
    if (users.length === 0) {
        users.push({
            id: 1,
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
            name: ADMIN_CREDENTIALS.name,
            isAdmin: true,
            createdAt: new Date().toISOString()
        });
        saveToLocalStorage();
    }
    
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            sessionStorage.removeItem('currentUser');
        }
    }
}

function showUserMenu() {
    // Remove existing menu
    const existingMenu = document.querySelector('.user-dropdown');
    if (existingMenu) existingMenu.remove();
    
    // Create new menu
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown active';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.right = '0';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    dropdown.style.borderRadius = '10px';
    dropdown.style.minWidth = '200px';
    dropdown.style.zIndex = '1000';
    dropdown.style.overflow = 'hidden';
    
    let menuHTML = '<ul style="list-style: none; padding: 0; margin: 0;">';
    
    if (currentUser) {
        if (currentUser.isAdmin) {
            menuHTML += `
                <li>
                    <a href="#" id="adminLink" style="display: flex; align-items: center; gap: 10px; padding: 15px 20px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                        <i class="fas fa-tools"></i> Painel Admin
                    </a>
                </li>
                <li style="background: #f5f5f5; height: 1px; margin: 0;"></li>
            `;
        }
        
        menuHTML += `
            <li>
                <a href="#" id="myBudgetsLink" style="display: flex; align-items: center; gap: 10px; padding: 15px 20px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                    <i class="fas fa-file-invoice-dollar"></i> Meus Orçamentos
                </a>
            </li>
            <li>
                <a href="#" id="myProfileLink" style="display: flex; align-items: center; gap: 10px; padding: 15px 20px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                    <i class="fas fa-user-cog"></i> Meu Perfil
                </a>
            </li>
            <li style="background: #f5f5f5; height: 1px; margin: 0;"></li>
            <li>
                <button id="logoutButton" style="display: flex; align-items: center; gap: 10px; padding: 15px 20px; width: 100%; border: none; background: none; cursor: pointer; color: #333; text-align: left;">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </li>
        `;
    }
    
    menuHTML += '</ul>';
    dropdown.innerHTML = menuHTML;
    
    // Add to DOM
    document.querySelector('.user-menu').appendChild(dropdown);
    
    // Add event listeners
    setTimeout(() => {
        document.getElementById('myBudgetsLink')?.addEventListener('click', function(e) {
            e.preventDefault();
            closeUserMenu();
            showMyBudgets();
        });
        
        document.getElementById('myProfileLink')?.addEventListener('click', function(e) {
            e.preventDefault();
            closeUserMenu();
            showMyProfile();
        });
        
        document.getElementById('adminLink')?.addEventListener('click', function(e) {
            e.preventDefault();
            closeUserMenu();
            openAdminModal();
        });
        
        document.getElementById('logoutButton')?.addEventListener('click', function() {
            logout();
            closeUserMenu();
        });
    }, 10);
}

function closeUserMenu() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) dropdown.remove();
}

function updateUserState() {
    const userNameSpan = document.getElementById('userName');
    const userMenuBtn = document.querySelector('.user-menu-btn i');
    
    if (userNameSpan && userMenuBtn) {
        if (currentUser) {
            let userNameText = currentUser.name;
            if (currentUser.isAdmin) {
                userNameText += ' <span class="admin-badge">ADMIN</span>';
            }
            userNameSpan.innerHTML = userNameText;
            userMenuBtn.className = 'fas fa-user-check';
        } else {
            userNameSpan.textContent = 'Entrar';
            userMenuBtn.className = 'fas fa-user';
        }
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showLoginMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Check admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentUser = {
            id: 0,
            email: ADMIN_CREDENTIALS.email,
            name: ADMIN_CREDENTIALS.name,
            isAdmin: true
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeLoginModal();
        updateUserState();
        showMessage('Login como administrador realizado!', 'success');
        return;
    }
    
    // Check regular users
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeLoginModal();
        updateUserState();
        showMessage(`Bem-vindo(a), ${user.name}!`, 'success');
    } else {
        showLoginMessage('E-mail ou senha incorretos.', 'error');
    }
}

function handleRegister() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showLoginMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showLoginMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showLoginMessage('Este e-mail já está cadastrado.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showLoginMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
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
    
    currentUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isAdmin: false
    };
    
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

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
    }
}

// ============================================
// MODAIS
// ============================================

function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginMessage').textContent = '';
    }
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
}

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
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });
    
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}Tab`);
    });
}

// ============================================
// MEUS ORÇAMENTOS - CORRIGIDO
// ============================================

function showMyBudgets() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    const userBudgets = savedBudgets.filter(budget => budget.userId === currentUser.id);
    
    if (userBudgets.length === 0) {
        showMessage('Você não tem orçamentos salvos.', 'info');
        return;
    }
    
    // Criar modal específico para orçamentos
    createBudgetModal(userBudgets, 'Meus Orçamentos');
}

function createBudgetModal(budgets, title) {
    // Remove existing modal if any
    const existingModal = document.getElementById('budgetsModal');
    if (existingModal) existingModal.remove();
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'budgetsModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    // Create modal content
    let modalHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="close-budgets-modal" style="font-size: 28px; cursor: pointer; color: white;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 20px;">
    `;
    
    // Sort budgets by date (newest first)
    const sortedBudgets = budgets.sort((a, b) => b.id - a.id);
    
    if (sortedBudgets.length === 0) {
        modalHTML += '<p class="empty-message">Nenhum orçamento encontrado.</p>';
    } else {
        sortedBudgets.forEach(budget => {
            const itemsList = budget.items.map(item => 
                `${item.quantity}x ${item.name.substring(0, 30)}${item.name.length > 30 ? '...' : ''}`
            ).join(', ');
            
            modalHTML += `
                <div class="budget-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div>
                            <span style="color: #666; font-size: 0.9em;">${budget.date}</span>
                            ${budget.userName && budget.userName !== currentUser?.name ? `<p style="margin: 5px 0 0 0; font-size: 0.9em; color: #888;">Cliente: ${budget.userName}</p>` : ''}
                            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #888;">Itens: ${itemsList}</p>
                            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #888;">CEP: ${budget.cep}</p>
                        </div>
                        <span style="font-weight: bold; color: #d4af37; font-size: 1.2em;">R$ ${budget.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn-small view-budget-details" data-id="${budget.id}" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn-small duplicate-budget-btn" data-id="${budget.id}" style="padding: 8px 15px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-copy"></i> Reutilizar
                        </button>
                        ${currentUser?.isAdmin ? `
                        <button class="btn-small delete-budget-btn" data-id="${budget.id}" style="padding: 8px 15px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    modalHTML += `
            </div>
        </div>
    `;
    
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    // Add event listeners
    setTimeout(() => {
        // Close button
        document.querySelector('.close-budgets-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        // View details buttons
        document.querySelectorAll('.view-budget-details').forEach(button => {
            button.addEventListener('click', function() {
                const budgetId = parseInt(this.getAttribute('data-id'));
                modal.remove();
                showBudgetDetails(budgetId);
            });
        });
        
        // Duplicate buttons
        document.querySelectorAll('.duplicate-budget-btn').forEach(button => {
            button.addEventListener('click', function() {
                const budgetId = parseInt(this.getAttribute('data-id'));
                modal.remove();
                duplicateBudget(budgetId);
            });
        });
        
        // Delete buttons (admin only)
        document.querySelectorAll('.delete-budget-btn').forEach(button => {
            button.addEventListener('click', function() {
                const budgetId = parseInt(this.getAttribute('data-id'));
                if (confirm('Tem certeza que deseja excluir este orçamento?')) {
                    deleteBudget(budgetId);
                    modal.remove();
                }
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
            }
        });
        
        // Close with ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }, 10);
}

function showBudgetDetails(budgetId) {
    const budget = savedBudgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    let itemsHTML = '';
    budget.items.forEach((item, index) => {
        itemsHTML += `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.total.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
    });
    
    const detailsHTML = `
        <div style="max-height: 60vh; overflow-y: auto;">
            <h3>Detalhes do Orçamento #${budget.id}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                <div>
                    <p><strong>Data:</strong> ${budget.date}</p>
                    <p><strong>Cliente:</strong> ${budget.userName}</p>
                    <p><strong>ID do Cliente:</strong> ${budget.userId}</p>
                </div>
                <div>
                    <p><strong>CEP:</strong> ${budget.cep}</p>
                    <p><strong>Status:</strong> <span style="padding: 4px 12px; background: #fff3cd; color: #856404; border-radius: 20px;">${budget.status}</span></p>
                </div>
            </div>
            
            <h4>Itens do Orçamento</h4>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
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
            
            <div style="text-align: right; font-weight: bold; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                <p style="font-size: 1.1rem;">Subtotal: R$ ${budget.subtotal.toFixed(2).replace('.', ',')}</p>
                <p style="font-size: 1.1rem;">Frete: R$ ${budget.freight.toFixed(2).replace('.', ',')}</p>
                <p style="font-size: 1.3rem; color: #1a365d; margin-top: 10px;">Total: R$ ${budget.total.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <button class="cta-button duplicate-from-details" data-id="${budget.id}" style="padding: 12px 30px; margin-right: 10px;">
                <i class="fas fa-copy"></i> Reutilizar
            </button>
            <button class="btn-outline close-details" style="padding: 12px 30px;">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;
    
    // Create modal for details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h2>Orçamento #${budget.id}</h2>
                <span class="close-details-modal" style="font-size: 28px; cursor: pointer; color: white;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 20px;">
                ${detailsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setTimeout(() => {
        // Close buttons
        document.querySelector('.close-details-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        document.querySelector('.close-details').addEventListener('click', function() {
            modal.remove();
        });
        
        // Duplicate button
        document.querySelector('.duplicate-from-details').addEventListener('click', function() {
            const budgetId = parseInt(this.getAttribute('data-id'));
            modal.remove();
            duplicateBudget(budgetId);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
            }
        });
        
        // Close with ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }, 10);
}

function duplicateBudget(budgetId) {
    const budget = savedBudgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    // Clear current cart
    cart = [];
    
    // Add items from budget
    budget.items.forEach(budgetItem => {
        const product = products.find(p => p.name === budgetItem.name);
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: budgetItem.quantity,
                bulkDiscount: product.bulkDiscount
            });
        }
    });
    
    // Update interface
    updateCartDisplay();
    updateBudgetSummary();
    renderBudgetItems();
    
    // Fill CEP
    const cepInput = document.getElementById('cep');
    if (cepInput && budget.cep) {
        cepInput.value = budget.cep;
    }
    
    showMessage('Orçamento reutilizado com sucesso!', 'success');
    
    // Scroll to budget section
    document.getElementById('budget').scrollIntoView({ behavior: 'smooth' });
}

function deleteBudget(budgetId) {
    const budgetIndex = savedBudgets.findIndex(b => b.id === budgetId);
    
    if (budgetIndex === -1) {
        showMessage('Orçamento não encontrado.', 'error');
        return;
    }
    
    savedBudgets.splice(budgetIndex, 1);
    saveToLocalStorage();
    
    if (currentUser?.isAdmin) {
        updateAdminBudgetsList();
    }
    
    showMessage('Orçamento excluído com sucesso!', 'success');
}

// ============================================
// MEU PERFIL
// ============================================

function showMyProfile() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    const profileHTML = `
        <h3>Meu Perfil</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${currentUser.name}</p>
            <p><strong>E-mail:</strong> ${currentUser.email}</p>
            <p><strong>Tipo de Conta:</strong> ${currentUser.isAdmin ? 'Administrador' : 'Cliente'}</p>
        </div>
        ${!currentUser.isAdmin ? `
        <div style="text-align: center; margin: 30px 0;">
            <button id="changePasswordBtn" class="cta-button" style="padding: 12px 30px;">
                <i class="fas fa-key"></i> Alterar Senha
            </button>
        </div>
        ` : ''}
        <div style="text-align: center;">
            <button class="btn-outline close-profile" style="padding: 12px 30px;">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;
    
    // Create modal for profile
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Meu Perfil</h2>
                <span class="close-profile-modal" style="font-size: 28px; cursor: pointer; color: white;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 20px;">
                ${profileHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setTimeout(() => {
        // Close buttons
        document.querySelector('.close-profile-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        document.querySelector('.close-profile').addEventListener('click', function() {
            modal.remove();
        });
        
        // Change password button
        if (!currentUser.isAdmin) {
            document.getElementById('changePasswordBtn').addEventListener('click', function() {
                modal.remove();
                showChangePasswordModal();
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
            }
        });
        
        // Close with ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }, 10);
}

function showChangePasswordModal() {
    const modalHTML = `
        <h3>Alterar Senha</h3>
        <div style="margin: 20px 0;">
            <div class="form-group">
                <label for="currentPassword">Senha Atual</label>
                <input type="password" id="currentPassword" placeholder="Digite sua senha atual" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px;">
            </div>
            <div class="form-group">
                <label for="newPassword">Nova Senha</label>
                <input type="password" id="newPassword" placeholder="Digite a nova senha" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px;">
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirmar Nova Senha</label>
                <input type="password" id="confirmPassword" placeholder="Confirme a nova senha" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px;">
            </div>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <button id="savePasswordBtn" class="cta-button" style="padding: 12px 30px; margin-right: 10px;">
                <i class="fas fa-save"></i> Salvar
            </button>
            <button class="btn-outline cancel-password" style="padding: 12px 30px;">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
        <p id="passwordMessage" style="text-align: center; color: #e74c3c; margin-top: 15px;"></p>
    `;
    
    // Create modal for password change
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Alterar Senha</h2>
                <span class="close-password-modal" style="font-size: 28px; cursor: pointer; color: white;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 20px;">
                ${modalHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setTimeout(() => {
        // Close buttons
        document.querySelector('.close-password-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        document.querySelector('.cancel-password').addEventListener('click', function() {
            modal.remove();
        });
        
        // Save button
        document.getElementById('savePasswordBtn').addEventListener('click', function() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const passwordMessage = document.getElementById('passwordMessage');
            
            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                passwordMessage.textContent = 'Por favor, preencha todos os campos.';
                return;
            }
            
            if (newPassword !== confirmPassword) {
                passwordMessage.textContent = 'As senhas não coincidem.';
                return;
            }
            
            if (newPassword.length < 6) {
                passwordMessage.textContent = 'A senha deve ter pelo menos 6 caracteres.';
                return;
            }
            
            // Find user
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex === -1) {
                passwordMessage.textContent = 'Erro ao encontrar usuário.';
                return;
            }
            
            // Check current password
            if (users[userIndex].password !== currentPassword) {
                passwordMessage.textContent = 'Senha atual incorreta.';
                return;
            }
            
            // Update password
            users[userIndex].password = newPassword;
            saveToLocalStorage();
            
            modal.remove();
            showMessage('Senha alterada com sucesso!', 'success');
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
            }
        });
        
        // Close with ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }, 10);
}

// ============================================
// SISTEMA DE PRODUTOS E ORÇAMENTO
// ============================================

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const stockClass = product.stock === 0 ? 'out' : product.stock < 20 ? 'low' : 'available';
        const stockText = product.stock === 0 ? 'Esgotado' : 
                         product.stock < 20 ? `${product.stock} unidades (estoque baixo)` : 
                         `${product.stock} unidades disponíveis`;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')} cada</p>
                <p class="product-stock ${stockClass}">
                    <i class="fas fa-${stockClass === 'available' ? 'check' : stockClass === 'low' ? 'exclamation' : 'times'}-circle"></i> ${stockText}
                </p>
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
    
    // Add event listeners
    document.querySelectorAll('.add-to-budget').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToBudget(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const detailsHTML = `
        <h3>${product.name}</h3>
        <div style="display: flex; gap: 20px; margin: 20px 0;">
            <div style="flex: 1; text-align: center;">
                <i class="${product.image}" style="font-size: 80px; color: #1a365d;"></i>
            </div>
            <div style="flex: 2;">
                <p><strong>Categoria:</strong> ${product.category}</p>
                <p><strong>Preço:</strong> R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <p><strong>Estoque:</strong> ${product.stock} unidades</p>
                ${product.bulkDiscount ? `
                    <p><strong>Desconto:</strong> ${product.bulkDiscount.quantity}+ unidades por R$ ${product.bulkDiscount.price.toFixed(2).replace('.', ',')} cada</p>
                ` : ''}
            </div>
        </div>
        <p><strong>Descrição:</strong> ${product.description}</p>
        <div style="text-align: center; margin-top: 30px;">
            <button class="cta-button add-from-details" data-id="${product.id}" style="padding: 12px 30px;">
                <i class="fas fa-cart-plus"></i> Adicionar ao Orçamento
            </button>
        </div>
    `;
    
    // Create modal for product details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Detalhes do Produto</h2>
                <span class="close-product-modal" style="font-size: 28px; cursor: pointer; color: white;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 20px;">
                ${detailsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setTimeout(() => {
        document.querySelector('.close-product-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        document.querySelector('.add-from-details').addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToBudget(productId);
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
            }
        });
    }, 10);
}

function addToBudget(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock === 0) {
        showMessage('Este produto está esgotado.', 'error');
        return;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity += 1;
        } else {
            showMessage(`Estoque insuficiente. Máximo: ${product.stock} unidades.`, 'error');
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
    
    // Add event listeners
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
                showMessage(`Estoque insuficiente. Máximo: ${product.stock} unidades.`, 'error');
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
// CEP E FRETE
// ============================================

function checkCep() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;
    
    let cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showCepMessage('CEP inválido. Digite um CEP com 8 dígitos.', 'error');
        freightValue = 0;
        updateBudgetSummary();
        return;
    }
    
    cep = cep.substring(0, 5) + '-' + cep.substring(5);
    cepInput.value = cep;
    
    showCepMessage('Consultando CEP...', 'info');
    
    setTimeout(() => {
        simulateCepCheck(cep);
    }, 800);
}

function simulateCepCheck(cep) {
    const cepNumbers = cep.replace(/\D/g, '');
    const cepFirstTwo = cepNumbers.substring(0, 2);
    
    let state = '';
    if (cepFirstTwo >= '80' && cepFirstTwo <= '87') {
        state = 'PR';
    } else if (cepFirstTwo >= '88' && cepFirstTwo <= '90') {
        state = 'SC';
    }
    
    if (state === 'PR' || state === 'SC') {
        let subtotal = 0;
        cart.forEach(item => {
            let itemPrice = item.price;
            if (item.bulkDiscount && item.quantity >= item.bulkDiscount.quantity) {
                itemPrice = item.bulkDiscount.price;
            }
            subtotal += itemPrice * item.quantity;
        });
        
        if (subtotal >= 1000) {
            freightValue = 0;
            showCepMessage(`Frete grátis para ${state}! CEP ${cep} atendido.`, 'success');
        } else {
            freightValue = state === 'PR' ? 80.00 : 90.00;
            showCepMessage(`Frete para ${state}: R$ ${freightValue.toFixed(2).replace('.', ',')}. CEP ${cep} atendido.`, 'success');
        }
    } else {
        freightValue = 0;
        showCepMessage(`Não atendemos este CEP (${cep}). Atendemos apenas PR e SC.`, 'error');
    }
    
    updateBudgetSummary();
}

function showCepMessage(message, type) {
    const cepMessage = document.getElementById('cepMessage');
    if (!cepMessage) return;
    
    let icon = '';
    switch(type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'times-circle'; break;
        case 'warning': icon = 'exclamation-circle'; break;
        default: icon = 'info-circle';
    }
    
    cepMessage.innerHTML = `<i class="fas fa-${icon} message-icon"></i><div class="message-text">${message}</div>`;
    cepMessage.className = type;
}

// ============================================
// SALVAR ORÇAMENTO
// ============================================

function saveBudget() {
    if (cart.length === 0) {
        showMessage('Adicione itens ao orçamento antes de salvar.', 'error');
        return;
    }
    
    const cepInput = document.getElementById('cep');
    if (!cepInput || !cepInput.value || freightValue === 0) {
        showMessage('Informe um CEP válido para calcular o frete.', 'error');
        return;
    }
    
    if (!currentUser) {
        showMessage('Faça login para salvar seu orçamento.', 'error');
        openLoginModal();
        return;
    }
    
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
    
    const budget = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        date: new Date().toLocaleString('pt-BR'),
        items: itemsDetails,
        subtotal: subtotal,
        freight: freightValue,
        total: total,
        cep: cepInput.value,
        status: 'Pendente'
    };
    
    savedBudgets.push(budget);
    saveToLocalStorage();
    
    if (currentUser.isAdmin) {
        updateAdminBudgetsList();
    }
    
    showMessage(`Orçamento salvo! Total: R$ ${total.toFixed(2).replace('.', ',')}`, 'success');
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
    
    showMessage('Analisando seu evento...', 'info');
    
    setTimeout(() => {
        const suggestions = generateAISuggestions(eventDescription);
        renderAISuggestions(suggestions, suggestionsContainer);
        showMessage('Sugestões geradas!', 'success');
    }, 1500);
}

function generateAISuggestions(description) {
    const text = description.toLowerCase();
    let suggestions = [];
    
    if (text.includes('casamento') || text.includes('noivado')) {
        suggestions.push({
            title: "Para Casamentos",
            icon: "fas fa-ring",
            items: [
                "Cadeira de Madeira Maciça: 1 por convidado",
                "Mesa Redonda 1,5m: 1 para cada 8 convidados",
                "Biombo Decorativo: 2-3 unidades para fotos",
                "Puff de Couro Sintético: 5-10 unidades para área de descanso"
            ],
            totalGuests: extractNumber(text) || 100,
            note: "Para casamentos, recomendamos móveis elegantes."
        });
    }
    
    if (text.includes('corporativo') || text.includes('empresa')) {
        suggestions.push({
            title: "Para Eventos Corporativos",
            icon: "fas fa-briefcase",
            items: [
                "Cadeira Dobrável Plástico: 1 por participante",
                "Mesa Retangular 2m: Para cabines de trabalho",
                "Sofá de Canto: 1-2 unidades para networking",
                "Mesa Redonda 1,5m: Para coffee breaks"
            ],
            totalGuests: extractNumber(text) || 50,
            note: "Eventos corporativos exigem mobiliário profissional."
        });
    }
    
    if (suggestions.length === 0) {
        suggestions.push({
            title: "Sugestões Gerais",
            icon: "fas fa-lightbulb",
            items: [
                "Cadeira de Madeira Maciça: Para eventos formais",
                "Cadeira Dobrável Plástico: Para grandes quantidades",
                "Mesa Redonda 1,5m: Ideal para refeições",
                "Puff de Couro Sintético: Conforto adicional"
            ],
            note: "Considere a quantidade de convidados."
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
    
    suggestionsHTML += `
        <div style="text-align: center; margin-top: 20px;">
            <button id="applySuggestions" class="cta-button">
                <i class="fas fa-magic"></i> Aplicar Sugestões
            </button>
        </div>
    `;
    
    container.innerHTML = suggestionsHTML;
    
    document.getElementById('applySuggestions').addEventListener('click', function() {
        applyAISuggestions(suggestions);
    });
}

function applyAISuggestions(suggestions) {
    cart = [];
    
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
    
    let addedItems = 0;
    
    suggestions[0].items.forEach(itemText => {
        const productName = itemText.split(':')[0].trim();
        const productId = productNameToId[productName];
        
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product && product.stock > 0) {
                let quantity = 1;
                const match = itemText.match(/\d+/g);
                if (match) {
                    quantity = parseInt(match[0]);
                }
                
                if (suggestions[0].totalGuests) {
                    if (productName.includes("Cadeira")) {
                        quantity = Math.ceil(suggestions[0].totalGuests * 1.1);
                    } else if (productName.includes("Mesa")) {
                        const guestsPerTable = productName.includes("Redonda") ? 8 : 10;
                        quantity = Math.ceil(suggestions[0].totalGuests / guestsPerTable);
                    }
                }
                
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
    
    updateCartDisplay();
    updateBudgetSummary();
    renderBudgetItems();
    
    if (addedItems > 0) {
        showMessage(`${addedItems} itens adicionados!`, 'success');
        document.getElementById('budget').scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// PAINEL ADMIN
// ============================================

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
            <div class="admin-product">
                <div class="admin-product-info">
                    <h4>${product.name}</h4>
                    <p>Estoque: ${product.stock} | Preço: R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    ${product.bulkDiscount ? 
                        `<p><small>Desconto: ${product.bulkDiscount.quantity}+ por R$ ${product.bulkDiscount.price.toFixed(2).replace('.', ',')}</small></p>` : 
                        ''
                    }
                </div>
                <div class="admin-product-actions">
                    <button class="btn-small btn-edit edit-product-admin" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete delete-product-admin" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    adminProductsList.innerHTML = productsHTML;
    
    document.querySelectorAll('.edit-product-admin').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProductAdmin(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-admin').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProductAdmin(productId);
        });
    });
}

function updateAdminBudgetsList() {
    const budgetsList = document.getElementById('budgetsList');
    if (!budgetsList) return;
    
    if (savedBudgets.length === 0) {
        budgetsList.innerHTML = '<p class="empty-message">Nenhum orçamento salvo.</p>';
        return;
    }
    
    let budgetsHTML = '<h3>Todos os Orçamentos</h3>';
    const sortedBudgets = [...savedBudgets].sort((a, b) => b.id - a.id);
    
    sortedBudgets.forEach(budget => {
        const itemsList = budget.items.map(item => 
            `${item.quantity}x ${item.name.substring(0, 30)}${item.name.length > 30 ? '...' : ''}`
        ).join(', ');
        
        budgetsHTML += `
            <div class="budget-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <p style="margin: 0 0 5px 0; font-size: 0.9em; color: #666;">${budget.date}</p>
                        <p style="margin: 0 0 5px 0; font-size: 0.9em;"><strong>Cliente:</strong> ${budget.userName}</p>
                        <p style="margin: 0 0 5px 0; font-size: 0.9em;"><strong>Itens:</strong> ${itemsList}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0 0 5px 0; font-weight: bold; color: #d4af37;">R$ ${budget.total.toFixed(2).replace('.', ',')}</p>
                        <p style="margin: 0; font-size: 0.9em;">${budget.status}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="btn-small view-budget-admin" data-id="${budget.id}" style="padding: 5px 10px; font-size: 0.9em;">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-small delete-budget-admin" data-id="${budget.id}" style="padding: 5px 10px; font-size: 0.9em; background: #e74c3c;">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    });
    
    budgetsList.innerHTML = budgetsHTML;
    
    document.querySelectorAll('.view-budget-admin').forEach(button => {
        button.addEventListener('click', function() {
            const budgetId = parseInt(this.getAttribute('data-id'));
            closeAdminModal();
            setTimeout(() => showBudgetDetails(budgetId), 300);
        });
    });
    
    document.querySelectorAll('.delete-budget-admin').forEach(button => {
        button.addEventListener('click', function() {
            const budgetId = parseInt(this.getAttribute('data-id'));
            if (confirm('Excluir este orçamento?')) {
                deleteBudget(budgetId);
                updateAdminBudgetsList();
            }
        });
    });
}

function addNewProduct() {
    const productId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: productId,
        name: "Novo Produto",
        description: "Descrição do produto",
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
    
    showMessage('Produto adicionado. Edite as informações.', 'success');
}

function editProductAdmin(productId) {
    // Implementar edição de produto
    showMessage('Funcionalidade de edição em desenvolvimento.', 'info');
}

function deleteProductAdmin(productId) {
    if (!confirm('Excluir este produto?')) return;
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    products.splice(productIndex, 1);
    cart = cart.filter(item => item.id !== productId);
    
    saveToLocalStorage();
    updateAdminProductsList();
    renderProducts();
    updateCartDisplay();
    updateBudgetSummary();
    
    showMessage('Produto excluído!', 'success');
}

function saveSettings() {
    const companyNameInput = document.getElementById('companyName');
    if (!companyNameInput) return;
    
    const newName = companyNameInput.value.trim();
    if (!newName) {
        showMessage('Nome da empresa é obrigatório.', 'error');
        return;
    }
    
    companyData.name = newName;
    saveToLocalStorage();
    
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.textContent = newName.split('-')[0].trim();
    }
    
    showMessage('Configurações salvas!', 'success');
}

// ============================================
// UTILITÁRIOS
// ============================================

function showMessage(message, type = 'info') {
    showCepMessage(message, type);
    
    if (type === 'success') {
        setTimeout(() => {
            const cepMessage = document.getElementById('cepMessage');
            if (cepMessage) {
                cepMessage.innerHTML = '';
                cepMessage.className = '';
            }
        }, 5000);
    }
}

function saveToLocalStorage() {
    try {
        const data = {
            products: products,
            users: users,
            savedBudgets: savedBudgets,
            companyData: companyData
        };
        localStorage.setItem('mobilierData', JSON.stringify(data));
    } catch (e) {
        console.error('Erro ao salvar:', e);
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
        }
    } catch (e) {
        console.error('Erro ao carregar:', e);
    }
}

// ============================================
// DEBUG
// ============================================

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
    
    showMessage('Dados exportados!', 'success');
};

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
                
                if (confirm('Substituir todos os dados atuais?')) {
                    products = data.products || products;
                    users = data.users || users;
                    savedBudgets = data.savedBudgets || savedBudgets;
                    Object.assign(companyData, data.companyData || {});
                    
                    saveToLocalStorage();
                    location.reload();
                }
            } catch (error) {
                showMessage('Erro ao importar.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

console.log('Sistema Mobilier carregado!');
