import React, {useState} from 'react';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { Container, 
    Header, 
    Title,
    Form,
    Fields,
    TransactionTypes, } from './styles';
import {Alert, Keyboard, Modal, TouchableWithoutFeedback} from 'react-native';
import { CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Form/InputForm';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

interface FormData {
    name: string;
    amount: string;
}

const schema =  Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um número válido')
            .positive('O valor não pode ser negativo').required('O valor é obrigatório')
})

export function Register() {

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const {
        control, handleSubmit, formState: {errors}
    } = useForm({resolver: yupResolver(schema)})

    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false)
    }

    function handleRegister(form : FormData) {
        if(!transactionType) return Alert.alert('Selecione o tipo da transação')
        if(category.key === 'category') return Alert.alert('Selecione a categoria')

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }

        console.log(data)
    }

  return (
    <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
    >
        <Container>
  
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>
                    <InputForm placeholder='Nome' name='name' control={control}
                        autoCapitalize='words' autoCorrect={false }
                        erro={errors.name && errors.name.message}
                    ></InputForm>
                    <InputForm placeholder='Preço' name='amount' control={control}
                        keyboardType='numeric'
                        erro={errors.amount && errors.amount.message}
                    ></InputForm>
                    <TransactionTypes>
                        <TransactionTypeButton type='up' title='Income' 
                            onPress={() => handleTransactionTypeSelect('up')}
                            isActive={transactionType === 'up'}
                        />
                        <TransactionTypeButton type='down' title='Outcome'
                            onPress={() => handleTransactionTypeSelect('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionTypes>

                    <CategorySelectButton title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    ></CategorySelectButton>
                </Fields>
                <Button title='Enviar' onPress={handleSubmit(handleRegister)}></Button>
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                ></CategorySelect>
            </Modal>

        </Container>
    </TouchableWithoutFeedback>
  );
}