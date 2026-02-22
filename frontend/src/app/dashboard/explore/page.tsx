'use client';
import React, { useEffect, useState } from 'react';
import { ModelCard, Paragraph, SearchBar } from '@/components';
import ErrorShowcase from '@/components/ErrorShowcase';
import { ModelData, ModelsApiResponse } from '@/types/ModelData';
import { FileSize } from '@/utils/FileSize';

const ExplorePage = () => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_GET_ALL_MODELS_URL;
        if (!url) {
          setError('No URL found');
          return;
        }
        const response = await fetch(url);
        const data: ModelsApiResponse = await response.json();

        if (data.success) {
          if (data.data.length > 0) {
            setModels(data.data);
            setFilteredModels(data.data);
          } else {
            setEmpty(true);
          }
        } else {
          setError('Failed to fetch models');
        }
      } catch (err) {
        setError('Error fetching models');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchModels();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(
        (model) =>
          model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [searchTerm, models]);

  if (loading) {
    return (
      <div className="explore-page">
        <div className="explore-page-model-loading-container">
          <ErrorShowcase
            error="Loading Models..."
            subText="Please wait while we fetch your 3D models"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explore-page">
        <div className="explore-page-model-loading-error-container">
          <ErrorShowcase
            error="Error While Loading Models"
            buttonText="Retry"
            buttonClass="explore-page-retry-button"
            buttonOnClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="explore-page">
        <div className="explore-page-model-empty-container">
          <ErrorShowcase
            error="No models found"
            subText="Create a model to get started"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <div className="explore-page-header">
        <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />
        <div className="explore-page-count-container">
          <Paragraph
            paragraph={` Total Models: ${filteredModels.length} of ${models.length}`}
          />
        </div>
      </div>
      <div className="explore-page-models-container">
        {filteredModels.length === 0 && searchTerm.trim() !== '' ? (
          <div className="explore-page-search-not-found">
            <ErrorShowcase
              error="No Models Found"
              subText={`No models match your search for "${searchTerm}"`}
            />
          </div>
        ) : (
          filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              modelId={model.id}
              image={model.thumbnailUrl}
              title={model.title}
              category={model.category}
              orifinalFileType={model.originalFileFormat}
              fileSize={FileSize(model.originalFileSize.toString())}
              uploadDate={model.createdAt}
              license={model.license}
              expirationTime={model.expiresIn.toString()}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
