import { useState } from 'react'
import { COULEURS_DOSSIER } from '../../constants'
import './Dossier.css'

function Dossier({ dossier, onModifier, onSupprimer, nbTaches }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(dossier.title)
  const [description, setDescription] = useState(dossier.description)
  const [color, setColor] = useState(dossier.color)

  const handleSave = () => {
    if (title.length < 3) return
    onModifier({ ...dossier, title, description, color })
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(dossier.title)
    setDescription(dossier.description)
    setColor(dossier.color)
    setEditing(false)
  }

  return (
    <div className="dossier-card">
      {editing ? (
        <div className="dossier-edit">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="dossier-input"
            placeholder="Nom (min 3 car.)"
            autoFocus
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="dossier-textarea"
            placeholder="Description"
            rows={2}
          />
          <div className="dossier-colors">
            {Object.entries(COULEURS_DOSSIER).map(([name, hex]) => (
              <button
                key={name}
                type="button"
                className={`dossier-color-dot ${color === name ? 'selected' : ''}`}
                style={{ background: hex }}
                onClick={() => setColor(name)}
              />
            ))}
          </div>
          <div className="dossier-edit-btns">
            <button className="dossier-btn-cancel" onClick={handleCancel}>Annuler</button>
            <button className="dossier-btn-save" onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      ) : (
        <div className="dossier-view">
          <div className="dossier-left">
            <span
              className="dossier-dot"
              style={{ background: COULEURS_DOSSIER[dossier.color] || dossier.color }}
            />
            <div className="dossier-info">
              <span className="dossier-name">{dossier.title}</span>
              {dossier.description && (
                <span className="dossier-desc">{dossier.description}</span>
              )}
            </div>
          </div>
          <div className="dossier-right">
            <span className="dossier-task-count">{nbTaches}</span>
            <button className="dossier-action" onClick={() => setEditing(true)} title="Modifier">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="dossier-action dossier-action-delete" onClick={() => onSupprimer(dossier.id)} title="Supprimer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dossier
