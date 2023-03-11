import { Flex, VStack, HStack } from '@react-native-material/core'
import { ScrollView, KeyboardAvoidingView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, TouchableRipple, useTheme } from 'react-native-paper'
import { useEffect } from 'react'

export default CreateForm = ({
  navigation,
  route,
  loading,
  title,
  children,
  actions
}) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        console.log('Hola', loading)

        e.preventDefault()

        if (loading) {
          return
        } else {
          navigation.dispatch(e.data.action)
        }
      }),
    [navigation, loading]
  )

  return (
    <Flex fill>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={{ width: '100%', height: '100%' }}
      >
        <Flex
          fill
          style={{ backgroundColor: theme.colors.backdrop }}
          justify="end"
        >
          <TouchableRipple
            android_ripple={false}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            onPress={() => {
              if (!loading) {
                navigation.pop()
              }
            }}
          >
            <Flex fill />
          </TouchableRipple>

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
                  {title}
                </Text>
              </Flex>

              <VStack pr={25} pl={25} pb={50} spacing={30}>
                {children.map((child, index) => (
                  <Flex key={`child: ${index.toString()}`}>{child}</Flex>
                ))}
              </VStack>
            </ScrollView>

            <HStack justify="between" reverse={true} pv={20} ph={20}>
              {actions.map((action, index) => (
                <Flex key={`action ${index.toString()}`}>{action}</Flex>
              ))}
            </HStack>
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}
