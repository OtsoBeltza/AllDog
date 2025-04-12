import React, { useState } from 'react';
import { Search, Menu, X, MessageCircle, Check, AlertTriangle, User, Settings, LogOut, Home, Heart, Shield, Users } from 'lucide-react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleFilter = () => setFilterOpen(!filterOpen);
  
  // Couleurs basées sur le Pays Basque (rouge et vert)
  const primaryColor = 'bg-red-700';
  const secondaryColor = 'bg-green-700';
  const accentColor = 'bg-red-600';
  
  // Données d'exemple
  const chiens = [
    { 
      id: 1, 
      nom: 'Max', 
      race: 'Border Collie', 
      age: '2 ans', 
      sexe: 'Mâle',
      localisation: 'Refuge de Bayonne',
      description: 'Max est un Border Collie énergique avec un fort instinct de troupeau. Il a déjà travaillé avec des moutons et apprend vite.',
      statut: 'Disponible',
      evaluation: 'Non évalué',
      img: '/api/placeholder/400/320'
    },
    { 
      id: 2, 
      nom: 'Luna', 
      race: 'Border Collie', 
      age: '3 ans', 
      sexe: 'Femelle',
      localisation: 'Particulier à Saint-Jean-de-Luz',
      description: 'Luna est une chienne calme et attentive. Son ancien propriétaire l\'utilisait pour le troupeau mais ne peut plus la garder.',
      statut: 'En évaluation',
      evaluation: 'En cours',
      img: '/api/placeholder/400/320'
    },
    { 
      id: 3, 
      nom: 'Orion', 
      race: 'Berger des Pyrénées', 
      age: '1 an', 
      sexe: 'Mâle',
      localisation: 'Refuge d\'Anglet',
      description: 'Jeune berger pyrénéen avec beaucoup d\'énergie. N\'a jamais travaillé avec des troupeaux mais montre des prédispositions.',
      statut: 'Disponible',
      evaluation: 'Non évalué',
      img: '/api/placeholder/400/320'
    },
    { 
      id: 4, 
      nom: 'Kiki', 
      race: 'Border Collie/Beauceron', 
      age: '4 ans', 
      sexe: 'Femelle',
      localisation: 'Particulier à Dax',
      description: 'Kiki a travaillé pendant 3 ans avec un troupeau de brebis. Très expérimentée et calme avec le bétail.',
      statut: 'Évalué',
      evaluation: 'Excellent - Prêt pour le travail',
      img: '/api/placeholder/400/320'
    }
  ];
  
  const eleveurs = [
    {
      id: 1,
      nom: 'Ferme Etchegaray',
      localisation: 'Hasparren',
      cheptel: 'Moutons',
      description: 'Exploitation familiale de 150 brebis laitières, recherche un chien de troupeau expérimenté.',
      contact: 'Jean Etchegaray'
    },
    {
      id: 2,
      nom: 'GAEC des Montagnes',
      localisation: 'Tardets-Sorholus',
      cheptel: 'Moutons et quelques vaches',
      description: 'Élevage en montagne, besoin d\'un chien endurant et habitué au terrain difficile.',
      contact: 'Marie Lasalle'
    },
    {
      id: 3,
      nom: 'Ferme Mendiburu',
      localisation: 'Saint-Jean-Pied-de-Port',
      cheptel: 'Brebis Manech',
      description: 'Recherche un jeune chien à former pour le remplacement d\'un vieux Border.',
      contact: 'Pierre Mendiburu'
    }
  ];

  const renderDogCard = (chien) => (
    <div 
      key={chien.id} 
      className="rounded-xl shadow-lg overflow-hidden bg-white cursor-pointer transform transition hover:scale-105"
      onClick={() => setSelectedDog(chien)}
    >
      <img src={chien.img} alt={chien.nom} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{chien.nom}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            chien.statut === 'Disponible' ? 'bg-blue-100 text-blue-800' : 
            chien.statut === 'En évaluation' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'
          }`}>
            {chien.statut}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{chien.race}, {chien.age}</p>
        <p className="text-sm text-gray-600">{chien.localisation}</p>
        <div className="mt-3 flex items-center">
          {chien.evaluation === 'Non évalué' ? (
            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
          ) : chien.evaluation === 'En cours' ? (
            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin mr-1"></div>
          ) : (
            <Check className="w-4 h-4 text-green-500 mr-1" />
          )}
          <span className="text-xs text-gray-500">{chien.evaluation}</span>
        </div>
      </div>
    </div>
  );
  
  const renderEleveurCard = (eleveur) => (
    <div key={eleveur.id} className="bg-white rounded-xl shadow-lg p-4 transition hover:shadow-xl">
      <h3 className="font-bold text-gray-800">{eleveur.nom}</h3>
      <p className="text-sm text-gray-600 mt-1">{eleveur.localisation}</p>
      <p className="text-sm text-gray-600">Cheptel: {eleveur.cheptel}</p>
      <p className="text-sm text-gray-700 mt-2">{eleveur.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">Contact: {eleveur.contact}</span>
        <button className="flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-900">
          <MessageCircle className="w-4 h-4" />
          Contacter
        </button>
      </div>
    </div>
  );
  
  const renderContent = () => {
    if (selectedDog) {
      return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <img src={selectedDog.img} alt={selectedDog.nom} className="w-full h-64 object-cover" />
            <button 
              onClick={() => setSelectedDog(null)}
              className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedDog.nom}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedDog.statut === 'Disponible' ? 'bg-blue-100 text-blue-800' : 
                selectedDog.statut === 'En évaluation' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {selectedDog.statut}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-gray-600">
                <span className="text-sm font-medium">Race</span>
                <p>{selectedDog.race}</p>
              </div>
              <div className="text-gray-600">
                <span className="text-sm font-medium">Âge</span>
                <p>{selectedDog.age}</p>
              </div>
              <div className="text-gray-600">
                <span className="text-sm font-medium">Sexe</span>
                <p>{selectedDog.sexe}</p>
              </div>
              <div className="text-gray-600">
                <span className="text-sm font-medium">Localisation</span>
                <p>{selectedDog.localisation}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Description</h3>
              <p className="mt-2 text-gray-600">{selectedDog.description}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">Évaluation</h3>
              <div className="mt-2 p-4 rounded-lg bg-gray-50">
                {selectedDog.evaluation === 'Non évalué' ? (
                  <div className="flex items-center text-yellow-700">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <p>Ce chien n'a pas encore été évalué. Contactez-nous pour planifier une évaluation.</p>
                  </div>
                ) : selectedDog.evaluation === 'En cours' ? (
                  <div className="flex items-center text-blue-700">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mr-2"></div>
                    <p>L'évaluation de ce chien est en cours. Les résultats seront bientôt disponibles.</p>
                  </div>
                ) : (
                  <div className="flex items-center text-green-700">
                    <Check className="w-5 h-5 mr-2" />
                    <p>{selectedDog.evaluation}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button className={`px-4 py-2 rounded-lg font-medium text-white ${primaryColor} hover:bg-red-800 transition`}>
                Contacter le propriétaire
              </button>
              <button className={`px-4 py-2 rounded-lg font-medium text-white ${secondaryColor} hover:bg-green-800 transition`}>
                Demander une évaluation
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'accueil':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-r from-red-700 to-red-900 text-white shadow-lg">
              <h2 className="text-2xl font-bold">Bienvenue sur Berger Connect</h2>
              <p className="mt-2">Votre plateforme de mise en relation pour chiens de troupeau au Pays Basque, Béarn et Landes.</p>
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={() => setActiveTab('chiens')}
                  className="px-4 py-2 bg-white text-red-700 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Voir les chiens disponibles
                </button>
                <button
                  onClick={() => setActiveTab('eleveurs')}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition"
                >
                  Voir les éleveurs
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800">Derniers chiens ajoutés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chiens.slice(0, 3).map(renderDogCard)}
            </div>
            
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => setActiveTab('chiens')}
                className="px-4 py-2 text-red-700 font-medium hover:underline"
              >
                Voir tous les chiens →
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mt-8">Notre service d'évaluation</h3>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600">
                En tant qu'éducateur canin spécialisé en chiens de troupeau, je propose un service d'évaluation complet
                pour s'assurer que chaque chien est placé dans un environnement adapté à ses capacités.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-red-700" />
                  </div>
                  <h4 className="font-medium text-gray-800">Évaluation comportementale</h4>
                  <p className="mt-1 text-sm text-gray-600">Analyse du tempérament et des aptitudes naturelles du chien.</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-green-700" />
                  </div>
                  <h4 className="font-medium text-gray-800">Test avec le troupeau</h4>
                  <p className="mt-1 text-sm text-gray-600">Mise en situation réelle avec différents types de bétail.</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Heart className="w-6 h-6 text-blue-700" />
                  </div>
                  <h4 className="font-medium text-gray-800">Compatibilité</h4>
                  <p className="mt-1 text-sm text-gray-600">Recommandations personnalisées pour le placement idéal.</p>
                </div>
              </div>
              <button className={`mt-6 px-4 py-2 rounded-lg font-medium text-white ${primaryColor} hover:bg-red-800 transition`}>
                En savoir plus sur l'évaluation
              </button>
            </div>
          </div>
        );
      case 'chiens':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Chiens disponibles</h2>
              <button 
                onClick={toggleFilter}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
              >
                <Search className="w-4 h-4" />
                Filtrer
              </button>
            </div>
            
            {filterOpen && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="">Toutes les races</option>
                      <option value="border">Border Collie</option>
                      <option value="berger">Berger des Pyrénées</option>
                      <option value="aussie">Berger Australien</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="">Tous les âges</option>
                      <option value="junior">Moins de 2 ans</option>
                      <option value="adulte">2 à 5 ans</option>
                      <option value="senior">Plus de 5 ans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="">Tous les statuts</option>
                      <option value="disponible">Disponible</option>
                      <option value="evaluation">En évaluation</option>
                      <option value="evalue">Évalué</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className={`px-4 py-2 rounded-lg font-medium text-white ${primaryColor} hover:bg-red-800 transition`}>
                    Appliquer les filtres
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chiens.map(renderDogCard)}
            </div>
          </div>
        );
      case 'eleveurs':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Éleveurs recherchant un chien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eleveurs.map(renderEleveurCard)}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-800">Vous êtes éleveur ?</h3>
              <p className="mt-2 text-gray-600">
                Inscrivez-vous gratuitement pour publier votre recherche de chien de troupeau. 
                Notre service d'évaluation vous garantit un chien adapté à vos besoins.
              </p>
              <button className={`mt-4 px-4 py-2 rounded-lg font-medium text-white ${secondaryColor} hover:bg-green-800 transition`}>
                Inscription éleveur
              </button>
            </div>
          </div>
        );
      case 'profil':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mon profil</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full ${primaryColor} flex items-center justify-center text-white text-xl font-bold`}>
                  JP
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Jean Puentes</h3>
                  <p className="text-gray-600">Éducateur canin spécialisé</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-800">Mes informations</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="text-gray-700">jean.puentes@example.com</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Téléphone</span>
                      <p className="text-gray-700">06 XX XX XX XX</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Localisation</span>
                      <p className="text-gray-700">Hasparren, Pays Basque</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Spécialité</span>
                      <p className="text-gray-700">Chiens de troupeau, Border Collie</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-800">Mes services</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-500" />
                      Évaluation comportementale
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-500" />
                      Test avec troupeau
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-500" />
                      Formation de base
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-500" />
                      Suivi post-placement
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                  Modifier mon profil
                </button>
                <button className={`px-4 py-2 rounded-lg font-medium text-white ${primaryColor} hover:bg-red-800 transition`}>
                  Gérer mes annonces
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="md:hidden mr-2" onClick={toggleMenu}>
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${primaryColor} flex items-center justify-center text-white font-bold`}>BC</div>
                <span className="ml-2 text-xl font-bold text-gray-800">Berger Connect</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('accueil')} 
                className={`font-medium ${activeTab === 'accueil' ? 'text-red-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Accueil
              </button>
              <button 
                onClick={() => setActiveTab('chiens')} 
                className={`font-medium ${activeTab === 'chiens' ? 'text-red-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Chiens
              </button>
              <button 
                onClick={() => setActiveTab('eleveurs')} 
                className={`font-medium ${activeTab === 'eleveurs' ? 'text-red-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Éleveurs
              </button>
              <button 
                onClick={() => setActiveTab('profil')} 
                className={`font-medium ${activeTab === 'profil' ? 'text-red-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Mon Profil
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative rounded-full bg-gray-100 px-3 py-2 hidden md:flex items-center">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="ml-2 bg-transparent border-none focus:outline-none text-sm w-32 lg:w-64"
                />
              </div>
              
              <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={toggleMenu}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg ${primaryColor} flex items-center justify-center text-white font-bold text-sm`}>BC</div>
                  <span className="ml-2 font-bold text-gray-800">Berger Connect</span>
                </div>
                <button onClick={toggleMenu}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {setActiveTab('accueil'); toggleMenu();}} 
                    className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'accueil' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Accueil
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {setActiveTab('chiens'); toggleMenu();}} 
                    className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'chiens' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 9l7.5-5 7.5 5v8.5c0 .83-.67 1.5-1.5 1.5h-12c-.83 0-1.5-.67-1.5-1.5V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="16" cy="14" r="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
