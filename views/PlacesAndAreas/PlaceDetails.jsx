import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useCallback, useContext } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, Card, Button, FAB, useTheme, TouchableRipple } from "react-native-paper"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"
import InformationMessage from "../Shared/InformationMessage"
import ProfileImage from "../Shared/ProfileImage"

export default PlaceDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token } = useContext(ApplicationContext)
  const headerMargin = useHeaderHeight()
  const { place_identifier, getPlaces } = route.params
  const theme = useTheme()

  const [avatar, setAvatar] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [place, setPlace] = useState(undefined)

  async function getPlace() {
    setLoading(true)

    const request = await fetch(`${localhost}/places/${place_identifier}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.place) {
      setPlace(request.place)
    } else {
      setPlace(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Datos del bosque urbano"
    })
  }, [])

  useEffect(() => {
    const requestAvatar = async () => {
      const request = await fetch(`${localhost}/places/${place_identifier}?avatar=true`, {
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
  }, [place])

  useEffect(() => {
    getPlace()
  }, [])

  const Places = () => (
    <Card
      mode="outlined"
      key="Place"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Bosque urbano</Text>
        <VStack spacing={10}>
          <Text variant="labelSmall">Domicilio</Text>
          <Text variant="bodyMedium">{`${place?.street} #${place?.exterior_number}\n${place?.colony}, ${place?.municipality}, ${place?.postal_code}`}</Text>

          <Flex>
            <Text variant="labelSmall">Referencia</Text>
            <Text variant="bodyMedium">{place?.reference ? place?.reference : "Sin referencia"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Número de teléfono</Text>
            <Text variant="bodyMedium">{place?.phone}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Areas = () => (
    <Card
      key="Areas"
      mode="outlined"
    >
      <Flex p={20}>
        <Text variant="titleMedium">Áreas del bosque urbano</Text>
      </Flex>
      <VStack
        spacing={10}
        pb={20}
      >
        {place?.place_areas.length > 0 ? (
          place.place_areas.map((item) => (
            <Flex key={item.area_identifier}>
              <Area
                area={item}
                place_identifier={place.place_identifier}
              />
            </Flex>
          ))
        ) : (
          <InformationMessage
            icon="account"
            title="Sin inscripciones"
            description="Todavía no hay nadie inscrito, ¿quieres agregar a alguien?"
          />
        )}
        <Flex ph={20}>
          <Button
            icon="plus"
            mode="text"
            onPress={() =>
              navigation.navigate("AddArea", {
                place_identifier,
                getPlace
              })
            }
          >
            Agregar
          </Button>
        </Flex>
      </VStack>
    </Card>
  )

  const Area = useCallback(({ area, place_identifier }) => {
    return (
      <Flex
        mh={20}
        style={{ borderRadius: 10, overflow: "hidden" }}
      >
        <TouchableRipple
          onPress={() =>
            navigation.navigate("EditArea", {
              area,
              place_identifier,
              getPlace
            })
          }
        >
          <HStack spacing={10}>
            <Flex>
              <ProfileImage
                icon="tree-outline"
                width={50}
                height={50}
              />
            </Flex>
            <VStack fill>
              <Text
                variant="bodyMedium"
                numberOfLines={1}
              >
                {area?.area_name}
              </Text>
              <Text
                variant="bodySmall"
                numberOfLines={1}
              >
                {area?.phone}
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
      {place !== undefined ? (
        place !== null ? (
          isNaN(place) ? (
            <DisplayDetails
              icon="bee-flower"
              image={avatar ?? null}
              title={place?.place_name}
              children={[Places(), Areas()]}
              refreshStatus={loading}
              refreshAction={() => getPlace()}
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
                  No podemos recuperar del bosque urbano, inténtalo de nuevo más tarde (Error: {place})
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={(_) => {
                    getPlace()
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
                No podemos recuperar los datos del bosque urbano, revisa tu conexión a internet e inténtalo de nuevo
              </Text>
            </VStack>
            <Flex>
              <Button
                mode="outlined"
                onPress={() => {
                  getPlace()
                }}
              >
                Volver a intentar
              </Button>
            </Flex>
          </VStack>
        )
      ) : null}

      {!(place === undefined || place === null) && (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() =>
            navigation.navigate("EditPlace", {
              place,
              image: avatar,
              getPlace,
              getPlaces
            })
          }
        />
      )}
    </Flex>
  )
}
