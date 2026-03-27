import Tache from '../Tache/Tache'
import './List.css'

function List({ taches, getDossiersDeTache, onChangerEtat, onEditer, onAjouterRelation, onSupprimerRelation, dossiers, showEcheance = true }) {
  if (taches.length === 0) {
    return (
      <div className="list-empty">
        <div className="empty-illustration">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        </div>
        <p className="empty-title">Tout est en ordre</p>
        <p className="empty-desc">Profitez de votre journée</p>
      </div>
    )
  }

  return (
    <div className="list">
      {taches.map(tache => (
        <Tache
          key={tache.id}
          tache={tache}
          dossiersTache={getDossiersDeTache(tache.id)}
          onChangerEtat={onChangerEtat}
          onEditer={onEditer}
          onAjouterRelation={onAjouterRelation}
          onSupprimerRelation={onSupprimerRelation}
          dossiers={dossiers}
          showEcheance={showEcheance}
        />
      ))}
    </div>
  )
}

export default List
