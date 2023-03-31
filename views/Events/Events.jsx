import { even, Flex, VStack } from "@react-native-material/core"
import { useState, useEffect, useCallback } from "react"
import { Avatar, Button, Card, FAB, IconButton, Text, TouchableRipple, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import { FlatList } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import SearchBar from "../Shared/SearchBar"
import InformationMessage from "../Shared/InformationMessage"

export default Events = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()
  const { user, token } = route.params
  const headerMargin = useHeaderHeight()

  const [belonging_area, setBelonging_area] = useState(undefined)
  const [belonging_place, setBelonging_place] = useState(undefined)
  const [events, setEvents] = useState(undefined)

  const [filter, setFilter] = useState(undefined)
  const [items, setItem] = useState(undefined)
  const [page, setPage] = useState(undefined)

  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(null)
  const [search, setSearch] = useState("")
  const [foundEvents, setFoundEvents] = useState(undefined)

  async function getEvents() {
    setLoading(true)

    const request = await fetch(`${localhost}/agenda`, {
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
      setEvents(request.events)
      console.log(request)
    } else {
      setEvents(request)
    }
  }

  async function searchEvents() {
    setLoading(true)

    if (search === "") {
      setFoundEvents(undefined)
      setLoading(false)
      return
    }
    const request = await fetch(`${localhost}/agenda?search=${search}`, {
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
      header: (props) => <Header {...props} children={[user?.role !== "Prestador" && <IconButton key="SearchButton" icon="magnify" onPress={() => setShowSearch(!showSearch)} />]} />,
      headerTransparent: true,
      headerTitle: "Eventos"
    })
  }, [showSearch])

  useFocusEffect(
    useCallback(() => {
      getEvents()
      return () => {}
    }, [])
  )

  const Item = ({ name, description, event_identifier }) => {
    return (
      <Flex key={`ID-${event_identifier}`} ph={20} pv={5} onPress={() => {}}>
        <Card mode="outlined" style={{ overflow: "hidden" }}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("EventDetails", { token, event_identifier })
            }}
          >
            <Flex p={10}>
              <Card.Title title={name} titleNumberOfLines={2} subtitle={description} subtitleNumberOfLines={1} left={(props) => <Avatar.Icon {...props} icon="bulletin-board" />} />
            </Flex>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }

  return (
    <Flex fill pt={headerMargin}>
      <SearchBar show={showSearch} label="Busca por nombre del evento" value={search} setter={setSearch} action={searchEvents} />

      {search == "" ? (
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
                      action={() => {
                        navigation.navigate("AddEvent", {
                          user,
                          token
                        })
                      }}
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
                renderItem={({ item }) => <Item key={item.event_identifier} name={item.name} description={item.description} event_identifier={item.event_identifier} />}
              />

              {typeof events == "object" && user?.role !== "Prestador" && (
                <FAB
                  icon="plus"
                  style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
                  onPress={() => {
                    navigation.navigate("AddEvent", {
                      user,
                      token
                    })
                  }}
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
            <FlatList data={foundEvents} ListEmptyComponent={() => (foundEvents === undefined ? null : <InformationMessage icon="magnify" title="Sin resultados" description="No hay ningún evento registrado que cumpla con los parámetros de tu búsqueda" />)} refreshing={loading} onRefresh={() => searchEvents()} renderItem={({ item }) => <Item key={item.event_identifier} place={item.place} belonging_area={item.belonging_area} belonging_place={item.belonging_place} />} />
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
    </Flex>
  )
}
