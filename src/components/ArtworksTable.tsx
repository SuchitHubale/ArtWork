import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  date_start: number;
  date_end: number;
}

interface APIResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

export default function ArtworksTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworksMap, setSelectedArtworksMap] = useState<Record<number, Artwork>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pendingSelectCount, setPendingSelectCount] = useState(0);
  const [overlayInput, setOverlayInput] = useState<number | null>(null);
  const opRef = React.useRef<OverlayPanel>(null);

  const fetchArtworks = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
      const data: APIResponse = await res.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(currentPage, rows);
  }, [currentPage, rows]);

  useEffect(() => {
    if (pendingSelectCount > 0 && artworks.length > 0) {
      const newlySelected: Record<number, Artwork> = {};
      let count = 0;

      for (const artwork of artworks) {
        if (!selectedArtworksMap[artwork.id]) {
          newlySelected[artwork.id] = artwork;
          count++;
          if (count >= pendingSelectCount) break;
        }
      }

      setSelectedArtworksMap((prev) => ({ ...prev, ...newlySelected }));
      setPendingSelectCount((prev) => Math.max(0, prev - count));
    }
  }, [artworks]);

  const onPageChange = (event: any) => {
    const pageNumber = event.page !== undefined ? event.page + 1 : 1;
    setCurrentPage(pageNumber);
    setRows(event.rows);
  };

  const getSelectedArtworksForPage = (): Artwork[] => {
    return artworks.filter((artwork) => selectedArtworksMap[artwork.id]);
  };

  const renderCell = (field: keyof Artwork) => (rowData: Artwork) => {
    const value = rowData[field];
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return "N/A";
    }
    return value;
  };

  const handleAutoSelect = () => {
    if (!overlayInput || overlayInput <= 0) return;

    let count = 0;
    const currentSelected = { ...selectedArtworksMap };

    for (const artwork of artworks) {
      if (!currentSelected[artwork.id] && count < overlayInput) {
        currentSelected[artwork.id] = artwork;
        count++;
      }
    }

    setSelectedArtworksMap(currentSelected);
    const remaining = overlayInput - count;
    if (remaining > 0) {
      setPendingSelectCount(remaining); // Save remaining for next page
    }

    setOverlayInput(null);
    opRef.current?.hide();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Button label="Auto Select Rows" icon="pi pi-plus" onClick={(e) => opRef.current?.toggle(e)} style={{ marginRight: 12 }} />
        <OverlayPanel ref={opRef}>
          <div className="p-fluid" style={{ width: 200 }}>
            <InputNumber
              value={overlayInput}
              onValueChange={(e) => setOverlayInput(e.value ?? null)}
              placeholder="Enter number of rows"
              useGrouping={false}
              min={1}
              style={{ width: '100%' }}
            />
            <Button label="Submit" icon="pi pi-check" onClick={handleAutoSelect} className="p-button-sm" style={{ marginTop: 8 }} />
          </div>
        </OverlayPanel>
      </div>

      <DataTable
        value={artworks}
        paginator
        lazy
        loading={loading}
        totalRecords={totalRecords}
        rows={rows}
        first={(currentPage - 1) * rows}
        onPage={onPageChange}
        rowsPerPageOptions={[5, 10, 12, 25, 50]}
        selection={getSelectedArtworksForPage()}
        dataKey="id"
        selectionMode="checkbox"
        tableStyle={{ minWidth: '60rem', background: '#f9fafb', borderRadius: 8 }}
        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="title" header="Title" style={{ width: '25%' }} body={renderCell("title")}></Column>
        <Column field="place_of_origin" header="Place of Origin" style={{ width: '15%' }} body={renderCell("place_of_origin")}></Column>
        <Column field="artist_display" header="Artist Display" style={{ width: '40%' }} body={renderCell("artist_display")}></Column>
        <Column field="date_start" header="Date Start" style={{ width: '10%' }} body={renderCell("date_start")}></Column>
        <Column field="date_end" header="Date End" style={{ width: '10%' }} body={renderCell("date_end")}></Column>
      </DataTable>
    </div>
  );
}
