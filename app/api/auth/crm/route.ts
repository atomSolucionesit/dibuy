import { NextRequest, NextResponse } from 'next/server';

let crmToken: string | null = null;
let tokenExpiry: number | null = null;

export async function POST() {
  try {
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutos

    // Si el token es válido, devolverlo
    if (crmToken && tokenExpiry && now < (tokenExpiry - bufferTime)) {
      return NextResponse.json({ token: crmToken });
    }

    // Autenticar con CRM usando company token
    const response = await fetch(`${process.env.NEXT_PUBLIC_CRM_BASE_URL}/auth/ecommerce/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyToken: process.env.NEXT_PUBLIC_COMPANY_TOKEN
      })
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with CRM');
    }

    const data = await response.json();
    crmToken = data.access_token;
    tokenExpiry = Date.now() + (23 * 60 * 60 * 1000); // 23 horas

    return NextResponse.json({ token: crmToken });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}