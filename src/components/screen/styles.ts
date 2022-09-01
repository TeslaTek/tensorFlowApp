import styled from "styled-components";

export const FullScreenContainer = styled.main`
    width: 100vw;
    height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #ffffff;
`;

export const CameraVisor = styled.div`
    width: 500px;
    height: 550px;
    border: none;
    background-color: transparent;
    padding: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;