// Data Loader para cargar configuraciones desde archivos JSON
class DataLoader {
    constructor() {
        this.products = null;
        this.colors = null;
        this.threads = null;
        this.config = null;
        this.loaded = false;
    }

    async loadAll() {
        try {
            console.log('Cargando configuraciones desde archivos JSON...');
            
            const [productsResponse, colorsResponse, threadsResponse, configResponse] = await Promise.all([
                fetch('./json/products.json'),
                fetch('./json/colors.json'),
                fetch('./json/threads.json'),
                fetch('./json/config.json')
            ]);

            this.products = await productsResponse.json();
            this.colors = await colorsResponse.json();
            this.threads = await threadsResponse.json();
            this.config = await configResponse.json();

            this.loaded = true;
            console.log('Configuraciones cargadas exitosamente:', {
                products: Object.keys(this.products.products).length,
                colorGroups: Object.keys(this.colors.colorGroups).length,
                threadTypes: Object.keys(this.threads.threadTypes).length
            });

            return true;
        } catch (error) {
            console.error('Error cargando configuraciones:', error);
            return false;
        }
    }

    getProduct(productType) {
        if (!this.loaded) return null;
        return this.products.products[productType] || null;
    }

    getColors(productType) {
        if (!this.loaded) return [];
        return this.colors.colorGroups[productType]?.colors || [];
    }

    getThread(threadType) {
        if (!this.loaded) return null;
        return this.threads.threadTypes[threadType] || null;
    }

    getDefaultThread(productType) {
        if (!this.loaded) return 'hilo22';
        return this.threads.defaultThreads[productType] || 'hilo22';
    }

    getConfig() {
        if (!this.loaded) return null;
        return this.config;
    }

    calculatePrice(productType, threadType, quantity = 1) {
        const product = this.getProduct(productType);
        const thread = this.getThread(threadType);
        
        if (!product || !thread) return 0;

        // Para productos personalizados, el precio es solo el del hilo
        let basePrice = 0;
        
        // Aplicar descuentos por cantidad si existen
        let finalPrice = basePrice;
        if (product.bulkDiscounts && Object.keys(product.bulkDiscounts).length > 0) {
            const sortedQuantities = Object.keys(product.bulkDiscounts)
                .map(q => parseInt(q))
                .sort((a, b) => b - a);
            
            for (const minQty of sortedQuantities) {
                if (quantity >= minQty) {
                    finalPrice = product.bulkDiscounts[minQty];
                    break;
                }
            }
        }

        return (finalPrice + thread.price) * quantity;
    }

    getBulkDiscountInfo(productType, quantity) {
        const product = this.getProduct(productType);
        if (!product || !product.bulkDiscounts) return null;

        const sortedQuantities = Object.keys(product.bulkDiscounts)
            .map(q => parseInt(q))
            .sort((a, b) => b - a);

        for (const minQty of sortedQuantities) {
            if (quantity >= minQty) {
                return {
                    minQuantity: minQty,
                    price: product.bulkDiscounts[minQty],
                    discount: product.basePrice - product.bulkDiscounts[minQty]
                };
            }
        }

        return null;
    }
}

// Instancia global del data loader
window.dataLoader = new DataLoader();

