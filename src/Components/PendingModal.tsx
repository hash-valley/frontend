import React, { useContext } from "react";
import Modal from "react-modal";
import { PouringAnimation } from "./PouringAnimation";
import Image from "next/image";
import { ModalContext } from "../Hooks/ModalProvider";
import { getMessage } from "../Utils/constants";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "60px 80px 0px 80px",
    overflowY: "hidden",
    maxWidth: "650px",
    minWidth: "420px",
  },
};

Modal.setAppElement("#__next");

const PendingModal = () => {
  const { closeModal, modalIsOpen }: any = useContext(ModalContext);

  function onRequestClose() {
    closeModal();
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Tx Sent"
    >
      <h2
        style={{
          textAlign: "center",
          position: "relative",
          top: "-20px",
          animation: "opacityPulse .7s infinite both alternate ease-in-out",
        }}
      >
        <i>&quot;{getMessage()}&quot;</i>
      </h2>
      <div
        style={{
          display: "block",
          margin: "auto",
          textAlign: "center",
          position: "relative",
          top: "-16px",
        }}
      >
        <Image src="/vine_svgs/flourish.svg" alt="flourish" height={70} width={200} />
      </div>
      <PouringAnimation />
    </Modal>
  );
};

export default PendingModal;
