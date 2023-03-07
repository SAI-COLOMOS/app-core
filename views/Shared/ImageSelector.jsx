import React, { useState, useEffect } from 'react'
import { Avatar, Button } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator'
import { Flex, HStack, VStack } from '@react-native-material/core'

export default ImageSelector = ({value, setter}) => {
    async function selectFromLibrary() {
        let selectedPhoto = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if(!selectedPhoto.canceled) {
            imageManipulation(selectedPhoto)
        }
    }

    async function takePhoto() {
        let takenPhoto = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if(!takenPhoto.canceled) {
            imageManipulation(takenPhoto)
        }
    }

    async function imageManipulation(image) {
        const compressPhoto = await manipulateAsync(
            image.assets[0].uri,
            [{resize: {height: 250, width: 250}}],
            {base64: true}
        )
        console.log(compressPhoto)
        setter(compressPhoto.base64)
    }


    return (
        <Flex fill>
            {
                value ? (
                    <VStack spacing={20}>
                        <Flex items='center'>
                            <Avatar.Image source={{uri: `data:image/png;base64,${value}`}} size={150}/>
                        </Flex>

                        <Button mode='contained' icon='camera-outline' onPress={() => {
                            takePhoto()
                        }}>
                            Tomar otra fotografía
                        </Button>

                        <Button mode='contained' icon='image-outline' onPress={() => {
                            selectFromLibrary()
                        }}>
                            Seleccionar otra imágen
                        </Button>

                        <Button mode='outlined' icon='file-image-remove-outline' onPress={() => {
                            setter(null)
                        }}>
                            Eliminar fotografía
                        </Button>
                    </VStack>
                ) : (
                    <VStack spacing={20}>
                        <Button mode='contained' icon='camera-outline' onPress={() => {
                            takePhoto()
                        }}>
                            Tomar fotografía
                        </Button>

                        <Button mode='outlined' icon='image-outline' onPress={() => {
                            selectFromLibrary()
                        }}>
                            Seleccionar imágen
                        </Button>
                    </VStack>
                )
            }
        </Flex>
    )
}