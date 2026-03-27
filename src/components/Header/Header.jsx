import { ETATS } from '../../constants'
import './Header.css'

function Header({ onToggleSidebar, nbTotal, nbNonFinis, taches, onReset }) {
  // Camembert
  const etatsCount = Object.values(ETATS).map(etat => ({
    label: etat,
    count: taches.filter(t => t.etat === etat).length
  })).filter(e => e.count > 0)

  const etatColors = {
    [ETATS.NOUVEAU]: '#246fe0',
    [ETATS.EN_COURS]: '#eb8909',
    [ETATS.REUSSI]: '#058527',
    [ETATS.EN_ATTENTE]: '#a855f7',
    [ETATS.ABANDONNE]: '#808080',
  }

  let cumulAngle = 0
  const segments = etatsCount.map(e => {
    const pct = (e.count / taches.length) * 100
    const segment = { ...e, pct, color: etatColors[e.label], offset: cumulAngle }
    cumulAngle += pct
    return segment
  })

  const conicGradient = segments.length > 0
    ? `conic-gradient(${segments.map(s => `${s.color} ${s.offset}% ${s.offset + s.pct}%`).join(', ')})`
    : '#555'

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-btn menu-btn" onClick={onToggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="header-logo">Todo-List</span>
      </div>

      <div className="header-center">
        <div className="header-stat">
          <span className="header-stat-num">{nbNonFinis}</span>
          <span className="header-stat-label">en cours</span>
        </div>
        <div className="header-stat-sep" />
        <div className="header-stat">
          <span className="header-stat-num">{nbTotal}</span>
          <span className="header-stat-label">total</span>
        </div>

        {taches.length > 0 && (
          <div className="header-pie-wrapper">
            <div className="header-pie" style={{ background: conicGradient }} />
            <div className="header-pie-legend">
              {segments.map(s => (
                <span key={s.label} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: s.color }} />
                  {s.label} ({s.count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="header-btn reset-btn" onClick={onReset} title="Réinitialiser">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-11.36L1 10"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
