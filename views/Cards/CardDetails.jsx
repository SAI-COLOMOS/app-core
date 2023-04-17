import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, Avatar, IconButton, ProgressBar, TouchableRipple } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LongDate, ShortDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"
import InformationMessage from "../Shared/InformationMessage"
import { CardContext } from "../Users/UserDetails"

export default CardDetails = ({ navigation, route }) => {
  const { user, register } = route.params
  const { activities, setActivities, achieved_hours, setAchieved_hours, total_hours, setTotal_hours } = useContext(CardContext)
  const headerMargin = useHeaderHeight()
  const { host, token } = useContext(ApplicationContext)
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  //const [activities, setActivities] = useState(undefined)
  // const [achieved_hours, setAchieved_hours] = useState(0)
  // const [total_hours, setTotal_hours] = useState(0)

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
      console.log(request.activities)
      setActivities(request.activities)
      setAchieved_hours(request.achieved_hours)
      setTotal_hours(request.total_hours)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Detalles del tarjetón"
    })
  }, [])

  // useEffect(() => {
  //   getCard()
  // }, [])

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
        <TouchableRipple
          onPress={() => {
            navigation.navigate("EditCard", { register: register, activity, getCard })
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
                label={activity?.hours}
                size={50}
                style={{ backgroundColor: activity?.hours <= 0 ? theme.colors.error : theme.colors.primary }}
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
      {activities !== undefined &&
        (activities !== null ? (
          // isNaN(activities) ? (
          <DisplayDetails
            // avatar={user?.avatar}
            // title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? "" : user?.second_last_name}`}
            showHeader={false}
            children={[Progress(), Activities()]}
            refreshStatus={loading}
            refreshAction={() => getCard()}
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
        ))}

      {!(activities === undefined || activities === null) && (
        <FAB
          icon="plus"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate("AddCard", { register, getCard })
          }}
        />
      )}
    </Flex>
  )
}
