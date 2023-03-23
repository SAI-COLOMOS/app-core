import { Flex, VStack } from "@react-native-material/core"
import { useHeaderHeight } from '@react-navigation/elements'
import { useCallback, useEffect, useState } from 'react'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import CreateForm from "../Shared/CreateForm"
import { Button, TextInput, useTheme, Text} from "react-native-paper"
import ModalMessage from '../Shared/ModalMessage'
import { ScrollView } from "react-native"



export default AddCard = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const { user, token, register } = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()

    const [activity_name, setActivity_name] = useState('')
    const [hours, setHours] = useState('')
    const [responsible_register, setResponsible_register] = useState('')
    const [assignation_date, setAssignation_date] = useState('')

    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)
    const [reponseCode, setReponseCode] = useState('')
  

    async function SaveCard () {
        setModalLoading(true)

        const request = await fetch(
            `${localhost}/cards/${user?.register}`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    activity_name: activity_name.trim(),
                    hours: Number(hours),
                    responsible_register: responsible_register.trim(),
                    assignation_date: assignation_date.trim()
                })
            }
        ).then(
            (response) => (response.status)
            
        ).catch(
            error => null
        )
        setModalLoading(false)

        // console.log(request.status)
        console.log(request)
        // console.error();

        if (request == 201) {
            setModalSuccess(true)
          } else if (request != null) {
            setReponseCode(request)
            setModalError(true)
          } else {
            setModalFatal(true)
          }

    }

    const Actividades = () => {
        return (

            <VStack spacing={5}>
                <Text variant="labelLarge">Actividad</Text>
                <VStack spacing={10}>
                    <TextInput mode="outlined" value={activity_name} onChangeText={setActivity_name} label="Nombre de actividad" maxLength={50} autoCapitalize="words" autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={hours} onChangeText={setHours} label="Horas a asignar" keyboardType="numeric" maxLength={3} autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={responsible_register} onChangeText={setResponsible_register} label="Registro del responsable" maxLength={12} autoCapitalize="characters" autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={assignation_date} onChangeText={setAssignation_date} label="Fecha de asignación"  autoComplete="off" autoCorrect={false} />
                </VStack>
            </VStack>
        )
    }

    const Save = () => {
        return (
            <Button 
            mode="contained"
            icon="content-save-outline"
            onPress={() => {
                SaveCard()
            }}
            >
                Guardar
            </Button>
        )
    }

    const Cancel = () => {
        return (
            <Button
            mode="contained"
            icon="close"
            onPress={() => {
                navigation.pop()
            }}
            >
                Cancelar
            </Button>
        )
    }


    return (
        <Flex fill >
            <CreateForm navigation={navigation} title={'Añadir actividad'} children={[Actividades()]} actions={[Save(), Cancel()]}/>

            <ModalMessage title="¡Listo!" description="La actividad ha sido creada" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />
            <ModalMessage title="Ocurrió un problema" description={`No pudimos crear la actividad, inténtalo más tarde.`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />
            <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />

        </Flex>
    )
}