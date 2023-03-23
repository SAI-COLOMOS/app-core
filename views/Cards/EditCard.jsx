import { Flex, VStack } from "@react-native-material/core"
import { Button, TextInput, useTheme, Text } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from 'expo-constants'
import ModalMessage from '../Shared/ModalMessage'
import { useCallback, useEffect, useState } from 'react'



export default EditCard = ({navigation, route}) => {
    const { user, token, card, activity} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()

    const [activity_name, setActivity_name] = useState(`${activity?.activity_name ?? ''}`)
    const [hours, setHours] = useState(`${activity?.hours ?? ''}`)
    const [responsible_register, setResponsible_register] = useState(`${activity?.responsible_register ?? ''}`)
    const [assignation_date, setAssignation_date] = useState(`${activity?.assignation_date ?? ''}`)

    const [modalConfirm, setModalConfirm] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)
    const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
    const [modalErrorDelete, setModalErrorDelete] = useState(false)
    const [responseCode, setResponseCode] = useState('')

    // console.log("Hey", `${localhost}/cards/${user?.register}/activity/${activity._id}`) 

    async function UpdateCard() {
        setModalLoading(true)
        const request = await fetch (
            `${localhost}/cards/${user?.register}/activity/${activity._id}`,
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
            (response) => response.status
        ).catch(
            (_) => null
        )
        setModalLoading(false)
        // console.log("var user ",User)
        console.log(request);

        if(request == 200){
            setModalSuccess(true)
        }else if (request != null) {
            setResponseCode(request)
            setModalError(true)
          } else {
            setModalFatal(true)
          }
        

    }

    async function DeleteCard() {
        const request = await fetch (
            `${localhost}/cards/${user?.register}/activity/${activity._id}`,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            })
        .then(
            (response) => response.status
        ).catch(
            (_) => null
        )

        if (request == 200) {
            setModalSuccessDelete(true)
          } else if (request != null) {
            setResponseCode(request)
            setModalErrorDelete(true)
          } else {
            setModalFatal(true)
          }
    }
    
    const Actividades = (_) => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">Actividad</Text>
                <VStack spacing={10}>
                    <TextInput mode="outlined" value={activity_name} onChangeText={setActivity_name} label="Nombre de actividad" maxLength={50} autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={hours} onChangeText={setHours} label="Horas a asignar" keyboardType="numeric" maxLength={3} autoComplete="off" autoCorrect={false} />
                    <TextInput mode="outlined" value={responsible_register} onChangeText={setResponsible_register} label="Registro del responsable" autoCapitalize="characters" maxLength={12} autoComplete="off" autoCorrect={false} />
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

    const Delete = () => {
        return (
            <Button
            mode="contained"
            icon="trash-can-outline"
            onPress={() => {
                setModalConfirm(!modalConfirm)
            }}
            >
                Eliminar actividad
            </Button>
        )
    }

    return (
        <Flex fill>
            <CreateForm navigation={navigation} title={'Editar actividad'} children={[Actividades(), Delete()]} actions={[Update(), Cancel()]}/>
            <ModalMessage
                title="Eliminar actividad"
                description="¿Seguro que deseas eliminar esta actividad? La acción no se podrá deshacer"
                handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
                actions={[
                ['Cancelar', () => setModalConfirm(!modalConfirm)],
                [
                    'Aceptar',
                    () => {
                    setModalConfirm(!modalConfirm), DeleteCard()
                    }
                ]
                ]}
                dismissable={true}
                icon="help-circle-outline"
            />
            <ModalMessage title="¡Listo!" description="La actividad ha sido actualizada" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />

            <ModalMessage title="¡Listo!" description="La actividad ha sido eliminada" handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />

            <ModalMessage title="Ocurrió un problema" description={`No pudimos actualizar la actividad, intentalo más tarde. (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

            <ModalMessage title="Ocurrió un problema" description={`No pudimos eliminar la actividad, intentalo más tarde. (${responseCode})`} handler={[modalErrorDelete, () => setModalErrorDelete(!modalErrorDelete)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

            <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />

        </Flex>
    )
}