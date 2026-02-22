import { useState } from 'react';
import { Heading, Paragraph } from '@components/common';
import { CrossIcon, PlusIcon } from '@/icons';

interface FAQProps {
  question: string;
  answer: string;
}

export const FAQ = ({ question, answer }: FAQProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-container">
      <div className="faq-item" onClick={handleClick}>
        <Heading title={question} className="faq-question" />
        <button className="faq-icon-button">
          {isOpen ? (
            <CrossIcon className="faq-icon-open" />
          ) : (
            <PlusIcon className="faq-icon-closed" />
          )}
        </button>
      </div>
      {isOpen && <Paragraph paragraph={answer} className="faq-answer" />}
    </div>
  );
};
