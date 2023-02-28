import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { Image, ScrollView } from "react-native"
import { Button, Card, Text, TextInput, Checkbox, ActivityIndicator, useTheme, Switch } from "react-native-paper"
import * as SecureStore from 'expo-secure-store'
import jwtDecode from "jwt-decode"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Constants from "expo-constants"
import LoadingDialog from "../Shared/Dialog";
import ErrorDialog from "../Shared/Dialog";

export default Login = ({navigation}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()
    const localhost = Constants.expoConfig.extra.API_LOCAL

    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberUser, setRememberUser] = useState(false)
    const [activeSession, setActiveSession] = useState(undefined)
    const [loadingDialogState, setLoadingDialogState] = useState(false)
    const [errorDialogState, setErrorDialogState] = useState(false)
    const [errorMessage, setErrorMessage] = useState(['', ''])

    const changeStateLoadingDialog = _ => setLoadingDialogState(!loadingDialogState)
    const changeStateErrorDialog = _ => setErrorDialogState(!errorDialogState)

    async function getSession() {
        changeStateLoadingDialog()

        let payload = ""

        const session = await fetch(
            `${localhost}/auth/login`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    credential,
                    password,
                    keepAlive: rememberUser
                })
            }
        ).then(
            respuesta => respuesta.ok ? respuesta.json() : respuesta.status
        ).catch(
            _ => null
        )

        if(session && isNaN(session)) {
            payload = jwtDecode(session.token)
        } else {
            setLoadingDialogState(false)
            changeStateErrorDialog()
            switch (session) {
                case 400:
                    setErrorMessage(['Ocurrió un problema', 'No pudimos iniciar sesión, revisa tu usuario y contraseña y vuelve a intentar'])
                    break;
            
                default:
                    setErrorMessage(['Ocurrió un problema', 'No pudimos iniciar sesión, revisa tu conexión a internet y vuelve a intentar'])
                    break;
            }
            return
        }

        const profile = await fetch(
            `${localhost}/profile/${payload.register}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`
                }
            }
        ).then(
            response => response.ok ? response.json() : response.status
        ).catch(
            error => null
        )

        if(session && profile && isNaN(profile)) {
            console.log(session.token, profile.user);
            
            await SecureStore.setItemAsync("token", session.token)
            await SecureStore.setItemAsync("user", JSON.stringify(profile.user))

            setLoadingDialogState(false)

            navigation.replace("Dashboard")
        } else {
            setLoadingDialogState(false)
            changeStateErrorDialog()
            switch (session) {
                case 400:
                    setErrorMessage(['Ocurrió un problema', 'No pudimos iniciar sesión, revisa tu usuario y contraseña y vuelve a intentar'])
                    break;
            
                default:
                    setErrorMessage(['Ocurrió un problema', 'No pudimos iniciar sesión, revisa tu conexión a internet y vuelve a intentar'])
                    break;
            }
            return
        }
    }

    useEffect(() => {
        const getActualSession = async _ => {
            const token = await SecureStore.getItemAsync("token")

            if(token) {
                const payload = jwtDecode(token)
                
                if(payload.exp > Math.floor(Date.now() / 1000)) {
                    setTimeout(_ => {
                        setActiveSession(true)
                        navigation.replace("Dashboard")
                    }, 3000)
                } else {
                    setActiveSession(false)
                }
            } else {
                setActiveSession(false)
            }
        }

        if(activeSession === undefined) {
            getActualSession()
        }

        console.log(activeSession)

    }, [activeSession])
    
    return (
        <Flex fill pt={insets.top}>
            {
                activeSession === undefined ? (
                    <Flex fill center>
                        <ActivityIndicator animating={true} color={theme.colors.primary} size={75} />
                    </Flex>
                ) : (
                    <ScrollView>
                        <VStack p={20} pb={50} spacing={50}>
                            
                            <Flex center>
                                <Image source={require('../../assets/logo.png')} style={{width: 150, height: 150}}/>
                            </Flex>

                            <VStack spacing={10}>
                                <TextInput mode="outlined" label="Registro, email o teléfono" autoComplete="username" onChangeText={setCredential}/>
                                <TextInput mode="outlined" label="Contraseña" autoComplete="password" onChangeText={setPassword} secureTextEntry={!showPassword} right={<TextInput.Icon icon="eye" onPress={_ => {setShowPassword(!showPassword)}}/>}/>
                                <HStack items="center" spacing={10}>
                                    <Switch value={rememberUser} onValueChange={_ => {setRememberUser(!rememberUser)}}/>
                                    <Text variant="bodyMedium">
                                        Mantaner la sesión abierta
                                    </Text>
                                </HStack>
                            </VStack>

                            <VStack spacing={10}>
                                <Button mode="contained" onPress={_ => {
                                    getSession()
                                }}>
                                    Iniciar sesión
                                </Button>

                                <Button mode="text" onPress={_ => {
                                    navigation.navigate("ResetPassword")
                                }}>
                                    Recuperar contraseña
                                </Button>

                                <Button onPress={_ => {
                                    navigation.navigate("AddArea", {
                                        usuario: "Owen"
                                    })
                                }}>
                                    Prueba
                                </Button>
                            </VStack>
                        </VStack>
                    </ScrollView>
                )
            }

            <LoadingDialog permanente={false} cargando={true} handler={[loadingDialogState, changeStateLoadingDialog]}/>

            <ErrorDialog titulo={errorMessage[0]} descripcion={errorMessage[1]} /*icono="alert"*/ handler={[errorDialogState, changeStateErrorDialog]} botonUno={['Aceptar']}/>
            
        </Flex>
    )
}