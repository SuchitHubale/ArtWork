import React from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { OverlayPanel } from 'primereact/overlaypanel';

interface AutoSelectButtonProps {
  overlayRef: React.RefObject<OverlayPanel>;
}

const AutoSelectButton: React.FC<AutoSelectButtonProps> = ({ overlayRef }) => (
  <Button
    icon="pi pi-chevron-down"
    onClick={(e) => overlayRef.current?.toggle(e)}
    className="p-button-sm p-button-text"
    aria-label="Options"
    style={{ color: '#000', borderColor: '#000', backgroundColor: '#fff' }}
  />
);

interface AutoSelectPanelProps {
  inputCount: number | null;
  setInputCount: (val: number | null) => void;
  handleAutoSelect: () => void;
  overlayRef: React.RefObject<OverlayPanel>;
}

const AutoSelectPanel: React.FC<AutoSelectPanelProps> = ({ inputCount, setInputCount, handleAutoSelect, overlayRef }) => (
  <OverlayPanel ref={overlayRef} dismissable>
    <div
      style={{
        border: '1px solid #000',
        borderRadius: 8,
        padding: 16,
        width: 240,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <InputNumber
        value={inputCount}
        onValueChange={(e) => setInputCount(e.value ?? null)}
        placeholder="Enter number of rows"
        min={1}
        useGrouping={false}
        inputStyle={{
          width: '100%',
          fontSize: '1rem',
          padding: '0.5rem',
          borderRadius: 6,
          border: '1px solid #000',
          color: '#000',
          backgroundColor: '#fff',
        }}
      />
      <Button
        label="Submit"
        onClick={handleAutoSelect}
        className="p-button-sm p-button-outlined"
        style={{
          alignSelf: 'flex-end',
          borderColor: '#000',
          color: '#000',
          backgroundColor: '#fff',
        }}
      />
    </div>
  </OverlayPanel>
);

interface AutoSelectOverlayProps {
  inputCount: number | null;
  setInputCount: (val: number | null) => void;
  handleAutoSelect: () => void;
  overlayRef: React.RefObject<OverlayPanel>;
}

const AutoSelectOverlay: React.FC<AutoSelectOverlayProps> = (props) => (
  <>
    <AutoSelectButton overlayRef={props.overlayRef} />
    <AutoSelectPanel {...props} />
  </>
);

export default AutoSelectOverlay; 