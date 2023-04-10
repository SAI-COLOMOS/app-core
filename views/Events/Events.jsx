import { Flex, HStack, Spacer, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB, ActivityIndicator } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import { FlatList, Image, Pressable } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import SearchBar from "../Shared/SearchBar"
import ModalFilters from "../Shared/ModalFilters"
import Dropdown from "../Shared/Dropdown"
import InformationMessage from "../Shared/InformationMessage"
import ApplicationContext from "../ApplicationContext"
import ProfileImage from "../Shared/ProfileImage"
import { GetDay, GetCompactMonth, Time24 } from "../Shared/LocaleDate"
import CacheContext from "../Contexts/CacheContext"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import DateAndTimePicker from "../Shared/DateAndTimePicker"

export default Users = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { user, token } = useContext(ApplicationContext)
  const { events, setEvents } = useContext(CacheContext)
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  //const [events, setEvents] = useState(undefined)
  const [foundEvents, setFoundEvents] = useState(undefined)
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(null)
  const [areFilters, setAreFilters] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [placeFilter, setPlaceFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("Hola")

  const getEvents = async () => {
    setLoading(true)

    const request = await fetch(`${localhost}/agenda`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.events) {
      setEvents(request.events)
    } else {
      setEvents(request)
    }
  }

  const searchEvents = async () => {
    setLoading(true)

    let filters = {}

    if (placeFilter !== "") {
      filters = { ...filters, place: placeFilter }
    }

    if (dateFilter !== "") {
      dateFilter.setHours(0)
      dateFilter.setMinutes(0)
      dateFilter.setSeconds(0)
      filters = { ...filters, starting_date: dateFilter }
    }

    setAreFilters(filters)

    if (Object.keys(filters).length === 0 && search === "") {
      setFoundEvents(undefined)
      setLoading(false)
      return
    }

    const request = await fetch(`${localhost}/agenda?search=${search.trim()}&filter=${JSON.stringify(filters)}`, {
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

    if (request?.events) {
      setFoundEvents(request.events)
    } else {
      setFoundEvents(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <Header
          {...props}
          children={
            user?.role != "Prestador" && [
              <IconButton
                key="FilterButton"
                icon="filter-outline"
                onPress={() => setShowFilters(!showFilters)}
              />,
              <IconButton
                key="SearchButton"
                icon="magnify"
                onPress={() => setShowSearch(!showSearch)}
              />
            ]
          }
        />
      ),
      headerTransparent: true,
      headerTitle: "Eventos"
    })
  }, [showSearch, showFilters])

  useEffect(() => {
    if (events === undefined) {
      getEvents()
    }
  }, [])

  const Item = useCallback(
    ({ item }) => {
      const [avatar, setAvatar] = useState(undefined)
      const [loadingDone, setLoadingDone] = useState(false)

      useEffect(() => {
        const getAvatar = async () => {
          const request = await fetch(`${localhost}/agenda/${item.event_identifier}?avatar=true`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`
            }
          })
            .then((response) => response.json())
            .catch(() => null)

          request?.avatar ? setAvatar(request.avatar) : setAvatar(null)
        }

        getAvatar()
      }, [])

      return (
        <Flex
          ph={20}
          pv={5}
          onPress={() => {}}
        >
          <TouchableRipple
            onPress={() => {
              navigation.navigate("EventDetails", { event_identifier: item.event_identifier, getEvents })
            }}
          >
            <Card
              mode="outlined"
              style={{ overflow: "hidden" }}
            >
              <Image
                source={avatar !== null ? { uri: `data:image/png;base64,${avatar}` } : require("../../assets/images/stocks/events.jpg")}
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
                  spacing={15}
                  items="end"
                  h={"100%"}
                >
                  <Flex center>
                    {item.attendance.status === "Por publicar" && (
                      <Icon
                        name="clock-outline"
                        color={theme.colors.primary}
                        size={50}
                      />
                    )}
                    <Spacer />
                    <Avatar.Text
                      label={GetDay(item.starting_date)}
                      size={50}
                    />
                    <Text variant="bodyMedium">{GetCompactMonth(item.starting_date)}</Text>
                  </Flex>
                  <VStack fill>
                    <Text
                      variant="titleMedium"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text
                      variant="bodySmall"
                      numberOfLines={1}
                    >
                      De {Time24(item.starting_date)} a {Time24(item.ending_date)}
                    </Text>
                    <Text
                      variant="bodySmall"
                      numberOfLines={1}
                    >
                      En {item.place}
                    </Text>
                  </VStack>
                </HStack>
              </Flex>
            </Card>
          </TouchableRipple>
        </Flex>
      )
    },
    [events]
  )

  const FilterOptions = () => {
    const [loading, setLoading] = useState(false)
    const [placesOptions, setPlacesOptions] = useState()

    async function getPlaces() {
      setLoading(true)

      const request = await fetch(`${localhost}/places`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => (response.ok ? response.json() : response.status))
        .catch(() => null)

      setLoading(false)

      if (request?.places) {
        let placesData = []
        request.places.forEach((place) => {
          placesData.push({ option: place.place_name })
        })
        setPlacesOptions(placesData)
      }
    }

    useEffect(() => {
      getPlaces()
    }, [])

    return (
      <VStack spacing={10}>
        {placesOptions != null ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown
                title="Bosque urbano"
                value={placeFilter}
                selected={setPlaceFilter}
                options={placesOptions}
              />
            </Flex>
            {placeFilter ? (
              <IconButton
                icon="delete"
                mode="outlined"
                onPress={() => setPlaceFilter("")}
              />
            ) : null}
          </HStack>
        ) : loading == true ? (
          <HStack
            fill
            items="center"
            pv={10}
            spacing={20}
          >
            <Flex fill>
              <Text variant="bodyMedium">Obteniendo la lista de bosques urbanos</Text>
            </Flex>
            <ActivityIndicator />
          </HStack>
        ) : (
          <HStack
            fill
            items="center"
            pv={10}
            spacing={20}
          >
            <Flex fill>
              <Text variant="bodyMedium">Ocurrió un problema obteniendo la lista de bosques urbanos</Text>
            </Flex>
            <IconButton
              icon="reload"
              mode="outlined"
              onPress={() => getPlaces()}
            />
          </HStack>
        )}

        <HStack items="end">
          <Flex fill>
            <DateAndTimePicker
              date={dateFilter}
              setDate={setDateFilter}
              title="Eventos a partir de la fecha de inicio"
              hideTime={true}
            />
          </Flex>
          {dateFilter && (
            <IconButton
              icon="delete"
              mode="outlined"
              onPress={() => setDateFilter("")}
            />
          )}
        </HStack>
      </VStack>
    )
  }

  return (
    <Flex
      fill
      pt={headerMargin}
    >
      <SearchBar
        show={showSearch}
        label="Busca por evento"
        value={search}
        setter={setSearch}
        action={searchEvents}
      />

      {Object.keys(areFilters).length === 0 && search == "" ? (
        events !== null ? (
          events?.length >= 0 || events === undefined ? (
            <Flex fill>
              <FlatList
                data={events}
                ListEmptyComponent={() =>
                  events === undefined ? null : user?.role !== "Prestador" ? (
                    <InformationMessage
                      icon="pencil-plus-outline"
                      title="Sin eventos"
                      description="No hay ningún evento registrado, ¿qué te parece si hacemos el primero?"
                      buttonIcon="plus"
                      buttonTitle="Agregar"
                      action={() =>
                        navigation.navigate("AddEvent", {
                          getEvents
                        })
                      }
                    />
                  ) : (
                    <InformationMessage
                      icon="calendar-blank-outline"
                      title="Sin eventos"
                      description="No hay ningún evento, regresa en otra ocasión"
                      buttonIcon="reload"
                      buttonTitle="Recargar"
                      action={() => {
                        setEvents(undefined)
                        getEvents()
                      }}
                    />
                  )
                }
                refreshing={loading}
                onRefresh={() => getEvents()}
                renderItem={({ item }) => (
                  <Item
                    key={item._id}
                    item={item}
                  />
                )}
              />
              {user?.role != "Prestador" && (
                <FAB
                  icon="plus"
                  style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
                  onPress={() => navigation.navigate("AddEvent", { getEvents })}
                />
              )}
            </Flex>
          ) : (
            <InformationMessage
              icon="bug-outline"
              title="¡Ups! Error nuestro"
              description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
              buttonTitle="Volver a cargar"
              buttonIcon="reload"
              action={() => {
                setEvents(undefined)
                getEvents()
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
              setEvents(undefined)
              getEvents()
            }}
          />
        )
      ) : foundEvents !== null ? (
        foundEvents?.length >= 0 || foundEvents === undefined ? (
          <Flex fill>
            <FlatList
              data={foundEvents}
              ListEmptyComponent={() =>
                foundEvents === undefined ? null : (
                  <InformationMessage
                    icon="magnify"
                    title="Sin resultados"
                    description="No hay ningún usuario registrado que cumpla con los parámetros de tu búsqueda"
                  />
                )
              }
              refreshing={loading}
              onRefresh={() => getEvents()}
              renderItem={({ item }) => (
                <Item
                  key={item.register}
                  item={item}
                  register={item.register}
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
              setFoundEvents(undefined)
              searchEvents()
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
            setFoundEvents(undefined)
            searchEvents()
          }}
        />
      )}

      <ModalFilters
        handler={[showFilters, () => setShowFilters(!showFilters)]}
        child={FilterOptions()}
        action={() => searchEvents()}
      />
    </Flex>
  )
}
