import { useState } from 'react';
import Modal from 'react-modal';
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { NewTransactionsModal } from './components/NewTransactionsModal';
import { TransactionsProvider } from './hooks/useTransactions';

import { GlobalStyle } from "./styles/global";


export function App() {
  const [isNewTransactionsModalOpen, setIsNewTransactionsModalOpen] = useState(false);

  function handleOpenNewTransactionModal() {
    setIsNewTransactionsModalOpen(true);
}

function handleCloseNewTransactionModal() {
    setIsNewTransactionsModalOpen(false);
}
  return (
    //o provider obrigatóriamente precisa receber um value (valor do contexto)
    //agora posso consumir o conteúdo desse contexto por qualquer um dos components abaixo
    //depois que mudar para TransactionsProvider será necessário ser passado como children
    <TransactionsProvider>
      
      <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />

      <Dashboard />
      <NewTransactionsModal 
      isOpen={isNewTransactionsModalOpen}
      onRequestClose={handleCloseNewTransactionModal}/>

      <GlobalStyle />
    </TransactionsProvider>
  );
}
