import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB } from "react-native-paper"
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
import CacheContext from "../Contexts/CacheContext"

export default Users = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { user, token } = useContext(ApplicationContext)
  const { users, setUsers } = useContext(CacheContext)
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  //const [users, setUsers] = useState(undefined)
  const [foundUsers, setFoundUsers] = useState(undefined)
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

  const getUsers = async () => {
    setLoading(true)

    const request = await fetch(`${localhost}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.users) {
      setUsers(request.users)
    } else {
      setUsers(request)
    }
  }

  const searchUsers = async () => {
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
      setFoundUsers(undefined)
      setLoading(false)
      return
    }

    const request = await fetch(`${localhost}/users?search=${search.trim()}&filter=${JSON.stringify(filters)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.users) {
      setFoundUsers(request.users)
    } else {
      setFoundUsers(request)
    }
  }

  const getPlaces = async () => {
    const request = await fetch(`${localhost}/places`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    if (request?.places) {
      let placesData = []
      request.places.forEach((place) => {
        let areasData = []

        place.place_areas.map((area) => {
          areasData.push({ option: area.area_name })
        })

        placesData.push({ option: place.place_name, areas: areasData })
      })
      setPlacesOptions(placesData)
    } else {
    }
  }

  const getSchools = async () => {
    const request = await fetch(`${localhost}/schools`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    if (request?.schools) {
      let schoolsData = []
      request.schools.forEach((school) => {
        schoolsData.push({ option: school.school_name })
      })
      setSchoolsOptions(schoolsData)
    } else {
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
      headerTitle: "Usuarios"
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

  useEffect(() => {
    if (users == undefined) {
      getUsers()
      getPlaces()
      getSchools()
    }
  }, [])

  const Item = useCallback(
    ({ item, register }) => {
      const [avatar, setAvatar] = useState(undefined)

      useEffect(() => {
        const requestAvatar = async () => {
          const request = await fetch(`${localhost}/users/${register}?avatar=true`, {
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
        >
          <Pressable
            onPress={() => {
              navigation.navigate("UserDetails", { register, getUsers })
            }}
          >
            <Card
              mode="outlined"
              style={{ overflow: "hidden" }}
            >
              <HStack items="center">
                <ProfileImage
                  image={avatar}
                  icon="account-outline"
                  loading={avatar === undefined}
                />
                <Flex
                  fill
                  p={10}
                >
                  <Text
                    variant="titleMedium"
                    numberOfLines={1}
                  >
                    {item.first_name} {item.first_last_name} {item.second_last_name ?? null}
                  </Text>
                  <Text variant="bodySmall">{item.register}</Text>
                  <Text variant="bodySmall">
                    {item.role} {item.role == "Prestador" && item.provider_type}
                  </Text>
                </Flex>
              </HStack>
            </Card>
          </Pressable>
        </Flex>
      )
    },
    [users]
  )

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
        label="Busca por nombre, registro, correo o teléfono"
        value={search}
        setter={setSearch}
        action={searchUsers}
      />

      {Object.keys(areFilters).length === 0 && search == "" ? (
        users !== null ? (
          users?.length >= 0 || users === undefined ? (
            <Flex fill>
              <FlatList
                data={users}
                ListEmptyComponent={() =>
                  users === undefined ? null : (
                    <InformationMessage
                      icon="pencil-plus-outline"
                      title="Sin usuarios"
                      description="No hay ningún usuario registrado, ¿qué te parece si hacemos el primero?"
                      buttonIcon="plus"
                      buttonTitle="Agregar"
                      action={() => {
                        navigation.navigate("AddUser", {
                          placesOptions,
                          schoolsOptions,
                          getUsers
                        })
                      }}
                    />
                  )
                }
                refreshing={loading}
                onRefresh={() => {
                  getUsers()
                  getPlaces()
                  getSchools()
                }}
                renderItem={({ item }) => (
                  <Item
                    key={item.register}
                    item={item}
                    register={item.register}
                  />
                )}
              />

              <FAB
                icon="plus"
                style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
                onPress={() => {
                  navigation.navigate("AddUser", {
                    getUsers
                  })
                }}
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
                setUsers(undefined)
                getUsers()
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
              setUsers(undefined)
              getUsers()
            }}
          />
        )
      ) : foundUsers !== null ? (
        foundUsers?.length >= 0 || foundUsers === undefined ? (
          <Flex fill>
            <FlatList
              data={foundUsers}
              ListEmptyComponent={() =>
                foundUsers === undefined ? null : (
                  <InformationMessage
                    icon="magnify"
                    title="Sin resultados"
                    description="No hay ningún usuario registrado que cumpla con los parámetros de tu búsqueda"
                  />
                )
              }
              refreshing={loading}
              onRefresh={() => getUsers()}
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
              setFoundUsers(undefined)
              searchUsers()
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
            setFoundUsers(undefined)
            searchUsers()
          }}
        />
      )}

      <ModalFilters
        handler={[showFilters, () => setShowFilters(!showFilters)]}
        child={FilterOptions()}
        action={() => searchUsers()}
      />
    </Flex>
  )
}
