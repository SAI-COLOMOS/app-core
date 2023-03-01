import { Flex, VStack } from "@react-native-material/core"
import { useState, useEffect, useCallback } from "react"
import * as SecureStore from 'expo-secure-store';
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";

export default Dashboard = ({navigation, route}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()
    const {width} = useWindowDimensions()

    const [greeting, setGreeting] = useState("Hola")
    const [timeToSleep, setTimeToSleep] = useState(false)
    const [actualUser, setActualUser] = useState(undefined)
    const [actualToken, setActualToken] = useState(undefined)

    useEffect(() => {
        const getUser = async _ => {
            const user = JSON.parse(await SecureStore.getItemAsync("user"))
            user ? setActualUser(user) : setActualUser(undefined)
        }

        if(actualUser === undefined) {
            getUser()
        }

        console.log("From acá", actualUser)

    }, [actualUser])

    useEffect(() => {
        const getToken = async _ => {
            const token = await SecureStore.getItemAsync("token")
            token ? setActualToken(token) : setActualToken(undefined)
        }

        if(actualToken === undefined) {
            getToken()
        }
    }, [actualToken])

    useFocusEffect(useCallback(() => {
        const time = new Date().getHours()

        if (time >= 7 && time < 12) {
            setGreeting("Buen día")
        }

        if (time >= 12 && time < 19) {
            setGreeting("Buena tarde")
        }

        if (time >= 19 || time < 7) {
            setGreeting("Buena noche")
        }

        if (time >= 22 || time < 5) {
            setTimeToSleep(true)
        } else {
            setTimeToSleep(false)
        }

        return () => {}
    }, []))

    const Item = ({screen, payload, icon, title}) => {
        return (
            <Flex w={"50%"} p={10}>
                <Card mode="outlined">
                    <TouchableRipple onPress={() => {
                        navigation.navigate(screen, {...payload})
                    }}>
                        <VStack center p={20} spacing={10}>
                            <Avatar.Icon icon={icon} size={50} />

                            <Text>
                                {title}
                            </Text>
                        </VStack>
                    </TouchableRipple>
                </Card>
            </Flex>
        )
    }

    return (
        <Flex fill pt={insets.top}>
            <Flex w={"100%"} h={"35%"} style={{backgroundColor: "#ff0099", position: "absolute"}}>
                {
                    {
                        0: <Image source={require('../../assets/imagees/cover/1.jpg')} style={{width: "100%", height: "100%"}}/>,
                        1: <Image source={require('../../assets/imagees/cover/2.jpg')} style={{width: "100%", height: "100%"}}/>,
                        2: <Image source={require('../../assets/imagees/cover/3.jpg')} style={{width: "100%", height: "100%"}}/>,
                        3: <Image source={require('../../assets/imagees/cover/4.jpg')} style={{width: "100%", height: "100%"}}/>,
                        4: <Image source={require('../../assets/imagees/cover/5.jpg')} style={{width: "100%", height: "100%"}}/>,
                    }[Math.floor(Math.random() * 4)]
                }

                <LinearGradient colors={[theme.colors.cover, theme.colors.background]} locations={[0.75, 1]} style={{width: "100%", height: "100%", position: "absolute"}} />
                
            </Flex>

            <ScrollView>
                <VStack pb={50} spacing={50}>
                    <VStack items="center" pt={50}>
                        <Text variant="headlineLarge" style={{color: theme.colors.primary}}>
                            {greeting}
                        </Text>
                        <Text variant="headlineSmall" numberOfLines={1}>
                            {actualUser?.first_name}
                        </Text>
                        {
                            timeToSleep ? (
                                <Text variant="bodyMedium" numberOfLines={1}>
                                    No dilates, dormir es importante ✨
                                </Text>
                            ) : (
                                null
                            )
                        }
                    </VStack>

                    <Flex fill style={{borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: theme.colors.background}}>
                        <Flex p={25} center>
                            <Text variant="headlineSmall">
                                Tu centro de control
                            </Text>
                        </Flex>

                        <Flex direction="row" wrap="wrap" pr={25} pl={25} pb={50}>
                            
                            <Item screen="Profile" payload={{user: actualUser, token: actualToken}} icon="account-outline" title="Tu perfil"/>


                            {
                                actualUser?.role == "Administrador" || actualUser?.role == "Encargado" ? (
                                    <Item screen="Users" payload={{user: actualUser, token: actualToken}} icon="account-supervisor-outline" title="Usuarios"/>
                                ) : (
                                    null
                                )
                            }

                            {
                                actualUser?.role == "Administrador" ? (
                                    <Item screen="PlacesAndAreas" payload={{user: actualUser, token: actualToken}} icon="map-marker-radius-outline" title="Lugares y áreas"/>
                                ) : (
                                    null
                                )
                            }

                            {
                                actualUser?.role == "Administrador" ? (
                                    <Item screen="Schools" payload={{user: actualUser, token: actualToken}} icon="town-hall" title="Escuelas"/>
                                ) : (
                                    null
                                )
                            }



                        </Flex>
                    </Flex>
                </VStack>
            </ScrollView>

        </Flex>
    )
}