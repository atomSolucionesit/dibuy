import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CRM_BASE_URL = process.env.NEXT_PUBLIC_CRM_BASE_URL || 'http://localhost:3000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { total_price, products, site_transaction_id } = body;

    const checkoutData = {
      origin_platform: "SDK-Node",
      currency: "ARS",
      products: products || [],
      total_price,
      site_transaction_id,
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/cancel`,
      notifications_url: `${process.env.NEXT_PUBLIC_API_URL}/payway/webhook`,
      template_id: 1,
      installments: [1, 3, 6, 12],
      plan_gobierno: false,
      auth_3ds: false
    };

    const response = await axios.post(`${CRM_BASE_URL}/payway/checkout`, checkoutData, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COMPANY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({
      success: true,
      checkout_url: response.data.checkout_url,
      payment_id: response.data.payment_id
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.response?.data?.message || 'Error al crear checkout'
    }, { status: error.response?.status || 500 });
  }
}