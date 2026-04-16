import React, { useState, useEffect } from 'react';
import { Plus, Building2, ChevronRight, Save, Clock, Trash2, X } from 'lucide-react';
import { Company } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onSelect: (company: Company) => void;
  onOpenHistory: () => void;
}

export const CompanyScreen: React.FC<Props> = ({ onSelect, onOpenHistory }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('companies');
    const initial = [
      { id: '1', name: 'Dibisa' },
      { id: '2', name: 'Drogaria Americana' },
      { id: '3', name: 'Fusão Ligas' },
    ];
    if (saved) {
      setCompanies(JSON.parse(saved).sort((a: Company, b: Company) => a.name.localeCompare(b.name)));
    } else {
      setCompanies(initial.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, []);

  const handleAdd = () => {
    if (!newCompanyName.trim()) return;
    const newCompany: Company = {
      id: Date.now().toString(),
      name: newCompanyName.trim()
    };
    const updated = [...companies, newCompany].sort((a, b) => a.name.localeCompare(b.name));
    setCompanies(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    setNewCompanyName('');
    setIsAdding(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = companies.filter(c => c.id !== id);
    setCompanies(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    setDeletingId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <header className="bg-primary px-8 pt-10 pb-8 sticky top-0 z-10 transition-all flex justify-between items-start shadow-lg shadow-primary/10">
        <div className="flex flex-col gap-4">
          <img 
            src="/logo.png" 
            alt="TI do Brasil" 
            className="h-12 w-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">OS Digital</h1>
            <p className="text-blue-100 text-sm mt-1">Selecionar Empresa</p>
          </div>
        </div>
        <button 
          onClick={onOpenHistory}
          className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors active:scale-90"
          title="Ver Histórico"
        >
          <Clock size={22} />
        </button>
      </header>

      <div className="flex-1 p-8 space-y-4 pb-32 -mt-4 bg-app-bg rounded-t-[24px] z-20">
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-[16px] px-6 bg-white border border-primary/20 text-primary rounded-[14px] font-bold shadow-sm shadow-primary/5 active:scale-95 transition-all mb-4"
        >
          <Plus size={20} />
          Nova Empresa
        </button>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-[16px] border border-primary/10 shadow-md shadow-primary/5 overflow-hidden mb-6"
            >
              <label className="block text-[11px] font-bold text-app-secondary uppercase tracking-[1px] mb-3">Nome da Empresa</label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="flex-1 bg-app-bg border border-app-border rounded-[10px] px-4 py-[14px] text-app-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all font-semibold text-[15px]"
                  placeholder="Ex: Dibisa..."
                />
                <button
                  onClick={handleAdd}
                  className="bg-primary text-white px-5 rounded-[10px] hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
                >
                  <Save size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-3">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => onSelect(company)}
              className="group w-full flex items-center justify-between p-[4px] pl-[20px] bg-app-surface rounded-[16px] border border-app-border shadow-sm active:bg-blue-50/50 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-4 py-[16px]">
                <div className="p-3 rounded-xl bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Building2 size={24} />
                </div>
                <span className="font-bold text-app-text text-[16px]">{company.name}</span>
              </div>
              
              <div className="flex items-center">
                <AnimatePresence mode="wait">
                  {deletingId === company.id ? (
                    <motion.div 
                      key="confirm"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      className="flex items-center gap-1 pr-2"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletingId(null); }}
                        className="p-3 text-app-secondary hover:text-app-text transition-colors"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(company.id, e)}
                        className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeletingId(company.id); }}
                        className="p-4 text-app-border hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="pr-5">
                        <ChevronRight className="text-app-border group-hover:text-primary transition-colors" size={20} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
