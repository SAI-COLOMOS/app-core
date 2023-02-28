import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Button, Dialog, Portal, Text } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Flex } from "@react-native-material/core";
import { useFocusEffect } from "@react-navigation/native";

/*
    Example

    const [modalLoading, setModalLoading] = useState(false)

    <ModalLoading handler={[modalLoading, () => setModalLoading(!modalLoading)]} dismissable={false}/>

*/

export default ModalLoading = ({handler}) => {
    useFocusEffect(useCallback(() => {
        if(handler ? handler[0] : false) {
            Keyboard.dismiss()
        }

        return () => {}
    }, [handler]))

    return (
        <Portal>
            <Dialog visible={handler ? handler[0] : false} onDismiss={() => handler ? handler[1]() : null} dismissable={false}>
                <Dialog.Content>
                    <ActivityIndicator size={80} animating={true}/>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}