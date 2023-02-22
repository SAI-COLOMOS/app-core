import { Flex, VStack } from "@react-native-material/core"
import { useState, useEffect } from "react"
import { Text, Button, TextInput, Portal, Dialog } from "react-native-paper"
import Constants from "expo-constants";
import CreateForm from "../Shared/CreateForm"
import Modal from "../Shared/Modal";

export default ResetPassword = ({navigation}) => {
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const [credential, setCredential] = useState("")
    const [loading, setLoading] = useState(false)
    const [modalComplete, setModalComplete] = useState(false)
    const [modalError, setModalError] = useState(false)

    const getRecovery = async () => {
        setLoading(true)

        const request = await fetch(
            `${localhost}/auth/recovery`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify({
                    credential
                })
            }
        ).then(
            response => response.status
        ).catch(
            _ => null
        )

        // setTimeout(() => {
        //     setLoading(false)

        //     setModalComplete(true)
        // }, 1000);
            
        setLoading(false)

        console.log(request)

        if(request == 200) {
            setModalComplete(true)
            return
        }

        if(request == null) {
            setModalError(true)
            return
        }

        return
    }

    const Form = _ => {
        return (
            <VStack spacing={5}>
                <TextInput mode="outlined" label="Registro, email o teléfono" autoComplete="username" onChangeText={setCredential}/>
            </VStack>
        )
    }

    const Info = _ => {
        return (
            <VStack spacing={5}>
                <Text variant="bodyMedium">
                    ¿Olvidaste tu contraseña? No te preocupes, puedes reestablcerla fácilmente, solo introduce tu registro, correo electrónico o teléfono para solicitar el cambio de contraseña
                </Text>
            </VStack>
        )
    }

    const Submit = _ => {
        return (
            <Button mode="contained" loading={loading} disabled={loading} onPress={() => {
                getRecovery()
            }}>
                Solicitar cambio
            </Button>
        )
    }

    const Cancel = _ => {
        return (
            <Button mode="outlined" disabled={loading} onPress={_ => {
                navigation.pop()
            }}>
                Cancelar
            </Button>
        )
    }

    return (
        <Flex fill>
            <CreateForm navigation={navigation} title="Reestablecer tu contraseña" loading={loading} children={[Info(), Form()]} actions={[Cancel(), Submit()]}/>

            <Modal title="¡Listo!" description="Se ha mandado un enlace a tu correo electrónico registrado, accede a él para que puedas cambiar tu contraseña" handler={[modalComplete, () => setModalComplete(!modalComplete)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline"/>

            {/* <Modal title="Ocurrió un problema" description="No podemos conectarnos a internet, revisa tu conexión e intentalo de nuevo" handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline"/> */}

        </Flex>
    )
}