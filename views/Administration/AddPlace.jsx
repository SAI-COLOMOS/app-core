import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Button, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import CreateForm from "../Shared/CreateForm";

export default AddPlace = ({navigation, route}) => {
    const insets = useSafeAreaInsets()
    const {user, token} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL

    const [place_name, setPlace_name] = useState('')
    const [street, setStreet] = useState('')
    const [number,  setNumber] = useState('')
    const [colony, setColony] = useState('')
    const [municipality, setMunicipality] = useState('')
    const [postal_code, setPostal_code] = useState('')
    const [phone, setPhone] = useState('')
    const [reference, setReference] = useState('')

    async function savePlace() {
        const request = await fetch(
            `${localhost}/places/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify({
                    place_name,
                    street,
                    number, 
                    colony,
                    municipality,
                    postal_code,
                    phone, 
                    reference
                })
            }
        ).then(
            response => response.JSON 
        ).catch(
            _ => null
        )

        if(request == 201) {
            console.log("ok")
            navigation.pop()
            return
        }

        return
    }

    const Data = () => {
        return (
            <VStack spacing={5}>
                <Text variant="labelLarge">
                    Datos del bosque urbano
                </Text>
                <VStack spacing={10}>
                <TextInput mode="outlined" value={place_name} onChangeText={setPlace_name} label="Nombre del bosque urbano" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={street} onChangeText={setStreet} label="Nombre de la calle" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={number} onChangeText={setNumber} label="Número del domicilio" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={colony} onChangeText={setColony} label="Nombre de la colonia" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={municipality} onChangeText={setMunicipality} label="Nombre del municipio" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={postal_code} onChangeText={setPostal_code} label="Codigo postal" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={phone} onChangeText={setPhone} label="Número telefónico" maxLength={50} autoComplete="off" autoCorrect={false}/>
                <TextInput mode="outlined" value={reference} onChangeText={setReference} label="Referencia del lugar" maxLength={250} />
                </VStack>
            </VStack>
        )
    }

    const Save = _ => {
        return (
            <Button mode="contained" onPress={() => {
                savePlace()
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

    useEffect(() => {
        console.log()
    }, [])

    
    console.log(place_name,
        street,
        number, 
        colony,
        municipality,
        postal_code,
        phone)

    return (
        <CreateForm navigation={navigation} title="Añadir nuevo bosque urbano" children={[Data()]} actions={[Cancel(), Save()]} />
    )
}