import type { Artwork } from '../types/artwork';

const renderCell = (field: keyof Artwork) => (row: Artwork) => {
  const val = row[field];
  return val === null || val === undefined || (typeof val === 'string' && val.trim() === '') ? 'N/A' : val;
};

export default renderCell; 