import { useState } from 'react'
import { ETATS, COULEURS_DOSSIER } from '../../constants'
import './Modal.css'

function Modal({ type, onClose, onAjouterTache, onModifierTache, onAjouterDossier, dossiers, editingTache }) {
  const isEditing = type === 'tache' && editingTache !== null

  const [title, setTitle] = useState(isEditing ? editingTache.title : '')
  const [description, setDescription] = useState(isEditing ? editingTache.description : '')
  const [dateEcheance, setDateEcheance] = useState(isEditing ? editingTache.date_echeance : '')
  const [etat, setEtat] = useState(isEditing ? editingTache.etat : ETATS.NOUVEAU)
  const [equipiers, setEquipiers] = useState(
    isEditing ? (editingTache.equipiers || []).map(e => e.name).join(', ') : ''
  )
  const [selectedDossiers, setSelectedDossiers] = useState([])

  const [dossierTitle, setDossierTitle] = useState('')
  const [dossierDescription, setDossierDescription] = useState('')
  const [dossierColor, setDossierColor] = useState('orange')

  const [errors, setErrors] = useState({})

  const handleSubmitTache = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (title.length < 5) {
      newErrors.title = 'L\'intitulé doit contenir au moins 5 caractères'
    }
    if (!dateEcheance) {
      newErrors.dateEcheance = 'La date d\'échéance est obligatoire'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const equipiersList = equipiers
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0)
      .map(name => ({ name }))

    if (isEditing) {
      onModifierTache({
        id: editingTache.id,
        title,
        description,
        date_echeance: dateEcheance,
        etat,
        equipiers: equipiersList,
      })
    } else {
      onAjouterTache({
        title,
        description,
        date_echeance: dateEcheance,
        etat,
        equipiers: equipiersList,
        dossierIds: selectedDossiers,
      })
    }
  }

  const handleSubmitDossier = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (dossierTitle.length < 3) {
      newErrors.dossierTitle = 'L\'intitulé doit contenir au moins 3 caractères'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAjouterDossier({
      title: dossierTitle,
      description: dossierDescription,
      color: dossierColor,
      icon: '',
    })
  }

  const toggleDossier = (dossierId) => {
    setSelectedDossiers(prev =>
      prev.includes(dossierId) ? prev.filter(id => id !== dossierId) : [...prev, dossierId]
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {type === 'tache'
              ? (isEditing ? 'Modifier la tâche' : 'Ajouter une tâche')
              : 'Ajouter un projet'
            }
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {type === 'tache' ? (
          <form onSubmit={handleSubmitTache} className="modal-form">
            <div className="form-group">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nom de la tâche"
                className="input-title"
                autoFocus
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="input-desc"
              />
            </div>

            <div className="form-row">
              <div className="form-group form-group-half">
                <label>Échéance</label>
                <input
                  type="date"
                  value={dateEcheance}
                  onChange={e => setDateEcheance(e.target.value)}
                  className="input-field"
                />
                {errors.dateEcheance && <span className="error">{errors.dateEcheance}</span>}
              </div>

              <div className="form-group form-group-half">
                <label>Statut</label>
                <select value={etat} onChange={e => setEtat(e.target.value)} className="input-field">
                  {Object.values(ETATS).map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Équipiers</label>
              <input
                type="text"
                value={equipiers}
                onChange={e => setEquipiers(e.target.value)}
                placeholder="Noms séparés par des virgules"
                className="input-field"
              />
            </div>

            {!isEditing && dossiers.length > 0 && (
              <div className="form-group">
                <label>Projet</label>
                <div className="project-options">
                  {dossiers.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      className={`project-option ${selectedDossiers.includes(d.id) ? 'selected' : ''}`}
                      onClick={() => toggleDossier(d.id)}
                    >
                      <span className="project-option-dot" style={{ background: COULEURS_DOSSIER[d.color] || d.color }} />
                      {d.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn-submit">
                {isEditing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitDossier} className="modal-form">
            <div className="form-group">
              <input
                type="text"
                value={dossierTitle}
                onChange={e => setDossierTitle(e.target.value)}
                placeholder="Nom du projet"
                className="input-title"
                autoFocus
              />
              {errors.dossierTitle && <span className="error">{errors.dossierTitle}</span>}
            </div>

            <div className="form-group">
              <textarea
                value={dossierDescription}
                onChange={e => setDossierDescription(e.target.value)}
                placeholder="Description (optionnel)"
                rows={2}
                className="input-desc"
              />
            </div>

            <div className="form-group">
              <label>Couleur</label>
              <div className="color-grid">
                {Object.entries(COULEURS_DOSSIER).map(([name, hex]) => (
                  <button
                    key={name}
                    type="button"
                    className={`color-option ${dossierColor === name ? 'selected' : ''}`}
                    style={{ background: hex }}
                    onClick={() => setDossierColor(name)}
                    title={name}
                  />
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
              <button type="submit" className="btn-submit">Ajouter</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Modal
