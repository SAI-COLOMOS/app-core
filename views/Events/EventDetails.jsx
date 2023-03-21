import { Flex, VStack } from '@react-native-material/core'
import { useEffect, useState, useCallback } from 'react'
import { useHeaderHeight } from '@react-navigation/elements'
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import DisplayDetails from '../Shared/DisplayDetails'
import { ScrollView, RefreshControl } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default EventDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const headerMargin = useHeaderHeight()
  const { token, event_identifier } = route.params
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState(undefined)

  async function getEvent() {
    setLoading(true)

    const request = await fetch(`${localhost}/users/${event_identifier}`, {
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

    if (request?.event) {
      setEvent(request.event)
      console.log(request.event.event_identifier)
    } else {
      setEvent(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: 'Datos del evento'
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getEvent()
      return () => {}
    }, [])
  )

  const Event = () => {
    return (
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Evento</Text>
        <VStack spacing={10}>
          <Text variant="labelSmall">Lugar del evento</Text>
          <Text variant="bodyMedium">{`${event?.place}`}</Text>

          <Flex>
            <Text variant="labelSmall">Área de creación del evento</Text>
            <Text variant="bodyMedium">{event?.belonging_area}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Lugar de creación del evento</Text>
            <Text variant="bodyMedium">{event?.belonging_place}</Text>
          </Flex>
        </VStack>
      </VStack>
    )
  }

  const Events = () => {
    return (
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Áreas</Text>
        <VStack spacing={10}>
          {event.place.length > 0 ? (
            event.belonging_area.map((area) => (
              <Card mode="outlined" key={area.belonging_area}>
                <VStack spacing={10} p={20}>
                  <VStack fill spacing={10}>
                    <Flex>
                      <Text variant="labelSmall">Área de creación del evento</Text>
                      <Text variant="bodyMedium">{area?.belonging_area}</Text>
                    </Flex>
                    <Flex>
                      <Text variant="labelSmall">Lugar de creación del evento</Text>
                      <Text variant="bodyMedium">{event?.belonging_place}</Text>
                    </Flex>
                  </VStack>
                  <Button
                    icon="pencil-outline"
                    onPrpess={() => {
                      navigation.navigate('AddEvent', {
                        token,
                        area,
                        event_identifier
                      })
                    }}
                  >
                    Editar evento
                  </Button>
                </VStack>
              </Card>
            ))
          ) : (
            <VStack center spacing={20} p={30}>
              <Icon name="pencil-plus-outline" color={theme.colors.onBackground} size={50} />
              <VStack center>
                <Text variant="headlineSmall">Sin áreas</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                  No hay ningún evento registrado, ¿qué te parece si hacemos el primero?
                </Text>
              </VStack>
            </VStack>
          )}
        </VStack>
        <Button
          icon="plus"
          onPress={() => {
            navigation.navigate('AddEvent', {
              token,
              place,
              event_identifier
            })
          }}
        >
          Agregar evento
        </Button>
      </VStack>
    )
  }

  return (
    <Flex fill pt={headerMargin - 20}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getEvent()} />}>
        {event !== undefined ? (
          event !== null ? (
            isNaN(event) ? (
              <DisplayDetails icon="bulletin-board" title={event?.place} children={[Event(), Events()]} />
            ) : (
              <VStack p={30} center spacing={20}>
                <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50} />
                <VStack center>
                  <Text variant="headlineSmall">Ocurrió un problema</Text>
                  <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                    No podemos recuperar el evento, inténtalo de nuevo más tarde (Error: {place})
                  </Text>
                </VStack>
                <Flex>
                  <Button
                    mode="outlined"
                    onPress={(_) => {
                      getEvent()
                    }}
                  >
                    Volver a intentar
                  </Button>
                </Flex>
              </VStack>
            )
          ) : (
            <VStack center spacing={20} p={30}>
              <Icon color={theme.colors.onBackground} name="wifi-alert" size={50} />
              <VStack center>
                <Text variant="headlineSmall">Sin internet</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                  No podemos recuperar los datos del evento, revisa tu conexión a internet e inténtalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getEvent()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : null}
      </ScrollView>

      {!(event === undefined || event === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate('EditPlace', {
              token,
              event
            })
          }}
        />
      ) : null}
    </Flex>
  )
}
