import axios from 'axios';

export async function getShippingCost(cpOrigen: string, cpDestino: string, peso: string, empresa: string) {
    let options: any;
    const provider = empresa.toLowerCase();

    // Default to correo_argentino if we don't recognize the name, 
    // but try to match known ones
    let providerSlug = 'correo_argentino';
    if (provider.includes('oca')) providerSlug = 'oca';
    if (provider.includes('andreani')) providerSlug = 'andreani';
    if (provider.includes('argentino')) providerSlug = 'correo_argentino';

    options = {
        method: 'GET',
        url: `https://transportistas-de-argentina.p.rapidapi.com/quotes/postcode/${providerSlug}/${peso}/${cpOrigen}/${cpDestino}`,
        headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            'x-rapidapi-host': 'transportistas-de-argentina.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}