import { Flex, HStack, VStack } from '@react-native-material/core'
import { useState, useEffect, useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Button, Card, Text, useTheme, Avatar, TouchableRipple } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image, RefreshControl, ScrollView, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from '@react-navigation/native'
import CircularProgress from 'react-native-circular-progress-indicator'
import Constants from 'expo-constants'
import Animated from 'react-native-reanimated'

export default Dashboard = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [greeting, setGreeting] = useState('Hola')
  const [timeToSleep, setTimeToSleep] = useState(false)
  const [actualUser, setActualUser] = useState(undefined)
  const [actualToken, setActualToken] = useState(undefined)
  const [token, setToken] = useState(undefined)
  const [register, setRegister] = useState(undefined)
  const [user, setUser] = useState(undefined)
  const [progress, setProgress] = useState(undefined)
  const [loading, setLoading] = useState(false)

  async function getUser() {
    if (loading == false) {
      setLoading(true)
    }

    const request = await fetch(`${localhost}/profile/${register}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch((_) => null)

    setLoading(false)

    if (request?.user) {
      setUser(request.user)
    } else {
      setUser(request)
    }
  }

  async function getFeed() {
    if (loading == false) {
      setLoading(true)
    }

    const request = await fetch(`${localhost}/feed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch((error) => error)

    setLoading(false)

    if (request?.total_hours) {
      setProgress({ achieved_hours: Number(request.achieved_hours), total_hours: Number(request.total_hours) })
    } else {
      setProgress(null)
    }
  }

  // useEffect(() => {
  //   const getUser = async (_) => {
  //     const user = JSON.parse(await SecureStore.getItemAsync('user'))
  //     user ? setActualUser(user) : setActualUser(undefined)
  //   }

  //   if (actualUser === undefined) {
  //     getUser()
  //   }
  // }, [actualUser])

  // useEffect(() => {
  //   const getToken = async (_) => {
  //     const token = await SecureStore.getItemAsync('token')
  //     token ? setActualToken(token) : setActualToken(undefined)
  //   }

  //   if (actualToken === undefined) {
  //     getToken()
  //   }
  // }, [actualToken])

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
      getUser()
      getFeed()
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

  const WidgetMedium = ({ screen, payload, child, title }) => {
    return (
      <Flex w={'50%'} p={10}>
        <Card mode="outlined">
          <TouchableRipple
            onPress={() => {
              navigation.navigate(screen, { ...payload })
            }}
          >
            <VStack ph={20} pv={10} h={175} spacing={10}>
              <Text variant='bodyMedium'>{title}</Text>
              <Flex fill center>
                {child}
              </Flex>
            </VStack>
          </TouchableRipple>
        </Card>
      </Flex>
    )
  }

  return (
    <Flex fill pt={insets.top}>
      <Flex w={'100%'} h={'35%'} style={{ backgroundColor: '#ff0099', position: 'absolute' }}>
        {
          {
            0: <Image source={require('../../assets/images/cover/1.jpg')} style={{ width: '100%', height: '100%' }} />,
            1: <Image source={require('../../assets/images/cover/2.jpg')} style={{ width: '100%', height: '100%' }} />,
            2: <Image source={require('../../assets/images/cover/3.jpg')} style={{ width: '100%', height: '100%' }} />,
            3: <Image source={require('../../assets/images/cover/4.jpg')} style={{ width: '100%', height: '100%' }} />,
            4: <Image source={require('../../assets/images/cover/5.jpg')} style={{ width: '100%', height: '100%' }} />
          }[Math.floor(Math.random() * 4)]
        }

        <LinearGradient colors={[theme.colors.cover, theme.colors.background]} locations={[0.75, 1]} style={{ width: '100%', height: '100%', position: 'absolute' }} />
      </Flex>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getFeed()} />}>
        <VStack pb={50} spacing={50}>
          <VStack items="center" pt={50}>
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

            <Flex direction="row" wrap="wrap" ph={10} pb={50}>
              <Flex w={'100%'} p={10}>
                <VStack spacing={10}>
                  <Card mode="outlined">
                    <TouchableRipple
                      onPress={() => {
                        navigation.navigate('AttendanceDetails', { actualUser: user, token: token })
                      }}
                    >
                      <VStack ph={20} pv={10} h={175} spacing={10}>
                        <Text variant='bodyMedium'>Evento próximo</Text>
                        <HStack fill spacing={20}>
                          <Flex items="center">
                            <Avatar.Text label="12" size={50} />
                            <Text variant='bodyMedium'>mayo</Text>
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

              <WidgetMedium
                screen="Profile"
                payload={{ actualUser: user, token }}
                child={
                  <Flex fill center>
                    <Flex fill center style={{ position: 'absolute' }}>
                      <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                        {progress?.achieved_hours} /
                      </Text>
                      <Text variant="bodyMedium">{progress?.total_hours}</Text>
                    </Flex>
                    {progress?.total_hours ? (
                      <Animated.View>
                        <CircularProgress value={progress?.achieved_hours} showProgressValue={false} progressValueColor={theme.colors.primary} activeStrokeColor={theme.colors.primary} inActiveStrokeColor={theme.colors.backdrop} rotation={180} titleColor={theme.colors.onBackground} radius={50} maxValue={progress?.total_hours} />
                      </Animated.View>
                    ) : null}
                  </Flex>
                }
                title="Tu progreso"
              />

              <WidgetMedium screen="Profile" payload={{ actualUser: user, token }} child={user?.avatar ? <Avatar.Image source={{ uri: `data:image/png;base64,${user.avatar}` }} size={100} /> : <Avatar.Icon icon="account-circle-outline" size={100} />} title="Tu perfil" />

              {user?.role == 'Administrador' || user?.role == 'Encargado' ? <Item screen="Users" payload={{ actualUser: user, token }} icon="account-supervisor-outline" title="Usuarios" /> : null}

              {user?.role == 'Administrador' ? <Item screen="PlacesAndAreas" payload={{ actualUser: user, token }} icon="map-marker-radius-outline" title="Lugares y áreas" /> : null}

              {user?.role == 'Administrador' ? <Item screen="Schools" payload={{ user, token }} icon="town-hall" title="Escuelas" /> : null}

              <Button
                onPress={() => {
                  navigation.navigate('AttendanceRegister')
                }}
              >
                Ir a AttendanceRegister
              </Button>
            </Flex>
          </Flex>
        </VStack>
      </ScrollView>
    </Flex>
  )
}
