import React, { useCallback, useEffect, useState } from 'react'
import {Container, 
    Header, 
    UserInfo, 
    Photo, 
    User, 
    UserGreeting, 
    UserName, 
    UserWrapper, 
    Icon, 
    HighlightCards,
Transactions,
Title,
TransactionList,
LogoutButton,
LoadContainer
    } from './styles'
import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import {useTheme} from 'styled-components'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction?: string;
}

interface HighLightData {
    entries:HighLightProps;
    expensives: HighLightProps;
    total:HighLightProps;
    
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighLightData] = useState<HighLightData>();

    const theme = useTheme()

    function getLastTransactionDate(collection: DataListProps[], type: 'up' | 'down') {

        const lastTransactions = new Date(Math.max.apply(Math, 
            collection.filter(t  => t.type === type)
            .map(t => new Date(t.date).getTime())
            ))

        return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {month: 'long'})}`
    }


    async function loadTransaction() {
        const dataKey = '@gofinances:transactions';
        // AsyncStorage.removeItem(dataKey);
        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];


        let entriesTotal = 0;
        let expensivesTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if(item.type === 'up') {
                entriesTotal += Number(item.amount)
            } else {
                expensivesTotal += Number(item.amount);
            }
            
            const amount = Number(item.amount).toLocaleString('pt-BR',{
                style: 'currency',
                currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        })

        setTransactions(transactionsFormatted)

        const lastTransactionEntries = getLastTransactionDate(transactions, 'up')
        const lastTransactionExpenses = getLastTransactionDate(transactions, 'down')
        const totalInterval = `01 a ${lastTransactionExpenses}`


        const total = entriesTotal - expensivesTotal

        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: `Última entrada dia ${lastTransactionEntries}`
            },
            expensives: {
                amount: expensivesTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction:`Última saída dia ${lastTransactionExpenses}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                lastTransaction: totalInterval
            }
        })

        setIsLoading(false);
    }

    useEffect(() => {
        loadTransaction();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransaction();
        }, []))

    return (

        <Container>
           {     
           isLoading 
           ? 
            <LoadContainer>
                <ActivityIndicator color={theme.colors.primary} size='large'/>
            </LoadContainer> 
            : 
           <>
            <Header>
                <UserWrapper> 
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/71152841?s=40&v=4'}}></Photo>

                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Fernando</UserName>
                        </User>
                    </UserInfo>
                    <GestureHandlerRootView>    
                        <LogoutButton onPress={() => {}}>
                            <Icon name='power'></Icon>
                        </LogoutButton>
                    </GestureHandlerRootView>
                </UserWrapper>

            </Header>

                <HighlightCards 

                >
                    <HighlightCard 
                        type='up'
                        title='Entradas' 
                        amount={highlightData?.entries.amount}
                        lastTransaction={highlightData?.entries.lastTransaction}
                    />
                    <HighlightCard 
                        type='down'
                        title='Saídas' 
                        amount={highlightData?.expensives.amount} 
                        lastTransaction={highlightData?.expensives.lastTransaction}
                    />
                    <HighlightCard 
                        type='total'
                        title='Total' 
                        amount={highlightData?.total.amount} 
                        lastTransaction={highlightData?.total.lastTransaction}
                    />
                </HighlightCards>

                <Transactions>
                    <Title>Listagem</Title>
                    
                    <TransactionList
                        data= {transactions}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <TransactionCard data = {item}/>} 

                    ></TransactionList>

            
                </Transactions>
            </>
            }
                
        </Container>
    )
}




    
    // const data: DataListProps[] = [
        //     {
            //         id: '1',
            //         type: 'positive',
            //         name:'Desenvolvimento de site',
            //         amount:'R$12.000,00',
            //         category:{
                //             name: 'Vendas', 
                //             icon: 'dollar-sign'
                //         },
                //         date:'01/04/2022',
                //     },
                //     {
                    //         id: '2',
                    //         type: 'negative',
                    //         name:'Hamburgeria pizzy',
                    //         amount:'R$200,00',
                    //         category:{
                        //             name: 'Alimentação', 
                        //             icon: 'coffee'
                        //         },
                        //         date:'13/04/2022',
                        //     },
                        //     {
                            //         id: '3',
                            //         type: 'negative',
                            //         name:'Aluguel apartamento',
                            //         amount:'R$5.200,00',
                            //         category:{
                                //             name: 'Casa', 
                                //             icon: 'shopping-bag'
                                //         },
                                //         date:'22/04/2022',
                                //     }
                                // ]