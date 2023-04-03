import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, Avatar, IconButton } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { ScrollView, RefreshControl } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LongDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"

export default EventDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token } = useContext(ApplicationContext)
  const headerMargin = useHeaderHeight()
  const { event_identifier } = route.params
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState(undefined)
  const [starting_date, setStarting_date] = useState(new Date())
  const [ending_date, setEnding_date] = useState(new Date())
  const [publishing_date, setPublishing_date] = useState(new Date())

  async function getEvent() {
    setLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.event) {
      setEvent(request.event)
      setStarting_date(new Date(request.event.starting_date))
      setEnding_date(new Date(request.event.ending_date))
      setPublishing_date(new Date(request.event.publishing_date))
    } else {
      setEvent(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Datos del evento"
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getEvent()
      return () => {}
    }, [])
  )

  const Availability = () => (
    <HStack
      justify="between"
      key="Availability"
    >
      <VStack>
        <Text variant="bodyMedium">Horas ofertadas</Text>
        <HStack items="baseline">
          <Text variant="displaySmall">{event?.offered_hours}</Text>
          <Text variant="bodyLarge"> hrs.</Text>
        </HStack>
      </VStack>
      <VStack>
        <Text variant="bodyMedium">Inscritos</Text>
        <HStack
          items="baseline"
          justify="end"
        >
          <Text variant="displaySmall">{event?.attendance.attendee_list.length}</Text>
          <Text variant="bodyLarge"> / {event?.vacancy}</Text>
        </HStack>
      </VStack>
    </HStack>
  )

  const Event = () => (
    <Card
      key="Event"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
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

          {LongDate(starting_date) == LongDate(ending_date) ? (
            <Flex>
              <Text variant="labelSmall">Fecha y hora</Text>
              <Text variant="bodyMedium">{LongDate(starting_date)}</Text>
              <Text variant="bodyMedium">
                De {Time24(starting_date)} a {Time24(ending_date)}
              </Text>
            </Flex>
          ) : (
            <VStack spacing={10}>
              <Flex>
                <Text variant="labelSmall">Fecha y hora de inicio</Text>
                <Text variant="bodyMedium">
                  {LongDate(starting_date)} a las {Time24(starting_date)}
                </Text>
              </Flex>

              <Flex>
                <Text variant="labelSmall">Fecha y hora de termino</Text>
                <Text variant="bodyMedium">
                  {LongDate(ending_date)} a las {Time24(ending_date)}
                </Text>
              </Flex>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Card>
  )

  const Info = () => (
    <Card
      key="Info"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="bodyLarge">Datos técnicos</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Autor</Text>
            <Text variant="bodyMedium">{event?.author_register}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Fecha de publicación</Text>
            <Text variant="bodyMedium">
              {LongDate(publishing_date)} a las {Time24(publishing_date)}
            </Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Enrolled = () => (
    <Card
      key="Enrolled"
      mode="outlined"
    >
      <Flex p={20}>
        <Text variant="bodyLarge">Personas inscritas</Text>
      </Flex>
      <Flex pb={20}>
        <HStack
          spacing={10}
          ph={20}
          items="center"
        >
          <Flex>
            <Avatar.Icon
              icon="alert"
              size={50}
            />
          </Flex>
          <VStack fill>
            <Text
              variant="bodyMedium"
              numberOfLines={1}
            >
              Mariana Huerta de la Concepción Reinoza López
            </Text>
            <Text
              variant="bodyMedium"
              numberOfLines={1}
            >
              2020A0101001
            </Text>
          </VStack>
          <IconButton
            icon="delete"
            mode="outlined"
            iconColor={theme.colors.error}
          />
        </HStack>
      </Flex>
    </Card>
  )

  // const Subscribe = () => (
  //   <Button key=""
  // )

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      {event !== undefined ? (
        event !== null ? (
          isNaN(event) ? (
            <DisplayDetails
              icon="bulletin-board"
              image={event?.avatar}
              title={event?.name}
              children={[Availability(), Event(), Info(), Enrolled()]}
              refreshStatus={loading}
              refreshAction={() => getEvent()}
            />
          ) : (
            <VStack
              p={30}
              center
              spacing={20}
            >
              <Icon
                color={theme.colors.onBackground}
                name="alert-circle-outline"
                size={50}
              />
              <VStack center>
                <Text variant="headlineSmall">Ocurrió un problema</Text>
                <Text
                  variant="bodyMedium"
                  style={{ textAlign: "center" }}
                >
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
          <VStack
            center
            spacing={20}
            p={30}
          >
            <Icon
              color={theme.colors.onBackground}
              name="wifi-alert"
              size={50}
            />
            <VStack center>
              <Text variant="headlineSmall">Sin internet</Text>
              <Text
                variant="bodyMedium"
                style={{ textAlign: "center" }}
              >
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

      {!(event === undefined || event === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() =>
            navigation.navigate("EditEvent", {
              event,
              event_identifier
            })
          }
        />
      ) : null}
    </Flex>
  )
}
