import Dossier from '../Dossier/Dossier'
import './DossierList.css'

function DossierList({ dossiers, onModifier, onSupprimer, relations, taches }) {
  const getNbTaches = (dossierId) => {
    return relations.filter(r => r.dossier === dossierId).length
  }

  if (dossiers.length === 0) {
    return (
      <div className="dossier-list-empty">
        <p>Aucun projet pour le moment</p>
      </div>
    )
  }

  return (
    <div className="dossier-list">
      {dossiers.map(dossier => (
        <Dossier
          key={dossier.id}
          dossier={dossier}
          onModifier={onModifier}
          onSupprimer={onSupprimer}
          nbTaches={getNbTaches(dossier.id)}
        />
      ))}
    </div>
  )
}

export default DossierList
