'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Paragraph } from '@components';
import { getConvertedFileURL } from '@utils/ConvertedFileURL';
import { ModelViewer } from 'ogv-viewer-package';
import 'ogv-viewer-package/dist/index.css';

const ModelViewerPage = () => {
  const params = useParams();
  const modelId = params.id as string;
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchModelUrl = async () => {
      if (!modelId) return;
      try {
        setIsLoading(true);
        setError('');
        const url = await getConvertedFileURL(modelId);
        setModelUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model');
        console.error('Error fetching model URL:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchModelUrl();
  }, [modelId]);

  if (isLoading) {
    return (
      <div className="model-viewer-container">
        <div className="model-viewer-error-container">
          <Paragraph paragraph="Loading model..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="model-viewer-container">
        <div className="model-viewer-error-container">
          <Paragraph paragraph={`Error: ${error}`} />
          <button
            onClick={() => window.location.reload()}
            className="model-viewer-error-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!modelUrl) return null;

  return (
    <ModelViewer
      url={modelUrl}
      initialScale={0.03}
      initialZoom={8}
      showSettings={true}
    />
  );
};

export default ModelViewerPage;
