import { Flex, HStack, VStack } from '@react-native-material/core'
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

export default Schools = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()
  const { user, token } = route.params
  const headerMargin = useHeaderHeight()

  const [schools, setSchools] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(null)
  const [search, setSearch] = useState('')
  const [foundSchools, setFoundSchools] = useState(undefined)

  async function getSchools() {
    setLoading(true)

    const request = await fetch(`${localhost}/schools`, {
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

    if (request?.schools) {
      setSchools(request.schools)
      console.log(request)
    } else {
      setSchools(request)
    }
  }

  async function searchSchools() {
    setLoading(true)

    if (search === '') {
      setFoundSchools(undefined)
      setLoading(false)
      return
    }

    const request = await fetch(`${localhost}/schools?search=${search}`, {
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

    if (request?.schools) {
      setFoundSchools(request.schools)
    } else {
      setFoundSchools(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} children={[<IconButton key="SearchButton" icon="magnify" onPress={() => setShowSearch(!showSearch)} />]} />,
      headerTransparent: true,
      headerTitle: 'Escuelas'
    })
  }, [showSearch])

  useFocusEffect(
    useCallback(() => {
      getSchools()

      return () => {}
    }, [])
  )

  const Item = ({ school_name, address, school_identifier }) => {
    return (
      <Flex ph={20} pv={5} onPress={() => {}}>
        <Card mode="outlined" style={{ overflow: 'hidden' }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate('SchoolDetails', { token, school_identifier })
            }}
          >
            <Flex p={10}>
              <Card.Title title={school_name} titleNumberOfLines={2} subtitle={address} subtitleNumberOfLines={1} left={(props) => <Avatar.Icon {...props} icon="town-hall" />} />
            </Flex>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }

  return (
    <Flex fill pt={headerMargin}>
      <SearchBar show={showSearch} label="Busca por nombre de la escuela" value={search} setter={setSearch} action={searchSchools} />

      {search == '' ? (
        schools !== null ? (
          schools?.length >= 0 || schools === undefined ? (
            <Flex fill>
              <FlatList
                data={schools}
                ListEmptyComponent={() =>
                  schools === undefined ? null : (
                    <InformationMessage
                      icon="pencil-plus-outline"
                      title="Sin escuelas"
                      description="No hay ninguna escuela registrada, ¿qué te parece si hacemos la primera?"
                      buttonIcon="plus"
                      buttonTitle="Agregar"
                      action={() => {
                        navigation.navigate('AddForm', {
                          user,
                          token
                        })
                      }}
                    />
                  )
                }
                refreshing={loading}
                onRefresh={() => getSchools()}
                renderItem={({ item }) => <Item key={item.school_name} school_name={item.school_name} address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}`} school_identifier={item.school_identifier} />}
              />

              <FAB
                icon="plus"
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                onPress={() => {
                  navigation.navigate('AddForm', {
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
                setSchools(undefined)
                getSchools()
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
              setSchools(undefined)
              getSchools()
            }}
          />
        )
      ) : foundSchools !== null ? (
        foundSchools?.length >= 0 || foundSchools === undefined ? (
          <Flex fill>
            <FlatList data={foundSchools} ListEmptyComponent={() => (foundSchools === undefined ? null : <InformationMessage icon="magnify" title="Sin resultados" description="No hay ninguna escuela registrada que cumpla con los parámetros de tu búsqueda" />)} refreshing={loading} onRefresh={() => searchSchools()} renderItem={({ item }) => <Item key={item.school_name} school_name={item.school_name} address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}`} school_identifier={item.school_identifier} />} />
          </Flex>
        ) : (
          <InformationMessage
            icon="bug-outline"
            title="¡Ups! Error nuestro"
            description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setFoundSchools(undefined)
              searchSchools()
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
            setFoundSchools(undefined)
            searchSchools()
          }}
        />
      )}
    </Flex>
  )
}
