import React from "react"
import { Button, Card, Text, TouchableRipple, useTheme } from "react-native-paper"
import * as ImagePicker from "expo-image-picker"
import { manipulateAsync } from "expo-image-manipulator"
import { Flex, HStack, VStack } from "@react-native-material/core"
import { Image } from "expo-image"
import ProfileImage from "./ProfileImage"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default ImageSelector = ({ value, setter, type }) => {
  const theme = useTheme()

  async function selectFromLibrary() {
    let selectedPhoto = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: { rectangular: [4, 3], square: [1, 1] }[type],
      quality: 0.7
    })

    if (!selectedPhoto.canceled) {
      imageManipulation(selectedPhoto)
    }
  }

  async function takePhoto() {
    let takenPhoto = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: { rectangular: [4, 3], square: [1, 1] }[type],
      quality: 0.7
    })

    if (!takenPhoto.canceled) {
      imageManipulation(takenPhoto)
    }
  }

  async function imageManipulation(image) {
    const compressPhoto = await manipulateAsync(image.assets[0].uri, [{ resize: { height: { rectangular: 768, square: 250 }[type], width: { rectangular: 1024, square: 250 }[type] } }], { base64: true })
    setter(compressPhoto.base64)
  }

  return (
    <Flex
      fill
      // p={20}
    >
      {value ? (
        <VStack spacing={20}>
          <Flex items="center">
            {
              {
                square: (
                  <ProfileImage
                    image={value}
                    width={150}
                    height={150}
                  />
                ),
                rectangular: (
                  <Image
                    source={{ uri: `data:image/png;base64,${value}` }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    style={{ height: 200, width: "100%", borderRadius: 10 }}
                  />
                )
              }[type]
            }
          </Flex>

          <Button
            mode="contained"
            icon="camera-outline"
            onPress={() => {
              takePhoto()
            }}
          >
            Tomar otra fotografía
          </Button>

          <Button
            mode="contained"
            icon="image-outline"
            onPress={() => {
              selectFromLibrary()
            }}
          >
            Seleccionar otra imagen
          </Button>

          <Button
            mode="outlined"
            icon="file-image-remove-outline"
            onPress={() => {
              setter(null)
            }}
          >
            Eliminar fotografía
          </Button>
        </VStack>
      ) : (
        <HStack
          fill
          justify="between"
          pv={10}
          // spacing={20}
        >
          <VStack
            w={"48%"}
            h={100}
          >
            <Card
              mode="outlined"
              style={{ overflow: "hidden" }}
            >
              <TouchableRipple onPress={() => takePhoto()}>
                <Flex
                  w={"100%"}
                  h={"100%"}
                  center
                >
                  <Icon
                    name="camera-outline"
                    color={theme.colors.onBackground}
                    size={50}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ textAlign: "center" }}
                  >
                    Tomar fotografía
                  </Text>
                </Flex>
              </TouchableRipple>
            </Card>
          </VStack>

          <VStack
            w={"48%"}
            h={100}
          >
            <Card
              mode="contained"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <TouchableRipple
                style={{ overflow: "hidden" }}
                onPress={() => selectFromLibrary()}
              >
                <Flex
                  w={"100%"}
                  h={"100%"}
                  center
                >
                  <Icon
                    name="image-outline"
                    color={theme.colors.onPrimary}
                    size={50}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onPrimary, textAlign: "center" }}
                  >
                    Seleccionar imagen
                  </Text>
                </Flex>
              </TouchableRipple>
            </Card>
          </VStack>

          {/* <Button
            mode="contained"
            icon="camera-outline"
            onPress={() => {
              takePhoto()
            }}
          >
            Tomar fotografía
          </Button> */}

          {/* <Button
            mode="outlined"
            icon="image-outline"
            onPress={() => {
              selectFromLibrary()
            }}
          >
            Seleccionar imagen
          </Button> */}
        </HStack>
      )}
    </Flex>
  )
}
