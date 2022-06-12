import React, { useCallback, useEffect, useState } from "react";
import { HistoryCard } from "../../components/HistoryCar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Container, Header, Title, Content, ChartContainer,
Month,
MonthSelect,
MonthSelectButton,
MonthSelectIcon,
} from './styles'
import { categories } from "../../utils/categories";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";

import {useTheme } from 'styled-components'
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadContainer } from "../Dashoboard/styles";
import { ActivityIndicator } from "react-native";
import {useFocusEffect} from '@react-navigation/native'
export interface TransactionCardProps {
    type: 'up' | 'down';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {
    const theme = useTheme()

    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategory, setTotalByCategory] = useState<CategoryData[]>([]);

    function handleDateChange(action: 'next' | 'prev') {
        if(action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        }
        else {
            setSelectedDate(addMonths(selectedDate, -1))
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = '@gofinances:transactions';
        const response =  await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expenses = responseFormatted.filter((expenses: TransactionCardProps) => expenses.type === 'down'
            && new Date(expenses.date).getMonth() === selectedDate.getMonth()
            && new Date(expenses.date).getFullYear() === selectedDate.getFullYear()
        )
        const expensesTotal = expenses.reduce((acc:number , e:TransactionCardProps) => {
            return acc + Number(e.amount);
        }, 0);
        const totalByCategory : CategoryData[] = [];

        categories.forEach(c => {
            let categorySum = 0;

            expenses.forEach((e: TransactionCardProps) => {
                if(e.category === c.key) {
                    categorySum += Number(e.amount);
                }
            })

            if(categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
                
                const percent = `${(categorySum/expensesTotal*100).toFixed(0)}%`

                totalByCategory.push({
                    key: c.key,
                    name: c.name,
                    color: c.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                })
            }
        })
        setTotalByCategory(totalByCategory)
        setIsLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadData()
        }, [selectedDate]))

    return(
        <Container>
               <Header>
                    <Title>Resumo por categoria</Title>
                </Header>
            {
                isLoading ?       
                <LoadContainer>
                    <ActivityIndicator color={theme.colors.primary} size='large'/>
                </LoadContainer>  
                
                :
                <>

                    <Content showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight()
                        }}
                    >
                        <MonthSelect>
                                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                                    <MonthSelectIcon  name='chevron-left'></MonthSelectIcon>
                                </MonthSelectButton>

                            <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

                                <MonthSelectButton onPress={() => handleDateChange('next')}>
                                    <MonthSelectIcon name='chevron-right'></MonthSelectIcon>
                                </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie
                                data={totalByCategory}
                                colorScale={totalByCategory.map(c=> c.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={60}
                                x='percent'
                                y='total'
                            ></VictoryPie>
                        </ChartContainer>

                        {
                            totalByCategory.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                                ))
                        
                        }
                    </Content>
            </>
            }
           
        </Container>
    )
}