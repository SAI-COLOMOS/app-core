import { Flex, HStack, VStack, Wrap } from "@react-native-material/core"
import { useState, useEffect, useCallback, useMemo, useContext } from "react"
import * as SecureStore from "expo-secure-store"
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Image, Pressable, RefreshControl, ScrollView, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from "@react-navigation/native"
import CircularProgress from "react-native-circular-progress-indicator"
import Constants from "expo-constants"
import Animated, { interpolate, log, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import InformationMessage from "../Shared/InformationMessage"
import { GetCompactMonth, GetDay, GetMoment, ShortDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"
import CacheContext from "../Contexts/CacheContext"
import ProfileImage from "../Shared/ProfileImage"

export default Dashboard = ({ navigation }) => {
  const { user, setUser, token, setToken, register, setRegister, achieved_hours, setAchieved_hours } = useContext(ApplicationContext)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const selectedImage = useMemo(() => Math.floor(Math.random() * 4), [])

  const [greeting, setGreeting] = useState("Hola")
  const [timeToSleep, setTimeToSleep] = useState(false)
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

  const WidgetSmall = ({ screen, payload, child }) => (
    <Flex
      p={5}
      h={90}
      w={90}
    >
      <Card
        mode="outlined"
        style={{ overflow: "hidden" }}
      >
        <TouchableRipple
          onPress={() => {
            navigation.navigate(screen, { ...payload })
          }}
        >
          <Flex
            h={"100%"}
            w={"100%"}
            center
          >
            {child}
          </Flex>
        </TouchableRipple>
      </Card>
    </Flex>
  )

  const WidgetMedium = ({ screen, payload, child, title }) => (
    <Flex
      p={5}
      h={180}
      w={180}
    >
      <Card
        mode="outlined"
        style={{ overflow: "hidden" }}
      >
        <TouchableRipple
          onPress={() => {
            navigation.navigate(screen, { ...payload })
          }}
        >
          <VStack
            ph={10}
            pv={10}
            h={"100%"}
            w={"100%"}
            spacing={10}
          >
            <Flex ph={5}>
              <Text
                variant="bodyMedium"
                numberOfLines={1}
              >
                {title}
              </Text>
            </Flex>
            <Flex
              fill
              center
            >
              {child}
            </Flex>
          </VStack>
        </TouchableRipple>
      </Card>
    </Flex>
  )

  const WidgetLarge = ({ screen, payload, child, title, image }) => (
    <Flex
      w={360}
      h={180}
      p={5}
    >
      <Card
        mode="outlined"
        style={{ overflow: "hidden" }}
      >
        <TouchableRipple
          onPress={() => {
            navigation.navigate(screen, { ...payload })
          }}
        >
          <>
            {image && (
              <Flex
                h={"100%"}
                w={"100%"}
                style={{ position: "absolute" }}
              >
                <Image
                  source={require("../../assets/images/stocks/events.jpg")}
                  resizeMode="cover"
                  style={{ height: "100%", width: "100%" }}
                />
                <Flex
                  h={"100%"}
                  w={"100%"}
                  style={{ position: "absolute", backgroundColor: theme.colors.cover }}
                />
              </Flex>
            )}
            <VStack
              ph={10}
              pv={10}
              h={"100%"}
              w={"100%"}
              spacing={10}
            >
              <Flex ph={5}>
                <Text variant="bodyMedium">{title}</Text>
              </Flex>
              <Flex fill>{child}</Flex>
            </VStack>
          </>
        </TouchableRipple>
      </Card>
    </Flex>
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
        <Flex
          w={"100%"}
          h={250 + insets.top}
          style={{ backgroundColor: "#ff0099", position: "absolute" }}
        >
          {
            {
              0: (
                <Image
                  source={require("../../assets/images/cover/1.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              ),
              1: (
                <Image
                  source={require("../../assets/images/cover/2.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              ),
              2: (
                <Image
                  source={require("../../assets/images/cover/3.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              ),
              3: (
                <Image
                  source={require("../../assets/images/cover/4.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              ),
              4: (
                <Image
                  source={require("../../assets/images/cover/5.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              )
            }[selectedImage]
          }

          <LinearGradient
            colors={[theme.colors.cover, theme.colors.background]}
            locations={[0.75, 1]}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          />
        </Flex>
      </Animated.View>
    )
  }

  /* Areas de Screens */

  const VistaAdministrador = () => (
    <Wrap justify="center">
      {/* Lugares y áreas */}
      <WidgetMedium
        title="Usuarios"
        screen="Users"
        // payload={{ user, token }}
        child={
          <Avatar.Icon
            icon={"account-supervisor-outline"}
            size={100}
          />
        }
      />

      {/* Lugares y áreas */}
      <WidgetMedium
        title="Bosques urbanos"
        screen="PlacesAndAreas"
        // payload={{ user, token }}
        child={
          <Avatar.Icon
            icon={"bee-flower"}
            size={100}
          />
        }
      />

      {/* Lugares y áreas */}
      <WidgetMedium
        title="Escuelas"
        screen="Schools"
        // payload={{ user, token }}
        child={
          <Avatar.Icon
            icon={"town-hall"}
            size={100}
          />
        }
      />

      <Wrap
        h={180}
        w={180}
      >
        {/* Widget de perfil */}
        <WidgetSmall
          screen="Profile"
          // payload={{ user, token }}
          child={
            <ProfileImage
              icon="account-outline"
              image={user?.avatar}
              width={85}
              height={85}
            />
          }
        />
      </Wrap>
    </Wrap>
  )

  const VistaEncargado = () => (
    <Wrap justify="center">
      {/* Widget A continuación */}
      {feed?.enrolled_event != null && (
        <WidgetLarge
          title={GetMoment(feed?.enrolled_event?.starting_date)}
          screen="EventDetails"
          payload={{ event_identifier: feed?.enrolled_event?.event_identifier }}
          image={true}
          child={
            <Flex
              w={"100%"}
              h={"100%"}
            >
              <HStack
                // p={10}
                spacing={15}
                items="end"
                h={"100%"}
              >
                <Flex center>
                  <Avatar.Text
                    label={GetDay(feed?.enrolled_event?.starting_date)}
                    size={50}
                  />
                  <Text variant="bodyMedium">{GetCompactMonth(feed?.enrolled_event?.starting_date)}</Text>
                </Flex>
                <VStack fill>
                  <Text
                    variant="titleMedium"
                    numberOfLines={2}
                  >
                    {feed?.enrolled_event?.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    numberOfLines={1}
                  >
                    De {Time24(feed?.enrolled_event?.starting_date)} a {Time24(feed?.enrolled_event?.ending_date)}
                  </Text>
                  <Text
                    variant="bodySmall"
                    numberOfLines={1}
                  >
                    En {feed?.enrolled_event?.place}
                  </Text>
                </VStack>
              </HStack>
              {/* <HStack
                key="Following"
                fill
                spacing={20}
              >
                <Flex items="center">
                  <Avatar.Text
                    label={GetDay(feed?.enrolled_event?.starting_date)}
                    size={30}
                  />
                  <Text variant="bodyMedium">{GetCompactMonth(feed?.enrolled_event?.starting_date)}</Text>
                </Flex>
                <VStack fill>
                  <Text
                    variant="titleMedium"
                    numberOfLines={1}
                  >
                    {feed?.enrolled_event?.name}
                  </Text>
                  <Flex fill>
                    <Text
                      variant="bodyMedium"
                      numberOfLines={1}
                    >
                      {Time24(feed?.enrolled_event?.starting_date)} - {Time24(feed?.enrolled_event?.ending_date)}, {feed?.enrolled_event?.place}
                    </Text>
                  </Flex>
                </VStack>
              </HStack> */}
            </Flex>
          }
        />
      )}

      {/* Widget de eventos */}
      <WidgetMedium
        title="Eventos"
        screen="Events"
        child={
          <Avatar.Icon
            icon={"calendar-outline"}
            size={100}
          />
        }
      />

      {/* Horas de servicio */}
      <WidgetMedium
        title="Horas de servicio"
        screen="Cards"
        // payload={{ user, token }}
        child={
          <Avatar.Icon
            icon={"clock-time-four-outline"}
            size={100}
          />
        }
      />

      <Wrap
        h={90}
        w={feed?.created_events?.length > 0 ? 180 : 360}
      >
        {/* Usuarios */}
        <WidgetSmall
          screen="Users"
          child={
            <Avatar.Icon
              icon={"account-supervisor-outline"}
              size={50}
            />
          }
        />

        {/* Formularios */}
        <WidgetSmall
          screen="Forms"
          // payload={{ actualUser: user, token }}
          child={
            <Avatar.Icon
              icon={"form-select"}
              size={50}
            />
          }
        />
        {/* Widget de perfil */}
        <WidgetSmall
          screen="Profile"
          // payload={{ user, token }}
          child={
            <ProfileImage
              icon="account-outline"
              image={user?.avatar}
              width={85}
              height={85}
            />
          }
        />
      </Wrap>
    </Wrap>
  )

  const VistaPrestador = () => (
    <Wrap justify="center">
      {/* Widget de a continuación */}
      {feed?.enrolled_event != null && (
        <WidgetLarge
          title={GetMoment(feed?.enrolled_event?.starting_date)}
          screen="EventDetails"
          payload={{ event_identifier: feed?.enrolled_event?.event_identifier }}
          image={true}
          child={
            <Flex
              w={"100%"}
              h={"100%"}
            >
              <HStack
                spacing={15}
                items="end"
                h={"100%"}
              >
                <Flex center>
                  <Avatar.Text
                    label={GetDay(feed?.enrolled_event?.starting_date)}
                    size={50}
                  />
                  <Text variant="bodyMedium">{GetCompactMonth(feed?.enrolled_event?.starting_date)}</Text>
                </Flex>
                <VStack fill>
                  <Text
                    variant="titleMedium"
                    numberOfLines={2}
                  >
                    {feed?.enrolled_event?.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    numberOfLines={1}
                  >
                    De {Time24(feed?.enrolled_event?.starting_date)} a {Time24(feed?.enrolled_event?.ending_date)}
                  </Text>
                  <Text
                    variant="bodySmall"
                    numberOfLines={1}
                  >
                    En {feed?.enrolled_event?.place}
                  </Text>
                </VStack>
              </HStack>
            </Flex>
          }
        />
      )}

      {/* Widget de eventos */}
      {feed?.available_events?.length > 0 ? (
        <WidgetLarge
          title="Eventos disponibles"
          screen="Events"
          child={
            <Flex
              w={"100%"}
              h={"100%"}
            >
              <Flex
                w={"100%"}
                h={"100%"}
                justify="end"
                items="end"
                style={{ position: "absolute" }}
              >
                <Avatar.Text
                  label={feed?.available_events?.length}
                  size={25}
                />
              </Flex>
              {feed?.available_events?.map((event) => (
                <HStack
                  key={event.name}
                  fill
                  spacing={20}
                >
                  <Flex items="center">
                    <Avatar.Text
                      label={GetDay(event?.starting_date)}
                      size={30}
                    />
                    <Text variant="bodyMedium">{GetCompactMonth(event?.starting_date)}</Text>
                  </Flex>
                  <VStack fill>
                    <Text
                      variant="titleMedium"
                      numberOfLines={1}
                    >
                      {event.name}
                    </Text>
                    <Flex fill>
                      <Text
                        variant="bodyMedium"
                        numberOfLines={1}
                      >
                        {Time24(event.starting_date)} - {Time24(event.ending_date)}, {event.place}
                      </Text>
                    </Flex>
                  </VStack>
                </HStack>
              ))}
            </Flex>
          }
        />
      ) : (
        <WidgetMedium
          title="Eventos"
          screen="Events"
          child={
            <Avatar.Icon
              icon={"calendar-outline"}
              size={100}
            />
          }
        />
      )}

      {/* Widget de progreso */}
      <WidgetMedium
        screen="UserProgress"
        child={
          <Flex
            fill
            center
          >
            <Flex
              fill
              center
              style={{ position: "absolute" }}
            >
              <Text
                variant="headlineSmall"
                style={{ fontWeight: "bold", color: theme.colors.primary }}
              >
                {feed?.achieved_hours} /
              </Text>
              <Text variant="bodyMedium">{feed?.total_hours}</Text>
            </Flex>
            {feed?.total_hours ? (
              <Animated.View>
                <CircularProgress
                  value={achieved_hours}
                  showProgressValue={false}
                  progressValueColor={theme.colors.primary}
                  activeStrokeColor={theme.colors.primary}
                  inActiveStrokeColor={theme.colors.backdrop}
                  rotation={180}
                  titleColor={theme.colors.onBackground}
                  radius={50}
                  maxValue={feed?.total_hours}
                />
              </Animated.View>
            ) : null}
          </Flex>
        }
        title="Tu progreso"
      />

      <Wrap
        h={180}
        w={feed?.available_events?.length > 0 ? 180 : 360}
      >
        {/* Widget de perfil */}
        <WidgetSmall
          screen="Profile"
          child={
            <ProfileImage
              icon="account-outline"
              image={user?.avatar}
              width={85}
              height={85}
            />
          }
        />
      </Wrap>
    </Wrap>
  )

  return (
    <Flex fill>
      {user !== null && feed != null && <Header />}

      <ScrollView
        onScroll={(event) => (offSet.value = event.nativeEvent.contentOffset.y * -0.5)}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchData()}
          />
        }
      >
        <Flex
          h={insets.top}
          w={"100%"}
        />
        {user != null && feed != null ? (
          <VStack pb={50}>
            <VStack
              h={200}
              center
            >
              <Text
                variant="headlineLarge"
                style={{ color: theme.colors.primary }}
              >
                {greeting}
              </Text>
              <Text
                variant="headlineSmall"
                numberOfLines={1}
              >
                {user?.first_name}
              </Text>
              {timeToSleep ? (
                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                >
                  No dilates, dormir es importante ✨
                </Text>
              ) : null}
            </VStack>

            <Flex
              fill
              style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: theme.colors.background }}
            >
              <Flex
                p={25}
                center
              >
                <Text variant="headlineSmall">Tu centro de control</Text>
              </Flex>

              {
                {
                  Administrador: <VistaAdministrador />,
                  Encargado: <VistaEncargado />,
                  Prestador: <VistaPrestador />
                }[user?.role]
              }
            </Flex>
          </VStack>
        ) : loading == false ? (
          <Flex
            pt={insets.top}
            fill
          >
            <InformationMessage
              icon="alert"
              title="Uy, ocurrió un error"
              description="No podemos recuperar la información de tu cuenta, revisa tu conexión a internet e inténtalo nuevamente, si el problema persiste, contacta con tu encargado de servicio"
              buttonIcon="reload"
              buttonTitle="Volver a cargar"
              action={() => fetchData()}
            />
          </Flex>
        ) : null}
      </ScrollView>
    </Flex>
  )
}
