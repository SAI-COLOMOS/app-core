import { Flex, VStack } from "@react-native-material/core"
import { useHeaderHeight } from '@react-navigation/elements'
import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB, Button } from 'react-native-paper'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import { FlatList, RefreshControl, ScrollView } from "react-native"
import DisplayDetails from "../Shared/DisplayDetails"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default CardDetails = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {token, register } = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()

    const [loading, setLoading] = useState(false)
    const [card, setCard] = useState(undefined)
    const [user, setUser] = useState(undefined)
    const [activities, setActivities] = useState();

    const getCard = async(_) => {
        setLoading(true)
        const request = await fetch (`${localhost}/cards/${user?.register}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
        }
        })
        .then((response) => (response.ok ? response.json() : response.status))
        .catch(() => null)

        setLoading(false)
        
        // console.log(request.activities)
        // console.log(activities.hours)

        if (request?.activities){
            setCard(request.activities)
            console.log("Aqui es")
        }

    }

    async function getUser() {
        setLoading(true)
        const request = await fetch(`${localhost}/users/${register}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
        }
        })
        .then((response) => (response.ok ? response.json() : response.status))
        .catch(() => null)

        setLoading(false)

        if (request?.user) {
        setUser(request.user)
        }
    }

    useEffect(() => {
        navigation.setOptions({
          header: (props) => <Header {...props} /*children={[<IconButton icon="filter-outline" onPress={() => setShowFilters(!showFilters)} />, <IconButton icon="magnify" onPress={() => setShowSearch(!showSearch)} />]}*/ />,
          headerTransparent: true,
          headerTitle: 'Detalles de horas'
        })
    }, [/*showSearch, showFilters*/])

    // useFocusEffect(
    //     useCallback(() => {
    //       getCard()
    //       return () => {}
    //     }, [])
    // )
  
    useEffect(() => {
        if(activities === undefined){
            getCard()
        }
    },[activities])

    useEffect(() => {
        if(user === undefined){
            getUser()
        }
    },[user])

    // useFocusEffect(
    //     useCallback(() => {
    //         getUser()
    //         return () => {}
    //     }, [])
    // )

    const Actividades = () => {
        return (
            <VStack p={20} spacing={10}>
                <Text variant="bodyLarge"> Actividades</Text>
                <VStack spacing={2}>
                    <Text variant="labelSmall">Nombre de actividad</Text>
                    <Text variant="bodyMedium">{card?.activity_name}</Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">Horas asignadas</Text>
                    <Text variant="bodyMedium">{card?.hours}</Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">Registro del encargado</Text>
                    <Text variant="bodyMedium">{card?.responsible_register}</Text>
                </VStack>
                <VStack spacing={2}>
                    <Text variant="labelSmall">Fecha</Text>
                    <Text variant="bodyMedium">{card?.assignation_date}</Text>
                </VStack>
            </VStack>
        )
    }

    const Item = useCallback(({Name, Hours, Responsible, Date}) => {
        return (
            // console.log("xd"),
            <Flex ph={20} pv={5} onPress={() => {}}>
                <Card mode="outlined" style={{ overflow: 'hidden' }}>
                    <TouchableRipple
                    onPress={() => {
                        navigation.navigate('EditCard', { token, register, activities})
                      }}
                    >
                    <Flex pt={5} pb={10}>
                        <Card.Title title={Name} titleNumberOfLines={2} subtitle={`Horas asignadas: ${Hours}  \nRegistro del responsable: ${Responsible} \nFecha ${Date}`} subtitleNumberOfLines={3} />
                    </Flex>
                    </TouchableRipple>
                </Card>
            </Flex>
        )
    }, [])

    const EmptyList = useCallback((_) => {
        return (
          <VStack center spacing={20} p={30}>
            <Icon name="pencil-plus-outline" color={theme.colors.onBackground} size={50} />
            <VStack center>
              <Text variant="headlineSmall">Sin usuarios</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                No hay ninguna actividad registrada, ¿qué te parece si hacemos la primera?
              </Text>
            </VStack>
            <Flex>
              <Button
                icon="plus"
                mode="outlined"
                onPress={(_) => {
                  navigation.navigate('AddCard', {
                    user,
                    token
                  })
                }}
              >
                Agregar
              </Button>
            </Flex>
          </VStack>
        )
      }, [])
    
      const NoConection = useCallback((_) => {
        return (
          <VStack center spacing={20} p={30}>
            <Icon name="wifi-alert" color={theme.colors.onBackground} size={50} />
            <VStack center>
              <Text variant="headlineSmall">Sin conexión</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                Parece que no tienes conexión a internet, conectate e intenta de nuevo
              </Text>
            </VStack>
            <Flex>
              <Button
                icon="reload"
                mode="outlined"
                onPress={(_) => {
                  setActivities(undefined)
                  getCard()
                }}
              >
                Reintentar
              </Button>
            </Flex>
          </VStack>
        )
      }, [])

    return (
        <Flex fill pt={headerMargin - 20}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getCard()}/>}>
                <DisplayDetails photo={user?.avatar} icon={"account"} title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? '' : user?.second_last_name}`} children={[/*Actividades()*/]}/>
            </ScrollView>
                <FlatList data={card} ListEmptyComponent={() => (card === undefined ? null : card === null ? <NoConection /> : <EmptyList />)} refreshing={loading} onRefresh={(_) => getCard} renderItem={({item}) => <Item onPress={() => {}} Name={`${item.activity_name}`} Hours={`${item.hours}`} Responsible={`${item.responsible_register}`} Date={`${item.assignation_date}`}/>} />
               { <FAB
                    icon="plus"
                    style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                    onPress={() => {
                        navigation.navigate('AddCard', {
                            user,
                            token
                        })
                    }}
                />}
                {/* { <FAB 
                    icon="pencil-outline"
                    style={{ position: 'absolute', margin: 16, left: 0, bottom: 0 }}
                    onPress={() => {
                        navigation.navigate('EditCard', {
                            user,
                            token
                        })
                    }}
                />} */}
        </Flex>
    )
}