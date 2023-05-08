import { Flex, HStack, VStack, even } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, Avatar, IconButton, TouchableRipple, ActivityIndicator } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { ScrollView, RefreshControl } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LongDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"
import ProfileImage from "../Shared/ProfileImage"
import InformationMessage from "../Shared/InformationMessage"
import ModalMessage from "../Shared/ModalMessage"
// import EventContext from "../Contexts/CacheContext"

export default EventDetails = ({ navigation, route }) => {
  const { host, user, token } = useContext(ApplicationContext)
  //const { event, setEvent, attendees, setAttendees, profiles, setProfiles } = useContext(EventContext)
  const headerMargin = useHeaderHeight()
  const { event_identifier, getEvents, fetchData } = route.params
  const theme = useTheme()

  const [avatar, setAvatar] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState(undefined)
  const [starting_date, setStarting_date] = useState(new Date())
  const [ending_date, setEnding_date] = useState(new Date())
  const [publishing_date, setPublishing_date] = useState(new Date())

  const [showErrorPost, setShowErrorPost] = useState(false)
  const [showConfirmPost, setShowConfirmPost] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)

  const [showErrorFinish, setShowErrorFinish] = useState(false)
  const [showConfirmFinish, setShowConfirmFinish] = useState(false)
  const [loadingFinish, setLoadingFinish] = useState(false)

  const [showErrorUnlinkForm, setShowErrorUnlinkForm] = useState(false)
  const [showConfirmUnlinkForm, setShowConfirmUnlinkForm] = useState(false)
  const [loadingUnlinkForm, setLoadingUnlinkForm] = useState(false)

  async function getEvent () {
    setLoading(true)

    const request = await fetch(`${host}/agenda/${event_identifier}`, {
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

  async function subscribeEvent () {
    const request = await fetch(`${host}/agenda/${event_identifier}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(() => null)

    if (request?.ok) {
      getEvent()
    }
  }

  async function unsubscribeEvent () {
    const request = await fetch(`${host}/agenda/${event_identifier}/attendance`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(() => null)

    if (request?.ok) {
      getEvent()
    }

    console.error(await request.json())
  }

  async function postNow () {
    setLoadingPost(true)

    const request = await fetch(`${host}/agenda/${event_identifier}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: "Disponible"
      })
    }).catch(() => null)

    setLoadingPost(false)

    if (request?.ok) {
      getEvents()
      getEvent()
      return
    }

    setShowErrorFinish(true)
  }

  async function finishEvent () {
    setLoadingFinish(true)

    const request = await fetch(`${host}/agenda/${event_identifier}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: "Concluido"
      })
    }).catch(() => null)

    setLoadingFinish(false)

    if (request?.ok) {
      getEvent()
      return
    }

    setShowErrorFinish(true)
  }

  async function unlinkFrom () {
    setLoadingUnlinkForm(true)

    const request = await fetch(`${host}/surveys/${event?.survey_identifier}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(() => null)

    setLoadingUnlinkForm(false)

    if (request?.ok) {
      getEvent()
      return
    }

    setShowErrorUnlinkForm(true)
  }

  useEffect(() => {
    const requestAvatar = async () => {
      const request = await fetch(`${host}/agenda/${event_identifier}?avatar=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .catch(() => null)

      request?.avatar ? setAvatar(request.avatar) : setAvatar(null)
    }

    requestAvatar()
  }, [event])

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Datos del evento"
    })
  }, [])

  useEffect(() => {
    getEvent()
  }, [])

  const Availability = () => (
    <HStack
      justify="between"
      key="Availability"
    >
      <VStack>
        <Text variant="bodyMedium">Horas ofertadas</Text>
        <HStack items="baseline">
          <Text variant="displaySmall">{event?.offered_hours}</Text>
          <Text variant="titleMedium"> hrs.</Text>
        </HStack>
      </VStack>
      <VStack>
        <Text variant="bodyMedium">Inscritos</Text>
        <HStack
          items="baseline"
          justify="end"
        >
          <Text variant="displaySmall">{event?.registered_users}</Text>
          <Text variant="titleMedium"> / {event?.vacancy}</Text>
        </HStack>
      </VStack>
    </HStack>
  )

  const Description = () => (
    <Card
      key="Description"
      mode="outlined"
    >
      <Flex
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Descripción</Text>
        <Text variant="bodyMedium">{event?.description}</Text>
      </Flex>
    </Card>
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
        <Text variant="titleMedium">Lugar, fecha y hora</Text>
        <VStack spacing={10}>
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
        <Text variant="titleMedium">Acerca del evento</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Encargado designado</Text>
            <Text variant="bodyMedium">{event?.author_name}</Text>
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
        <Text variant="titleMedium">Lista de participantes</Text>
      </Flex>
      {event?.attendance.attendee_list.length > 0 ? (
        <VStack pb={20}>
          {event.attendance.attendee_list.map((item) => (
            <Flex key={item.attendee_register}>
              <Attendee attendee={item} />
            </Flex>
          ))}
          {!(event?.attendance?.status == "Concluido" || event?.attendance?.status == "Concluido por sistema" || event?.attendance.status == "En proceso" || event?.attendance.status == "Por comenzar") && (
            <Flex center>
              <Button
                icon="plus"
                mode="outlined"
                onPress={() => navigation.navigate("AddAttendee", { event_identifier, getEvent })}
              >
                Inscribir
              </Button>
            </Flex>
          )}
        </VStack>
      ) : event?.attendance?.status != "Por comenzar" && event?.attendance?.status != "En proceso" && event?.attendance?.status != "Concluido" && event?.attendance?.status != "Concluido por sistema" ? (
        <InformationMessage
          icon="account-outline"
          title="Sin inscripciones"
          description="Todavía no hay nadie inscrito, ¿quieres agregar a alguien?"
          action={() => navigation.navigate("AddAttendee", { event_identifier, getEvent })}
          buttonTitle="Inscribir"
          buttonIcon="plus"
        />
      ) : (
        <Flex pb={20}>
          <InformationMessage
            icon="account-alert-outline"
            title="Sin inscripciones"
            description="Este evento no tiene a ningún participante"
          />
        </Flex>
      )}
    </Card>
  )

  const Subscribe = () => (
    <Flex key="Subscribe">
      {
        {
          Encargado: <ManagerOptions key="M" />,
          Prestador: <ProviderOptions key="P" />
        }[user?.role]
      }
    </Flex>
  )

  /* Componentes de componentes */

  const Attendee = useCallback(
    ({ attendee }) => {
      const [avatar, setAvatar] = useState(undefined)

      const requestAvatar = async () => {
        const request = await fetch(`${host}/users/${attendee?.attendee_register}?avatar=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
          .then((response) => response.json())
          .catch(() => null)

        request?.avatar ? setAvatar(request.avatar) : setAvatar(null)
      }

      useEffect(() => {
        requestAvatar()
      }, [])

      return (
        <Flex style={{ borderRadius: 10, overflow: "hidden" }}>
          <TouchableRipple
            onPress={() => {
              if (!(event?.attendance?.status == "Concluido" || event?.attendance?.status == "Concluido por sistema")) {
                navigation.navigate("EditAttendance", { attendee, event_identifier, event_status: event?.attendance?.status, getEvent })
              }
            }}
          >
            <HStack
              spacing={10}
              mh={20}
              mv={10}
            >
              <Flex>
                <ProfileImage
                  image={avatar}
                  icon="account-outline"
                  width={50}
                  height={50}
                />
              </Flex>
              <VStack fill>
                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                >
                  {attendee?.first_name} {attendee?.first_last_name} {attendee?.second_last_name ?? null}
                </Text>

                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                >
                  {attendee?.status}
                </Text>
              </VStack>
              {/* <IconButton
            icon="pencil-outline"
            mode="outlined"
            onPress={() => navigation.navigate("EditAttendance", { attendance, event_identifier })}
          /> */}
            </HStack>
          </TouchableRipple>
        </Flex>
      )
    },
    [event]
  )

  const ManagerOptions = () => (
    <VStack
      fill
      key="Subscribe"
      spacing={20}
    >
      {event?.author_register == user.register && event?.attendance?.status == "Por publicar" && (
        <Card mode="outlined">
          {loadingPost == false ? (
            <InformationMessage
              icon="clock-outline"
              title="Evento por publicar"
              description={`Actualmente solo tú puedes ver este evento, el cual será publicado el día ${LongDate(event?.publishing_date)} a las ${Time24(event?.publishing_date)}`}
              action={() => setShowConfirmPost(true)}
              buttonTitle="Publicar ahora"
              buttonIcon="calendar-check-outline"
            />
          ) : (
            <Flex
              fill
              center
              p={50}
            >
              <ActivityIndicator size={75} />
            </Flex>
          )}
        </Card>
      )}

      {event?.attendance?.status == "En proceso" && new Date(event?.ending_date) <= new Date() && (
        <Button
          disabled={loadingFinish}
          loading={loadingFinish}
          mode="contained"
          icon="calendar-lock-outline"
          onPress={() => setShowConfirmFinish(true)}
        >
          Concluir evento
        </Button>
      )}

      {event?.attendance?.status == "En proceso" && (
        <Card
          key="Asistencia"
          mode="outlined"
        >
          <Flex
            p={20}
            spacing={5}
          >
            <Text variant="titleMedium">Asistencia</Text>
            <VStack
              pt={20}
              spacing={10}
            >
              <Button
                disabled={loadingFinish}
                mode="outlined"
                style={{ backgroundColor: theme.colors.background }}
                icon="qrcode-scan"
                onPress={() => navigation.navigate("ScanAttendance", { attendeeList: event?.attendance?.attendee_list, event_identifier: event_identifier, getEvent })}
              >
                Registrar asistencia con QR
              </Button>

              <Button
                disabled={loadingFinish}
                mode="outlined"
                style={{ backgroundColor: theme.colors.background }}
                icon="human-greeting-proximity"
                onPress={() => navigation.navigate("ProximityReceptor", { event_identifier: event_identifier, getEvent })}
              >
                Registrar asistencia por proximidad
              </Button>
            </VStack>
          </Flex>
        </Card>
      )}

      <Card
        key="Description"
        mode="outlined"
      >
        <Flex
          p={20}
          spacing={5}
        >
          <Text variant="titleMedium">Encuestas</Text>
          <VStack
            pt={20}
            spacing={10}
          >
            {event?.survey_identifier != null ? (
              <VStack spacing={10}>
                {event?.attendance?.status == "En proceso" && (
                  <Button
                    mode="outlined"
                    style={{ backgroundColor: theme.colors.background }}
                    icon="form-select"
                    onPress={() => navigation.navigate("ApplySurvey", { survey_identifier: event?.survey_identifier })}
                  >
                    Realizar encuesta
                  </Button>
                )}

                {(event?.attendance?.status == "En proceso" || event?.attendance?.status == "Concluido" || event?.attendance?.status == "Concluido por sistema") && (
                  <Button
                    mode="outlined"
                    style={{ backgroundColor: theme.colors.background }}
                    icon="form-select"
                    onPress={() => navigation.navigate("SurveyAnswers", { survey_identifier: event?.survey_identifier })}
                  >
                    Resultados de la encuesta
                  </Button>
                )}
              </VStack>
            ) : (
              <InformationMessage
                title="Sin encuesta"
                description="Este evento no tiene una encuesta vinculada"
              />
            )}

            {event?.survey_identifier == null && event?.attendance?.status != "Concluido" && event?.attendance?.status != "Concluido por sistema" && event?.attendance?.status != "En proceso" && (
              <Button
                mode="outlined"
                icon="plus"
                style={{ backgroundColor: theme.colors.background }}
                onPress={() => navigation.navigate("AddSurvey", { event_identifier, getEvent })}
              >
                Vincular formulario
              </Button>
            )}

            {event?.survey_identifier != null && event?.attendance?.status != "Concluido" && event?.attendance?.status != "Concluido por sistema" && event?.attendance?.status != "En proceso" && (
              <Button
                mode="outlined"
                icon="minus"
                disabled={loadingUnlinkForm}
                loading={loadingUnlinkForm}
                style={{ backgroundColor: theme.colors.background }}
                onPress={() => setShowConfirmUnlinkForm(true)}
              >
                Desvincular formulario
              </Button>
            )}
          </VStack>
        </Flex>
      </Card>
    </VStack>
  )

  const ProviderOptions = () => {
    const [status, setStatus] = useState(event?.attendance?.attendee_list.find((item) => item.attendee_register == user.register)?.status)

    return (
      <VStack
        fill
        key="Provider"
        spacing={20}
      >
        {event?.attendance?.status == "Disponible" &&
          (event?.attendance.attendee_list.find((item) => {
            if (item.attendee_register == user.register) {
              if (item.status == "Inscrito") {
                return true
              }
            }

            return false
          }) ? (
            <VStack spacing={20}>
              <Text
                variant="titleMedium"
                style={{ textAlign: "center" }}
              >
                Ya estás inscrito al evento
              </Text>
              <Button
                onPress={() => unsubscribeEvent()}
                mode="outlined"
                style={{ backgroundColor: theme.colors.background }}
              >
                Desinscribirme al evento
              </Button>
            </VStack>
          ) : (
            <Button
              onPress={() => subscribeEvent()}
              mode="contained"
            >
              Inscribirse al evento
            </Button>
          ))}
        {event?.attendance?.status == "En proceso" && (
          <Card mode="outlined">
            <VStack
              spacing={20}
              p={20}
            >
              <Flex fill>
                <Text variant="titleMedium">Estado de la asistencia</Text>
                <Text variant="bodyMedium">{status == "Inscrito" ? "Sin asistencia" : status}</Text>
              </Flex>
              {status == "Inscrito" && (
                <Button
                  icon="qrcode-scan"
                  onPress={() => navigation.navigate("ShowAttendanceCode", { getEvent })}
                  mode="contained"
                >
                  Tomar asistencia con QR
                </Button>
              )}

              {status == "Inscrito" && (
                <Button
                  icon="human-greeting-proximity"
                  onPress={() => navigation.navigate("ProximityTransmisor", { getEvent, event_identifier: event_identifier })}
                  mode="contained"
                >
                  Tomar asistencia por proximidad
                </Button>
              )}
            </VStack>
          </Card>
        )}
      </VStack>
    )
  }

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
              image={avatar}
              title={event?.name}
              children={[Availability(), Subscribe(), Description(), Event(), Info(), user.role != "Prestador" && Enrolled()]}
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
                  onPress={() => {
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

      {!(event === undefined || event === null) && user.role != "Prestador" && !(event?.attendance?.status == "Concluido" || event?.attendance?.status == "Concluido por sistema" || event?.attendance?.status == "En proceso" || event?.attendance?.status == "Por comenzar") && (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() =>
            navigation.navigate("EditEvent", {
              event,
              event_identifier,
              image: avatar,
              getEvent,
              getEvents: getEvents || fetchData
            })
          }
        />
      )}

      <ModalMessage
        title="Publicar ahora"
        description="¿Seguro que desea que el evento se publique ahora? Esta acción no se puede deshacer"
        icon="help-circle-outline"
        handler={[showConfirmPost, () => setShowConfirmPost(!showConfirmPost)]}
        actions={[
          ["Cancelar"],
          [
            "Aceptar",
            () => {
              setShowConfirmPost(false)
              postNow()
            }
          ]
        ]}
      />

      <ModalMessage
        title="Ocurrió un problema"
        description="No pudimos publicar el evento, inténtalo de nuevo más tarde"
        icon="close-circle-outline"
        handler={[showErrorPost, () => setShowErrorPost(!showErrorPost)]}
      />

      <ModalMessage
        title="Finalizar evento"
        description="¿Seguro que desea finalizar el evento? Una vez concluido no podrá registrar ni modificar asistencias"
        icon="help-circle-outline"
        handler={[showConfirmFinish, () => setShowConfirmFinish(!showConfirmFinish)]}
        actions={[
          ["Cancelar"],
          [
            "Aceptar",
            () => {
              setShowConfirmFinish(false)
              finishEvent()
            }
          ]
        ]}
      />

      <ModalMessage
        title="Desvincular formulario"
        description="¿Seguro que desea desvincular el evento? Esta acción no se puede deshacer"
        icon="help-circle-outline"
        handler={[showConfirmUnlinkForm, () => setShowConfirmUnlinkForm(!showConfirmUnlinkForm)]}
        actions={[
          ["Cancelar"],
          [
            "Aceptar",
            () => {
              setShowConfirmUnlinkForm(false)
              unlinkFrom()
            }
          ]
        ]}
      />

      <ModalMessage
        title="Ocurrió un problema"
        description="No pudimos desvincular el formulario, inténtalo de nuevo más tarde"
        icon="close-circle-outline"
        handler={[showErrorUnlinkForm, () => setShowErrorUnlinkForm(!showErrorUnlinkForm)]}
      />

      <ModalMessage
        title="Ocurrió un problema"
        description="No pudimos finalizar el evento, inténtalo de nuevo más tarde"
        icon="close-circle-outline"
        handler={[showErrorFinish, () => setShowErrorFinish(!showErrorFinish)]}
      />
    </Flex>
  )
}
