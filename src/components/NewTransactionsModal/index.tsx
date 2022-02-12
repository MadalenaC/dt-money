
import { FormEvent, useState, useContext } from 'react';
import Modal from 'react-modal';
import incomeImg from '../../assets/income.svg';
import outcomeImg from '../../assets/outcome.svg';
import closeImg from '../../assets/close.svg';

import { api } from '../../services/api';

import { Container, TransactionTypeContainer, RadioBox } from './styles';
import { useTransactions } from '../../hooks/useTransactions';


interface NewTransactionsProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

export function NewTransactionsModal({ isOpen, onRequestClose}: NewTransactionsProps) {
    //insere o contexto para poder adicionar as transações
    const { createTransaction} = useTransactions();

    const [title, setTitle] = useState(''); //anotando os dados de cada input
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('deposit');
    
     async function handleCreateNewTransaction(event: FormEvent) {//prevenindo que não atualize a página a cada informação submetida
        event.preventDefault();

        await createTransaction ({
            title,
            amount,
            category,
            type,
        })

        //fecha o modal caso a transação de certo
        setTitle('');
        setAmount(0);
        setCategory('');
        setType('deposity');
        onRequestClose();
    }
        
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Container onSubmit={handleCreateNewTransaction}>
                <h2>Cadastrar transação</h2>
                
                <input 
                    placeholder='Título' 
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                />

                <input 
                    type='number'
                    placeholder='Valor' 
                    onChange={event => setAmount(Number(event.target.value))}//terá acesso ao valor digitado, salvando cada novo dado no title
                />

                <TransactionTypeContainer>
                    <RadioBox 
                        type='button'
                        onClick={() => {setType('deposit'); }}
                        isActive={type === 'deposit'}
                        activeColor='green'
                    >
                        <img src={incomeImg} alt="Entrada" />
                        <span>Entrada</span>
                    </RadioBox>

                    <RadioBox 
                        type='button'
                        onClick={() => {setType('withdraw'); }}
                        isActive={type === 'withdraw'}
                        activeColor='red'
                    >
                        <img src={outcomeImg} alt="Saída" />
                        <span>Saída</span>
                    </RadioBox>
                </TransactionTypeContainer>

                <input 
                    placeholder='Categoria' 
                    value={category}
                    onChange={event => setCategory(event.target.value)}
                />

                <button type='submit'>
                    Cadastrar
                </button>
            </Container> 

        </Modal>
    );
}