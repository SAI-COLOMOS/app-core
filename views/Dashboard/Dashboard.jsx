import { Flex, VStack } from "@react-native-material/core"
import { useState, useEffect } from "react"
import * as SecureStore from 'expo-secure-store';
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default Dashboard = ({navigation, route}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()
    const greetings = [
        'Hola de nuevo',
        'Un gusto atenderte✨',
        'Hola',
        '¿Qué hay de nuevo?'
    ]

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

                <LinearGradient colors={[theme.colors.cover, theme.colors.background]} locations={[0.5, 1]} style={{width: "100%", height: "100%", position: "absolute"}} />
                
                {/* <Flex w={"100%"} h={"100%"} style={{backgroundColor: theme.colors.cover, position: "absolute"}}>
                </Flex> */}
            </Flex>

            <ScrollView>
                <VStack pb={50} spacing={50}>
                    <VStack items="center" pt={50}>
                        <Text variant="headlineLarge" style={{color: theme.colors.primary}}>
                            {greetings[Math.floor(Math.random() * greetings.length)]}
                        </Text>
                        <Text variant="headlineSmall" numberOfLines={1}>
                            {`${actualUser?.first_name} ${actualUser?.first_last_name} ${actualUser?.second_last_name}`}
                        </Text>
                    </VStack>

                    <Flex fill style={{borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: theme.colors.background}}>
                        <Flex p={25} center>
                            <Text variant="headlineSmall">
                                Tu centro de control
                            </Text>
                        </Flex>

                        <Flex direction="row" wrap="wrap" pr={25} pl={25} pb={50}>
                            
                            <Item screen="Profile" payload={{user: actualUser, token: actualToken}} icon="account-outline" title="Tu perfil"/>
                            <Item screen="Users" payload={{user: actualUser, token: actualToken}} icon="account-supervisor-outline" title="Usuarios"/>
                            <Item screen="PlacesAndAreas" payload={{user: actualUser, token: actualToken}} icon="map-marker-radius-outline" title="Lugares y áreas"/>

                        </Flex>
                    </Flex>
                </VStack>
            </ScrollView>

        </Flex>
    )
}