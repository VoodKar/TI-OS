import React, { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';

interface SignaturePadProps {
  onConfirm: (signature: string) => void;
  onClear: () => void;
  onCancel: () => void;
}

export const SignaturePadComponent: React.FC<SignaturePadProps> = ({ onConfirm, onClear, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
      canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
      canvasRef.current.getContext('2d')?.scale(ratio, ratio);

      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });
    }

    const handleResize = () => {
      if (canvasRef.current && signaturePadRef.current) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
        canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
        canvasRef.current.getContext('2d')?.scale(ratio, ratio);
        signaturePadRef.current.clear();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert('Por favor, assine antes de confirmar.');
      return;
    }
    const signature = signaturePadRef.current?.toDataURL();
    if (signature) {
      onConfirm(signature);
    }
  };

  const handleClear = () => {
    signaturePadRef.current?.clear();
    onClear();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col pt-4">
      <div className="px-6 flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Assinatura Digital</h2>
        <button 
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-800"
        >
          Cancelar
        </button>
      </div>

      <div className="flex-1 px-4 mb-4">
        <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-50">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full touch-none cursor-crosshair"
          />
        </div>
      </div>

      <div className="p-8 grid grid-cols-2 gap-4 pb-12">
        <button
          onClick={handleClear}
          className="py-[14px] px-6 rounded-[10px] bg-transparent border border-app-border text-app-secondary font-semibold active:scale-95 transition-transform text-[14px]"
        >
          Limpar
        </button>
        <button
          onClick={handleSave}
          className="py-[14px] px-6 rounded-[10px] bg-primary text-white font-semibold shadow-md shadow-primary/10 active:scale-95 transition-transform text-[14px]"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};
