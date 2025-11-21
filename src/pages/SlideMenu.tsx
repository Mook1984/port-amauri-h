import React from 'react';
import styled from 'styled-components';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Overlay = styled.div<{ open: boolean }>`
  height: 100%;
  width: ${p => (p.open ? '100%' : '0')};
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  overflow-x: hidden;
  transition: width 0.5s;
`;

const OverlayContent = styled.div`
  position: relative;
  top: 25%;
  width: 100%;
  text-align: center;
  margin-top: 30px;
`;

const OverlayLink = styled.a`
  padding: 8px;
  text-decoration: none;
  font-size: 36px;
  color: #818181;
  display: block;
  transition: 0.3s;
  &:hover,
  &:focus {
    color: #f1f1f1;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 45px;
  font-size: 60px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
`;

export default function SlideMenu({ isOpen, onClose }: Props) {
  return (
    <Overlay open={isOpen} role="dialog" aria-hidden={!isOpen}>
      <CloseBtn onClick={onClose} aria-label="Close menu">
        &times;
      </CloseBtn>
      <OverlayContent>
        <OverlayLink href="/#about" onClick={onClose}>
          About
        </OverlayLink>
        <OverlayLink href="/#portfolio" onClick={onClose}>
          Portfolio
        </OverlayLink>
        <OverlayLink href="/#contact" onClick={onClose}>
          Contact
        </OverlayLink>
      </OverlayContent>
    </Overlay>
  );
}
