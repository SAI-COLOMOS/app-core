import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { Button, Card, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Picker} from '@react-native-picker/picker';
import BloodTypesDialog from "../Shared/Dialog";

export default AddUser = ({navigation, route}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()

    const [first_name, setFirst_name] = useState('')
    const [first_last_name, setFirst_last_name] = useState('')
    const [second_last_name, setSecond_last_name] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [emergency_contact, setEmergency_contact] = useState('')
    const [emergency_phone, setEmergency_phone] = useState('')
    const [blood_type, setBlood_type] = useState('')
    const [provider_type, setProvider_type] = useState('')
    const [place, setPlace] = useState('')
    const [assignment_area, setAssignment_area] = useState('')
    const [school, setSchool] = useState('')
    const [role, setRole] = useState('')

    const [bloodTypesDialogState, setBloodTypesDialogState] = useState(false)
    const changeStateBloodTypeDialog = _ => setBloodTypesDialogState(!bloodTypesDialogState)
    const bloodTypes = [
        {
            opcion: "RH O+",
            id: "o+"
        },
        {
            opcion: "RH O-",
            id: "o-"
        },
        {
            opcion: "RH A+",
            id: "a+"
        },
        {
            opcion: "RH A-",
            id: "a-"
        },
        {
            opcion: "RH B+",
            id: "b+"
        },
        {
            opcion: "RH B-",
            id: "b-"
        },
        {
            opcion: "RH AB+",
            id: "ab+"
        },
        {
            opcion: "RH AB-",
            id: "ab-"
        }
    ]


    return (
        <Flex fill style={{backgroundColor: theme.colors.backdrop, zIndex: 0}} justify="end">
            <TouchableRipple android_ripple={false} style={{height: "100%", width: "100%", position: "absolute"}} onPress={() => {
                navigation.pop()
                console.log("Wenas")
            }}>
                <Flex fill/>
            </TouchableRipple>
            
            <Flex maxH={"90%"} style={{backgroundColor: theme.colors.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, overflow: "hidden"}}>
                <ScrollView>
                    <Flex p={25} items="center">
                        <Text variant="headlineMedium" style={{textAlign: "center"}}>
                            Añadir nuevo usuario
                        </Text>
                    </Flex>

                    <VStack pr={25} pl={25} pb={50} spacing={30}>
                        <VStack spacing={5}>
                            <Text variant="labelLarge">
                                Datos personales
                            </Text>
                            <VStack spacing={10}>
                                <TextInput mode="outlined" onChangeText={setFirst_name} label="Nombre" maxLength={50} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setFirst_last_name} label="Apellido paterno" maxLength={50} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setSecond_last_name} label="Apellido materno" maxLength={50} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setAge} label="Edad" keyboardType="numeric" maxLength={2} autoComplete="off" autoCorrect={false}/>
                                <TouchableRipple onPress={_ => {
                                    changeStateBloodTypeDialog()
                                }}>
                                    <TextInput mode="outlined" editable={false} value={blood_type.opcion} label="Grupo sangíneo" right={<TextInput.Icon disabled={true} icon="menu-down"/>}/>
                                </TouchableRipple>
                            </VStack>
                        </VStack>

                        <VStack spacing={5}>
                            <Text variant="labelLarge">
                                Datos de contacto
                            </Text>
                            <VStack spacing={10}>
                                <TextInput mode="outlined" onChangeText={setEmail} label="Correo electrónico" maxLength={50} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setPhone} label="Teléfono" keyboardType="numeric" maxLength={15} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setEmergency_contact} label="Contacto de emergencia" maxLength={50} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setEmergency_phone} label="Teléfono de emergencia" keyboardType="numeric" maxLength={15} autoComplete="off" autoCorrect={false}/>
                            </VStack>
                        </VStack>

                        <VStack spacing={5}>
                            <Text variant="labelLarge">
                                Datos del usuario
                            </Text>
                            <VStack spacing={10}>
                                <TextInput mode="outlined" onChangeText={setRole} label="Rol" maxLength={50} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setAssignment_area} label="Área asignada" keyboardType="numeric" maxLength={15} autoComplete="off" autoCorrect={false}/>
                                <TextInput mode="outlined" onChangeText={setProvider_type} label="Tipo de servicio" maxLength={50} autoComplete="off" autoCorrect={false}/>
                            </VStack>
                        </VStack>
                        
                    </VStack>

                </ScrollView>

                <HStack spacing={20} justify="end" p={10} pb={insets.bottom + 10}>
                    <Button mode="outlined" onPress={_ => {
                        navigation.pop()
                    }}>
                        Cancelar
                    </Button>

                    <Button mode="contained" onPress={() => {
                        console.log(first_name, first_last_name, second_last_name)
                    }}>
                        Guardar
                    </Button>
                </HStack>

            </Flex>

            <BloodTypesDialog titulo="Grupo sangíneo" icono="alert" opciones={[bloodTypes, setBlood_type]} handler={[bloodTypesDialogState, changeStateBloodTypeDialog]} botonUno={['Aceptar']}/>
            
        </Flex>
    )
}