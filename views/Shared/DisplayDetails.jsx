import { Flex, VStack } from "@react-native-material/core"
import { KeyboardAvoidingView, RefreshControl, ScrollView, useWindowDimensions } from "react-native"
import { Image } from "expo-image"
import { Avatar, Card, Text, useTheme } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { useEffect } from "react"
import ProfileImage from "./ProfileImage"

export default SchoolDetails = ({ icon, image, title, children, actions, avatar, showHeader, refreshStatus, refreshAction }) => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ height: "100%", justifyContent: "flex-end" }}
    >
      <Flex fill>
        {avatar && (
          <Animated.View style={[{}, animationStyle]}>
            <Flex
              w={"100%"}
              h={width}
              style={{ position: "absolute" }}
            >
              <Image
                source={{ uri: `data:image/png;base64,${avatar}` }}
                style={{ width: "100%", height: "100%" }}
                cachePolicy="memory-disk"
                blurRadius={5}
              />
              <LinearGradient
                colors={[theme.colors.cover, theme.colors.background]}
                style={{ width: "100%", height: "100%", position: "absolute" }}
              />
            </Flex>
          </Animated.View>
        )}

        {image && (
          <Animated.View style={[{}, animationStyle]}>
            <Flex
              w={"100%"}
              h={275}
              style={{ position: "absolute" }}
            >
              <Image
                source={{ uri: `data:image/png;base64,${image}` }}
                contentFit="cover"
                cachePolicy="memory-disk"
                style={{ width: "100%", height: "100%" }}
              />
              <LinearGradient
                colors={["transparent", theme.colors.background]}
                locations={[0.5, 1]}
                style={{ width: "100%", height: "100%", position: "absolute" }}
              />
            </Flex>
          </Animated.View>
        )}

        <ScrollView
          refreshControl={
            refreshAction !== undefined &&
            refreshStatus !== undefined && (
              <RefreshControl
                refreshing={refreshStatus}
                onRefresh={() => refreshAction()}
              />
            )
          }
          onScroll={(event) => (offSet.value = event.nativeEvent.contentOffset.y * -0.5)}
          scrollEventThrottle={8}
        >
          <VStack
            spacing={20}
            pt={40}
            pb={100}
            ph={20}
          >
            {showHeader != false && (
              <Flex
                fill
                // center
              >
                {image && <Flex h={200} />}

                {image == undefined && (
                  <ProfileImage
                    image={avatar}
                    icon={icon}
                    width={150}
                    height={150}
                    // loading={avatar === undefined && image === undefined}
                  />
                )}
              </Flex>
            )}

            {showHeader != false && (
              <Text
                variant="headlineSmall"
                // style={{ textAlign: "center" }}
              >
                {title}
              </Text>
            )}

            <VStack spacing={20}>{children?.length > 0 ? children.map((child, index) => <Flex key={`Item ${index}`}>{child}</Flex>) : null}</VStack>

            <VStack spacing={20}>{actions?.length > 0 ? actions.map((action, index) => <Flex key={`Action ${index}`}>{action}</Flex>) : null}</VStack>
          </VStack>
        </ScrollView>
      </Flex>
    </KeyboardAvoidingView>
  )
}
