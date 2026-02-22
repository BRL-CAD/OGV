'use client';
import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon, UploadIcon } from '@icons';
import { Paragraph, PrimaryButton, SecondaryButton } from '@components/common';
import { MaxFileSize, InputFormats } from '@constants/FileFormats';
import { toast } from 'react-toastify';
import { FileInformationData } from '@app-types';

interface Props {
  setFileInformation: (fileInformation: FileInformationData) => void;
  fileInformation: FileInformationData;
}

export const FileUpload = ({ setFileInformation, fileInformation }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (fileInformation.file) {
        toast.error('Please reset current file before uploading a new one');
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop() || '';

        if (file.size > MaxFileSize) {
          toast.error('File size exceeds limit');
          return;
        }

        if (!InputFormats.includes(fileExtension)) {
          toast.error('Invalid input format');
          return;
        }

        setFileInformation({
          ...fileInformation,
          file: file,
          originalFileFormat: fileExtension,
          fileSize: file.size.toString(),
          uploadDate: new Date().toISOString(),
        });
        if (inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          inputRef.current.files = dataTransfer.files;
        }
      }
    },
    onDropRejected: (rejectedFiles) => {
      console.log('Files rejected:', rejectedFiles);
      if (rejectedFiles.length > 0) {
        const file = rejectedFiles[0];
        if (file.errors.some((error) => error.code === 'file-invalid-type')) {
          toast.error('Invalid input format');
        } else if (
          file.errors.some((error) => error.code === 'file-too-large')
        ) {
          toast.error('File size exceeds limit');
        } else {
          toast.error('File rejected');
        }
      }
    },
    accept: {
      'application/octet-stream': InputFormats.map((ext) => `.${ext}`),
    },
    multiple: false,
    maxFiles: 1,
    noDragEventsBubbling: false,
  });

  const handleBrowseFiles = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (fileInformation.file) {
      setFileInformation({ ...fileInformation, file: null });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else {
      inputRef.current?.click();
    }
  };

  const handleDropzoneClick = (event: React.MouseEvent) => {
    if (
      !fileInformation.file &&
      !(event.target as HTMLElement).closest('button')
    ) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MaxFileSize) {
      toast.error('File size exceeds limit');
      setFileInformation({ ...fileInformation, file: null });
      return;
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop() || '';
    if (!InputFormats.includes(fileExtension)) {
      toast.error('Invalid input format');
      setFileInformation({ ...fileInformation, file: null });
      return;
    }
    setFileInformation({
      ...fileInformation,
      file: file,
      originalFileFormat: fileExtension,
      fileSize: file.size.toString(),
      uploadDate: new Date().toISOString(),
    });
  };

  return (
    <>
      <div
        className="file-upload-container"
        {...getRootProps()}
        onClick={handleDropzoneClick}
      >
        {isDragActive && !fileInformation.file && (
          <div className="file-upload-dropzone drag-active">
            <FileIcon />
            <Paragraph
              paragraph={'Drop your file here'}
              className="file-upload-label-text"
            />
            <Paragraph
              paragraph={'Release to upload'}
              className="file-upload-label-subtext"
            />
          </div>
        )}

        {!fileInformation.file && !isDragActive && (
          <div className="file-upload-dropzone">
            <div className="file-upload-icon">
              <UploadIcon width={55} height={55} />
            </div>
            <Paragraph
              paragraph={'Drag & Drop Your Files here'}
              className="file-upload-label-text"
            />
            <Paragraph
              paragraph={'Maximum File Size: 20 MB'}
              className="file-upload-label-subtext"
            />
            <PrimaryButton
              label={'Browse Files'}
              onClick={handleBrowseFiles}
              className="file-upload-button"
            />
          </div>
        )}

        {fileInformation.file && !isDragActive && (
          <div className="file-upload-dropzone">
            <FileIcon />
            <div
              title={fileInformation.file.name}
              className="file-name-container"
            >
              <Paragraph
                paragraph={fileInformation.file.name}
                className="file-upload-label-text file-name-truncated"
              />
            </div>
            <Paragraph
              paragraph={'Uploaded Successfully'}
              className="file-upload-label-subtext"
            />
            <SecondaryButton
              label={'Reset'}
              onClick={handleBrowseFiles}
              className="file-upload-reset-button"
            />
          </div>
        )}

        <input
          type="file"
          ref={inputRef}
          id="file-upload-input"
          style={{ display: 'none' }}
          accept={InputFormats.map((ext) => `.${ext}`).join(',')}
          onChange={handleFileChange}
        />
      </div>
    </>
  );
};
