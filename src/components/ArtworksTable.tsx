import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import AutoSelectOverlay from './AutoSelectOverlay';
import { useArtworks } from '../hooks/useArtworks';
import { useSelection } from '../hooks/useSelection';
import renderCell from '../utils/renderCell';

const ArtworksTable: React.FC = () => {
  const {
    artworks,
    loading,
    totalRecords,
    currentPage,
    setCurrentPage,
    rows,
    setRows,
  } = useArtworks(12);

  const {
    getCurrentPageSelections,
    handleSelectionChange,
    inputCount,
    setInputCount,
    handleAutoSelect,
  } = useSelection(artworks);

  const overlayRef = useRef<OverlayPanel>(null) as React.RefObject<OverlayPanel>;

  const handlePageChange = (e: any) => {
    const newPage = e.page + 1;
    setCurrentPage(newPage);
    setRows(e.rows);
  };

  const handleAutoSelectAndHide = () => {
    handleAutoSelect();
    overlayRef.current?.hide();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
      <DataTable
        value={artworks}
        paginator
        rows={rows}
        first={(currentPage - 1) * rows}
        totalRecords={totalRecords}
        lazy
        onPage={handlePageChange}
        dataKey="id"
        loading={loading}
        selection={getCurrentPageSelections()}
        onSelectionChange={handleSelectionChange}
        selectionMode="multiple"
        rowsPerPageOptions={[5, 12, 25, 50]}
        paginatorTemplate="RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column
          header={
            <AutoSelectOverlay
              inputCount={inputCount}
              setInputCount={setInputCount}
              handleAutoSelect={handleAutoSelectAndHide}
              overlayRef={overlayRef}
            />
          }
          body={() => null}
          style={{ width: '5%', textAlign: 'center' }}
        />
        <Column field="title" header="Title" style={{ width: '25%' }} body={renderCell('title')} />
        <Column field="place_of_origin" header="Place of Origin" style={{ width: '15%' }} body={renderCell('place_of_origin')} />
        <Column field="artist_display" header="Artist Display" style={{ width: '40%' }} body={renderCell('artist_display')} />
        <Column field="date_start" header="Date Start" style={{ width: '10%' }} body={renderCell('date_start')} />
        <Column field="date_end" header="Date End" style={{ width: '10%' }} body={renderCell('date_end')} />
      </DataTable>
    </div>
  );
};

export default ArtworksTable;
