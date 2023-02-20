import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { Card, IconButton, Text, TextInput, useTheme, Avatar, FAB, Button } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header";
import Constants from "expo-constants"
import { RefreshControl, ScrollView } from "react-native";

export default Users = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {user, token} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState(undefined)

    const getUsers = async _ => {
        setLoading(true)

        const request = await fetch(
            `${localhost}/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: 5
                })
            }
        ).then(
            response => response.ok ? response.json() : response.status
        )

        if(request?.users) {
            setUsers(request.users)
        }

        console.log(users)

        setLoading(false)
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: "Usuarios"
        })
    }, [])

    useEffect(() => {
        if(users === undefined) {
            getUsers()
        }
    }, [users])

    const Item = ({user}) => {
        return (
            <Card>
                <Card.Title
                    title={`${user.first_name} ${user.first_last_name} ${user.second_last_name}`}
                    subtitle={`${user.register} - ${user.status}`}
                    left={props => <Avatar.Icon {...props} icon="account"/>}
                />
            </Card>
        )
    }

    return (
        <Flex fill pt={headerMargin}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {getUsers()}}/>}>
                <VStack p={10} spacing={10}>
                    {
                        users !== undefined ? (
                            users?.length > 0 ? (
                                users.map(user => (
                                    <Item key={user.register} user={user}/>
                                ))
                            ) : (
                                <Text>
                                    Hola
                                </Text>
                            )
                        ) : (
                            <VStack center spacing={20}>
                                <IconButton icon="wifi-alert" size={50}/>
                                <VStack center>
                                    <Text variant="headlineSmall">
                                        Ocurrió un problema
                                    </Text>
                                    <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                        No podemos recuperar los usuarios, revisa tu conexión a internet e intentalo de nuevo
                                    </Text>
                                </VStack>
                                <Flex>
                                    <Button mode="outlined" onPress={_ => {getUsers()}}>
                                        Reintentar
                                    </Button>
                                </Flex>
                            </VStack>
                        )
                    }
                </VStack>
            </ScrollView>

            <FAB icon="plus" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                navigation.navigate("AddUser", {
                    user,
                    token
                })
            }}/>
        </Flex>
    )
}