import { useState, useEffect, useCallback } from 'react';
import type { Artwork, APIResponse } from '../types/artwork';

export function useArtworks(initialRows: number = 12) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(initialRows);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchArtworks = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
      const json: APIResponse = await res.json();
      setArtworks(json.data);
      setTotalRecords(json.pagination.total);
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks(currentPage, rows);
  }, [currentPage, rows, fetchArtworks]);

  const refetch = () => fetchArtworks(currentPage, rows);

  return {
    artworks,
    loading,
    totalRecords,
    currentPage,
    setCurrentPage,
    rows,
    setRows,
    refetch,
  };
} 