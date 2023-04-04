import { Flex, HStack, VStack } from "@react-native-material/core"
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

export default Users = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { user, token } = useContext(ApplicationContext)
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState(undefined)
  const [foundEvents, setFoundEvents] = useState(undefined)
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(null)
  const [areFilters, setAreFilters] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [placesOptions, setPlacesOptions] = useState()
  const [areasOptions, setAreasOptions] = useState()
  const [schoolsOptions, setSchoolsOptions] = useState()
  const roleOptions = [{ option: "Administrador" }, { option: "Encargado" }, { option: "Prestador" }]
  const periodOptions = [{ option: "A" }, { option: "B" }]
  const statusOptions = [{ option: "Activo" }, { option: "Suspendido" }, { option: "Inactivo" }, { option: "Finalizado" }]
  const providerOptions = [{ option: "Servicio social" }, { option: "Prácticas profesionales" }, { option: "No aplica" }]

  const [placeFilter, setPlaceFilter] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [periodFilter, setPeriodFilter] = useState("")
  const [schoolFilter, setSchoolFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [providerFilter, setProviderFilter] = useState("")

  const getEvents = async () => {
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

    if (areaFilter !== "") {
      filters = { ...filters, assigned_area: areaFilter }
    }

    if (roleFilter !== "") {
      filters = { ...filters, role: roleFilter }
    }

    if (yearFilter !== "") {
      filters = { ...filters, year: yearFilter }
    }

    if (periodFilter !== "") {
      filters = { ...filters, period: periodFilter }
    }

    if (schoolFilter !== "") {
      filters = { ...filters, school: schoolFilter }
    }

    if (statusFilter !== "") {
      filters = { ...filters, status: statusFilter }
    }

    if (providerFilter !== "") {
      filters = { ...filters, provider_type: providerFilter }
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
          children={[
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
          ]}
        />
      ),
      headerTransparent: true,
      headerTitle: "Eventos"
    })
  }, [showSearch, showFilters])

  useEffect(() => {
    setAreaFilter("")
    const placeSelected = placesOptions?.find((place) => place.option == placeFilter)

    let areaData = []
    placeSelected?.areas.forEach((area) => {
      areaData.push({ option: area.option })
    })

    setAreasOptions(areaData)
  }, [placeFilter])

  useFocusEffect(
    useCallback(() => {
      getEvents()
      return () => {}
    }, [])
  )

  const Item = useCallback(({ item }) => {
    const [avatar, setAvatar] = useState(undefined)
    const [loadingDone, setLoadingDone] = useState(false)

    useEffect(() => {
      const getAvatar = async () => {
        const request = await fetch(`${localhost}/agenda/${item.event_identifier}?avatar=true`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
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
        <Pressable
          onPress={() => {
            navigation.navigate("EventDetails", { event_identifier: item.event_identifier })
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
                spacing={10}
                items="end"
              >
                <Flex center>
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
        </Pressable>
      </Flex>
    )
  }, [])

  const FilterOptions = () => {
    return (
      <VStack spacing={10}>
        {user.role == "Administrador" ? (
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
        ) : null}

        {placeFilter && areasOptions.length > 0 ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown
                title="Área asignada"
                value={areaFilter}
                selected={setAreaFilter}
                options={areasOptions}
              />
            </Flex>
            {areaFilter ? (
              <IconButton
                icon="delete"
                mode="outlined"
                onPress={() => setAreaFilter("")}
              />
            ) : null}
          </HStack>
        ) : null}

        {user.role == "Administrador" ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown
                title="Rol"
                value={roleFilter}
                selected={setRoleFilter}
                options={roleOptions}
              />
            </Flex>
            {roleFilter ? (
              <IconButton
                icon="delete"
                mode="outlined"
                onPress={() => setRoleFilter("")}
              />
            ) : null}
          </HStack>
        ) : null}

        <HStack items="end">
          <Flex fill>
            <TextInput
              value={yearFilter}
              onChangeText={setYearFilter}
              mode="outlined"
              label="Año de inscripción"
              maxLength={4}
              keyboardType="numeric"
            />
          </Flex>
          {yearFilter ? (
            <IconButton
              icon="delete"
              mode="outlined"
              onPress={() => setYearFilter("")}
            />
          ) : null}
        </HStack>

        <HStack items="end">
          <Flex fill>
            <Dropdown
              title="Periodo de inscripción"
              value={periodFilter}
              selected={setPeriodFilter}
              options={periodOptions}
            />
          </Flex>
          {periodFilter ? (
            <IconButton
              icon="delete"
              mode="outlined"
              onPress={() => setPeriodFilter("")}
            />
          ) : null}
        </HStack>

        <HStack items="end">
          <Flex fill>
            <Dropdown
              title="Escuela"
              value={schoolFilter}
              selected={setSchoolFilter}
              options={schoolsOptions}
            />
          </Flex>
          {schoolFilter ? (
            <IconButton
              icon="delete"
              mode="outlined"
              onPress={() => setSchoolFilter("")}
            />
          ) : null}
        </HStack>

        <HStack items="end">
          <Flex fill>
            <Dropdown
              title="Estado"
              value={statusFilter}
              selected={setStatusFilter}
              options={statusOptions}
            />
          </Flex>
          {statusFilter ? (
            <IconButton
              icon="delete"
              mode="outlined"
              onPress={() => setStatusFilter("")}
            />
          ) : null}
        </HStack>

        {user.role == "Administrador" ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown
                title="Tipo de prestador"
                value={providerFilter}
                selected={setProviderFilter}
                options={providerOptions}
              />
            </Flex>
            {providerFilter ? (
              <IconButton
                icon="delete"
                mode="outlined"
                onPress={() => setProviderFilter("")}
              />
            ) : null}
          </HStack>
        ) : null}
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
                renderItem={({ item }) => (
                  <Item
                    key={item._id}
                    item={item}
                  />
                )}
              />

              <FAB
                icon="plus"
                style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
                onPress={() => navigation.navigate("AddEvent")}
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
