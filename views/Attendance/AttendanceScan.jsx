import { Flex, HStack, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Pressable, ScrollView, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, useTheme } from 'react-native-paper'
import { Camera, CameraType } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import InformationMessage from '../Shared/InformationMessage'

export default AttendanceScan = ({ navigation, route }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  const [codeScanned, setCodeScanned] = useState(false)
  const [cameraPermissions, requestCameraPermission] = Camera.useCameraPermissions()

  if (!cameraPermissions) {
  }

  if (!cameraPermissions?.granted) {
  }

  function onCodeScanned({ type, data }) {
    setCodeScanned(true)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  useEffect(() => {
    console.log(cameraPermissions)
  }, [cameraPermissions])

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
                  Escaneo de asistencias
                </Text>
              </Flex>

              {cameraPermissions?.granted ? (
                <VStack pr={25} pl={25} pb={50} spacing={30}>
                  <Flex fill items="center" style={{borderRadius: 50}}>
                    {/* <Flex fill> */}
                      <Camera ratio="16:9" style={{ width: '100%', height: '100%', position: 'absolute' }} type={CameraType.back} barCodeScannerSettings={{ barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr] }} onBarCodeScanned={codeScanned ? undefined : onCodeScanned}></Camera>
                    {/* </Flex> */}
                  </Flex>
                </VStack>
              ) : (
                <Flex fill>
                  <InformationMessage icon="camera-off-outline" title="Sin acceso" description="La aplicación no tiene acceso a la cámara, por lo que no puedes utilizar esta función. Concede los permisos desde la configuración del teléfono." action={() => Camera.requestCameraPermissionsAsync()} buttonTitle="Conceder permiso" buttonIcon="camera-plus-outline" />
                </Flex>
              )}
            </ScrollView>

            <HStack justify="between" reverse={true} pv={20} ph={20}></HStack>
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}
