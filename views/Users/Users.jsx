import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { Card, IconButton, Text, TextInput, useTheme, Avatar, FAB } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header";
import { RefreshControl, ScrollView } from "react-native";

export default Users = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {user, token} = route.params

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState(undefined)

    const getUsers = async _ => {
        setLoading(true)

        const request = await fetch(
            'https://966b-2806-261-498-9a0d-8d55-c415-f13c-a61a.ngrok.io/users',
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
                            users.map(user => (
                                <Item key={user.register} user={user}/>
                            ))
                        ) : (
                            null
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