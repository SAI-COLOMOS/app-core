import { Flex, HStack, VStack } from "@react-native-material/core"
import CreateForm from "../../Shared/CreateForm"
import ProfileImage from "../../Shared/ProfileImage"
import { useCallback, useContext, useEffect, useState } from "react"
import ApplicationContext from "../../ApplicationContext"
import { Button, Text, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import * as Location from "expo-location"
import * as TaskManager from "expo-task-manager"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated"
import InformationMessage from "../../Shared/InformationMessage"
import { useFocusEffect } from "@react-navigation/native"
import { useKeepAwake } from "expo-keep-awake"

export default ProximityTransmisor = ({ navigation, route }) => {
  const theme = useTheme()
  const { event_identifier, getEvent } = route.params
  const { user, host, token } = useContext(ApplicationContext)
  useKeepAwake()

  const [status, requestPermission] = Location.useForegroundPermissions()
  const [location, setLocation] = useState({ latitude: undefined, longitude: undefined, accuracy: undefined })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [outOfRange, setOutOfRange] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [accuracy, setAccuracy] = useState(null)

  const avatarScale = useSharedValue(1)
  const avatarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withSpring(avatarScale.value, {
                damping: 5,
                stiffness: 5
              }),
              withSpring(avatarScale.value * 1.2, {
                damping: 5,
                stiffness: 5
              })
            ),
            0,
            true
          )
        }
      ]
    }
  })

  async function sendLocation(latitude, longitude, accuracy) {
    try {
      setSending(true)

      const request = await fetch(`${host}/agenda/${event_identifier}/attendance/proximity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          latitude,
          longitude,
          accuracy
        })
      })

      setSending(false)

      if (request.status == 201) {
        setUnavailable(false)
        setDone(true)
        return
      }

      if (request.status == 200) {
        setUnavailable(false)
        setOutOfRange(true)
        return
      }

      if (request.status == 403) {
        setUnavailable(true)
        return
      }

      return
    } catch (error) {
      console.error(error)
      setSending(false)

      return
    }
  }

  useFocusEffect(
    useCallback(() => {
      let watcher = undefined

      const startWatching = async () => {
        watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000
          },
          async ({ coords }) => {
            setAccuracy(coords.accuracy)
            await sendLocation(coords.latitude, coords.longitude, coords.accuracy)
          }
        )
      }

      if (status?.granted == true) {
        startWatching()
      }

      return () => {
        watcher?.remove()
      }
    }, [status])
  )

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      getEvent()
    })
  }, [navigation])

  const Scanning = () => {
    return (
      <VStack
        key="Scanning"
        fill
        spacing={20}
        items="center"
      >
        <Flex
          w={120}
          h={120}
          center
        >
          <Animated.View style={[{ width: 110, height: 110, borderRadius: 10, position: "absolute", backgroundColor: theme.colors.primaryContainer }, avatarAnimatedStyle]} />
          <ProfileImage
            icon="account-outline"
            image={user?.avatar}
            width={100}
            height={100}
          />
        </Flex>
        <Text>Precisión del GPS: {accuracy ? `${Number(accuracy).toFixed(0)} m` : "Sin información"}</Text>
        {outOfRange == true && (
          <HStack
            ph={20}
            spacing={20}
            center
          >
            <Icon
              name="alert"
              size={25}
              color={theme.colors.onBackground}
            />
            <Flex fill>
              <Text variant="bodySmall">Estás demasiado lejos del punto designado, acércate más para poder registrar tu asistencia</Text>
            </Flex>
          </HStack>
        )}
        {unavailable == true && (
          <HStack
            ph={20}
            spacing={20}
            center
          >
            <Icon
              name="alert"
              size={25}
              color={theme.colors.onBackground}
            />
            <Flex fill>
              <Text variant="bodySmall">Todavía no podemos registrar tu asistencia hasta que el encargado habilite la opción, inténtalo más tarde</Text>
            </Flex>
          </HStack>
        )}
        <HStack
          ph={20}
          spacing={20}
          center
        >
          <Icon
            name="information-outline"
            size={25}
            color={theme.colors.onBackground}
          />
          <Flex fill>
            <Text variant="bodySmall">Mantente en esta pantalla hasta que hayamos registrado tu asistencia</Text>
          </Flex>
        </HStack>
      </VStack>
    )
  }

  const Main = () => (
    <Flex
      key="Main"
      fill
    >
      {status?.granted == true ? (
        done == false ? (
          <Scanning />
        ) : (
          <InformationMessage
            icon="check-circle-outline"
            title="¡Listo!"
            description="Tu asistencia ha sido registrada"
            buttonTitle="Terminar"
            buttonIcon="page-previous-outline"
            action={async () => await navigation.pop()}
          />
        )
      ) : status?.canAskAgain == true ? (
        <InformationMessage
          icon="map-marker-question-outline"
          title="Sin permisos"
          description="La aplicación no tiene permiso para usar la ubicación del dispositivo, otorga los permisos necesarios para continuar"
          buttonTitle="Conceder permiso"
          buttonIcon="shape-outline"
          action={async () => await requestPermission()}
        />
      ) : (
        <InformationMessage
          icon="map-marker-off-outline"
          title="Sin acceso"
          description="El acceso a la ubicación está bloqueado, para poder continuar, es necesario que otorgues los permisos necesarios desde la configuración del dispositivo"
          buttonTitle="Volver a intentar"
          buttonIcon="reload"
          action={async () => await requestPermission()}
        />
      )}
    </Flex>
  )
  const Close = () => (
    <Button
      key="Close"
      icon="close"
      mode="contained"
      onPress={() => {
        getEvent()
        navigation.pop()
      }}
    >
      Cerrar
    </Button>
  )

  return (
    <CreateForm
      navigation={navigation}
      title="Asistencia por proximidad"
      children={[Main()]}
      actions={[done == false ? Close() : null]}
      disablePrevent={true}
    />
  )
}
