// Utilidad para remover fondos de imágenes
export const removeImageBackground = async (imageUrl: string): Promise<string> => {
  try {
    console.log('Attempting to remove background for:', imageUrl);
    
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    console.log('Remove background response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove background API error:', errorText);
      throw new Error(`Failed to remove background: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Remove background success for:', imageUrl);
    return result.processedImageUrl;
  } catch (error) {
    console.error('Error removing background for', imageUrl, ':', error);
    return imageUrl; // Retorna imagen original si falla
  }
};

// Cache para evitar procesar la misma imagen múltiples veces
const processedImages = new Map<string, string>();

export const getProcessedImage = async (originalUrl: string): Promise<string> => {
  if (processedImages.has(originalUrl)) {
    return processedImages.get(originalUrl)!;
  }

  const processedUrl = await removeImageBackground(originalUrl);
  processedImages.set(originalUrl, processedUrl);
  return processedUrl;
};