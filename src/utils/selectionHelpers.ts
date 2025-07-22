import type { Artwork } from '../types/Artwork';

export const updateSelectionMap = (
  currentPageData: Artwork[],
  newSelection: Artwork[],
  selectedMap: Record<number, Artwork>
): Record<number, Artwork> => {
  const updatedMap = { ...selectedMap };
  const currentPageIds = currentPageData.map((art) => art.id);

  currentPageIds.forEach((id) => {
    if (!newSelection.some((item) => item.id === id)) {
      delete updatedMap[id];
    }
  });

  newSelection.forEach((art) => {
    updatedMap[art.id] = art;
  });

  return updatedMap;
};
