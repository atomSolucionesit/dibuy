import axios from 'axios';

const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_BASE_URL || 'http://localhost:3000/api';

export interface CheckoutData {
  total_price: number;
  products: Array<{
    id: string | number;
    value: number;
    description: string;
    quantity: number;
  }>;
  site_transaction_id: string;
}

export const createPaywayCheckout = async (checkoutData: CheckoutData) => {
  try {
    console.log('Sending checkout data:', checkoutData);
    
    const payload = {
      origin_platform: "SDK-Node",
      currency: "ARS",
      products: checkoutData.products,
      total_price: checkoutData.total_price,
      site_transaction_id: checkoutData.site_transaction_id,
      success_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/failure`,
      notifications_url: `${CRM_BASE_URL}/payway/webhook`,
      template_id: 1,
      installments: [1, 3, 6, 12],
      plan_gobierno: false,
      auth_3ds: false
    };

    console.log('Payload to CRM:', payload);
    console.log('CRM URL:', `${CRM_BASE_URL}/payway/checkout`);

    const response = await axios.post(`${CRM_BASE_URL}/payway/checkout`, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COMPANY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('CRM Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating checkout:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw new Error(error.response?.data?.message || error.message || 'Error al crear checkout');
  }
};