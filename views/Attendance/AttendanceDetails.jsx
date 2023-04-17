import { Flex, Spacer, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { Image, useWindowDimensions, ScrollView } from "react-native"
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import QRCode from "react-native-qrcode-svg"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import ApplicationContext from "../ApplicationContext"

export default AttendanceDetails = ({ navigation, route }) => {
  const { width } = useWindowDimensions()
  const theme = useTheme()
  const { host } = useContext(ApplicationContext)
  const headerMargin = useHeaderHeight()
  const { actualUser, token } = route.params

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(undefined)

  async function getProfile() {
    setLoading(true)

    const request = await fetch(`${host}/profile/${actualUser.register}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch((_) => null)

    setLoading(false)

    if (request?.user) {
      setProfile(request.user)
    } else {
      setProfile(request)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getProfile()

      return () => {}
    }, [])
  )

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Tomar asistencia"
    })
  }, [])

  return (
    <Flex
      fill
      mt={headerMargin - 20}
    >
      {profile?.avatar ? (
        <Flex
          w={"100%"}
          h={width}
          style={{ position: "absolute" }}
        >
          <Image
            source={{ uri: `data:image/png;base64,${profile?.avatar}` }}
            style={{ width: "100%", height: "100%" }}
            blurRadius={5}
          />
          <LinearGradient
            colors={[theme.colors.cover, theme.colors.background]}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          />
        </Flex>
      ) : null}

      {/* <ScrollView> */}
      <VStack
        fill
        ph={20}
        pv={50}
      >
        <ScrollView>
          <VStack spacing={20}>
            <Flex
              self="center"
              w={150}
              h={150}
              style={{ borderRadius: 125, overflow: "hidden" }}
              center
            >
              {profile?.avatar ? (
                <Avatar.Image
                  source={{ uri: `data:image/png;base64,${profile?.avatar}` }}
                  size={150}
                  style={{ position: "absolute" }}
                />
              ) : (
                <Avatar.Icon
                  icon="account-circle-outline"
                  size={150}
                  style={{ position: "absolute" }}
                />
              )}
              <QRCode
                value={profile?.register}
                backgroundColor={theme.colors.cover}
                color={theme.colors.onBackground}
                quietZone={50}
                size={150}
              />
            </Flex>

            <Flex>
              <Text
                variant="headlineSmall"
                style={{ textAlign: "center" }}
              >
                {profile?.register}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ textAlign: "center" }}
              >
                {`${profile?.first_name} ${profile?.first_last_name} ${profile?.second_last_name ?? ""}`}
              </Text>
            </Flex>

            <Card mode="outlined">
              <VStack
                p={20}
                spacing={5}
              >
                <Text variant="titleMedium">Estado de la asistencia</Text>
                <VStack spacing={10}>
                  <Flex>
                    <Text variant="labelSmall">Asistencia</Text>
                    <Text variant="bodyMedium">Sin asistencia registrada</Text>
                  </Flex>
                </VStack>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>

        <Button
          mode="contained"
          icon="human-greeting-proximity"
          onPress={() => {
            navigation.navigate("AttendanceProximityClient", {
              avatar: profile?.avatar
            })
          }}
        >
          Asistencia por proximidad
        </Button>
      </VStack>
      {/* </ScrollView> */}
    </Flex>
  )
}
