import { Flex, HStack, VStack } from "@react-native-material/core"
import { useState, useEffect, useCallback, useMemo, useContext } from "react"
import * as SecureStore from "expo-secure-store"
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Image, RefreshControl, ScrollView, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from "@react-navigation/native"
import CircularProgress from "react-native-circular-progress-indicator"
import Constants from "expo-constants"
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import InformationMessage from "../Shared/InformationMessage"
import { GetCompactMonth, GetDay, ShortDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"

export default Dashboard = ({ navigation }) => {
  const userContext = useContext(ApplicationContext)
  const { user, setUser, token, setToken, register, setRegister, achieved_hours, setAchieved_hours } = useContext(ApplicationContext)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const selectedImage = useMemo(() => Math.floor(Math.random() * 4), [])

  const [greeting, setGreeting] = useState("Hola")
  const [timeToSleep, setTimeToSleep] = useState(false)
  //const [offSet, setOffSet] = useState(0)
  //const [token, setToken] = useState(undefined)
  //const [register, setRegister] = useState(undefined)
  //const [user, setUser] = useState(undefined)
  const [feed, setFeed] = useState(undefined)
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    try {
      if (loading == false) {
        setLoading(true)
      }

      const requests = await Promise.all([
        await fetch(`${localhost}/profile/${register}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        }),
        await fetch(`${localhost}/feed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        })
      ])

      setLoading(false)

      if (requests[0].ok && requests[1].ok) {
        const responses = [await requests[0].json(), await requests[1].json()]

        setUser(responses[0].user)
        setFeed(responses[1])
        setAchieved_hours(responses[1]?.achieved_hours)
      }

      return
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // useEffect(() => {
  //   const getToken = async (_) => {
  //     const token = await SecureStore.getItemAsync("token")
  //     token ? setToken(token) : setToken(undefined)
  //   }

  //   if (token == undefined) {
  //     getToken()
  //   }
  // }, [token])

  // useEffect(() => {
  //   const getRegister = async (_) => {
  //     const register = await SecureStore.getItemAsync("register")
  //     register ? setRegister(register) : setRegister(undefined)
  //   }

  //   if (register == undefined) {
  //     getRegister()
  //   }
  // }, [register])

  // useEffect(() => {
  //   if (token !== undefined && register !== undefined) {
  //     fetchData()
  //   }
  // }, [token, register])

  useFocusEffect(
    useCallback(() => {
      const time = new Date().getHours()

      if (time >= 7 && time < 12) {
        setGreeting("Buen día")
      }

      if (time >= 12 && time < 19) {
        setGreeting("Buena tarde")
      }

      if (time >= 19 || time < 7) {
        setGreeting("Buena noche")
      }

      if (time >= 22 || time < 5) {
        setTimeToSleep(true)
      } else {
        setTimeToSleep(false)
      }

      return () => {}
    }, [])
  )

  useFocusEffect(useCallback(() => console.log(userContext.achieved_hours), []))

  const WidgetSmall = useCallback(
    ({ screen, payload, child }) => (
      <Flex w={"25%"} p={5}>
        <Card mode="outlined" style={{ overflow: "hidden" }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <Flex h={80} center>
              {child}
            </Flex>
          </TouchableRipple>
        </Card>
      </Flex>
    ),
    []
  )

  const WidgetMedium = useCallback(
    ({ screen, payload, child, title }) => (
      <Flex w={"50%"} p={5}>
        <Card mode="outlined" style={{ overflow: "hidden" }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <VStack ph={20} pv={10} h={175} spacing={10}>
              <Text variant="bodyMedium" numberOfLines={1}>
                {title}
              </Text>
              <Flex fill center>
                {child}
              </Flex>
            </VStack>
          </TouchableRipple>
        </Card>
      </Flex>
    ),
    []
  )

  const WidgetLarge = useCallback(
    ({ screen, payload, child, title }) => (
      <Flex w={"100%"} p={5}>
        <Card mode="outlined">
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <VStack ph={20} pv={10} h={175} spacing={10}>
              <Text variant="bodyMedium">{title}</Text>
              <Flex fill>{child}</Flex>
            </VStack>
          </TouchableRipple>
        </Card>
      </Flex>
    ),
    []
  )

  const offSet = useSharedValue(0)
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: offSet.value <= 0 ? offSet.value : 0 //interpolate(offSet.value, [-500, 0, 500], [-500, 0, 500])
        }
      ]
    }
  })

  const Header = () => {
    return (
      <Animated.View style={[{}, animationStyle]}>
        <Flex w={"100%"} h={250 + insets.top} style={{ backgroundColor: "#ff0099", position: "absolute" }}>
          {
            {
              0: <Image source={require("../../assets/images/cover/1.jpg")} style={{ width: "100%", height: "100%" }} />,
              1: <Image source={require("../../assets/images/cover/2.jpg")} style={{ width: "100%", height: "100%" }} />,
              2: <Image source={require("../../assets/images/cover/3.jpg")} style={{ width: "100%", height: "100%" }} />,
              3: <Image source={require("../../assets/images/cover/4.jpg")} style={{ width: "100%", height: "100%" }} />,
              4: <Image source={require("../../assets/images/cover/5.jpg")} style={{ width: "100%", height: "100%" }} />
            }[selectedImage]
          }

          <LinearGradient colors={[theme.colors.cover, theme.colors.background]} locations={[0.75, 1]} style={{ width: "100%", height: "100%", position: "absolute" }} />
        </Flex>
      </Animated.View>
    )
  }

  return (
    <Flex fill>
      {user !== null && feed != null && <Header />}

      <ScrollView onScroll={(event) => (offSet.value = event.nativeEvent.contentOffset.y * -0.5)} scrollEventThrottle={16} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData()} />}>
        <Flex h={insets.top} w={"100%"} />
        {user != null && feed != null ? (
          <VStack pb={50}>
            <VStack h={200} center>
              <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
                {greeting}
              </Text>
              <Text variant="headlineSmall" numberOfLines={1}>
                {user?.first_name}
              </Text>
              {timeToSleep ? (
                <Text variant="bodyMedium" numberOfLines={1}>
                  No dilates, dormir es importante ✨
                </Text>
              ) : null}
            </VStack>

            <Flex fill style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: theme.colors.background }}>
              <Flex p={25} center>
                <Text variant="headlineSmall">Tu centro de control</Text>
              </Flex>

              <VStack pb={50} spacing={20}>
                {/* Sección común */}
                <Flex direction="row" wrap="wrap" ph={10}>
                  {/* Widget de evento */}
                  <WidgetLarge
                    title="Próximo evento"
                    screen="ShowAttendanceCode"
                    payload={{ register: user?.register, avatar: user?.avatar }}
                    child={
                      <HStack fill spacing={20}>
                        <Flex items="center">
                          <Avatar.Text label="12" size={50} />
                          <Text variant="bodyMedium">mayo</Text>
                        </Flex>
                        <VStack fill spacing={10}>
                          <Text variant="bodyLarge" numberOfLines={2}>
                            Presentación de proyecto de titulación
                          </Text>
                          <Flex fill>
                            <Text variant="bodyMedium">De 10:00 a 15:00</Text>
                            <Text variant="bodyMedium" numberOfLines={1}>
                              Centro de Enseñanza Técnica Industrial
                            </Text>
                          </Flex>
                        </VStack>
                      </HStack>
                    }
                  />

                  {/* Widget de eventos disponibles */}
                  {feed?.available_events?.length > 0 && (
                    <WidgetLarge
                      title="Eventos disponibles"
                      screen="Events"
                      payload={{ user, token }}
                      child={
                        <Flex w={"100%"} h={"100%"} style={{}}>
                          <Flex w={"100%"} h={"100%"} justify="end" items="end" style={{ position: "absolute" }}>
                            <Avatar.Text label={feed?.available_events?.length} size={50} />
                          </Flex>
                          {feed.available_events.map((event) => (
                            <HStack key={event.name} fill spacing={20}>
                              <Flex items="center">
                                <Avatar.Text label={GetDay(event?.starting_date)} size={50} />
                                <Text variant="bodyMedium">{GetCompactMonth(event?.starting_date)}</Text>
                              </Flex>
                              <VStack fill spacing={10}>
                                <Text variant="bodyLarge" numberOfLines={2}>
                                  {event.name}
                                </Text>
                                <Flex fill>
                                  <Text variant="bodyMedium" numberOfLines={1}>
                                    A partir de las {Time24(event.starting_date)}
                                  </Text>
                                  <Text variant="bodyMedium" numberOfLines={1}>
                                    {event.place}
                                  </Text>
                                </Flex>
                              </VStack>
                            </HStack>
                          ))}
                        </Flex>
                      }
                    />
                  )}

                  {/* Widget de progreso */}
                  {user?.role === "Prestador" ? (
                    <WidgetMedium
                      screen="UserProgress"
                      child={
                        <Flex fill center>
                          <Flex fill center style={{ position: "absolute" }}>
                            <Text variant="headlineSmall" style={{ fontWeight: "bold", color: theme.colors.primary }}>
                              {feed?.achieved_hours} /
                            </Text>
                            <Text variant="bodyMedium">{feed?.total_hours}</Text>
                          </Flex>
                          {feed?.total_hours ? (
                            <Animated.View>
                              <CircularProgress value={achieved_hours} showProgressValue={false} progressValueColor={theme.colors.primary} activeStrokeColor={theme.colors.primary} inActiveStrokeColor={theme.colors.backdrop} rotation={180} titleColor={theme.colors.onBackground} radius={50} maxValue={feed?.total_hours} />
                            </Animated.View>
                          ) : null}
                        </Flex>
                      }
                      title="Tu progreso"
                    />
                  ) : null}

                  {/* Widget de eventos */}
                  {(feed?.available_events?.length == 0 || user?.role != "Prestador") && <WidgetMedium title="Eventos" screen="Events" payload={{ user, token }} child={<Avatar.Icon icon={"bulletin-board"} size={100} />} />}

                  {/* Widget de perfil */}
                  <WidgetSmall screen="Profile" payload={{ user, token }} child={user?.avatar ? <Avatar.Image source={{ uri: `data:image/png;base64,${user.avatar}` }} size={50} /> : <Avatar.Icon icon="account-circle-outline" size={100} />} />

                  <WidgetSmall screen="TakeAttendance" payload={{ actualUser: user, token }} child={<Avatar.Icon icon={"alert"} size={50} />} />
                </Flex>

                {/* Sección de herramientas del administrador */}
                {user?.role === "Administrador" || user?.role === "Encargado" ? (
                  <Flex direction="row" wrap="wrap" ph={10}>
                    <Flex w={"100%"} ph={10}>
                      <Text variant="bodyLarge">Herramientas del {user?.role}</Text>
                    </Flex>

                    {user?.role === "Administrador" ? <WidgetSmall screen="PlacesAndAreas" payload={{ user, token }} child={<Avatar.Icon icon={"map-marker-radius-outline"} size={50} />} /> : null}

                    {user?.role === "Administrador" ? <WidgetSmall screen="Schools" payload={{ user, token }} child={<Avatar.Icon icon={"town-hall"} size={50} />} /> : null}

                    {user?.role === "Administrador" ? <WidgetSmall screen="Events" payload={{ user, token }} child={<Avatar.Icon icon={"bulletin-board"} size={50} />} /> : null}

                    {user?.role === "Encargado" ? <WidgetSmall screen="Cards" payload={{ user, token }} child={<Avatar.Icon icon={"clock-time-four-outline"} size={50} />} /> : null}

                    <WidgetSmall screen="Users" payload={{ actualUser: user, token }} child={<Avatar.Icon icon={"account-supervisor-outline"} size={50} />} />

                    <WidgetSmall screen="Cards" payload={{ actualUser: user, token }} child={<Avatar.Icon icon={"close"} size={50} />} />
                  </Flex>
                ) : null}
              </VStack>
            </Flex>
          </VStack>
        ) : loading == false ? (
          <Flex pt={insets.top} fill>
            <InformationMessage icon="alert" title="Uy, ocurrió un error" description="No podemos recuperar la información de tu cuenta, revisa tu conexión a internet e inténtalo nuevamente, si el problema persiste, contacta con tu encargado de servicio" buttonIcon="reload" buttonTitle="Volver a cargar" action={() => fetchData()} />
          </Flex>
        ) : null}
      </ScrollView>
    </Flex>
  )
}
