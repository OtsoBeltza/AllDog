// admin.js - Gestion de l'interface d'administration

// Fonction pour vérifier si l'utilisateur courant est un administrateur
async function isAdmin(user) {
  if (!user) return false;
  
  // Admin spécifique
  if (user.email === 'pierocarlo@gmx.fr') return true;
  
  const supabase = window.supabaseClient;
  if (!supabase) return false;
  
  // Vérifier dans la table profiles si l'utilisateur a le rôle "admin"
  const { data, error } = await supabase
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Énergie (1-5)</label>
            <div class="flex items-center mt-1">
              ${[1, 2, 3, 4, 5].map(value => `
                <label class="mx-2 flex flex-col items-center">
                  <input type="radio" name="dogEnergy" value="${value}" class="hidden" ${(dog.energy || 3) == value ? 'checked' : ''}>
                  <span class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${(dog.energy || 3) == value ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${value}
                  </span>
                  <span class="text-xs mt-1">${
                    value === 1 ? 'Calme' : 
                    value === 3 ? 'Modérée' : 
                    value === 5 ? 'Très actif' : ''
                  }</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Résultat de l'évaluation</label>
          <textarea id="dogEvaluation" rows="6" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Détaillez votre évaluation du chien...">${dog.evaluation !== 'Non évalué' && dog.evaluation !== 'En cours' ? dog.evaluation : ''}</textarea>
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
  
  // Ajouter du style pour la sélection des notes
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    input[type="radio"][name="dogObedience"]:checked + span,
    input[type="radio"][name="dogInstinct"]:checked + span,
    input[type="radio"][name="dogSociability"]:checked + span,
    input[type="radio"][name="dogEnergy"]:checked + span {
      background-color: #D0202A;
      color: white;
    }
    
    input[type="radio"] + span:hover {
      background-color: #e0e0e0;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Gestionnaire d'événements pour fermer le formulaire
  document.getElementById('closeEvaluationBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
    document.head.removeChild(styleElement);
  });
  
  document.getElementById('evaluationOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
    document.head.removeChild(styleElement);
  });
  
  // Gestionnaires pour les boutons de notation
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      // Réinitialiser tous les boutons du même groupe
      const name = e.target.name;
      document.querySelectorAll(`input[name="${name}"] + span`).forEach(span => {
        span.classList.remove('bg-basque-red', 'text-white');
        span.classList.add('bg-gray-200');
      });
      
      // Mettre en évidence le bouton sélectionné
      const selectedSpan = e.target.nextElementSibling;
      selectedSpan.classList.remove('bg-gray-200');
      selectedSpan.classList.add('bg-basque-red', 'text-white');
    });
  });
  
  // Soumission du formulaire
  document.getElementById('evaluationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const status = document.getElementById('dogStatus').value;
    const evaluation = document.getElementById('dogEvaluation').value;
    const obedience = document.querySelector('input[name="dogObedience"]:checked')?.value || 3;
    const instinct = document.querySelector('input[name="dogInstinct"]:checked')?.value || 3;
    const sociability = document.querySelector('input[name="dogSociability"]:checked')?.value || 3;
    const energy = document.querySelector('input[name="dogEnergy"]:checked')?.value || 3;
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
      document.head.removeChild(styleElement);
      
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

// Ajouter la fonction pour gérer la suppression d'un chien
async function confirmDeleteDog(dog, container) {
  // Créer une modale de confirmation
  const confirmModal = document.createElement('div');
  confirmModal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  confirmModal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="confirmOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Confirmation de suppression</h3>
      <p class="text-gray-700">Êtes-vous sûr de vouloir supprimer définitivement le chien <strong>${dog.nom}</strong> ?</p>
      <p class="mt-2 text-sm text-red-600">Cette action est irréversible et supprimera toutes les données associées.</p>
      
      <div class="mt-6 flex justify-end space-x-4">
        <button id="cancelDeleteBtn" class="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
          Annuler
        </button>
        <button id="confirmDeleteBtn" class="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition">
          Supprimer
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmModal);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaires d'événements pour les boutons
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.body.removeChild(confirmModal);
    document.body.style.overflow = '';
  });
  
  document.getElementById('confirmOverlay').addEventListener('click', () => {
    document.body.removeChild(confirmModal);
    document.body.style.overflow = '';
  });
  
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    const supabase = window.supabaseClient;
    if (!supabase) {
      showMessage("Erreur de connexion au service", "error");
      document.body.removeChild(confirmModal);
      document.body.style.overflow = '';
      return;
    }
    
    try {
      // Changer le bouton en indicateur de chargement
      const confirmBtn = document.getElementById('confirmDeleteBtn');
      confirmBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
      confirmBtn.disabled = true;
      
      // Supprimer d'abord les messages associés au chien
      await supabase
        .from('dog_messages')
        .delete()
        .eq('chien_id', dog.id);
      
      // Supprimer les demandes d'évaluation associées
      await supabase
        .from('evaluation_requests')
        .delete()
        .eq('chien_id', dog.id);
      
      // Supprimer la photo du chien si elle existe
      if (dog.photo_url) {
        try {
          // Extraire le nom du fichier de l'URL
          const fileName = dog.photo_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('photos')
              .remove([fileName]);
          }
        } catch (photoError) {
          console.error("Erreur lors de la suppression de la photo:", photoError);
          // Continuer malgré l'erreur
        }
      }
      
      // Enfin, supprimer le chien
      const { error } = await supabase
        .from('chiens')
        .delete()
        .eq('id', dog.id);
      
      if (error) throw error;
      
      // Fermer la modale
      document.body.removeChild(confirmModal);
      document.body.style.overflow = '';
      
      // Afficher un message de succès
      showMessage(`Le chien ${dog.nom} a été supprimé avec succès.`, 'success');
      
      // Recharger les données d'administration
      loadAdminData(container);
      
    } catch (error) {
      console.error("Erreur lors de la suppression du chien:", error);
      document.body.removeChild(confirmModal);
      document.body.style.overflow = '';
      showMessage(`Erreur lors de la suppression: ${error.message}`, 'error');
    }
  });
}

 = await supabase
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
  
  // Vérifier strictement si l'utilisateur est l'admin pierocarlo@gmx.fr ou a le rôle admin
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
    
    // Récupérer les demandes d'évaluation
    const { data: evaluationRequests, error: requestsError } = await supabase
      .from('evaluation_requests')
      .select('*, chien:chien_id (*)')
      .order('created_at', { ascending: false });
      
    if (requestsError) throw requestsError;
    
    // Construire l'interface
    container.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Panneau d'administration</h2>
      
      <div class="flex flex-wrap space-x-2 mb-6">
        <button id="tab-chiens" class="px-4 py-2 mb-2 bg-basque-red text-white rounded-lg">Chiens à évaluer</button>
        <button id="tab-requests" class="px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg">Demandes d'évaluation ${evaluationRequests.length ? `<span class="ml-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">${evaluationRequests.length}</span>` : ''}</button>
        <button id="tab-eleveurs" class="px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg">Éleveurs</button>
        <button id="tab-users" class="px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg">Utilisateurs</button>
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
                    <button class="ml-3 text-red-600 hover:text-red-800 delete-dog-btn" data-id="${chien.id}">Supprimer</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Nouveau contenu pour les demandes d'évaluation -->
      <div id="content-requests" class="hidden bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Demandes d'évaluation (${evaluationRequests.length})</h3>
        
        ${evaluationRequests.length === 0 ? `
          <div class="p-4 bg-gray-50 rounded-lg text-center">
            <p class="text-gray-700">Aucune demande d'évaluation en attente.</p>
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chien</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demandeur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${evaluationRequests.map(request => `
                  <tr data-id="${request.id}" class="bg-red-50">
                    <td class="px-6 py-4 whitespace-nowrap">${request.chien?.nom || 'Chien inconnu'}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${request.user_name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${new Date(request.created_at).toLocaleDateString()}</td>
                    <td class="px-6 py-4">${request.message || 'Aucun message'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-basque-green hover:text-basque-green-dark process-request-btn" data-id="${request.id}" data-chien-id="${request.chien_id}">Traiter</button>
                      <button class="ml-2 text-gray-500 hover:text-gray-700 dismiss-request-btn" data-id="${request.id}">Ignorer</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
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
    document.getElementById('tab-requests').addEventListener('click', () => switchAdminTab('requests'));
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
    
    // Nouveau gestionnaire pour les boutons de suppression
    document.querySelectorAll('.delete-dog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dogId = btn.getAttribute('data-id');
        const dog = chiens.find(c => c.id == dogId);
        if (dog) confirmDeleteDog(dog, container);
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
    
    // Gestionnaires pour les demandes d'évaluation
    document.querySelectorAll('.process-request-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const requestId = btn.getAttribute('data-id');
        const chienId = btn.getAttribute('data-chien-id');
        
        try {
          // Mettre à jour le statut du chien
          const { error: updateError } = await supabase
            .from('chiens')
            .update({ statut: 'En évaluation', evaluation: 'En cours' })
            .eq('id', chienId);
            
          if (updateError) throw updateError;
          
          // Marquer la demande comme traitée
          const { error: requestError } = await supabase
            .from('evaluation_requests')
            .update({ status: 'processed' })
            .eq('id', requestId);
            
          if (requestError) throw requestError;
          
          showMessage('La demande a été traitée avec succès.', 'success');
          
          // Recharger les données
          loadAdminData(container);
        } catch (error) {
          console.error("Erreur lors du traitement de la demande:", error);
          showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
        }
      });
    });
    
    document.querySelectorAll('.dismiss-request-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const requestId = btn.getAttribute('data-id');
        
        if (confirm('Êtes-vous sûr de vouloir ignorer cette demande ?')) {
          try {
            const { error } = await supabase
              .from('evaluation_requests')
              .update({ status: 'dismissed' })
              .eq('id', requestId);
              
            if (error) throw error;
            
            showMessage('La demande a été ignorée.', 'success');
            loadAdminData(container);
          } catch (error) {
            console.error("Erreur lors de l'ignorance de la demande:", error);
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
  document.getElementById('content-requests').classList.add('hidden');
  document.getElementById('content-eleveurs').classList.add('hidden');
  document.getElementById('content-users').classList.add('hidden');
  
  // Réinitialiser les styles de tous les onglets
  document.getElementById('tab-chiens').className = 'px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg';
  document.getElementById('tab-requests').className = 'px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg';
  document.getElementById('tab-eleveurs').className = 'px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg';
  document.getElementById('tab-users').className = 'px-4 py-2 mb-2 bg-gray-200 text-gray-700 rounded-lg';
  
  // Afficher le contenu sélectionné
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  
  // Mettre en évidence l'onglet sélectionné
  document.getElementById(`tab-${tabName}`).className = 'px-4 py-2 mb-2 bg-basque-red text-white rounded-lg';
}

// Fonction améliorée pour afficher le formulaire d'évaluation d'un chien
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
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Niveau d'obéissance (1-5)</label>
            <div class="flex items-center mt-1">
              ${[1, 2, 3, 4, 5].map(value => `
                <label class="mx-2 flex flex-col items-center">
                  <input type="radio" name="dogObedience" value="${value}" class="hidden" ${(dog.obedience || 3) == value ? 'checked' : ''}>
                  <span class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${(dog.obedience || 3) == value ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${value}
                  </span>
                  <span class="text-xs mt-1">${
                    value === 1 ? 'Faible' : 
                    value === 3 ? 'Moyen' : 
                    value === 5 ? 'Excellent' : ''
                  }</span>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Niveau d'instinct (1-5)</label>
            <div class="flex items-center mt-1">
              ${[1, 2, 3, 4, 5].map(value => `
                <label class="mx-2 flex flex-col items-center">
                  <input type="radio" name="dogInstinct" value="${value}" class="hidden" ${(dog.instinct || 3) == value ? 'checked' : ''}>
                  <span class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${(dog.instinct || 3) == value ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${value}
                  </span>
                  <span class="text-xs mt-1">${
                    value === 1 ? 'Faible' : 
                    value === 3 ? 'Moyen' : 
                    value === 5 ? 'Fort' : ''
                  }</span>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Sociabilité (1-5)</label>
            <div class="flex items-center mt-1">
              ${[1, 2, 3, 4, 5].map(value => `
                <label class="mx-2 flex flex-col items-center">
                  <input type="radio" name="dogSociability" value="${value}" class="hidden" ${(dog.sociability || 3) == value ? 'checked' : ''}>
                  <span class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${(dog.sociability || 3) == value ? 'bg-basque-red text-white' : 'bg-gray-200'}">
                    ${value}
                  </span>
                  <span class="text-xs mt-1">${
                    value === 1 ? 'Craintif' : 
                    value === 3 ? 'Normal' : 
                    value === 5 ? 'Très sociable' : ''
                  }</span>
                </label>
              `).join('')}
            </div>
          </div>
