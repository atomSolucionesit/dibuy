'use client';

import { useState } from 'react';
import { usePayway } from '@/hooks/usePayway';
import { paywayService } from '@/services/paywayService';

interface PaywayCardFormProps {
  onSuccess: (paymentResult: any) => void;
  onError: (error: any) => void;
  amount: number;
}

export const PaywayCardForm = ({ onSuccess, onError, amount }: PaywayCardFormProps) => {
  const { isLoaded, isLoading, createCardToken } = usePayway();
  const [processing, setProcessing] = useState(false);
  
  const [cardData, setCardData] = useState({
    number: '4507990000004905',
    expiry: '12/25',
    cvv: '123',
    name: 'APROBADO'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, using API tokenization');
    
    setProcessing(true);

    try {
      // 1. Tokenizar tarjeta usando la API
      const [month, year] = cardData.expiry.split('/');
      
      console.log('Attempting to create token via API...');
      
      const tokenResult = await createCardToken({
        card_number: cardData.number.replace(/\s/g, ''),
        card_expiration_month: month.padStart(2, '0'),
        card_expiration_year: year.length === 2 ? '20' + year : year,
        security_code: cardData.cvv,
        card_holder_name: cardData.name.toUpperCase()
      });

      console.log('Token result:', tokenResult);

      if (!tokenResult.success) {
        throw new Error(tokenResult.error || 'Error al tokenizar la tarjeta');
      }

      // 2. Enviar token al backend para procesar pago
      console.log('Sending payment request with token:', tokenResult.token);
      
      const paymentResult = await paywayService.processPayment({
        token: tokenResult.token,
        amount: amount,
        saleId: `sale_${Date.now()}`
      });

      console.log('Payment result:', paymentResult);

      if (paymentResult.success && paymentResult.data?.status === 'approved') {
        onSuccess(paymentResult.data);
      } else {
        throw new Error(paymentResult.data?.status_details?.error?.reason || 'Pago rechazado');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-700">
          <strong>Estado:</strong> ✅ Listo para procesar
        </p>
        <p className="text-sm text-blue-700">
          <strong>Datos de prueba precargados</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Número de tarjeta</label>
          <input
            type="text"
            value={cardData.number}
            onChange={(e) => setCardData({...cardData, number: e.target.value})}
            className="w-full p-3 border rounded-lg"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vencimiento</label>
            <input
              type="text"
              value={cardData.expiry}
              onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
              className="w-full p-3 border rounded-lg"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CVV</label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
              className="w-full p-3 border rounded-lg"
              maxLength={4}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nombre del titular</label>
          <input
            type="text"
            value={cardData.name}
            onChange={(e) => setCardData({...cardData, name: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={processing || isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Procesando...' : `Pagar $${amount}`}
        </button>
      </form>
    </div>
  );
};