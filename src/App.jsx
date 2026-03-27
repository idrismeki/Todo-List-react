import { useState, useEffect } from 'react'
import backupData from './data/backup.json'
import { ETATS, ETAT_TERMINE, TRI_OPTIONS, COULEURS_DOSSIER } from './constants'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import List from './components/List/List'
import Filtre from './components/Filtre/Filtre'
import Tri from './components/Tri/Tri'
import Modal from './components/Modal/Modal'
import DossierList from './components/DossierList/DossierList'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  const [taches, setTaches] = useState([])
  const [dossiers, setDossiers] = useState([])
  const [relations, setRelations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('tache')
  const [editingTache, setEditingTache] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [activeView, setActiveView] = useState('inbox')

  const [filtreEnCours, setFiltreEnCours] = useState(true)
  const [filtreEtats, setFiltreEtats] = useState([])
  const [filtreDossiers, setFiltreDossiers] = useState([])
  const [showFiltre, setShowFiltre] = useState(false)

  const [tri, setTri] = useState(TRI_OPTIONS.DATE_ECHEANCE)
  const [triDesc, setTriDesc] = useState(true)

  useEffect(() => {
    chargerBackup()
  }, [])

  const chargerBackup = () => {
    setTaches(backupData.taches.map(t => ({
      ...t,
      equipiers: t.equipiers || []
    })))
    setDossiers(backupData.dossiers)
    setRelations(backupData.relations)
  }

  const resetDonnees = () => {
    if (window.confirm('Êtes-vous sûr(e) ? Toutes les données seront réinitialisées.')) {
      setTaches([])
      setDossiers([])
      setRelations([])
    }
  }

  const getDossiersDeTache = (tacheId) => {
    const dossierIds = relations
      .filter(r => r.tache === tacheId)
      .map(r => r.dossier)
    return dossiers.filter(d => dossierIds.includes(d.id))
  }

  const getTachesFiltrees = () => {
    let result = [...taches]

    if (filtreEnCours) {
      result = result.filter(t => !ETAT_TERMINE.includes(t.etat))
    }

    if (filtreEtats.length > 0) {
      result = result.filter(t => filtreEtats.includes(t.etat))
    }

    // Filtre par vue active (dossier sélectionné dans la sidebar)
    if (typeof activeView === 'number') {
      result = result.filter(t => {
        const tacheDossiers = relations
          .filter(r => r.tache === t.id)
          .map(r => r.dossier)
        return tacheDossiers.includes(activeView)
      })
    } else if (activeView === 'today') {
      const today = new Date().toISOString().split('T')[0]
      result = result.filter(t => t.date_echeance <= today)
    }

    if (filtreDossiers.length > 0) {
      result = result.filter(t => {
        const tacheDossiers = relations
          .filter(r => r.tache === t.id)
          .map(r => r.dossier)
        return filtreDossiers.some(fd => tacheDossiers.includes(fd))
      })
    }

    const uneSemaineAvant = new Date()
    uneSemaineAvant.setDate(uneSemaineAvant.getDate() - 7)
    result = result.filter(t => new Date(t.date_echeance) >= uneSemaineAvant)

    result.sort((a, b) => {
      if (tri === TRI_OPTIONS.NOM) {
        const valA = a.title.toLowerCase()
        const valB = b.title.toLowerCase()
        return triDesc ? valB.localeCompare(valA) : valA.localeCompare(valB)
      } else {
        const valA = new Date(a[tri])
        const valB = new Date(b[tri])
        return triDesc ? valB - valA : valA - valB
      }
    })

    return result
  }

  const ajouterTache = (nouvelleTache) => {
    const newId = taches.length > 0 ? Math.max(...taches.map(t => t.id)) + 1 : 101
    const tache = {
      id: newId,
      ...nouvelleTache,
      date_creation: new Date().toISOString().split('T')[0],
      equipiers: nouvelleTache.equipiers || [],
    }
    setTaches([...taches, tache])

    const dossierIds = nouvelleTache.dossierIds ? [...nouvelleTache.dossierIds] : []

    // Si on est sur la vue d'un dossier, l'associer automatiquement
    if (typeof activeView === 'number' && !dossierIds.includes(activeView)) {
      dossierIds.push(activeView)
    }

    if (dossierIds.length > 0) {
      setRelations(prev => [
        ...prev,
        ...dossierIds.map(dossierId => ({ tache: newId, dossier: dossierId }))
      ])
    }

    setShowModal(false)
  }

  const modifierTache = (tacheModifiee) => {
    setTaches(taches.map(t => t.id === tacheModifiee.id ? { ...t, ...tacheModifiee } : t))
    setEditingTache(null)
    setShowModal(false)
  }

  const changerEtat = (tacheId, nouvelEtat) => {
    setTaches(taches.map(t => t.id === tacheId ? { ...t, etat: nouvelEtat } : t))
  }

  const ajouterRelation = (tacheId, dossierId) => {
    setRelations(prev => {
      if (prev.find(r => r.tache === tacheId && r.dossier === dossierId)) return prev
      return [...prev, { tache: tacheId, dossier: dossierId }]
    })
  }

  const supprimerRelation = (tacheId, dossierId) => {
    setRelations(relations.filter(r => !(r.tache === tacheId && r.dossier === dossierId)))
  }

  const ajouterDossier = (nouveauDossier) => {
    const newId = dossiers.length > 0 ? Math.max(...dossiers.map(d => d.id)) + 1 : 201
    setDossiers([...dossiers, { id: newId, ...nouveauDossier }])
    setShowModal(false)
  }

  const modifierDossier = (dossierModifie) => {
    setDossiers(dossiers.map(d => d.id === dossierModifie.id ? { ...d, ...dossierModifie } : d))
  }

  const supprimerDossier = (dossierId) => {
    if (window.confirm('Supprimer ce dossier ?')) {
      setDossiers(dossiers.filter(d => d.id !== dossierId))
      setRelations(relations.filter(r => r.dossier !== dossierId))
      if (activeView === dossierId) setActiveView('inbox')
    }
  }

  const toggleFiltreEtat = (etat) => {
    setFiltreEtats(prev =>
      prev.includes(etat) ? prev.filter(e => e !== etat) : [...prev, etat]
    )
  }

  const toggleFiltreDossier = (dossierId) => {
    setFiltreDossiers(prev =>
      prev.includes(dossierId) ? prev.filter(id => id !== dossierId) : [...prev, dossierId]
    )
  }

  const ouvrirModalTache = () => {
    setEditingTache(null)
    setModalType('tache')
    setShowModal(true)
  }

  const ouvrirModalDossier = () => {
    setModalType('dossier')
    setShowModal(true)
  }

  const ouvrirEdition = (tache) => {
    setEditingTache(tache)
    setModalType('tache')
    setShowModal(true)
  }

  const nbTotal = taches.length
  const nbNonFinis = taches.filter(t => !ETAT_TERMINE.includes(t.etat)).length

  const getViewTitle = () => {
    if (activeView === 'inbox') return 'Boîte de réception'
    if (activeView === 'today') return "Aujourd'hui"
    if (activeView === 'dossiers') return 'Dossiers'
    const dossier = dossiers.find(d => d.id === activeView)
    return dossier ? dossier.title : 'Tâches'
  }

  const getViewColor = () => {
    if (typeof activeView === 'number') {
      const dossier = dossiers.find(d => d.id === activeView)
      return dossier ? COULEURS_DOSSIER[dossier.color] : null
    }
    return null
  }

  const isDossierView = activeView === 'dossiers'

  return (
    <div className="app">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        nbTotal={nbTotal}
        nbNonFinis={nbNonFinis}
        taches={taches}
        onReset={resetDonnees}
      />

      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          dossiers={dossiers}
          relations={relations}
          activeView={activeView}
          onChangeView={setActiveView}
          onAjouterDossier={ouvrirModalDossier}
          taches={taches}
          nbNonFinis={nbNonFinis}
        />

        <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="content-header">
            <div className="content-title-row">
              <h1 className="content-title" style={getViewColor() ? { color: getViewColor() } : {}}>
                {getViewTitle()}
              </h1>
              <span className="content-count">{getTachesFiltrees().length}</span>
            </div>
            <div className="content-actions">
              <button
                className={`action-btn ${showFiltre ? 'active' : ''}`}
                onClick={() => setShowFiltre(!showFiltre)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filtrer
              </button>
              <Tri
                tri={tri}
                triDesc={triDesc}
                onChangeTri={setTri}
                onToggleDirection={() => setTriDesc(!triDesc)}
              />
            </div>
          </div>

          {showFiltre && (
            <Filtre
              filtreEnCours={filtreEnCours}
              onToggleEnCours={() => setFiltreEnCours(!filtreEnCours)}
              filtreEtats={filtreEtats}
              onToggleEtat={toggleFiltreEtat}
              filtreDossiers={filtreDossiers}
              onToggleDossier={toggleFiltreDossier}
              dossiers={dossiers}
            />
          )}

          {isDossierView ? (
            <DossierList
              dossiers={dossiers}
              onModifier={modifierDossier}
              onSupprimer={supprimerDossier}
              relations={relations}
              taches={taches}
            />
          ) : (
            <List
              taches={getTachesFiltrees()}
              getDossiersDeTache={getDossiersDeTache}
              onChangerEtat={changerEtat}
              onEditer={ouvrirEdition}
              onAjouterRelation={ajouterRelation}
              onSupprimerRelation={supprimerRelation}
              dossiers={dossiers}
              onToggleFiltreDossier={toggleFiltreDossier}
            />
          )}
        </main>
      </div>

      <Footer
        onAjouterTache={ouvrirModalTache}
        onAjouterDossier={ouvrirModalDossier}
      />

      {showModal && (
        <Modal
          type={modalType}
          onClose={() => { setShowModal(false); setEditingTache(null) }}
          onAjouterTache={ajouterTache}
          onModifierTache={modifierTache}
          onAjouterDossier={ajouterDossier}
          dossiers={dossiers}
          editingTache={editingTache}
        />
      )}
    </div>
  )
}

export default App
