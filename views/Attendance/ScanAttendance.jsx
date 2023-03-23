import { Flex, HStack, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Pressable, ScrollView, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, useTheme } from 'react-native-paper'
import { Camera, CameraType } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import InformationMessage from '../Shared/InformationMessage'
import CreateForm from '../Shared/CreateForm'

export default ScanAttendance = ({ navigation, route }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

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

  const ScanCamera = () => (
    <Flex key="ScanCamera" center style={{ borderRadius: 50, width: 300, height: 300, overflow: 'hidden', alignSelf: 'center' }}>
      <Camera ratio="4:3" style={{ width: 300, height: (300 * 4) / 3, position: 'absolute' }} type={CameraType.back} barCodeScannerSettings={{ barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr] }} onBarCodeScanned={codeScanned ? undefined : onCodeScanned}></Camera>
    </Flex>
  )

  const Close = () => (
    <Button key="CloseButton" icon="close" mode="contained" onPress={() => navigation.pop()}>
      Cerrar
    </Button>
  )

  return (
    <Flex fill>
      <CreateForm actions={[Close()]} title="Escaneo de asistencia" navigation={navigation} loading={false} children={[ScanCamera()]} />
    </Flex>
  )
}
