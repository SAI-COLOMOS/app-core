import { Flex, HStack, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Pressable, ScrollView, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, Button, IconButton, Text, useTheme } from 'react-native-paper'
import Animated, { useSharedValue, Easing, useAnimatedStyle, withTiming, withSpring, withRepeat, withSequence } from 'react-native-reanimated'
/*import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
*/
export default AttendanceProximityClient = ({ navigation, route }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { avatar } = route.params

  useEffect(() => {
    try {
      BleManager.start({showAlert: false}).then(() => console.log("Si jala"))
    } catch (error) {
      console.log("Error:", error)
    }
  }, [])

  const UserAvatar = () => {
    const scaleValue = useSharedValue(1)
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withRepeat(
              withSequence(
                withSpring(scaleValue.value, {
                  damping: 5,
                  stiffness: 10
                }),
                withSpring(scaleValue.value * 1.2, {
                  damping: 5,
                  stiffness: 10
                })
              ),
              0,
              true
            )
          }
        ]
      }
    })

    return (
      <Flex h={120} w={'100%'} center>
        <Animated.View style={[{ width: 100, height: 100, backgroundColor: '#aa00ff', borderRadius: 50 }, animatedStyle]}></Animated.View>
        {avatar ? <Avatar.Image source={{ uri: `data:image/png;base64,${avatar}` }} size={100} style={{ position: 'absolute' }} /> : <Avatar.Icon icon="account-circle-outline" size={100} style={{ position: 'absolute' }} />}

      </Flex>
    )
  }

  return (
    <Flex fill>
      {/* <StatusBar hidden={true} /> */}
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
                  Asistencia por proximidad
                </Text>
              </Flex>

              <VStack>
                <UserAvatar />
              </VStack>
            </ScrollView>

            <HStack justify="between" reverse={true} pv={20} ph={20}>
              <Button
                mode="contained"
                icon="close"
                onPress={() => {
                  navigation.pop()
                }}
              >
                Cerrar
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}
