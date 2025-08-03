import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PopupMsg from '../components/shared/PopupMsg';

let popupRoot = null;
let currentCallback = null;
let root = null;

export const showAuthPopup = (message, callback) => {
  if (!popupRoot) {
    popupRoot = document.createElement('div');
    popupRoot.id = 'auth-popup-root';
    document.body.appendChild(popupRoot);
    root = createRoot(popupRoot);
  }

  currentCallback = callback;

  const PopupWrapper = () => {
    const [show, setShow] = useState(true);

    const handleConfirm = () => {
      setShow(false);
      if (currentCallback) {
        currentCallback();
        currentCallback = null;
      }
      root.unmount();
    };

    return (
      <PopupMsg
        text={message}
        show={show}
        closeAlert={handleConfirm}
        onConfirm={handleConfirm}
      />
    );
  };

  root.render(<PopupWrapper />);
};