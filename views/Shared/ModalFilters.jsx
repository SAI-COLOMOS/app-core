import { Button, Dialog } from "react-native-paper"
import { ScrollView } from "react-native"
import { HStack } from "@react-native-material/core"

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
        <ScrollView style={{ maxHeight: 350 }}>{child}</ScrollView>
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
