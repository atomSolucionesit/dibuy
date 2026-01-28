import { useState } from 'react';
import { paywayService } from '@/services/paywayService';

interface CardData {
  card_number: string;
  card_expiration_month: string;
  card_expiration_year: string;
  security_code: string;
  card_holder_name: string;
}

export const usePayway = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCardToken = async (cardData: CardData): Promise<{ success: boolean; token?: string; error?: any }> => {
    setIsLoading(true);

    try {
      const result = await paywayService.createToken(cardData);
      return { success: true, token: result.id };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoaded: true,
    isLoading,
    createCardToken
  };
};