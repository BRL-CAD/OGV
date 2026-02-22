import React from 'react';
import { Paragraph } from './common';
import { FileInformationData } from '@app-types';
import { FileExipryCalculate } from '@utils/FileExipryCalculate';
import { FileSize } from '@utils/FileSize';
import { LICENSES } from '@data/Licenses';

interface Props {
  fileInformation: FileInformationData;
  setFileInformation: (fileInformation: FileInformationData) => void;
}

export const FileInformation = ({
  fileInformation,
  setFileInformation,
}: Props) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLicenseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLicense = e.target.value;
    const newExpiresIn =
      newLicense === 'unknown' ? 1 : newLicense === '' ? 0 : 24;

    setFileInformation({
      ...fileInformation,
      license: newLicense,
      expiresIn: newExpiresIn,
    });
  };

  return (
    <>
      <div className="file-information-container">
        <div className="file-information-header">
          <Paragraph
            paragraph={'File Information'}
            className={'file-information-heading'}
          />
        </div>
        <div className="file-information-content">
          <div className="file-information-content-item">
            <Paragraph
              paragraph={'License'}
              className={'file-information-label'}
            />
            <select
              className="file-information-select"
              value={fileInformation.license}
              onChange={handleLicenseChange}
            >
              {LICENSES.map((license) => (
                <option key={license.optionValue} value={license.optionValue}>
                  {license.optionName}
                </option>
              ))}
            </select>
          </div>
          <div className="file-information-content-item">
            <Paragraph
              paragraph={'Expires In'}
              className={'file-information-label'}
            />
            <Paragraph
              paragraph={FileExipryCalculate(fileInformation.expiresIn)}
            />
          </div>
          <div className="file-information-content-item">
            <Paragraph
              paragraph={'Original File Format'}
              className={'file-information-label'}
            />
            <Paragraph
              paragraph={fileInformation.originalFileFormat || 'File Not Found'}
            />
          </div>
          <div className="file-information-content-item">
            <Paragraph
              paragraph={'File Size'}
              className={'file-information-label'}
            />
            <Paragraph paragraph={FileSize(fileInformation.fileSize)} />
          </div>
          <div className="file-information-content-item">
            <Paragraph
              paragraph={'Upload Date'}
              className={'file-information-label'}
            />
            <Paragraph paragraph={formattedDate} />
          </div>
        </div>
      </div>
    </>
  );
};
