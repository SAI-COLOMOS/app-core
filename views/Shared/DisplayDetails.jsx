import { Flex, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { Avatar, Card, Text } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements";

export default SchoolDetails = ({icon, title, children}) => {
    const headerMargin = useHeaderHeight()

    return (
        <Flex fill>
                <VStack spacing={20} pt={30} pb={50} ph={20}>
                    <Flex fill center>
                        <Avatar.Icon icon={icon} size={100}/>
                    </Flex>

                    <Text variant="headlineSmall" style={{textAlign: "center"}}>
                        {title}
                    </Text>

                    {
                        children?.length > 0 ? (
                            children.map(child => (
                                <Card mode="contained" children={child}/>
                            ))
                        ) : (
                            null
                        )
                    }

                </VStack>
        </Flex>
    )
}