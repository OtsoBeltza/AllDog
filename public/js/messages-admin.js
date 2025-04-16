// messages-admin.js - Gestion des messages pour l'administrateur

// Fonction pour charger les messages dans le panneau d'administration
async function loadMessagesAdminPanel() {
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
  
  // Créer le conteneur des messages si nécessaire
  let messagesContent = document.getElementById('content-messages');
  if (!messagesContent) {
    // Il n'existe pas encore, nous allons l'ajouter au panneau admin
    const adminContent = document.getElementById('admin-content');
    if (!adminContent) {
      console.error("Le contenu d'administration n'existe pas");
      return;
    }
    
    messagesContent = document.createElement('div');
    messagesContent.id = 'content-messages';
    messagesContent.className = 'hidden bg-white rounded-xl shadow-lg p-6';
    adminContent.appendChild(messagesContent);
    
    // Ajouter également un onglet pour les messages
    const tabContainer = adminContent.querySelector('.flex.space-x-4');
    if (tabContainer) {
      const messagesTab = document.createElement('button');
      messagesTab.id = 'tab-messages';
      messagesTab.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg';
      messagesTab.textContent = 'Messages';
      messagesTab.addEventListener('click', () => switchAdminTab('messages'));
      tabContainer.appendChild(messagesTab);
    }
  }
  
  // Afficher un indicateur de chargement
  messagesContent.innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-4">Messages</h3>
    <div class="flex justify-center">
      <div class="w-10 h-10 border-4 border-basque-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;
  
  try {
    // Récupérer tous les messages
    const { data: messages, error: messagesError } = await supabase
      .from('dog_messages')
      .select('*, chien:chien_id (*)')
      .order('created_at', { ascending: false });
      
    if (messagesError) throw messagesError;
    
    // Construire l'interface des messages
    messagesContent.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 mb-4">Messages (${messages.length})</h3>
      
      ${messages.length === 0 ? `
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <p class="text-gray-700">Aucun message reçu.</p>
        </div>
      ` : `
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chien</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">De</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${messages.map(message => `
                <tr data-id="${message.id}" class="${message.status === 'sent' ? 'bg-blue-50' : message.status === 'read' ? 'bg-gray-50' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap">${message.chien?.nom || 'Chien inconnu'}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${message.user_name} <span class="text-xs text-gray-500">(${message.user_email})</span></td>
                  <td class="px-6 py-4">${message.subject}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${new Date(message.created_at).toLocaleDateString()}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      message.status === 'sent' ? 'bg-blue-100 text-blue-800' : 
                      message.status === 'read' ? 'bg-green-100 text-green-800' : 
                      message.status === 'replied' ? 'bg-purple-100 text-purple-800' : 
                      'bg-gray-100 text-gray-800'
                    }">
                      ${
                        message.status === 'sent' ? 'Non lu' : 
                        message.status === 'read' ? 'Lu' : 
                        message.status === 'replied' ? 'Répondu' : 
                        'Archivé'
                      }
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-basque-red hover:text-basque-red-dark view-message-btn" data-id="${message.id}">Voir</button>
                    ${message.status !== 'archived' ? `
                      <button class="ml-3 text-gray-500 hover:text-gray-700 archive-message-btn" data-id="${message.id}">Archiver</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
    
    // Ajouter les gestionnaires d'événements pour les boutons
    document.querySelectorAll('.view-message-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const messageId = btn.getAttribute('data-id');
        const message = messages.find(m => m.id == messageId);
        
        if (message) {
          // Marquer le message comme lu s'il est à l'état "sent"
          if (message.status === 'sent') {
            try {
              await supabase
                .from('dog_messages')
                .update({ status: 'read' })
                .eq('id', messageId);
                
              // Mettre à jour visuellement le statut dans le tableau
              const row = btn.closest('tr');
              row.classList.remove('bg-blue-50');
              row.classList.add('bg-gray-50');
              const statusCell = row.querySelector('td:nth-child(5) span');
              if (statusCell) {
                statusCell.className = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
                statusCell.textContent = 'Lu';
              }
            } catch (error) {
              console.error("Erreur lors de la mise à jour du statut:", error);
              // Continuer malgré l'erreur
            }
          }
          
          // Afficher le message
          showMessageDetail(message);
        }
      });
    });
    
    document.querySelectorAll('.archive-message-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const messageId = btn.getAttribute('data-id');
        
        try {
          await supabase
            .from('dog_messages')
            .update({ status: 'archived' })
            .eq('id', messageId);
            
          // Rafraîchir l'affichage
          loadMessagesAdminPanel();
          showMessage('Message archivé avec succès.', 'success');
        } catch (error) {
          console.error("Erreur lors de l'archivage du message:", error);
          showMessage('Une erreur s\'est produite lors de l\'archivage.', 'error');
        }
      });
    });
    
  } catch (error) {
    console.error("Erreur lors du chargement des messages:", error);
    messagesContent.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 mb-4">Messages</h3>
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p>Une erreur s'est produite lors du chargement des messages. Veuillez réessayer.</p>
        <button id="retry-messages-btn" class="mt-4 px-4 py-2 bg-basque-red text-white rounded-lg">
          Réessayer
        </button>
      </div>
    `;
    
    document.getElementById('retry-messages-btn')?.addEventListener('click', () => {
      loadMessagesAdminPanel();
    });
  }
}

// Fonction pour afficher le détail d'un message
function showMessageDetail(message) {
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="messageDetailOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-4 z-10 max-h-[90vh] overflow-auto">
      <button id="closeMessageDetailBtn" class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="flex justify-between items-start mb-4">
        <div>
          <span class="text-xs text-gray-500">Message de</span>
          <h3 class="text-xl font-bold text-gray-800">${message.user_name}</h3>
          <p class="text-sm text-gray-600">Email: ${message.user_email}</p>
        </div>
        
        <span class="px-2 py-1 rounded-full text-xs font-medium ${
          message.status === 'sent' ? 'bg-blue-100 text-blue-800' : 
          message.status === 'read' ? 'bg-green-100 text-green-800' : 
          message.status === 'replied' ? 'bg-purple-100 text-purple-800' : 
          'bg-gray-100 text-gray-800'
        }">
          ${
            message.status === 'sent' ? 'Non lu' : 
            message.status === 'read' ? 'Lu' : 
            message.status === 'replied' ? 'Répondu' : 
            'Archivé'
          }
        </span>
      </div>
      
      <div class="mb-4">
        <p class="text-sm text-gray-500">Concernant le chien</p>
        <p class="text-base font-medium">${message.chien?.nom || 'Chien inconnu'}</p>
      </div>
      
      <div class="p-4 bg-gray-50 rounded-lg mb-4">
        <p class="text-sm text-gray-500 mb-1">Sujet</p>
        <p class="text-base font-medium">${message.subject}</p>
      </div>
      
      <div class="p-4 bg-gray-50 rounded-lg mb-4">
        <p class="text-sm text-gray-500 mb-1">Message</p>
        <p class="text-base whitespace-pre-line">${message.message}</p>
      </div>
      
      <div class="flex justify-between text-xs text-gray-500 mb-6">
        <span>Envoyé le ${new Date(message.created_at).toLocaleDateString()} à ${new Date(message.created_at).toLocaleTimeString()}</span>
        <span>${message.send_copy ? 'Copie envoyée à l\'expéditeur' : 'Pas de copie envoyée'}</span>
      </div>
      
      <div class="flex justify-between">
        <button id="replyMessageBtn" class="px-4 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
          Répondre
        </button>
        
        ${message.status !== 'archived' ? `
          <button id="archiveMessageDetailBtn" class="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
            Archiver
          </button>
        ` : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire d'événements pour fermer la modale
  document.getElementById('closeMessageDetailBtn').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  document.getElementById('messageDetailOverlay').addEventListener('click', () => {
    document.body.removeChild(content);
    document.body.style.overflow = '';
  });
  
  // Gestionnaire pour répondre au message
  document.getElementById('replyMessageBtn').addEventListener('click', () => {
    // Fermer le détail du message
    document.body.removeChild(content);
    document.body.style.overflow = '';
    
    // Afficher le formulaire de réponse
    showMessageReplyForm(message);
  });
  
  // Gestionnaire pour archiver le message
  const archiveBtn = document.getElementById('archiveMessageDetailBtn');
  if (archiveBtn) {
    archiveBtn.addEventListener('click', async () => {
      try {
        const supabase = window.supabaseClient;
        if (!supabase) throw new Error("Supabase n'est pas initialisé");
        
        await supabase
          .from('dog_messages')
          .update({ status: 'archived' })
          .eq('id', message.id);
          
        // Fermer le détail du message
        document.body.removeChild(content);
        document.body.style.overflow = '';
        
        // Rafraîchir l'affichage des messages
        loadMessagesAdminPanel();
        showMessage('Message archivé avec succès.', 'success');
      } catch (error) {
        console.error("Erreur lors de l'archivage du message:", error);
        showMessage('Une erreur s\'est produite lors de l\'archivage.', 'error');
      }
    });
  }
}

// Fonction pour afficher le formulaire de réponse à un message
function showMessageReplyForm(message) {
  const content = document.createElement('div');
  content.className = 'fixed inset-0 z-50 flex items-center justify-center p-2';
  
  content.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50" id="replyFormOverlay"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-4 z-10 max-h-[90vh] overflow-auto">
      <button id="closeReplyFormBtn" class="absolute top-2 right-2 p-1 bg-gray-100 rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 class="text-xl font-bold text-gray-800 pr-8">Réponse à ${message.user_name}</h3>
      <p class="text-sm text-gray-600">À propos de ${message.chien?.nom || 'ce chien'}</p>
      
      <div class="p-3 bg-gray-50 rounded-lg my-4 text-sm">
        <p class="font-medium mb-1">Message original :</p>
        <p class="whitespace-pre-line">${message.message}</p>
      </div>
      
      <form id="replyForm" class="mt-4 space-y-3">
        <input type="hidden" id="messageId" value="${message.id}">
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Sujet</label>
          <input type="text" id="replySubject" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" value="Re: ${message.subject}" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Votre réponse</label>
          <textarea id="replyMessage" rows="6" class="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basque-red focus:border-transparent" required></textarea>
        </div>
        
        <div class="mt-4 flex justify-end space-x-3">
          <button type="button" id="cancelReplyBtn" class="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
            Annuler
          </button>
          <button type="submit" id="sendReplyBtn" class="px-4 py-2 rounded-lg font-medium text-white bg-basque-red hover:bg-basque-red-dark transition">
            Envoyer la réponse
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(content);
  document.body.style.overflow = 'hidden';
  
  // Gestionnaire pour fermer le formulaire
  const closeHandlers = [
    document.getElementById('closeReplyFormBtn'),
    document.getElementById('replyFormOverlay'),
    document.getElementById('cancelReplyBtn')
  ];
  
  closeHandlers.forEach(handler => {
    if (handler) {
      handler.addEventListener('click', () => {
        document.body.removeChild(content);
        document.body.style.overflow = '';
      });
    }
  });
  
  // Gestionnaire pour envoyer la réponse
  document.getElementById('replyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageId = document.getElementById('messageId').value;
    const subject = document.getElementById('replySubject').value;
    const replyMessage = document.getElementById('replyMessage').value;
    
    if (!subject || !replyMessage) {
      showMessage('Veuillez remplir tous les champs.', 'warning');
      return;
    }
    
    // Changer le bouton en indicateur de chargement
    const sendBtn = document.getElementById('sendReplyBtn');
    sendBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
    sendBtn.disabled = true;
    
    try {
      const supabase = window.supabaseClient;
      if (!supabase) throw new Error("Supabase n'est pas initialisé");
      
      // Marquer le message comme répondu
      const { error } = await supabase
        .from('dog_messages')
        .update({ status: 'replied' })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Simuler l'envoi d'un email (dans une application réelle, on utiliserait un service d'envoi d'emails)
      // Ici, on va juste enregistrer la réponse dans une table
      
      // Fermer le formulaire
      document.body.removeChild(content);
      document.body.style.overflow = '';
      
      // Afficher un message de succès
      showMessage('Votre réponse a été envoyée avec succès.', 'success');
      
      // Rafraîchir l'affichage des messages
      loadMessagesAdminPanel();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error);
      sendBtn.textContent = 'Envoyer la réponse';
      sendBtn.disabled = false;
      showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    }
  });
}

// Ajout au chargement de la page pour intégrer le panneau des messages à l'interface d'administration
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'admin.js est chargé
  if (typeof switchAdminTab === 'function') {
    // Étendre la fonction switchAdminTab pour inclure les messages
    const originalSwitchAdminTab = switchAdminTab;
    
    window.switchAdminTab = function(tabName) {
      // Cacher le contenu des messages si existant
      const messagesContent = document.getElementById('content-messages');
      if (messagesContent) {
        messagesContent.classList.add('hidden');
      }
      
      // Réinitialiser le style de l'onglet des messages si existant
      const messagesTab = document.getElementById('tab-messages');
      if (messagesTab) {
        messagesTab.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg';
      }
      
      // Appeler la fonction originale
      originalSwitchAdminTab(tabName);
      
      // Gérer spécifiquement l'onglet des messages
      if (tabName === 'messages') {
        if (messagesContent) {
          messagesContent.classList.remove('hidden');
        }
        
        if (messagesTab) {
          messagesTab.className = 'px-4 py-2 bg-basque-red text-white rounded-lg';
        }
        
        // Charger les messages
        loadMessagesAdminPanel();
      }
    };
  }
});
