import React, { useEffect } from 'react';
import { lineSpinner } from 'ldrs';

const FormLoading: React.FC = () => {
  useEffect(() => {
    lineSpinner.register();
  }, []);

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
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="black"
        ></l-line-spinner>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
          fontSize: '24px',
          fontWeight: 500,
        }}
      >
        <p>Forms are loading...</p>
        <p
          style={{
            paddingTop: '3px',
            fontSize: '18px',
            fontWeight: 400,
            textAlign: 'center',
          }}
        >
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
};

export default FormLoading;
