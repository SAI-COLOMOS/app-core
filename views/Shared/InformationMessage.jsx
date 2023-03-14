import { Flex, VStack } from '@react-native-material/core'
import React, { useState, useEffect } from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default InformationMessage = ({ icon, title, description, action, buttonIcon, buttonTitle }) => {
  const theme = useTheme()

  return (
    <VStack center spacing={20} p={30}>
      {icon ? <Icon name={icon} color={theme.colors.onBackground} size={50} /> : null}
      <VStack center>
        <Text variant="headlineSmall">{title ?? 'Titulo'}</Text>
        <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
          {description ?? 'Descripción'}
        </Text>
      </VStack>
      <Flex>
        {action ? (
          <Button icon={buttonIcon ?? ''} mode="outlined" onPress={() => action()}>
            {buttonTitle ?? 'Acción'}
          </Button>
        ) : null}
      </Flex>
    </VStack>
  )
}
