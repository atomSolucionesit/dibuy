import { NextRequest, NextResponse } from "next/server";

const PAYWAY_BASE_URL = "https://developers.decidir.com/api/v2";

export async function POST(request: NextRequest) {
  try {
    console.log('=== PAYWAY PAYMENT REQUEST ===');
    
    const body = await request.json();
    const { token, amount, saleId } = body;

    console.log('Payment data:', { token, amount, saleId });

    const payload = {
      site_transaction_id: saleId,
      token: token,
      user_id: "user123",
      payment_method_id: 1,
      bin: "450995",
      amount: Math.round(amount * 100),
      currency: "ARS",
      installments: 1,
      description: "Compra en Dibuy E-commerce",
      payment_type: "single",
      sub_payments: [],
    };

    console.log('Payment payload:', JSON.stringify(payload, null, 2));
    console.log('Private Key:', process.env.PAYWAY_PRIVATE_KEY?.substring(0, 8) + '...');

    const response = await fetch(`${PAYWAY_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_PAYWAY_PRIVATE_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Payment failed:');
      console.log('Status:', response.status);
      console.log('Error data:', errorData);
      throw new Error(errorData.error_description || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Payment success:', data);
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        site_transaction_id: data.site_transaction_id,
        status_details: data.status_details,
      },
    });
  } catch (error: any) {
    console.error('Payment error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}