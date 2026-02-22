import React from 'react';
import { Heading, Paragraph } from '@components';

interface FeatureCardProps {
  title: string;
  description: string;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  index,
}) => {
  return (
    <div className="feature-card">
      <Heading title={title} className="feature-card-title" />
      <Paragraph paragraph={description} className="feature-card-description" />
      <div className="feature-card-index">{index}</div>
    </div>
  );
};
