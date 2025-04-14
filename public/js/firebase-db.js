// Gestion des données avec Firestore

// Récupération et affichage des chiens à partir de Firestore
function fetchAndDisplayDogs() {
  db.collection('chiens').get()
    .then((querySnapshot) => {
      // Vider les conteneurs
      const container = document.getElementById('chiens-container');
      const allContainer = document.getElementById('all-chiens-container');
      
      container.innerHTML = '';
      allContainer.innerHTML = '';
      
      let count = 0;
      
      querySnapshot.forEach((doc) => {
        const chien = doc.data();
        chien.id = doc.id;
        
        const card = createDogCard(chien);
        
        // Ajouter au conteneur principal (3 premiers)
        if (count < 3) {
          container.appendChild(card.cloneNode(true));
        }
        
        // Ajouter au conteneur "tous les chiens"
        allContainer.appendChild(card);
        
        count++;
      });
      
      // Si aucun chien, afficher un message
      if (count === 0) {
        const message = document.createElement('div');
        message.className = 'col-span-full p-6 bg-white rounded-xl shadow-lg text-center';
        message.innerHTML = `
          <p class="text-gray-700">Aucun chien disponible pour le moment.</p>
          <button id="addDogBtn" class="mt-4 px-4 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
            Ajouter un chien
          </button>
        `;
        
        container.appendChild(message.cloneNode(true));
        allContainer.appendChild(message);
        
        // Ajouter le gestionnaire d'événement
        document.querySelectorAll('#addDogBtn').forEach(btn => {
          btn.addEventListener('click', () => {
            showTab('profil');
            // Vérifier si l'utilisateur est connecté
            if (auth.currentUser) {
              scrollToInscriptionChien();
            }
          });
        });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des chiens: ", error);
    });
}

// Récupération et affichage des éleveurs à partir de Firestore
function fetchAndDisplayEleveurs() {
  db.collection('eleveurs').get()
    .then((querySnapshot) => {
      const container = document.getElementById('eleveurs-container');
      container.innerHTML = '';
      
      let count = 0;
      
      querySnapshot.forEach((doc) => {
        const eleveur = doc.data();
        eleveur.id = doc.id;
        
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-lg p-4 transition hover:shadow-xl';
        div.innerHTML = `
          <h3 class="font-bold text-gray-800">${eleveur.nom}</h3>
          <p class="text-sm text-gray-700 mt-1">${eleveur.localisation}</p>
          <p class="text-sm text-gray-700">Cheptel: ${eleveur.cheptel}</p>
          <p class="text-sm text-gray-700 mt-2">${eleveur.description}</p>
          <div class="mt-3 flex justify-between items-center">
            <span class="text-xs text-gray-700">Contact: ${eleveur.contact}</span>
            <button class="flex items-center gap-1 text-sm font-medium text-basque-red hover:text-basque-red-dark contact-eleveur-btn" data-id="${eleveur.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Contacter
            </button>
          </div>
        `;
        
        container.appendChild(div);
        count++;
        
        // Ajouter le gestionnaire d'événement pour le bouton de contact
        div.querySelector('.contact-eleveur-btn').addEventListener('click', () => {
          // Vérifier si l'utilisateur est connecté
          if (auth.currentUser) {
            // Afficher un formulaire de contact
            showContactForm(eleveur);
          } else {
            // Rediriger vers la page de profil pour se connecter
            showTab('profil');
            showMessage('Veuillez vous connecter pour contacter l\'éleveur.', 'warning');
          }
        });
      });
      
      // Si aucun éleveur, afficher un message
      if (count === 0) {
        const message = document.createElement('div');
        message.className = 'col-span-full p-6 bg-white rounded-xl shadow-lg text-center';
        message.innerHTML = `
          <p class="text-gray-700">Aucun éleveur n'a encore publié de recherche.</p>
          <button id="addEleveurBtn" class="mt-4 px-4 py-2 rounded-lg font-medium text-white bg-basque-green hover:bg-basque-green-dark transition">
            Ajouter un élevage
          </button>
        `;
        
        container.appendChild(message);
        
        // Ajouter le gestionnaire d'événement
        document.getElementById('addEleveurBtn').addEventListener('click', () => {
          showTab('profil');
          // Vérifier si l'utilisateur est connecté
          if (auth.currentUser) {
            scrollToInscriptionEleveur();
          }
        });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des éleveurs: ", error);
    });
}

// Initialisation et appel des fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Ajouter des données initiales si la base est vide
  initializeDatabase();
  
  // Charger les données
  fetchAndDisplayDogs();
  fetchAndDisplayEleveurs();
});

// Initialisation de la base de données avec des données de démo si nécessaire
function initializeDatabase() {
  // Vérifier si la collection "chiens" existe et a des documents
  db.collection('chiens').limit(1).get()
    .then((snapshot) => {
      if (snapshot.empty) {
        // Ajouter des chiens de démo
        const chiensDemo = [
          { 
            nom: 'Max', 
            race: 'Border Collie', 
            age: '2 ans', 
            sexe: 'Mâle',
            localisation: 'Refuge de Bayonne',
            description: 'Max est un Border Collie énergique avec un fort instinct de troupeau. Il a déjà travaillé avec des moutons et apprend vite.',
            statut: 'Disponible',
            evaluation: 'Non évalué',
            createdAt: new Date()
          },
          { 
            nom: 'Luna', 
            race: 'Border Collie', 
            age: '3 ans', 
            sexe: 'Femelle',
            localisation: 'Particulier à Saint-Jean-de-Luz',
            description: 'Luna est une chienne calme et attentive. Son ancien propriétaire l\'utilisait pour le troupeau mais ne peut plus la garder.',
            statut: 'En évaluation',
            evaluation: 'En cours',
            createdAt: new Date()
          },
          { 
            nom: 'Orion', 
            race: 'Berger des Pyrénées', 
            age: '1 an', 
            sexe: 'Mâle',
            localisation: 'Refuge d\'Anglet',
            description: 'Jeune berger pyrénéen avec beaucoup d\'énergie. N\'a jamais travaillé avec des troupeaux mais montre des prédispositions.',
            statut: 'Disponible',
            evaluation: 'Non évalué',
            createdAt: new Date()
          }
        ];
        
        // Ajouter chaque chien
        chiensDemo.forEach(chien => {
          db.collection('chiens').add(chien)
            .then((docRef) => {
              console.log("Chien ajouté avec ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Erreur lors de l'ajout du chien: ", error);
            });
        });
      }
    });
  
  // Vérifier si la collection "eleveurs" existe et a des documents
  db.collection('eleveurs').limit(1).get()
    .then((snapshot) => {
      if (snapshot.empty) {
        // Ajouter des éleveurs de démo
        const eleveursDemo = [
          {
            nom: 'Ferme Etchegaray',
            localisation: 'Hasparren',
            cheptel: 'Moutons',
            description: 'Exploitation familiale de 150 brebis laitières, recherche un chien de troupeau expérimenté.',
            contact: 'Jean Etchegaray',
            createdAt: new Date()
          },
          {
            nom: 'GAEC des Montagnes',
            localisation: 'Tardets-Sorholus',
            cheptel: 'Moutons et quelques vaches',
            description: 'Élevage en montagne, besoin d\'un chien endurant et habitué au terrain difficile.',
            contact: 'Marie Lasalle',
            createdAt: new Date()
          }
        ];
        
        // Ajouter chaque éleveur
        eleveursDemo.forEach(eleveur => {
          db.collection('eleveurs').add(eleveur)
            .then((docRef) => {
              console.log("Éleveur ajouté avec ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Erreur lors de l'ajout de l'éleveur: ", error);
            });
        });
      }
    });
}

// Afficher le formulaire de contact pour un éleveur
function showContactForm(eleveur) {
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="contactModalOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 z-10">
      <button id="closeContactModalBtn" class="absolute top-4 right-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
