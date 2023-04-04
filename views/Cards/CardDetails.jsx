import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, Avatar, IconButton, ProgressBar } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LongDate, Time24 } from "../Shared/LocaleDate"
import ApplicationContext from "../ApplicationContext"
import InformationMessage from "../Shared/InformationMessage"

export default CardDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const headerMargin = useHeaderHeight()
  const { user, register } = route.params
  const { token } = useContext(ApplicationContext)
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState(undefined)
  const [achieved_hours, setAchieved_hours] = useState(0)
  const [total_hours, setTotal_hours] = useState(0)

  async function getCard() {
    setLoading(true)

    const request = await fetch(`${localhost}/cards/${register}`, {
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
      setCard(request.activities)
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

  useFocusEffect(
    useCallback(() => {
      getCard()
      return () => {}
    }, [])
  )

  const ProgressRing = () => (
    <Flex key="Progress">
      <VStack spacing={10}>
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
          <Text variant="bodyLarge">{total_hours} hrs</Text>
        </HStack>
        {total_hours > 0 && <ProgressBar progress={achieved_hours / total_hours} />}
      </VStack>
    </Flex>
  )

  const Activity = () => {
    return (
      <Flex key="Activity">
        <Flex pv={20}>
          <Text variant="bodyLarge">Actividades realizadas</Text>
        </Flex>

        <VStack spacing={25}>
          {card.length > 0 ? (
            <VStack spacing={10}>
              {card.map((activity) => (
                <Card
                  mode="outlined"
                  key={activity._id}
                >
                  <VStack
                    spacing={10}
                    p={20}
                  >
                    <HStack spacing={20}>
                      <VStack items="center">
                        <Avatar.Text
                          label={activity?.hours}
                          size={50}
                        />
                        <Text
                          variant="bodyMedium"
                          style={{ textAlign: "center" }}
                        >
                          hrs
                        </Text>
                      </VStack>
                      <Flex fill>
                        <Text
                          variant="bodyLarge"
                          numberOfLines={2}
                        >
                          {activity?.activity_name}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          numberOfLines={1}
                        >
                          {LongDate(activity?.assignation_date)}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          numberOfLines={1}
                        >
                          {Time24(activity?.assignation_date)}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          numberOfLines={1}
                        >
                          {activity?.responsible_name}
                        </Text>
                      </Flex>
                    </HStack>
                    <Button
                      mode="text"
                      icon="pencil-outline"
                      onPress={() => navigation.navigate("EditCard", { register, activity })}
                    >
                      Editar actividad
                    </Button>
                  </VStack>
                </Card>
              ))}
            </VStack>
          ) : (
            <InformationMessage
              key="NoProgress"
              title="Sin actividades"
              description="Todavía no tines actividades realizadas, cuando completes algunas, estas aparecerán aquí"
              icon="alert"
            />
          )}
        </VStack>
      </Flex>
    )
  }

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      {card !== undefined &&
        (card !== null ? (
          // isNaN(card) ? (
          <DisplayDetails
            avatar={user?.avatar}
            title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? "" : user?.second_last_name}`}
            children={[ProgressRing(), Activity()]}
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

      {!(card === undefined || card === null) && (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate("AddCard", { register })
          }}
        />
      )}
    </Flex>
  )
}
