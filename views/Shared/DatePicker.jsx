import { useCallback, useEffect, useState } from "react"
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Flex } from "@react-native-material/core"
import { useFocusEffect } from "@react-navigation/native"

import { DatePickerModalContent } from "react-native-paper-dates"
import { es, registerTranslation } from "react-native-paper-dates"
registerTranslation("es", es)

export default DatePicker = ({ handler, date, setDate }) => {
  const theme = useTheme()
  useFocusEffect(
    useCallback(() => {
      if (handler ? handler[0] : false) {
        Keyboard.dismiss()
      }

      return () => {}
    }, [handler])
  )

  return (
    <Portal>
      <Dialog
        visible={handler ? handler[0] : false}
        onDismiss={() => (handler ? handler[1]() : null)}
        //style={{ backgroundColor: theme.colors.primary }}
      >
        <Dialog.Content>
          <Flex
            w={"100%"}
            h={"100%"}
          >
            <DatePickerModalContent
              locale="es"
              mode="single"
              visible={true}
              onDismiss={() => handler[1]()}
              date={date}
              onConfirm={(data) => {
                setDate(data.date)
                handler[1]()
              }}
              // validRange={{
              //   startDate: new Date(2021, 1, 2),  // optional
              //   endDate: new Date(), // optional
              //   disabledDates: [new Date()] // optional
              // }}
              // onChange={} // same props as onConfirm but triggered without confirmed by user
              // saveLabel="Save" // optional
              // saveLabelDisabled={true} // optional, default is false
              uppercase={false} // optional, default is true
              // label="Select date" // optional
              // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
              startYear={2020} // optional, default is 1800
              //endYear={Number(new Date().getFullYear) + 5} // optional, default is 2200
            />
          </Flex>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}
