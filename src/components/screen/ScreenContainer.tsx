import React from "react";
import { Switch } from "../switch/Switch";
import { ScreenTabs } from "./ScreenTabs";
import { CameraVisor, FullScreenContainer } from "./styles";

interface IScreenProps {
  children: React.ReactElement;
  switchAction: () => void;
}
export const ScreenContainer = ({ children, switchAction }: IScreenProps) => {
  return (
    <FullScreenContainer>
      <CameraVisor>
        <ScreenTabs />
        {children}
        <Switch changeSwitch={switchAction} />
      </CameraVisor>
    </FullScreenContainer>
  );
};
