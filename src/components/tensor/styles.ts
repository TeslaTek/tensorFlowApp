import styled from "styled-components";

export const FullParentContainer = styled.div<{
  parentW: string;
  parentH: string;
}>`
  width: ${(props) => props.parentW};
  height: ${(props) => props.parentH};
  background-color: transparent;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;

export const GesturePoint = styled.div<{ pointX: string; pointY: string }>`
  position: absolute;
  border: 1px solid #000000;
  border-radius: 10px;
  width: 10px;
  height: 10px;
  background-color: #00d800;
  ${(props) => `right: ${props.pointX}; top: ${props.pointY}`};
`;

export const StyledCanvas = styled.canvas<{
  parentW: string;
  parentH: string;
}>`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 10;
  width: ${(props) => props.parentW};
  height: ${(props) => props.parentH};
  transform: scaleX(-1);
`;
