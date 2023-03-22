import { Flex, HStack, VStack } from '@react-native-material/core'
import { useState, useEffect, useCallback, useMemo } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image, RefreshControl, ScrollView, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from '@react-navigation/native'
import CircularProgress from 'react-native-circular-progress-indicator'
import Constants from 'expo-constants'
import Animated from 'react-native-reanimated'
import InformationMessage from '../Shared/InformationMessage'

export default Dashboard = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const selectedImage = useMemo(() => Math.floor(Math.random() * 4), [])

  const [greeting, setGreeting] = useState('Hola')
  const [timeToSleep, setTimeToSleep] = useState(false)
  const [token, setToken] = useState(undefined)
  const [register, setRegister] = useState(undefined)
  const [user, setUser] = useState(undefined)
  const [feed, setFeed] = useState(undefined)
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    if (loading == false) {
      setLoading(true)
    }

    const requests = await Promise.all([
      fetch(`${localhost}/profile/${register}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })
        .then((response) => (response.ok ? response.json() : response.status))
        .catch((_) => null),
      fetch(`${localhost}/feed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      })
        .then((response) => (response.ok ? response.json() : response.status))
        .catch((error) => error)
    ])
      .then((responses) => responses)
      .catch((error) => error)

    setLoading(false)

    if (requests[0]?.user) {
      setUser(requests[0].user)
    } else {
      setUser(null)
    }

    if (requests[1]?.message) {
      setFeed({ exist: true, events: requests[1].events, achieved_hours: Number(requests[1].achieved_hours), total_hours: Number(requests[1].total_hours) })
    } else {
      setFeed(null)
    }
  }

  useEffect(() => {
    const getToken = async (_) => {
      const token = await SecureStore.getItemAsync('token')
      token ? setToken(token) : setToken(undefined)
    }

    if (token == undefined) {
      getToken()
    }
  }, [token])

  useEffect(() => {
    const getRegister = async (_) => {
      const register = await SecureStore.getItemAsync('register')
      register ? setRegister(register) : setRegister(undefined)
    }

    if (register == undefined) {
      getRegister()
    }
  }, [register])

  useEffect(() => {
    if (token !== undefined && register !== undefined) {
      fetchData()
    }
  }, [token, register])

  useFocusEffect(
    useCallback(() => {
      const time = new Date().getHours()

      if (time >= 7 && time < 12) {
        setGreeting('Buen día')
      }

      if (time >= 12 && time < 19) {
        setGreeting('Buena tarde')
      }

      if (time >= 19 || time < 7) {
        setGreeting('Buena noche')
      }

      if (time >= 22 || time < 5) {
        setTimeToSleep(true)
      } else {
        setTimeToSleep(false)
      }

      return () => {}
    }, [])
  )

  /* Se mantiene debido a compatibilidad, será eliminado en versiones posteriores, se tiene que migrar a los widgets */
  const Item = ({ screen, payload, icon, title }) => {
    return (
      <Flex w={'50%'} p={10}>
        <Card mode="outlined">
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <VStack ph={20} pv={10} h={175} spacing={10}>
              <Text>{title}</Text>
              <Flex fill center>
                <Avatar.Icon icon={icon} size={100} />
              </Flex>
            </VStack>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }

  const WidgetSmall = useCallback(({ screen, payload, child }) => {
    return (
      <Flex w={'25%'} p={10}>
        <Card mode="outlined">
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <Flex h={80} center>
              {child}
            </Flex>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }, [])

  const WidgetMedium = useCallback(({ screen, payload, child, title }) => {
    return (
      <Flex w={'50%'} p={10}>
        <Card mode="outlined">
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <VStack ph={20} pv={10} h={175} spacing={10}>
              <Text variant="bodyMedium">{title}</Text>
              <Flex fill center>
                {child}
              </Flex>
            </VStack>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }, [])

  return (
    <Flex fill pt={insets.top}>
      {user !== undefined && user !== null && feed !== undefined && feed !== null ? (
        <Flex w={'100%'} h={250 + insets.top} style={{ backgroundColor: '#ff0099', position: 'absolute' }}>
          {
            {
              0: <Image source={require('../../assets/images/cover/1.jpg')} style={{ width: '100%', height: '100%' }} />,
              1: <Image source={require('../../assets/images/cover/2.jpg')} style={{ width: '100%', height: '100%' }} />,
              2: <Image source={require('../../assets/images/cover/3.jpg')} style={{ width: '100%', height: '100%' }} />,
              3: <Image source={require('../../assets/images/cover/4.jpg')} style={{ width: '100%', height: '100%' }} />,
              4: <Image source={require('../../assets/images/cover/5.jpg')} style={{ width: '100%', height: '100%' }} />
            }[selectedImage]
          }

          <LinearGradient colors={[theme.colors.cover, theme.colors.background]} locations={[0.75, 1]} style={{ width: '100%', height: '100%', position: 'absolute' }} />
        </Flex>
      ) : null}

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData()} />}>
        {user !== undefined && user !== null && feed !== undefined && feed !== null ? (
          <VStack pb={50}>
            <VStack h={200} center>
              <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
                {greeting}
              </Text>
              <Text variant="headlineSmall" numberOfLines={1}>
                {user?.first_name}
              </Text>
              {timeToSleep ? (
                <Text variant="bodyMedium" numberOfLines={1}>
                  No dilates, dormir es importante ✨
                </Text>
              ) : null}
            </VStack>

            <Flex fill style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: theme.colors.background }}>
              <Flex p={25} center>
                <Text variant="headlineSmall">Tu centro de control</Text>
              </Flex>

              <VStack pb={50} spacing={20}>
                {/* Sección común */}
                <Flex direction="row" wrap="wrap" ph={10}>
                  {/* Widget de evento */}
                  <Flex w={'100%'} p={10}>
                    <VStack spacing={10}>
                      <Card mode="outlined">
                        <TouchableRipple
                          onPress={() => {
                            navigation.navigate('ShowAttendanceCode', { register: user?.register, avatar: user?.avatar })
                          }}
                        >
                          <VStack ph={20} pv={10} h={175} spacing={10}>
                            <Text variant="bodyMedium">Evento próximo</Text>
                            <HStack fill spacing={20}>
                              <Flex items="center">
                                <Avatar.Text label="12" size={50} />
                                <Text variant="bodyMedium">mayo</Text>
                              </Flex>
                              <VStack fill spacing={10}>
                                <Text variant="bodyLarge" numberOfLines={2}>
                                  Presentación de proyecto de titulación
                                </Text>
                                <Flex fill>
                                  <Text variant="bodyMedium">De 10:00 a 15:00</Text>
                                  <Text variant="bodyMedium" numberOfLines={1}>
                                    Centro de Enseñanza Técnica Industrial
                                  </Text>
                                </Flex>
                              </VStack>
                            </HStack>
                          </VStack>
                        </TouchableRipple>
                      </Card>
                    </VStack>
                  </Flex>

                  {/* Widget de progreso */}
                  {user?.role === 'Prestador' ? (
                    <WidgetMedium
                      screen="Profile"
                      payload={{ actualUser: user, token }}
                      child={
                        <Flex fill center>
                          <Flex fill center style={{ position: 'absolute' }}>
                            <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                              {feed?.achieved_hours} /
                            </Text>
                            <Text variant="bodyMedium">{feed?.total_hours}</Text>
                          </Flex>
                          {feed?.total_hours ? (
                            <Animated.View>
                              <CircularProgress value={feed?.achieved_hours} showProgressValue={false} progressValueColor={theme.colors.primary} activeStrokeColor={theme.colors.primary} inActiveStrokeColor={theme.colors.backdrop} rotation={180} titleColor={theme.colors.onBackground} radius={50} maxValue={feed?.total_hours} />
                            </Animated.View>
                          ) : null}
                        </Flex>
                      }
                      title="Tu progreso"
                    />
                  ) : null}

                  {/* Widget de perfil */}
                  <WidgetMedium screen="Profile" payload={{ user, token }} child={user?.avatar ? <Avatar.Image source={{ uri: `data:image/png;base64,${user.avatar}` }} size={100} /> : <Avatar.Icon icon="account-circle-outline" size={100} />} title="Tu perfil" />
                </Flex>

                {/* Sección de herramientas del administrador */}
                {user?.role === 'Administrador' || user?.role === 'Encargado' ? (
                  <Flex direction="row" wrap="wrap" ph={10}>
                    <Flex w={'100%'} ph={10}>
                      <Text variant="bodyLarge">Herramientas del {user?.role}</Text>
                    </Flex>

                    {user?.role === 'Administrador' ? <WidgetSmall screen="PlacesAndAreas" payload={{ user, token }} child={<Avatar.Icon icon={'map-marker-radius-outline'} size={50} />} /> : null}

                    {user?.role === 'Administrador' ? <WidgetSmall screen="Schools" payload={{ user, token }} child={<Avatar.Icon icon={'town-hall'} size={50} />} /> : null}

                    {user?.role === 'Encargado' ? <WidgetSmall screen="Cards" payload={{ user, token }} child={<Avatar.Icon icon={'clock-time-four-outline'} size={50} />} /> : null}
                    
                    <WidgetSmall screen="Users" payload={{ actualUser: user, token }} child={<Avatar.Icon icon={'account-supervisor-outline'} size={50} />} />

                    <WidgetSmall screen="TakeAttendance" payload={{ actualUser: user, token }} child={<Avatar.Icon icon={'alert'} size={50} />} />
                  </Flex>
                ) : null}
              </VStack>
            </Flex>
          </VStack>
        ) : loading == false ? (
          <Flex pt={insets.top} fill>
            <InformationMessage icon="alert" title="Uy, ocurrió un error" description="No podemos recuperar la información de tu cuenta, revisa tu conexión a internet e inténtalo nuevamente, si el problema persiste, contacta con tu encargado de servicio" buttonIcon="reload" buttonTitle="Volver a cargar" action={() => fetchData()} />
          </Flex>
        ) : null}
      </ScrollView>
    </Flex>
  )
}
