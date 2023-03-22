import { IconButton, Text, useTheme } from 'react-native-paper'
import { Flex, HStack } from '@react-native-material/core'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default Header = ({ options, navigation, children }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  return (
    <Flex>
      <Flex pt={insets.top} style={{ backgroundColor: theme.colors.elevation.level5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
        <HStack p={10} justify="between" items="center">
          <HStack items="center" spacing={10}>
            <IconButton
              icon="arrow-left"
              onPress={(_) => {
                navigation.pop()
              }}
            />
            <Text variant="headlineSmall" numberOfLines={1}>
              {options.headerTitle}
            </Text>
          </HStack>

          <HStack>{children?.length > 0 ? children.map((child, index) => child) : null}</HStack>
        </HStack>
      </Flex>
    </Flex>
  )
}
