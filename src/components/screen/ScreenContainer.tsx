import React from 'react'
import { FullScreenContainer } from './styles'

interface ScreenProps {
    children: React.ReactElement;
}
export const ScreenContainer = ({children}: ScreenProps) => {
  return (
    <FullScreenContainer>
        {children}
    </FullScreenContainer>
  )
}
