import React from 'react'
import { Text} from 'react-native'



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
LogoutButton
    } from './styles'
import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

export interface DataListProps extends TransactionCardProps {
    id: string;
}


export function Dashboard() {

    const data: DataListProps[] = [
    {
        id: '1',
        type: 'positive',
        title:'Desenvolvimento de site',
        amount:'R$12.000,00',
        category:{
            name: 'Vendas', 
            icon: 'dollar-sign'
        },
        date:'01/04/2022',
    },
    {
        id: '2',
        type: 'negative',
        title:'Hamburgeria pizzy',
        amount:'R$200,00',
        category:{
            name: 'Alimentação', 
            icon: 'coffee'
        },
        date:'13/04/2022',
    },
    {
        id: '3',
        type: 'negative',
        title:'Aluguel apartamento',
        amount:'R$5.200,00',
        category:{
            name: 'Casa', 
            icon: 'shopping-bag'
        },
        date:'22/04/2022',
    }
]

    return (
        <Container>
            <Header>
                <UserWrapper> 
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/71152841?s=40&v=4'}}></Photo>

                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Fernando</UserName>
                        </User>
                    </UserInfo>

                    {/* <LogoutButton onPress={() => {}}> */}
                        <Icon name='power'></Icon>
                    {/* </LogoutButton> */}
                </UserWrapper>

            </Header>

            <HighlightCards 

            >
                <HighlightCard 
                    type='up'
                    title='Entradas' 
                    amount='R$17.400,00' 
                    lastTransaction='Última entrada dia 13 de abril'
                />
                <HighlightCard 
                    type='down'
                    title='Saídas' 
                    amount='R$1.259,00' 
                    lastTransaction='Última entrada dia 03 de abril'
                />
                <HighlightCard 
                    type='total'
                    title='Total' 
                    amount='R$16.141,00' 
                    lastTransaction='01 a 16 de abril'
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                
                <TransactionList
                    data= {data}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <TransactionCard data = {item}/>} 

                ></TransactionList>

          
            </Transactions>
        </Container>
    )
}