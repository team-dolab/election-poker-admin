'use client';

import styles from '../game.module.css';

export default function HUDCorners() {
  return (
    <>
      <div className={`${styles.hudCorner} ${styles.topLeft}`} />
      <div className={`${styles.hudCorner} ${styles.topRight}`} />
      <div className={`${styles.hudCorner} ${styles.bottomLeft}`} />
      <div className={`${styles.hudCorner} ${styles.bottomRight}`} />
    </>
  );
}
