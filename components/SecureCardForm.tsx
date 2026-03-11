import { useState } from 'react';
import { createToken } from '@/services/payments';

interface SecureCardFormProps {
  onTokenReceived: (token: string) => void;
  onError: (error: unknown) => void;
}

export const SecureCardForm = ({ onTokenReceived, onError }: SecureCardFormProps) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const tokenizeCard = async () => {
    setLoading(true);

    try {
      const [month = '', year = ''] = cardData.expiry.split('/');

      const tokenData = {
        card_number: cardData.number.replace(/s/g, ''),
        card_expiration_month: month,
        card_expiration_year: year,
        security_code: cardData.cvv,
        card_holder_name: cardData.name,
        card_holder_identification: { type: 'dni', number: '0' },
      };

      const result = await createToken(tokenData);

      if (result.success && result.token) {
        onTokenReceived(result.token);
      } else {
        onError('Error al tokenizar la tarjeta');
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Numero de tarjeta"
        value={cardData.number}
        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
        className="w-full rounded border p-3"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="MM/YY"
          value={cardData.expiry}
          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
          className="rounded border p-3"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cardData.cvv}
          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
          className="rounded border p-3"
        />
      </div>
      <input
        type="text"
        placeholder="Nombre del titular"
        value={cardData.name}
        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
        className="w-full rounded border p-3"
      />
      <button
        type="button"
        onClick={tokenizeCard}
        disabled={loading}
        className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
      >
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
    </div>
  );
};
