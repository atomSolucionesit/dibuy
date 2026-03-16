"use client";

import React, { useState, useMemo } from "react";
import { Product, ProductVariant, ProductVariantGroup } from "@/types/api";
import { Check, Plus, Minus, X } from "lucide-react";
import Image from "next/image";

interface ComboSelectorProps {
  product: Product;
  onConfirm: (selections: any[]) => void;
  onCancel: () => void;
}

export default function ComboSelector({ product, onConfirm, onCancel }: ComboSelectorProps) {
  const [selections, setSelections] = useState<any[]>([]);
  const comboQuantity = product.comboQuantity || 1;

  const selectableVariants = useMemo(() => {
    return (product.variants || []).filter(
      (v) => v.isActive !== false && Number(v.stock || 0) > 0
    );
  }, [product.variants]);

  const handleAddVariant = (variant: ProductVariant) => {
    if (selections.length < comboQuantity) {
      setSelections([...selections, { ...variant, uniqueId: crypto.randomUUID() }]);
    }
  };

  const handleRemoveSelection = (uniqueId: string) => {
    setSelections(selections.filter((s) => s.uniqueId !== uniqueId));
  };

  const isComplete = selections.length === comboQuantity;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b p-4 px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Configura tu Combo</h2>
            <p className="text-sm text-gray-500">
              Selecciona {comboQuantity} productos para tu "{product.name}"
            </p>
          </div>
          <button onClick={onCancel} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-700">Tu selección</span>
              <span className="text-sm font-bold text-primary">
                {selections.length} de {comboQuantity}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(selections.length / comboQuantity) * 100}%` }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {selections.length === 0 && (
                <p className="text-sm text-gray-400 italic py-2">No has seleccionado nada aún...</p>
              )}
              {selections.map((s) => (
                <div 
                  key={s.uniqueId} 
                  className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-medium animate-in fade-in zoom-in duration-200"
                >
                  <span className="truncate max-w-[120px]">{s.name}</span>
                  <button onClick={() => handleRemoveSelection(s.uniqueId)} className="hover:text-primary/70 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Variants Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Opciones disponibles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectableVariants.map((variant) => (
                <div 
                  key={variant.id}
                  className="flex items-center justify-between p-3 border rounded-xl hover:border-primary/50 hover:bg-gray-50/50 transition-all group"
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-gray-800 truncate">{variant.name}</span>
                    <span className="text-xs text-gray-500">Stock: {variant.stock} unidades</span>
                  </div>
                  <button
                    onClick={() => handleAddVariant(variant)}
                    disabled={isComplete}
                    className={`ml-2 p-2 rounded-lg transition-all ${
                      isComplete 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selections)}
            disabled={!isComplete}
            className={`flex-[2] px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 ${
              isComplete
                ? "bg-primary text-white hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-primary/25"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            }`}
          >
            Confirmar Selección
          </button>
        </div>
      </div>
    </div>
  );
}
