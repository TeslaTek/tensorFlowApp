import React from "react";
import { Nav } from "react-bootstrap";
import {
  MdBackHand,
  MdFaceRetouchingNatural,
  MdSportsHandball,
  MdHelpCenter,
} from "react-icons/md";
import { useLocation } from "react-router-dom";

export const ScreenTabs = () => {
  const location = useLocation();

  return (
    <Nav fill variant="tabs" defaultActiveKey={location.pathname}>
      <Nav.Item>
        <Nav.Link eventKey="/home" href="/home">
          <MdBackHand size={32} />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/face" href="/face">
          <MdFaceRetouchingNatural size={32} />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2">
          <MdSportsHandball size={32} />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled">
          <MdHelpCenter size={32} />
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
