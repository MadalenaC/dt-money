
import { createContext, useState, useEffect, ReactNode, useContext} from 'react'
import { api } from '../services/api';



interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

//Uma das formas de filtrar as indformações
// interface TransactionInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
// }

type TransactionsInput = Omit<Transaction, 'id' | 'createdAt'>;

//type TransactionsInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>;

//informando que o as informações do contexto podem ser acessadas por children
interface TransactionsProviderProps {
    //aceita qualquer tipo de conteúdo válido para js
    children: ReactNode;
}

//informo qual o conteúdo do meu contexto
interface TransactionsContextData {
    //array de transactions 
    transactions: Transaction[];
    //função que vai receber uma transactions e devolver vazio
    createTransaction: (transaction: TransactionsInput) => Promise<void>;
}

//criando um contexto
//necessário informar qual o tipo de informação que será carregado
const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    ); 
    //vamos passar um valor default para o context, um valor que o createContext vai inicializar
//quando criamos um contexto podemos acessar qualquer componente dentro da aplicação
//mas para isso precisa inserir um Provider
//no caso posso inserir o provider dentro do App


//vamos exportar o TransactionsProvider, que vai ser um componente

export function TransactionsProvider({ children } : TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    useEffect (() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, []);

    //criando função para receber os dados do transactions
    //é necessário informar o tipo do transaction
    //precisa ter acesso a função de criar a transaction, o contexto precisa retornar essa função também
    //torna função assincrona
    async function createTransaction(transactionInput: TransactionsInput) {
    
        const response = await api.post('/transactions', { 
            ...transactionInput,
            createdAt: new Date(),
        })

        const { transaction } = response.data;

        setTransactions([
            //copiando os dados anteriores
            ...transactions,
            transaction,
        ]);
     }
   

    //aqui vamos subistituir o transactionsProvider do App para o transactions que criamos aqui
    //toda logiva vai ficar dentro desse provider
    return (
        //o contexto precisa retornar a função, a primeira chave indica que quero incluir javascritp e a outra chave inclui objeto
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}
