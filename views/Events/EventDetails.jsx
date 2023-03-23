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

    const request = await fetch(`${localhost}/agenda/${event_identifier}`,{
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
  
  const Event = () => (
    <Card key="Event" mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos generales</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Descripción</Text>
            <Text variant="bodyMedium">{event?.description}</Text>
          </Flex>
          
          <Flex>
            <Text variant="labelSmall">Lugar</Text>
            <Text variant="bodyMedium">{event?.place}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Hora de inicio</Text>
            <Text variant="bodyMedium">{event?.starting_date}</Text>
          </Flex>

        </VStack>
      </VStack>
    </Card>
  )

  const Info = () => (
    <Card key="Info" mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos técnicos</Text>
        <VStack spacing={10}>             
          <Flex>
            <Text variant="labelSmall">Horas ofertadas</Text>
            <Text variant="bodyMedium">{event?.offered_hours}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Prestadores requeridos</Text>
            <Text variant="bodyMedium">{event?.vacancy}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Autor</Text>
            <Text variant="bodyMedium">{event?.author_register}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Fecha de publicación</Text>
            <Text variant="bodyMedium">{event?.publishing_date}</Text>
          </Flex>

        </VStack>
      </VStack>
    </Card>
  )


  return (
    <Flex fill pt={headerMargin - 20}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getEvent()} />}>
        {event !== undefined ? (
          event !== null ? (
            isNaN(event) ? (
              <DisplayDetails icon="bulletin-board" title={event?.name} children={[Event(), Info()]} />
            ) : (
              <VStack p={30} center spacing={20}>
                <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50} />
                <VStack center>
                  <Text variant="headlineSmall">Ocurrió un problema</Text>
                  <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                    No podemos recuperar el evento, inténtalo de nuevo más tarde (Error: {event})
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
            navigation.navigate('EditEvent', {
              token,
              event,
              event_identifier
            })
          }}
        />
      ) : null}
    </Flex>
  )
}


