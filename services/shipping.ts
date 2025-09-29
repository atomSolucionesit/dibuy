import axios from 'axios';

export async function getShippingCost(cpOrigen: string, cpDestino: string, peso: string, empresa: string) {
    let options: any;
    switch (empresa) {
        case 'oca':
            options = {
                method: 'GET',
                url: `https://transportistas-de-argentina.p.rapidapi.com/quotes/postcode/correo_argentino/${peso}/${cpOrigen}/${cpDestino}`,
                headers: {
                    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'transportistas-de-argentina.p.rapidapi.com'
                }
            };
        case 'correoArgentino':
            options = {
                method: 'GET',
                url: `https://transportistas-de-argentina.p.rapidapi.com/quotes/postcode/correo_argentino/${peso}/${cpOrigen}/${cpDestino}`,
                headers: {
                    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'transportistas-de-argentina.p.rapidapi.com'
                }
            };
        case 'andreani':
            options = {
                method: 'GET',
                url: `https://transportistas-de-argentina.p.rapidapi.com/quotes/postcode/correo_argentino/${peso}/${cpOrigen}/${cpDestino}`,
                headers: {
                    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'transportistas-de-argentina.p.rapidapi.com'
                }
            };
        default:
            null;
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}