import { Flex, HStack, VStack, Wrap } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, Avatar, ActivityIndicator, ProgressBar, TouchableRipple } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { ScrollView, RefreshControl } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LongDate, ShortDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"
import CircularProgress from "react-native-circular-progress-indicator"
import InformationMessage from "../Shared/InformationMessage"

export default UserProgress = ({ navigation, route }) => {
  const { host, register, token, achieved_hours, setAchieved_hours } = useContext(ApplicationContext)
  const headerMargin = useHeaderHeight()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState(undefined)
  const [total_hours, setTotal_hours] = useState(null)

  async function getCard() {
    try {
      setLoading(true)

      const request = await fetch(`${host}/cards/${register}`, {
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

  const Title = () => {
    const percentage = Number((achieved_hours / total_hours) * 100).toFixed(2)
    const favorHours = activities?.filter((activity) => activity?.toSubstract == false || activity?.toSubstract == undefined).map((activity) => activity.hours)
    const favorSum = favorHours.reduce((acum, actual) => acum + actual, 0)

    const negativeHours = activities?.filter((activity) => activity?.toSubstract == true).map((activity) => activity.hours)
    const negativeSum = negativeHours.reduce((acum, actual) => acum + actual, 0)

    const harmonicMean = (array) => {
      var sum = 0
      for (var i = 0; i < array.length; i++) {
        sum += 1 / array[i]
      }
      return (array.length / sum).toFixed(2)
    }

    const moda = (array) => {
      let freq = {}
      let maxFreq = 0
      let mode

      for (let i = 0; i < array.length; i++) {
        freq[array[i]] = (freq[array[i]] || 0) + 1

        if (freq[array[i]] > maxFreq) {
          maxFreq = freq[array[i]]
          mode = array[i]
        }
      }

      return mode
    }

    return (
      <Card
        key="Latest activities"
        mode="outlined"
      >
        <VStack
          spacing={10}
          key="Title"
        >
          <Flex p={20}>
            <Text variant="titleMedium">Tu progreso en contexto</Text>
          </Flex>

          <VStack
            mh={20}
            spacing={20}
            pb={20}
          >
            <HStack spacing={10}>
              <Avatar.Icon
                icon="flag-checkered"
                size={50}
              />
              <Flex fill>
                <Text variant="bodyMedium">Actualmente llevas concluido el {percentage} % del total de horas que necesitas completar.</Text>
              </Flex>
            </HStack>

            <HStack spacing={10}>
              <Avatar.Icon
                icon="chart-timeline-variant-shimmer"
                size={50}
              />
              <Flex fill>
                <Text variant="bodyMedium">
                  En promedio obtienes {moda(favorHours)} horas por actividad, con este ritmo necesitas completar más o menos {Number(total_hours / moda(favorHours)).toFixed(0)} eventos para concluir.
                </Text>
              </Flex>
            </HStack>

            {negativeHours.length > 0 && (
              <HStack spacing={10}>
                <Avatar.Icon
                  icon="clock-minus-outline"
                  size={50}
                />
                <Flex fill>
                  <Text variant="bodyMedium">
                    Sumas en total {favorSum} horas a favor, sin embargo, tienes {negativeSum} horas en contra
                  </Text>
                </Flex>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Card>
    )
  }

  const Progress = () => (
    <VStack
      spacing={10}
      key="Progress"
    >
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
  )

  const Activities = () => (
    <Card
      key="Latest activities"
      mode="outlined"
    >
      <Flex p={20}>
        <Text variant="titleMedium">Actividades realizadas</Text>
      </Flex>
      <VStack pb={20}>
        {activities?.map((activity) => (
          <Activity
            key={activity._id}
            activity={activity}
          />
        ))}
      </VStack>
    </Card>
  )

  const Activity = useCallback(({ activity }) => {
    return (
      <Flex style={{ borderRadius: 10, overflow: "hidden" }}>
        <TouchableRipple onPress={() => null}>
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
  }, [])

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={(_) => getCard()}
          />
        }
      >
        {activities !== undefined ? (
          activities !== null ? (
            // isNaN(activities) ? (
            <DisplayDetails
              title="Tu progreso"
              children={[Progress(), Title(), Activities()]}
              showHeader={false}
            />
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
