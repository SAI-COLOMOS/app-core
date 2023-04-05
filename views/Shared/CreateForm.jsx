import { Flex, VStack, HStack } from "@react-native-material/core"
import { ScrollView, KeyboardAvoidingView, Pressable, RefreshControl } from "react-native"
import { useSafeAreaInsets, useSafeAreaFrame } from "react-native-safe-area-context"
import { Text, TouchableRipple, useTheme } from "react-native-paper"
import { useEffect } from "react"

export default CreateForm = ({ navigation, route, loading, title, children, actions, refreshingStatus, refreshingAction }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
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
    <Flex
      fill
      justify="end"
      style={{ backgroundColor: theme.colors.backdrop }}
    >
      <Pressable
        android_ripple={false}
        style={{ width: "100%", height: "100%", position: "absolute" }}
        onPress={() => {
          if (!loading) {
            navigation.pop()
          }
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ maxHeight: "80%", justifyContent: "flex-end" }}
      >
        <Flex
          //fill
          //maxH={"90%"}
          // pb={insets.bottom}
          style={{
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            overflow: "hidden"
          }}
        >
          <ScrollView
            refreshControl={
              refreshingAction &&
              refreshingStatus && (
                <RefreshControl
                  refreshing={true}
                  onRefresh={() => refreshingAction()}
                />
              )
            }
          >
            <Flex
              p={25}
              items="center"
            >
              <Text
                variant="headlineMedium"
                style={{ textAlign: "center" }}
              >
                {title}
              </Text>
            </Flex>

            <VStack
              pr={25}
              pl={25}
              pb={50}
              spacing={30}
            >
              {children?.map((child, index) => (
                <Flex key={`Item ${index}`}>{child}</Flex>
              ))}
            </VStack>
          </ScrollView>
          <HStack
            justify="between"
            reverse={true}
            pv={20}
            ph={20}
          >
            {actions?.map((action, index) => (
              <Flex key={`Action ${index}`}>{action}</Flex>
            ))}
          </HStack>
        </Flex>
      </KeyboardAvoidingView>
    </Flex>
  )
}
