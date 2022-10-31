import React, { createContext, useState } from "react";

export const ModalContext = createContext({
  modalIsOpen: false,
  openModal: () => null,
  closeModal: () => null,
});

export const ModalProvider = ({ children }: any) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setTimeout(() => setIsOpen(false), 1250);
    return null;
  }

  function openModal() {
    setIsOpen(true);
    return null;
  }

  return (
    <ModalContext.Provider value={{ modalIsOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
