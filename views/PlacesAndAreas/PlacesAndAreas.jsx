import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { Card, IconButton, Text, TextInput, useTheme, Avatar, FAB, Button, TouchableRipple } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header";
import Constants from "expo-constants"
import { RefreshControl, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default Places = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {user, token} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL

    const [loading, setLoading] = useState(false)
    const [places, setPlaces] = useState(undefined)

    const getPlaces = async _ => {
        setLoading(true)

        const request = await fetch(
            `${localhost}/places`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            }
        ).then(
            response => response.ok ? response.json() : response.status
        ).catch(
            _ => null
        )

        if(request?.places) {
            setPlaces(request.places)
        } else {
            setPlaces(request)
        }

        console.log(places)

        setLoading(false)
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: "Lugares y áreas"
        })
    }, [])

    useFocusEffect(useCallback(() => {
        getPlaces()

        return () => {}
    }, []))

    const Item = ({place}) => {
        return (
            <Card>
                <TouchableRipple onPress={() => {
                    navigation.navigate("PlaceDetails", {place})
                }}>
                    <Card.Title
                        title={`${place.place_name}`}
                        subtitle={`${place.place_areas?.length === 1 ? 'Un área' : `${place.place_areas?.length} áreas`}`}
                        left={props => <Avatar.Icon {...props} icon="account"/>}
                    />
                </TouchableRipple>
            </Card>
        )
    }

    return (
        <Flex fill pt={headerMargin}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {getPlaces()}}/>}>
                <VStack p={10} spacing={10}>
                    {
                        places !== undefined ? (
                            places !== null ? (
                                isNaN(places) ? (
                                    places?.length > 0 ? (
                                        places.map(place => (
                                            <Flex key={place.place_identifier}>
                                                <Item place={place}/>
                                            </Flex>
                                        ))
                                    ) : (
                                        <VStack center spacing={20} p={30}>
                                            <IconButton icon="pencil-plus-outline" size={50}/>
                                            <VStack center>
                                                <Text variant="headlineSmall">
                                                    Sin lugares
                                                </Text>
                                                <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                                    No hay ningun lugar registrado, ¿qué te parece si hacemos el primero?
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
                                    <VStack p={30} center spacing={20}>
                                        <IconButton icon="alert-circle-outline" size={50}/>
                                        <VStack center>
                                            <Text variant="headlineSmall">
                                                Ocurrió un problema
                                            </Text>
                                            <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                                No podemos recuperar los lugares y áreas, intentalo de nuevo más tarde (Error: {places})
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
                                    <IconButton icon="wifi-alert" size={50}/>
                                    <VStack center>
                                        <Text variant="headlineSmall">
                                            Sin internet
                                        </Text>
                                        <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                            No podemos recuperar los lugares y áreas, revisa tu conexión a internet e intentalo de nuevo
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
                            null
                        )
                    }
                </VStack>
            </ScrollView>

            <FAB icon="plus" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                navigation.navigate("AddPlace", {
                    user,
                    token
                })
            }}/>
        </Flex>
    )
}