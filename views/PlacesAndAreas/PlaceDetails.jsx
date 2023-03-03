import { Flex, VStack } from "@react-native-material/core"
import { useEffect, useState, useCallback } from "react"
import { useHeaderHeight } from "@react-navigation/elements";
import { Text, Card, Avatar, TouchableRipple, IconButton, Button, FAB, useTheme } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants";
import DisplayDetails from "../Shared/DisplayDetails";
import { ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default PlaceDetails = ({navigation, route}) => {
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const headerMargin = useHeaderHeight()
    const {token, place_identifier, area_identifier} = route.params
    const theme = useTheme()

    const [loading, setLoading] = useState(false)
    const [places, setPlaces] = useState(undefined)
    const [areas, setAreas] = useState(undefined)

    async function getPlaces() {
        setLoading(true)

        const request = await fetch(
            `${localhost}/places/${place_identifier}`,
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

        if(request?.place) {
            setPlaces(request.place)
            console.log(request)
        } else {
            setPlaces(request)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: "Datos del bosque urbano"
        })
    }, [])
    
    useFocusEffect(useCallback(() => {
        getPlaces()
        return () => {}
    }, []))

    const NoConection = _ => {
        return (
            <VStack center spacing={20} p={30}>
                <Icon name="wifi-alert" color={theme.colors.onBackground} size={50}/>
                <VStack center>
                    <Text variant="headlineSmall">
                        Sin conexión
                    </Text>
                    <Text variant="bodyMedium" style={{textAlign: "center"}}>
                        Parece que no tienes conexión a internet, conectate e intenta de nuevo
                    </Text>
                </VStack>
                <Flex>
                    <Button icon="reload" mode="outlined" onPress={_ => {
                        getPlaces()
                    }}>
                        Reintentar
                    </Button>
                </Flex>
            </VStack>
        )
    }

    const Places = () => {
        return (
            <VStack p={20} spacing={5}>
                <Text variant="bodyLarge">
                    Bosque urbano
                </Text>
                <VStack spacing={10}>
                    <Text variant="labelSmall">
                            Domicilio
                        </Text>
                        <Text variant="bodyLarge">
                            {`${places?.street} #${places?.exterior_number}\n${places?.colony}, ${places?.municipality}, ${places?.postal_code}`}
                        </Text>
                    
                    <Flex>
                        <Text variant="labelSmall">
                            Referencia
                        </Text>
                        <Text variant="bodyMedium">
                            {places?.reference ? places?.reference : "Sin referencia"}
                        </Text>
                    </Flex>
                    
                    <Flex>
                        <Text variant="labelSmall">
                            Número de teléfono
                        </Text>
                        <Text variant="bodyMedium">
                            {places?.phone}
                        </Text>
                    </Flex>
                </VStack>
            </VStack>
        )
    }

    const Areas = () => {
        return (
            <VStack p={20} spacing={5}>
                <Text variant="bodyLarge">
                    Área urbana
                </Text>
                <VStack spacing={10}>
                    <Flex>
                        <Text variant="labelSmall">
                            Nombre del área
                        </Text>
                        <Text variant="bodyMedium">
                            {areas?.area_name}
                        </Text>
                        <Text variant="labelSmall">
                            Número de teléfono del área
                        </Text>
                        <Text variant="bodyMedium">
                            {areas?.phone}
                        </Text>
                    </Flex>
                </VStack>
            </VStack>
        )
    }

    return (
        <Flex fill pt={headerMargin - 20}> 
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={_ => getPlaces()}/>}>
                {
                    places !== undefined ? (
                        places !== null ? (
                            isNaN(places) ? (
                                <DisplayDetails icon="map-marker-radius-outline" title={places?.place_name} children={[Places(), Areas()]}/>
                            ) : (
                                <VStack p={30} center spacing={20}>
                                    <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50}/>
                                    <VStack center>
                                        <Text variant="headlineSmall">
                                            Ocurrió un problema
                                        </Text>
                                        <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                            No podemos recuperar del bosque urbano, intentalo de nuevo más tarde (Error: {places})
                                        </Text>
                                    </VStack>
                                    <Flex>
                                        <Button mode="outlined" onPress={_ => {getPlaces()}}>
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
                                        No podemos recuperar los datos del bosque urbano, revisa tu conexión a internet e intentalo de nuevo
                                    </Text>
                                </VStack>
                                <Flex>
                                    <Button mode="outlined" onPress={_ => {getPlace()}}>
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
                !(places === undefined || places === null) ? (
                    <FAB icon="pencil-outline" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                        navigation.navigate("EditPlace", {
                            token,
                            places
                        })
                    }}/>
                ) : (
                    null
                )
            }
    
        </Flex>
    )
}