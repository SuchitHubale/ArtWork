import { useState, useEffect } from 'react';
import type { Artwork } from '../types/artwork';

export function useSelection(artworks: Artwork[]) {
  const [selectedMap, setSelectedMap] = useState<Record<number, Artwork>>({});
  const [pendingSelectionCount, setPendingSelectionCount] = useState(0);
  const [inputCount, setInputCount] = useState<number | null>(null);

  useEffect(() => {
    if (pendingSelectionCount > 0 && artworks.length > 0) {
      const newSelections: Record<number, Artwork> = {};
      let count = 0;
      for (const art of artworks) {
        if (!selectedMap[art.id]) {
          newSelections[art.id] = art;
          count++;
          if (count >= pendingSelectionCount) break;
        }
      }
      setSelectedMap(prev => ({ ...prev, ...newSelections }));
      setPendingSelectionCount(prev => Math.max(0, prev - count));
    }
  }, [artworks]);

  const getCurrentPageSelections = (): Artwork[] => {
    return artworks.filter(art => selectedMap[art.id]);
  };

  const handleSelectionChange = (e: { value: Artwork[] }) => {
    const selectedOnPage = e.value;
    const updatedMap = { ...selectedMap };
    const pageIds = artworks.map(a => a.id);
    pageIds.forEach(id => {
      if (!selectedOnPage.some(a => a.id === id)) {
        delete updatedMap[id];
      }
    });
    selectedOnPage.forEach(art => {
      updatedMap[art.id] = art;
    });
    setSelectedMap(updatedMap);
  };

  const handleAutoSelect = () => {
    if (!inputCount || inputCount <= 0) return;
    const updatedMap = { ...selectedMap };
    let selectedNow = 0;
    for (const art of artworks) {
      if (!updatedMap[art.id] && selectedNow < inputCount) {
        updatedMap[art.id] = art;
        selectedNow++;
      }
    }
    setSelectedMap(updatedMap);
    setPendingSelectionCount(inputCount - selectedNow);
    setInputCount(null);
  };

  return {
    selectedMap,
    setSelectedMap,
    getCurrentPageSelections,
    handleSelectionChange,
    pendingSelectionCount,
    setPendingSelectionCount,
    inputCount,
    setInputCount,
    handleAutoSelect,
  };
} 