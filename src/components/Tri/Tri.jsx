import { useState } from 'react'
import { TRI_OPTIONS } from '../../constants'
import './Tri.css'

function Tri({ tri, triDesc, onChangeTri, onToggleDirection, options }) {
  const [open, setOpen] = useState(false)

  const labels = {
    [TRI_OPTIONS.DATE_ECHEANCE]: 'Échéance',
    [TRI_OPTIONS.DATE_CREATION]: 'Création',
    [TRI_OPTIONS.NOM]: 'Nom',
  }

  const availableOptions = options ?? Object.keys(labels)

  return (
    <div className="tri">
      <button className="tri-trigger" onClick={() => setOpen(!open)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M6 12h12M9 18h6"/>
        </svg>
        {labels[tri]}
        <span className="tri-arrow">{triDesc ? '↓' : '↑'}</span>
      </button>

      {open && (
        <>
          <div className="tri-backdrop" onClick={() => setOpen(false)} />
          <div className="tri-dropdown">
            <div className="tri-dropdown-header">Trier par</div>
            {availableOptions.map((key) => (
              <button
                key={key}
                className={`tri-option ${tri === key ? 'active' : ''}`}
                onClick={() => { onChangeTri(key); setOpen(false) }}
              >
                {labels[key]}
                {tri === key && <span className="tri-check">✓</span>}
              </button>
            ))}
            <div className="tri-dropdown-sep" />
            <button className="tri-option" onClick={() => { onToggleDirection(); setOpen(false) }}>
              {triDesc ? '↑ Croissant' : '↓ Décroissant'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Tri
