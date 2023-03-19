import { Flex, VStack } from "@react-native-material/core"
import { Button, TextInput, useTheme, Text } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from 'expo-constants'
import ModalMessage from '../Shared/ModalMessage'
import { useCallback, useEffect, useState } from 'react'



export default EditCard = ({navigation, route}) => {
    const { user, token, register } = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()

    const [activity_name, setActivity_name] = useState('')
    const [hours, setHours] = useState()
    const [responsible_register, setResponsible_register] = useState('')
    const [assignation_date, setAssignation_date] = useState('')

    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)

    async function UpdateCard() {
        const request = await fetch (
            `${localhost}/cards/${user?.register}/${card?.activity_identifier}`,
            {
                method: "PATCH",
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
            (response) => (response.ok ? response.json() : response.status)
        ).catch(
            (_) => null
        )


    }
    
    const Actividades = (_) => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">Actividad</Text>
                <VStack spacing={10}>
                    <TextInput mode="outlined" value={activity_name} onChangeText={setActivity_name} label="Nombre de actividad" maxLength={50} autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={hours} onChangeText={setHours} label="Horas a asignar" keyboardType="numeric" maxLength={3} autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={responsible_register} onChangeText={setResponsible_register} label="Registro del responsable" maxLength={12} autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={assignation_date} onChangeText={setAssignation_date} label="Fecha de asignación" autoComplete="off" autoCorrect={false} />
                </VStack>
            </VStack>
        )
    }

    const Update = () => {
        return (
            <Button 
            mode="contained"
            icon="content-save-outline"
            onPress={() => {
                UpdateCard()
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
        <Flex fill>
            <CreateForm navigation={navigation} title={'Añadir actividad'} children={[Actividades()]} actions={[Update(), Cancel()]}/>

        </Flex>
    )
}