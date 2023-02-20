import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { Image, ScrollView } from "react-native"
import { Button, Card, Text, TextInput, Checkbox, ActivityIndicator, useTheme } from "react-native-paper"
import * as SecureStore from 'expo-secure-store';
import jwtDecode from "jwt-decode";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default Login = ({navigation}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()

    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberUser, setRememberUser] = useState(false)
    const [activeSession, setActiveSession] = useState(undefined);

    async function getSession() {
        const session = await fetch(
            `https://966b-2806-261-498-9a0d-8d55-c415-f13c-a61a.ngrok.io/auth/login`,
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
            respuesta => respuesta.ok ? respuesta.json() : null
        ).catch(
            error => null
        )

        if(session) {
            if(rememberUser) {
                await SecureStore.setItemAsync("token", session.token)
            }

            await SecureStore.setItemAsync("user", JSON.stringify(session.user))

            navigation.replace("Dashboard", {
                user: session.user
            })
        }
    }

    useEffect(() => {
        const getActualSession = async _ => {
            const token = await SecureStore.getItemAsync("token")

            if(token) {
                const payload = jwtDecode(token)
                
                if(payload.exp < Date.now()) {
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
                        <VStack p={10} pb={50} spacing={50}>
                            
                            <Flex center>
                                <Image source={require('../../assets/logo.png')} style={{width: 150, height: 150}}/>
                            </Flex>

                            <VStack spacing={10}>
                                <TextInput mode="outlined" label="Registro, email o teléfono" onChangeText={setCredential}/>
                                <TextInput mode="outlined" label="Contraseña" onChangeText={setPassword} secureTextEntry={!showPassword} right={<TextInput.Icon icon="eye" onPress={_ => {setShowPassword(!showPassword)}}/>}/>
                                <HStack items="center">
                                    <Checkbox status={rememberUser ? "checked" : "unchecked"} onPress={_ => {setRememberUser(!rememberUser)}}/>
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
                            </VStack>
                        </VStack>
                    </ScrollView>
                )
            }
        </Flex>
    )
}