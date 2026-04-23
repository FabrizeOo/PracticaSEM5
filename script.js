// Datos de productos - Inspirado en InkaFarma
const products = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "analgesicos",
        price: 8.50,
        stock: 50,
        emoji: "💊",
        description: "Analgésico y antipirético. Alivia dolores de cabeza, musculares y fiebre. Caja con 20 tabletas."
    },
    {
        id: 2,
        name: "Ibuprofeno 400mg",
        category: "analgesicos",
        price: 12.00,
        stock: 35,
        emoji: "💊",
        description: "Antiinflamatorio y analgésico. Ideal para dolores moderados. Blíster con 10 cápsulas."
    },
    {
        id: 3,
        name: "Vitamina C 1000mg",
        category: "vitaminas",
        price: 15.50,
        stock: 60,
        emoji: "🟠",
        description: "Refuerza el sistema inmunológico. Protege contra resfriados. Frasco con 30 tabletas efervescentes."
    },
    {
        id: 4,
        name: "Vitamina B12 1000mcg",
        category: "vitaminas",
        price: 22.00,
        stock: 25,
        emoji: "🔴",
        description: "Aumenta energía y vitalidad. Combate la anemia. Caja con 20 inyecciones."
    },
    {
        id: 5,
        name: "Complejo Vitamínico B",
        category: "vitaminas",
        price: 18.75,
        stock: 45,
        emoji: "🟡",
        description: "Combina vitaminas B1, B2, B6 y B12. Mejora metabolismo y energía. Frasco con 60 tabletas."
    },
    {
        id: 6,
        name: "Bloqueador Solar SPF 50",
        category: "cuidado",
        price: 28.00,
        stock: 40,
        emoji: "☀️",
        description: "Protección total contra rayos UVA y UVB. Hidratante y resistente al agua. Tubo 100ml."
    },
    {
        id: 7,
        name: "Jabón Antibacterial",
        category: "cuidado",
        price: 6.50,
        stock: 100,
        emoji: "🧼",
        description: "Elimina bacterias y germenes. Cuida tu piel diariamente. Barra de 125g."
    },
    {
        id: 8,
        name: "Gel Desinfectante 70ml",
        category: "cuidado",
        price: 9.99,
        stock: 80,
        emoji: "🧴",
        description: "Desinfecta manos al 70% de alcohol. Protección portátil contra gérmenes. Botella 70ml."
    },
    {
        id: 9,
        name: "Termómetro Digital",
        category: "cuidado",
        price: 35.00,
        stock: 20,
        emoji: "🌡️",
        description: "Lectura rápida en 5 segundos. Precisión de ±0.1°C. Incluye baterías."
    },
    {
        id: 10,
        name: "Aspirina 500mg",
        category: "analgesicos",
        price: 7.80,
        stock: 55,
        emoji: "💊",
        description: "Analgésico y anticoagulante. Alivia dolores y reduce riesgo cardiovascular. Caja 20 tabletas."
    },
    {
        id: 11,
        name: "Zinc 30mg",
        category: "vitaminas",
        price: 19.50,
        stock: 38,
        emoji: "⚪",
        description: "Fortalece defensas y acelera cicatrización. Esencial para inmunidad. Frasco 60 cápsulas."
    },
    {
        id: 12,
        name: "Mascarilla Facial",
        category: "cuidado",
        price: 12.50,
        stock: 70,
        emoji: "😷",
        description: "Hipoalergénica de 3 capas. Protección respiratoria. Caja con 50 unidades."
    }
];

// Estado del carrito
let cart = [];
let currentCategory = 'all';
let searchTerm = '';

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const modal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const addToCartBtn = document.getElementById('addToCartBtn');
const quantityInput = document.getElementById('quantity');
let currentProduct = null;

// Inicializar la página
function init() {
    renderProducts(products);
    setupEventListeners();
    loadCartFromLocalStorage();
}

// Renderizar productos en el grid
function renderProducts(productsToShow) {
    productsGrid.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-body">
                <div class="product-name">${product.name}</div>
                <span class="product-category">${getCategoryLabel(product.category)}</span>
                <div class="product-price">S/. ${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="openModal(${product.id})">Ver Detalles</button>
                    <button class="btn btn-secondary" onclick="quickAddToCart(${product.id})">🛒 Agregar</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Obtener etiqueta de categoría
function getCategoryLabel(category) {
    const labels = {
        'analgesicos': 'Analgésicos',
        'vitaminas': 'Vitaminas',
        'cuidado': 'Cuidado Personal'
    };
    return labels[category] || category;
}

// Abrir modal con detalles del producto
function openModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    document.getElementById('modalName').textContent = currentProduct.name;
    document.getElementById('modalCategory').textContent = getCategoryLabel(currentProduct.category);
    document.getElementById('modalDescription').textContent = currentProduct.description;
    document.getElementById('modalImage').textContent = currentProduct.emoji;
    document.getElementById('modalStock').textContent = currentProduct.stock;
    document.getElementById('modalPrice').textContent = `S/. ${currentProduct.price.toFixed(2)}`;
    quantityInput.value = 1;
    quantityInput.max = currentProduct.stock;

    modal.style.display = 'block';
}

// Cerrar modal
function closeProductModal() {
    modal.style.display = 'none';
    currentProduct = null;
}

// Agregar al carrito desde modal
function addFromModal() {
    if (!currentProduct) return;
    const quantity = parseInt(quantityInput.value) || 1;
    addToCart(currentProduct.id, quantity);
    closeProductModal();
}

// Agregar rápidamente al carrito (cantidad = 1)
function quickAddToCart(productId) {
    addToCart(productId, 1);
}

// Lógica principal de agregar al carrito
function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }

    // Validar stock
    const requestedQty = parseInt(quantity) || 1;
    if (requestedQty <= 0) {
        showNotification('Cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    if (requestedQty > product.stock) {
        showNotification(`Stock insuficiente. Disponibles: ${product.stock}`, 'error');
        return;
    }

    // Buscar si el producto ya está en el carrito
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        const newQty = cartItem.quantity + requestedQty;
        if (newQty > product.stock) {
            showNotification(`Stock insuficiente. Ya tienes ${cartItem.quantity} en el carrito.`, 'error');
            return;
        }
        cartItem.quantity = newQty;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: requestedQty,
            emoji: product.emoji
        });
    }

    saveCartToLocalStorage();
    updateCartUI();
    showNotification(`✓ ${product.name} agregado al carrito`, 'success');
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCartUI();
}

// Actualizar UI del carrito
function updateCartUI() {
    // Actualizar cantidad
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Actualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);

    // Renderizar items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-quantity">Cantidad: ${item.quantity}</div>
                <div class="cart-item-price">S/. ${(item.price * item.quantity).toFixed(2)}</div>
                <span class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</span>
            </div>
        `).join('');
    }
}

// Guardar carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('farmaciaCart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('farmaciaCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Notificación simple mejorada
function showNotification(message, type = 'success') {
    // Crear elemento temporal
    const notification = document.createElement('div');
    notification.textContent = message;
    const bgColor = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db';
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `${icon} ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Configurar event listeners
function setupEventListeners() {
    // Modal
    closeModal.addEventListener('click', closeProductModal);
    addToCartBtn.addEventListener('click', addFromModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });

    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        applyFilters();
    });

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('El carrito está vacío', 'error');
            return;
        }
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Procesando compra por S/. ${total.toFixed(2)}.\n\nGracias por tu compra en Farmacia InkaSalud.`);
        cart = [];
        saveCartToLocalStorage();
        updateCartUI();
    });

    // Filtrar por categoría
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = e.target.dataset.category;
            applyFilters();
        });
    });
}

// Aplicar filtros combinados (búsqueda + categoría)
function applyFilters() {
    let filtered = products;

    // Filtrar por categoría
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    renderProducts(filtered);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
