// Gestion du formulaire d'ajout de chien

// Fonction pour créer le formulaire
async function createDogForm() {
  // Vérifier si l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showTab('profil');
    showMessage('Veuillez vous connecter pour ajouter un chien.', 'warning');
    return;
  }
  
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="dogFormOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 z-10 max-h-90vh overflow-auto">
      <button id="closeDogFormBtn" class="absolute top-4 right-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800">Ajouter un chien</h3>
      <p class="mt-2 text-gray-700">Complétez les informations sur le chien à placer. Notre équipe vous contactera pour planifier une évaluation gratuite.</p>
      
      <form id="dogForm" class="mt-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom du chien</label>
            <input type="text" id="dogName" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Race</label>
            <select id="dogBreed" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
              <option value="">Sélectionnez une race</option>
              <option value="Border Collie">Border Collie</option>
              <option value="Berger des Pyrénées">Berger des Pyrénées</option>
              <option value="Berger Australien">Berger Australien</option>
              <option value="Kelpie">Kelpie</option>
              <option value="Beauceron">Beauceron</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Âge</label>
            <input type="text" id="dogAge" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Ex: 2 ans" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Sexe</label>
            <select id="dogSex" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
              <option value="">Sélectionnez</option>
              <option value="Mâle">Mâle</option>
              <option value="Femelle">Femelle</option>
            </select>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Localisation actuelle</label>
            <input type="text" id="dogLocation" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Ex: Refuge de Bayonne" required>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="dogDescription" rows="4" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" placeholder="Caractère, expérience avec le troupeau, raison du placement..." required></textarea>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Photo du chien</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="dogPhoto" class="relative cursor-pointer bg-white rounded-md font-medium text-basque-red hover:text-basque-red-dark">
                    <span>Télécharger une photo</span>
                    <input id="dogPhoto" name="dogPhoto" type="file" class="sr-only" accept="image/*">
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pt-4 border-t border-gray-200">
          <h4 class="font-medium text-gray-800">Informations de contact</h4>
          <p class="text-sm text-gray-600">Vos coordonnées seront visibles uniquement par l'administrateur du site.</p>
          
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" id="ownerName" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Téléphone</label>
              <input type="tel" id="ownerPhone" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="ownerEmail" class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required>
            </div>
          </div>
        </div>
        
        <div class="flex items-center">
          <input type="checkbox" id="dogTerms" class="h-4 w-4 text-basque-red focus:ring-basque-red border-gray-300 rounded" required>
          <label for="dogTerms" class="ml-2 block text-sm text-gray-700">
            J'accepte les <a href="#" class="text-basque-red hover:underline">conditions d'utilisation</a> et la <a href="#" class="text-basque-red hover:underline">politique de confidentialité</a>
          </label>
        </div>
        
        <button type="submit" id="submitDogBtn" class="w-full px-4 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
          Soumettre mon chien
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer le formulaire
  document.getElementById('closeDogFormBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('dogFormOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Gestionnaire pour le glisser-déposer des photos
  const photoInput = document.getElementById('dogPhoto');
  const dropArea = photoInput.closest('div.border');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight() {
    dropArea.classList.add('border-basque-red', 'bg-red-50');
  }
  
  function unhighlight() {
    dropArea.classList.remove('border-basque-red', 'bg-red-50');
  }
  
  dropArea.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    photoInput.files = files;
    
    // Afficher un aperçu de l'image
    displayImagePreview(files[0]);
  }
  
  photoInput.addEventListener('change', function() {
    if (this.files.length > 0) {
      displayImagePreview(this.files[0]);
    }
  });
  
  function displayImagePreview(file) {
    if (!file.type.match('image.*')) {
      showMessage('Veuillez sélectionner une image.', 'warning');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.createElement('div');
      preview.className = 'mt-3';
      preview.innerHTML = `
        <div class="relative">
          <img src="${e.target.result}" alt="Aperçu" class="h-32 w-auto mx-auto rounded-lg">
          <button type="button" id="removePreview" class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
      
      // Supprimer l'aperçu précédent s'il existe
      const oldPreview = dropArea.querySelector('div.mt-3');
      if (oldPreview) {
        oldPreview.remove();
      }
      
      dropArea.appendChild(preview);
      
      // Gestionnaire pour supprimer l'aperçu
      document.getElementById('removePreview').addEventListener('click', () => {
        preview.remove();
        photoInput.value = '';
      });
    }
    
    reader.readAsDataURL(file);
  }
  
  // Soumission du formulaire
  document.getElementById('dogForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dogName = document.getElementById('dogName').value;
    const dogBreed = document.getElementById('dogBreed').value;
    const dogAge = document.getElementById('dogAge').value;
    const dogSex = document.getElementById('dogSex').value;
    const dogLocation = document.getElementById('dogLocation').value;
    const dogDescription = document.getElementById('dogDescription').value;
    const ownerName = document.getElementById('ownerName').value;
    const ownerPhone = document.getElementById('ownerPhone').value;
    const ownerEmail = document.getElementById('ownerEmail').value;
    const dogTerms = document.getElementById('dogTerms').checked;
    const dogPhoto = document.getElementById('dogPhoto').files[0];
    
    if (!dogName || !dogBreed || !dogAge || !dogSex || !dogLocation || !dogDescription || 
        !ownerName || !ownerPhone || !ownerEmail || !dogTerms) {
      showMessage('Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }
    
    // Changer le bouton en indicateur de chargement
    const submitBtn = document.getElementById('submitDogBtn');
    submitBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
    submitBtn.disabled = true;
    
    try {
      // Obtenir l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      // Préparer les données du chien
      const dogData = {
        nom: dogName,
        race: dogBreed,
        age: dogAge,
        sexe: dogSex,
        localisation: dogLocation,
        description: dogDescription,
        proprietaire_id: user.id,
        statut: 'En attente',
        evaluation: 'Non évalué'
      };
      
      // Si une photo a été téléchargée, la traiter
      let photoUrl = null;
      if (dogPhoto) {
        // Créer un nom de fichier unique
        const fileExt = dogPhoto.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `dogs/${fileName}`;
        
        // Uploader la photo vers le stockage Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, dogPhoto);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Obtenir l'URL publique de la photo
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);
          
        photoUrl = urlData.publicUrl;
        dogData.photo_url = photoUrl;
      }
      
      // Ajouter le chien à la base de données
      const { data: dogInsertData, error: dogInsertError } = await supabase
        .from('chiens')
        .insert([dogData]);
      
      if (dogInsertError) throw dogInsertError;
      
      // Fermer le formulaire et afficher un message de succès
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      showMessage('Votre chien a été ajouté avec succès. Notre équipe va vous contacter pour planifier l\'évaluation.', 'success');
      
      // Rafraîchir l'affichage des chiens
      fetchAndDisplayDogs();
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du chien: ", error);
      submitBtn.textContent = 'Soumettre mon chien';
      submitBtn.disabled = false;
      showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    }
  });
}

// Ajouter des gestionnaires d'événements pour les boutons d'ajout de chien
document.addEventListener('DOMContentLoaded', () => {
  // Bouton dans la page des chiens
  document.getElementById('inscrireChienBtn').addEventListener('click', async () => {
    // Si l'utilisateur est connecté, afficher le formulaire
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      createDogForm();
    } else {
      // Sinon, rediriger vers la page de profil
      showTab('profil');
      showMessage('Veuillez vous connecter pour ajouter un chien.', 'warning');
    }
  });
  
  // Bouton dans la page de profil
  document.getElementById('inscriptionChienBtn').addEventListener('click', async () => {
    // Si l'utilisateur est connecté, afficher le formulaire
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      createDogForm();
    } else {
      // Mettre en évidence le formulaire de connexion
      const loginForm = document.querySelector('#profil-content form:first-of-type');
      loginForm.classList.add('ring-2', 'ring-basque-red', 'ring-opacity-50', 'rounded-lg');
      setTimeout(() => {
        loginForm.classList.remove('ring-2', 'ring-basque-red', 'ring-opacity-50', 'rounded-lg');
      }, 2000);
      
      showMessage('Veuillez vous connecter pour ajouter un chien.', 'warning');
    }
  });
});
