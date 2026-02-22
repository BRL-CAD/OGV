export const getConvertedFileURL = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`https://ogv-1.onrender.com/model/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (!data.data.convertedFileUrl) {
      throw new Error('Converted file URL not found in response');
    }
    return data.data.convertedFileUrl;
  } catch (error) {
    console.error('Error fetching converted file URL:', error);
    throw error;
  }
};
