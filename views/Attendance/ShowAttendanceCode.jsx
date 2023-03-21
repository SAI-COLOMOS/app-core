import { Flex, HStack, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Pressable, ScrollView, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, Button, Text, useTheme } from 'react-native-paper'
import Code from 'react-native-qrcode-svg'

export default ShowAttendanceCode = ({ navigation, route }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const { register, avatar } = route.params

  return (
    <Flex fill>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={{ width: '100%', height: '100%' }}>
        <Flex fill style={{ backgroundColor: theme.colors.backdrop }} justify="end">
          <Pressable
            android_ripple={false}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            onPress={() => {
              // if (!loading) {
              navigation.pop()
              // }
            }}
          >
            <Flex fill />
          </Pressable>

          <Flex
            maxH={'90%'}
            pb={insets.bottom}
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              overflow: 'hidden'
            }}
          >
            <ScrollView>
              <Flex p={25} items="center">
                <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
                  Tomar asistencia
                </Text>
              </Flex>

              <VStack pr={25} pl={25} pb={50} spacing={30}>
                <Flex center w={300} h={300} style={{ borderRadius: 50, overflow: 'hidden', alignSelf: 'center', backgroundColor: theme.colors.onBackground }}>
                  {avatar ? <Image source={{ uri: `data:image/png;base64,${avatar}` }} style={{ width: '100%', height: '100%', position: 'absolute' }} blurRadius={5} /> : null}
                  <Code value={register} size={300} backgroundColor={theme.colors.code} color={theme.colors.background} quietZone={50} />
                </Flex>
              </VStack>
            </ScrollView>

            <HStack justify="between" reverse={true} pv={20} ph={20}>
              <Button mode="contained" icon="close" onPress={() => navigation.pop()}>
                Salir
              </Button>
              <Button mode="outlined" disabled={true} icon="human-greeting-proximity">
                Tomar por proximidad
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}
