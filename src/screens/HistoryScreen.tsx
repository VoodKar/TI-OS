import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, Building2, Hash, FileText, ChevronRight, Share2, Calendar, Download, Upload, Search, X } from 'lucide-react';
import { DeliveryReport } from '../types';
import { cn } from '../lib/utils';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { generateDeliveryPDF } from '../lib/pdf';
import { Logo } from '../components/Logo';

interface Props {
  onBack: () => void;
}

export const HistoryScreen: React.FC<Props> = ({ onBack }) => {
  const [history, setHistory] = useState<DeliveryReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DeliveryReport | null>(null);
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem('deliveryHistory');
    if (saved) {
      const parsed = JSON.parse(saved) as DeliveryReport[];
      setHistory(parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(report => {
      const matchesSearch = report.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.tag.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !filterDate || format(new Date(report.timestamp), 'yyyy-MM-dd') === filterDate;
      
      return matchesSearch && matchesDate;
    });
  }, [history, searchTerm, filterDate]);

  const handleExport = () => {
    if (history.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `historico_entregas_${format(new Date(), 'yyyyMMdd_HHmm')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string) as DeliveryReport[];
        if (!Array.isArray(importedData)) throw new Error('Formato inválido');

        const saved = localStorage.getItem('deliveryHistory');
        const currentHistory = saved ? JSON.parse(saved) as DeliveryReport[] : [];
        
        // Merge and deduplicate by ID
        const merged = [...currentHistory, ...importedData];
        const uniqueMerged = Array.from(new Map(merged.map(item => [item.id, item])).values());
        
        const sorted = uniqueMerged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setHistory(sorted);
        localStorage.setItem('deliveryHistory', JSON.stringify(sorted));
        alert('Histórico importado e mesclado com sucesso!');
      } catch (err) {
        alert('Erro ao importar arquivo. Certifique-se de que é um arquivo JSON válido exportado por este aplicativo.');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handleSharePDF = (report: DeliveryReport) => {
    generateDeliveryPDF(report);
  };

  return (
    <div className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <header className="bg-primary px-8 pt-6 pb-8 sticky top-0 z-20 flex flex-col items-center shadow-lg shadow-primary/10 transition-all overflow-hidden">
        <div className="w-full relative flex justify-center items-center mb-6">
          <button onClick={onBack} className="absolute left-0 p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <Logo className="h-20" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn("p-2.5 rounded-lg transition-all", showFilters ? "bg-white text-primary" : "bg-white/10 text-white hover:bg-white/20")}
                title="Filtrar"
              >
                <Search size={18} />
              </button>
              <label className="p-2.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all cursor-pointer" title="Importar JSON">
                <Upload size={18} />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
            <button 
              onClick={handleExport}
              className="p-2.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all w-full flex justify-center"
              title="Exportar JSON"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-white tracking-widest uppercase">Histórico</h1>
          <div className="h-0.5 w-6 bg-white/20 mx-auto mt-1 rounded-full" />
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[2px] mt-2">Registros de entregas</p>
        </div>
      </header>

      {/* Filters Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-white overflow-hidden px-8 py-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-blue-100 uppercase block mb-1">Pesquisar Empresa / Chamado</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Dibisa, #104255..."
                    className="w-full bg-white/10 border border-white/20 rounded-[10px] px-3 py-2.5 text-sm outline-none focus:bg-white focus:text-app-text transition-all placeholder:text-blue-100/50"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-100">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-48">
                <label className="text-[10px] font-bold text-blue-100 uppercase block mb-1">Data Específica</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-[10px] px-3 py-2.5 text-sm outline-none focus:bg-white focus:text-app-text transition-all"
                />
              </div>
            </div>
            {(searchTerm || filterDate) && (
              <button 
                onClick={() => { setSearchTerm(''); setFilterDate(''); }}
                className="text-xs font-bold text-blue-100 hover:text-white flex items-center gap-1"
              >
                Limpar Filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto -mt-4 bg-app-bg rounded-t-[24px] z-20">
        <div className="p-8 space-y-4 pb-32">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="bg-app-surface p-8 rounded-full border border-app-border shadow-sm">
                <Clock size={48} className="text-app-border" />
              </div>
              <p className="text-app-secondary font-medium">
                {searchTerm || filterDate ? 'Nenhum resultado encontrado.' : 'Nenhuma entrega registrada ainda.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="w-full bg-app-surface p-5 rounded-[16px] border border-app-border shadow-sm flex items-center justify-between group active:bg-blue-50/50 active:scale-[0.98] transition-all text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-app-secondary uppercase tracking-wider">
                    <Calendar size={12} className="text-primary" />
                    {format(new Date(report.timestamp), "dd MMM yyyy", { locale: ptBR })}
                  </div>
                  <h3 className="font-bold text-app-text text-[16px]">{report.companyName}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-app-secondary font-medium flex items-center gap-1">
                      <Hash size={12} />
                      {report.ticketNumber}
                    </span>
                    <span className="text-xs text-primary font-bold bg-primary-light px-2 py-0.5 rounded-md">
                      {report.equipmentType}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-app-border group-hover:text-primary transition-colors" size={20} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[24px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 pb-4 flex justify-between items-start">
                <div className="border-l-4 border-primary pl-5">
                  <h2 className="text-xl font-bold text-app-text">Detalhes da Entrega</h2>
                  <p className="text-app-secondary text-xs uppercase tracking-widest font-bold mt-1">
                    {format(new Date(selectedReport.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-app-bg p-2 rounded-full text-app-secondary hover:text-app-text transition-colors"
                >
                  <ArrowLeft size={18} className="rotate-90 sm:rotate-0" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-app-bg p-4 rounded-[12px]">
                    <span className="text-[10px] font-bold text-app-secondary uppercase block mb-1">Empresa</span>
                    <span className="font-bold text-app-text text-sm flex items-center gap-2">
                       <Building2 size={14} className="text-primary"/> {selectedReport.companyName}
                    </span>
                  </div>
                  <div className="bg-app-bg p-4 rounded-[12px]">
                    <span className="text-[10px] font-bold text-app-secondary uppercase block mb-1">Chamado</span>
                    <span className="font-bold text-app-text text-sm flex items-center gap-2">
                       <Hash size={14} className="text-primary"/> {selectedReport.ticketNumber}
                    </span>
                  </div>
                </div>

                <div className="bg-app-bg p-4 rounded-[12px]">
                  <span className="text-[10px] font-bold text-app-secondary uppercase block mb-1">Equipamento</span>
                  <p className="font-bold text-app-text text-sm">
                    {selectedReport.equipmentType} - <span className="text-primary">{selectedReport.tag}</span>
                  </p>
                </div>

                <div className="bg-app-bg p-4 rounded-[12px]">
                  <span className="text-[10px] font-bold text-app-secondary uppercase block mb-1">Recebedor</span>
                  <p className="font-bold text-app-text text-sm">
                    {selectedReport.recipientName}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-app-secondary uppercase tracking-widest px-1">Assinatura Coletada</label>
                  <div className="bg-white border border-app-border rounded-[12px] p-4 flex items-center justify-center">
                    <img
                      src={selectedReport.signature}
                      alt="Assinatura"
                      className="max-h-32 object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 pt-4 bg-slate-50 border-t border-app-border">
                <button
                  onClick={() => handleSharePDF(selectedReport)}
                  className="w-full flex items-center justify-center gap-3 py-[14px] bg-primary text-white rounded-[10px] font-bold active:scale-95 transition-all shadow-md shadow-primary/10"
                >
                  <FileText size={20} />
                  Baixar / Compartilhar PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
