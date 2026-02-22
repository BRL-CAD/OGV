'use client';
import React, { useState } from 'react';
import { Paragraph, Title } from '@components/common';
import { PrimaryButton, SecondaryButton } from '@components/common';
import { UploadIcon, PreviewIcon } from '@icons';
import { FileInformationData } from '@app-types';
import { validateFileInformation } from '@utils/FileUploadValidation';
import { toast } from 'react-toastify';
import { ModelPreviewModal } from '@components/ModelPreviewModal';
import { Uploading } from './common/Uploading';
import { useRouter } from 'next/navigation';

interface Props {
  fileInformation: FileInformationData;
}

export const UploadBanner = ({ fileInformation }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [uploadId, setUploadId] = useState<any | null>(null);
  const router = useRouter();

  const handleUpload = async () => {
    if (validateFileInformation(fileInformation)) {
      setIsUploading(true);
      setIsCompleted(false);
      setIsError(false);
      setError('');
      try {
        const url = process.env.NEXT_PUBLIC_UPLOAD_URL;
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP: string = ipData.ip;
        const formData = new FormData();
        if (fileInformation.file) {
          formData.append('file', fileInformation.file);
        }

        if (fileInformation.thumbnail) {
          formData.append('thumbnailImage', fileInformation.thumbnail);
        }

        formData.append('title', fileInformation.title);
        formData.append('description', fileInformation.description);
        formData.append('category', fileInformation.category);
        formData.append('license', fileInformation.license);
        formData.append('expiresIn', fileInformation.expiresIn.toString());
        formData.append('userIP', userIP);
        if (url) {
          const response = await fetch(url, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setUploadId(result.data.id);
              toast.success('File uploaded successfully!');
              setIsCompleted(true);
            } else {
              toast.error('Upload failed: ' + result.error);
              setIsError(true);
              setError('Upload failed');
            }
          } else {
            const error = await response.text();
            setIsError(true);
            setError(error);
          }
        } else {
          setIsError(true);
          setError('An unknown error occurred. Please try again later.');
        }
      } catch (error) {
        setIsError(true);
        setError('Upload failed: ' + String(error));
      }
      setIsCompleted(true);
    }
  };
  const handlePreview = () => {
    if (!fileInformation.file) {
      toast.error('Please upload a file first');
      return;
    }
    setShowPreview(true);
  };

  return (
    <div className="upload-banner">
      <div className="upload-banner-content">
        <Title title="Convert and Share Your 3D File " />
        <Paragraph paragraph="Upload your 3D file to share it with others." />
      </div>
      <div className="button-container">
        <SecondaryButton
          label="Preview"
          className="preview-button"
          onClick={handlePreview}
          icon={<PreviewIcon color="#000" className="svg-icon" />}
        />
        <PrimaryButton
          label={isUploading ? 'Uploading...' : 'Upload'}
          disabled={isUploading}
          onClick={handleUpload}
          icon={<UploadIcon color="#ffffff" />}
        />
      </div>
      <ModelPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        file={fileInformation.file}
      />

      {(isUploading || isCompleted || isError) && (
        <Uploading
          isUploading={isUploading}
          isCompleted={isCompleted}
          isError={isError}
          error={error}
          fileName={fileInformation.file?.name || 'File'}
          onViewFile={() => {
            if (uploadId) {
              router.push(`/dashboard/modelviewer/${uploadId}`);
            }
          }}
          onCopyLink={async () => {
            if (uploadId) {
              await navigator.clipboard.writeText(
                `${window.location.origin}/dashboard/modelviewer/${uploadId}`
              );
            }
          }}
        />
      )}
    </div>
  );
};
