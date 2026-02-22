'use client';
import React, { useState } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { FileIcon, PreviewIcon } from '../../icons';

interface UploadingProps {
  isUploading: boolean;
  isCompleted: boolean;
  isError: boolean;
  error?: string;
  fileName?: string;
  onViewFile: () => void;
  onCopyLink: () => void;
}

export const Uploading: React.FC<UploadingProps> = ({
  isUploading,
  isCompleted,
  isError,
  error = 'Upload Failed. Please try again.',
  fileName = 'File Name',
  onViewFile,
  onCopyLink,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isUploading && !isCompleted && !isError) return null;

  return (
    <div className="uploading-modal-overlay">
      <div className="uploading-modal">
        <div className="modal-header">
          <h2 className="modal-title">File Uploading</h2>
        </div>

        <div className="modal-content">
          <div className="file-status">
            <div className="file-info">
              <FileIcon className="file-icon" />
              <span className="file-name">{fileName}</span>
            </div>
            <span
              className={`status-text ${isCompleted ? 'completed' : ''} ${isError ? 'error' : ''}`}
            >
              {isUploading && !isError && !isCompleted && 'uploading...'}
              {isCompleted && !isError && 'Upload Complete!'}
              {isCompleted && isError && error}
              {isError && !isUploading && !isCompleted && error}
            </span>
          </div>

          <p className="processing-message">
            {isUploading &&
              !isError &&
              !isCompleted &&
              'Your File is under processing please wait.'}
            {isCompleted &&
              !isUploading &&
              'Your file has been successfully uploaded and converted.'}
            {isError && error}
          </p>
        </div>

        <div className="modal-actions">
          <PrimaryButton
            label="View Your File"
            onClick={onViewFile}
            icon={<PreviewIcon color="#ffffff" />}
            className="view-file-button"
          />
          <SecondaryButton
            label={isCopied ? 'Copied!' : 'Copy Link'}
            onClick={async () => {
              await onCopyLink();
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className="copy-link-button"
          />
        </div>
      </div>
    </div>
  );
};
