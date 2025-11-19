import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Obtener token CRM
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CRM_BASE_URL}/auth/ecommerce/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyToken: process.env.NEXT_PUBLIC_COMPANY_TOKEN,
        }),
      }
    );

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate with CRM");
    }

    const { access_token } = await authResponse.json();

    // Crear venta en CRM
    const saleResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CRM_BASE_URL}/sales`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: orderData.total,
          subTotal: orderData.subtotal,
          taxAmount: orderData.tax,
          status: "COMPLETED",
          currencyId: 1,
          receiptTypeId: 1,
          documentTypeId: 1,
          details: orderData.items.map((item: any) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentCharge: {
            amountPaid: orderData.total,
            isCredit: false,
            date: new Date().toISOString(),
            details: [
              {
                paymentTypeId: 1,
                amount: orderData.total,
              },
            ],
          },
        }),
      }
    );

    if (!saleResponse.ok) {
      throw new Error("Failed to create sale in CRM");
    }

    const sale = await saleResponse.json();

    return NextResponse.json({
      success: true,
      data: sale,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
