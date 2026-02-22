import { useState } from 'react';
import { toast } from 'react-toastify';

export function useFileConverter() {
  const [isConverted, setIsConverted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(0);

  const convertAndDownload = async (
    file: File | null,
    selectedFormats: string[],
    downloadLinkRef: React.RefObject<HTMLAnchorElement | null>,
    resetFormats: () => void
  ) => {
    if (!file) {
      toast.error('Please upload a file');
      return;
    }
    if (!selectedFormats.length) {
      toast.error('Please select at least one format');
      return;
    }

    setIsConverted(true);
    const data = new FormData();
    data.append('file', file);
    data.append('outputFormat', JSON.stringify(selectedFormats));
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    try {
      toast.info('Converting file...');
      const url = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${url}`, {
        method: 'POST',
        body: data,
      });

      if (response.status === 200 || response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        const filename = file.name.split('.').slice(0, -1).join('.');
        const downloadFileName =
          selectedFormats.length > 1
            ? `${filename}.zip`
            : `${filename}.${selectedFormats[0]}`;
        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = downloadFileName;
        }
        setTimeout(() => {
          downloadLinkRef.current?.click();
        }, 100);
        toast.success(
          selectedFormats.length > 1
            ? `Files converted to ${selectedFormats.length} formats, downloading the zip file.`
            : 'File converted successfully, downloading the file.'
        );
        resetFormats();
        setFormKey((prev) => prev + 1);
      } else {
        toast.error('Failed to convert file Try again with a different file');
      }
    } catch {
      toast.error('Failed to convert file Try again with a different file');
    } finally {
      setIsConverted(false);
    }
  };

  return {
    isConverted,
    downloadUrl,
    formKey,
    convertAndDownload,
  };
}
