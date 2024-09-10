import React from 'react';
import styles from '../styles/Home.module.css';

/**
 * @returns Loading component to display when forms are loading
 */
const FormLoading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '144px',
      }}
    >
      <div className={styles.loader}></div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '24px', fontWeight: 500 }}>
          Forms are loading...
        </p>
        <p style={{ fontSize: '18px', fontWeight: 400 }}>
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default FormLoading;
