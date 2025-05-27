import { useEffect } from "react";

interface ModalType {
  children: React.ReactNode;
  closeModal: () => void;
  openModal: () => void;
}

export function Modals({
  children,
  ref,
  handleCloseModal,
}: {
  children: React.ReactNode;
  ref: React.RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
}) {
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLDialogElement;

    if (target.nodeName === "DIALOG") {
      handleCloseModal();
    }
  };
  return (
    <dialog
      ref={ref}
      role="dialog"
      className="[transform:translate(calc(100vw-60vw),40vh)]"
      onClick={handleDialogClick}
    >
      {children}
      <button onClick={handleCloseModal}>Close modal</button>
    </dialog>
  );
}
