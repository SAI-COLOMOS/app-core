import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, Avatar, ActivityIndicator } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { ScrollView, RefreshControl } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LongDate, Time24 } from "../Shared/LocaleDate"
import UserContext from "../ApplicationContext"
import CircularProgress from "react-native-circular-progress-indicator"
import InformationMessage from "../Shared/InformationMessage"

export default UserProgress = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { register, token, achieved_hours, setAchieved_hours } = useContext(UserContext)
  const userContext = useContext(UserContext)
  const headerMargin = useHeaderHeight()
  // const { token, user } = route.params
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState(undefined)
  const [total_hours, setTotal_hours] = useState(null)

  async function getCard() {
    try {
      setLoading(true)

      const request = await fetch(`${localhost}/cards/${register}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache"
        }
      })

      setLoading(false)

      if (request.ok) {
        const response = await request.json()

        setActivities(response.activities)
        setAchieved_hours(Number(response.achieved_hours))
        setTotal_hours(Number(response.total_hours))

        return
      }

      return
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Tu progreso"
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getCard()
      return () => {}
    }, [])
  )

  const ProgressRing = () => (
    <Flex key="Progress" fill center>
      {typeof achieved_hours == "number" && typeof total_hours == "number" ? (
        <>
          <CircularProgress value={achieved_hours} showProgressValue={false} progressValueColor={theme.colors.primary} activeStrokeColor={theme.colors.primary} inActiveStrokeColor={theme.colors.backdrop} rotation={180} titleColor={theme.colors.onBackground} radius={75} maxValue={total_hours} />
          <Flex fill center style={{ position: "absolute" }}>
            <Text variant="headlineLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}>
              {achieved_hours} /
            </Text>
            <Text variant="bodyLarge">{total_hours}</Text>
          </Flex>
        </>
      ) : (
        <ActivityIndicator size={75} />
      )}
    </Flex>
  )

  const Activity = () => {
    return (
      <VStack spacing={25} key="Activity">
        {activities.length > 0 ? (
          <>
            <Text variant="headlineSmall" style={{ textAlign: "center" }}>
              Actividades realizadas
            </Text>
            <VStack spacing={10}>
              {activities.map((activity) => (
                <Card mode="outlined" key={activity._id}>
                  <HStack spacing={20} p={20}>
                    <VStack items="center">
                      <Avatar.Text label={activity?.hours} size={50} />
                      <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                        hrs
                      </Text>
                    </VStack>
                    <VStack fill spacing={5}>
                      <Flex>
                        <Text variant="bodyLarge" numberOfLines={2}>
                          {activity?.activity_name}
                        </Text>
                        <Text variant="bodyMedium">{LongDate(activity?.assignation_date)}</Text>
                        <Text variant="bodyMedium">{Time24(activity?.assignation_date)}</Text>
                        <Text variant="bodyMedium">{activity?.responsible_register}</Text>
                      </Flex>
                    </VStack>
                  </HStack>
                </Card>
              ))}
            </VStack>
          </>
        ) : (
          <InformationMessage key="NoProgress" title="Sin actividades" description="Todavía no tines actividades realizadas, cuando completes algunas, estas aparecerán aquí" icon="alert" />
        )}
      </VStack>
    )
  }

  return (
    <Flex fill pt={headerMargin - 20}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getCard()} />}>
        {activities !== undefined ? (
          activities !== null ? (
            // isNaN(activities) ? (
            <DisplayDetails title="Tu progreso" children={[ProgressRing(), Activity()]} showHeader={false} />
          ) : (
            <VStack center spacing={20} p={30}>
              <Icon color={theme.colors.onBackground} name="wifi-alert" size={50} />
              <VStack center>
                <Text variant="headlineSmall">Sin internet</Text>
                <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                  No podemos recuperar los datos del usuario, revisa tu conexión a internet e inténtalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getCard()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : null}
      </ScrollView>
    </Flex>
  )
}
