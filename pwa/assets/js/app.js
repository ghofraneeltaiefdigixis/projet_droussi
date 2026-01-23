// ============================================
// Droussi - JavaScript Principal
// ============================================

// ============================================
// Utilitaires réutilisables
// ============================================
const AppUtils = {
  // Validation d'email
  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  // Toggle affichage/masquage du mot de passe
  initPasswordToggle(passwordInput, toggleBtn) {
    if (!passwordInput || !toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      const icon = toggleBtn.querySelector('ion-icon');
      if (icon) {
        icon.setAttribute('name', type === 'password' ? 'eye-off-outline' : 'eye-outline');
      }
    });
  },

  // Validation et activation du bouton pour formulaires email/password
  initEmailPasswordForm(emailInput, passwordInput, continueBtn, form, redirectUrl) {
    if (!emailInput || !passwordInput || !continueBtn || !form) return;

    const checkForm = () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      
      const isValid = AppUtils.validateEmail(email) && password.length > 0;
      continueBtn.disabled = !isValid;
      continueBtn.classList.toggle('active', isValid);
    };

    emailInput.addEventListener('input', checkForm);
    passwordInput.addEventListener('input', checkForm);

    // Ne pas ajouter de listener submit si redirectUrl est null (pour permettre la gestion externe)
    if (redirectUrl !== null) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          console.log('Formulaire soumis:', { 
            email: emailInput.value.trim(), 
            password: passwordInput.value.trim() 
          });
        }
      });
    }
  },

  // Normaliser les clés (gérer les espaces, tirets, caractères spéciaux)
  normalizeKey(str) {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9-]/g, '');
  },

  // Filtrer les options d'un dropdown
  filterOptions(input, dropdown, options) {
    if (!input || !dropdown || !Array.isArray(options)) return;
    
    const searchTerm = (input.value || '').toLowerCase().trim();
    const filtered = options.filter(opt => {
      if (!opt || typeof opt !== 'string') return false;
      return opt.toLowerCase().includes(searchTerm);
    });
    
    dropdown.innerHTML = '';
    if (filtered.length === 0) {
      dropdown.innerHTML = '<div class="select-option no-results">Aucun résultat</div>';
    } else {
      filtered.forEach(option => {
        const div = document.createElement('div');
        div.className = 'select-option';
        div.textContent = option;
        div.setAttribute('data-value', AppUtils.normalizeKey(option));
        dropdown.appendChild(div);
      });
    }
  },
  
  // Gestion d'erreur générique
  handleError(error, context) {
    console.error(`Erreur dans ${context}:`, error);
    // Ici, vous pourriez envoyer l'erreur à un service de logging
    return null;
  }
};

// ============================================
// Page Index - Redirection automatique
// ============================================
if (document.querySelector('.welcome-container')) {
  setTimeout(function() {
    window.location.href = 'Choix_role.html';
  }, 3000);
}

// ============================================
// Page Choisir Compte - Sélection parent/enseignant
// ============================================
if (document.querySelector('[data-account="parent"]')) {
  document.addEventListener('DOMContentLoaded', function() {
    const parentBtn = document.querySelector('[data-account="parent"]');
    const teacherBtn = document.querySelector('[data-account="teacher"]');
    
    if (parentBtn) {
      parentBtn.addEventListener('click', function() {
        // Enregistrer le rôle dans localStorage
        try {
          localStorage.setItem('userRole', 'parent');
          // Rediriger vers la page de connexion
          window.location.href = 'Connexion.html';
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement du rôle:', error);
          // Rediriger quand même vers la connexion
          window.location.href = 'Connexion.html';
        }
      });
    }
    
    if (teacherBtn) {
      teacherBtn.addEventListener('click', function() {
        // Enregistrer le rôle dans localStorage
        try {
          localStorage.setItem('userRole', 'teacher');
          // Rediriger vers la page de connexion
          window.location.href = 'Connexion.html';
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement du rôle:', error);
          // Rediriger quand même vers la connexion
          window.location.href = 'Connexion.html';
        }
      });
    }
  });
}

// ============================================
// Fonction utilitaire pour rediriger selon le rôle
// ============================================
function redirectBasedOnRole() {
  try {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'parent') {
      window.location.href = 'Parent.html';
    } else if (userRole === 'teacher') {
      window.location.href = 'Teacher.html';
    } else {
      // Si aucun rôle n'est défini, rediriger vers la page de choix de rôle
      window.location.href = 'Choix_role.html';
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du rôle:', error);
    window.location.href = 'Choix_role.html';
  }
}

// ============================================
// Pages Connexion et Création de Compte
// ============================================
if (document.getElementById('loginForm') || document.getElementById('emailForm')) {
  const form = document.getElementById('loginForm') || document.getElementById('emailForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const continueBtn = document.getElementById('continueBtn');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const googleBtn = document.getElementById('googleBtn');

  if (form && emailInput && passwordInput && continueBtn) {
    // Initialiser le toggle password
    if (togglePasswordBtn) {
      AppUtils.initPasswordToggle(passwordInput, togglePasswordBtn);
    }

    // Initialiser la validation du formulaire avec redirection selon le rôle après connexion
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (continueBtn && !continueBtn.disabled) {
        // Ici, vous pouvez ajouter la logique d'authentification
        // Pour l'instant, on redirige directement selon le rôle
        redirectBasedOnRole();
      }
    });
    
    // Initialiser la validation du formulaire (sans redirection automatique)
    AppUtils.initEmailPasswordForm(emailInput, passwordInput, continueBtn, form, null);
  }
}

// ============================================
// Pages Création de Compte - Sélection de compte Google/Facebook
// ============================================
if (document.getElementById('googleBtn') || document.getElementById('facebookBtn')) {
  const googleBtn = document.getElementById('googleBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const accountSelectModal = document.getElementById('accountSelectModal');
  const accountList = document.getElementById('accountList');
  const closeAccountSelect = document.getElementById('closeAccountSelect');
  const accountSelectTitle = document.getElementById('accountSelectTitle');
  const accountSelectLogo = document.getElementById('accountSelectLogo');
  const backdrop = accountSelectModal ? accountSelectModal.querySelector('.account-select-backdrop') : null;

  // Comptes d'exemple (à remplacer par les vrais comptes de l'utilisateur depuis l'API)
  // En production, ces comptes seront récupérés depuis les APIs Google/Facebook
  const sampleGoogleAccounts = [
    { name: 'ghofrane eltaief', email: 'ghofraneeltaief48@gmail.com', avatar: null, hasPhoto: true },
    { name: 'Ghofrane Eltaief', email: 'ghofrane@hipto.com', avatar: null, hasPhoto: true },
    { name: 'Ghofrane Eltaief', email: 'ghofraneeltaief.digixis@gmail.com', avatar: null, hasPhoto: false }
  ];

  const sampleFacebookAccounts = [
    { name: 'Ghofrane Eltaief', email: 'ghofrane@facebook.com', avatar: null, hasPhoto: true },
    { name: 'John Doe', email: 'john@facebook.com', avatar: null, hasPhoto: false }
  ];

  // Fonction pour créer le logo du provider
  function createProviderLogo(provider) {
    if (!accountSelectLogo) return;
    
    accountSelectLogo.innerHTML = '';
    
    if (provider === 'google') {
      const googleLogo = document.createElement('div');
      googleLogo.className = 'provider-logo google-logo';
      googleLogo.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      `;
      accountSelectLogo.appendChild(googleLogo);
    } else if (provider === 'facebook') {
      const facebookLogo = document.createElement('div');
      facebookLogo.className = 'provider-logo facebook-logo';
      facebookLogo.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      `;
      accountSelectLogo.appendChild(facebookLogo);
    }
  }

  // Fonction pour ouvrir la modale de sélection de compte
  function openAccountSelectModal(provider) {
    if (!accountSelectModal || !accountList) return;

    // Définir le titre et le logo selon le provider
    const accounts = provider === 'google' ? sampleGoogleAccounts : sampleFacebookAccounts;
    const providerName = provider === 'google' ? 'Google' : 'Facebook';
    
    if (accountSelectTitle) {
      accountSelectTitle.textContent = `Sélectionner un compte pour utiliser Droussi`;
    }
    
    createProviderLogo(provider);

    // Vider la liste actuelle
    accountList.innerHTML = '';

    // Ajouter les comptes à la liste
    accounts.forEach((account, index) => {
      const accountItem = document.createElement('div');
      accountItem.className = 'account-item';
      accountItem.setAttribute('data-account-index', index);
      accountItem.setAttribute('data-provider', provider);
      
      // Créer l'avatar (photo de profil ou logo du provider)
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'account-avatar';
      
      if (account.hasPhoto && account.avatar) {
        // Si une photo est disponible
        const img = document.createElement('img');
        img.src = account.avatar;
        img.alt = account.name;
        avatarDiv.appendChild(img);
      } else {
        // Sinon, utiliser le logo du provider ou les initiales
        if (provider === 'google') {
          avatarDiv.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          `;
        } else {
          // Initiales pour Facebook
          const initials = account.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          avatarDiv.textContent = initials;
          avatarDiv.style.background = '#1877F2';
          avatarDiv.style.color = 'white';
        }
      }
      
      // Créer les informations du compte
      const infoDiv = document.createElement('div');
      infoDiv.className = 'account-info';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'account-name';
      nameDiv.textContent = account.name;
      
      const emailDiv = document.createElement('div');
      emailDiv.className = 'account-email';
      emailDiv.textContent = account.email;
      
      const connectText = document.createElement('div');
      connectText.className = 'account-connect-text';
      connectText.textContent = `Se connecter avec ${providerName}`;
      
      infoDiv.appendChild(nameDiv);
      infoDiv.appendChild(emailDiv);
      infoDiv.appendChild(connectText);
      
      accountItem.appendChild(avatarDiv);
      accountItem.appendChild(infoDiv);
      
      // Gérer le clic sur un compte
      accountItem.addEventListener('click', function(e) {
        e.preventDefault();
        // Fermer la modale
        closeAccountSelectModal();
        // Rediriger selon le rôle après sélection du compte
        setTimeout(function() {
          redirectBasedOnRole();
        }, 300);
      });
      
      accountList.appendChild(accountItem);
    });

    // Afficher la modale
    accountSelectModal.style.display = 'block';
    // Petit délai pour permettre l'animation
    setTimeout(function() {
      accountSelectModal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  // Fonction pour fermer la modale
  function closeAccountSelectModal() {
    if (accountSelectModal) {
      accountSelectModal.classList.remove('show');
      // Attendre la fin de l'animation avant de cacher
      setTimeout(function() {
        accountSelectModal.style.display = 'none';
      }, 300);
      document.body.style.overflow = '';
    }
  }

  // Gérer le clic sur le bouton Google
  if (googleBtn) {
    googleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Ouvrir le modal de sélection de compte Google
      openAccountSelectModal('google');
    });
  }

  // Gérer le clic sur le bouton Facebook
  if (facebookBtn) {
    facebookBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Ouvrir le modal de sélection de compte Facebook
      openAccountSelectModal('facebook');
    });
  }

  // Gérer la fermeture
  if (closeAccountSelect) {
    closeAccountSelect.addEventListener('click', function(e) {
      e.preventDefault();
      closeAccountSelectModal();
    });
  }

  // Fermer la modale en cliquant sur le backdrop
  if (backdrop) {
    backdrop.addEventListener('click', function(e) {
      e.preventDefault();
      closeAccountSelectModal();
    });
  }
}

// ============================================
// Page Gouvernorat - Sélection avec recherche
// ============================================
if (document.getElementById('governoratForm')) {
  // Données de délégations par gouvernorat (tous les gouvernorats tunisiens)
  const delegationsByGovernorat = {
    'tunis': ['Bab Bhar', 'Bab Souika', 'Cité El Khadra', 'El Kabaria', 'El Menzah', 'El Omrane', 'Ettahrir', 'Hrairia', 'La Goulette', 'Le Bardo', 'Médina', 'Séjoumi', 'Sidi El Béchir'],
    'ariana': ['Ariana Ville', 'Ettadhamen', 'Ettadhamen-Mnihla', 'Kalâat el-Andalous', 'La Soukra', 'Mnihla', 'Raoued', 'Sidi Thabet'],
    'ben-arous': ['Ben Arous', 'Bou Mhel el-Bassatine', 'El Mourouj', 'Ezzahra', 'Fouchana', 'Hammam Chott', 'Hammam Lif', 'Mégrine', 'Mohamedia', 'Mornag', 'Radès'],
    'manouba': ['Borj El Amri', 'Douar Hicher', 'El Battan', 'Jedaida', 'Manouba', 'Mornaguia', 'Oued Ellil', 'Tebourba'],
    'nabeul': ['Beni Khalled', 'Bou Argoub', 'Dar Chaabane', 'El Haouaria', 'Grombalia', 'Hammamet', 'Kelibia', 'Korba', 'Menzel Bouzelfa', 'Menzel Temime', 'Nabeul', 'Soliman', 'Takelsa'],
    'zaghouan': ['Bir Mcherga', 'El Fahs', 'Nadhour', 'Saouaf', 'Zaghouan', 'Zriba'],
    'bizerte': ['Bizerte Nord', 'Bizerte Sud', 'El Alia', 'Ghar El Melh', 'Mateur', 'Menzel Bourguiba', 'Menzel Jemil', 'Ras Jebel', 'Sejnane', 'Tinja', 'Utique', 'Zarzouna'],
    'beja': ['Amdoun', 'Beja Nord', 'Beja Sud', 'Goubellat', 'Medjez El Bab', 'Nefza', 'Teboursouk', 'Testour', 'Thibar'],
    'jendouba': ['Ain Draham', 'Balta Bou Aouane', 'Bou Salem', 'Fernana', 'Ghardimaou', 'Jendouba', 'Oued Meliz', 'Tabarka'],
    'kef': ['Dahmani', 'El Ksour', 'Jérissa', 'Kalaat Khasba', 'Kalaat Senan', 'Le Kef', 'Nebeur', 'Sakiet Sidi Youssef', 'Sers', 'Tajerouine'],
    'siliana': ['Bargou', 'Bou Arada', 'El Aroussa', 'El Krib', 'Gaâfour', 'Kesra', 'Makthar', 'Rouhia', 'Siliana', 'Siliana Nord', 'Siliana Sud'],
    'kairouan': ['Bou Hajla', 'Chebika', 'El Ala', 'Haffouz', 'Hajeb El Ayoun', 'Kairouan Nord', 'Kairouan Sud', 'Nasrallah', 'Oueslatia', 'Sbikha'],
    'kasserine': ['El Ayoun', 'Ezzouhour', 'Fériana', 'Foussana', 'Haidra', 'Hassi El Ferid', 'Jedelienne', 'Kasserine Nord', 'Kasserine Sud', 'Majel Bel Abbès', 'Sbeitla', 'Sbiba', 'Thala'],
    'sidi-bouzid': ['Bir El Hafey', 'Cebbala Ouled Asker', 'Jilma', 'Meknassy', 'Menzel Bouzaiane', 'Ouled Haffouz', 'Regueb', 'Sidi Ali Ben Aoun', 'Sidi Bouzid Est', 'Sidi Bouzid Ouest', 'Souk Jedid'],
    'sfax': ['Agareb', 'Bir Ali Ben Khalifa', 'El Amra', 'El Hencha', 'Gremda', 'Jebeniana', 'Kerkenah', 'Mahares', 'Menzel Chaker', 'Sakiet Eddaier', 'Sakiet Ezzit', 'Sfax Est', 'Sfax Ouest', 'Sfax Sud', 'Skhira', 'Thyna'],
    'mahdia': ['Bou Merdes', 'Chebba', 'El Jem', 'Essouassi', 'Hiboun', 'Ksour Essef', 'Mahdia', 'Mellouleche', 'Oued Chergui', 'Sidi Alouane', 'Zeramdine'],
    'monastir': ['Bekalta', 'Beni Hassen', 'Jemmal', 'Ksar Hellal', 'Ksibet El Mediouni', 'Moknine', 'Monastir', 'Ouerdanine', 'Sahline', 'Sayada', 'Teboulba', 'Zeramdine'],
    'sousse': ['Akouda', 'Bouficha', 'Enfidha', 'Hammam Sousse', 'Hergla', 'Kalâa Kebira', 'Kalâa Seghira', 'Kondar', 'Msaken', 'Sidi Bou Ali', 'Sidi El Hani', 'Sousse Jawhara', 'Sousse Médina', 'Sousse Riadh', 'Zaouiet Sousse'],
    'kebili': ['Douz', 'El Faouar', 'Kebili Nord', 'Kebili Sud', 'Souk El Ahad'],
    'gabes': ['El Hamma', 'Gabes Médina', 'Gabes Ouest', 'Gabes Sud', 'Ghannouch', 'Mareth', 'Matmata', 'Menzel Habib', 'Métouia', 'Nouvelle Matmata'],
    'medenine': ['Ben Gardane', 'Beni Khedache', 'Djerba - Ajim', 'Djerba - Houmt Souk', 'Djerba - Midoun', 'Médenine Nord', 'Médenine Sud', 'Sidi Makhlouf', 'Zarzis'],
    'tataouine': ['Bir Lahmar', 'Dehiba', 'Ghomrassen', 'Remada', 'Smâr', 'Tataouine Nord', 'Tataouine Sud'],
    'gafsa': ['El Guettar', 'El Ksar', 'Gafsa Nord', 'Gafsa Sud', 'Mdhilla', 'Metlaoui', 'Moularès', 'Redeyef', 'Sened', 'Sidi Aich'],
    'tozeur': ['Degache', 'Hazoua', 'Nefta', 'Tameghza', 'Tozeur']
  };

  // Données d'écoles par délégation (uniquement les écoles primaires)
  const ecolesByDelegation = {
    // Tunis
    'bab-bhar': ['École Primaire Bab Bhar'],
    'bab-souika': ['École Primaire Bab Souika'],
    'cité-el-khadra': ['École Primaire Cité El Khadra'],
    'el-kabaria': ['École Primaire El Kabaria'],
    'el-menzah': ['École Primaire El Menzah'],
    'el-omrane': ['École Primaire El Omrane'],
    'ettahrir': ['École Primaire Ettahrir'],
    'hrairia': ['École Primaire Hrairia'],
    'la-goulette': ['École Primaire La Goulette'],
    'le-bardo': ['École Primaire Le Bardo'],
    'médina': ['École Primaire Médina'],
    'séjoumi': ['École Primaire Séjoumi'],
    'sidi-el-béchir': ['École Primaire Sidi El Béchir'],
    // Ariana
    'ariana-ville': ['École Primaire Ariana Ville'],
    'ettadhamen': ['École Primaire Ettadhamen'],
    'ettadhamen-mnihla': ['École Primaire Ettadhamen-Mnihla'],
    'kalâat-el-andalous': ['École Primaire Kalâat el-Andalous'],
    'la-soukra': ['École Primaire La Soukra'],
    'mnihla': ['École Primaire Mnihla'],
    'raoued': ['École Primaire Raoued'],
    'sidi-thabet': ['École Primaire Sidi Thabet'],
    // Ben Arous
    'ben-arous': ['École Primaire Ben Arous'],
    'bou-mhel-el-bassatine': ['École Primaire Bou Mhel el-Bassatine'],
    'el-mourouj': ['École Primaire El Mourouj'],
    'ezzahra': ['École Primaire Ezzahra'],
    'fouchana': ['École Primaire Fouchana'],
    'hammam-chott': ['École Primaire Hammam Chott'],
    'hammam-lif': ['École Primaire Hammam Lif'],
    'mégrine': ['École Primaire Mégrine'],
    'mohamedia': ['École Primaire Mohamedia'],
    'mornag': ['École Primaire Mornag'],
    'radès': ['École Primaire Radès'],
    // Manouba
    'borj-el-amri': ['École Primaire Borj El Amri'],
    'douar-hicher': ['École Primaire Douar Hicher'],
    'el-battan': ['École Primaire El Battan'],
    'jedaida': ['École Primaire Jedaida'],
    'manouba': ['École Primaire Manouba'],
    'mornaguia': ['École Primaire Mornaguia'],
    'oued-ellil': ['École Primaire Oued Ellil'],
    'tebourba': ['École Primaire Tebourba'],
    // Nabeul
    'beni-khalled': ['École Primaire Beni Khalled'],
    'bou-argoub': ['École Primaire Bou Argoub'],
    'dar-chaabane': ['École Primaire Dar Chaabane'],
    'el-haouaria': ['École Primaire El Haouaria'],
    'grombalia': ['École Primaire Grombalia'],
    'hammamet': ['École Primaire Hammamet'],
    'kelibia': ['École Primaire Kelibia'],
    'korba': ['École Primaire Korba'],
    'menzel-bouzelfa': ['École Primaire Menzel Bouzelfa'],
    'menzel-temime': ['École Primaire Menzel Temime'],
    'nabeul': ['École Primaire Nabeul'],
    'soliman': ['École Primaire Soliman'],
    'takelsa': ['École Primaire Takelsa'],
    // Zaghouan
    'bir-mcherga': ['École Primaire Bir Mcherga'],
    'el-fahs': ['École Primaire El Fahs'],
    'nadhour': ['École Primaire Nadhour'],
    'saouaf': ['École Primaire Saouaf'],
    'zaghouan': ['École Primaire Zaghouan'],
    'zriba': ['École Primaire Zriba'],
    // Bizerte
    'bizerte-nord': ['École Primaire Bizerte Nord'],
    'bizerte-sud': ['École Primaire Bizerte Sud'],
    'el-alia': ['École Primaire El Alia'],
    'ghar-el-melh': ['École Primaire Ghar El Melh'],
    'mateur': ['École Primaire Mateur'],
    'menzel-bourguiba': ['École Primaire Menzel Bourguiba'],
    'menzel-jemil': ['École Primaire Menzel Jemil'],
    'ras-jebel': ['École Primaire Ras Jebel'],
    'sejnane': ['École Primaire Sejnane'],
    'tinja': ['École Primaire Tinja'],
    'utique': ['École Primaire Utique'],
    'zarzouna': ['École Primaire Zarzouna'],
    // Béja
    'amdoun': ['École Primaire Amdoun'],
    'beja-nord': ['École Primaire Béja Nord'],
    'beja-sud': ['École Primaire Béja Sud'],
    'goubellat': ['École Primaire Goubellat'],
    'medjez-el-bab': ['École Primaire Medjez El Bab'],
    'nefza': ['École Primaire Nefza'],
    'teboursouk': ['École Primaire Teboursouk'],
    'testour': ['École Primaire Testour'],
    'thibar': ['École Primaire Thibar'],
    // Jendouba
    'ain-draham': ['École Primaire Ain Draham'],
    'balta-bou-aouane': ['École Primaire Balta Bou Aouane'],
    'bou-salem': ['École Primaire Bou Salem'],
    'fernana': ['École Primaire Fernana'],
    'ghardimaou': ['École Primaire Ghardimaou'],
    'jendouba': ['École Primaire Jendouba'],
    'oued-meliz': ['École Primaire Oued Meliz'],
    'tabarka': ['École Primaire Tabarka'],
    // Le Kef
    'dahmani': ['École Primaire Dahmani'],
    'el-ksour': ['École Primaire El Ksour'],
    'jérissa': ['École Primaire Jérissa'],
    'kalaat-khasba': ['École Primaire Kalaat Khasba'],
    'kalaat-senan': ['École Primaire Kalaat Senan'],
    'le-kef': ['École Primaire Le Kef'],
    'nebeur': ['École Primaire Nebeur'],
    'sakiet-sidi-youssef': ['École Primaire Sakiet Sidi Youssef'],
    'sers': ['École Primaire Sers'],
    'tajerouine': ['École Primaire Tajerouine'],
    // Siliana
    'bargou': ['École Primaire Bargou'],
    'bou-arada': ['École Primaire Bou Arada'],
    'el-aroussa': ['École Primaire El Aroussa'],
    'el-krib': ['École Primaire El Krib'],
    'gaâfour': ['École Primaire Gaâfour'],
    'kesra': ['École Primaire Kesra'],
    'makthar': ['École Primaire Makthar'],
    'rouhia': ['École Primaire Rouhia'],
    'siliana': ['École Primaire Siliana'],
    'siliana-nord': ['École Primaire Siliana Nord'],
    'siliana-sud': ['École Primaire Siliana Sud'],
    // Kairouan
    'bou-hajla': ['École Primaire Bou Hajla'],
    'chebika': ['École Primaire Chebika'],
    'el-ala': ['École Primaire El Ala'],
    'haffouz': ['École Primaire Haffouz'],
    'hajeb-el-ayoun': ['École Primaire Hajeb El Ayoun'],
    'kairouan-nord': ['École Primaire Kairouan Nord'],
    'kairouan-sud': ['École Primaire Kairouan Sud'],
    'nasrallah': ['École Primaire Nasrallah'],
    'oueslatia': ['École Primaire Oueslatia'],
    'sbikha': ['École Primaire Sbikha'],
    // Kasserine
    'el-ayoun': ['École Primaire El Ayoun'],
    'ezzouhour': ['École Primaire Ezzouhour'],
    'fériana': ['École Primaire Fériana'],
    'foussana': ['École Primaire Foussana'],
    'haidra': ['École Primaire Haidra'],
    'hassi-el-ferid': ['École Primaire Hassi El Ferid'],
    'jedelienne': ['École Primaire Jedelienne'],
    'kasserine-nord': ['École Primaire Kasserine Nord'],
    'kasserine-sud': ['École Primaire Kasserine Sud'],
    'majel-bel-abbès': ['École Primaire Majel Bel Abbès'],
    'sbeitla': ['École Primaire Sbeitla'],
    'sbiba': ['École Primaire Sbiba'],
    'thala': ['École Primaire Thala'],
    // Sidi Bouzid
    'bir-el-hafey': ['École Primaire Bir El Hafey'],
    'cebbala-ouled-asker': ['École Primaire Cebbala Ouled Asker'],
    'jilma': ['École Primaire Jilma'],
    'meknassy': ['École Primaire Meknassy'],
    'menzel-bouzaiane': ['École Primaire Menzel Bouzaiane'],
    'ouled-haffouz': ['École Primaire Ouled Haffouz'],
    'regueb': ['École Primaire Regueb'],
    'sidi-ali-ben-aoun': ['École Primaire Sidi Ali Ben Aoun'],
    'sidi-bouzid-est': ['École Primaire Sidi Bouzid Est'],
    'sidi-bouzid-ouest': ['École Primaire Sidi Bouzid Ouest'],
    'souk-jedid': ['École Primaire Souk Jedid'],
    // Sfax
    'agareb': ['École Primaire Agareb'],
    'bir-ali-ben-khalifa': ['École Primaire Bir Ali Ben Khalifa'],
    'el-amra': ['École Primaire El Amra'],
    'el-hencha': ['École Primaire El Hencha'],
    'gremda': ['École Primaire Gremda'],
    'jebeniana': ['École Primaire Jebeniana'],
    'kerkenah': ['École Primaire Kerkenah'],
    'mahares': ['École Primaire Mahares'],
    'menzel-chaker': ['École Primaire Menzel Chaker'],
    'sakiet-eddaier': ['École Primaire Sakiet Eddaier'],
    'sakiet-ezzit': ['École Primaire Sakiet Ezzit'],
    'sfax-est': ['École Primaire Sfax Est'],
    'sfax-ouest': ['École Primaire Sfax Ouest'],
    'sfax-sud': ['École Primaire Sfax Sud'],
    'skhira': ['École Primaire Skhira'],
    'thyna': ['École Primaire Thyna'],
    // Mahdia
    'bou-merdes': ['École Primaire Bou Merdes'],
    'chebba': ['École Primaire Chebba'],
    'el-jem': ['École Primaire El Jem'],
    'essouassi': ['École Primaire Essouassi'],
    'hiboun': ['École Primaire Hiboun'],
    'ksour-essef': ['École Primaire Ksour Essef'],
    'mahdia': ['École Primaire Mahdia'],
    'mellouleche': ['École Primaire Mellouleche'],
    'oued-chergui': ['École Primaire Oued Chergui'],
    'sidi-alouane': ['École Primaire Sidi Alouane'],
    'zeramdine': ['École Primaire Zeramdine'],
    // Monastir
    'bekalta': ['École Primaire Bekalta'],
    'beni-hassen': ['École Primaire Beni Hassen'],
    'jemmal': ['École Primaire Jemmal'],
    'ksar-hellal': ['École Primaire Ksar Hellal'],
    'ksibet-el-mediouni': ['École Primaire Ksibet El Mediouni'],
    'moknine': ['École Primaire Moknine'],
    'monastir': ['École Primaire Monastir'],
    'ouerdanine': ['École Primaire Ouerdanine'],
    'sahline': ['École Primaire Sahline'],
    'sayada': ['École Primaire Sayada'],
    'teboulba': ['École Primaire Teboulba'],
    // Sousse
    'akouda': ['École Primaire Akouda'],
    'bouficha': ['École Primaire Bouficha'],
    'enfidha': ['École Primaire Enfidha'],
    'hammam-sousse': ['École Primaire Hammam Sousse'],
    'hergla': ['École Primaire Hergla'],
    'kalâa-kebira': ['École Primaire Kalâa Kebira'],
    'kalâa-seghira': ['École Primaire Kalâa Seghira'],
    'kondar': ['École Primaire Kondar'],
    'msaken': ['École Primaire Msaken'],
    'sidi-bou-ali': ['École Primaire Sidi Bou Ali'],
    'sidi-el-hani': ['École Primaire Sidi El Hani'],
    'sousse-jawhara': ['École Primaire Sousse Jawhara'],
    'sousse-médina': ['École Primaire Sousse Médina'],
    'sousse-riadh': ['École Primaire Sousse Riadh'],
    'zaouiet-sousse': ['École Primaire Zaouiet Sousse'],
    // Kébili
    'douz': ['École Primaire Douz'],
    'el-faouar': ['École Primaire El Faouar'],
    'kebili-nord': ['École Primaire Kébili Nord'],
    'kebili-sud': ['École Primaire Kébili Sud'],
    'souk-el-ahad': ['École Primaire Souk El Ahad'],
    // Gabès
    'el-hamma': ['École Primaire El Hamma'],
    'gabes-médina': ['École Primaire Gabès Médina'],
    'gabes-ouest': ['École Primaire Gabès Ouest'],
    'gabes-sud': ['École Primaire Gabès Sud'],
    'ghannouch': ['École Primaire Ghannouch'],
    'mareth': ['École Primaire Mareth'],
    'matmata': ['École Primaire Matmata'],
    'menzel-habib': ['École Primaire Menzel Habib'],
    'métouia': ['École Primaire Métouia'],
    'nouvelle-matmata': ['École Primaire Nouvelle Matmata'],
    // Médenine
    'ben-gardane': ['École Primaire Ben Gardane'],
    'beni-khedache': ['École Primaire Beni Khedache'],
    'djerba---ajim': ['École Primaire Djerba - Ajim'],
    'djerba---houmt-souk': ['École Primaire Djerba - Houmt Souk'],
    'djerba---midoun': ['École Primaire Djerba - Midoun'],
    'médenine-nord': ['École Primaire Médenine Nord'],
    'médenine-sud': ['École Primaire Médenine Sud'],
    'sidi-makhlouf': ['École Primaire Sidi Makhlouf'],
    'zarzis': ['École Primaire Zarzis'],
    // Tataouine
    'bir-lahmar': ['École Primaire Bir Lahmar'],
    'dehiba': ['École Primaire Dehiba'],
    'ghomrassen': ['École Primaire Ghomrassen'],
    'remada': ['École Primaire Remada'],
    'smâr': ['École Primaire Smâr'],
    'tataouine-nord': ['École Primaire Tataouine Nord'],
    'tataouine-sud': ['École Primaire Tataouine Sud'],
    // Gafsa
    'el-guettar': ['École Primaire El Guettar'],
    'el-ksar': ['École Primaire El Ksar'],
    'gafsa-nord': ['École Primaire Gafsa Nord'],
    'gafsa-sud': ['École Primaire Gafsa Sud'],
    'mdhilla': ['École Primaire Mdhilla'],
    'metlaoui': ['École Primaire Metlaoui'],
    'moularès': ['École Primaire Moularès'],
    'redeyef': ['École Primaire Redeyef'],
    'sened': ['École Primaire Sened'],
    'sidi-aich': ['École Primaire Sidi Aich'],
    // Tozeur
    'degache': ['École Primaire Degache'],
    'hazoua': ['École Primaire Hazoua'],
    'nefta': ['École Primaire Nefta'],
    'tameghza': ['École Primaire Tameghza'],
    'tozeur': ['École Primaire Tozeur']
  };

  const governoratInput = document.getElementById('governorat');
  const delegationInput = document.getElementById('delegation');
  const ecoleInput = document.getElementById('ecole');
  const governoratDropdown = document.getElementById('governoratDropdown');
  const delegationDropdown = document.getElementById('delegationDropdown');
  const ecoleDropdown = document.getElementById('ecoleDropdown');
  const continueBtn = document.getElementById('continueBtn');
  const form = document.getElementById('governoratForm');

  const governoratGroup = governoratInput ? governoratInput.closest('.form-group.select-group') : null;
  const delegationGroup = delegationInput ? delegationInput.closest('.form-group.select-group') : null;
  const ecoleGroup = ecoleInput ? ecoleInput.closest('.form-group.select-group') : null;

  let selectedGovernorat = '';
  let selectedDelegation = '';
  let selectedEcole = '';

  // Utiliser la fonction normalizeKey de AppUtils au lieu de la redéfinir

  // Fonction pour mettre à jour les états visuels
  function updateVisualStates() {
    // Réinitialiser toutes les classes
    [governoratGroup, delegationGroup, ecoleGroup].forEach(group => {
      if (group) {
        group.classList.remove('active', 'completed');
      }
    });

    // Marquer le gouvernorat comme actif ou complété
    if (governoratGroup) {
      if (selectedGovernorat) {
        governoratGroup.classList.add('completed');
      } else {
        governoratGroup.classList.add('active');
      }
    }

    // Marquer la délégation comme actif ou complété
    if (delegationGroup) {
      if (selectedDelegation) {
        delegationGroup.classList.add('completed');
      } else if (selectedGovernorat) {
        delegationGroup.classList.add('active');
      }
    }

    // Marquer l'école comme actif ou complété
    if (ecoleGroup) {
      if (selectedEcole) {
        ecoleGroup.classList.add('completed');
      } else if (selectedDelegation) {
        ecoleGroup.classList.add('active');
      }
    }
  }


  // Vérifier si le formulaire est complet
  function checkForm() {
    if (selectedGovernorat && selectedDelegation && selectedEcole) {
      continueBtn.disabled = false;
      continueBtn.classList.add('active');
    } else {
      continueBtn.disabled = true;
      continueBtn.classList.remove('active');
    }
  }

  // Gestion du gouvernorat
  if (governoratInput && governoratDropdown) {
    const governoratWrapper = governoratInput.closest('.select-wrapper');
    
    // Initialiser les options du gouvernorat depuis le HTML
    const initialGovernoratOptions = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
    
    // Fonction pour réinitialiser les options du gouvernorat
    function resetGovernoratOptions() {
      governoratDropdown.innerHTML = '';
      initialGovernoratOptions.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'select-option';
        div.textContent = opt;
        div.setAttribute('data-value', AppUtils.normalizeKey(opt));
        governoratDropdown.appendChild(div);
      });
    }
    
    governoratInput.addEventListener('focus', function() {
      if (governoratWrapper) governoratWrapper.classList.add('active');
      // Réinitialiser les options pour afficher toutes les options disponibles
      resetGovernoratOptions();
      governoratDropdown.style.display = 'block';
      // Filtrer selon la valeur actuelle de l'input (peut être vide si on veut modifier)
      const options = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
      AppUtils.filterOptions(governoratInput, governoratDropdown, options);
      updateVisualStates();
    });
    
    // Permettre de cliquer sur l'input même s'il a déjà une valeur
    governoratInput.addEventListener('click', function() {
      if (governoratWrapper) governoratWrapper.classList.add('active');
      resetGovernoratOptions();
      governoratDropdown.style.display = 'block';
      const options = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
      AppUtils.filterOptions(governoratInput, governoratDropdown, options);
    });

    governoratInput.addEventListener('blur', function() {
      setTimeout(() => {
        if (governoratWrapper) governoratWrapper.classList.remove('active');
      }, 200);
    });

    governoratInput.addEventListener('input', function() {
      // Réinitialiser les options si le dropdown est vide ou si on efface la valeur
      if (governoratDropdown.querySelectorAll('.select-option').length === 0 || 
          governoratDropdown.querySelector('.no-results')) {
        resetGovernoratOptions();
      }
      const options = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
      AppUtils.filterOptions(governoratInput, governoratDropdown, options);
      // Si l'utilisateur efface la valeur, réinitialiser la sélection
      if (governoratInput.value.trim() === '') {
        selectedGovernorat = '';
        if (delegationInput) {
          delegationInput.disabled = true;
          delegationInput.value = '';
        }
        if (ecoleInput) {
          ecoleInput.disabled = true;
          ecoleInput.value = '';
        }
        selectedDelegation = '';
        selectedEcole = '';
        if (delegationDropdown) delegationDropdown.innerHTML = '';
        if (ecoleDropdown) ecoleDropdown.innerHTML = '';
        updateVisualStates();
        checkForm();
      }
    });

    governoratDropdown.addEventListener('click', function(e) {
      if (e.target.classList.contains('select-option') && !e.target.classList.contains('no-results')) {
        const value = e.target.textContent;
        governoratInput.value = value;
        // Utiliser data-value si disponible, sinon normaliser le texte
        selectedGovernorat = e.target.getAttribute('data-value') || AppUtils.normalizeKey(value);
        governoratDropdown.style.display = 'none';
        if (governoratWrapper) governoratWrapper.classList.remove('active');
        
        // Activer et charger les délégations
        if (delegationInput) {
          delegationInput.disabled = false;
          delegationInput.value = '';
        }
        if (ecoleInput) {
          ecoleInput.disabled = true;
          ecoleInput.value = '';
        }
        selectedDelegation = '';
        selectedEcole = '';
        
        const delegations = delegationsByGovernorat[selectedGovernorat] || [];
        if (delegationDropdown) {
          delegationDropdown.innerHTML = '';
          if (delegations.length === 0) {
            delegationDropdown.innerHTML = '<div class="select-option no-results">Aucune délégation disponible</div>';
          } else {
            delegations.forEach(del => {
              const div = document.createElement('div');
              div.className = 'select-option';
              div.textContent = del;
              div.setAttribute('data-value', AppUtils.normalizeKey(del));
              delegationDropdown.appendChild(div);
            });
          }
          // S'assurer que le dropdown est visible si on est en train de le consulter
          if (delegationInput && document.activeElement === delegationInput) {
            delegationDropdown.style.display = 'block';
          }
        }
        
        updateVisualStates();
        checkForm();
      }
    });
  }

  // Gestion de la délégation
  if (delegationInput && delegationDropdown) {
    const delegationWrapper = delegationInput.closest('.select-wrapper');
    
    // Fonction pour réinitialiser les options de délégation
    function resetDelegationOptions() {
      if (selectedGovernorat) {
        const delegations = delegationsByGovernorat[selectedGovernorat] || [];
        delegationDropdown.innerHTML = '';
        if (delegations.length === 0) {
          delegationDropdown.innerHTML = '<div class="select-option no-results">Aucune délégation disponible</div>';
        } else {
          delegations.forEach(del => {
            const div = document.createElement('div');
            div.className = 'select-option';
            div.textContent = del;
            div.setAttribute('data-value', normalizeKey(del));
            delegationDropdown.appendChild(div);
          });
        }
      }
    }
    
    delegationInput.addEventListener('focus', function() {
      if (!delegationInput.disabled) {
        if (delegationWrapper) delegationWrapper.classList.add('active');
        // Réinitialiser les options pour afficher toutes les options disponibles
        resetDelegationOptions();
        delegationDropdown.style.display = 'block';
        // Filtrer selon la valeur actuelle de l'input
        const options = Array.from(delegationDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(delegationInput, delegationDropdown, options);
        updateVisualStates();
      }
    });
    
    // Permettre de cliquer sur l'input même s'il a déjà une valeur
    delegationInput.addEventListener('click', function() {
      if (!delegationInput.disabled) {
        if (delegationWrapper) delegationWrapper.classList.add('active');
        resetDelegationOptions();
        delegationDropdown.style.display = 'block';
        const options = Array.from(delegationDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(delegationInput, delegationDropdown, options);
      }
    });

    delegationInput.addEventListener('blur', function() {
      setTimeout(() => {
        if (delegationWrapper) delegationWrapper.classList.remove('active');
      }, 200);
    });

    delegationInput.addEventListener('input', function() {
      if (!delegationInput.disabled) {
        // Réinitialiser les options si le dropdown est vide
        if (delegationDropdown.querySelectorAll('.select-option').length === 0 || 
            delegationDropdown.querySelector('.no-results')) {
          resetDelegationOptions();
        }
        const options = Array.from(delegationDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(delegationInput, delegationDropdown, options);
        // Si l'utilisateur efface la valeur, réinitialiser la sélection
        if (delegationInput.value.trim() === '') {
          selectedDelegation = '';
          if (ecoleInput) {
            ecoleInput.disabled = true;
            ecoleInput.value = '';
          }
          selectedEcole = '';
          if (ecoleDropdown) ecoleDropdown.innerHTML = '';
          updateVisualStates();
          checkForm();
        }
      }
    });

    delegationDropdown.addEventListener('click', function(e) {
      if (e.target.classList.contains('select-option') && !e.target.classList.contains('no-results')) {
        const value = e.target.textContent;
        delegationInput.value = value;
        selectedDelegation = e.target.getAttribute('data-value');
        delegationDropdown.style.display = 'none';
        if (delegationWrapper) delegationWrapper.classList.remove('active');
        
        // Activer et charger les écoles
        if (ecoleInput) {
          ecoleInput.disabled = false;
          ecoleInput.value = '';
        }
        selectedEcole = '';
        
        const ecoles = ecolesByDelegation[selectedDelegation] || [];
        if (ecoleDropdown) {
          ecoleDropdown.innerHTML = '';
          if (ecoles.length === 0) {
            ecoleDropdown.innerHTML = '<div class="select-option no-results">Aucune école disponible pour cette délégation</div>';
          } else {
            ecoles.forEach(ec => {
              const div = document.createElement('div');
              div.className = 'select-option';
              div.textContent = ec;
              div.setAttribute('data-value', AppUtils.normalizeKey(ec));
              ecoleDropdown.appendChild(div);
            });
          }
        }
        
        updateVisualStates();
        checkForm();
      }
    });
  }

  // Gestion de l'école
  if (ecoleInput && ecoleDropdown) {
    const ecoleWrapper = ecoleInput.closest('.select-wrapper');
    
    // Fonction pour réinitialiser les options d'école
    function resetEcoleOptions() {
      if (selectedDelegation) {
        const ecoles = ecolesByDelegation[selectedDelegation] || [];
        ecoleDropdown.innerHTML = '';
        if (ecoles.length === 0) {
          ecoleDropdown.innerHTML = '<div class="select-option no-results">Aucune école disponible pour cette délégation</div>';
        } else {
          ecoles.forEach(ec => {
            const div = document.createElement('div');
            div.className = 'select-option';
            div.textContent = ec;
            div.setAttribute('data-value', normalizeKey(ec));
            ecoleDropdown.appendChild(div);
          });
        }
      }
    }
    
    ecoleInput.addEventListener('focus', function() {
      if (!ecoleInput.disabled) {
        if (ecoleWrapper) ecoleWrapper.classList.add('active');
        // Réinitialiser les options pour afficher toutes les options disponibles
        resetEcoleOptions();
        ecoleDropdown.style.display = 'block';
        // Filtrer selon la valeur actuelle de l'input
        const options = Array.from(ecoleDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(ecoleInput, ecoleDropdown, options);
        updateVisualStates();
      }
    });
    
    // Permettre de cliquer sur l'input même s'il a déjà une valeur
    ecoleInput.addEventListener('click', function() {
      if (!ecoleInput.disabled) {
        if (ecoleWrapper) ecoleWrapper.classList.add('active');
        resetEcoleOptions();
        ecoleDropdown.style.display = 'block';
        const options = Array.from(ecoleDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(ecoleInput, ecoleDropdown, options);
      }
    });

    ecoleInput.addEventListener('blur', function() {
      setTimeout(() => {
        if (ecoleWrapper) ecoleWrapper.classList.remove('active');
      }, 200);
    });

    ecoleInput.addEventListener('input', function() {
      if (!ecoleInput.disabled) {
        // Réinitialiser les options si le dropdown est vide
        if (ecoleDropdown.querySelectorAll('.select-option').length === 0 || 
            ecoleDropdown.querySelector('.no-results')) {
          resetEcoleOptions();
        }
        const options = Array.from(ecoleDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(ecoleInput, ecoleDropdown, options);
        // Si l'utilisateur efface la valeur, réinitialiser la sélection
        if (ecoleInput.value.trim() === '') {
          selectedEcole = '';
          updateVisualStates();
          checkForm();
        }
      }
    });

    ecoleDropdown.addEventListener('click', function(e) {
      if (e.target.classList.contains('select-option') && !e.target.classList.contains('no-results')) {
        const value = e.target.textContent;
        ecoleInput.value = value;
        selectedEcole = e.target.getAttribute('data-value');
        ecoleDropdown.style.display = 'none';
        if (ecoleWrapper) ecoleWrapper.classList.remove('active');
        updateVisualStates();
        checkForm();
      }
    });
  }

  // Fermer les dropdowns en cliquant ailleurs
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.select-wrapper')) {
      if (governoratDropdown) {
        governoratDropdown.style.display = 'none';
        const wrapper = governoratInput ? governoratInput.closest('.select-wrapper') : null;
        if (wrapper) wrapper.classList.remove('active');
      }
      if (delegationDropdown) {
        delegationDropdown.style.display = 'none';
        const wrapper = delegationInput ? delegationInput.closest('.select-wrapper') : null;
        if (wrapper) wrapper.classList.remove('active');
      }
      if (ecoleDropdown) {
        ecoleDropdown.style.display = 'none';
        const wrapper = ecoleInput ? ecoleInput.closest('.select-wrapper') : null;
        if (wrapper) wrapper.classList.remove('active');
      }
    }
  });

  // Initialiser les états visuels au chargement
  updateVisualStates();

  // Gérer la soumission du formulaire
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (selectedGovernorat && selectedDelegation && selectedEcole) {
        // Récupérer les valeurs affichées
        const governoratName = governoratInput.value;
        const delegationName = delegationInput.value;
        const ecoleName = ecoleInput.value;
        
        console.log('Sélection complète:', {
          gouvernorat: governoratName,
          délégation: delegationName,
          école: ecoleName,
          codes: {
            gouvernorat: selectedGovernorat,
            délégation: selectedDelegation,
            école: selectedEcole
          }
        });
        
        // Rediriger vers la page classe
        window.location.href = 'classe.html';
      }
    });
  }

  // Initialiser les états visuels au chargement
  updateVisualStates();
}

// ============================================
// Page Choisir Téléphone - Saisie du numéro
// ============================================
if (document.getElementById('phoneNumber')) {
  const phoneInput = document.getElementById('phoneNumber');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const countrySelector = document.getElementById('countrySelector');
  const countryDropdown = document.getElementById('countryDropdown');
  const countryList = document.getElementById('countryList');
  const selectedCountryFlag = document.getElementById('selectedCountryFlag');
  const countrySearchInput = document.getElementById('countrySearchInput');

  // Validation du numéro de téléphone
  function validatePhoneNumber(phone) {
    if (!selectedCountry) return false;
    
    // Supprimer les espaces et caractères non numériques sauf le +
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const dialCode = selectedCountry.dialCode.replace('+', '');
    
    // Supprimer le code pays
    let numberOnly = cleaned;
    if (cleaned.startsWith('+' + dialCode)) {
      numberOnly = cleaned.substring(1 + dialCode.length);
    } else if (cleaned.startsWith('00' + dialCode)) {
      numberOnly = cleaned.substring(2 + dialCode.length);
    } else if (cleaned.startsWith(dialCode)) {
      numberOnly = cleaned.substring(dialCode.length);
    }
    
    // Vérifier si c'est un numéro valide (au moins 6 chiffres, généralement 8-15)
    return numberOnly.length >= 6 && numberOnly.length <= 15 && /^\d+$/.test(numberOnly);
  }

  // Fonction pour formater le numéro selon le pays sélectionné
  function formatPhoneNumber(value) {
    if (!selectedCountry) return value;
    
    const dialCode = selectedCountry.dialCode;
    
    // Supprimer tout sauf les chiffres et le +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Supprimer tous les codes pays existants (commence par + suivi de chiffres)
    // On cherche tous les codes pays possibles dans la liste
    for (let country of countries) {
      const code = country.dialCode.replace('+', '');
      // Format +CODE
      if (cleaned.startsWith('+' + code)) {
        cleaned = cleaned.substring(1 + code.length);
        break;
      }
      // Format 00CODE
      if (cleaned.startsWith('00' + code)) {
        cleaned = cleaned.substring(2 + code.length);
        break;
      }
      // Format CODE (sans préfixe)
      if (cleaned.startsWith(code) && cleaned.length > code.length) {
        cleaned = cleaned.substring(code.length);
        break;
      }
    }
    
    // Si le numéro commence encore par +, le supprimer
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // Ajouter le nouveau code pays
    if (cleaned.length > 0) {
      return dialCode + ' ' + cleaned;
    }
    
    return dialCode;
  }

  // Vérifier et activer/désactiver le bouton Suivant
  function checkPhoneInput() {
    const value = phoneInput.value.trim();
    const isValid = value.length > 0 && validatePhoneNumber(value);
    
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
  }

  // Gérer la saisie du numéro
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      const value = e.target.value;
      // Formater automatiquement
      const formatted = formatPhoneNumber(value);
      if (formatted !== value) {
        e.target.value = formatted;
      }
      checkPhoneInput();
    });

    phoneInput.addEventListener('blur', function() {
      checkPhoneInput();
    });

    phoneInput.addEventListener('keypress', function(e) {
      // Autoriser seulement les chiffres, +, espace, tiret, parenthèses
      const char = String.fromCharCode(e.which);
      if (!/[0-9+\s\-\(\)]/.test(char)) {
        e.preventDefault();
      }
    });
  }

  // Gérer le bouton retour
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.history.back();
    });
  }

  // Gérer le bouton Continuer
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (!nextBtn.disabled) {
        const phoneNumber = phoneInput.value.trim();
        // Ici, vous pouvez ajouter la logique pour envoyer le numéro
        console.log('Numéro de téléphone:', phoneNumber);
        // Rediriger vers la page gouvernorat
        window.location.href = 'gouvernorat.html';
      }
    });
  }

  // Pays sélectionné (sera défini après le chargement)
  let selectedCountry = null;
  
  // Liste des pays (sera remplie depuis l'API)
  let countries = [];
  
  // Mapping des codes pays vers les codes d'appel internationaux
  // Note: L'API REST Countries ne fournit pas toujours les codes d'appel, donc on utilise un mapping
  const dialCodeMap = {
    'AF': '+93', 'AL': '+355', 'DZ': '+213', 'AS': '+1684', 'AD': '+376', 'AO': '+244',
    'AI': '+1264', 'AG': '+1268', 'AR': '+54', 'AM': '+374', 'AW': '+297', 'AU': '+61',
    'AT': '+43', 'AZ': '+994', 'BS': '+1242', 'BH': '+973', 'BD': '+880', 'BB': '+1246',
    'BY': '+375', 'BE': '+32', 'BZ': '+501', 'BJ': '+229', 'BM': '+1441', 'BT': '+975',
    'BO': '+591', 'BA': '+387', 'BW': '+267', 'BR': '+55', 'VG': '+1284', 'BN': '+673',
    'BG': '+359', 'BF': '+226', 'BI': '+257', 'KH': '+855', 'CM': '+237', 'CA': '+1',
    'CV': '+238', 'KY': '+1345', 'CF': '+236', 'TD': '+235', 'CL': '+56', 'CN': '+86',
    'CO': '+57', 'KM': '+269', 'CG': '+242', 'CD': '+243', 'CK': '+682', 'CR': '+506',
    'CI': '+225', 'HR': '+385', 'CU': '+53', 'CY': '+357', 'CZ': '+420', 'DK': '+45',
    'DJ': '+253', 'DM': '+1767', 'DO': '+1809', 'EC': '+593', 'EG': '+20', 'SV': '+503',
    'GQ': '+240', 'ER': '+291', 'EE': '+372', 'ET': '+251', 'FK': '+500', 'FO': '+298',
    'FJ': '+679', 'FI': '+358', 'FR': '+33', 'GF': '+594', 'PF': '+689', 'GA': '+241',
    'GM': '+220', 'GE': '+995', 'DE': '+49', 'GH': '+233', 'GI': '+350', 'GR': '+30',
    'GL': '+299', 'GD': '+1473', 'GP': '+590', 'GU': '+1671', 'GT': '+502', 'GN': '+224',
    'GW': '+245', 'GY': '+592', 'HT': '+509', 'HN': '+504', 'HK': '+852', 'HU': '+36',
    'IS': '+354', 'IN': '+91', 'ID': '+62', 'IR': '+98', 'IQ': '+964', 'IE': '+353',
    'IL': '+972', 'IT': '+39', 'JM': '+1876', 'JP': '+81', 'JO': '+962', 'KZ': '+7',
    'KE': '+254', 'KI': '+686', 'KW': '+965', 'KG': '+996', 'LA': '+856', 'LV': '+371',
    'LB': '+961', 'LS': '+266', 'LR': '+231', 'LY': '+218', 'LI': '+423', 'LT': '+370',
    'LU': '+352', 'MO': '+853', 'MK': '+389', 'MG': '+261', 'MW': '+265', 'MY': '+60',
    'MV': '+960', 'ML': '+223', 'MT': '+356', 'MH': '+692', 'MQ': '+596', 'MR': '+222',
    'MU': '+230', 'YT': '+262', 'MX': '+52', 'FM': '+691', 'MD': '+373', 'MC': '+377',
    'MN': '+976', 'ME': '+382', 'MS': '+1664', 'MA': '+212', 'MZ': '+258', 'MM': '+95',
    'NA': '+264', 'NR': '+674', 'NP': '+977', 'NL': '+31', 'NC': '+687', 'NZ': '+64',
    'NI': '+505', 'NE': '+227', 'NG': '+234', 'NU': '+683', 'NF': '+672', 'KP': '+850',
    'MP': '+1670', 'NO': '+47', 'OM': '+968', 'PK': '+92', 'PW': '+680', 'PS': '+970',
    'PA': '+507', 'PG': '+675', 'PY': '+595', 'PE': '+51', 'PH': '+63', 'PL': '+48',
    'PT': '+351', 'PR': '+1787', 'QA': '+974', 'RE': '+262', 'RO': '+40', 'RU': '+7',
    'RW': '+250', 'SH': '+290', 'KN': '+1869', 'LC': '+1758', 'PM': '+508', 'VC': '+1784',
    'WS': '+685', 'SM': '+378', 'ST': '+239', 'SA': '+966', 'SN': '+221', 'RS': '+381',
    'SC': '+248', 'SL': '+232', 'SG': '+65', 'SK': '+421', 'SI': '+386', 'SB': '+677',
    'SO': '+252', 'ZA': '+27', 'KR': '+82', 'SS': '+211', 'ES': '+34', 'LK': '+94',
    'SD': '+249', 'SR': '+597', 'SJ': '+47', 'SZ': '+268', 'SE': '+46', 'CH': '+41',
    'SY': '+963', 'TW': '+886', 'TJ': '+992', 'TZ': '+255', 'TH': '+66', 'TL': '+670',
    'TG': '+228', 'TK': '+690', 'TO': '+676', 'TT': '+1868', 'TN': '+216', 'TR': '+90',
    'TM': '+993', 'TC': '+1649', 'TV': '+688', 'UG': '+256', 'UA': '+380', 'AE': '+971',
    'GB': '+44', 'US': '+1', 'UY': '+598', 'UZ': '+998', 'VU': '+678', 'VA': '+39',
    'VE': '+58', 'VN': '+84', 'VI': '+1340', 'WF': '+681', 'YE': '+967', 'ZM': '+260',
    'ZW': '+263'
  };
  
  // Fonction pour obtenir le code d'appel depuis le mapping ou l'API
  function getDialCode(countryCode, countryData) {
    // Essayer d'abord le mapping (plus fiable)
    if (dialCodeMap[countryCode]) {
      return dialCodeMap[countryCode];
    }
    // Sinon, essayer depuis l'API (si disponible)
    if (countryData && countryData.idd && countryData.idd.root) {
      const suffix = countryData.idd.suffixes && countryData.idd.suffixes.length > 0 
        ? countryData.idd.suffixes[0] 
        : '';
      const dialCode = countryData.idd.root + suffix;
      // S'assurer que le code commence par +
      return dialCode.startsWith('+') ? dialCode : '+' + dialCode;
    }
    return '';
  }
  
  // Fonction pour charger les pays depuis l'API
  async function loadCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag,idd', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transformer les données de l'API en format attendu
      countries = data
        .map(country => {
          const countryCode = country.cca2;
          const dialCode = getDialCode(countryCode, country);
          
          // Obtenir le nom en français si disponible, sinon utiliser le nom commun
          const name = country.name.nativeName?.fra?.common || 
                       country.name.nativeName?.fra?.official ||
                       country.name.common ||
                       country.name.official;
          
          return {
            code: countryCode,
            name: name,
            flag: country.flag,
            dialCode: dialCode
          };
        })
        .filter(country => country.dialCode) // Filtrer les pays sans code d'appel
        .sort((a, b) => a.name.localeCompare(b.name, 'fr')); // Trier par ordre alphabétique
      
      // Trouver la Tunisie pour la définir par défaut
      selectedCountry = countries.find(c => c.code === 'TN') || countries[0];
      
      // Mettre à jour le drapeau sélectionné
      if (selectedCountryFlag && selectedCountry) {
        selectedCountryFlag.textContent = selectedCountry.flag;
      }
      
      // Créer la liste des pays
      createCountryList();
      
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
      // En cas d'erreur, utiliser une liste de base
      countries = [
        { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216' },
        { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
        { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213' },
        { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212' }
      ];
      selectedCountry = countries[0];
      createCountryList();
    }
  }

  // Fonction pour créer la liste des pays
  function createCountryList(filterText = '') {
    if (!countryList) return;

    // Masquer le message de chargement
    const loadingElement = document.getElementById('countryLoading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

    countryList.innerHTML = '';

    // Si la liste des pays n'est pas encore chargée
    if (countries.length === 0) {
      const loading = document.createElement('div');
      loading.className = 'country-loading';
      loading.textContent = 'Chargement des pays...';
      countryList.appendChild(loading);
      return;
    }

    // Filtrer les pays si un texte de recherche est fourni
    const filteredCountries = filterText 
      ? countries.filter(country => 
          country.name.toLowerCase().includes(filterText.toLowerCase()) ||
          country.dialCode.includes(filterText)
        )
      : countries;

    // Afficher un message si aucun résultat
    if (filteredCountries.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'country-no-results';
      noResults.textContent = 'Aucun pays trouvé';
      countryList.appendChild(noResults);
      return;
    }

    filteredCountries.forEach(country => {
      const countryItem = document.createElement('div');
      countryItem.className = 'country-item';
      countryItem.setAttribute('data-code', country.code);
      countryItem.setAttribute('data-dial', country.dialCode);

      const flagSpan = document.createElement('span');
      flagSpan.className = 'country-item-flag';
      flagSpan.textContent = country.flag;

      const nameSpan = document.createElement('span');
      nameSpan.className = 'country-item-name';
      nameSpan.textContent = country.name;

      const dialSpan = document.createElement('span');
      dialSpan.className = 'country-item-dial';
      dialSpan.textContent = country.dialCode;

      countryItem.appendChild(flagSpan);
      countryItem.appendChild(nameSpan);
      countryItem.appendChild(dialSpan);

      // Gérer le clic sur un pays
      countryItem.addEventListener('click', function() {
        selectCountry(country);
        closeCountryDropdown();
      });

      countryList.appendChild(countryItem);
    });
  }

  // Fonction pour sélectionner un pays
  function selectCountry(country) {
    selectedCountry = country;
    if (selectedCountryFlag) {
      selectedCountryFlag.textContent = country.flag;
    }
    
    // Mettre à jour le placeholder avec le nouveau code
    if (phoneInput) {
      const currentValue = phoneInput.value.replace(/^\+216\s?/, '').replace(/^\+33\s?/, '').replace(/^\+213\s?/, '').replace(/^\+212\s?/, '').replace(/^\+218\s?/, '').replace(/^\+20\s?/, '').replace(/^\+32\s?/, '').replace(/^\+1\s?/, '').replace(/^\+44\s?/, '').replace(/^\+49\s?/, '').replace(/^\+39\s?/, '').replace(/^\+34\s?/, '').replace(/^\+31\s?/, '').replace(/^\+41\s?/, '');
      phoneInput.placeholder = country.dialCode + ' Numéro de téléphone portable';
      if (currentValue) {
        phoneInput.value = country.dialCode + ' ' + currentValue;
      }
    }
  }

  // Fonction pour ouvrir/fermer le dropdown
  function toggleCountryDropdown() {
    if (!countryDropdown) return;

    const isOpen = countryDropdown.style.display !== 'none';
    
    if (isOpen) {
      closeCountryDropdown();
    } else {
      openCountryDropdown();
    }
  }

  function openCountryDropdown() {
    if (countryDropdown) {
      countryDropdown.style.display = 'block';
      if (countrySelector) {
        countrySelector.classList.add('active');
      }
      setTimeout(function() {
        countryDropdown.classList.add('show');
      }, 10);
    }
  }

  function closeCountryDropdown() {
    if (countryDropdown) {
      countryDropdown.classList.remove('show');
      if (countrySelector) {
        countrySelector.classList.remove('active');
      }
      setTimeout(function() {
        countryDropdown.style.display = 'none';
      }, 200);
    }
  }

  // Gérer le clic sur le sélecteur de pays
  if (countrySelector) {
    countrySelector.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCountryDropdown();
    });
  }

  // Fermer le dropdown en cliquant ailleurs
  document.addEventListener('click', function(e) {
    if (countryDropdown && !countryDropdown.contains(e.target) && !countrySelector.contains(e.target)) {
      closeCountryDropdown();
    }
  });

  // Gérer la recherche de pays
  if (countrySearchInput) {
    countrySearchInput.addEventListener('input', function(e) {
      const searchText = e.target.value.trim();
      createCountryList(searchText);
    });

    // Réinitialiser la recherche quand on ouvre le dropdown
    countrySelector.addEventListener('click', function() {
      setTimeout(function() {
        if (countrySearchInput) {
          countrySearchInput.value = '';
          countrySearchInput.focus();
        }
      }, 100);
    });
  }

  // Charger les pays depuis l'API au chargement de la page
  loadCountries();

  // Initialiser l'état du bouton
  checkPhoneInput();
}

// ============================================
// Page Classe - Sélection de classe
// ============================================
if (document.getElementById('classesContainer')) {
  const classesContainer = document.getElementById('classesContainer');
  const continueBtn = document.getElementById('continueBtn');
  
  // Données des classes (6 classes avec lettres arabes)
  const classes = Array.from({ length: 6 }, () => ({
    lettres: ["أ", "ب", "ج", "د", "ه"],
    selected: new Set()
  }));

  // Fonction pour basculer la sélection d'une lettre
  function toggleLetter(classIndex, letter) {
    const selected = classes[classIndex].selected;
    if (selected.has(letter)) {
      selected.delete(letter);
    } else {
      selected.add(letter);
    }
    renderClasses();
    checkClasseForm();
  }

  // Fonction pour rendre les classes
  function renderClasses() {
    classesContainer.innerHTML = '';
    
    classes.forEach((classe, i) => {
      const classeRow = document.createElement('div');
      classeRow.className = 'classe-row';
      
      const lettresDiv = document.createElement('div');
      lettresDiv.className = 'classe-lettres';
      
      classe.lettres.forEach((letter) => {
        const btn = document.createElement('button');
        btn.className = 'classe-letter-btn';
        btn.textContent = letter;
        btn.setAttribute('type', 'button');
        btn.onclick = () => toggleLetter(i, letter);
        
        if (classe.selected.has(letter)) {
          btn.classList.add('active');
        }
        
        lettresDiv.appendChild(btn);
      });

      const classNum = document.createElement('div');
      classNum.className = 'classe-number';
      classNum.textContent = i + 1;

      // Ajouter d'abord le numéro (à gauche), puis les lettres (à droite)
      classeRow.appendChild(classNum);
      classeRow.appendChild(lettresDiv);
      classesContainer.appendChild(classeRow);
    });
  }

  // Fonction pour vérifier si au moins une classe a une sélection
  function checkClasseForm() {
    const hasSelection = classes.some(classe => classe.selected.size > 0);
    
    if (continueBtn) {
      continueBtn.disabled = !hasSelection;
    }
  }

  // Gérer le bouton Continuer
  if (continueBtn) {
    continueBtn.addEventListener('click', function() {
      if (!continueBtn.disabled) {
        // Récupérer les sélections
        const selections = classes.map((classe, index) => ({
          classe: index + 1,
          lettres: Array.from(classe.selected)
        })).filter(item => item.lettres.length > 0);
        
        console.log('Sélections de classes:', selections);
        
        // Rediriger vers la page suivante (à définir)
        // window.location.href = 'page_suivante.html';
      }
    });
  }

  // Initialiser le rendu
  renderClasses();
  checkClasseForm();
}
