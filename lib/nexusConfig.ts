// Configuración para la integración con Nexus CRM
export const NEXUS_CONFIG = {
  // URL base del backend de Nexus
  API_URL: process.env.NEXT_PUBLIC_NEXUS_API_URL || 'http://localhost:3001/api',
  
  // Configuración de pagos
  PAYMENT: {
    CURRENCY_ID: 1, // ARS
    RECEIPT_TYPE_ID: 1, // Factura
    DOCUMENT_TYPE_ID: 1, // DNI
    WAREHOUSE_ID: 1, // Depósito principal
  },
  
  // Endpoints específicos
  ENDPOINTS: {
    PAYWAY_TOKEN: '/payway-mock/tokens',
    PAYWAY_PAYMENT: '/payway-mock/payments',
    PAYWAY_EXTERNAL: '/payway/external-payment',
    PRODUCTS: '/products',
    SALES: '/sales',
  }
};

// Mapeo de productos entre Dibuy y Nexus
export const mapDibuyToNexusProduct = (dibuyProduct: any) => {
  return {
    productId: dibuyProduct.id,
    quantity: dibuyProduct.quantity,
    price: dibuyProduct.sellingPrice || dibuyProduct.price,
    discount: dibuyProduct.discount || 0,
    warehouseId: NEXUS_CONFIG.PAYMENT.WAREHOUSE_ID,
  };
};

// Mapeo de datos de venta
export const mapDibuyToNexusSale = (checkoutData: any) => {
  return {
    total: checkoutData.total,
    subTotal: checkoutData.subtotal,
    taxAmount: checkoutData.tax || 0,
    currencyId: NEXUS_CONFIG.PAYMENT.CURRENCY_ID,
    receiptTypeId: NEXUS_CONFIG.PAYMENT.RECEIPT_TYPE_ID,
    documentTypeId: NEXUS_CONFIG.PAYMENT.DOCUMENT_TYPE_ID,
    warehouseId: NEXUS_CONFIG.PAYMENT.WAREHOUSE_ID,
    details: checkoutData.items.map(mapDibuyToNexusProduct),
  };
};