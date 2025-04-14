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
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800">Contacter ${eleveur.nom}</h3>
      <p class="mt-2 text-gray-700">Votre message sera envoyé à ${eleveur.contact}.</p>
      
      <form id="contactForm" class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Sujet</label>
          <input type="text" id="contactSubject" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Demande d'information sur votre recherche de chien">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="contactMessage" rows="4" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Détaillez votre message ici..."></textarea>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="contactCopy" class="h-4 w-4 text-basque-red focus:ring-basque-red border-gray-300 rounded">
          <label for="contactCopy" class="ml-2 block text-sm text-gray-700">Recevoir une copie de ce message</label>
        </div>
        <button type="submit" id="sendContactBtn" class="w-full px-4 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
          Envoyer le message
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer la modale
  document.getElementById('closeContactModalBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('contactModalOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Gestionnaire d'événements pour l'envoi du formulaire
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    const sendCopy = document.getElementById('contactCopy').checked;
    
    if (subject && message) {
      // Changer le bouton en indicateur de chargement
      const sendBtn = document.getElementById('sendContactBtn');
      sendBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
      sendBtn.disabled = true;
      
      // Envoyer le message
      db.collection('messages').add({
        from: auth.currentUser.uid,
        to: eleveur.id,
        subject: subject,
        message: message,
        sendCopy: sendCopy,
        status: 'sent',
        createdAt: new Date()
      })
      .then(() => {
        // Fermer la modale
        document.body.removeChild(content);
        document.body.style.overflow = '';
        
        // Afficher un message de succès
        showMessage('Votre message a été envoyé avec succès.', 'success');
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du message: ", error);
        sendBtn.textContent = 'Envoyer le message';
        sendBtn.disabled = false;
        showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
      });
    } else {
      showMessage('Veuillez remplir tous les champs.', 'warning');
    }
  });
}
