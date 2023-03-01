import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { Button, Card, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Picker} from '@react-native-picker/picker';
import BloodTypesDialog from "../Shared/Dialog";
import CreateForm from "../Shared/CreateForm";
import Constants from "expo-constants";
import ModalMessage from "../Shared/ModalMessage";
import Dropdown from "../Shared/Dropdown";
import ImageSelector from "../Shared/ImageSelector";

export default AddUser = ({navigation, route}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()
    const {user, token} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL

    const [first_name, setFirst_name] = useState('')
    const [first_last_name, setFirst_last_name] = useState('')
    const [second_last_name, setSecond_last_name] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [emergency_contact, setEmergency_contact] = useState('')
    const [emergency_phone, setEmergency_phone] = useState('')
    const [blood_type, setBlood_type] = useState('')
    const [provider_type, setProvider_type] = useState('')
    const [place, setPlace] = useState('')
    const [assigned_area, setAssigned_area] = useState('')
    const [school, setSchool] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [total_hours, setTotal_hours] = useState('')

    const [providerTypesDialogState, setProviderTypesDialogState] = useState(false)
    const changeStateProviderTypeDialog = _ => setProviderTypesDialogState(!providerTypesDialogState)
    const providerTypes = [
        {
            opcion: "Servicio social",
            id: "servicio social"
        },
        {
            opcion: "Prácticas profesionales",
            id: "prácticas profesionales"
        },
        {
            opcion: "No aplica",
            id: "no aplica"
        }
    ]

    const [roleTypesDialogState, setRoleTypesDialogState] = useState(false)
    const changeStateRoleTypeDialog = _ => setRoleTypesDialogState(!roleTypesDialogState)
    const roleTypes = [
        {
            opcion: "Administrador",
            id: "administrador"
        },
        {
            opcion: "Encargado",
            id: "encargado"
        },
        {
            opcion: "Prestador",
            id: "prestador"
        }
    ]

    const [bloodTypesDialogState, setBloodTypesDialogState] = useState(false)
    const changeStateBloodTypeDialog = _ => setBloodTypesDialogState(!bloodTypesDialogState)
    const bloodTypes = [
        {
            option: "O+",
            id: "o+"
        },
        {
            option: "O-",
            id: "o-"
        },
        {
            option: "A+",
            id: "a+"
        },
        {
            option: "A-",
            id: "a-"
        },
        {
            option: "B+",
            id: "b+"
        },
        {
            option: "B-",
            id: "b-"
        },
        {
            option: "AB+",
            id: "ab+"
        },
        {
            option: "AB-",
            id: "ab-"
        }
    ]

    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)
    const [reponseCode, setReponseCode] = useState("")

    async function SaveUser() {
        setModalLoading(true)
        const request = await fetch(
            `${localhost}/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    first_name: first_name.trim(),
                    first_last_name: first_last_name.trim(),
                    age: age.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    emergency_contact: emergency_contact.trim(),
                    emergency_phone: emergency_phone.trim(),
                    blood_type: blood_type,
                    provider_type: provider_type.opcion,
                    place: place.trim(),
                    assigned_area: assigned_area.trim(),
                    school: school.trim(),
                    role: role.opcion,
                    status: status.trim(),
                    avatar: avatar,
                    total_hours: Number(total_hours)
                })
            }
        ).then(
            response => response.json()
        ).catch(
            error => console.error("Error: ", error)
        )
        
        console.log(request)
        setModalLoading(false)
        
        if(request==201) {
            setModalSuccess(true)
            navigation.pop()
        }else if(request != null){
            setReponseCode(request)
            setModalError(true)
        }else{
            setModalFatal(true)
        }

    }

    const PersonalData = () => {
        return (
            
            <VStack spacing={5}>
                <Text variant="labelLarge">
                    Datos personales
                </Text>
                <VStack spacing={10}>
                    <TextInput mode="outlined" value={first_name} onChangeText={setFirst_name} label="Nombre" maxLength={50} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={first_last_name} onChangeText={setFirst_last_name} label="Apellido paterno" maxLength={50} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={second_last_name} onChangeText={setSecond_last_name} label="Apellido materno" maxLength={50} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={age} onChangeText={setAge} label="Edad" keyboardType="numeric" maxLength={2} autoComplete="off" autoCorrect={false}/>
                    <Dropdown title="Grupo sanguíneo" options={bloodTypes} value={blood_type} selected={setBlood_type}/>
                </VStack>
                <BloodTypesDialog titulo="Grupo sanguíneo" icono="alert" opciones={[bloodTypes, setBlood_type]} handler={[bloodTypesDialogState, changeStateBloodTypeDialog]} botonUno={['Aceptar']}/>
            </VStack>
            
            
        )
    }

    const ContactData = () => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">
                    Datos de contacto
                </Text>
                <VStack spacing={10}>
                    <TextInput mode="outlined" value={email} onChangeText={setEmail} label="Correo electrónico" maxLength={50} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={phone} onChangeText={setPhone} label="Teléfono" keyboardType="numeric" maxLength={10} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={emergency_contact} onChangeText={setEmergency_contact} label="Contacto de emergencia" maxLength={50} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={emergency_phone} onChangeText={setEmergency_phone} label="Teléfono de emergencia" keyboardType="numeric" maxLength={10} autoComplete="off" autoCorrect={false}/>
                </VStack>
            </VStack>
        )
    }

    const UserData = () => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">
                    Datos del usuario
                </Text>
                <VStack spacing={10}>
                    <TouchableRipple onPress={_ => {
                        changeStateProviderTypeDialog()
                    }}>
                        <TextInput mode="outlined" editable={false} value={provider_type.opcion} label="Tipo de prestador" right={<TextInput.Icon disabled={true} icon="menu-down"/>} />
                    </TouchableRipple>
                    <TextInput mode="outlined" value={place} onChangeText={setPlace} label="Parque" maxLength={100} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={assigned_area} onChangeText={setAssigned_area} label="Área asignada" maxLength={100} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={school} onChangeText={setSchool} label="Escuela" maxLength={100} autoComplete="off" autoCorrect={false}/>
                    <TouchableRipple onPress={_ => {
                        changeStateRoleTypeDialog()
                    }}>
                        <TextInput mode="outlined" editable={false} value={role.opcion} label="Rol" right={<TextInput.Icon disabled={true} icon="menu-down"/>} />
                    </TouchableRipple>
                    <TextInput mode="outlined" value={status} onChangeText={setStatus} label="Status" maxLength={15} autoComplete="off" autoCorrect={false}/>
                    <TextInput mode="outlined" value={total_hours} onChangeText={setTotal_hours} label="Total de horas" keyboardType="number-pad" maxLength={5} autoComplete="off" autoCorrect={false}/>
                </VStack>
                <BloodTypesDialog titulo="Tipo de prestador" icono="alert" opciones={[providerTypes, setProvider_type]} handler={[providerTypesDialogState, changeStateProviderTypeDialog]} botonUno={['Aceptar']}/>
                <BloodTypesDialog titulo="Tipo de rol" icono="alert" opciones={[roleTypes, setRole]} handler={[roleTypesDialogState, changeStateRoleTypeDialog]} botonUno={['Aceptar']}/>

            </VStack>
        )
    }

    const ImageData = () => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">
                    Foto de perfil
                </Text>
                <VStack spacing={10}>
                    <ImageSelector value={avatar} setter={setAvatar}/>
                </VStack>
            </VStack>
        )
    }

    const Save = _ => {
        return (
            <Button mode="contained" onPress={() => {
                // console.log(request)
                SaveUser()
            }}>
                Guardar
            </Button>
        )
    }

    const Cancel = _ => {
        return (
            <Button mode="outlined" onPress={_ => {
                navigation.pop()
            }}>
                Cancelar
            </Button>
        )
    }

    // useEffect(() => {
    //     console.log(first_name)
    // }, [first_name])

    return (
        <Flex fill>
            <CreateForm navigation={navigation} title={"Añadir nuevo usuario"} children={[PersonalData(), ContactData(), UserData(), ImageData()]} actions={[Cancel(), Save()]} />
            
            <ModalMessage title="¡Listo!" description="El usuario ha sido creado" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.replace("Dashboard")]]} dismissable={false} icon="check-circle-outline"/>
            <ModalMessage title="Ocurrió un problema" description={`No pudimos crear al usuario, intentalo más tarde. (${reponseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline"/>
            <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert"/>

        </Flex>
    )
}