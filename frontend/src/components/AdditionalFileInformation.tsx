'use client';
import React, { useRef, useState } from 'react';
import { Paragraph } from './common';
import { FileIcon } from '@icons/File.icon';
import { FileInformationData } from '@app-types';
import { MODEL_CATEGORY } from '@data';

interface Props {
  fileInformation: FileInformationData;
  setFileInformation: (data: FileInformationData) => void;
}

export const AdditionalFileInformation = ({
  fileInformation,
  setFileInformation,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleThumbnailClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInformation({ ...fileInformation, thumbnail: file });
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };
  return (
    <>
      <div className="additional-file-information-container">
        <div
          className="additional-file-thumbnail-contianer"
          onClick={handleThumbnailClick}
        >
          <input
            type="file"
            className="additional-file-thumbnail-input"
            ref={fileRef}
            onChange={handleFileChange}
          />
          {!imageUrl && (
            <div className="additional-file-thumbnail-content">
              <FileIcon />
              <Paragraph paragraph={'Upload Thumbnail'} />
            </div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="additional-file-details-container">
          <Paragraph
            className={'additional-file-heading'}
            paragraph={'Additional Information'}
          />
          <form className="additional-file-information-form">
            <div className="additional-file-information-form-item">
              <label htmlFor="file-name">Title</label>
              <input
                type="text"
                id="file-name"
                placeholder="Enter Title"
                value={fileInformation.title}
                onChange={(e) =>
                  setFileInformation({
                    ...fileInformation,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="additional-file-information-form-item">
              <label htmlFor="file-description">Description</label>
              <textarea
                id="file-description"
                placeholder="Enter Description"
                value={fileInformation.description}
                onChange={(e) =>
                  setFileInformation({
                    ...fileInformation,
                    description: e.target.value,
                  })
                }
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="additional-file-information-form-item">
              <label htmlFor="file-category">Category</label>
              <select
                id="file-category"
                value={fileInformation.category}
                onChange={(e) =>
                  setFileInformation({
                    ...fileInformation,
                    category: e.target.value,
                  })
                }
              >
                {MODEL_CATEGORY.map((category) => (
                  <option
                    key={category.optionValue}
                    value={category.optionValue}
                  >
                    {category.optionName}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
