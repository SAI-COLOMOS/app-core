import { Flex, VStack } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl, ScrollView } from "react-native"
import { ActivityIndicator, Avatar, Button, Card, FAB, ProgressBar, Text, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements";
import Constants from "expo-constants";
import Header from "../Shared/Header"
import DisplayDetails from "../Shared/DisplayDetails";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default UserDetails = ({navigation, route}) => {
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const {token, register} = route.params
    const headerMargin = useHeaderHeight()
    const theme = useTheme()

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(undefined);

    async function getUser() {
        setLoading(true)
        const request = await fetch(
            `${localhost}/users/${register}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Cache-Control": "no-cache"
                }
            }
        ).then(
            response => response.ok ? response.json() : response.status
        ).catch(
            _ => null
        )
        
        setLoading(false)
        console.log(request)

        if (request?.user) {
            setUser(request.user)
            console.log(request)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: "Datos del usuario"
        })
    }, [])

    useFocusEffect(useCallback(() => {
        getUser()
        return () => {}
    }, []))

    const PersonalData = () => {
        return (
            <VStack p={20} spacing={10}>
                <Text variant="bodyLarge">
                    Datos personales
                </Text>
                <VStack spacing={2}>
                    <Text variant="labelSmall">
                        Nombre
                    </Text>
                    <Text variant="bodyMedium">
                        {`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? '' : user?.second_last_name}`}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">
                        Edad        Tipo de sangre
                    </Text>
                    <Text variant="bodyMedium">
                        {`${user?.age}          ${user?.blood_type}`}
                    </Text>
                </VStack>
            </VStack>
        )
    }

    const ContactData = () => {
        return (
            <VStack p={20} spacing={10}>
                <Text variant="bodyLarge">
                    Datos de contacto
                </Text>
                <VStack spacing={2}>
                    <Text variant="labelSmall">
                        email
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.email}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">
                        Teléfono personal
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.phone}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">
                        Contacto de emergencia
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.emergency_contact}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">
                        Teléfono de emergencia
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.emergency_phone}
                    </Text>
                </VStack>
            </VStack>
        )
    }

    const UserData = () => {
        return (
            <VStack p={20} spacing={10}>
                <Text variant="bodyLarge">
                    Datos de usuario
                </Text>
                <VStack spacing={2}>
                <Text variant="labelSmall">
                        Tipo de prestador
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.provider_type}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                <Text variant="labelSmall">
                        Parque
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.place}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                <Text variant="labelSmall">
                        Area asignada
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.assigned_area}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                <Text variant="labelSmall">
                        Escuela
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.school}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                <Text variant="labelSmall">
                        Rol
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.role}
                    </Text>
                </VStack>
                <VStack spacing={2}>
                <Text variant="labelSmall">
                        Estatus
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.status}
                    </Text>
                </VStack>
                {/* <VStack spacing={2}>
                <Text variant="labelSmall">
                        Horas asignadas
                    </Text>
                    <Text variant="bodyMedium">
                        {user?.total_hours}
                    </Text>
                </VStack> */}
            </VStack>
        )
    }

    return(
        <Flex fill mt={headerMargin - 20} >
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={_ => getUser()}/>}>
                {
                    user !== undefined ? (
                        user !== null ? (
                            isNaN(user) ? (
                                <DisplayDetails photo={user?.avatar} icon="account" title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? '' : user?.second_last_name }`} children={[PersonalData(), ContactData(), UserData()]}/>
                            ) : (
                                <VStack p={30} center spacing={20}>
                                    <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50}/>
                                    <VStack center>
                                        <Text variant="headlineSmall">
                                            Ocurrió un problema
                                        </Text>
                                        <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                            No podemos recuperar los datos de la escuela, intentalo de nuevo más tarde (Error: {user})
                                        </Text>
                                    </VStack>
                                    <Flex>
                                        <Button mode="outlined" onPress={_ => {getUser()}}>
                                            Reintentar
                                        </Button>
                                    </Flex>
                                </VStack>
                            )
                        ) : (
                            <VStack center spacing={20} p={30}>
                                <Icon color={theme.colors.onBackground} name="wifi-alert" size={50}/>
                                <VStack center>
                                    <Text variant="headlineSmall">
                                        Sin internet
                                    </Text>
                                    <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                        No podemos recuperar los datos de la escuela, revisa tu conexión a internet e intentalo de nuevo
                                    </Text>
                                </VStack>
                                <Flex>
                                    <Button mode="outlined" onPress={_ => {getUser()}}>
                                        Reintentar
                                    </Button>
                                </Flex>
                            </VStack>
                        )
                    ) : (
                        null
                    )
                }
            </ScrollView>

            {
                !(user === undefined || user === null) ? (
                    <FAB icon="pencil-outline" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                        navigation.navigate("EditUser", {
                            token,
                            user
                        })
                    }}/>
                ) : (
                    null
                )
            }
        </Flex>
    )
}