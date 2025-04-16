// Gestion du formulaire d'ajout de chien

// Fonction pour créer le formulaire
async function createDogForm() {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase n'est pas initialisé");
    showMessage("Erreur de connexion au service", "error");
    return;
  }
  
  // Vérifier si l'utilisateur est connecté
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showTab('profil');
      showMessage('Veuillez vous connecter pour ajouter un chien.', 'warning');
      return;
    }
    
    // Créer le formulaire en HTML
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
              <div id="photoDropArea" class="mt-1 relative border-2 border-gray-300 border-dashed rounded-lg p-6 flex flex-col justify-center items-center">
                <input type="file" id="dogPhoto" name="dogPhoto" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Cliquez pour sélectionner ou déposez une image</p>
                <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                
                <div id="imagePreviewContainer" class="mt-4 hidden">
                  <img id="imagePreview" src="#" alt="Aperçu" class="h-32 w-auto mx-auto rounded-lg">
                  <button type="button" id="removePreview" class="mt-2 inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    Supprimer
                  </button>
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
    
    // Ajouter le formulaire au document
    document.body.appendChild(content);
    document.body.style.overflow = 'hidden';
    
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      // Gestionnaire pour fermer le formulaire
      document.getElementById('closeDogFormBtn')?.addEventListener('click', () => {
        document.body.removeChild(content);
        document.body.style.overflow = '';
      });
      
      document.getElementById('dogFormOverlay')?.addEventListener('click', () => {
        document.body.removeChild(content);
        document.body.style.overflow = '';
      });
      
      // Gestion de la prévisualisation d'image simplifiée
      const photoInput = document.getElementById('dogPhoto');
      const imagePreview = document.getElementById('imagePreview');
      const previewContainer = document.getElementById('imagePreviewContainer');
      const removePreviewBtn = document.getElementById('removePreview');
      const dropArea = document.getElementById('photoDropArea');
      
      if (photoInput && imagePreview && previewContainer && removePreviewBtn && dropArea) {
        // Gestion des événements de glisser-déposer
        ['dragenter', 'dragover'].forEach(event => {
          dropArea.addEventListener(event, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropArea.classList.add('border-basque-red', 'bg-red-50');
          });
        });
        
        ['dragleave', 'drop'].forEach(event => {
          dropArea.addEventListener(event, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropArea.classList.remove('border-basque-red', 'bg-red-50');
          });
        });
        
        // Gestion du dépôt de fichier
        dropArea.addEventListener('drop', (e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) {
            photoInput.files = e.dataTransfer.files;
            updateImagePreview(photoInput.files[0]);
          }
        });
        
        // Gestion du changement de fichier via le sélecteur
        photoInput.addEventListener('change', () => {
          if (photoInput.files.length) {
            updateImagePreview(photoInput.files[0]);
          }
        });
        
        // Suppression de l'aperçu
        removePreviewBtn.addEventListener('click', () => {
          photoInput.value = '';
          previewContainer.classList.add('hidden');
        });
        
        // Fonction pour mettre à jour l'aperçu
        function updateImagePreview(file) {
          if (!file || !file.type.match('image.*')) {
            showMessage('Veuillez sélectionner une image valide.', 'warning');
            return;
          }
          
          console.log("Prévisualisation de l'image:", file.name, "Taille:", Math.round(file.size/1024), "KB");
          
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
          };
          
          reader.onerror = (error) => {
            console.error("Erreur lors de la lecture du fichier:", error);
            showMessage('Erreur lors de la prévisualisation de l\'image.', 'error');
          };
          
          reader.readAsDataURL(file);
        }
      } else {
        console.error("Éléments manquants:", {
          photoInput: !!photoInput,
          imagePreview: !!imagePreview,
          previewContainer: !!previewContainer,
          removePreviewBtn: !!removePreviewBtn,
          dropArea: !!dropArea
        });
      }
      
      // Gestion du formulaire
      const form = document.getElementById('dogForm');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const dogName = document.getElementById('dogName')?.value;
          const dogBreed = document.getElementById('dogBreed')?.value;
          const dogAge = document.getElementById('dogAge')?.value;
          const dogSex = document.getElementById('dogSex')?.value;
          const dogLocation = document.getElementById('dogLocation')?.value;
          const dogDescription = document.getElementById('dogDescription')?.value;
          const ownerName = document.getElementById('ownerName')?.value;
          const ownerPhone = document.getElementById('ownerPhone')?.value;
          const ownerEmail = document.getElementById('ownerEmail')?.value;
          const dogTerms = document.getElementById('dogTerms')?.checked;
          const dogPhoto = document.getElementById('dogPhoto')?.files?.[0];
          
          if (!dogName || !dogBreed || !dogAge || !dogSex || !dogLocation || !dogDescription || 
              !ownerName || !ownerPhone || !ownerEmail || !dogTerms) {
            showMessage('Veuillez remplir tous les champs obligatoires.', 'warning');
            return;
          }
          
          // Changer le bouton en indicateur de chargement
          const submitBtn = document.getElementById('submitDogBtn');
          if (submitBtn) {
            submitBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
            submitBtn.disabled = true;
          }
          
          try {
            // Upload de la photo si présente
            let photoUrl = null;
            if (dogPhoto) {
              try {
                photoUrl = await uploadDogPhoto(dogPhoto, supabase);
              } catch (photoError) {
                console.error("Erreur lors de l'upload de la photo:", photoError);
                showMessage("Impossible d'uploader la photo, mais les informations du chien seront sauvegardées.", 'warning');
              }
            }
            
            // Création de l'objet chien
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
            
            // Ajouter l'URL de la photo si disponible
            if (photoUrl) {
              dogData.photo_url = photoUrl;
            }
            
            // Insérer dans la base de données
            const { data: dogInsertData, error: dogInsertError } = await supabase
              .from('chiens')
              .insert([dogData]);
            
            if (dogInsertError) {
              console.error("Erreur détaillée lors de l'ajout du chien:", dogInsertError);
              throw dogInsertError;
            }
            
            // Fermer le formulaire et afficher un message de succès
            document.body.removeChild(content);
            document.body.style.overflow = '';
            
            showMessage('Votre chien a été ajouté avec succès. Notre équipe va vous contacter pour planifier l\'évaluation.', 'success');
            
            // Rafraîchir l'affichage des chiens
            if (typeof fetchAndDisplayDogs === 'function') {
              fetchAndDisplayDogs();
            }
          } catch (error) {
            console.error("Erreur lors de l'ajout du chien:", error);
            if (submitBtn) {
              submitBtn.textContent = 'Soumettre mon chien';
              submitBtn.disabled = false;
            }
            showMessage('Une erreur s\'est produite: ' + (error.message || 'Veuillez réessayer.'), 'error');
          }
        });
      } else {
        console.error("Formulaire non trouvé");
      }
    }, 100); // Petit délai pour s'assurer que le DOM est mis à jour
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    showMessage("Une erreur s'est produite. Veuillez réessayer.", "error");
  }
}

// Fonction pour télécharger une photo vers Supabase
async function uploadDogPhoto(dogPhoto, supabase) {
  if (!dogPhoto) return null;
  
  try {
    console.log("Début de l'upload de la photo:", dogPhoto.name);
    
    // Liste des buckets disponibles
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error("Erreur lors de la vérification des buckets:", bucketError);
      throw bucketError;
    }
    
    console.log("Buckets disponibles:", buckets.map(b => b.name).join(', '));
    
    // Vérifier si le bucket 'photos' existe
    const photosBucketExists = buckets.some(bucket => bucket.name === 'photos');
    if (!photosBucketExists) {
      console.error("Le bucket 'photos' n'existe pas dans Supabase");
      // Tenter de créer le bucket
      try {
        const { data, error } = await supabase.storage.createBucket('photos', {
          public: true
        });
        if (error) throw error;
        console.log("Bucket 'photos' créé avec succès");
      } catch (createError) {
        console.error("Impossible de créer le bucket 'photos':", createError);
        throw new Error("Le bucket 'photos' n'existe pas et ne peut pas être créé.");
      }
    }
    
    // Créer un nom de fichier unique
    const fileExt = dogPhoto.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`; // Pas de sous-dossier pour simplifier
    
    console.log("Chemin du fichier pour l'upload:", filePath);
    
    // Tester avec un fichier très petit d'abord
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, dogPhoto, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Erreur lors de l'upload:", uploadError);
      throw uploadError;
    }
    
    console.log("Upload réussi:", uploadData);
    
    // Obtenir l'URL publique de la photo
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);
    
    console.log("URL obtenue pour la photo:", urlData);
    const photoUrl = urlData.publicUrl;
    console.log("URL finale de la photo:", photoUrl);
    
    return photoUrl;
  } catch (error) {
    console.error("Erreur complète lors de l'upload de la photo:", error);
    throw error;
  }
}

// Ajouter des gestionnaires d'événements pour les boutons d'ajout de chien
document.addEventListener('DOMContentLoaded', () => {
  console.log("Initialisation du formulaire de chien");
  
  // Bouton dans la page des chiens
  const inscrireChienBtn = document.getElementById('inscrireChienBtn');
  if (inscrireChienBtn) {
    inscrireChienBtn.addEventListener('click', async () => {
      // Si l'utilisateur est connecté, afficher le formulaire
      const supabase = window.supabaseClient;
      if (!supabase) {
        console.error("Supabase n'est pas initialisé");
        showMessage("Erreur de connexion au service", "error");
        return;
      }
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          createDogForm();
        } else {
          // Sinon, rediriger vers la page de profil
          showTab('profil');
          showMessage('Veuillez vous connecter pour ajouter un chien.', 'warning');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        showMessage("Une erreur s'est produite. Veuillez réessayer.", "error");
      }
    });
  }
  
  // Bouton dans la page de profil
  const inscriptionChienBtn = document.getElementById('inscriptionChienBtn');
  if (inscriptionChienBtn) {
    inscriptionChienBtn.addEventListener('click', async () => {
      // Si l'utilisateur est connecté, afficher le formulaire
      const supabase = window.supabaseClient;
      if (!supabase) {
        console.error("Supabase n'est pas initialisé");
        showMessage("Erreur de connexion au service", "error");
        return;
      }
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          createDogForm();
        } else {
          // Mettre en évidence le formulaire de connexion
          const loginForm = document.querySelector('#profil-content form:first-of-type');
          if (loginForm) {
            loginForm.classList.add('ring-2', 'ring-basque-red', 'ring-opacity-50', 'rounded-lg');
            setTimeout(() => {
              loginForm.classList.remove('ring-2', 'ring-basque-red', 'ring-opacity-50', 'rounded-lg');
            }, 2000);
          }
          
          showMessage('Veuillez vous connecter pour ajouter un chien.', 'warning');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        showMessage("Une erreur s'est produite. Veuillez réessayer.", "error");
      }
    });
  }
});

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
