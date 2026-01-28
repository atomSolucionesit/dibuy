import { NextRequest, NextResponse } from "next/server";

const PAYWAY_BASE_URL = "https://developers.decidir.com/api/v2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      card_number,
      card_expiration_month,
      card_expiration_year,
      security_code,
      card_holder_name,
    } = body;

    const payload = {
      card_number: card_number.replace(/\s/g, ""),
      card_expiration_month: card_expiration_month.padStart(2, "0"),
      card_expiration_year: card_expiration_year.length === 2 ? "20" + card_expiration_year : card_expiration_year,
      security_code,
      card_holder_name: card_holder_name.toUpperCase(),
      card_holder_identification: {
        type: "DNI",
        number: "12345678",
      },
    };

    const response = await fetch(`${PAYWAY_BASE_URL}/tokens`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_description || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      id: data.id,
      bin: data.bin,
      last_four_digits: data.last_four_digits,
      card_brand: data.card_brand,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
