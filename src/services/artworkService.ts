import axios from 'axios';
import type { Artwork } from '../types/Artwork';

export const fetchArtworks = async (page: number, limit: number): Promise<{ data: Artwork[], total: number }> => {
  const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
  return {
    data: response.data.data,
    total: response.data.pagination.total,
  };
};
