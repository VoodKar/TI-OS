/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompanyScreen } from './screens/CompanyScreen';
import { FormScreen } from './screens/FormScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ChatBot } from './components/ChatBot';
import { Company } from './types';

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-app-bg font-sans selection:bg-blue-100">
      <main className="flex-1 flex flex-col relative max-w-md mx-auto w-full shadow-2xl bg-white min-h-screen">
        {showHistory ? (
          <HistoryScreen onBack={() => setShowHistory(false)} />
        ) : !selectedCompany ? (
          <CompanyScreen 
            onSelect={(c) => setSelectedCompany(c)} 
            onOpenHistory={() => setShowHistory(true)}
          />
        ) : (
          <FormScreen 
            company={selectedCompany} 
            onBack={() => setSelectedCompany(null)} 
          />
        )}
        
        {/* Floating Chatbot Assistant */}
        <ChatBot />
      </main>

      {/* Decorative environment info for testing */}
      <div className="hidden lg:block fixed top-6 left-6 max-w-xs space-y-2 opacity-50">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ambiente de Operação</h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Este é um protótipo funcional para técnicos de TI registrarem a entrega de notebooks e desktops com assinatura digital.
        </p>
      </div>
    </div>
  );
}

