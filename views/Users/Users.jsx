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
    const [schools, setSchools] = useState(undefined)
    const [search, setSearch] = useState("")
    const [showSearch, setShowSearch] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    
    const [placesOptions, setPlacesOptions] = useState()
    const [areasOptions, setAreasOptions] = useState();
    const [schoolsOptions, setSchoolsOptions] = useState()
    const roleOptions = [
        {option: "Administrador"},
        {option: "Encargado"},
        {option: "Prestador"}
    ]
    const periodOptions = [
        {option: "A"},
        {option: "B"}
    ]

    const [placeFilter, setPlaceFilter] = useState("")
    const [areaFilter, setAreaFilter] = useState("")
    const [roleFilter, setRoleFilter] = useState("")
    const [yearFilter, setYearFilter] = useState("")
    const [periodFilter, setPeriodFilter] = useState("")
    const [schoolFilter, setSchoolFilter] = useState("")

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

            let placesData = []
            request.places.forEach(place => {
                let areasData = []

                place.place_areas.map(area => {
                    areasData.push({option: area.area_name})
                })

                placesData.push({option: place.place_name, areas: areasData})
            });
            setPlacesOptions(placesData)
        }else{
            setPlaces(request)
        }
    }

    const getSchools = async _ => {
        const request = await fetch(
            `${localhost}/schools`,
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

        if(request?.schools) {
            setSchools(request.schools)

            let schoolsData = []
            request.schools.forEach(school => {
                schoolsData.push({option: school.school_name})
            });
            setSchoolsOptions(schoolsData)
        }else{
            setSchools(request)
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
        setAreaFilter("")
        const placeSelected = placesOptions?.find(place => place.option == placeFilter)

        let areaData = []
        placeSelected?.areas.forEach(area => {
            areaData.push({option: area.option})
        });

        setAreasOptions(areaData)

    }, [placeFilter]);

    useEffect(() => {
        let filters = {}

        if(placeFilter !== "") {
            filters = {...filters, place: placeFilter}
        }

        if(areaFilter !== "") {
            filters = {...filter, assigned_area: areaFilter}
        }

        if(roleFilter !== "") {
            filters = {...filter, role: roleFilter}
        }

        if(yearFilter !== "") {
            filters = {...filter, year: yearFilter}
        }

        if(periodFilter !== "") {
            filters = {...filter, period: periodFilter}
        }

        if(schoolFilter !== "") {
            filters = {...filter, school: schoolFilter}
        }

        setFilter(filters)
    }, [placeFilter, areaFilter, roleFilter, yearFilter, periodFilter, schoolFilter])

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

    useEffect(() => {
        if(schools === undefined) {
            getSchools()
        }
    }, [schools])
        
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

    const FilterOptions =_ => {
        return (
            <VStack spacing={10}>
                <HStack items="end">
                    <Flex fill>
                        <Dropdown title="Bosque urbano" value={placeFilter} selected={setPlaceFilter} options={placesOptions} />
                    </Flex>
                    {
                        placeFilter ? (
                            <IconButton icon="delete" mode="outlined" onPress={() => setPlaceFilter("")}/>
                        ) : (
                            null
                        )
                    }
                </HStack>

                {
                    placeFilter && areasOptions.length > 0 ? (
                        <HStack items="end">
                            <Flex fill>
                                <Dropdown title="Área asignada" value={areaFilter} selected={setAreaFilter} options={areasOptions} />
                            </Flex>
                            {
                                areaFilter ? (
                                    <IconButton icon="delete" mode="outlined" onPress={() => setAreaFilter("")}/>
                                ) : (
                                    null
                                )
                            }
                        </HStack>
                    ) : (
                        null
                    )
                }

                <HStack items="end">
                    <Flex fill>
                        <Dropdown title="Rol" value={roleFilter} selected={setRoleFilter} options={roleOptions} />
                    </Flex>
                    {
                        roleFilter ? (
                            <IconButton icon="delete" mode="outlined" onPress={() => setRoleFilter("")}/>
                        ) : (
                            null
                        )
                    }
                </HStack>

                <HStack items="end">
                    <Flex fill>
                        <TextInput value={yearFilter} onChangeText={setYearFilter} mode="outlined" label="Año de inscripción" maxLength={4} keyboardType="numeric"/>
                    </Flex>
                    {
                        yearFilter ? (
                            <IconButton icon="delete" mode="outlined" onPress={() => setYearFilter("")}/>
                        ) : (
                            null
                        )
                    }
                </HStack>

                <HStack items="end">
                    <Flex fill>
                        <Dropdown title="Periodo de inscripción" value={periodFilter} selected={setPeriodFilter} options={periodOptions} />
                    </Flex>
                    {
                        periodFilter ? (
                            <IconButton icon="delete" mode="outlined" onPress={() => setPeriodFilter("")}/>
                        ) : (
                            null
                        )
                    }
                </HStack>

                <HStack items="end">
                    <Flex fill>
                        <Dropdown title="Escuela" value={schoolFilter} selected={setSchoolFilter} options={schoolsOptions} />
                    </Flex>
                    {
                        schoolFilter ? (
                            <IconButton icon="delete" mode="outlined" onPress={() => setSchoolFilter("")}/>
                        ) : (
                            null
                        )
                    }
                </HStack>

            </VStack>
        )
    }

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