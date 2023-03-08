import { useCallback, useEffect, useState } from "react"
import { Button, Dialog, Portal, Text } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Flex, VStack } from "@react-native-material/core";
import { useFocusEffect } from "@react-navigation/native";

/**
    Example

    const [modalConfrim, setModalConfrim] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)
    const [reponseCode, setReponseCode] = useState("")

    <ModalMessage title="Actualizar contraseña" description="¿Seguro que desea actualizar su contraseña?" handler={[modalConfrim, () => setModalConfrim(!modalConfrim)]} actions={[['Aceptar', () => changePassword()], ['Cancelar', () => setModalConfrim(!modalConfrim)]]} dismissable={true} icon="help-circle-outline"/>

    <ModalMessage title="¡Listo!" description="La contraseña ha sido actualizada, ahora puedes acceder a la aplicación" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.replace("Dashboard")]]} dismissable={false} icon="check-circle-outline"/>

    <ModalMessage title="Ocurrió un problema" description={`No pudimos actualizar tu contraseña, intentalo más tarde. (${reponseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline"/>

    <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert"/>

 */

export default Modal = ({title, handler, children}) => {
    useFocusEffect(useCallback(() => {
        if(handler ? handler[0] : false) {
            Keyboard.dismiss()
        }

        return () => {}
    }, [handler]))

    return (
        <Portal>
            <Dialog visible={handler ? handler[0] : false} onDismiss={() => handler ? handler[1]() : null}>
                <Dialog.Title style={{textAlign: "center"}}>
                    {title}
                </Dialog.Title>
                <Dialog.Content>
                    <Flex>
                        {
                            children
                        }
                    </Flex>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => handler ? handler[1]() : null}>
                        Aceptar
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}