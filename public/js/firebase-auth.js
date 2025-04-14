// Gestion de l'authentification avec Firebase

// Références aux éléments du formulaire de connexion
const loginForm = document.querySelector('#profil-content form:first-of-type');
const loginEmail = loginForm.querySelector('input[type="email"]');
const loginPassword = loginForm.querySelector('input[type="password"]');
const loginButton = loginForm.querySelector('button');

// Références aux éléments du formulaire d'inscription
const signupForm = document.querySelector('#profil-content form:nth-of-type(2)');
const signupName = signupForm.querySelector('input[type="text"]');
const signupEmail = signupForm.querySelector('input[type="email"]');
const signupPassword = signupForm.querySelector('input[type="password"]');
const signupType = signupForm.querySelector('select');
const signupButton = signupForm.querySelector('button');

// Connexion d'un utilisateur
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  
  const email = loginEmail.value;
  const password = loginPassword.value;
  
  if (email && password) {
    // Montrer un indicateur de chargement
    loginButton.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
    
    // Tentative de connexion
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Utilisateur connecté
        const user = userCredential.user;
        console.log('Utilisateur connecté:', user.email);
        
        // Redirection ou affichage d'un message de succès
        showMessage('Connexion réussie !', 'success');
        
        // Réinitialiser le formulaire
        loginForm.reset();
        loginButton.textContent = 'Se connecter';
        
        // Afficher une interface utilisateur connecté
        updateUIForLoggedInUser(user);
      })
      .catch((error) => {
        console.error('Erreur de connexion:', error.message);
        showMessage('Échec de la connexion : ' + error.message, 'error');
        loginButton.textContent = 'Se connecter';
      });
  } else {
    showMessage('Veuillez remplir tous les champs.', 'warning');
  }
});

// Inscription d'un nouvel utilisateur
signupButton.addEventListener('click', (e) => {
  e.preventDefault();
  
  const name = signupName.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const type = signupType.value;
  
  if (name && email && password && type) {
    // Montrer un indicateur de chargement
    signupButton.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
    
    // Création du compte
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Compte créé
        const user = userCredential.user;
        
        // Ajouter les informations complémentaires dans la base de données
        return db.collection('users').doc(user.uid).set({
          name: name,
          email: email,
          type: type,
          createdAt: new Date()
        });
      })
      .then(() => {
        console.log('Profil utilisateur créé avec succès');
        showMessage('Inscription réussie !', 'success');
        
        // Réinitialiser le formulaire
        signupForm.reset();
        signupButton.textContent = 'Créer un compte';
        
        // Redirection vers la page d'accueil
        showTab('accueil');
      })
      .catch((error) => {
        console.error('Erreur d\'inscription:', error.message);
        showMessage('Échec de l\'inscription : ' + error.message, 'error');
        signupButton.textContent = 'Créer un compte';
      });
  } else {
    showMessage('Veuillez remplir tous les champs.', 'warning');
  }
});

// Affichage des messages
function showMessage(message, type) {
  // Créer l'élément de message
  const messageDiv = document.createElement('div');
  messageDiv.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
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
}

// Mise à jour de l'interface pour un utilisateur connecté
function updateUIForLoggedInUser(user) {
  // Récupérer les données de l'utilisateur
  db.collection('users').doc(user.uid).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        
        // Masquer les formulaires de connexion/inscription
        document.querySelector('#profil-content .bg-white').classList.add('hidden');
        
        // Créer et afficher l'interface utilisateur
        const userProfileDiv = document.createElement('div');
        userProfileDiv.className = 'bg-white rounded-xl shadow-lg p-6';
        userProfileDiv.innerHTML = `
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full bg-basque-red flex items-center justify-center text-white text-2xl font-bold">
              ${userData.name.charAt(0)}
            </div>
            <div class="ml-4">
              <h2 class="text-2xl font-bold">${userData.name}</h2>
              <p class="text-gray-600">${userData.email}</p>
              <p class="mt-1 px-2 py-1 rounded-full text-xs font-medium bg-basque-cream inline-block">
                ${userData.type === 'eleveur' ? 'Éleveur/Berger' : 
                 userData.type === 'proprietaire' ? 'Propriétaire de chien' :
                 userData.type === 'refuge' ? 'Représentant de refuge' : 'Utilisateur'}
              </p>
            </div>
          </div>
          
          <div class="mt-8 border-t border-gray-200 pt-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Mes actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${userData.type === 'eleveur' ? `
              <button class="p-4 border border-gray-200 rounded-lg flex items-center text-left">
                <div class="w-10 h-10 rounded-full bg-basque-green flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="font-bold">Décrire mon élevage</h4>
                  <p class="text-sm text-gray-600">Précisez votre besoin en chien de troupeau</p>
                </div>
              </button>
              ` : ''}
              
              ${userData.type === 'proprietaire' || userData.type === 'refuge' ? `
              <button class="p-4 border border-gray-200 rounded-lg flex items-center text-left">
                <div class="w-10 h-10 rounded-full bg-basque-red flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="font-bold">Ajouter un chien</h4>
                  <p class="text-sm text-gray-600">Inscrivez un chien à placer</p>
                </div>
              </button>
              ` : ''}
              
              <button class="p-4 border border-gray-200 rounded-lg flex items-center text-left">
                <div class="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="font-bold">Paramètres du compte</h4>
                  <p class="text-sm text-gray-600">Modifiez vos informations</p>
                </div>
              </button>
              
              <button id="logoutBtn" class="p-4 border border-gray-200 rounded-lg flex items-center text-left">
                <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="font-bold">Déconnexion</h4>
                  <p class="text-sm text-gray-600">Quitter votre session</p>
                </div>
              </button>
            </div>
          </div>
        `;
        
        // Ajouter à la page
        document.getElementById('profil-content').appendChild(userProfileDiv);
        
        // Ajouter le gestionnaire de déconnexion
        document.getElementById('logoutBtn').addEventListener('click', () => {
          auth.signOut().then(() => {
            // Supprimer l'interface utilisateur
            document.querySelector('#profil-content .bg-white:not(.hidden)').remove();
            document.querySelector('#profil-content .bg-white.hidden').classList.remove('hidden');
            
            showMessage('Vous êtes déconnecté.', 'success');
          }).catch((error) => {
            console.error('Erreur de déconnexion:', error);
          });
        });
      }
    });
}

// Vérifier l'état de l'authentification à chaque chargement
auth.onAuthStateChanged((user) => {
  if (user) {
    // Utilisateur connecté
    updateUIForLoggedInUser(user);
  }
});
