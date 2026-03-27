import { COULEURS_DOSSIER, ETAT_TERMINE } from '../../constants'
import './Sidebar.css'

function Sidebar({ isOpen, dossiers, relations, activeView, onChangeView, onAjouterDossier, taches, nbNonFinis }) {
  const getNbTachesDossier = (dossierId) => {
    const tacheIds = relations.filter(r => r.dossier === dossierId).map(r => r.tache)
    return taches.filter(t => tacheIds.includes(t.id) && !ETAT_TERMINE.includes(t.etat)).length
  }

  const todayCount = taches.filter(t => {
    const today = new Date().toISOString().split('T')[0]
    return t.date_echeance <= today && !ETAT_TERMINE.includes(t.etat)
  }).length

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${activeView === 'inbox' ? 'active' : ''}`}
          onClick={() => onChangeView('inbox')}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
          </svg>
          <span className="sidebar-label">Boîte de réception</span>
          {nbNonFinis > 0 && <span className="sidebar-count">{nbNonFinis}</span>}
        </button>

        <button
          className={`sidebar-item ${activeView === 'today' ? 'active' : ''}`}
          onClick={() => onChangeView('today')}
        >
          <svg className="sidebar-icon today-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="sidebar-label">Aujourd'hui</span>
          {todayCount > 0 && <span className="sidebar-count today-count">{todayCount}</span>}
        </button>

        <button
          className={`sidebar-item ${activeView === 'dossiers' ? 'active' : ''}`}
          onClick={() => onChangeView('dossiers')}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span className="sidebar-label">Gérer les dossiers</span>
        </button>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="sidebar-section-title">Mes projets</span>
          <button className="sidebar-add-btn" onClick={onAjouterDossier} title="Ajouter un projet">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        <div className="sidebar-projects">
          {dossiers.map(d => (
            <button
              key={d.id}
              className={`sidebar-item sidebar-project ${activeView === d.id ? 'active' : ''}`}
              onClick={() => onChangeView(d.id)}
            >
              <span
                className="project-dot"
                style={{ background: COULEURS_DOSSIER[d.color] || d.color }}
              />
              <span className="sidebar-label">{d.title}</span>
              {getNbTachesDossier(d.id) > 0 && (
                <span className="sidebar-count">{getNbTachesDossier(d.id)}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
