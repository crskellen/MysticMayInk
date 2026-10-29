import { useEffect, useRef } from "react";

export default function PieceScreen({ open, src, alt, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="piece-screen"
      aria-label={alt || "Portfolio image"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button type="button" className="piece-screen-x" aria-label="Close" onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current">
          <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && src ? <img src={src} alt={alt} /> : null}
    </dialog>
  );
}
