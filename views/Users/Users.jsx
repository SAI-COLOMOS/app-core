import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB, Button } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header";
import Constants from "expo-constants"
import { RefreshControl, ScrollView, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

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
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                }
            }
        ).then(
            response => response.ok ? response.json() : response.status
        ).catch(
            _ => null
        )
        
        setLoading(false)

        if(request?.users) {
            setUsers(request.users)
        }else{
            setUsers(request)
        }
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
    
    useFocusEffect(useCallback(() => {
        getUsers()
        return () => {}
    }, []))

    const Item = ({first_name, role, avatar, register}) => {
        return (
            <Flex ph={20} pv={5} onPress={() => {}}>
                <Card mode="outlined" style={{overflow: "hidden"}}>
                    <TouchableRipple onPress={() => {
                        navigation.navigate("UserDetails", {token, register})
                    }}>
                        <Flex p={10}>
                            <Card.Title title={first_name} titleNumberOfLines={2} subtitle={role} subtitleNumberOfLines={1} left={(props) => avatar ? <Avatar.Image {...props} source={{uri: `data:image/png;base64,${avatar}`}} /> : <Avatar.Icon {...props} icon="account"/>}  />
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
                        Sin usuarios
                    </Text>
                    <Text variant="bodyMedium" style={{textAlign: "center"}}>
                        No hay ningun usuario registrado, ¿qué te parece si hacemos el primero?
                    </Text>
                </VStack>
                <Flex>
                    <Button icon="plus" mode="outlined" onPress={_ => {
                        navigation.navigate("AddUser", {
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
                        setUsers(undefined)
                        getUsers()
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
                data={users} 
                ListEmptyComponent={() => users === undefined ? null : users === null ? <NoConection/> : <EmptyList/>}
                refreshing={loading}
                onRefresh={_ => getUsers()}
                renderItem={({item}) => <Item onPress={() => {}} first_name={`${item.first_name} ${item.first_last_name}`} role={`${item.role} - ${item.register} - ${item.status}`} register={item.register} avatar={item?.avatar}/>}
            />

            <FAB icon="plus" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                navigation.navigate("AddUser", {
                    user,
                    token
                })
            }}/>
        </Flex>
    )
}