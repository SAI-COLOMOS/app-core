import { Flex, HStack, VStack } from "@react-native-material/core"
import { useState, useEffect, useCallback } from "react"
import { ActivityIndicator, Avatar, Button, Card, Divider, FAB, IconButton, List, ProgressBar, Text, TouchableRipple, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header"
import Constants from "expo-constants";
import { FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default Schools = ({navigation, route}) => {
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()
    const {user, token} = route.params
    const insets = useSafeAreaInsets()
    const headerMargin = useHeaderHeight()

    const [schools, setSchools] = useState(undefined)
    const [loading, setLoading] = useState(false)

    async function getSchools() {
        setLoading(true)
        const request = await fetch(
            `${localhost}/schools`,
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

        if(request?.schools) {
            setSchools(request.schools)
            console.log(request)
        } else {
            setSchools(request)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: "Escuelas"
        })
    }, [])

    useFocusEffect(useCallback(() => {
        getSchools()

        return () => {}
    }, []))

    const Item = ({school_name, address, school_identifier}) => {
        return (
            <Flex ph={20} pv={5} onPress={() => {}}>
                <Card mode="outlined" style={{overflow: "hidden"}}>
                    <TouchableRipple onPress={() => {
                        navigation.navigate("SchoolDetails", {token, school_identifier})
                    }}>
                        <Flex p={10}>
                            <Card.Title title={school_name} titleNumberOfLines={2} subtitle={address} subtitleNumberOfLines={1} left={(props) => <Avatar.Icon {...props} icon="town-hall"/>}/>
                        </Flex>
                    </TouchableRipple>
                </Card>
            </Flex>
        )
    }

    const EmptyList = _ => {
        return (
            <VStack center spacing={20} p={30}>
                <Icon name="pencil-plus-outline" color={theme.colors.onBackground} size={50}/>
                <VStack center>
                    <Text variant="headlineSmall">
                        Sin escuelas
                    </Text>
                    <Text variant="bodyMedium" style={{textAlign: "center"}}>
                        No hay ninguna escuela registrado, ¿qué te parece si hacemos el primero?
                    </Text>
                </VStack>
                <Flex>
                    <Button icon="plus" mode="outlined" onPress={_ => {
                        navigation.navigate("AddSchool", {
                            user,
                            token
                        })
                    }}>
                        Agregar
                    </Button>
                </Flex>
            </VStack>
        )
    }

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
                        setSchools(undefined)
                        getSchools()
                    }}>
                        Reintentar
                    </Button>
                </Flex>
            </VStack>
        )
    }

    return (
        <Flex fill pt={headerMargin}>

            <FlatList 
                data={schools} 
                ListEmptyComponent={() => schools === undefined ? null : schools === null ? <NoConection/> : <EmptyList/>}
                refreshing={loading}
                onRefresh={_ => getSchools()}
                renderItem={({item}) => <Item onPress={() => {}} school_name={item.school_name} address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}`} school_identifier={item.school_identifier}/>}
            />

            {
                !(schools === undefined || schools === null) ? (
                    <FAB icon="plus" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                        navigation.navigate("AddSchool", {
                            user,
                            token
                        })
                    }}/>
                ) : (
                    null
                )
            }

        </Flex>
    )
}