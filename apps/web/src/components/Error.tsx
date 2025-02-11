import React from 'react';
import { ErrorIcon } from 'apps/web/src/static/icons.tsx';

/**
 * @returns an error message when the page fails to load the forms
 */
const Error: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '144px' }}>
      <ErrorIcon width="44px" height="44px" />
      <div>
        <p style={{ paddingTop: '20px', fontSize: '24px', fontWeight: 500 }}>
          Oops! Something went wrong.
        </p>
        <p style={{ paddingTop: '3px', fontSize: '18px', fontWeight: 400 }}>
          This page failed to load the forms. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default Error;
