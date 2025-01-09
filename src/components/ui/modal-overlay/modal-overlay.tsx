import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div data-cy='modal' className={styles.overlay} onClick={onClick} />
);
