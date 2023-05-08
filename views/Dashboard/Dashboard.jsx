import { Flex, HStack, VStack, Wrap } from "@react-native-material/core"
import { useState, useEffect, useCallback, useMemo, useContext } from "react"
import * as SecureStore from "expo-secure-store"
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RefreshControl, ScrollView } from "react-native"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from "@react-navigation/native"
import CircularProgress from "react-native-circular-progress-indicator"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import InformationMessage from "../Shared/InformationMessage"
import { GetCompactMonth, GetDay, GetMoment, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"
import ProfileImage from "../Shared/ProfileImage"
import CacheContext from "../Contexts/CacheContext"

export default Dashboard = ({ navigation }) => {
  const { host, user, setUser, token, setToken, register, setRegister, achieved_hours, setAchieved_hours } = useContext(ApplicationContext)
  const { clearCache } = useContext(CacheContext)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const selectedImage = useMemo(() => Math.floor(Math.random() * 4), [])

  const [greeting, setGreeting] = useState("Hola")
  const [timeToSleep, setTimeToSleep] = useState(false)
  const [feed, setFeed] = useState(undefined)
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    try {
      setLoading(true)

      const requests = await Promise.all([
        await fetch(`${host}/profile/${register}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        }),
        await fetch(`${host}/feed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        })
      ])

      if (requests[0].ok && requests[1].ok) {
        const responses = [await requests[0].json(), await requests[1].json()]

        console.log(responses[1])

        setUser(responses[0].user)
        setFeed(responses[1])
        setAchieved_hours(responses[1]?.achieved_hours)
      }

      setLoading(false)

      return
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )
  // useEffect(() => {
  // }, [])

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
            <Flex
              h={"100%"}
              w={"100%"}
              style={{ position: "absolute" }}
            >
              <Image
                source={image ? { uri: `data:image/png;base64,${image}` } : require("../../assets/images/stocks/events.jpg")}
                contentFit="cover"
                cachePolicy="memory-disk"
                style={{ height: "100%", width: "100%" }}
              />
              <Flex
                h={"100%"}
                w={"100%"}
                style={{ position: "absolute", backgroundColor: theme.colors.cover }}
              />
            </Flex>

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
          style={{ position: "absolute" }}
        >
          {
            {
              0: (
                <Image
                  source={require("../../assets/images/cover/1.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  cachePolicy="memory-disk"
                />
              ),
              1: (
                <Image
                  source={require("../../assets/images/cover/2.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  cachePolicy="memory-disk"
                />
              ),
              2: (
                <Image
                  source={require("../../assets/images/cover/3.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  cachePolicy="memory-disk"
                />
              ),
              3: (
                <Image
                  source={require("../../assets/images/cover/4.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  cachePolicy="memory-disk"
                />
              ),
              4: (
                <Image
                  source={require("../../assets/images/cover/5.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  cachePolicy="memory-disk"
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
          payload={{ event_identifier: feed?.enrolled_event?.event_identifier, fetchData }}
          image={feed?.enrolled_event?.avatar}
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

      {/* Usuarios */}
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

      <Wrap
        h={90}
        w={feed?.created_events?.length > 0 ? 180 : 360}
      >
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
          title="A continuación"
          screen="EventDetails"
          payload={{ event_identifier: feed?.enrolled_event?.event_identifier }}
          image={feed?.enrolled_event?.avatar}
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
              <HStack
                key={feed?.available_events?.name}
                fill
                spacing={20}
              >
                <Flex items="center">
                  <Avatar.Text
                    label={GetDay(feed?.available_events?.starting_date)}
                    size={30}
                  />
                  <Text variant="bodyMedium">{GetCompactMonth(feed?.available_events?.starting_date)}</Text>
                </Flex>
                <VStack fill>
                  <Text
                    variant="titleMedium"
                    numberOfLines={1}
                  >
                    {feed?.available_events?.name}
                  </Text>
                  <Flex fill>
                    <Text
                      variant="bodyMedium"
                      numberOfLines={1}
                    >
                      {Time24(feed?.available_events?.starting_date)} - {Time24(feed?.available_events?.ending_date)}, {feed?.available_events?.place}
                    </Text>
                  </Flex>
                </VStack>
              </HStack>
              {/* {feed?.available_events?.map((event) => (
              ))} */}
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
        ) : (
          loading == false && (
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
              <Flex center>
                <Button
                  icon="logout"
                  mode="outlined"
                  onPress={async () => {
                    await SecureStore.deleteItemAsync("token")
                    await SecureStore.deleteItemAsync("user")
                    await SecureStore.deleteItemAsync("keepAlive")
                    clearCache()
                    navigation.replace("Login")
                  }}
                >
                  Cerrar sesión
                </Button>
              </Flex>
            </Flex>
          )
        )}
      </ScrollView>
    </Flex>
  )
}
