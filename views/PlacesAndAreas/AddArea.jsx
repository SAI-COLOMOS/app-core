import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Button, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import CreateForm from "../Shared/CreateForm";
import ModalMessage from "../Shared/ModalMessage";

export default AddArea = ({navigation, route}) => {
    const {token, place_identifier} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL

    const [area_name, setArea_name] = useState('')
    const [phone, setPhone] = useState('')
    const [verified, setVerified] = useState(false)

    const [modalLoading, setModalLoading] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)
    const [reponseCode, setReponseCode] = useState("")

    async function saveArea() {
        setModalLoading(true)

        const request = await fetch(
            `${localhost}/places/${place_identifier}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify({
                    area_name,
                    phone
                })
            }
        ).then(
            response => response.status
        ).catch(
            _ => null
        )

        console.log(request)

        setModalLoading(false)

        if(request == 201 ) {
            setModalSuccess(true)
        } else if(request != null) {
            setReponseCode(request)
            setModalError(true)
        } else {
            setModalFatal(true)
        }
    }

    useEffect(() => {
        let check = true

        area_name.length > 0 ? null : check = false
        phone.length == 10 ? null : check = false

        if(check) {
            setVerified(true)
        } else {
            setVerified(false)
        }

    }, [area_name, phone])
    
    const Data = () => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">
                    Datos del área
                </Text>
                <VStack spacing={10}>
                <TextInput mode="outlined" value={area_name} onChangeText={setArea_name} label="Nombre del área" maxLength={50} />
                <TextInput mode="outlined" value={phone} onChangeText={setPhone} label="Número telefónico" maxLength={10} keyboardType="phone-pad" />
                </VStack>
            </VStack>
        )
    }

    const Save = _ => {
        return (
            <Button icon="content-save-outline" disabled={modalLoading || !verified} loading={modalLoading} mode="contained" onPress={() => {
                saveArea()
            }}>
                Guardar
            </Button>
        )
    }
    
    const Cancel = _ => {
        return (
            <Button icon="close" disabled={modalLoading} mode="outlined" onPress={_ => {
                navigation.pop()
            }}>
                Cancelar
            </Button>
        )
    }

    return (
        <Flex fill>
            <CreateForm title="Añadir nueva área" children={[Data()]} actions={[Save(), Cancel()]} navigation={navigation} loading={modalLoading}/>

            <ModalMessage title="¡Listo!" description="El área ha sido añadida exitosamente" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline"/>

            <ModalMessage title="Ocurrió un problema" description={`No pudimos añadir el área, intentalo más tarde. (${reponseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline"/>
        
            <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert"/>
        </Flex>
    )
}