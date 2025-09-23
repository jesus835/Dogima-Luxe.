// Funcionalidad para los tabs de productos destacados
document.addEventListener('DOMContentLoaded', function() {
    // Control para activar/desactivar la sección de "Nuevos Arrivals" (mujeres)
    // Por defecto está oculta vía CSS. Para activarla dinámicamente:
    // setWomenSectionVisible(true)

    function setWomenSectionVisible(isVisible) {
        const section = document.querySelector('.new-arrivals-section');
        if (!section) return;
        section.style.display = isVisible ? 'block' : 'none';
    }

    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            tabBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Aquí se podría agregar lógica para filtrar productos
            // Por ahora solo cambiamos la apariencia del tab
        });
    });
    
    // Funcionalidad del carrito (simulada)
    const cartIcons = document.querySelectorAll('.cart-icon');
    const badges = document.querySelectorAll('.badge');
    
    // Simular agregar productos al carrito al hacer hover en productos
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        item.addEventListener('click', function() {
            // Simular agregar al carrito
            const currentCount = parseInt(badges[1].textContent);
            badges[1].textContent = currentCount + 1;
            
            // Efecto visual
            badges[1].style.transform = 'scale(1.2)';
            setTimeout(() => {
                badges[1].style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Smooth scroll para navegación
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Si el enlace tiene href="#", prevenir comportamiento por defecto
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    // Animación de entrada para elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.product-item, .feature-item, .product-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Funcionalidad de búsqueda (básica)
    const searchIcon = document.querySelector('.fa-search');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchTerm = prompt('¿Qué producto estás buscando?');
            if (searchTerm) {
                alert(`Buscando: ${searchTerm}\n(Esta es una funcionalidad de demostración)`);
            }
        });
    }
    
    // Efecto hover mejorado para productos
    productItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        });
    });
    
    // Funcionalidad para los botones "Shop Now"
    const shopButtons = document.querySelectorAll('.btn');
    
    shopButtons.forEach(btn => {
        if (btn.textContent.includes('COMPRAR AHORA') || btn.textContent.includes('Comprar Ahora')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Efecto de ripple
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255,255,255,0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.marginLeft = '-10px';
                ripple.style.marginTop = '-10px';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Simular redirección
                setTimeout(() => {
                    alert('Redirigiendo a la página de compras...\n(Esta es una funcionalidad de demostración)');
                }, 300);
            });
        }
    });
    
    // Agregar animación CSS para el efecto ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Funcionalidad para selectores de idioma y moneda
    const selectors = document.querySelectorAll('.language-selector, .currency-selector');
    
    selectors.forEach(selector => {
        selector.addEventListener('click', function() {
            const type = this.classList.contains('language-selector') ? 'idioma' : 'moneda';
            alert(`Selector de ${type} clickeado\n(Esta es una funcionalidad de demostración)`);
        });
    });
    
    console.log('Dogima Luxe. - Tienda online cargada correctamente');
});

// Variables globales para el modal del carrito
let currentProductColor = '';
let currentProductImage = '';

// Array para almacenar los productos del carrito
let cartItems = [];

// Array para almacenar los pedidos (se carga desde LocalStorage)
let orders = JSON.parse(localStorage.getItem('dogimaOrders')) || [];

// Función para abrir el modal del carrito
function openCartModal(colorName, imageId) {
    currentProductColor = colorName;
    currentProductImage = `./images/camisas lisas/${imageId}.png`;
    
    // Actualizar contenido del modal
    document.getElementById('modalImage').src = currentProductImage;
    document.getElementById('modalColor').textContent = `Color: ${colorName}`;
    document.getElementById('quantityInput').value = 1;
    document.getElementById('sizeSelect').value = 'M';
    
    // Resetear precio
    updatePrice();
    
    // Mostrar modal
    document.getElementById('cartModal').style.display = 'block';
}

// Función para cerrar el modal
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// Función para aumentar cantidad
function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
    updatePrice();
}

// Función para disminuir cantidad
function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updatePrice();
    }
}

// Función para actualizar el precio
function updatePrice() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const unitPrice = quantity >= 12 ? 18 : 25;
    const total = unitPrice * quantity;
    
    document.getElementById('unitPrice').textContent = `Q${unitPrice}`;
    document.getElementById('totalPrice').textContent = `Q${total}`;
    
    const discountInfo = document.getElementById('discountInfo');
    if (quantity >= 12) {
        discountInfo.style.display = 'block';
    } else {
        discountInfo.style.display = 'none';
    }
}

// Función para agregar al carrito
function addToCart() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const size = document.getElementById('sizeSelect').value;
    const unitPrice = quantity >= 12 ? 18 : 25;
    const total = unitPrice * quantity;
    
    // Crear objeto del producto
    const product = {
        id: Date.now(), // ID único basado en timestamp
        name: `Playera Lisa - Color ${currentProductColor}`,
        color: currentProductColor,
        size: size,
        quantity: quantity,
        unitPrice: unitPrice,
        total: total,
        image: currentProductImage
    };
    
    // Buscar si ya existe un producto similar (mismo color y talla)
    const existingItemIndex = cartItems.findIndex(item => 
        item.color === currentProductColor && item.size === size
    );
    
    if (existingItemIndex > -1) {
        // Si existe, actualizar cantidad y total
        cartItems[existingItemIndex].quantity += quantity;
        updateCartItemPrice(existingItemIndex);
    } else {
        // Si no existe, agregar nuevo producto
        cartItems.push(product);
    }
    
    // Actualizar UI del carrito
    updateCartBadge();
    updateCartDisplay();
    
    // Efecto visual en el badge
    const cartBadge = document.querySelectorAll('.badge')[1];
    cartBadge.style.transform = 'scale(1.3)';
    cartBadge.style.background = '#4caf50';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
        cartBadge.style.background = '#1e88e5';
    }, 300);
    
    // Cerrar modal
    closeCartModal();
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    const cartModal = document.getElementById('shoppingCartModal');
    const ordersModal = document.getElementById('ordersModal');
    if (event.target === modal) {
        closeCartModal();
    }
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === ordersModal) {
        closeOrders();
    }
}

// Funciones del carrito de compras

// Actualizar el badge del carrito
function updateCartBadge() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelectorAll('.badge')[1];
    cartBadge.textContent = totalItems;
}

// Actualizar precio de un item específico basado en su cantidad
function updateCartItemPrice(index) {
    const item = cartItems[index];
    item.unitPrice = item.quantity >= 12 ? 18 : 25;
    item.total = item.unitPrice * item.quantity;
}

// Abrir carrito
function openCart() {
    updateCartDisplay();
    document.getElementById('shoppingCartModal').style.display = 'block';
}

// Cerrar carrito
function closeCart() {
    document.getElementById('shoppingCartModal').style.display = 'none';
}

// Actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';
    
    // Generar HTML de los items
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-info">Talla: ${item.size}</div>
                <div class="cart-item-info">Precio unitario: Q${item.unitPrice}</div>
                <div class="cart-item-controls">
                    <div class="cart-quantity-controls">
                        <button onclick="decreaseCartQuantity(${index})">-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${index}, this.value)">
                        <button onclick="increaseCartQuantity(${index})">+</button>
                    </div>
                    <button class="btn-remove-item" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            </div>
            <div class="cart-item-price">Q${item.total}</div>
        </div>
    `).join('');
    
    // Actualizar resumen
    updateCartSummary();
}

// Actualizar resumen del carrito
function updateCartSummary() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
    
    document.getElementById('cartTotalItems').textContent = totalItems;
    document.getElementById('cartSubtotal').textContent = `Q${totalPrice}`;
    document.getElementById('cartTotal').textContent = `Q${totalPrice}`;
}

// Aumentar cantidad en el carrito
function increaseCartQuantity(index) {
    cartItems[index].quantity++;
    updateCartItemPrice(index);
    updateCartDisplay();
    updateCartBadge();
}

// Disminuir cantidad en el carrito
function decreaseCartQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        updateCartItemPrice(index);
        updateCartDisplay();
        updateCartBadge();
    }
}

// Actualizar cantidad específica en el carrito
function updateCartQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity >= 1) {
        cartItems[index].quantity = quantity;
        updateCartItemPrice(index);
        updateCartDisplay();
        updateCartBadge();
    }
}

// Eliminar producto del carrito
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartDisplay();
    updateCartBadge();
}

// Vaciar carrito completo
function clearCart() {
    if (cartItems.length > 0) {
        cartItems = [];
        updateCartDisplay();
        updateCartBadge();
    }
}

// Proceder al checkout
function checkout() {
    if (cartItems.length === 0) {
        return;
    }
    
    // Crear mensaje para WhatsApp
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
    
    // Generar ID de pedido
    const orderId = 'PED-' + Date.now();
    
    let message = '*PEDIDO - DOGIMA LUXE*\n\n';
    message += `*ID PEDIDO: ${orderId}*\n\n`;
    message += '*DETALLE DEL PEDIDO:*\n';
    
    cartItems.forEach((item, index) => {
        message += `\n${index + 1}. ${item.name}\n`;
        message += `   - Talla: ${item.size}\n`;
        message += `   - Cantidad: ${item.quantity}\n`;
        message += `   - Precio unitario: Q${item.unitPrice}\n`;
        message += `   - Subtotal: Q${item.total}\n`;
    });
    
    message += `\n*RESUMEN:*\n`;
    message += `- Total de productos: ${totalItems}\n`;
    message += `- *TOTAL A PAGAR: Q${totalPrice}*\n\n`;
    message += `Gracias por tu pedido! Te contactaremos pronto para coordinar la entrega.`;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/50257326695?text=${encodedMessage}`;
    
    // Crear pedido y guardarlo en LocalStorage (usar el mismo ID)
    const order = {
        id: orderId,
        date: new Date().toLocaleString('es-GT'),
        items: [...cartItems],
        total: totalPrice,
        totalItems: totalItems,
        status: 'pending',
        whatsappSent: true
    };
    
    // Agregar pedido al array y guardar en LocalStorage
    orders.unshift(order); // Agregar al inicio del array
    localStorage.setItem('dogimaOrders', JSON.stringify(orders));
    
    // Actualizar badge de pedidos
    updateOrdersBadge();
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Vaciar carrito después de enviar
    cartItems = [];
    updateCartDisplay();
    updateCartBadge();
    closeCart();
}

// Funciones del modal de pedidos

// Actualizar el badge de pedidos
function updateOrdersBadge() {
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    document.getElementById('ordersBadge').textContent = pendingOrders;
}

// Abrir modal de pedidos
function openOrders() {
    updateOrdersDisplay();
    document.getElementById('ordersModal').style.display = 'block';
}

// Cerrar modal de pedidos
function closeOrders() {
    document.getElementById('ordersModal').style.display = 'none';
}

// Actualizar la visualización de pedidos
function updateOrdersDisplay() {
    const ordersContainer = document.getElementById('ordersItems');
    const emptyOrders = document.getElementById('emptyOrders');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '';
        emptyOrders.style.display = 'block';
        return;
    }
    
    emptyOrders.style.display = 'none';
    
    // Generar HTML de los pedidos
    ordersContainer.innerHTML = orders.map((order, index) => `
        <div class="order-item ${order.status}">
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <div class="order-status ${order.status}">
                    ${order.status === 'pending' ? 'Pendiente' : 'Enviado'}
                </div>
            </div>
            <div class="order-date">${order.date}</div>
            
            <div class="order-products">
                ${order.items.map(item => `
                    <div class="order-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-product-details">
                            <div class="order-product-name">${item.name}</div>
                            <div class="order-product-info">Talla: ${item.size} • Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="order-product-price">Q${item.total}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                <div class="order-total-amount">Total: Q${order.total}</div>
            </div>
            
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn-cancel-order" onclick="cancelOrder(${index})">Cancelar</button>
                ` : ''}
                <button class="btn-reorder" onclick="reorder(${index})">Repetir Pedido</button>
            </div>
        </div>
    `).join('');
}

// Cancelar pedido
function cancelOrder(index) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
        orders.splice(index, 1);
        localStorage.setItem('dogimaOrders', JSON.stringify(orders));
        updateOrdersDisplay();
        updateOrdersBadge();
    }
}

// Repetir pedido
function reorder(index) {
    const order = orders[index];
    
    // Limpiar carrito actual
    cartItems = [];
    
    // Agregar productos del pedido al carrito
    order.items.forEach(item => {
        cartItems.push({
            id: Date.now() + Math.random(), // ID único
            name: item.name,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            image: item.image
        });
    });
    
    // Actualizar displays
    updateCartDisplay();
    updateCartBadge();
    
    // Cerrar modal de pedidos y abrir carrito
    closeOrders();
    openCart();
}

// Inicializar badge de pedidos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateOrdersBadge();
});
