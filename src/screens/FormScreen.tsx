import React, { useState } from 'react';
import { ArrowLeft, Monitor, Laptop, Tag, Hash, FileSignature, CheckCircle2, Share2, MessageCircle } from 'lucide-react';
import { Company, EquipmentType, DeliveryReport } from '../types';
import { SignaturePadComponent } from '../components/SignaturePad';
import { generateDeliveryPDF } from '../lib/pdf';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  company: Company;
  onBack: () => void;
}

export const FormScreen: React.FC<Props> = ({ company, onBack }) => {
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('Desktop');
  const [tag, setTag] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [report, setReport] = useState<DeliveryReport | null>(null);
  const [signatureMsg, setSignatureMsg] = useState(false);

  const handleSubmit = () => {
    if (!tag || !ticketNumber || !signature || !recipientName) {
      alert('Por favor, preencha todos os campos e assine o documento.');
      return;
    }

    const newReport: DeliveryReport = {
      id: Date.now().toString(),
      companyName: company.name,
      equipmentType,
      tag,
      ticketNumber,
      recipientName,
      signature,
      timestamp: new Date().toISOString()
    };

    setReport(newReport);

    // Save to history
    const history = JSON.parse(localStorage.getItem('deliveryHistory') || '[]');
    localStorage.setItem('deliveryHistory', JSON.stringify([...history, newReport]));
  };

  const handleSharePDF = () => {
    if (report) {
      generateDeliveryPDF(report);
    }
  };

  const handleShareWhatsApp = () => {
    if (!report) return;
    
    const text = `*Comprovante de Entrega - OS Digital*\n\n` +
                 `🏷️ *TAG:* ${report.tag}\n` +
                 `🎫 *Chamado:* ${report.ticketNumber}\n` +
                 `👤 *Recebedor:* ${report.recipientName}\n` +
                 `🏢 *Empresa:* ${report.companyName}\n` +
                 `📅 *Data:* ${format(new Date(report.timestamp), "dd/MM/yyyy HH:mm")}\n\n` +
                 `Qualquer dúvida estou à disposição.`;
                 
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (report) {
    return (
      <div className="flex-1 flex flex-col bg-app-bg min-h-screen px-8 py-12 items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#DEF7EC] p-6 rounded-full text-[#03543F] mb-6"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        
        <div className="inline-block bg-[#DEF7EC] text-[#03543F] px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-4 tracking-wider">
          ✓ Entrega Confirmada
        </div>

        <h2 className="text-2xl font-bold text-app-text mb-2">Sucesso!</h2>
        <p className="text-app-secondary text-sm mb-12">Entrega registrada e comprovante gerado com sucesso.</p>

        <div className="w-full space-y-3">
          <button
            onClick={handleSharePDF}
            className="w-full py-[14px] px-6 bg-primary text-white rounded-[10px] font-semibold active:scale-95 transition-all"
          >
            Compartilhar PDF
          </button>
          
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-[14px] px-6 bg-transparent border border-primary text-primary rounded-[10px] font-semibold active:scale-95 transition-all"
          >
            Enviar via WhatsApp
          </button>

          <button
            onClick={onBack}
            className="w-full py-5 text-app-secondary text-sm font-semibold hover:text-app-text transition-colors pt-4"
          >
            Nova Entrega
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <header className="bg-primary px-8 pt-10 pb-8 sticky top-0 z-10 shadow-lg shadow-primary/10">
        <div className="flex flex-col gap-6">
          <img 
            src="/logo.png" 
            alt="TI do Brasil" 
            className="h-10 w-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{company.name}</h1>
              <p className="text-blue-100 text-sm">Registro de Entrega</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto -mt-4 bg-app-bg rounded-t-[24px] z-20">
        <div className="p-8 space-y-8 pb-32">
          {/* Equipment Type */}
          <section className="space-y-4">
            <label className="text-[11px] font-bold text-app-secondary uppercase tracking-[1px] px-1">Tipo de Equipamento</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEquipmentType('Desktop')}
                className={cn(
                  "p-5 rounded-[16px] border-2 transition-all flex flex-col items-center gap-3",
                  equipmentType === 'Desktop' 
                    ? "bg-primary-light border-primary text-primary shadow-md shadow-primary/10" 
                    : "bg-app-surface border-app-border text-app-secondary hover:border-primary/30"
                )}
              >
                <Monitor size={32} />
                <span className="font-bold text-sm">Desktop</span>
              </button>
              <button
                onClick={() => setEquipmentType('Notebook')}
                className={cn(
                  "p-5 rounded-[16px] border-2 transition-all flex flex-col items-center gap-3",
                  equipmentType === 'Notebook' 
                    ? "bg-primary-light border-primary text-primary shadow-md shadow-primary/10" 
                    : "bg-app-surface border-app-border text-app-secondary hover:border-primary/30"
                )}
              >
                <Laptop size={32} />
                <span className="font-bold text-sm">Notebook</span>
              </button>
            </div>
          </section>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-app-secondary uppercase tracking-[1px] px-1">TAG do Equipamento (Apenas Números)</label>
              <input
                type="text"
                inputMode="numeric"
                value={tag}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d+$/.test(val)) setTag(val);
                }}
                className="w-full bg-app-surface border border-app-border rounded-[12px] px-4 py-[16px] font-bold text-app-text placeholder:text-app-secondary/30 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-[15px] shadow-sm"
                placeholder="Ex: 8842"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-app-secondary uppercase tracking-[1px] px-1">Número do Chamado</label>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[a-zA-Z0-9]+$/.test(val)) setTicketNumber(val);
                }}
                className="w-full bg-app-surface border border-app-border rounded-[12px] px-4 py-[16px] font-bold text-app-text placeholder:text-app-secondary/30 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-[15px] shadow-sm"
                placeholder="Ex: INC104255"
              />
            </div>
          </div>

          {/* Recipient Name */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-app-secondary uppercase tracking-[1px] px-1">Nome de quem recebe</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-[12px] px-4 py-[16px] font-bold text-app-text placeholder:text-app-secondary/30 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-[15px] shadow-sm"
              placeholder="Ex: João Silva"
            />
          </div>

          {/* Signature */}
          <div className="pt-2">
            <button
              onClick={() => setShowSignature(true)}
              className={cn(
                "w-full flex items-center justify-center gap-3 py-6 px-6 rounded-[16px] font-bold transition-all border-2 border-dashed",
                signature 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-app-surface border-app-border text-app-secondary hover:border-primary/30"
              )}
            >
              <FileSignature size={24} />
              {signature ? "Assinatura Capturada" : "Toque para assinar"}
            </button>
            
            <AnimatePresence>
              {signatureMsg && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 text-center"
                >
                  <span className="bg-[#DEF7EC] text-[#03543F] px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    ✓ Sucesso
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-[20px] rounded-[14px] font-black text-[18px] active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Confirmar Entrega
          </button>
        </div>
      </div>

      {showSignature && (
        <SignaturePadComponent 
          onConfirm={(sig) => {
            setSignature(sig);
            setShowSignature(false);
            setSignatureMsg(true);
            setTimeout(() => setSignatureMsg(false), 3000);
          }}
          onClear={() => {
            setSignature(null);
          }}
          onCancel={() => setShowSignature(false)}
        />
      )}
    </div>
  );
};
