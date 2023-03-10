import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB, Button } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header";
import Constants from "expo-constants"
import { RefreshControl, ScrollView, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBar from "../Shared/SearchBar";
import ModalFilters from "../Shared/ModalFilters";
import Dropdown from "../Shared/Dropdown";

export default Users = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {user, token} = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState(undefined)
    const [places, setPlaces] = useState(undefined)
    const [search, setSearch] = useState("")
    const [showSearch, setShowSearch] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    
    const [placesOptions, setPlacesOptions] = useState([{option: "Sin filtro", value: null}])
    const [areasOptions, setAreasOptions] = useState([{option: "Sin filtro", value: null}]);

    const [placeFilter, setPlaceFilter] = useState({option: "Sin filtro", value: null})
    const [areaFilter, setAreaFilter] = useState({option: "Sin filtro", value: null})

    const [filter, setFilter] = useState({})


    const getUsers = async _ => {
        setLoading(true)

        const request = await fetch(
            `${localhost}/users?search=${search}&filter=${JSON.stringify(filter)}`,
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

    const getPlaces = async _ => {
        const request = await fetch(
            `${localhost}/places`,
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

        if(request?.places) {
            setPlaces(request.places)

            let options = [{option: "Sin filtro", value: null}]
            request.places.forEach(place => {
                options.push({option: place.place_name, value: place.place_name})
            });
            setPlacesOptions(options)

        }else{
            setPlaces(request)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props} children={[
                <IconButton icon="filter-outline" onPress={() => setShowFilters(!showFilters)}/>,
                <IconButton icon="magnify" onPress={() => setShowSearch(!showSearch)}/>
            ]}/>,
            headerTransparent: true,
            headerTitle: "Usuarios"
        })
    }, [showSearch, showFilters])

    useEffect(() => {
        setAreaFilter({option: "Sin filtro", value: null})
        const placeSelected = places?.find(place => place.place_name == placeFilter.option)

        let options = [{option: "Sin filtro", value: null}]
        placeSelected?.place_areas.forEach(place => {
            options.push({option: place.area_name, value: place.area_name})
        });

        setAreasOptions(options)

    }, [placeFilter]);

    useEffect(() => {
        let filters = {}

        if(placeFilter.value !== null) {
            filters = {...filters, place: placeFilter.value }
        }

        if(areaFilter.value !== null) {
            filters = {...filter, assigned_area: areaFilter.value}
        }

        setFilter(filters)
    }, [placeFilter, areaFilter])

    useEffect(() => {
        if(users === undefined) {
            getUsers()
        }
    }, [users])
    
    useEffect(() => {
        if(places === undefined) {
            getPlaces()
        }
    }, [places])
        
    // useFocusEffect(useCallback(() => {
    //     getUsers()
    //     getPlaces()
    //     console.log("from focus effect", filter)
    //     return () => {}
    // },[filter], []))

    const Item = useCallback(({first_name, role, avatar, register}) => {
        return (
            <Flex ph={20} pv={5} onPress={() => {}}>
                <Card mode="outlined" style={{overflow: "hidden"}}>
                    <TouchableRipple onPress={() => {
                        navigation.navigate("UserDetails", {token, register})
                    }}>
                        <Flex p={10}>
                            <Card.Title title={first_name} titleNumberOfLines={2} subtitle={role} subtitleNumberOfLines={2} left={(props) => avatar ? <Avatar.Image {...props} source={{uri: `data:image/png;base64,${avatar}`}} /> : <Avatar.Icon {...props} icon="account"/>}  />
                        </Flex>
                    </TouchableRipple>
                </Card>
            </Flex>
        )
    }, [])

    const EmptyList = useCallback(_ => {
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
    }, [])

    const NoConection = useCallback(_ => {
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
    }, [])

    const FilterOptions = useCallback(_ => {
        return (
            <VStack spacing={10}>
                <Flex>
                    <Dropdown title="Bosque urbano" value={placeFilter.option} selected={setPlaceFilter} options={placesOptions} />
                </Flex>
                {
                    placeFilter.value !== null ? (
                        <Flex>
                            <Dropdown title="Área asignada" value={areaFilter.option} selected={setAreaFilter} options={areasOptions} />
                        </Flex>
                    ) : (
                        null
                    )
                }
                <Flex>
                    <Dropdown title="Rol" value={placeFilter} selected={setPlaceFilter} options={[{option: "A"},{option:"B"}]} />
                </Flex>
                <HStack spacing={20}>
                    <Flex fill>
                        <Dropdown title="Año" value={placeFilter} selected={setPlaceFilter} options={[{option: "A"},{option:"B"}]} />
                    </Flex>
                    <Flex fill>
                        <Dropdown title="Periodo" value={placeFilter} selected={setPlaceFilter} options={[{option: "A"},{option:"B"}]} />
                    </Flex>
                </HStack>
                
            </VStack>
        )
    }, [filter])

    return (
        <Flex fill pt={headerMargin}>

            <Flex>
                <SearchBar show={showSearch} label="Busca por nombre, registro, correo o teléfono" value={search} setter={setSearch} action={getUsers}/>
            </Flex>

            <FlatList
                data={users} 
                ListEmptyComponent={() => users === undefined ? null : users === null ? <NoConection/> : <EmptyList/>}
                refreshing={loading}
                onRefresh={_ => getUsers()}
                renderItem={({item}) => <Item onPress={() => {}} first_name={`${item.first_name} ${item.first_last_name}`} role={`${item.register}`} register={item.register} avatar={item?.avatar}/>}
            />

            <FAB icon="plus" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                navigation.navigate("AddUser", {
                    user,
                    token
                })
            }}/>

            <ModalFilters handler={[showFilters, () => setShowFilters(!showFilters)]} child={FilterOptions()} action={() => getUsers()}/>


        </Flex>
    )
}