// Gestion des données avec Supabase

// Récupération et affichage des chiens
async function fetchAndDisplayDogs() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase n'est pas initialisé");
    return;
  }
  
  try {
    // Récupérer les chiens depuis Supabase
    const { data: chiens, error } = await supabase
      .from('chiens')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Vider les conteneurs
    const container = document.getElementById('chiens-container');
    const allContainer = document.getElementById('all-chiens-container');
    
    if (!container || !allContainer) {
      console.error("Les conteneurs de chiens n'ont pas été trouvés");
      return;
    }
    
    container.innerHTML = '';
    allContainer.innerHTML = '';
    
    let count = 0;
    
    if (chiens && chiens.length > 0) {
      chiens.forEach((chien) => {
        const card = createDogCard(chien);
        
        // Ajouter au conteneur principal (3 premiers)
        if (count < 3) {
          container.appendChild(card.cloneNode(true));
        }
        
        // Ajouter au conteneur "tous les chiens"
        allContainer.appendChild(card);
        
        count++;
      });
    } else {
      // Si aucun chien, afficher un message
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
          const supabase = window.supabaseClient;
          if (supabase && supabase.auth.getUser()) {
            scrollToInscriptionChien();
          }
        });
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des chiens: ", error);
  }
}

// Récupération et affichage des éleveurs
async function fetchAndDisplayEleveurs() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase n'est pas initialisé");
    return;
  }
  
  try {
    // Récupérer les éleveurs depuis Supabase
    const { data: eleveurs, error } = await supabase
      .from('eleveurs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const container = document.getElementById('eleveurs-container');
    if (!container) {
      console.error("Le conteneur des éleveurs n'a pas été trouvé");
      return;
    }
    
    container.innerHTML = '';
    
    let count = 0;
    
    if (eleveurs && eleveurs.length > 0) {
      eleveurs.forEach((eleveur) => {
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
          const supabase = window.supabaseClient;
          if (!supabase) return;
          
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
              // Afficher un formulaire de contact
              showContactForm(eleveur);
            } else {
              // Rediriger vers la page de profil pour se connecter
              showTab('profil');
              showMessage('Veuillez vous connecter pour contacter l\'éleveur.', 'warning');
            }
          });
        });
      });
    } else {
      // Si aucun éleveur, afficher un message
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
      const addEleveurBtn = document.getElementById('addEleveurBtn');
      if (addEleveurBtn) {
        addEleveurBtn.addEventListener('click', () => {
          showTab('profil');
          // Vérifier si l'utilisateur est connecté
          const supabase = window.supabaseClient;
          if (!supabase) return;
          
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
              scrollToInscriptionEleveur();
            }
          });
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des éleveurs: ", error);
  }
}

// Initialisation et appel des fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si Supabase est initialisé
  if (!window.supabaseClient) {
    console.error("Supabase n'est pas initialisé lors du chargement du DOM");
    return;
  }
  
  // Charger les données
  fetchAndDisplayDogs();
  fetchAndDisplayEleveurs();
});

// Initialisation de la base de données avec des données de démo si nécessaire
// MODIFIÉ pour éviter les erreurs RLS
async function initializeDatabase() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase n'est pas initialisé");
    return;
  }
  
  try {
    // Vérifier si l'utilisateur est authentifié
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("Utilisateur non authentifié, initialisation de la base de données ignorée");
      return; // Ne pas initialiser les données si l'utilisateur n'est pas connecté
    }
    
    console.log("Vérification des données existantes...");
    
    // Vérifie si les tables ont des données mais ne tente pas d'en ajouter
    // Pour éviter les erreurs RLS
    const { data: chiens, error: chiensError } = await supabase
      .from('chiens')
      .select('id')
      .limit(1);
      
    const { data: eleveurs, error: eleveursError } = await supabase
      .from('eleveurs')
      .select('id')
      .limit(1);
    
    if (chiensError) console.error("Erreur lors de la vérification des chiens:", chiensError);
    if (eleveursError) console.error("Erreur lors de la vérification des éleveurs:", eleveursError);
    
    // Nous ne tentons plus d'insérer des données d'exemple automatiquement
    console.log("Vérification terminée - Chiens existants:", chiens?.length || 0);
    console.log("Vérification terminée - Éleveurs existants:", eleveurs?.length || 0);
  } catch (error) {
    console.error("Erreur lors de la vérification de la base de données:", error);
  }
}

// Fonction optimisée pour afficher le formulaire de contact pour un éleveur
function showContactForm(eleveur) {
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="contactModalOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-4 z-10 max-h-[90vh] overflow-auto">
      <button id="closeContactModalBtn" class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800 pr-8">Contacter ${eleveur.nom}</h3>
      <p class="mt-1 text-sm text-gray-700">Votre message sera envoyé à ${eleveur.contact}.</p>
      
      <form id="contactForm" class="mt-4 space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">Sujet</label>
          <input type="text" id="contactSubject" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Demande d'information sur votre recherche de chien" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="contactMessage" rows="3" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Détaillez votre message ici..." required></textarea>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="contactCopy" class="h-4 w-4 text-basque-red focus:ring-basque-red border-gray-300 rounded">
          <label for="contactCopy" class="ml-2 block text-sm text-gray-700">Recevoir une copie de ce message</label>
        </div>
        
        <div class="mt-4 flex justify-center">
          <button type="submit" id="sendContactBtn" class="w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
            Envoyer le message
          </button>
        </div>
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
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    const sendCopy = document.getElementById('contactCopy').checked;
    
    if (subject && message) {
      // Changer le bouton en indicateur de chargement
      const sendBtn = document.getElementById('sendContactBtn');
      sendBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
      sendBtn.disabled = true;
      
      try {
        const supabase = window.supabaseClient;
        if (!supabase) throw new Error("Supabase n'est pas initialisé");
        
        // Obtenir l'utilisateur actuel
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        // Envoyer le message
        const { error } = await supabase
          .from('messages')
          .insert([{
            from_user_id: user.id,
            to_eleveur_id: eleveur.id,
            subject: subject,
            message: message,
            send_copy: sendCopy,
            status: 'sent'
          }]);
          
        if (error) throw error;
        
        // Fermer la modale
        document.body.removeChild(content);
        document.body.style.overflow = '';
        
        // Afficher un message de succès
        showMessage('Votre message a été envoyé avec succès.', 'success');
      } catch (error) {
        console.error("Erreur lors de l'envoi du message: ", error);
        sendBtn.textContent = 'Envoyer le message';
        sendBtn.disabled = false;
        showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
      }
    } else {
      showMessage('Veuillez remplir tous les champs.', 'warning');
    }
  });
}

// Fonction pour créer une carte de chien
function createDogCard(chien) {
  const div = document.createElement('div');
  div.className = 'rounded-xl shadow-lg overflow-hidden bg-white cursor-pointer transform transition hover:scale-105';
  div.setAttribute('data-id', chien.id);
  
  // Définir différentes couleurs selon le statut
  let statusColorClass = '';
  if (chien.statut === 'Disponible') {
    statusColorClass = 'bg-blue-100 text-blue-800';
  } else if (chien.statut === 'En évaluation') {
    statusColorClass = 'bg-yellow-100 text-yellow-800';
  } else {
    statusColorClass = 'bg-green-100 text-green-800';
  }
  
  // Icône d'évaluation
  let evaluationIcon = '';
  if (chien.evaluation === 'Non évalué') {
    evaluationIcon = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500 mr-1">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;
  } else if (chien.evaluation === 'En cours') {
    evaluationIcon = `<div class="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin mr-1"></div>`;
  } else {
    evaluationIcon = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 mr-1">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  }
  
  div.innerHTML = `
    <div class="h-48 bg-gray-200 flex items-center justify-center">
      ${chien.photo_url ? `<img src="${chien.photo_url}" alt="${chien.nom}" class="w-full h-full object-cover">` : '<span class="text-gray-400">Image</span>'}
    </div>
    <div class="p-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800">${chien.nom}</h3>
        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}">
          ${chien.statut}
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">${chien.race}, ${chien.age}</p>
      <p class="text-sm text-gray-700">${chien.localisation}</p>
      <div class="mt-3 flex items-center">
        ${evaluationIcon}
        <span class="text-xs text-gray-700">${chien.evaluation}</span>
      </div>
    </div>
  `;
  
  // Ajouter un gestionnaire d'événements pour voir les détails
  div.addEventListener('click', () => showDogDetails(chien));
  
  return div;
}

// Mise à jour de la fonction showDogDetails pour ajouter les fonctionnalités demandées

// Fonction optimisée pour afficher les détails d'un chien
async function showDogDetails(chien) {
  // Vérifier si l'utilisateur est connecté
  const supabase = window.supabaseClient;
  let user = null;
  let userProfile = null;
  let isUserAdmin = false;
  
  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      user = userData.user;
      
      if (user) {
        // Récupérer le profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        userProfile = profile;
        
        // Vérifier si l'utilisateur est admin
        isUserAdmin = user.email === 'pierocarlo@gmx.fr' || (profile && profile.role === 'admin');
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
  }
  
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  // Définir différentes couleurs selon le statut
  let statusColorClass = '';
  if (chien.statut === 'Disponible') {
    statusColorClass = 'bg-blue-100 text-blue-800';
  } else if (chien.statut === 'En évaluation') {
    statusColorClass = 'bg-yellow-100 text-yellow-800';
  } else {
    statusColorClass = 'bg-green-100 text-green-800';
  }
  
  // Contenu d'évaluation
  let evaluationContent = '';
  if (chien.evaluation === 'Non évalué') {
    evaluationContent = `
      <div class="flex items-start text-yellow-700">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 flex-shrink-0 mt-1">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <p class="text-sm">Ce chien n'a pas encore été évalué. Contactez-nous pour planifier une évaluation gratuite.</p>
      </div>
    `;
  } else if (chien.evaluation === 'En cours') {
    evaluationContent = `
      <div class="flex items-start text-blue-700">
        <div class="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mr-2 flex-shrink-0 mt-1"></div>
        <p class="text-sm">L'évaluation de ce chien est en cours. Les résultats seront bientôt disponibles.</p>
      </div>
    `;
  } else {
    // Évaluation complète avec notes sous forme visuelle
    evaluationContent = `
      <div class="flex flex-col space-y-3">
        <div class="flex items-start text-green-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 flex-shrink-0 mt-1">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div>
            <p class="text-sm font-medium mb-2">Évaluation complète</p>
            <p class="text-sm">${chien.evaluation}</p>
          </div>
        </div>
        
        <div class="mt-2 grid grid-cols-2 gap-2">
          <div>
            <p class="text-xs font-medium text-gray-600">Obéissance</p>
            <div class="flex mt-1">
              ${Array.from({length: 5}, (_, i) => `
                <div class="w-6 h-6 rounded-full flex items-center justify-center mr-1 ${i < chien.obedience ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                  ${i+1}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div>
            <p class="text-xs font-medium text-gray-600">Instinct</p>
            <div class="flex mt-1">
              ${Array.from({length: 5}, (_, i) => `
                <div class="w-6 h-6 rounded-full flex items-center justify-center mr-1 ${i < chien.instinct ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                  ${i+1}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div>
            <p class="text-xs font-medium text-gray-600">Sociabilité</p>
            <div class="flex mt-1">
              ${Array.from({length: 5}, (_, i) => `
                <div class="w-6 h-6 rounded-full flex items-center justify-center mr-1 ${i < chien.sociability ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                  ${i+1}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div>
            <p class="text-xs font-medium text-gray-600">Énergie</p>
            <div class="flex mt-1">
              ${Array.from({length: 5}, (_, i) => `
                <div class="w-6 h-6 rounded-full flex items-center justify-center mr-1 ${i < chien.energy ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                  ${i+1}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        ${chien.recommendations ? `
          <div class="mt-2">
            <p class="text-xs font-medium text-gray-600">Recommandations</p>
            <p class="text-sm mt-1">${chien.recommendations}</p>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  // Déterminer le bon bouton à afficher en fonction du statut et des permissions
  let actionButtons = '';
  
  // Si l'utilisateur n'est pas connecté
  if (!user) {
    actionButtons = `
      <button class="px-3 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition text-sm w-full" id="loginToContactBtn">
        Se connecter pour contacter
      </button>
    `;
  } 
  // Si l'utilisateur est connecté
  else {
    // Bouton pour contacter le propriétaire (pour tous les utilisateurs connectés)
    const contactBtn = `
      <button class="px-3 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition text-sm w-full sm:w-auto" id="contactProprietaireBtn">
        Contacter le propriétaire
      </button>
    `;
    
    // Bouton d'évaluation selon le contexte
    let evaluationBtn = '';
    
    // Si le chien est déjà évalué, afficher "Voir l'évaluation" pour tous
    if (chien.statut === 'Évalué' && chien.evaluation !== 'Non évalué' && chien.evaluation !== 'En cours') {
      evaluationBtn = `
        <button class="px-3 py-2 rounded-lg font-medium text-white bg-basque-green hover:bg-basque-green-dark transition text-sm w-full sm:w-auto" id="voirEvaluationBtn">
          Voir l'évaluation détaillée
        </button>
      `;
    } 
    // Si l'utilisateur est admin, afficher "Évaluer le chien"
    else if (isUserAdmin) {
      evaluationBtn = `
        <button class="px-3 py-2 rounded-lg font-medium text-white bg-basque-green hover:bg-basque-green-dark transition text-sm w-full sm:w-auto" id="evaluerChienBtn">
          Évaluer le chien
        </button>
      `;
    }
    // Sinon, pour les propriétaires et éleveurs, afficher "Demander une évaluation"
    else if (userProfile && (userProfile.type === 'proprietaire' || userProfile.type === 'eleveur' || userProfile.type === 'refuge')) {
      evaluationBtn = `
        <button class="px-3 py-2 rounded-lg font-medium text-white bg-basque-green hover:bg-basque-green-dark transition text-sm w-full sm:w-auto" id="demanderEvaluationBtn">
          Demander une évaluation
        </button>
      `;
    }
    
    // Construire les boutons complets
    actionButtons = `
      <div class="flex flex-col sm:flex-row gap-2">
        ${contactBtn}
        ${evaluationBtn}
      </div>
    `;
  }
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="dogModalOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto z-10">
      <div class="relative">
        <div class="h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
          ${chien.photo_url ? `<img src="${chien.photo_url}" alt="${chien.nom}" class="w-full h-full object-cover">` : '<span class="text-gray-400">Image</span>'}
        </div>
        <button id="closeModalBtn" class="absolute top-2 left-2 bg-white rounded-full p-2 shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="p-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">${chien.nom}</h2>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}">
            ${chien.statut}
          </span>
        </div>
        
        <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div class="text-gray-700">
            <span class="text-xs font-medium">Race</span>
            <p class="text-sm">${chien.race}</p>
          </div>
          <div class="text-gray-700">
            <span class="text-xs font-medium">Âge</span>
            <p class="text-sm">${chien.age}</p>
          </div>
          <div class="text-gray-700">
            <span class="text-xs font-medium">Sexe</span>
            <p class="text-sm">${chien.sexe}</p>
          </div>
          <div class="text-gray-700">
            <span class="text-xs font-medium">Localisation</span>
            <p class="text-sm">${chien.localisation}</p>
          </div>
        </div>
        
        <div class="mt-4">
          <h3 class="text-base font-medium text-gray-800">Évaluation</h3>
          <div class="mt-1 p-3 rounded-lg bg-gray-50">
            ${evaluationContent}
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-basque-cream rounded-lg border-l-4 border-basque-green">
          <h4 class="text-sm font-bold text-basque-green">Service en partenariat avec Artzainak</h4>
          <p class="mt-1 text-xs text-gray-700">
            Cette évaluation est réalisée par notre équipe professionnelle en partenariat avec 
            <a href="https://artzainak.netlify.app" class="text-basque-green hover:underline" target="_blank">Artzainak</a>, 
            spécialiste en éducation canine pour chiens de troupeau.
          </p>
        </div>
        
        <div class="mt-4">
          ${actionButtons}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(content);
  
  // Empêcher le défilement du body
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer la modale
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('dogModalOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Gestionnaire pour le bouton de connexion
  const loginToContactBtn = document.getElementById('loginToContactBtn');
  if (loginToContactBtn) {
    loginToContactBtn.addEventListener('click', () => {
      showTab('profil');
      document.body.removeChild(content);
      document.body.style.overflow = '';
    });
  }
  
  // Gestionnaire pour contacter le propriétaire
  const contactProprietaireBtn = document.getElementById('contactProprietaireBtn');
  if (contactProprietaireBtn) {
    contactProprietaireBtn.addEventListener('click', () => {
      // Fermer la modal de détails
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      // Ouvrir le formulaire de contact
      showDogContactForm(chien, user);
    });
  }
  
  // Gestionnaire pour demander une évaluation
  const demanderEvaluationBtn = document.getElementById('demanderEvaluationBtn');
  if (demanderEvaluationBtn) {
    demanderEvaluationBtn.addEventListener('click', () => {
      // Fermer la modal de détails
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      // Ouvrir le formulaire de demande d'évaluation
      showEvaluationRequestForm(chien, user, userProfile);
    });
  }
  
  // Gestionnaire pour évaluer le chien (admin uniquement)
  const evaluerChienBtn = document.getElementById('evaluerChienBtn');
  if (evaluerChienBtn && isUserAdmin) {
    evaluerChienBtn.addEventListener('click', () => {
      // Fermer la modal de détails
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      // Ouvrir le formulaire d'évaluation
      if (typeof showDogEvaluationForm === 'function') {
        showDogEvaluationForm(chien);
      } else {
        showMessage('Fonction d\'évaluation non disponible.', 'error');
      }
    });
  }
  
  // Gestionnaire pour voir l'évaluation détaillée
  const voirEvaluationBtn = document.getElementById('voirEvaluationBtn');
  if (voirEvaluationBtn) {
    voirEvaluationBtn.addEventListener('click', () => {
      // Afficher une modal avec l'évaluation détaillée
      showDetailedEvaluation(chien);
    });
  }
}

// Fonction pour afficher le formulaire de contact avec le propriétaire
function showDogContactForm(chien, user) {
  if (!user) {
    showMessage('Vous devez être connecté pour contacter le propriétaire.', 'warning');
    showTab('profil');
    return;
  }
  
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="contactModalOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-4 z-10 max-h-[90vh] overflow-auto">
      <button id="closeContactModalBtn" class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800 pr-8">Contacter le propriétaire de ${chien.nom}</h3>
      <p class="mt-1 text-sm text-gray-700">Votre message sera envoyé au propriétaire du chien.</p>
      
      <form id="contactForm" class="mt-4 space-y-3">
        <input type="hidden" id="dogId" value="${chien.id}">
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Sujet</label>
          <input type="text" id="contactSubject" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Intérêt pour l'adoption de ${chien.nom}" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="contactMessage" rows="5" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par ce chien..." required></textarea>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="contactCopy" class="h-4 w-4 text-basque-red focus:ring-basque-red border-gray-300 rounded">
          <label for="contactCopy" class="ml-2 block text-sm text-gray-700">Recevoir une copie de ce message</label>
        </div>
        
        <div class="mt-4 flex justify-center">
          <button type="submit" id="sendContactBtn" class="w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
            Envoyer le message
          </button>
        </div>
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
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dogId = document.getElementById('dogId').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    const sendCopy = document.getElementById('contactCopy').checked;
    
    if (subject && message) {
      // Changer le bouton en indicateur de chargement
      const sendBtn = document.getElementById('sendContactBtn');
      sendBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
      sendBtn.disabled = true;
      
      try {
        const supabase = window.supabaseClient;
        if (!supabase) throw new Error("Supabase n'est pas initialisé");
        
        // Récupérer le profil de l'utilisateur pour avoir son nom
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Envoyer le message
        const { error } = await supabase
          .from('dog_messages')
          .insert([{
            chien_id: dogId,
            from_user_id: user.id,
            user_name: profile.name,
            user_email: user.email,
            subject: subject,
            message: message,
            send_copy: sendCopy,
            status: 'sent'
          }]);
          
        if (error) throw error;
        
        // Fermer la modale
        document.body.removeChild(content);
        document.body.style.overflow = '';
        
        // Afficher un message de succès
        showMessage('Votre message a été envoyé avec succès au propriétaire.', 'success');
      } catch (error) {
        console.error("Erreur lors de l'envoi du message: ", error);
        sendBtn.textContent = 'Envoyer le message';
        sendBtn.disabled = false;
        showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
      }
    } else {
      showMessage('Veuillez remplir tous les champs.', 'warning');
    }
  });
}

// Fonction pour afficher le formulaire de demande d'évaluation
function showEvaluationRequestForm(chien, user, userProfile) {
  if (!user) {
    showMessage('Vous devez être connecté pour demander une évaluation.', 'warning');
    showTab('profil');
    return;
  }
  
  if (!userProfile || !(userProfile.type === 'proprietaire' || userProfile.type === 'eleveur' || userProfile.type === 'refuge')) {
    showMessage('Vous devez être propriétaire ou éleveur pour demander une évaluation.', 'warning');
    return;
  }
  
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="evaluationRequestOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-4 z-10 max-h-[90vh] overflow-auto">
      <button id="closeEvaluationRequestBtn" class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800 pr-8">Demande d'évaluation pour ${chien.nom}</h3>
      <p class="mt-1 text-sm text-gray-700">Votre demande sera transmise à notre équipe d'évaluation.</p>
      
      <div class="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <p class="text-sm text-blue-700">
          L'évaluation est réalisée gratuitement dans le cadre de notre service de placement. Elle nécessite généralement 1 à 2 jours de travail avec le chien.
        </p>
      </div>
      
      <form id="evaluationRequestForm" class="mt-4 space-y-3">
        <input type="hidden" id="dogId" value="${chien.id}">
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Raison de la demande d'évaluation</label>
          <select id="requestReason" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-green focus:border-transparent" required>
            <option value="">Sélectionnez une raison</option>
            <option value="Adoption">Je souhaite adopter ce chien</option>
            <option value="Placement">Je souhaite placer ce chien</option>
            <option value="Information">Je souhaite des informations sur ce chien</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Message (facultatif)</label>
          <textarea id="requestMessage" rows="4" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-green focus:border-transparent" placeholder="Informations complémentaires sur votre demande..."></textarea>
        </div>
        
        <div class="mt-4 flex justify-center">
          <button type="submit" id="sendRequestBtn" class="w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white bg-basque-green hover:bg-basque-green-dark transition">
            Envoyer la demande
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer la modale
  document.getElementById('closeEvaluationRequestBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('evaluationRequestOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Gestionnaire d'événements pour l'envoi du formulaire
  document.getElementById('evaluationRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dogId = document.getElementById('dogId').value;
    const reason = document.getElementById('requestReason').value;
    const message = document.getElementById('requestMessage').value;
    
    if (!reason) {
      showMessage('Veuillez sélectionner une raison pour votre demande.', 'warning');
      return;
    }
    
    // Changer le bouton en indicateur de chargement
    const sendBtn = document.getElementById('sendRequestBtn');
    sendBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
    sendBtn.disabled = true;
    
    try {
      const supabase = window.supabaseClient;
      if (!supabase) throw new Error("Supabase n'est pas initialisé");
      
      // Envoyer la demande d'évaluation
      const { error } = await supabase
        .from('evaluation_requests')
        .insert([{
          chien_id: dogId,
          user_id: user.id,
          user_name: userProfile.name,
          reason: reason,
          message: message,
          status: 'pending'
        }]);
        
      if (error) throw error;
      
      // Fermer la modale
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      // Afficher un message de succès
      showMessage('Votre demande d\'évaluation a été envoyée avec succès. Nous vous contacterons prochainement.', 'success');
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande: ", error);
      sendBtn.textContent = 'Envoyer la demande';
      sendBtn.disabled = false;
      showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    }
  });
}

// Fonction pour afficher l'évaluation détaillée
function showDetailedEvaluation(chien) {
  // Vérifier que le chien est bien évalué
  if (chien.statut !== 'Évalué' || chien.evaluation === 'Non évalué' || chien.evaluation === 'En cours') {
    showMessage('Ce chien n\'a pas encore été évalué.', 'warning');
    return;
  }
  
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="evaluationDetailOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-4 z-10 max-h-[90vh] overflow-auto">
      <button id="closeEvaluationDetailBtn" class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="flex items-center">
        <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-basque-red mr-3">
          ${chien.photo_url ? `<img src="${chien.photo_url}" alt="${chien.nom}" class="w-full h-full object-cover">` : 
          `<div class="w-full h-full bg-basque-red flex items-center justify-center text-white font-bold">${chien.nom.charAt(0)}</div>`}
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-800">Évaluation de ${chien.nom}</h3>
          <p class="text-sm text-gray-600">${chien.race}, ${chien.age}, ${chien.sexe}</p>
        </div>
      </div>
      
      <div class="mt-6 space-y-6">
        <div class="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h4 class="text-green-800 font-medium">Résultats de l'évaluation</h4>
          <p class="mt-2 text-gray-700">${chien.evaluation}</p>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-800 mb-3">Caractéristiques</h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-700">Obéissance</p>
              <div class="flex mt-2">
                ${Array.from({length: 5}, (_, i) => `
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-1 ${i < chien.obedience ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${i+1}
                  </div>
                `).join('')}
              </div>
              <p class="text-xs text-gray-600 mt-1">
                ${chien.obedience <= 1 ? 'Faible niveau d\'obéissance' :
                  chien.obedience <= 3 ? 'Niveau d\'obéissance moyen' :
                  'Excellent niveau d\'obéissance'}
              </p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-700">Instinct de troupeau</p>
              <div class="flex mt-2">
                ${Array.from({length: 5}, (_, i) => `
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-1 ${i < chien.instinct ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${i+1}
                  </div>
                `).join('')}
              </div>
              <p class="text-xs text-gray-600 mt-1">
                ${chien.instinct <= 1 ? 'Faible instinct de troupeau' :
                  chien.instinct <= 3 ? 'Instinct de troupeau moyen' :
                  'Fort instinct de troupeau'}
              </p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-700">Sociabilité</p>
              <div class="flex mt-2">
                ${Array.from({length: 5}, (_, i) => `
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-1 ${i < chien.sociability ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${i+1}
                  </div>
                `).join('')}
              </div>
              <p class="text-xs text-gray-600 mt-1">
                ${chien.sociability <= 1 ? 'Peu sociable, méfiant' :
                  chien.sociability <= 3 ? 'Sociabilité normale' :
                  'Très sociable et amical'}
              </p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-700">Niveau d'énergie</p>
              <div class="flex mt-2">
                ${Array.from({length: 5}, (_, i) => `
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-1 ${i < chien.energy ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${i+1}
                  </div>
                `).join('')}
              </div>
              <p class="text-xs text-gray-600 mt-1">
                ${chien.energy <= 1 ? 'Calme, peu d\'énergie' :
                  chien.energy <= 3 ? 'Niveau d\'énergie modéré' :
                  'Très énergique, nécessite beaucoup d\'exercice'}
              </p>
            </div>
          </div>
        </div>
        
        ${chien.recommendations ? `
          <div class="p-4 bg-basque-cream rounded-lg border-l-4 border-basque-green">
            <h4 class="text-basque-green font-medium">Recommandations pour le placement</h4>
            <p class="mt-2 text-gray-700">${chien.recommendations}</p>
          </div>
        ` : ''}
        
        <div class="flex justify-center">
          <button id="contactAboutDogBtn" class="px-4 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
            Contacter au sujet de ce chien
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer la modale
  document.getElementById('closeEvaluationDetailBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('evaluationDetailOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Gestionnaire pour le bouton de contact
  document.getElementById('contactAboutDogBtn').addEventListener('click', async () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
    
    // Vérifier si l'utilisateur est connecté
    const supabase = window.supabaseClient;
    if (!supabase) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        showDogContactForm(chien, user);
      } else {
        showMessage('Vous devez être connecté pour contacter le propriétaire.', 'warning');
        showTab('profil');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    }
  });
}
    
    // Afficher un formulaire de contact pour le propriétaire
    showMessage('Cette fonctionnalité sera bientôt disponible.', 'info');
  });
  
  document.getElementById('demanderEvaluationBtn')?.addEventListener('click', () => {
    // Afficher un formulaire de demande d'évaluation
    showMessage('Cette fonctionnalité sera bientôt disponible.', 'info');
  });
}

// Fonction pour afficher des messages si elle n'existe pas déjà
if (typeof showMessage !== 'function') {
  window.showMessage = function(message, type) {
    // Créer l'élément de message
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'info' ? 'bg-blue-500 text-white' :
      'bg-yellow-500 text-white'
    }`;
    messageDiv.textContent = message;
    
    // Ajouter à la page
    document.body.appendChild(messageDiv);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
      messageDiv.classList.add('opacity-0', 'transition-opacity');
      setTimeout(() => {
        document.body.removeChild(messageDiv);
      }, 300);
    }, 3000);
  };
}
