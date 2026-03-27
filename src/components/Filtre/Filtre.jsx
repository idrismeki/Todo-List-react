import { ETATS, COULEURS_DOSSIER } from '../../constants'
import './Filtre.css'

function Filtre({ filtreEnCours, onToggleEnCours, filtreEtats, onToggleEtat, filtreDossiers, onToggleDossier, dossiers }) {
  return (
    <div className="filtre">
      <div className="filtre-row">
        <button
          className={`filtre-chip ${filtreEnCours ? 'active' : ''}`}
          onClick={onToggleEnCours}
        >
          En cours uniquement
        </button>

        <span className="filtre-sep" />

        {Object.values(ETATS).map(etat => (
          <button
            key={etat}
            className={`filtre-chip ${filtreEtats.includes(etat) ? 'active' : ''}`}
            onClick={() => onToggleEtat(etat)}
          >
            {etat}
          </button>
        ))}

        {dossiers.length > 0 && (
          <>
            <span className="filtre-sep" />
            {dossiers.map(d => (
              <button
                key={d.id}
                className={`filtre-chip filtre-chip-project ${filtreDossiers.includes(d.id) ? 'active' : ''}`}
                onClick={() => onToggleDossier(d.id)}
              >
                <span className="chip-dot" style={{ background: COULEURS_DOSSIER[d.color] || d.color }} />
                {d.title}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Filtre
