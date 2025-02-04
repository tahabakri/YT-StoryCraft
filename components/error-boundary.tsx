"use client";

import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleOnError = () => {
    setHasError(true);
  };

  if (hasError) {
    return <div>Something went wrong.</div>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;