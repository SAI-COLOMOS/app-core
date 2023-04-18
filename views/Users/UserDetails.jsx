import { Flex, HStack, VStack } from "@react-native-material/core"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { FlatList, RefreshControl, ScrollView } from "react-native"
import { ActivityIndicator, Avatar, Button, Card, FAB, ProgressBar, Text, TouchableRipple, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import Constants from "expo-constants"
import Header from "../Shared/Header"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"
import { LongDate, ShortDate, Time24 } from "../Shared/LocaleDate"
import InformationMessage from "../Shared/InformationMessage"

const CardContext = createContext()

const CardProvider = ({ children }) => {
  const [activities, setActivities] = useState(undefined)
  const [achieved_hours, setAchieved_hours] = useState(0)
  const [total_hours, setTotal_hours] = useState(0)

  const params = {
    activities,
    setActivities,
    achieved_hours,
    setAchieved_hours,
    total_hours,
    setTotal_hours
  }

  return <CardContext.Provider value={params}>{children}</CardContext.Provider>
}

export { CardProvider, CardContext }

export default UserDetails = ({ navigation, route }) => {
  const { activities, setActivities, achieved_hours, setAchieved_hours, total_hours, setTotal_hours } = useContext(CardContext)
  const { host, token } = useContext(ApplicationContext)
  const { register, getUsers } = route.params
  const headerMargin = useHeaderHeight()
  const theme = useTheme()
  const [avatar, setAvatar] = useState(undefined)

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(undefined)

  async function getUser() {
    setLoading(true)
    const request = await fetch(`${host}/users/${register}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.user) {
      console.log(request.user)
      setProfile(request.user)
    }
  }

  async function getCard() {
    setLoading(true)

    const request = await fetch(`${host}/cards/${register}`, {
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

    if (request?.activities) {
      console.log("Activities ", request.activities)
      setActivities(request.activities)
      setAchieved_hours(request.achieved_hours)
      setTotal_hours(request.total_hours)
    }
  }

  function update() {
    getUser()
    getCard()
  }

  useEffect(() => {
    const requestAvatar = async () => {
      const request = await fetch(`${host}/users/${register}?avatar=true`, {
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
  }, [profile])

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Datos del usuario"
    })
  }, [])

  useEffect(() => {
    getUser()
    getCard()
  }, [])

  const Progress = () => (
    <Flex key="Progress">
      <VStack spacing={5}>
        <HStack
          justify="between"
          items="baseline"
        >
          <Text
            variant="headlineLarge"
            style={{ fontWeight: "bold", color: theme.colors.primary }}
          >
            {achieved_hours} hrs
          </Text>
          <Text variant="titleMedium">{total_hours} hrs</Text>
        </HStack>
        {total_hours > 0 && <ProgressBar progress={achieved_hours / total_hours} />}
      </VStack>
    </Flex>
  )

  const LatestActivities = () => (
    <Card
      key="Latest activities"
      mode="outlined"
    >
      <Flex p={20}>
        <Text variant="titleMedium">Últimas actividades realizadas</Text>
      </Flex>
      <VStack>
        {activities?.length > 0 ? (
          activities?.slice(0, 3).map((activity) => (
            <Activity
              key={activity._id}
              activity={activity}
            />
          ))
        ) : (
          <InformationMessage
            title="Sin actividades"
            description="Este prestador todavía no tiene actividades realizadas"
            icon="calendar-blank-outline"
          />
        )}
        <HStack
          p={20}
          justify="between"
          reverse={true}
        >
          <Button
            icon="plus"
            mode="contained"
            onPress={() => navigation.navigate("AddCard", { register: profile?.register, getCard })}
          >
            Agregar
          </Button>

          {activities?.length > 3 && (
            <Button
              icon="format-list-bulleted"
              mode="outlined"
              onPress={() => navigation.navigate("CardDetails", { register: profile?.register, context: CardContext })}
            >
              Ver todas
            </Button>
          )}
        </HStack>
      </VStack>
    </Card>
  )

  const PersonalData = () => (
    <Card
      key="Personal"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Datos personales</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Edad</Text>
            <Text variant="bodyMedium">{profile?.age} años</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">CURP</Text>
            <Text variant="bodyMedium">{profile?.curp}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Grupo sanguíneo</Text>
            <Text variant="bodyMedium">RH {profile?.blood_type}</Text>
          </Flex>

          {profile?.school != "No aplica" ? (
            <Flex>
              <Text variant="labelSmall">Escuela de procedencia</Text>
              <Text variant="bodyMedium">{profile?.school}</Text>
            </Flex>
          ) : null}
        </VStack>
      </VStack>
    </Card>
  )

  const ContactData = () => (
    <Card
      key="Contact"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Datos de contacto</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Teléfono</Text>
            <Text variant="bodyMedium">{profile?.phone}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Correo electrónico</Text>
            <Text variant="bodyMedium">{profile?.email}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const EmergencyData = () => (
    <Card
      key="Emergency"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Datos de emergencia</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Contacto de emergencia</Text>
            <Text variant="bodyMedium">{profile?.emergency_contact}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Teléfono de emergencia</Text>
            <Text variant="bodyMedium">{profile?.emergency_phone}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const AccountData = () => (
    <Card
      key="Account"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Datos de la cuenta</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Registro</Text>
            <Text variant="bodyMedium">{profile?.register}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Estado</Text>
            <Text variant="bodyMedium">{profile?.status}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Rol</Text>
            <Text variant="bodyMedium">{profile?.role}</Text>
          </Flex>

          {profile?.provider_type != "No aplica" ? (
            <Flex>
              <Text variant="labelSmall">Tipo de prestador</Text>
              <Text variant="bodyMedium">{profile?.provider_type}</Text>
            </Flex>
          ) : null}

          {profile?.provider_type != "No aplica" ? (
            <Flex>
              <Text variant="labelSmall">Horas asignadas</Text>
              <Text variant="bodyMedium">{profile?.total_hours}</Text>
            </Flex>
          ) : null}

          <Flex>
            <Text variant="labelSmall">Bosque urbano</Text>
            <Text variant="bodyMedium">{profile?.place}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Área asignada</Text>
            <Text variant="bodyMedium">{profile?.assigned_area}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Activity = useCallback(
    ({ activity }) => {
      return (
        <Flex style={{ borderRadius: 10, overflow: "hidden" }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("EditCard", { register: profile?.register, activity, getCard })
            }}
          >
            <HStack
              spacing={10}
              mh={20}
              mv={10}
            >
              <VStack
                spacing={5}
                center
              >
                <Avatar.Text
                  label={activity?.toSubstract == true ? `-${activity?.hours}` : activity?.hours}
                  size={50}
                  style={{ backgroundColor: activity?.toSubstract == true ? theme.colors.error : theme.colors.primary }}
                />
                <Text variant="labelMedium">hrs</Text>
              </VStack>
              <VStack fill>
                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                >
                  {activity?.activity_name}
                </Text>

                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                >
                  Por {activity?.responsible_name}
                </Text>

                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                >
                  El {ShortDate(activity?.assignation_date)} a las {Time24(activity?.assignation_date)}
                </Text>
              </VStack>
            </HStack>
          </TouchableRipple>
        </Flex>
      )
    },
    [profile?.register]
  )

  if (profile?.role == "Prestador") {
    return (
      <Flex
        fill
        mt={headerMargin - 20}
      >
        {profile !== undefined &&
          activities !== undefined &&
          (profile !== null && activities !== null ? (
            isNaN(profile) ? (
              <DisplayDetails
                avatar={avatar}
                icon="account-outline"
                title={`${profile?.first_name} ${profile?.first_last_name} ${profile?.second_last_name == undefined ? "" : profile?.second_last_name}`}
                children={[Progress(), LatestActivities(), PersonalData(), ContactData(), EmergencyData(), AccountData()]}
                refreshStatus={loading}
                refreshAction={() => {
                  getUser()
                  getCard()
                }}
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
                    No podemos recuperar los datos del usuario, inténtalo de nuevo más tarde (Error: {profile})
                  </Text>
                </VStack>
                <Flex>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      getUser()
                      getCard()
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
                  No podemos recuperar los datos del usuario, revisa tu conexión a internet e inténtalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getUser()
                    getCard()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          ))}

        {!(profile === undefined || profile === null) && (
          <FAB
            icon="pencil-outline"
            style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
            onPress={() => {
              navigation.navigate("EditUser", {
                profile,
                image: avatar,
                getUsers,
                getUser
              })
            }}
          />
        )}
      </Flex>
    )
  } else {
    return (
      <Flex
        fill
        mt={headerMargin - 20}
      >
        {profile !== undefined &&
          (profile !== null ? (
            isNaN(profile) ? (
              <DisplayDetails
                avatar={avatar}
                icon="account-outline"
                title={`${profile?.first_name} ${profile?.first_last_name} ${profile?.second_last_name == undefined ? "" : profile?.second_last_name}`}
                children={[PersonalData(), ContactData(), EmergencyData(), AccountData()]}
                refreshStatus={loading}
                refreshAction={() => {
                  getUser()
                  getCard()
                }}
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
                    No podemos recuperar los datos del usuario, inténtalo de nuevo más tarde (Error: {profile})
                  </Text>
                </VStack>
                <Flex>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      getUser()
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
                  No podemos recuperar los datos del usuario, revisa tu conexión a internet e inténtalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getUser()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          ))}

        {!(profile === undefined || profile === null) && (
          <FAB
            icon="pencil-outline"
            style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
            onPress={() => {
              navigation.navigate("EditUser", {
                profile,
                image: avatar,
                getUsers,
                getUser
              })
            }}
          />
        )}
      </Flex>
    )
  }
}
