import React from "react";
import { ScreenTabs } from "./ScreenTabs";
import { CameraVisor, FullScreenContainer } from "./styles";

interface ScreenProps {
  children: React.ReactElement;
}
export const ScreenContainer = ({ children }: ScreenProps) => {
  return (
    <FullScreenContainer>
      <CameraVisor>
        <ScreenTabs />
        {children}
      </CameraVisor>
    </FullScreenContainer>
  );
};
