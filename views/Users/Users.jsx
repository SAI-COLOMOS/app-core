import { Flex, HStack, VStack } from '@react-native-material/core'
import { useCallback, useEffect, useState } from 'react'
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB, Button } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/elements'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import { RefreshControl, ScrollView, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchBar from '../Shared/SearchBar'
import ModalFilters from '../Shared/ModalFilters'
import Dropdown from '../Shared/Dropdown'

export default Users = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { actualUser, token } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState(undefined)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const [placesOptions, setPlacesOptions] = useState()
  const [areasOptions, setAreasOptions] = useState()
  const [schoolsOptions, setSchoolsOptions] = useState()
  const roleOptions = [{ option: 'Administrador' }, { option: 'Encargado' }, { option: 'Prestador' }]
  const periodOptions = [{ option: 'A' }, { option: 'B' }]
  const statusOptions = [{ option: 'Activo' }, { option: 'Suspendido' }, { option: 'Inactivo' }, { option: 'Finalizado' }]
  const providerOptions = [{ option: 'Servicio social' }, { option: 'Prácticas profesionales' }, { option: 'No aplica' }]

  const [placeFilter, setPlaceFilter] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [providerFilter, setProviderFilter] = useState('')

  const getUsers = async () => {
    setLoading(true)

    let filters = {}

    if (placeFilter !== '') {
      filters = { ...filters, place: placeFilter }
    }

    if (areaFilter !== '') {
      filters = { ...filter, assigned_area: areaFilter }
    }

    if (roleFilter !== '') {
      filters = { ...filter, role: roleFilter }
    }

    if (yearFilter !== '') {
      filters = { ...filter, year: yearFilter }
    }

    if (periodFilter !== '') {
      filters = { ...filter, period: periodFilter }
    }

    if (schoolFilter !== '') {
      filters = { ...filter, school: schoolFilter }
    }

    if (statusFilter !== '') {
      filters = { ...filter, status: statusFilter }
    }

    if (providerFilter !== '') {
      filters = { ...filter, provider_type: providerFilter }
    }

    const request = await fetch(`${localhost}/users?search=${search}&filter=${JSON.stringify(filters)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
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

  const getPlaces = async () => {
    const request = await fetch(`${localhost}/places`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
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
      header: (props) => <Header {...props} children={[<IconButton icon="filter-outline" onPress={() => setShowFilters(!showFilters)} />, <IconButton icon="magnify" onPress={() => setShowSearch(!showSearch)} />]} />,
      headerTransparent: true,
      headerTitle: 'Usuarios'
    })
  }, [showSearch, showFilters])

  useEffect(() => {
    setAreaFilter('')
    const placeSelected = placesOptions?.find((place) => place.option == placeFilter)

    let areaData = []
    placeSelected?.areas.forEach((area) => {
      areaData.push({ option: area.option })
    })

    setAreasOptions(areaData)
  }, [placeFilter])

  // useEffect(() => {
  //   if (users === undefined) {
  //     getUsers()
  //   }
  // }, [users])

  // useEffect(() => {
  //   if (places === undefined) {
  //     getPlaces()
  //   }
  // }, [places])

  // useEffect(() => {
  //   if (schools === undefined) {
  //     getSchools()
  //   }
  // }, [schools])

  useFocusEffect(
    useCallback(
      () => {
        getUsers()
        getPlaces()
        getSchools()
        return () => {}
      },
      [],
      []
    )
  )

  const Item = useCallback(
    ({ first_name, role, avatar, register }) => {
      return (
        <Flex ph={20} pv={5} onPress={() => {}}>
          <Card mode="outlined" style={{ overflow: 'hidden' }}>
            <TouchableRipple
              onPress={() => {
                navigation.navigate('UserDetails', { actualUser, token, register, placesOptions, schoolsOptions })
              }}
            >
              <Flex p={10}>
                <Card.Title title={first_name} titleNumberOfLines={2} subtitle={role} subtitleNumberOfLines={2} left={(props) => (avatar ? <Avatar.Image {...props} source={{ uri: `data:image/png;base64,${avatar}` }} /> : <Avatar.Icon {...props} icon="account" />)} />
              </Flex>
            </TouchableRipple>
          </Card>
        </Flex>
      )
    },
    [placesOptions]
  )

  const EmptyList = useCallback(() => {
    return (
      <VStack center spacing={20} p={30}>
        <Icon name="pencil-plus-outline" color={theme.colors.onBackground} size={50} />
        <VStack center>
          <Text variant="headlineSmall">Sin usuarios</Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
            No hay ningún usuario registrado, ¿qué te parece si hacemos el primero?
          </Text>
        </VStack>
        <Flex>
          <Button
            icon="plus"
            mode="outlined"
            onPress={() => {
              navigation.navigate('AddUser', {
                actualUser,
                token
              })
            }}
          >
            Agregar
          </Button>
        </Flex>
      </VStack>
    )
  }, [])

  const NoConnection = useCallback(() => {
    return (
      <VStack center spacing={20} p={30}>
        <Icon name="wifi-alert" color={theme.colors.onBackground} size={50} />
        <VStack center>
          <Text variant="headlineSmall">Sin conexión</Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
            Parece que no tienes conexión a internet, conéctate e intenta de nuevo
          </Text>
        </VStack>
        <Flex>
          <Button
            icon="reload"
            mode="outlined"
            onPress={() => {
              setUsers(undefined)
              getUsers()
            }}
          >
            Volver a intentar
          </Button>
        </Flex>
      </VStack>
    )
  }, [])

  const FilterOptions = () => {
    return (
      <VStack spacing={10}>
        {actualUser.role == 'Administrador' ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown title="Bosque urbano" value={placeFilter} selected={setPlaceFilter} options={placesOptions} />
            </Flex>
            {placeFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setPlaceFilter('')} /> : null}
          </HStack>
        ) : null}

        {placeFilter && areasOptions.length > 0 ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown title="Área asignada" value={areaFilter} selected={setAreaFilter} options={areasOptions} />
            </Flex>
            {areaFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setAreaFilter('')} /> : null}
          </HStack>
        ) : null}

        {actualUser.role == 'Administrador' ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown title="Rol" value={roleFilter} selected={setRoleFilter} options={roleOptions} />
            </Flex>
            {roleFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setRoleFilter('')} /> : null}
          </HStack>
        ) : null}

        <HStack items="end">
          <Flex fill>
            <TextInput value={yearFilter} onChangeText={setYearFilter} mode="outlined" label="Año de inscripción" maxLength={4} keyboardType="numeric" />
          </Flex>
          {yearFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setYearFilter('')} /> : null}
        </HStack>

        <HStack items="end">
          <Flex fill>
            <Dropdown title="Periodo de inscripción" value={periodFilter} selected={setPeriodFilter} options={periodOptions} />
          </Flex>
          {periodFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setPeriodFilter('')} /> : null}
        </HStack>

        <HStack items="end">
          <Flex fill>
            <Dropdown title="Escuela" value={schoolFilter} selected={setSchoolFilter} options={schoolsOptions} />
          </Flex>
          {schoolFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setSchoolFilter('')} /> : null}
        </HStack>

        <HStack items="end">
          <Flex fill>
            <Dropdown title="Estado" value={statusFilter} selected={setStatusFilter} options={statusOptions} />
          </Flex>
          {statusFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setStatusFilter('')} /> : null}
        </HStack>

        {actualUser.role == 'Administrador' ? (
          <HStack items="end">
            <Flex fill>
              <Dropdown title="Tipo de prestador" value={providerFilter} selected={setProviderFilter} options={providerOptions} />
            </Flex>
            {providerFilter ? <IconButton icon="delete" mode="outlined" onPress={() => setProviderFilter('')} /> : null}
          </HStack>
        ) : null}
      </VStack>
    )
  }

  return (
    <Flex fill pt={headerMargin}>
      <Flex>
        <SearchBar show={showSearch} label="Busca por nombre, registro, correo o teléfono" value={search} setter={setSearch} action={getUsers} />
      </Flex>

      <FlatList data={users} ListEmptyComponent={() => (users === undefined ? null : users === null ? <NoConnection /> : <EmptyList />)} refreshing={loading} onRefresh={() => getUsers()} renderItem={({ item }) => <Item onPress={() => {}} first_name={`${item.first_name} ${item.first_last_name} ${item.second_last_name ?? ''}`} role={`${item.register}`} register={item.register} avatar={item?.avatar} />} />

      <FAB
        icon="plus"
        style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
        onPress={() => {
          navigation.navigate('AddUser', {
            actualUser,
            token,
            placesOptions,
            schoolsOptions
          })
        }}
      />

      <ModalFilters handler={[showFilters, () => setShowFilters(!showFilters)]} child={FilterOptions()} action={() => getUsers()} />
    </Flex>
  )
}
