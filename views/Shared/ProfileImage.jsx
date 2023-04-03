import { Flex } from "@react-native-material/core"
import { Image } from "react-native"
import { useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default ProfileImage = ({ image, height, width }) => {
  const theme = useTheme()

  return (
    <Flex
      h={height ?? 75}
      w={width ?? 75}
      center
      style={{ backgroundColor: theme.colors.primary, borderRadius: 10, overflow: "hidden" }}
    >
      {image ? (
        <Image
          source={{ uri: `data:image/png;base64,${image}` }}
          resizeMode="cover"
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        <Icon
          name="account"
          color={theme.colors.onPrimary}
          size={50}
        />
      )}
    </Flex>
  )
}
