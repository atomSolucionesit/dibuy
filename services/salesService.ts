interface SaleItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface SaleData {
  total: number;
  subtotal: number;
  tax: number;
  items: SaleItem[];
  payment_method: string;
}

export class SalesService {
  static async createSale(orderData: SaleData) {
    try {
      const response = await fetch('/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create sale');
      }
      
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Error creating sale');
    }
  }
}