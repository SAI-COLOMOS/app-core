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
import { it } from 'react-native-paper-dates'

export default Forms = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()
  const { user, token } = route.params
  const headerMargin = useHeaderHeight()

  const [forms, setForms] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(null)
  const [search, setSearch] = useState('')
  const [foundForms, setFoundForms] = useState(undefined)

  async function getForms() {
    setLoading(true)

    const request = await fetch(`${localhost}/forms`, {
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

    if (request?.forms) {
      setForms(request.forms)
      console.log(request)
    } else {
      setForms(request)
    }
  }

  async function searchForms() {
    setLoading(true)

    if (search === '') {
      setFoundForms(undefined)
      setLoading(false)
      return
    }

    const request = await fetch(`${localhost}/forms?search=${search}`, {
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

    if (request?.forms) {
      setFoundForms(request.forms)
    } else {
      setFoundForms(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} children={[<IconButton key="SearchButton" icon="magnify" onPress={() => setShowSearch(!showSearch)} />]} />,
      headerTransparent: true,
      headerTitle: 'Formularios'
    })
  }, [showSearch])

  useFocusEffect(
    useCallback(() => {
      getForms()

      return () => {}
    }, [])
  )

  const Item = ({ form_name, description, form_identifier }) => {
    return (
      <Flex ph={20} pv={5} onPress={() => {}}>
        <Card mode="outlined" style={{ overflow: 'hidden' }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate('FormDetails', { token, form_identifier })
            }}
          >
            <Flex p={10}>
              <Card.Title title={form_name} titleNumberOfLines={2} subtitle={description} subtitleNumberOfLines={1} left={(props) => <Avatar.Icon {...props} icon="form-select" />} />
            </Flex>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }

  return (
    <Flex fill pt={headerMargin}>
      <SearchBar show={showSearch} label="Busca por nombre del formulario" value={search} setter={setSearch} action={searchForms} />

      {search == '' ? (
        forms !== null ? (
          forms?.length >= 0 || forms === undefined ? (
            <Flex fill>
              <FlatList
                data={forms}
                ListEmptyComponent={() =>
                  forms === undefined ? null : (
                    <InformationMessage
                      icon="pencil-plus-outline"
                      title="Sin formularios"
                      description="No hay ningún formulario registrado, ¿qué te parece si hacemos el primero?"
                      buttonIcon="plus"
                      buttonTitle="Agregar"
                      action={() => {
                        navigation.navigate('AddSchool', {
                          user,
                          token
                        })
                      }}
                    />
                  )
                }
                refreshing={loading}
                onRefresh={() => getForms()}
                renderItem={({ item }) => <Item key={item.name} form_name={item.name} description={item.description} form_identifier={item.form_identifier} />}
              />

              <FAB
                icon="plus"
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                onPress={() => {
                  navigation.navigate('AddSchool', {
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
                setForms(undefined)
                getForms()
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
              setForms(undefined)
              getForms()
            }}
          />
        )
      ) : foundForms !== null ? (
        foundForms?.length >= 0 || foundForms === undefined ? (
          <Flex fill>
            <FlatList data={foundForms} ListEmptyComponent={() => (foundForms === undefined ? null : <InformationMessage icon="magnify" title="Sin resultados" description="No hay ningún formulario registrado que cumpla con los parámetros de tu búsqueda" />)} refreshing={loading} onRefresh={() => searchForms()} renderItem={({ item }) => <Item key={item.form_name} form_name={item.form_name} description={item.description} form_identifier={item.form_identifier} />} />
          </Flex>
        ) : (
          <InformationMessage
            icon="bug-outline"
            title="¡Ups! Error nuestro"
            description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setFoundForms(undefined)
              searchForms()
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
            setFoundForms(undefined)
            searchForms()
          }}
        />
      )}
    </Flex>
  )
}
