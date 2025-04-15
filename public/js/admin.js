// admin.js - Gestion de l'interface d'administration

// Fonction pour vérifier si l'utilisateur courant est un administrateur
async function isAdmin(user) {
  if (!user) return false;
  
  const supabase = window.supabaseClient;
  if (!supabase) return false;
  
  // Vérifier dans la table profiles si l'utilisateur a le rôle "admin"
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error || !data) return false;
  
  return data.role === 'admin';
}

// Fonction pour afficher l'interface d'administration
async function showAdminPanel() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase n'est pas initialisé");
    showMessage("Erreur de connexion au service", "error");
    return;
  }
  
  // Vérifier si l'utilisateur est connecté et admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showMessage('Vous devez être connecté pour accéder à cette page.', 'warning');
    showTab('profil');
    return;
  }
  
  // Vérifier si l'utilisateur est administrateur
  const adminStatus = await isAdmin(user);
  if (!adminStatus) {
    showMessage('Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.', 'error');
    showTab('accueil');
    return;
  }
  
  // Créer l'interface d'administration
  // Cacher tous les contenus existants
  document.querySelectorAll('#mainContent > div').forEach(div => {
    div.classList.add('hidden');
  });
  
  // Vérifier si le panel admin existe déjà, sinon le créer
  let adminContent = document.getElementById('admin-content');
  if (!adminContent) {
    adminContent = document.createElement('div');
    adminContent.id = 'admin-content';
    document.getElementById('mainContent').appendChild(adminContent);
  }
  
  // Afficher le panel admin
  adminContent.classList.remove('hidden');
  
  // Charger les données à administrer
  loadAdminData(adminContent);
}

// Charger les données pour l'administration
async function loadAdminData(container) {
  const supabase = window.supabaseClient;
  
  // Afficher un loader
  container.innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Panneau d'administration</h2>
    <div class="flex justify-center">
      <div class="w-12 h-12 border-4 border-basque-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;
  
  try {
    // Récupérer tous les chiens à évaluer
    const { data: chiens, error: chiensError } = await supabase
      .from('chiens')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (chiensError) throw chiensError;
    
    // Récupérer tous les éleveurs
    const { data: eleveurs, error: eleveursError } = await supabase
      .from('eleveurs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (eleveursError) throw eleveursError;
    
    // Récupérer tous les utilisateurs
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (profilesError) throw profilesError;
    
    // Construire l'interface
    container.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Panneau d'administration</h2>
      
      <div class="flex space-x-4 mb-6">
        <button id="tab-chiens" class="px-4 py-2 bg-basque-red text-white rounded-lg">Chiens à évaluer</button>
        <button id="tab-eleveurs" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Éleveurs</button>
        <button id="tab-users" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Utilisateurs</button>
      </div>
      
      <!-- Contenu des tabs -->
      <div id="content-chiens" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Chiens à évaluer (${chiens.filter(c => c.statut !== 'Évalué').length})</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Race</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${chiens.map(chien => `
                <tr data-id="${chien.id}" class="${chien.statut === 'Évalué' ? 'bg-green-50' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap">${chien.nom}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${chien.race}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${chien.statut === 'Disponible' ? 'bg-blue-100 text-blue-800' : 
                        chien.statut === 'En évaluation' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}">
                      ${chien.statut}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">${new Date(chien.created_at).toLocaleDateString()}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-basque-red hover:text-basque-red-dark view-dog-btn" data-id="${chien.id}">Voir</button>
                    <button class="ml-3 text-basque-green hover:text-basque-green-dark evaluate-dog-btn" data-id="${chien.id}">Évaluer</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="content-eleveurs" class="hidden bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Éleveurs (${eleveurs.length})</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheptel</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${eleveurs.map(eleveur => `
                <tr data-id="${eleveur.id}">
                  <td class="px-6 py-4 whitespace-nowrap">${eleveur.nom}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${eleveur.localisation}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${eleveur.cheptel}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${eleveur.contact}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-basque-red hover:text-basque-red-dark view-eleveur-btn" data-id="${eleveur.id}">Voir</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="content-users" class="hidden bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Utilisateurs (${profiles.length})</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${profiles.map(profile => `
                <tr data-id="${profile.id}" class="${profile.role === 'admin' ? 'bg-red-50' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap">${profile.name}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${profile.type}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${profile.role || 'utilisateur'}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${new Date(profile.created_at).toLocaleDateString()}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${profile.role !== 'admin' ? `
                      <button class="text-basque-red hover:text-basque-red-dark make-admin-btn" data-id="${profile.id}">Faire admin</button>
                    ` : `
                      <button class="text-gray-400 cursor-not-allowed" disabled>Administrateur</button>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Ajouter les gestionnaires d'événements
    document.getElementById('tab-chiens').addEventListener('click', () => switchAdminTab('chiens'));
    document.getElementById('tab-eleveurs').addEventListener('click', () => switchAdminTab('eleveurs'));
    document.getElementById('tab-users').addEventListener('click', () => switchAdminTab('users'));
    
    // Gestionnaires pour les boutons d'action
    document.querySelectorAll('.view-dog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dogId = btn.getAttribute('data-id');
        const dog = chiens.find(c => c.id == dogId);
        if (dog) showDogDetails(dog);
      });
    });
    
    document.querySelectorAll('.evaluate-dog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dogId = btn.getAttribute('data-id');
        const dog = chiens.find(c => c.id == dogId);
        if (dog) showDogEvaluationForm(dog);
      });
    });
    
    document.querySelectorAll('.view-eleveur-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const eleveurId = btn.getAttribute('data-id');
        const eleveur = eleveurs.find(e => e.id == eleveurId);
        if (eleveur) showEleveurDetails(eleveur);
      });
    });
    
    document.querySelectorAll('.make-admin-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const profileId = btn.getAttribute('data-id');
        const profile = profiles.find(p => p.id == profileId);
        
        if (!profile) return;
        
        if (confirm(`Êtes-vous sûr de vouloir donner les droits d'administrateur à ${profile.name} ?`)) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', profileId);
              
            if (error) throw error;
            
            showMessage(`${profile.name} est maintenant administrateur.`, 'success');
            loadAdminData(container); // Recharger les données
          } catch (error) {
            console.error("Erreur lors de la modification du rôle:", error);
            showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
          }
        }
      });
    });
    
  } catch (error) {
    console.error("Erreur lors du chargement des données d'administration:", error);
    container.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Panneau d'administration</h2>
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p>Une erreur s'est produite lors du chargement des données. Veuillez réessayer.</p>
        <button id="retry-admin-btn" class="mt-4 px-4 py-2 bg-basque-red text-white rounded-lg">
          Réessayer
        </button>
      </div>
    `;
    
    document.getElementById('retry-admin-btn').addEventListener('click', () => {
      loadAdminData(container);
    });
  }
}

// Fonction pour basculer entre les onglets du panneau admin
function switchAdminTab(tabName) {
  // Cacher tous les contenus
  document.getElementById('content-chiens').classList.add('hidden');
  document.getElementById('content-eleveurs').classList.add('hidden');
  document.getElementById('content-users').classList.add('hidden');
  
  // Réinitialiser les styles de tous les onglets
  document.getElementById('tab-chiens').className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg';
  document.getElementById('tab-eleveurs').className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg';
  document.getElementById('tab-users').className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg';
  
  // Afficher le contenu sélectionné
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  
  // Mettre en évidence l'onglet sélectionné
  document.getElementById(`tab-${tabName}`).className = 'px-4 py-2 bg-basque-red text-white rounded-lg';
}

// Fonction pour afficher le formulaire d'évaluation d'un chien
function showDogEvaluationForm(dog) {
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="evaluationOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 z-10 max-h-90vh overflow-auto">
      <button id="closeEvaluationBtn" class="absolute top-4 right-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800">Évaluation du chien: ${dog.nom}</h3>
      <p class="mt-2 text-gray-700">${dog.race}, ${dog.age}, ${dog.sexe}</p>
      
      <form id="evaluationForm" class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Statut</label>
          <select id="dogStatus" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
            <option value="Disponible" ${dog.statut === 'Disponible' ? 'selected' : ''}>Disponible</option>
            <option value="En évaluation" ${dog.statut === 'En évaluation' ? 'selected' : ''}>En évaluation</option>
            <option value="Évalué" ${dog.statut === 'Évalué' ? 'selected' : ''}>Évalué</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Résultat de l'évaluation</label>
          <textarea id="dogEvaluation" rows="6" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Détaillez votre évaluation du chien...">${dog.evaluation !== 'Non évalué' && dog.evaluation !== 'En cours' ? dog.evaluation : ''}</textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Niveau d'obéissance (1-5)</label>
            <input type="number" id="dogObedience" min="1" max="5" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" value="${dog.obedience || 3}">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Niveau d'instinct (1-5)</label>
            <input type="number" id="dogInstinct" min="1" max="5" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" value="${dog.instinct || 3}">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Sociabilité (1-5)</label>
            <input type="number" id="dogSociability" min="1" max="5" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" value="${dog.sociability || 3}">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Énergie (1-5)</label>
            <input type="number" id="dogEnergy" min="1" max="5" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" value="${dog.energy || 3}">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Recommandations pour le placement</label>
          <textarea id="dogRecommendations" rows="4" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Type d'élevage recommandé, expérience requise de l'éleveur...">${dog.recommendations || ''}</textarea>
        </div>
        
        <button type="submit" id="submitEvaluationBtn" class="w-full px-4 py-2 rounded-lg font-medium text-white bg-basque-green hover:bg-basque-green-dark transition">
          Enregistrer l'évaluation
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer le formulaire
  document.getElementById('closeEvaluationBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('evaluationOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Soumission du formulaire
  document.getElementById('evaluationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const status = document.getElementById('dogStatus').value;
    const evaluation = document.getElementById('dogEvaluation').value;
    const obedience = document.getElementById('dogObedience').value;
    const instinct = document.getElementById('dogInstinct').value;
    const sociability = document.getElementById('dogSociability').value;
    const energy = document.getElementById('dogEnergy').value;
    const recommendations = document.getElementById('dogRecommendations').value;
    
    // Valider les données
    if (status === 'Évalué' && !evaluation) {
      showMessage('Veuillez fournir une évaluation pour ce chien.', 'warning');
      return;
    }
    
    // Changer le bouton en indicateur de chargement
    const submitBtn = document.getElementById('submitEvaluationBtn');
    submitBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
    submitBtn.disabled = true;
    
    try {
      const supabase = window.supabaseClient;
      if (!supabase) throw new Error("Supabase n'est pas initialisé");
      
      // Préparer les données de mise à jour
      const updateData = {
        statut: status,
        evaluation: status === 'Évalué' ? evaluation : (status === 'En évaluation' ? 'En cours' : 'Non évalué'),
        obedience: parseInt(obedience),
        instinct: parseInt(instinct),
        sociability: parseInt(sociability),
        energy: parseInt(energy),
        recommendations
      };
      
      // Mettre à jour le chien dans la base de données
      const { error } = await supabase
        .from('chiens')
        .update(updateData)
        .eq('id', dog.id);
      
      if (error) throw error;
      
      // Fermer le formulaire et afficher un message de succès
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      showMessage('L\'évaluation du chien a été enregistrée avec succès.', 'success');
      
      // Rafraîchir les données du panneau admin
      const adminContent = document.getElementById('admin-content');
      if (adminContent) {
        loadAdminData(adminContent);
      }
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'évaluation:", error);
      submitBtn.textContent = 'Enregistrer l\'évaluation';
      submitBtn.disabled = false;
      showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    }
  });
}

// Fonction pour créer un compte administrateur si nécessaire
async function setupAdminAccount() {
  const supabase = window.supabaseClient;
  if (!supabase) return;
  
  // Vérifier si le compte admin existe déjà
  const { data: existingUsers, error: searchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin');
    
  if (searchError) {
    console.error("Erreur lors de la recherche d'administrateurs:", searchError);
    return;
  }
  
  // Si aucun admin n'existe, créer le compte
  if (!existingUsers || existingUsers.length === 0) {
    try {
      // Créer l'utilisateur admin
      const { data, error } = await supabase.auth.signUp({
        email: 'kerlow@berger-connect.fr', // Utiliser une adresse email basée sur le domaine
        password: 'aslaugaruda',
        options: {
          data: {
            name: 'Kerlow',
            type: 'admin'
          }
        }
      });
      
      if (error) throw error;
      
      // Ajouter le profil avec le rôle admin
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: 'Kerlow',
            type: 'admin',
            role: 'admin'
          }
        ]);
        
      if (profileError) throw profileError;
      
      console.log('Compte administrateur créé avec succès.');
    } catch (error) {
      console.error("Erreur lors de la création du compte administrateur:", error);
    }
  }
}

// Appel de la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', setupAdminAccount);
