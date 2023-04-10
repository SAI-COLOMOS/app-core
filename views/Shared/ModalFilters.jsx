import { useCallback, useEffect, useState } from "react"
import { Button, Card, Dialog, Modal, Portal, Text } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native"
import { Flex, HStack, Spacer, VStack } from "@react-native-material/core"
import { useFocusEffect } from "@react-navigation/native"
import Dropdown from "./Dropdown"

export default ModalFilters = ({ handler, child, action }) => {
  return (
    <Dialog
      visible={handler[0]}
      onDismiss={() => {
        handler[1]()
        action()
      }}
    >
      <Dialog.Title style={{ textAlign: "center" }}>Filtros de búsqueda</Dialog.Title>

      <Dialog.Content>
        <ScrollView>
          {/* <Card mode="outlined"> */}
          {child}
          {/* </Card> */}
        </ScrollView>
      </Dialog.Content>

      <Dialog.Actions>
        <HStack
          fill
          reverse={true}
        >
          <Button
            mode="contained"
            icon="close"
            onPress={() => {
              handler[1]()
              action()
            }}
          >
            Cerrar
          </Button>
        </HStack>
      </Dialog.Actions>
    </Dialog>
  )
}
