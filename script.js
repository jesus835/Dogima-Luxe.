// Funcionalidad para los tabs de productos destacados
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar datos de prueba solo la primera vez
    if (!localStorage.getItem('dogimaInitialized')) {
        localStorage.removeItem('dogimaOrders');
        localStorage.removeItem('dogimaCartItems');
        localStorage.removeItem('dailyCoupons');
        localStorage.removeItem('couponsLastGenerated');
        
        // Limpiar cualquier otro dato que pueda existir
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('dogima') || key.includes('order') || key.includes('cart')) {
                localStorage.removeItem(key);
            }
        });
        
        // Marcar como inicializado para no limpiar de nuevo
        localStorage.setItem('dogimaInitialized', 'true');
    }
    
    // Cargar carrito desde localStorage al iniciar
    loadCartFromLocalStorage();
    
    // Actualizar badges
    updateCartBadge();
    updateOrdersBadge();
    // Control para activar/desactivar la sección de "Nuevos Arrivals" (mujeres)
    // Por defecto está oculta vía CSS. Para activarla dinámicamente:
    // setWomenSectionVisible(true)

    function setWomenSectionVisible(isVisible) {
        const section = document.querySelector('.new-arrivals-section');
        if (!section) return;
        section.style.display = isVisible ? 'block' : 'none';
    }

    
    
    // Funcionalidad del carrito (simulada)
    const cartIcons = document.querySelectorAll('.cart-icon');
    const badges = document.querySelectorAll('.badge');
    
    // Los productos ya tienen su propia funcionalidad de clic para abrir modales
    
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
let currentProductType = 'lisa'; // lisa | oversize | boxfit

// Precios por tipo
function getUnitPriceFor(quantity, productName) {
    // Detectar tipo por nombre del producto
    const name = (productName || '').toLowerCase();
    const isOversize = name.includes('oversize');
    const isBoxfit = name.includes('boxfit');

    if (isOversize || isBoxfit) {
        // T-shirt Oversize / Boxfit
        if (quantity >= 12) return 35; // docena
        if (quantity >= 6) return 38;  // media docena
        return 45;                     // unidad
    }
    // Playeras lisas (mantener lógica anterior Q25 / Q18 docena)
    if (quantity >= 12) return 18;
    return 25;
}

// Array para almacenar los items del carrito (se carga desde LocalStorage)
let cartItems = JSON.parse(localStorage.getItem('dogimaCartItems')) || [];

// Array para almacenar los pedidos (se carga desde LocalStorage)
let orders = JSON.parse(localStorage.getItem('dogimaOrders')) || [];

// Función para abrir el modal del carrito
function openCartModal(colorName, imageId) {
    currentProductColor = colorName;
    // Detectar tipo
    const name = (colorName || '').toLowerCase();
    if (name.includes('oversize')) currentProductType = 'oversize';
    else if (name.includes('boxfit')) currentProductType = 'boxfit';
    else currentProductType = 'lisa';

    // Si imageId ya parece ser una ruta completa (tiene '/' o una extensión), usarla tal cual
    if (imageId && (imageId.includes('/') || imageId.includes('.'))) {
        currentProductImage = imageId;
    } else {
        // Seleccionar carpeta por tipo
        let imageFolder = 'camisas lisas';
        let extension = '.png';
        
        if (currentProductType === 'oversize') {
            imageFolder = 'overside';
            extension = '.jpg';
        } else if (currentProductType === 'boxfit') {
            imageFolder = 'T-shirt Boxifit';
            extension = '.jpg';
        }
        
        const file = imageId ? `${imageId}${extension}` : '';
        currentProductImage = `./images/${imageFolder}/${file}`;
    }
    
    // Actualizar contenido del modal (compatibilidad con index.html y store.html)
    const productImageEl = document.getElementById('modalProductImage') || document.getElementById('modalImage');
    const productNameEl = document.getElementById('modalProductName');
    const productInfoEl = document.getElementById('modalProductInfo');
    if (productImageEl) productImageEl.src = currentProductImage;
    if (productNameEl) productNameEl.textContent = colorName;
    if (productInfoEl) productInfoEl.textContent = 'Algodón en hilo 22 - Tallas Disponibles: S, M, L y XL';

    // Resetear cantidad y talla
    const qtyEl = document.getElementById('quantityInput');
    const sizeEl = document.getElementById('sizeSelect');
    if (qtyEl) qtyEl.value = 1;
    if (sizeEl) sizeEl.value = 'M';
    
    // Resetear precio
    updatePrice();
    
    // Mostrar modal
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'block';
}

// Función para cerrar el modal
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
    
    // Ocultar sección de cupón y limpiar estado
    const couponSection = document.getElementById('couponSection');
    const couponInput = document.getElementById('couponCode');
    const couponStatus = document.getElementById('couponStatus');
    
    if (couponSection) couponSection.style.display = 'none';
    if (couponInput) {
        couponInput.value = '';
        couponInput.removeAttribute('data-discount');
    }
    if (couponStatus) couponStatus.innerHTML = '';
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
    const unitPrice = getUnitPriceFor(quantity, currentProductColor);
    const total = unitPrice * quantity;
    
    document.getElementById('unitPrice').textContent = `Q${unitPrice}`;
    document.getElementById('totalPrice').textContent = `Q${total}`;
    
    const discountInfo = document.getElementById('discountInfo');
    if (currentProductType === 'lisa') {
        // Mostrar info solo para docena en lisas
        discountInfo.style.display = quantity >= 12 ? 'block' : 'none';
        discountInfo.textContent = quantity >= 12 ? 'Precio por docena aplicado (Q18 c/u)' : '';
    } else {
        // Oversize y Boxfit: mostrar tier activo
        if (quantity >= 12) {
            discountInfo.style.display = 'block';
            discountInfo.textContent = 'Precio por docena aplicado (Q35 c/u)';
        } else if (quantity >= 6) {
            discountInfo.style.display = 'block';
            discountInfo.textContent = 'Precio por media docena aplicado (Q38 c/u)';
        } else {
            discountInfo.style.display = 'none';
            discountInfo.textContent = '';
        }
    }
}

// Función para agregar al carrito
function addToCart() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const size = document.getElementById('sizeSelect').value;
    const unitPrice = getUnitPriceFor(quantity, currentProductColor);
    let total = unitPrice * quantity;
    
    // Verificar si hay cupón aplicado
    const couponInput = document.getElementById('couponCode');
    const discount = parseInt(couponInput?.getAttribute('data-discount')) || 0;
    let couponCode = '';
    let discountAmount = 0;
    
    if (discount > 0 && couponInput?.value.trim()) {
        couponCode = couponInput.value.trim();
        discountAmount = Math.round(total * (discount / 100));
        total = total - discountAmount;
    }
    
    // Título según tipo
    let titlePrefix = 'Playera Lisa';
    if (currentProductType === 'oversize') titlePrefix = 'T-shirt Oversize';
    if (currentProductType === 'boxfit') titlePrefix = 'T-shirt Boxfit';
    
    // Crear objeto del producto
    const product = {
        id: Date.now(), // ID único basado en timestamp
        name: `${titlePrefix} - Color ${currentProductColor}`,
        color: currentProductColor,
        size: size,
        quantity: quantity,
        unitPrice: unitPrice,
        total: total,
        originalTotal: unitPrice * quantity,
        couponCode: couponCode,
        discount: discount,
        discountAmount: discountAmount,
        image: currentProductImage
    };
    
    // Buscar si ya existe un producto similar (mismo nombre y talla)
    const existingItemIndex = cartItems.findIndex(item => 
        item.name === product.name && item.size === size
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
    
    // Guardar en localStorage
    saveCartToLocalStorage();
    
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
    const couponsModal = document.getElementById('couponsModal');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (event.target === modal) {
        closeCartModal();
    }
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === ordersModal) {
        closeOrders();
    }
    if (event.target === couponsModal) {
        closeCouponsModal();
    }
    if (event.target === mobileMenu) {
        closeMobileMenu();
    }
}

// Funciones del carrito de compras

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('dogimaCartItems', JSON.stringify(cartItems));
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('dogimaCartItems');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartBadge();
    }
}

// Actualizar el badge del carrito
function updateCartBadge() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelectorAll('.badge')[1];
    cartBadge.textContent = totalItems;
}

// Actualizar precio de un item específico basado en su cantidad
function updateCartItemPrice(index) {
    const item = cartItems[index];
    item.unitPrice = getUnitPriceFor(item.quantity, item.name);
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
                ${item.couponCode ? `<div class="cart-item-coupon">
                    <i class="fas fa-tag"></i> Cupón: ${item.couponCode} (-${item.discount}%)
                </div>` : ''}
                <div class="cart-item-controls">
                    <div class="cart-quantity-display">
                        <span class="quantity-label">Cantidad: ${item.quantity}</span>
                    </div>
                    <button class="btn-remove-item" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            </div>
            <div class="cart-item-price">
                ${item.couponCode ? `<div class="original-price">Q${item.originalTotal}</div>` : ''}
                <div class="final-price">Q${item.total}</div>
            </div>
        </div>
    `).join('');
    
    // Actualizar resumen
    updateCartSummary();
}

// Actualizar resumen del carrito
function updateCartSummary() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
    
    // Contar playeras lisas, oversize y boxfit por separado
    // Solo contar productos que NO tengan descuento individual ya aplicado
    const playerasLisasCount = cartItems.reduce((sum, item) => {
        const name = (item.name || '').toLowerCase();
        const isOversize = name.includes('oversize');
        const isBoxfit = name.includes('boxfit');
        
        // Si no es oversize ni boxfit, es playera lisa
        if (!isOversize && !isBoxfit) {
            // Solo contar si NO tiene descuento individual aplicado (precio unitario normal)
            if (item.unitPrice >= 25) { // Precio normal sin descuento
                return sum + item.quantity;
            }
        }
        return sum;
    }, 0);
    
    const oversizeBoxfitCount = cartItems.reduce((sum, item) => {
        const name = (item.name || '').toLowerCase();
        const isOversize = name.includes('oversize');
        const isBoxfit = name.includes('boxfit');
        
        // Si es oversize o boxfit
        if (isOversize || isBoxfit) {
            // Solo contar si NO tiene descuento individual aplicado (precio unitario normal)
            if (item.unitPrice >= 45) { // Precio normal sin descuento
                return sum + item.quantity;
            }
        }
        return sum;
    }, 0);
    
    // Aplicar descuentos bulk
    let descuentoTotal = 0;
    let descuentoTextos = [];
    
    // Descuento playeras lisas: Q25→Q18 si hay 12 o más
    if (playerasLisasCount >= 12) {
        const descuentoPorUnidad = 25 - 18; // Q7 de descuento por unidad
        const descuentoAdicional = descuentoPorUnidad * playerasLisasCount;
        descuentoTotal += descuentoAdicional;
        descuentoTextos.push(`Playeras Q18 c/u: -Q${descuentoAdicional}`);
    }
    
    // Descuento oversize/boxfit: aplicar descuento según cantidad
    if (oversizeBoxfitCount >= 6) {
        let descuentoPorUnidad, precioFinal, descuentoTexto;
        
        if (oversizeBoxfitCount >= 12) {
            // Descuento por docena: Q45→Q35
            descuentoPorUnidad = 45 - 35; // Q10 de descuento por unidad
            precioFinal = 'Q35 c/u';
        } else {
            // Descuento por media docena: Q45→Q38
            descuentoPorUnidad = 45 - 38; // Q7 de descuento por unidad
            precioFinal = 'Q38 c/u';
        }
        
        const descuentoAdicional = descuentoPorUnidad * oversizeBoxfitCount;
        descuentoTotal += descuentoAdicional;
        descuentoTextos.push(`Oversize/Boxfit ${precioFinal}: -Q${descuentoAdicional}`);
    }
    
    // Aplicar descuentos al total
    if (descuentoTotal > 0) {
        totalPrice = totalPrice - descuentoTotal;
        
        // Mostrar información del descuento adicional
        const cartSubtotalEl = document.getElementById('cartSubtotal');
        const cartTotalEl = document.getElementById('cartTotal');
        
        if (cartSubtotalEl && cartTotalEl) {
            const precioOriginal = cartItems.reduce((sum, item) => sum + item.total, 0);
            const descuentoTexto = descuentoTextos.join(', ');
            cartSubtotalEl.innerHTML = `Q${precioOriginal} <span style="color: #4caf50; font-size: 12px;">(-Q${descuentoTotal} bulk: ${descuentoTexto})</span>`;
            cartTotalEl.textContent = `Q${totalPrice}`;
        }
    } else {
        // Mostrar precios normales
        document.getElementById('cartSubtotal').textContent = `Q${totalPrice}`;
        document.getElementById('cartTotal').textContent = `Q${totalPrice}`;
    }
    
    document.getElementById('cartTotalItems').textContent = totalItems;
}

// Aumentar cantidad en el carrito
function increaseCartQuantity(index) {
    cartItems[index].quantity++;
    updateCartItemPrice(index);
    updateCartDisplay();
    updateCartBadge();
    saveCartToLocalStorage();
}

// Disminuir cantidad en el carrito
function decreaseCartQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        updateCartItemPrice(index);
        updateCartDisplay();
        updateCartBadge();
        saveCartToLocalStorage();
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
        saveCartToLocalStorage();
    }
}

// Eliminar producto del carrito
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartDisplay();
    updateCartBadge();
    saveCartToLocalStorage();
}

// Vaciar carrito completo
function clearCart() {
    if (cartItems.length > 0) {
        cartItems = [];
        updateCartDisplay();
        updateCartBadge();
        saveCartToLocalStorage();
    }
}

// Proceder al checkout
function checkout() {
    if (cartItems.length === 0) {
        return;
    }
    
    // Crear mensaje para WhatsApp
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
    
    // Contar playeras lisas, oversize y boxfit por separado
    // Solo contar productos que NO tengan descuento individual ya aplicado
    const playerasLisasCount = cartItems.reduce((sum, item) => {
        const name = (item.name || '').toLowerCase();
        const isOversize = name.includes('oversize');
        const isBoxfit = name.includes('boxfit');
        
        // Si no es oversize ni boxfit, es playera lisa
        if (!isOversize && !isBoxfit) {
            // Solo contar si NO tiene descuento individual aplicado (precio unitario normal)
            if (item.unitPrice >= 25) { // Precio normal sin descuento
                return sum + item.quantity;
            }
        }
        return sum;
    }, 0);
    
    const oversizeBoxfitCount = cartItems.reduce((sum, item) => {
        const name = (item.name || '').toLowerCase();
        const isOversize = name.includes('oversize');
        const isBoxfit = name.includes('boxfit');
        
        // Si es oversize o boxfit
        if (isOversize || isBoxfit) {
            // Solo contar si NO tiene descuento individual aplicado (precio unitario normal)
            if (item.unitPrice >= 45) { // Precio normal sin descuento
                return sum + item.quantity;
            }
        }
        return sum;
    }, 0);
    
    // Aplicar descuentos bulk
    let descuentoTotal = 0;
    let descuentoMensajes = [];
    
    // Descuento playeras lisas: Q25→Q18 si hay 12 o más
    if (playerasLisasCount >= 12) {
        const descuentoPorUnidad = 25 - 18; // Q7 de descuento por unidad
        const descuentoAdicional = descuentoPorUnidad * playerasLisasCount;
        descuentoTotal += descuentoAdicional;
        descuentoMensajes.push(`Playeras (Q25→Q18 c/u): -Q${descuentoAdicional}`);
    }
    
    // Descuento oversize/boxfit: aplicar descuento según cantidad
    if (oversizeBoxfitCount >= 6) {
        let descuentoPorUnidad, precioFinal, descuentoMensaje;
        
        if (oversizeBoxfitCount >= 12) {
            // Descuento por docena: Q45→Q35
            descuentoPorUnidad = 45 - 35; // Q10 de descuento por unidad
            precioFinal = 'Q45→Q35 c/u';
        } else {
            // Descuento por media docena: Q45→Q38
            descuentoPorUnidad = 45 - 38; // Q7 de descuento por unidad
            precioFinal = 'Q45→Q38 c/u';
        }
        
        const descuentoAdicional = descuentoPorUnidad * oversizeBoxfitCount;
        descuentoTotal += descuentoAdicional;
        descuentoMensajes.push(`Oversize/Boxfit (${precioFinal}): -Q${descuentoAdicional}`);
    }
    
    // Aplicar descuentos al total
    if (descuentoTotal > 0) {
        totalPrice = totalPrice - descuentoTotal;
    }
    
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
    if (descuentoTotal > 0) {
        descuentoMensajes.forEach(descuento => {
            message += `- Descuento bulk: ${descuento}\n`;
        });
    }
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
        status: 'realizado',
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
    saveCartToLocalStorage();
    closeCart();
}

// Funciones del modal de pedidos

// Actualizar el badge de pedidos
function updateOrdersBadge() {
    const realizadoOrders = orders.filter(order => order.status === 'realizado').length;
    document.getElementById('ordersBadge').textContent = realizadoOrders;
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
                    ${order.status === 'realizado' ? 'Pedido Realizado' : order.status === 'completado' ? 'Completado' : 'Enviado'}
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
                ${order.status === 'realizado' ? `
                    <button class="btn-cancel-order" onclick="cancelOrder(${index})">Cancelar</button>
                    <button class="btn-complete-order" onclick="completeOrder(${index})">Completado</button>
                ` : ''}
                <button class="btn-info-order" onclick="requestOrderInfo('${order.id}')">Información</button>
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

// Completar pedido
function completeOrder(index) {
    if (confirm('¿Marcar este pedido como completado?')) {
        orders[index].status = 'completado';
        localStorage.setItem('dogimaOrders', JSON.stringify(orders));
        updateOrdersDisplay();
        updateOrdersBadge();
    }
}

// Solicitar información del pedido por WhatsApp
function requestOrderInfo(orderId) {
    const message = `Deseo ver el actual estado de mi pedido ${orderId}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/50257326695?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
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


// Función para mezclar array aleatoriamente
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Función para filtrar productos por categoría con animaciones
function filterPlayerasProducts(category, sectionId) {
    const productItems = document.querySelectorAll('#playeras .product-item');
    const infoCard = document.querySelector('#playeras .product-item[style*="grid-column"]'); // Ficha técnica
    const tabButtons = document.querySelectorAll('#playeras-tabs .tab-btn');
    
    // Los 5 colores más vendidos a nivel mundial
    const topSellingColors = ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo'];
    
    // Hacer fade out de productos visibles
    productItems.forEach(item => {
        if (item !== infoCard && item.style.display !== 'none') {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
        }
    });
    
    // Después de la animación de salida, reorganizar y mostrar
    setTimeout(() => {
        let productsToShow = [];
        
        productItems.forEach(item => {
            const productTitle = item.querySelector('h4');
            if (!productTitle || item === infoCard) return;
            
            const colorName = productTitle.textContent.replace('Color ', '');
            
            if (category === 'Playeras Lisas') {
                // Para Playeras Lisas, separar por color para ordenar
                productsToShow.push({item: item, color: colorName});
            } else if (category === 'Más Vendidos') {
                // Mostrar solo los 5 colores más vendidos en orden aleatorio
                if (topSellingColors.includes(colorName)) {
                    productsToShow.push(item);
                }
            } else if (category === 'Mejor Valorados') {
                // Mostrar una selección de colores populares en orden aleatorio
                const topRated = ['Negro', 'Blanco', 'Azul', 'Verde', 'Gris', 'Rojo'];
                if (topRated.includes(colorName)) {
                    productsToShow.push(item);
                }
            }
        });
        
        // Ordenar según la categoría
        if (category === 'Playeras Lisas') {
            // Para Playeras Lisas: Blanco y Negro primero, luego el resto en orden
            const blancoItem = productsToShow.find(p => p.color === 'Blanco');
            const negroItem = productsToShow.find(p => p.color === 'Negro');
            const otrosItems = productsToShow.filter(p => p.color !== 'Blanco' && p.color !== 'Negro');
            
            // Ordenar los otros colores alfabéticamente
            otrosItems.sort((a, b) => a.color.localeCompare(b.color));
            
            // Crear el array final con el orden deseado
            productsToShow = [];
            if (blancoItem) productsToShow.push(blancoItem.item);
            if (negroItem) productsToShow.push(negroItem.item);
            otrosItems.forEach(p => productsToShow.push(p.item));
            
        } else {
            // Para "Más Vendidos" y "Mejor Valorados": orden aleatorio
            productsToShow = shuffleArray(productsToShow);
        }
        
        // Ocultar todos los productos primero
        productItems.forEach(item => {
            if (item !== infoCard) {
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
            }
        });
        
        // Reorganizar el DOM y mostrar los productos seleccionados
        const productsGrid = document.querySelector('.products-grid');
        const infoCardParent = infoCard ? infoCard.parentNode : null;
        
        // Remover todos los productos del DOM temporalmente
        productsToShow.forEach(item => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        });
        
        // Volver a añadir en el nuevo orden
        productsToShow.forEach((item, index) => {
            productsGrid.insertBefore(item, infoCard);
            
            setTimeout(() => {
                item.style.display = 'block';
                // Usar un pequeño delay para que la transición se aplique
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            }, index * 80); // Delay escalonado de 80ms entre cada producto
        });
        
    }, 250); // Esperar a que termine la animación de fade-out
    
    // Actualizar botones activos solo para esta sección
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#playeras-tabs .tab-btn[onclick*="${category}"]`).classList.add('active');
}

// Inicializar badge de pedidos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateOrdersBadge();
    
    // Inicializar tabs directamente
    console.log('Inicializando tabs...');
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log('Tabs encontrados:', tabBtns.length);
    
    tabBtns.forEach((btn, index) => {
        console.log(`Tab ${index}:`, btn.textContent);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en tab:', this.textContent);
            
            // Remover clase activa de todos los botones
            tabBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            // Filtrar productos según el tab seleccionado
            const tabText = this.textContent;
            filterProducts(tabText);
        });
    });
});

// Funciones del menú móvil
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle i');
    
    if (mobileMenu.style.display === 'block') {
        mobileMenu.style.display = 'none';
        menuToggle.className = 'fas fa-bars';
    } else {
        mobileMenu.style.display = 'block';
        menuToggle.className = 'fas fa-times';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle i');
    
    mobileMenu.style.display = 'none';
    menuToggle.className = 'fas fa-bars';
}

// Funciones del modal de cupones
function openCouponsModal() {
    const dailyCoupons = getDailyCoupons();
    displayCoupons(dailyCoupons);
    document.getElementById('couponsModal').style.display = 'block';
}

function closeCouponsModal() {
    document.getElementById('couponsModal').style.display = 'none';
}

function getDailyCoupons() {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('dogimaDailyCoupons');
    
    if (storedData) {
        const couponsData = JSON.parse(storedData);
        // Si los cupones son del mismo día, devolverlos
        if (couponsData.date === today) {
            return couponsData.coupons;
        }
    }
    
    // Generar nuevos cupones para hoy
    const newCoupons = generateNewDailyCoupons();
    localStorage.setItem('dogimaDailyCoupons', JSON.stringify({
        date: today,
        coupons: newCoupons
    }));
    
    return newCoupons;
}

function generateNewDailyCoupons() {
    const products = [
        { name: 'Playera Lisa Blanca', image: './images/camisas lisas/blanco.png' },
        { name: 'Playera Lisa Negra', image: './images/camisas lisas/negro.png' },
        { name: 'Playera Lisa Azul', image: './images/camisas lisas/azul.png' },
        { name: 'T-shirt Oversize Blanca', image: './images/overside/blanco.jpg' },
        { name: 'T-shirt Oversize Negra', image: './images/overside/negro.jpg' },
        { name: 'T-shirt Boxfit Blanca', image: './images/T-shirt Boxifit/blanco.jpg' },
        { name: 'T-shirt Boxfit Negra', image: './images/T-shirt Boxifit/negro.jpg' }
    ];
    
    // Generar 3-4 cupones aleatorios
    const numCoupons = Math.floor(Math.random() * 2) + 3; // 3 o 4 cupones
    const selectedProducts = shuffleArray([...products]).slice(0, numCoupons);
    
    return selectedProducts.map(product => {
        const discount = Math.floor(Math.random() * 10) + 1; // 1-10% descuento
        const couponCode = 'DESC' + Math.random().toString(36).substring(2, 7).toUpperCase();
        
        return {
            code: couponCode,
            productName: product.name,
            productImage: product.image,
            discount: discount,
            used: false
        };
    });
}

function displayCoupons(coupons) {
    const couponsContainer = document.getElementById('couponsContainer');
    couponsContainer.innerHTML = coupons.map((coupon, index) => `
        <div class="coupon-item ${coupon.used ? 'used' : ''}">
            <div class="coupon-image">
                <img src="${coupon.productImage}" alt="${coupon.productName}">
                ${coupon.used ? '<div class="used-overlay">USADO</div>' : ''}
            </div>
            <div class="coupon-details">
                <div class="coupon-header">
                    <h4>${coupon.productName}</h4>
                    <div class="coupon-discount-badge">${coupon.discount}% OFF</div>
                </div>
                <div class="coupon-code">Código: <strong>${coupon.code}</strong></div>
                <button class="btn-use-coupon ${coupon.used ? 'disabled' : ''}" 
                        onclick="${coupon.used ? '' : `useCoupon('${coupon.code}', '${coupon.productName}', ${coupon.discount}, ${index})`}"
                        ${coupon.used ? 'disabled' : ''}>
                    ${coupon.used ? 'Usado' : 'Usar Cupón'}
                </button>
            </div>
        </div>
    `).join('');
}

function useCoupon(code, productName, discount, couponIndex) {
    // Marcar cupón como usado
    markCouponAsUsed(couponIndex);
    
    // Cerrar modal de cupones
    closeCouponsModal();
    
    // Determinar el tipo de producto y configurar imagen
    let imageFolder = 'camisas lisas';
    let imageExtension = '.png';
    let imageId = 'blanco';
    
    if (productName.includes('Oversize')) {
        imageFolder = 'overside';
        imageExtension = '.jpg';
        imageId = productName.includes('Negra') ? 'negro' : 'blanco';
    } else if (productName.includes('Boxfit')) {
        imageFolder = 'T-shirt Boxifit';
        imageExtension = '.jpg';
        imageId = productName.includes('Negra') ? 'negro' : 'blanco';
    } else {
        imageId = productName.includes('Negra') ? 'negro' : productName.includes('Azul') ? 'azul' : 'blanco';
    }
    
    // Abrir modal de carrito con información del cupón
    openCartModalWithCoupon(productName, `./images/${imageFolder}/${imageId}${imageExtension}`, code, discount);
}

function markCouponAsUsed(couponIndex) {
    const storedData = localStorage.getItem('dogimaDailyCoupons');
    if (storedData) {
        const couponsData = JSON.parse(storedData);
        if (couponsData.coupons[couponIndex]) {
            couponsData.coupons[couponIndex].used = true;
            localStorage.setItem('dogimaDailyCoupons', JSON.stringify(couponsData));
        }
    }
}

function openCartModalWithCoupon(productName, imagePath, couponCode, discount) {
    // Configurar producto actual
    currentProductColor = productName;
    currentProductImage = imagePath;
    
    // Configurar tipo de producto
    if (productName.includes('Oversize')) currentProductType = 'oversize';
    else if (productName.includes('Boxfit')) currentProductType = 'boxfit';
    else currentProductType = 'lisa';
    
    // Actualizar modal
    const productImageEl = document.getElementById('modalProductImage') || document.getElementById('modalImage');
    const productNameEl = document.getElementById('modalProductName');
    const couponSectionEl = document.getElementById('couponSection');
    const couponCodeInput = document.getElementById('couponCode');
    
    if (productImageEl) productImageEl.src = imagePath;
    if (productNameEl) productNameEl.textContent = productName;
    
    // Mostrar sección de cupón y prellenar código
    if (couponSectionEl) {
        couponSectionEl.style.display = 'block';
        if (couponCodeInput) {
            couponCodeInput.value = couponCode;
            couponCodeInput.setAttribute('data-discount', discount);
        }
    }
    
    // Resetear cantidad y actualizar precio
    const qtyEl = document.getElementById('quantityInput');
    if (qtyEl) qtyEl.value = 1;
    updatePrice();
    
    // Abrir modal
    document.getElementById('cartModal').style.display = 'block';
}

// Función para aplicar cupón
function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponStatus = document.getElementById('couponStatus');
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        couponStatus.innerHTML = '<span style="color: #f44336;">Ingresa un código de cupón</span>';
        return;
    }
    
    // Verificar si el cupón tiene descuento asignado
    const discount = parseInt(couponInput.getAttribute('data-discount')) || 0;
    
    if (discount > 0) {
        couponStatus.innerHTML = `<span style="color: #4caf50;"><i class="fas fa-check-circle"></i> Cupón aplicado: ${discount}% de descuento</span>`;
        updatePrice(); // Actualizar precio con descuento
    } else {
        couponStatus.innerHTML = '<span style="color: #f44336;"><i class="fas fa-times-circle"></i> Código de cupón inválido</span>';
    }
}

// Modificar función updatePrice para incluir descuentos
function updatePrice() {
    // Calcular precio unitario basado en cantidad y tipo de producto
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    const unitPrice = getUnitPriceFor(quantity, currentProductColor);
    const total = unitPrice * quantity;
    
    // Actualizar elementos del DOM
    document.getElementById('unitPrice').textContent = `Q${unitPrice}`;
    document.getElementById('totalPrice').textContent = `Q${total}`;
    
    // Controlar texto "Descuento aplicado" basado en cantidad
    const discountAppliedEl = document.getElementById('discountApplied');
    
    // Mostrar "Descuento aplicado" según el tipo de producto
    if (discountAppliedEl) {
        if (currentProductType === 'lisa') {
            // Playeras Lisas: solo si cantidad es 12 o más
            if (quantity >= 12) {
                discountAppliedEl.style.display = 'block';
            } else {
                discountAppliedEl.style.display = 'none';
            }
        } else if (currentProductType === 'oversize' || currentProductType === 'boxfit') {
            // T-shirt Oversize y Boxfit: si cantidad es 6 o más
            if (quantity >= 6) {
                discountAppliedEl.style.display = 'block';
            } else {
                discountAppliedEl.style.display = 'none';
            }
        }
    }
    
    // Aplicar descuento si hay cupón válido
    const couponInput = document.getElementById('couponCode');
    const discount = parseInt(couponInput?.getAttribute('data-discount')) || 0;
    
    if (discount > 0 && couponInput?.value.trim()) {
        const totalPriceEl = document.getElementById('totalPrice');
        const discountInfoEl = document.getElementById('discountInfo');
        
        if (totalPriceEl) {
            const currentTotal = parseInt(totalPriceEl.textContent.replace('Q', ''));
            const discountAmount = Math.round(currentTotal * (discount / 100));
            const newTotal = currentTotal - discountAmount;
            
            totalPriceEl.textContent = `Q${newTotal}`;
            if (discountInfoEl) {
                discountInfoEl.textContent = `Descuento aplicado: -Q${discountAmount} (${discount}%)`;
                discountInfoEl.style.display = 'block';
            }
        }
    } else {
        const discountInfoEl = document.getElementById('discountInfo');
        if (discountInfoEl) {
            discountInfoEl.style.display = 'none';
        }
    }
}
