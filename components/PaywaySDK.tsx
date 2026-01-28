import Script from 'next/script';

export default function PaywaySDK() {
  return (
    <Script
      src="https://developers.decidir.com/api/v2/decidir.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('Decidir SDK loaded');
      }}
    />
  );
}