import axios from 'axios';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export const ContactService = {
  async sendContactForm(data: ContactFormData) {
    const response = await axios.post('https://api-nexus.atomsolucionesit.com.ar/api/email/contact-ecommerce', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_COMPANY_TOKEN}`
      }
    });
    return response.data;
  }
};