'use client';

import { useState } from 'react';
import { paywayService } from '@/services/paywayService';

export const PaywayTest = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testTokenCreation = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await paywayService.createToken({
        card_number: '4507990000004905',
        card_expiration_month: '12',
        card_expiration_year: '2025',
        security_code: '123',
        card_holder_name: 'APROBADO'
      });
      setResult({ type: 'token', success: true, data });
    } catch (error: any) {
      setResult({ type: 'token', success: false, error: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const tokenData = await paywayService.createToken({
        card_number: '4507990000004905',
        card_expiration_month: '12',
        card_expiration_year: '2025',
        security_code: '123',
        card_holder_name: 'APROBADO'
      });

      const paymentData = await paywayService.processPayment({
        token: tokenData.id,
        amount: 100,
        saleId: `test_${Date.now()}`
      });
      
      setResult({ type: 'payment', success: true, data: paymentData });
    } catch (error: any) {
      setResult({ type: 'payment', success: false, error: error.response?.data || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payway Integration Test</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testTokenCreation}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Token Creation'}
        </button>
        
        <button
          onClick={testPayment}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Full Payment Flow'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="font-bold mb-2">
            {result.type === 'token' ? 'Token Creation' : 'Payment'} Result:
          </h3>
          <div className={`p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-medium">
              {result.success ? '✅ Success' : '❌ Error'}
            </p>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(result.data || result.error, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};