import { Flex, VStack } from "@react-native-material/core"
import { Image, RefreshControl, ScrollView, useWindowDimensions } from "react-native"
import { Avatar, Card, Text, useTheme } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"

export default SchoolDetails = ({ icon, title, children, actions, photo, showHeader, refreshStatus, refreshAction }) => {
  const { width } = useWindowDimensions()
  const theme = useTheme()

  const offSet = useSharedValue(0)
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: offSet.value <= 0 ? offSet.value : 0 //interpolate(offSet.value, [-500, 0, 500], [-500, 0, 500])
        }
      ]
    }
  })

  return (
    <Flex fill>
      {photo ? (
        <Animated.View style={[{}, animationStyle]}>
          <Flex w={"100%"} h={width} style={{ position: "absolute" }}>
            <Image source={{ uri: `data:image/png;base64,${photo}` }} style={{ width: "100%", height: "100%" }} blurRadius={5} />
            <LinearGradient colors={[theme.colors.cover, theme.colors.background]} style={{ width: "100%", height: "100%", position: "absolute" }} />
          </Flex>
        </Animated.View>
      ) : null}

      <ScrollView refreshControl={refreshAction !== undefined && refreshStatus !== undefined && <RefreshControl refreshing={refreshStatus} onRefresh={() => refreshAction()} />} onScroll={(event) => (offSet.value = event.nativeEvent.contentOffset.y * -0.5)} scrollEventThrottle={16}>
        <VStack spacing={20} pt={50} pb={100} ph={20}>
          {showHeader ?? (
            <Flex fill center>
              {photo ? <Avatar.Image source={{ uri: `data:image/png;base64,${photo}` }} size={150} /> : <Avatar.Icon icon={icon} size={150} />}
            </Flex>
          )}

          {showHeader ?? (
            <Text variant="headlineSmall" style={{ textAlign: "center" }}>
              {title}
            </Text>
          )}

          <VStack spacing={20}>{children?.length > 0 ? children.map((child, index) => <Flex key={`Item ${index}`}>{child}</Flex>) : null}</VStack>

          <VStack spacing={20}>{actions?.length > 0 ? actions.map((action, index) => <Flex key={`Action ${index}`}>{action}</Flex>) : null}</VStack>
        </VStack>
      </ScrollView>
    </Flex>
  )
}
