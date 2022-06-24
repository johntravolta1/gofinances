> SDK location not found. Define location with an ANDROID_SDK_ROOT environment variable or by setting the sdk.dir path in your project's local properties file at 'E:\CursosRocketSeat\Ignite\reactnative\02-primeiro-app\gofinances\android\local.properties'.
## para corrigir o erro, foi preciso criar um arquivo local.properties na pasta android e colocar:
sdk.dir=E:\\Android\\Sdk

## para iniciar, abra o emulador e digite: 
expo start

e peça para iniciar o android. Acho que isso substitui o comando 'expo android'


Aula 'RectButton e BorderlessButton', minuto 3:10:33 => em components/Form/Button/styles.ts
> quando eu coloco o ReactButton ou o BorderlessButton do 'react-native-gesture-handler' no lugar do TouchableOpacity, o botão não funciona. 
?: Por que tive que instalar o react-native-gesture-handler com o comando 'expo install react-native-gesture-handler', sendo que ele disse que não seria preciso instalar?
=> ler a documentação e pesquisar erro parecido no Troubleshooting (github):
https://docs.swmansion.com/react-native-gesture-handler/docs/api/components/buttons
## Para corrigir o erro, foi preciso envolver o Container do botão do gesture-handler (RectButton ou BorderlessButton), com o elemento GestureHandlerRootView from 'react-native-gesture-handler' (https://github.com/software-mansion/react-native-gesture-handler/issues/699)

> useContext: disponibilizar um valor pra toda aplicação. Vc usa o createcontext e cria um valor no arquivo 1, e usa o useContext para acessar esse valor no arquivo 2.
arquivo1:
export const AuthContext = createcontext(['Fernando'])

arquivo2: const data = useContext(AuthContext)
consolo.log(data) => 'Fernando'

Obs: Também será preciso envolver o componente do arquivo2 no AuthContext: 
<AuthContext.Provider value={['Fernando']}/>
    <SiginIn/>
</AuthContext.Provider>
E, para facilitar e não precisar utilizarmos o .Provider, criamos uma função que já exporta como AuthContext.Provider cujo componente interno será do tipo ReactNode =>
interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({children}:AuthProviderProps) {
    return(
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )
}