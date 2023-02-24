import { useCallback, useEffect, useState } from "react"
import { Button, Dialog, Portal, Text } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Flex } from "@react-native-material/core";
import { useFocusEffect } from "@react-navigation/native";

export default Modal = ({title, description, icon, actions, handler, dismissable}) => {
    useFocusEffect(useCallback(() => {
        if(handler ? handler[0] : false) {
            Keyboard.dismiss()
        }

        return () => {}
    }, [handler]))

    return (
        <Portal>
            <Dialog visible={handler ? handler[0] : false} onDismiss={() => handler ? handler[1]() : null} dismissable={dismissable}>
                {
                    icon ? (
                        <Dialog.Icon size={50} icon={icon}/>
                        ) : (
                            null
                            )
                        }
                <Dialog.Title style={{textAlign: "center"}}>
                    {title}
                </Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        {description}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    {
                        actions?.length > 0 ? (
                            actions.map((action, index) => (
                                <Button key={index.toString()} onPress={() => action[1] ? action[1]() : handler[1]()}>
                                    {action[0]}
                                </Button>
                            ))
                            ) : (
                                <Button onPress={() => handler ? handler[1]() : null}>
                                Aceptar
                            </Button>
                        )
                    }
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}