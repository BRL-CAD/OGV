import React from 'react';
import { Paragraph } from './common';

interface Props {
  error: string;
  subText?: string;
  buttonText?: string;
  buttonOnClick?: () => void;
  errorClass?: string;
  subTextClass?: string;
  buttonClass?: string;
}

const ErrorShowcase = ({
  error,
  subText,
  buttonText,
  buttonOnClick,
  errorClass,
  subTextClass,
  buttonClass,
}: Props) => {
  return (
    <div className="error-showcase">
      <Paragraph
        paragraph={error}
        className={`error-showcase-text ${errorClass}`}
      />
      {subText && (
        <Paragraph
          paragraph={subText}
          className={`error-showcase-sub-text ${subTextClass}`}
        />
      )}
      {buttonText && (
        <button
          className={`error-showcase-button ${buttonClass}`}
          onClick={buttonOnClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
export default ErrorShowcase;
