import { Flex, HStack, VStack } from '@react-native-material/core'
import { useCallback, useEffect, useState } from 'react'
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB, Button } from 'react-native-paper'
import { useHeaderHeight } from '@react-navigation/elements'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { FlatList } from 'react-native'


export default Cards = ({navigation, route}) => {
  const headerMargin = useHeaderHeight()
  const { user, token } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState(undefined)
  const [users, setUsers] = useState(undefined)


  const getUsers = async (_) => {
    let filters = {
      "role": "Prestador"
    }
    
    const request = await fetch(
        
      `${localhost}/users?filter=${JSON.stringify(filters)}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      }
    ).then((response) => (response.ok ? response.json() : response.status)
    ).catch((_) => null)

    if (request?.users) {
        setUsers(request.users)
      } else {
        setUsers(request)
      }
  }

  const getCard = async (_) => {
    const request = await fetch (
      `${localhost}/cards`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      }
    ).then((response) => (response.ok ? response.json() : response.status)
    ).catch((_) => null)

    if(request?.cards){
      setCards(request.cards)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: 'Asignar horas'
    })
  }, [])


  useEffect(() => {
        if (users === undefined) {
            getUsers()
        }
  }, [users])

  const Item = useCallback(({ first_name, role, avatar, user }) => {
    return (
      <Flex ph={20} pv={5} onPress={() => {}}>
        <Card mode="outlined" style={{ overflow: 'hidden' }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate('CardDetailsNex', { token, user })
            }}
          >
            <Flex p={10}>
              <Card.Title title={first_name} titleNumberOfLines={2} subtitle={role} subtitleNumberOfLines={2} left={(props) => (avatar ? <Avatar.Image {...props} source={{ uri: `data:image/png;base64,${avatar}` }} /> : <Avatar.Icon {...props} icon="account" />)} />
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
            No hay ningun usuario registrado
          </Text>
        </VStack>
        {/* <Flex>
          <Button
            icon="plus"
            mode="outlined"
            onPress={(_) => {
              navigation.navigate('AddUser', {
                user,
                token
              })
            }}
          >
            Agregar
          </Button>
        </Flex> */}
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
              setUsers(undefined)
              getUsers()
            }}
          >
            Reintentar
          </Button>
        </Flex>
      </VStack>
    )
  }, [])

  return (
    <Flex fill pt={headerMargin}>
        <FlatList data={users} ListEmptyComponent={() => (users === undefined ? null : users === null ? <NoConection /> : <EmptyList />)} refreshing={loading} onRefresh={(_) => getUsers()} renderItem={({ item }) => <Item onPress={() => {}} first_name={`${item.first_name} ${item.first_last_name} ${item.second_last_name ?? ''}`} role={`${item.register}`} user={item} avatar={item?.avatar} />}/>
    </Flex>
  )
}