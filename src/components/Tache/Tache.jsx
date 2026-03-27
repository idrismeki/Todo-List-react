import { useState } from 'react'
import { ETATS, ETAT_TERMINE, COULEURS_DOSSIER } from '../../constants'
import './Tache.css'

function Tache({ tache, dossiersTache, onChangerEtat, onEditer, onAjouterRelation, onSupprimerRelation, dossiers, onToggleFiltreDossier }) {
  const [modeComplet, setModeComplet] = useState(false)
  const [showAddDossier, setShowAddDossier] = useState(false)
  const [hovering, setHovering] = useState(false)

  const dossierIds = dossiersTache.map(d => d.id)
  const dossiersDisponibles = dossiers.filter(d => !dossierIds.includes(d.id))

  const isTermine = ETAT_TERMINE.includes(tache.etat)
  const isOverdue = !isTermine && new Date(tache.date_echeance) < new Date()

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain'

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const getDateColor = () => {
    if (isOverdue) return 'var(--todoist-red)'
    const today = new Date()
    const echeance = new Date(tache.date_echeance)
    if (echeance.toDateString() === today.toDateString()) return 'var(--todoist-green)'
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (echeance.toDateString() === tomorrow.toDateString()) return 'var(--todoist-orange)'
    return 'var(--todoist-text-secondary)'
  }

  const handleCheckbox = () => {
    if (isTermine) {
      onChangerEtat(tache.id, ETATS.NOUVEAU)
    } else {
      onChangerEtat(tache.id, ETATS.REUSSI)
    }
  }

  const etatColor = {
    [ETATS.NOUVEAU]: '#246fe0',
    [ETATS.EN_COURS]: '#eb8909',
    [ETATS.REUSSI]: '#058527',
    [ETATS.EN_ATTENTE]: '#a855f7',
    [ETATS.ABANDONNE]: '#808080',
  }

  const dossiersSimple = dossiersTache.slice(0, 2)
  const dossiersRestants = dossiersTache.length - 2

  return (
    <div
      className={`tache ${isTermine ? 'completed' : ''}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="tache-row">
        <button
          className="checkbox"
          onClick={handleCheckbox}
          style={{ borderColor: etatColor[tache.etat] }}
        >
          {isTermine && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>

        <div className="tache-content" onClick={() => setModeComplet(!modeComplet)}>
          <div className="tache-line1">
            <span className={`tache-title ${isTermine ? 'title-done' : ''}`}>
              {tache.title}
            </span>
          </div>

          <div className="tache-line2">
            {tache.description && !modeComplet && (
              <span className="tache-desc-preview">{tache.description}</span>
            )}
            <div className="tache-tags">
              <span className="tache-date" style={{ color: getDateColor() }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {formatDate(tache.date_echeance)}
              </span>

              {dossiersSimple.map(d => (
                <span
                  key={d.id}
                  className="tache-project-tag"
                  onClick={(e) => { e.stopPropagation(); onToggleFiltreDossier(d.id) }}
                >
                  <span className="tag-dot" style={{ background: COULEURS_DOSSIER[d.color] || d.color }} />
                  {d.title}
                </span>
              ))}
              {!modeComplet && dossiersRestants > 0 && (
                <span className="tache-more-tag">+{dossiersRestants}</span>
              )}
            </div>
          </div>
        </div>

        <div className={`tache-actions ${hovering ? 'visible' : ''}`}>
          <button className="tache-action-btn" onClick={() => onEditer(tache)} title="Modifier">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <select
            className="tache-etat-select"
            value={tache.etat}
            onChange={e => onChangerEtat(tache.id, e.target.value)}
            title="Changer le statut"
          >
            {Object.values(ETATS).map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {modeComplet && (
        <div className="tache-expanded">
          {tache.description && (
            <p className="tache-description">{tache.description}</p>
          )}

          <div className="tache-details">
            <div className="detail-row">
              <span className="detail-label">Créé le</span>
              <span className="detail-value">{formatDate(tache.date_creation)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Statut</span>
              <span className="detail-value etat-badge" style={{ color: etatColor[tache.etat] }}>
                {tache.etat}
              </span>
            </div>
            {tache.equipiers && tache.equipiers.length > 0 && (
              <div className="detail-row">
                <span className="detail-label">Équipiers</span>
                <div className="equipiers-list">
                  {tache.equipiers.map((e, i) => (
                    <span key={i} className="equipier-chip">{e.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="tache-dossiers-complet">
            <span className="detail-label">Projets</span>
            <div className="dossier-tags-list">
              {dossiersTache.map(d => (
                <span
                  key={d.id}
                  className="tache-project-tag removable"
                  onClick={() => onToggleFiltreDossier(d.id)}
                >
                  <span className="tag-dot" style={{ background: COULEURS_DOSSIER[d.color] || d.color }} />
                  {d.title}
                  <button
                    className="tag-remove"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSupprimerRelation(tache.id, d.id)
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {!showAddDossier ? (
                dossiersDisponibles.length > 0 && (
                  <button className="add-project-btn" onClick={() => setShowAddDossier(true)}>
                    + projet
                  </button>
                )
              ) : (
                <div className="add-project-dropdown">
                  {dossiersDisponibles.map(d => (
                    <button
                      key={d.id}
                      className="dropdown-item"
                      onClick={() => {
                        onAjouterRelation(tache.id, d.id)
                        setShowAddDossier(false)
                      }}
                    >
                      <span className="tag-dot" style={{ background: COULEURS_DOSSIER[d.color] || d.color }} />
                      {d.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tache
