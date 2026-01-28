import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const URLS = [
  "https://developers.decidir.com/api/v2"
];

export async function POST(request: NextRequest) {
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
    card_expiration_year: card_expiration_year.length === 4 ? card_expiration_year.slice(-2) : card_expiration_year,
    security_code,
    card_holder_name: card_holder_name.toUpperCase(),
    card_holder_identification: {
      type: "DNI",
      number: "12345678",
    },
  };

  for (const baseUrl of URLS) {
    try {
      console.log(`=== TRYING ${baseUrl} ===`);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('API Key:', process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY?.substring(0, 8) + '...');
      
      const response = await axios.post(`${baseUrl}/tokens`, payload, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_PAYWAY_PUBLIC_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      console.log(`SUCCESS with ${baseUrl}:`, response.data);
      return NextResponse.json({
        success: true,
        id: response.data.id,
        bin: response.data.bin,
        last_four_digits: response.data.last_four_digits,
        card_brand: response.data.card_brand,
      });
    } catch (error: any) {
      console.log(`FAILED with ${baseUrl}:`);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
      continue;
    }
  }

  return NextResponse.json(
    { success: false, error: "All endpoints failed" },
    { status: 400 }
  );
}