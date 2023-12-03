import React from 'react';
import styles from '../styles/Home.module.css';

const FormLoading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '144px',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={styles.loader}></div>
      </div>
      <div>
        <p style={{ paddingTop: '20px', fontSize: '24px', fontWeight: 500 }}>
          Forms are loading...
        </p>
        <p style={{ paddingTop: '3px', fontSize: '18px', fontWeight: 400 }}>
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default FormLoading;
