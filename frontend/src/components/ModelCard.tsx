import React from 'react';
import Link from 'next/link';
import { Paragraph } from '@components/common';

interface Props {
  modelId: string;
  image: string;
  title: string;
  category: string;
  orifinalFileType: string;
  fileSize: string;
  uploadDate: string;
  license: string;
  expirationTime: string;
}

export const ModelCard = ({
  modelId,
  image,
  title,
  category,
  orifinalFileType,
  fileSize,
  uploadDate,
  license,
  expirationTime,
}: Props) => {
  const calculateRemainingTime = (uploadDate: string, expiryHours: string) => {
    const uploadTime = new Date(uploadDate);
    const now = new Date();
    const totalExpiryHours = parseInt(expiryHours) || 0;

    const timeDiffMs = now.getTime() - uploadTime.getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    const remainingHours = totalExpiryHours - timeDiffHours;
    if (remainingHours <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(remainingHours);
    const minutes = Math.floor((remainingHours - hours) * 60);

    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
    } else {
      return `${minutes} min`;
    }
  };

  const remainingTime = calculateRemainingTime(uploadDate, expirationTime);

  return (
    <Link
      href={`/dashboard/modelviewer/${modelId}`}
      className="model-card-container-link"
    >
      <div className="model-card-container">
        <div className="model-card-image-container">
          <img
            src={image}
            alt="model-card-image"
            className="model-card-image"
          />
        </div>
        <div className="model-card-details-container">
          <Paragraph paragraph={title} className="model-card-title" />
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'Uploaded on'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={uploadDate.split('T')[0]}
              className="model-card-detail-value"
            />
          </div>
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'Category'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={category}
              className="model-card-detail-value"
            />
          </div>
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'Original File Type'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={orifinalFileType}
              className="model-card-detail-value"
            />
          </div>
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'File Size'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={fileSize}
              className="model-card-detail-value"
            />
          </div>
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'License'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={license}
              className="model-card-detail-value"
            />
          </div>
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'Expiration Time'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={remainingTime}
              className="model-card-detail-value"
            />
          </div>
          <div className="model-card-detail-container">
            <Paragraph
              paragraph={'Category'}
              className="model-card-detail-label"
            />
            <Paragraph
              paragraph={category}
              className="model-card-detail-value"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
