// Utilidad para remover fondos de imágenes
export const removeImageBackground = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    const { processedImageUrl } = await response.json();
    return processedImageUrl;
  } catch (error) {
    console.error('Error removing background:', error);
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