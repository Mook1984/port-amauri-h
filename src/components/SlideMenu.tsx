import React, { useEffect, useRef } from 'react';
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

const baseLinkStyles = `
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

const OverlayLink = styled.a`
  ${baseLinkStyles}
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    let focusableElements: HTMLElement[] = [];
    function updateFocusable() {
      const node = overlayRef.current;
      if (!node) return;
      const found = Array.from(
        node.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'),
      ).filter(el => !el.hasAttribute('disabled'));
      focusableElements = found;
    }

    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      updateFocusable();
      // focus the close button or first focusable element
      focusableElements[0]?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }
        if (e.key === 'Tab') {
          if (focusableElements.length === 0) {
            e.preventDefault();
            return;
          }
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // restore focus
        try {
          (previouslyFocused.current as HTMLElement | null)?.focus();
        } catch (err) {
          // ignore
        }
      };
    }

    return;
  }, [isOpen, onClose]);

  // when closed, ensure internal interactive elements are not tabbable via tabIndex prop
  const tabIndexVal = isOpen ? 0 : -1;

  return (
    <Overlay ref={overlayRef} open={isOpen} role="dialog" aria-hidden={!isOpen} aria-modal={isOpen}>
      <CloseBtn onClick={onClose} aria-label="Close menu" tabIndex={tabIndexVal}>
        &times;
      </CloseBtn>
      <OverlayContent>
        <OverlayLink href="#about" onClick={onClose} tabIndex={tabIndexVal}>
          About
        </OverlayLink>
        <OverlayLink href="#portfolio" onClick={onClose} tabIndex={tabIndexVal}>
          Portfolio
        </OverlayLink>
        <OverlayLink href="#contact" onClick={onClose} tabIndex={tabIndexVal}>
          Contact
        </OverlayLink>
      </OverlayContent>
    </Overlay>
  );
}
