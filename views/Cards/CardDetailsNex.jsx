import { Flex, VStack } from '@react-native-material/core'
import { useEffect, useState, useCallback } from 'react'
import { useHeaderHeight } from '@react-navigation/elements'
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import DisplayDetails from '../Shared/DisplayDetails'
import { ScrollView, RefreshControl } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LongDate } from "../Shared/LocaleDate"


export default CardDetail = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const headerMargin = useHeaderHeight()
  const { token, user } = route.params
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState(undefined)

  async function getCard() {
    setLoading(true)

    const request = await fetch(`${localhost}/cards/${user?.register}`, {
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
    
    if (request?.activities) {
      setCard(request.activities)
    }
    // } else {
    //   setCard(request)
    // }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: 'Detalles del tarjetón'
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getCard()
      console.log(user?.role)
      return () => {}
    }, [])
  )

  const Activity = () => {
    return (
      <VStack p={20} spacing={5} key="Activity"> 
        <Text variant="bodyLarge">Actividades</Text>
        <VStack spacing={10}>
          {card.length > 0 ? (
            card.map((activity) => (
              <Card mode="outlined" key={activity.activity_name}>
                <VStack spacing={10} p={20}>
                  <VStack fill spacing={5}>
                    <Flex>
                      <Text variant="labelSmall">Nombre de la actividad</Text>
                      <Text variant="bodyMedium">{activity?.activity_name}</Text>
                    </Flex>
                    <Flex>
                      <Text variant="labelSmall">Horas</Text>
                      <Text variant="bodyMedium">{activity?.hours}</Text>
                    </Flex>
                    <Flex>
                      <Text variant="labelSmall">Registro del responsable</Text>
                      <Text variant="bodyMedium">{activity?.responsible_register}</Text>
                    </Flex>
                    <Flex>
                      <Text variant="labelSmall">Fecha</Text>
                      <Text variant="bodyMedium">{LongDate(activity?.assignation_date)}</Text>
                    </Flex>
                  </VStack>
                  <Button
                    icon="pencil-outline"
                    onPress={() => {
                      navigation.navigate('EditCard', {
                        token,
                        activity,
                        user
                      })
                    }}
                  >
                    Editar actividad
                  </Button>
                </VStack>
              </Card>
            ))
          ) : (
            <VStack center spacing={20} p={30}>
              <Icon name="pencil-plus-outline" color={theme.colors.onBackground} size={50} />
              <VStack center>
                <Text variant="headlineSmall">Sin actividades</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                  No hay ningúna actividad registrada, ¿qué te parece si hacemos la primera?
                </Text>
              </VStack>
            </VStack>
          )}
        </VStack>
        <Button
          icon="plus"
          onPress={() => {
            navigation.navigate('AddCard', {
              token,
              user
              
            })
          }}
        >
          Agregar actividad
        </Button>
      </VStack>
    )
  }

  return (
    <Flex fill pt={headerMargin - 20}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getCard()} />}>
        {card !== undefined ? (
          card !== null ? (
            // isNaN(card) ? (
              <DisplayDetails photo={user?.avatar} title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? '' : user?.second_last_name}`} children={[Activity()]} />
            /*) : (*/
              // <VStack p={30} center spacing={20}>
              //   <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50} />
              //   <VStack center>
              //     <Text variant="headlineSmall">Ocurrió un problema</Text>
              //     <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              //       No podemos recuperar el tarjetón, inténtalo de nuevo más tarde (Error: {card})
              //     </Text>
              //   </VStack>
              //   <Flex>
              //     <Button
              //       mode="outlined"
              //       onPress={(_) => {
              //         getCard()
              //       }}
              //     >
              //       Volver a intentar
              //     </Button>
              //   </Flex>
              // </VStack>
            // )
          ) : (
            <VStack center spacing={20} p={30}>
              <Icon color={theme.colors.onBackground} name="wifi-alert" size={50} />
              <VStack center>
                <Text variant="headlineSmall">Sin internet</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                  No podemos recuperar los datos del usuario, revisa tu conexión a internet e inténtalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getCard()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : null}
      </ScrollView>
      
      {!(card === undefined || card === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate('AddCard', {
              token,
              user
            })
          }}
        />
      ) : null}
    </Flex>
  )
}
