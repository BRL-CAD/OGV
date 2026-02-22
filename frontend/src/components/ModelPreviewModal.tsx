'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { CrossIcon } from '@icons/Cross.icon';
import { Paragraph } from '@components/common';
import { ModelViewer } from 'ogv-viewer-package';
import 'ogv-viewer-package/dist/index.css';

interface ModelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
}

export const ModelPreviewModal: React.FC<ModelPreviewModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [modelScale, setModelScale] = useState(0.02);

  const convertAndPreview = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'obj') {
        const url = URL.createObjectURL(file);
        setModelUrl(url);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', JSON.stringify(['obj']));

        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${url}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setModelUrl(url);
        } else {
          throw new Error('Failed to convert file');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert file');
      console.error('Conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  useEffect(() => {
    if (isOpen && file) {
      void convertAndPreview();
    }
  }, [isOpen, file, convertAndPreview]);

  if (!isOpen) return null;

  return (
    <div className="model-preview-modal-overlay">
      <div className="model-preview-modal">
        <div className="model-preview-modal-header">
          <h3>3D Model Preview</h3>
          <CrossIcon
            color="#000"
            onClick={onClose}
            width={35}
            height={35}
            className="model-preview-modal-close"
          />
        </div>

        <div className="model-preview-modal-content">
          {isLoading && (
            <div className="model-preview-loading">
              <Paragraph paragraph="Converting and loading model..." />
            </div>
          )}

          {error && (
            <div className="model-preview-error">
              <Paragraph paragraph={`Error: ${error}`} />
              <button
                onClick={convertAndPreview}
                className="model-preview-retry"
              >
                Retry
              </button>
            </div>
          )}

          {modelUrl && !isLoading && !error && (
            <>
              <div className="model-preview-controls">
                <div className="model-preview-control-row">
                  <div className="model-preview-scale-control">
                    <Paragraph paragraph="Scale:" />
                    <input
                      type="range"
                      min="0.001"
                      max="0.1"
                      step="0.001"
                      value={modelScale}
                      onChange={(e) =>
                        setModelScale(parseFloat(e.target.value))
                      }
                      className="model-preview-scale-slider"
                    />
                    <Paragraph paragraph={modelScale.toFixed(3)} />
                  </div>
                </div>
              </div>

              <div className="model-preview-canvas-container">
                <ModelViewer
                  url={modelUrl}
                  initialScale={0.02}
                  initialZoom={8}
                  showSettings={false}
                />
              </div>

              <div className="model-preview-instructions">
                <Paragraph
                  paragraph="Controls:"
                  className="model-preview-instructions-title"
                />
                <Paragraph paragraph="Left click + drag = Rotate" />
                <Paragraph paragraph="Right click + drag = Pan" />
                <Paragraph paragraph="Scroll wheel = Zoom" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
