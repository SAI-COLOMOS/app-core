import { Flex, VStack } from '@react-native-material/core'
import { useState, useEffect, useCallback } from 'react'
import { Avatar, Button, Card, FAB, IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/elements'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import { FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchBar from '../Shared/SearchBar'
import InformationMessage from '../Shared/InformationMessage'

export default PlaceAndAreas = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()
  const { user, token } = route.params
  const headerMargin = useHeaderHeight()

  const [places, setPlaces] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(null)
  const [search, setSearch] = useState('')
  const [foundPlaces, setFoundPlaces] = useState(undefined)

  async function getPlaces() {
    setLoading(true)

    const request = await fetch(`${localhost}/places`, {
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

    if (request?.places) {
      setPlaces(request.places)
      console.log(request)
    } else {
      setPlaces(request)
    }
  }

  async function searchPlaces() {
    setLoading(true)

    if (search === '') {
      setFoundPlaces(undefined)
      setLoading(false)
      return
    }
    const request = await fetch(`${localhost}/places?search=${search}`, {
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

    if (request?.places) {
      setFoundPlaces(request.places)
    } else {
      setFoundPlaces(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} children={[<IconButton icon="magnify" onPress={() => setShowSearch(!showSearch)} />]} />,
      headerTransparent: true,
      headerTitle: 'Bosques urbanos'
    })
  }, [showSearch])

  useFocusEffect(
    useCallback(() => {
      getPlaces()
      return () => {}
    }, [])
  )

  const Item = ({ place_name, place_address, place_identifier }) => {
    return (
      <Flex key={`ID-${place_identifier}`} ph={20} pv={5} onPress={() => {}}>
        <Card mode="outlined" style={{ overflow: 'hidden' }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate('PlaceDetails', { token, place_identifier })
            }}
          >
            <Flex p={10}>
              <Card.Title title={place_name} titleNumberOfLines={2} subtitle={place_address} subtitleNumberOfLines={1} left={(props) => <Avatar.Icon {...props} icon="forest" />} />
            </Flex>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }

  return (
    <Flex fill pt={headerMargin}>
      <SearchBar show={showSearch} label="Busca por nombre del busque urbano" value={search} setter={setSearch} action={searchPlaces} />

      {search == '' ? (
        places !== null ? (
          places?.length >= 0 || places === undefined ? (
            <Flex fill>
              <FlatList
                data={places}
                ListEmptyComponent={() =>
                  places === undefined ? null : (
                    <InformationMessage
                      icon="pencil-plus-outline"
                      title="Sin bosques urbanos"
                      description="No hay ningún bosque urbano registrado, ¿qué te parece si hacemos el primero?"
                      buttonIcon="plus"
                      buttonTitle="Agregar"
                      action={() => {
                        navigation.navigate('AddPlace', {
                          user,
                          token
                        })
                      }}
                    />
                  )
                }
                refreshing={loading}
                onRefresh={() => getPlaces()}
                renderItem={({ item }) => <Item place_name={item.place_name} place_address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}, ${item.postal_code}`} place_identifier={item.place_identifier} />}
              />

              <FAB
                icon="plus"
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                onPress={() => {
                  navigation.navigate('AddPlace', {
                    user,
                    token
                  })
                }}
              />
            </Flex>
          ) : (
            <InformationMessage
              icon="bug-outline"
              title="¡Ups! Error nuestro"
              description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
              buttonTitle="Volver a cargar"
              buttonIcon="reload"
              action={() => {
                setPlaces(undefined)
                getPlaces()
              }}
            />
          )
        ) : (
          <InformationMessage
            icon="wifi-alert"
            title="Sin conexión"
            description="Parece que no tienes conexión a internet, conéctate e intenta de nuevo"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setPlaces(undefined)
              getPlaces()
            }}
          />
        )
      ) : foundPlaces !== null ? (
        foundPlaces?.length >= 0 || foundPlaces === undefined ? (
          <Flex fill>
            <FlatList data={foundPlaces} ListEmptyComponent={() => (foundPlaces === undefined ? null : <InformationMessage icon="magnify" title="Sin resultados" description="No hay ningún bosque urbano registrado que cumpla con los parámetros de tu búsqueda" />)} refreshing={loading} onRefresh={() => searchPlaces()} renderItem={({ item }) => <Item place_name={item.place_name} place_address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}, ${item.postal_code}`} place_identifier={item.place_identifier} />} />
          </Flex>
        ) : (
          <InformationMessage
            icon="bug-outline"
            title="¡Ups! Error nuestro"
            description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setFoundPlaces(undefined)
              searchPlaces()
            }}
          />
        )
      ) : (
        <InformationMessage
          icon="wifi-alert"
          title="Sin conexión"
          description="Parece que no tienes conexión a internet, conéctate e intenta de nuevo"
          buttonTitle="Volver a cargar"
          buttonIcon="reload"
          action={() => {
            setFoundPlaces(undefined)
            searchPlaces()
          }}
        />
      )}
    </Flex>
    // <Flex fill pt={headerMargin}>
    //   <SearchBar show={showSearch} label="Busca por nombre del bosque urbano" value={search} setter={setSearch} action={getPlaces} />

    //   <FlatList data={places} ListEmptyComponent={() => (places === undefined ? null : places === null ? <NoConection /> : <EmptyList />)} refreshing={loading} onRefresh={() => getPlaces()} renderItem={({ item }) => <Item place_name={item.place_name} place_address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}, ${item.postal_code}`} place_identifier={item.place_identifier} />} />

    //   {!(places === undefined || places === null) ? (
    //     <FAB
    //       icon="plus"
    //       style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
    //       onPress={() => {
    //         navigation.navigate('AddPlace', {
    //           user,
    //           token
    //         })
    //       }}
    //     />
    //   ) : null}
    // </Flex>
  )
}
