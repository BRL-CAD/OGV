'use client';
import React, { useRef, useState } from 'react';
import {
  FileUpload,
  Paragraph,
  PrimaryButton,
  UploadBanner,
  AdditionalFileInformation,
  FileInformation,
} from '@components';
import { ToastContainer } from 'react-toastify';
import { OutputFormats } from '@constants/FileFormats';
import { useFileConverter } from '@hooks/useFileConverter';
import { FileInformationData } from '@app-types';

const UploadPage = () => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const { isConverted, formKey, convertAndDownload } = useFileConverter();
  const [fileInformation, setFileInformation] = useState<FileInformationData>({
    file: null,
    title: '',
    description: '',
    category: '',
    thumbnail: null,
    license: '',
    expiresIn: 0,
    originalFileFormat: '',
    fileSize: '',
    uploadDate: '',
  });

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFormats([...selectedFormats, value]);
    } else {
      setSelectedFormats(selectedFormats.filter((format) => format !== value));
    }
  };

  const resetFormats = () => {
    setSelectedFormats([]);
  };

  return (
    <>
      <UploadBanner fileInformation={fileInformation} />
      <div className="file-main-container">
        <div className="upload-container">
          <div className="upload-file-container-background">
            <div className="upload-file-container">
              <FileUpload
                setFileInformation={setFileInformation}
                fileInformation={fileInformation}
              />
              {fileInformation.file && (
                <>
                  <Paragraph
                    className={'upload-file-container-heading'}
                    paragraph={'Convert To:'}
                  />
                  <form
                    key={formKey}
                    className="upload-file-container-checkbox"
                  >
                    {OutputFormats.filter(
                      (format) => format !== fileInformation.originalFileFormat
                    ).map((format, index) => (
                      <div
                        key={index}
                        className="upload-file-container-checkbox-item"
                      >
                        <input
                          type="checkbox"
                          value={format}
                          id={format}
                          disabled={isConverted}
                          name={format}
                          onChange={handleFormatChange}
                        />
                        <label htmlFor={format}>{format}</label>
                      </div>
                    ))}
                  </form>
                  <PrimaryButton
                    label={
                      isConverted ? 'Converting ...' : 'Convert & Download'
                    }
                    className={'upload-file-container-button'}
                    onClick={() =>
                      convertAndDownload(
                        fileInformation.file,
                        selectedFormats,
                        downloadLinkRef,
                        resetFormats
                      )
                    }
                    disabled={isConverted}
                  />
                </>
              )}
            </div>
            <a ref={downloadLinkRef} download style={{ display: 'none' }} />
          </div>
          <AdditionalFileInformation
            fileInformation={fileInformation}
            setFileInformation={setFileInformation}
          />
        </div>
        <FileInformation
          fileInformation={fileInformation}
          setFileInformation={setFileInformation}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default UploadPage;
