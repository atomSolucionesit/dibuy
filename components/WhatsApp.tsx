"use client";
import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

export default function WhatsAppBubble() {
  const [showMessage, setShowMessage] = useState(false);
  const phoneNumber = "1154707982";

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const handleClose = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Mensaje flotante */}
      {showMessage && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 mb-2 max-w-xs animate-bounce">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FaWhatsapp size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">¡Hola! 👋</p>
                <p className="text-xs text-gray-600">¿Necesitas ayuda? Escríbenos</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <AiOutlineClose size={14} />
            </button>
          </div>
          {/* Flecha del globo */}
          <div className="absolute bottom-0 right-4 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Botón principal */}
      <div className="relative">
        {/* Animación de pulso */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
        
        {/* Botón */}
        <button
          onClick={handleClick}
          className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <FaWhatsapp size={28} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Indicador de notificación */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>
    </div>
  );
}
