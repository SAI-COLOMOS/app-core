import { Flex, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { FlatList, RefreshControl, ScrollView } from "react-native"
import { ActivityIndicator, Avatar, Button, Card, FAB, ProgressBar, Text, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import Constants from "expo-constants"
import Header from "../Shared/Header"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"

export default SchoolDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token } = useContext(ApplicationContext)
  const { school_identifier, getSchools } = route.params
  const headerMargin = useHeaderHeight()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [school, setSchool] = useState(undefined)

  async function getSchool() {
    setLoading(true)

    const request = await fetch(`${localhost}/schools/${school_identifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch((_) => null)

    setLoading(false)

    if (request?.school) {
      setSchool(request.school)
      console.log(request)
    } else {
      setSchool(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Datos de la escuela"
    })
  }, [])

  useEffect(() => {
    getSchool()
  }, [])

  const Contact = () => (
    <Card
      key="Contact"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Contacto de la escuela</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Teléfono de la escuela</Text>
            <Text variant="bodyMedium">{school?.phone}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Address = () => (
    <Card
      key="Address"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Dirección de la escuela</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Domicilio</Text>
            <Text variant="titleMedium">{`${school?.street} #${school?.exterior_number}\n${school?.colony}, ${school?.municipality}. ${school?.postal_code}`}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Referencia</Text>
            <Text variant="bodyMedium">{school?.reference ? school?.reference : "Sin referencia"}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={(_) => getSchool()}
          />
        }
      >
        {school !== undefined ? (
          school !== null ? (
            isNaN(school) ? (
              <DisplayDetails
                icon="town-hall"
                title={school?.school_name}
                children={[Contact(), Address()]}
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
                    No podemos recuperar los datos de la escuela, intentalo de nuevo más tarde (Error: {school})
                  </Text>
                </VStack>
                <Flex>
                  <Button
                    mode="outlined"
                    onPress={(_) => {
                      getSchool()
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
                  No podemos recuperar los datos de la escuela, revisa tu conexión a internet e intentalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={(_) => {
                    getSchool()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : null}
      </ScrollView>

      {!(school === undefined || school === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate("EditSchool", {
              school,
              getSchool,
              getSchools
            })
          }}
        />
      ) : null}
    </Flex>
  )
}
