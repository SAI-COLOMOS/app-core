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

    async function savePlace() {
        const request = await fetch(
            `${localhost}/places`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    place_name
                })
            }
        ).then(
            response => response.status
        ).catch(
            _ => null
        )

        console.log(request)

        if(request == 201) {
            console.log("ok")
            navigation.pop()
            return
        }

        console.log("Error")
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

    useEffect(() => {
        console.log(place_name)
    }, [place_name])

    const Cancel = _ => {
        return (
            <Button mode="outlined" onPress={_ => {
                navigation.pop()
            }}>
                Cancelar
            </Button>
        )
    }

    return (
        <CreateForm navigation={navigation} title="Añadir nuevo bosque urbano" children={[Data()]} actions={[Save(), Cancel()]} />

        // <Flex fill>
        //     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: "100%", height: "100%"}}>
        //         <Flex fill style={{backgroundColor: theme.colors.backdrop}} justify="end">
        //             <TouchableRipple android_ripple={false} style={{width: "100%", height: "100%", position: "absolute"}} onPress={() => {
        //                 navigation.pop()
        //             }}>
        //                 <Flex fill/>
        //             </TouchableRipple>

        //             <Flex maxH={"90%"} pb={insets.bottom} style={{backgroundColor: theme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden"}}>
        //                 <ScrollView>

        //                         <Flex p={25} items="center">
        //                             <Text variant="headlineMedium" style={{textAlign: "center"}}>
        //                                 Añadir nuevo bosque urbano
        //                             </Text>
        //                         </Flex>

        //                         <VStack pr={25} pl={25} pb={50} spacing={30}>
                                    
        //                         </VStack>

        //                 </ScrollView>

        //                 <HStack spacing={20} justify="end" p={10}>

        //                 </HStack>
        //             </Flex>
        //         </Flex>
        //     </KeyboardAvoidingView>
        // </Flex>
    )
}