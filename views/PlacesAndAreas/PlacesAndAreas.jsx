import { Flex, HStack, VStack } from "@react-native-material/core"
import { useState, useEffect, useCallback, useContext } from "react"
import { ActivityIndicator, Avatar, Card, FAB, IconButton, Text, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import Header from "../Shared/Header"
import { FlatList, Pressable } from "react-native"
import SearchBar from "../Shared/SearchBar"
import InformationMessage from "../Shared/InformationMessage"
import { Image } from "react-native"
import ApplicationContext from "../ApplicationContext"
import CacheContext from "../Contexts/CacheContext"

export default PlaceAndAreas = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const { places, setPlaces } = useContext(CacheContext)
  const theme = useTheme()
  const headerMargin = useHeaderHeight()

  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(null)
  const [search, setSearch] = useState("")
  const [foundPlaces, setFoundPlaces] = useState(undefined)

  async function getPlaces() {
    setLoading(true)

    const request = await fetch(`${host}/places`, {
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

    if (request?.places) {
      setPlaces(request.places)
    } else {
      setPlaces(request)
    }
  }

  async function searchPlaces() {
    setLoading(true)

    if (search === "") {
      setFoundPlaces(undefined)
      setLoading(false)
      return
    }
    const request = await fetch(`${host}/places?search=${search}`, {
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

    if (request?.places) {
      setFoundPlaces(request.places)
    } else {
      setFoundPlaces(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <Header
          {...props}
          children={[
            <IconButton
              key="SearchButton"
              icon="magnify"
              onPress={() => setShowSearch(!showSearch)}
            />
          ]}
        />
      ),
      headerTransparent: true,
      headerTitle: "Bosques urbanos"
    })
  }, [showSearch])

  useEffect(() => {
    if (places === undefined) {
      getPlaces()
    }
  }, [])

  const Item = useCallback(
    ({ place_name, place_address, place_identifier }) => {
      const [avatar, setAvatar] = useState(undefined)
      const [loadingDone, setLoadingDone] = useState(false)

      useEffect(() => {
        const requestAvatar = async () => {
          const request = await fetch(`${host}/places/${place_identifier}?avatar=true`, {
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
      }, [])

      return (
        <Flex
          ph={20}
          pv={5}
          onPress={() => {}}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("PlaceDetails", { place_identifier, getPlaces })
            }}
          >
            <Card
              mode="outlined"
              style={{ overflow: "hidden" }}
            >
              <Image
                source={avatar !== null ? { uri: `data:image/png;base64,${avatar}` } : require("../../assets/images/stocks/place.jpg")}
                resizeMode="cover"
                onLoadEnd={() => setLoadingDone(true)}
                style={{ height: 175, width: "100%" }}
              />
              {loadingDone == false && (
                <Flex
                  w={"100%"}
                  h={"100%"}
                  center
                  style={{ position: "absolute" }}
                >
                  <ActivityIndicator size={50} />
                </Flex>
              )}
              <Flex
                w={"100%"}
                h={"100%"}
                justify="end"
                style={{ position: "absolute", backgroundColor: theme.colors.cover }}
              >
                <HStack
                  p={10}
                  spacing={10}
                  items="center"
                >
                  <Avatar.Icon
                    icon="bee-flower"
                    size={50}
                  />
                  <VStack fill>
                    <Text
                      variant="titleMedium"
                      numberOfLines={1}
                    >
                      {place_name}
                    </Text>
                    <Text
                      variant="bodySmall"
                      numberOfLines={1}
                    >
                      {place_address}
                    </Text>
                  </VStack>
                </HStack>
              </Flex>
            </Card>
          </Pressable>
        </Flex>
      )
    },
    [places]
  )

  return (
    <Flex
      fill
      pt={headerMargin}
    >
      <SearchBar
        show={showSearch}
        label="Busca por nombre del busque urbano"
        value={search}
        setter={setSearch}
        action={searchPlaces}
      />

      {search == "" ? (
        places !== null ? (
          places?.length >= 0 || places === undefined ? (
            <Flex fill>
              <FlatList
                data={places}
                ListEmptyComponent={() =>
                  places === undefined ? null : (
                    <InformationMessage
                      icon="pencil-plus-outline"
                      title="Sin bosques urbanos"
                      description="No hay ningún bosque urbano registrado, ¿qué te parece si hacemos el primero?"
                      buttonIcon="plus"
                      buttonTitle="Agregar"
                      action={() => navigation.navigate("AddPlace", { getPlaces })}
                    />
                  )
                }
                refreshing={loading}
                onRefresh={() => getPlaces()}
                renderItem={({ item }) => (
                  <Item
                    key={item.place_name}
                    place_name={item.place_name}
                    place_address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}, ${item.postal_code}`}
                    place_identifier={item.place_identifier}
                  />
                )}
              />

              <FAB
                icon="plus"
                style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
                onPress={() => navigation.navigate("AddPlace", { getPlaces })}
              />
            </Flex>
          ) : (
            <InformationMessage
              icon="bug-outline"
              title="¡Ups! Error nuestro"
              description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
              buttonTitle="Volver a cargar"
              buttonIcon="reload"
              action={() => {
                setPlaces(undefined)
                getPlaces()
              }}
            />
          )
        ) : (
          <InformationMessage
            icon="wifi-alert"
            title="Sin conexión"
            description="Parece que no tienes conexión a internet, conéctate e intenta de nuevo"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setPlaces(undefined)
              getPlaces()
            }}
          />
        )
      ) : foundPlaces !== null ? (
        foundPlaces?.length >= 0 || foundPlaces === undefined ? (
          <Flex fill>
            <FlatList
              data={foundPlaces}
              ListEmptyComponent={() =>
                foundPlaces === undefined ? null : (
                  <InformationMessage
                    icon="magnify"
                    title="Sin resultados"
                    description="No hay ningún bosque urbano registrado que cumpla con los parámetros de tu búsqueda"
                  />
                )
              }
              refreshing={loading}
              onRefresh={() => searchPlaces()}
              renderItem={({ item }) => (
                <Item
                  key={item.place_name}
                  place_name={item.place_name}
                  place_address={`${item.street} #${item.exterior_number}, ${item.colony}, ${item.municipality}, ${item.postal_code}`}
                  place_identifier={item.place_identifier}
                />
              )}
            />
          </Flex>
        ) : (
          <InformationMessage
            icon="bug-outline"
            title="¡Ups! Error nuestro"
            description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setFoundPlaces(undefined)
              searchPlaces()
            }}
          />
        )
      ) : (
        <InformationMessage
          icon="wifi-alert"
          title="Sin conexión"
          description="Parece que no tienes conexión a internet, conéctate e intenta de nuevo"
          buttonTitle="Volver a cargar"
          buttonIcon="reload"
          action={() => {
            setFoundPlaces(undefined)
            searchPlaces()
          }}
        />
      )}
    </Flex>
  )
}
