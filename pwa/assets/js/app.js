/**
 * ============================================
 * Droussi - Application JavaScript Principale
 * ============================================
 * Application éducative pour les parents et enseignants en Tunisie
<<<<<<< Updated upstream
 * Version: 3.0
 */

// ============================================
// CONSTANTES GLOBALES
// ============================================
const APP_CONFIG = {
  REDIRECT_DELAY: 3000,
  MODAL_ANIMATION_DELAY: 300,
  DROPDOWN_CLOSE_DELAY: 200,
  PHONE_MIN_LENGTH: 6,
  PHONE_MAX_LENGTH: 15
};

const STORAGE_KEYS = {
  USER_ROLE: 'userRole',
  TEACHER_CLASSES: 'teacherClasses',
  TEACHER_SUBSCRIBED: 'teacherSubscribed',
  PARENT_CLASSES: 'parentClasses',
  PARENT_SUBSCRIBED: 'parentSubscribed'
};

const ROUTES = {
  INDEX: 'index.html',
  CHOOSE_ROLE: 'Choix_role.html',
  CONNEXION: 'Connexion.html',
  PARENT: 'Parent.html',
  TEACHER: 'Teacher.html',
  GOUVERNORAT: 'gouvernorat.html',
  CLASSE: 'classe.html'
};

// ============================================
// UTILITAIRES RÉUTILISABLES
=======
 * Version: 3.2
 */
var APP_DEBUG = false; // Mettre à true en développement pour les logs

// ============================================
// ENREGISTREMENT DU SERVICE WORKER (avec cache-bust pour éviter cache persistant)
>>>>>>> Stashed changes
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js?v=3.2')
      .then(function(registration) {
        if (APP_DEBUG) console.log('[App] Service Worker enregistré:', registration.scope);
        registration.addEventListener('updatefound', function() {
          var newWorker = registration.installing;
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (APP_DEBUG) console.log('[App] Nouvelle version disponible.');
              newWorker.postMessage({ action: 'skipWaiting' });
            }
          });
        });
        navigator.serviceWorker.addEventListener('controllerchange', function() {
          window.location.reload();
        });
      })
      .catch(function(error) {
        if (APP_DEBUG) console.error('[App] Échec Service Worker:', error);
      });
    
    // Vérifier périodiquement s'il existe une mise à jour du SW (toutes les 60 s)
    setInterval(function() {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        if (reg) reg.update();
      });
    }, 60000);
  });
}

// ============================================
// CONSTANTES GLOBALES
// ============================================
const APP_CONFIG = {
  REDIRECT_DELAY: 3000,
  MODAL_ANIMATION_DELAY: 300,
  DROPDOWN_CLOSE_DELAY: 200,
  PHONE_MIN_LENGTH: 6,
  PHONE_MAX_LENGTH: 15
};

const STORAGE_KEYS = {
  USER_ROLE: 'userRole',
  TEACHER_CLASSES: 'teacherClasses',
  TEACHER_SUBSCRIBED: 'teacherSubscribed',
  PARENT_CLASSES: 'parentClasses',
  PARENT_SUBSCRIBED: 'parentSubscribed'
};

const ROUTES = {
  INDEX: 'index.html',
  CHOOSE_ROLE: 'Choix_role.html',
  CONNEXION: 'Connexion.html',
  PARENT: 'Parent.html',
  TEACHER: 'Teacher.html',
  GOUVERNORAT: 'gouvernorat.html',
  CLASSE: 'classe.html'
};

// ============================================
// UTILITAIRES RÉUTILISABLES
// ============================================
/** Échappe les caractères HTML pour éviter les injections (XSS) */
function escapeHtml(str) {
  if (str == null || typeof str !== 'string') return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const AppUtils = {
  /**
   * Valide une adresse email
   * @param {string} email - L'adresse email à valider
   * @returns {boolean} - True si l'email est valide
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Initialise le toggle d'affichage/masquage du mot de passe
   * @param {HTMLElement} passwordInput - L'input du mot de passe
   * @param {HTMLElement} toggleBtn - Le bouton de toggle
   */
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

  /**
   * Initialise la validation d'un formulaire email/password
   * @param {HTMLElement} emailInput - L'input email
   * @param {HTMLElement} passwordInput - L'input password
   * @param {HTMLElement} continueBtn - Le bouton continuer
   * @param {HTMLElement} form - Le formulaire
   * @param {string|null} redirectUrl - URL de redirection (null pour gestion externe)
   */
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

    if (redirectUrl !== null) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
<<<<<<< Updated upstream
          console.log('Formulaire soumis:', { 
=======
          if (APP_DEBUG) console.log('Formulaire soumis:', { 
>>>>>>> Stashed changes
            email: emailInput.value.trim(), 
            password: passwordInput.value.trim() 
          });
        }
      });
    }
  },

  /**
   * Normalise une chaîne de caractères pour créer une clé
   * @param {string} str - La chaîne à normaliser
   * @returns {string} - La chaîne normalisée
   */
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

  /**
   * Filtre les options d'un dropdown
   * @param {HTMLElement} input - L'input de recherche
   * @param {HTMLElement} dropdown - Le dropdown
   * @param {Array<string>} options - Les options à filtrer
   */
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
  
  /**
   * Gestion d'erreur générique
   * @param {Error} error - L'erreur
   * @param {string} context - Le contexte de l'erreur
   * @returns {null}
   */
  handleError(error, context) {
<<<<<<< Updated upstream
    console.error(`Erreur dans ${context}:`, error);
=======
    if (APP_DEBUG) console.error('Erreur dans ' + context + ':', error);
>>>>>>> Stashed changes
    return null;
  },

  /**
   * Crée un élément DOM avec des attributs
   * @param {string} tag - Le tag HTML
   * @param {Object} attributes - Les attributs à ajouter
   * @param {string} textContent - Le contenu texte
   * @returns {HTMLElement}
   */
  createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    if (textContent) element.textContent = textContent;
    return element;
  },

  /**
   * Enregistre le rôle de l'utilisateur dans localStorage
   * @param {string} role - Le rôle ('parent' ou 'teacher')
   * @returns {boolean} - True si l'enregistrement a réussi
   */
  saveUserRole(role) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      return true;
    } catch (error) {
      AppUtils.handleError(error, 'saveUserRole');
      return false;
    }
  },

  /**
   * Récupère le rôle de l'utilisateur depuis localStorage
   * @returns {string|null} - Le rôle ou null
   */
  getUserRole() {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    } catch (error) {
      AppUtils.handleError(error, 'getUserRole');
      return null;
    }
  }
};

// ============================================
// GESTION DES RÔLES ET REDIRECTIONS
// ============================================
const RoleManager = {
  /**
   * Redirige l'utilisateur selon son rôle
   */
  redirectBasedOnRole() {
    try {
      const userRole = AppUtils.getUserRole();
      if (userRole === 'parent') {
        window.location.href = ROUTES.PARENT;
      } else if (userRole === 'teacher') {
        window.location.href = ROUTES.TEACHER;
      } else {
        window.location.href = ROUTES.CHOOSE_ROLE;
      }
    } catch (error) {
      AppUtils.handleError(error, 'redirectBasedOnRole');
      window.location.href = ROUTES.CHOOSE_ROLE;
    }
  }
};

// ============================================
// CLASSE RÉUTILISABLE POUR LES PAGES DE SÉLECTION
// ============================================
class SelectionPage {
  constructor(config) {
    this.inputId = config.inputId;
    this.dropdownId = config.dropdownId;
    this.wrapperId = config.wrapperId;
    this.formId = config.formId;
    this.continueBtnId = config.continueBtnId;
    this.options = config.options || [];
    this.storageKey = config.storageKey;
    this.storageCodeKey = config.storageCodeKey;
    this.redirectUrl = config.redirectUrl;
    this.checkDependency = config.checkDependency;
    this.dependencyRedirect = config.dependencyRedirect;
    
    this.input = null;
    this.dropdown = null;
    this.wrapper = null;
    this.form = null;
    this.continueBtn = null;
    this.selectedValue = '';
    this.selectedCode = '';
    
    this.init();
  }
  
  init() {
    // Vérifier les dépendances si nécessaire
    if (this.checkDependency && !this.checkDependency()) {
      if (this.dependencyRedirect) {
        window.location.href = this.dependencyRedirect;
      }
      return;
    }
    
    // Récupérer les éléments DOM
    this.input = document.getElementById(this.inputId);
    this.dropdown = document.getElementById(this.dropdownId);
    this.wrapper = document.getElementById(this.wrapperId);
    this.form = document.getElementById(this.formId);
    this.continueBtn = document.getElementById(this.continueBtnId);
    
    if (!this.input || !this.dropdown) return;
    
    // Initialiser le dropdown avec les options
    this.populateDropdown(this.options);
    
    // Ouvrir automatiquement le dropdown
    this.openDropdown();
    
    // Attacher les événements
    this.attachEvents();
    
    // Initialiser le bouton
    this.updateButtonState();
  }
  
  populateDropdown(options) {
    if (!this.dropdown) return;
    
    this.dropdown.innerHTML = '';
    
    if (options.length === 0) {
      this.dropdown.innerHTML = '<div class="select-option no-results">Aucune option disponible</div>';
      return;
    }
    
    options.forEach(option => {
      const div = AppUtils.createElement('div', {
        className: 'select-option',
        'data-value': AppUtils.normalizeKey(option)
      }, option);
      this.dropdown.appendChild(div);
    });
  }
  
  openDropdown() {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this._openDropdownNow(), APP_CONFIG.MODAL_ANIMATION_DELAY);
      });
    } else {
      setTimeout(() => this._openDropdownNow(), APP_CONFIG.MODAL_ANIMATION_DELAY);
    }
  }
  
  _openDropdownNow() {
    if (this.wrapper) this.wrapper.classList.add('active');
    if (this.dropdown) this.dropdown.style.display = 'block';
    if (this.input) this.input.focus();
  }
  
  filterOptions(searchTerm) {
    if (!this.dropdown) return;
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = this.options.filter(opt => 
      opt.toLowerCase().includes(term)
    );
    
    this.dropdown.innerHTML = '';
    
    if (filtered.length === 0) {
      this.dropdown.innerHTML = '<div class="select-option no-results">Aucun résultat</div>';
    } else {
      filtered.forEach(opt => {
        const div = AppUtils.createElement('div', {
          className: 'select-option',
          'data-value': AppUtils.normalizeKey(opt)
        }, opt);
        this.dropdown.appendChild(div);
      });
    }
  }
  
  handleOptionClick(e) {
    if (!e.target.classList.contains('select-option') || 
        e.target.classList.contains('no-results')) return;
    
    const selectedValue = e.target.textContent;
    const selectedCode = e.target.getAttribute('data-value');
    
    if (this.input) this.input.value = selectedValue;
    
    this.selectedValue = selectedValue;
    this.selectedCode = selectedCode;
    
    this.closeDropdown();
    this.updateButtonState();
  }
  
  closeDropdown() {
    if (this.dropdown) this.dropdown.style.display = 'none';
    if (this.wrapper) this.wrapper.classList.remove('active');
  }
  
  updateButtonState() {
    if (!this.continueBtn) return;
    const hasSelection = this.selectedValue.trim() !== '';
    this.continueBtn.disabled = !hasSelection;
    this.continueBtn.classList.toggle('active', hasSelection);
  }
  
  handleInputChange(e) {
    const value = e.target.value.trim();
    
    if (value === '') {
      this.selectedValue = '';
      this.selectedCode = '';
      this.updateButtonState();
    } else {
      this.filterOptions(value);
      
      // Vérifier si la valeur correspond à une option valide
      const matchingOption = Array.from(this.dropdown?.querySelectorAll('.select-option') || [])
        .find(opt => opt.textContent.toLowerCase() === value.toLowerCase());
      
      if (!matchingOption || matchingOption.classList.contains('no-results')) {
        if (this.selectedValue && value !== this.selectedValue) {
          this.selectedValue = '';
          this.selectedCode = '';
          this.updateButtonState();
        }
      }
    }
  }
  
  handleFocus() {
    if (this.wrapper) this.wrapper.classList.add('active');
    if (this.dropdown) {
      this.dropdown.style.display = 'block';
      this.filterOptions(this.input?.value || '');
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (this.continueBtn && !this.continueBtn.disabled && 
        this.selectedValue && this.selectedCode) {
      this.saveSelection();
      if (this.redirectUrl) {
        window.location.href = this.redirectUrl;
      }
    }
  }
  
  saveSelection() {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, this.selectedValue);
    }
    if (this.storageCodeKey) {
      localStorage.setItem(this.storageCodeKey, this.selectedCode);
    }
  }
  
  attachEvents() {
    // Recherche
    if (this.input) {
      this.input.addEventListener('input', (e) => this.handleInputChange(e));
      this.input.addEventListener('focus', () => this.handleFocus());
      this.input.addEventListener('click', () => this.handleFocus());
    }
    
    // Sélection d'option
    if (this.dropdown) {
      this.dropdown.addEventListener('click', (e) => this.handleOptionClick(e));
    }
    
    // Formulaire
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Bouton continuer
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSubmit(e);
      });
    }
    
    // Fermer le dropdown en cliquant ailleurs
    const closeHandler = (e) => {
      if (!e.target.closest('.select-wrapper') && 
          !e.target.closest('.select-dropdown')) {
        this.closeDropdown();
      }
    };
    document.addEventListener('click', closeHandler);
    this._closeHandler = closeHandler;
  }
}

// ============================================
// CLASSE RÉUTILISABLE POUR LES MODALS
// ============================================
class Modal {
  constructor(config) {
    this.modalId = config.modalId;
    this.backdropSelector = config.backdropSelector || '.modal-backdrop, [class*="-backdrop"]';
    this.closeBtnSelector = config.closeBtnSelector || '.modal-close, [class*="-close"]';
    this.showClass = config.showClass || 'show';
    this.animationDelay = config.animationDelay || APP_CONFIG.MODAL_ANIMATION_DELAY;
    this.onOpen = config.onOpen;
    this.onClose = config.onClose;
    
    this.modal = document.getElementById(this.modalId);
    if (!this.modal) return;
    
    this.backdrop = this.modal.querySelector(this.backdropSelector);
    this.closeBtn = this.modal.querySelector(this.closeBtnSelector);
    
    this.init();
  }
  
  init() {
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
  }
  
  open() {
    if (!this.modal) return;
    this.modal.classList.add(this.showClass);
    if (this.onOpen) this.onOpen();
  }
  
  close() {
    if (!this.modal) return;
    this.modal.classList.remove(this.showClass);
    if (this.onClose) this.onClose();
  }
  
  toggle() {
    if (this.modal?.classList.contains(this.showClass)) {
      this.close();
    } else {
      this.open();
    }
  }
}

// ============================================
// DONNÉES STATIQUES - GOUVERNORATS
// ============================================
const TUNISIA_DATA = {
  delegationsByGovernorat: {
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
  },

  ecolesByDelegation: {
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
    'ariana-ville': ['École Primaire Ariana Ville'],
    'ettadhamen': ['École Primaire Ettadhamen'],
    'ettadhamen-mnihla': ['École Primaire Ettadhamen-Mnihla'],
    'kalâat-el-andalous': ['École Primaire Kalâat el-Andalous'],
    'la-soukra': ['École Primaire La Soukra'],
    'mnihla': ['École Primaire Mnihla'],
    'raoued': ['École Primaire Raoued'],
    'sidi-thabet': ['École Primaire Sidi Thabet'],
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
    'borj-el-amri': ['École Primaire Borj El Amri'],
    'douar-hicher': ['École Primaire Douar Hicher'],
    'el-battan': ['École Primaire El Battan'],
    'jedaida': ['École Primaire Jedaida'],
    'manouba': ['École Primaire Manouba'],
    'mornaguia': ['École Primaire Mornaguia'],
    'oued-ellil': ['École Primaire Oued Ellil'],
    'tebourba': ['École Primaire Tebourba'],
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
    'bir-mcherga': ['École Primaire Bir Mcherga'],
    'el-fahs': ['École Primaire El Fahs'],
    'nadhour': ['École Primaire Nadhour'],
    'saouaf': ['École Primaire Saouaf'],
    'zaghouan': ['École Primaire Zaghouan'],
    'zriba': ['École Primaire Zriba'],
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
    'amdoun': ['École Primaire Amdoun'],
    'beja-nord': ['École Primaire Béja Nord'],
    'beja-sud': ['École Primaire Béja Sud'],
    'goubellat': ['École Primaire Goubellat'],
    'medjez-el-bab': ['École Primaire Medjez El Bab'],
    'nefza': ['École Primaire Nefza'],
    'teboursouk': ['École Primaire Teboursouk'],
    'testour': ['École Primaire Testour'],
    'thibar': ['École Primaire Thibar'],
    'ain-draham': ['École Primaire Ain Draham'],
    'balta-bou-aouane': ['École Primaire Balta Bou Aouane'],
    'bou-salem': ['École Primaire Bou Salem'],
    'fernana': ['École Primaire Fernana'],
    'ghardimaou': ['École Primaire Ghardimaou'],
    'jendouba': ['École Primaire Jendouba'],
    'oued-meliz': ['École Primaire Oued Meliz'],
    'tabarka': ['École Primaire Tabarka'],
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
    'douz': ['École Primaire Douz'],
    'el-faouar': ['École Primaire El Faouar'],
    'kebili-nord': ['École Primaire Kébili Nord'],
    'kebili-sud': ['École Primaire Kébili Sud'],
    'souk-el-ahad': ['École Primaire Souk El Ahad'],
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
    'ben-gardane': ['École Primaire Ben Gardane'],
    'beni-khedache': ['École Primaire Beni Khedache'],
    'djerba---ajim': ['École Primaire Djerba - Ajim'],
    'djerba---houmt-souk': ['École Primaire Djerba - Houmt Souk'],
    'djerba---midoun': ['École Primaire Djerba - Midoun'],
    'médenine-nord': ['École Primaire Médenine Nord'],
    'médenine-sud': ['École Primaire Médenine Sud'],
    'sidi-makhlouf': ['École Primaire Sidi Makhlouf'],
    'zarzis': ['École Primaire Zarzis'],
    'bir-lahmar': ['École Primaire Bir Lahmar'],
    'dehiba': ['École Primaire Dehiba'],
    'ghomrassen': ['École Primaire Ghomrassen'],
    'remada': ['École Primaire Remada'],
    'smâr': ['École Primaire Smâr'],
    'tataouine-nord': ['École Primaire Tataouine Nord'],
    'tataouine-sud': ['École Primaire Tataouine Sud'],
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
    'degache': ['École Primaire Degache'],
    'hazoua': ['École Primaire Hazoua'],
    'nefta': ['École Primaire Nefta'],
    'tameghza': ['École Primaire Tameghza'],
    'tozeur': ['École Primaire Tozeur']
  }
};

// ============================================
// INITIALISATION DES PAGES
// ============================================

// Page Index - Redirection automatique
if (document.querySelector('.welcome-container')) {
  setTimeout(() => {
    window.location.href = ROUTES.CHOOSE_ROLE;
  }, APP_CONFIG.REDIRECT_DELAY);
}

// Page Choisir Compte - Sélection parent/enseignant
if (document.querySelector('[data-account="parent"]')) {
  document.addEventListener('DOMContentLoaded', () => {
    const parentBtn = document.querySelector('[data-account="parent"]');
    const teacherBtn = document.querySelector('[data-account="teacher"]');
    
    if (parentBtn) {
      parentBtn.addEventListener('click', () => {
        if (AppUtils.saveUserRole('parent')) {
          window.location.href = ROUTES.CONNEXION;
        }
      });
    }
    
    if (teacherBtn) {
      teacherBtn.addEventListener('click', () => {
        if (AppUtils.saveUserRole('teacher')) {
          window.location.href = ROUTES.CONNEXION;
        }
      });
    }
  });
}

// Pages Connexion - Gestion du formulaire
if (document.getElementById('loginForm') || document.getElementById('emailForm')) {
  const form = document.getElementById('loginForm') || document.getElementById('emailForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const continueBtn = document.getElementById('continueBtn');
  const togglePasswordBtn = document.getElementById('togglePassword');

  if (form && emailInput && passwordInput && continueBtn) {
    if (togglePasswordBtn) {
      AppUtils.initPasswordToggle(passwordInput, togglePasswordBtn);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (continueBtn && !continueBtn.disabled) {
        RoleManager.redirectBasedOnRole();
      }
    });
    
    AppUtils.initEmailPasswordForm(emailInput, passwordInput, continueBtn, form, null);
  }
}

// Pages Création de Compte - Sélection de compte Google/Facebook
if (document.getElementById('googleBtn') || document.getElementById('facebookBtn')) {
  const googleBtn = document.getElementById('googleBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const accountSelectModal = document.getElementById('accountSelectModal');
  const accountList = document.getElementById('accountList');
  const closeAccountSelect = document.getElementById('closeAccountSelect');
  const accountSelectTitle = document.getElementById('accountSelectTitle');
  const accountSelectLogo = document.getElementById('accountSelectLogo');
  const backdrop = accountSelectModal?.querySelector('.account-select-backdrop');

  const sampleGoogleAccounts = [
    { name: 'ghofrane eltaief', email: 'ghofraneeltaief48@gmail.com', avatar: null, hasPhoto: true },
    { name: 'Ghofrane Eltaief', email: 'ghofrane@hipto.com', avatar: null, hasPhoto: true },
    { name: 'Ghofrane Eltaief', email: 'ghofraneeltaief.digixis@gmail.com', avatar: null, hasPhoto: false }
  ];

  const sampleFacebookAccounts = [
    { name: 'Ghofrane Eltaief', email: 'ghofrane@facebook.com', avatar: null, hasPhoto: true },
    { name: 'John Doe', email: 'john@facebook.com', avatar: null, hasPhoto: false }
  ];

  const createProviderLogo = (provider) => {
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
  };

  const openAccountSelectModal = (provider) => {
    if (!accountSelectModal || !accountList) return;

    const accounts = provider === 'google' ? sampleGoogleAccounts : sampleFacebookAccounts;
    const providerName = provider === 'google' ? 'Google' : 'Facebook';
    
    if (accountSelectTitle) {
      accountSelectTitle.textContent = `Sélectionner un compte pour utiliser Droussi`;
    }
    
    createProviderLogo(provider);
    accountList.innerHTML = '';

    accounts.forEach((account) => {
      const accountItem = document.createElement('div');
      accountItem.className = 'account-item';
      accountItem.setAttribute('data-provider', provider);
      
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'account-avatar';
      
      if (account.hasPhoto && account.avatar) {
        const img = document.createElement('img');
        img.src = account.avatar;
        img.alt = account.name;
        avatarDiv.appendChild(img);
      } else {
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
          const initials = account.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          avatarDiv.textContent = initials;
          avatarDiv.style.background = '#1877F2';
          avatarDiv.style.color = 'white';
        }
      }
      
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
      
      accountItem.addEventListener('click', (e) => {
        e.preventDefault();
        closeAccountSelectModal();
        setTimeout(() => {
          RoleManager.redirectBasedOnRole();
        }, APP_CONFIG.MODAL_ANIMATION_DELAY);
      });
      
      accountList.appendChild(accountItem);
    });

    accountSelectModal.style.display = 'block';
    setTimeout(() => {
      accountSelectModal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  const closeAccountSelectModal = () => {
    if (accountSelectModal) {
      accountSelectModal.classList.remove('show');
      setTimeout(() => {
        accountSelectModal.style.display = 'none';
      }, APP_CONFIG.MODAL_ANIMATION_DELAY);
      document.body.style.overflow = '';
    }
  };

  if (googleBtn) {
    googleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccountSelectModal('google');
    });
  }

  if (facebookBtn) {
    facebookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccountSelectModal('facebook');
    });
  }

  if (closeAccountSelect) {
    closeAccountSelect.addEventListener('click', (e) => {
      e.preventDefault();
      closeAccountSelectModal();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeAccountSelectModal();
    });
  }
}

// Page Gouvernorat - Sélection avec recherche
if (document.getElementById('governoratForm')) {
  const governoratInput = document.getElementById('governorat');
  const delegationInput = document.getElementById('delegation');
  const ecoleInput = document.getElementById('ecole');
  const governoratDropdown = document.getElementById('governoratDropdown');
  const delegationDropdown = document.getElementById('delegationDropdown');
  const ecoleDropdown = document.getElementById('ecoleDropdown');
  const continueBtn = document.getElementById('continueBtn');
  const form = document.getElementById('governoratForm');

  const governoratGroup = governoratInput?.closest('.form-group.select-group');
  const delegationGroup = delegationInput?.closest('.form-group.select-group');
  const ecoleGroup = ecoleInput?.closest('.form-group.select-group');

  let selectedGovernorat = '';
  let selectedDelegation = '';
  let selectedEcole = '';

  const updateVisualStates = () => {
    [governoratGroup, delegationGroup, ecoleGroup].forEach(group => {
      if (group) {
        group.classList.remove('active', 'completed');
      }
    });

    if (governoratGroup) {
      governoratGroup.classList.add(selectedGovernorat ? 'completed' : 'active');
    }

    if (delegationGroup) {
      if (selectedDelegation) {
        delegationGroup.classList.add('completed');
      } else if (selectedGovernorat) {
        delegationGroup.classList.add('active');
      }
    }

    if (ecoleGroup) {
      if (selectedEcole) {
        ecoleGroup.classList.add('completed');
      } else if (selectedDelegation) {
        ecoleGroup.classList.add('active');
      }
    }
  };

  const checkForm = () => {
    if (selectedGovernorat && selectedDelegation && selectedEcole) {
      continueBtn.disabled = false;
      continueBtn.classList.add('active');
    } else {
      continueBtn.disabled = true;
      continueBtn.classList.remove('active');
    }
  };

  // Gestion du gouvernorat
  if (governoratInput && governoratDropdown) {
    const governoratWrapper = governoratInput.closest('.select-wrapper');
    const initialGovernoratOptions = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
    
    const resetGovernoratOptions = () => {
      governoratDropdown.innerHTML = '';
      initialGovernoratOptions.forEach(opt => {
        const div = document.createElement('div');
        div.className = 'select-option';
        div.textContent = opt;
        div.setAttribute('data-value', AppUtils.normalizeKey(opt));
        governoratDropdown.appendChild(div);
      });
    };
    
    const handleGovernoratFocus = () => {
      if (governoratWrapper) governoratWrapper.classList.add('active');
      resetGovernoratOptions();
      governoratDropdown.style.display = 'block';
      const options = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
      AppUtils.filterOptions(governoratInput, governoratDropdown, options);
      updateVisualStates();
    };

    governoratInput.addEventListener('focus', handleGovernoratFocus);
    governoratInput.addEventListener('click', handleGovernoratFocus);

    governoratInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (governoratWrapper) governoratWrapper.classList.remove('active');
      }, APP_CONFIG.DROPDOWN_CLOSE_DELAY);
    });

    governoratInput.addEventListener('input', () => {
      if (governoratDropdown.querySelectorAll('.select-option').length === 0 || 
          governoratDropdown.querySelector('.no-results')) {
        resetGovernoratOptions();
      }
      const options = Array.from(governoratDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
      AppUtils.filterOptions(governoratInput, governoratDropdown, options);
      
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

    governoratDropdown.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-option') && !e.target.classList.contains('no-results')) {
        const value = e.target.textContent;
        governoratInput.value = value;
        selectedGovernorat = e.target.getAttribute('data-value') || AppUtils.normalizeKey(value);
        governoratDropdown.style.display = 'none';
        if (governoratWrapper) governoratWrapper.classList.remove('active');
        
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
        
        const delegations = TUNISIA_DATA.delegationsByGovernorat[selectedGovernorat] || [];
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
    
    const resetDelegationOptions = () => {
      if (selectedGovernorat) {
        const delegations = TUNISIA_DATA.delegationsByGovernorat[selectedGovernorat] || [];
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
      }
    };
    
    const handleDelegationFocus = () => {
      if (!delegationInput.disabled) {
        if (delegationWrapper) delegationWrapper.classList.add('active');
        resetDelegationOptions();
        delegationDropdown.style.display = 'block';
        const options = Array.from(delegationDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(delegationInput, delegationDropdown, options);
        updateVisualStates();
      }
    };

    delegationInput.addEventListener('focus', handleDelegationFocus);
    delegationInput.addEventListener('click', handleDelegationFocus);

    delegationInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (delegationWrapper) delegationWrapper.classList.remove('active');
      }, APP_CONFIG.DROPDOWN_CLOSE_DELAY);
    });

    delegationInput.addEventListener('input', () => {
      if (!delegationInput.disabled) {
        if (delegationDropdown.querySelectorAll('.select-option').length === 0 || 
            delegationDropdown.querySelector('.no-results')) {
          resetDelegationOptions();
        }
        const options = Array.from(delegationDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(delegationInput, delegationDropdown, options);
        
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

    delegationDropdown.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-option') && !e.target.classList.contains('no-results')) {
        const value = e.target.textContent;
        delegationInput.value = value;
        selectedDelegation = e.target.getAttribute('data-value');
        delegationDropdown.style.display = 'none';
        if (delegationWrapper) delegationWrapper.classList.remove('active');
        
        if (ecoleInput) {
          ecoleInput.disabled = false;
          ecoleInput.value = '';
        }
        selectedEcole = '';
        
        const ecoles = TUNISIA_DATA.ecolesByDelegation[selectedDelegation] || [];
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
    
    const resetEcoleOptions = () => {
      if (selectedDelegation) {
        const ecoles = TUNISIA_DATA.ecolesByDelegation[selectedDelegation] || [];
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
    };
    
    const handleEcoleFocus = () => {
      if (!ecoleInput.disabled) {
        if (ecoleWrapper) ecoleWrapper.classList.add('active');
        resetEcoleOptions();
        ecoleDropdown.style.display = 'block';
        const options = Array.from(ecoleDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(ecoleInput, ecoleDropdown, options);
        updateVisualStates();
      }
    };

    ecoleInput.addEventListener('focus', handleEcoleFocus);
    ecoleInput.addEventListener('click', handleEcoleFocus);

    ecoleInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (ecoleWrapper) ecoleWrapper.classList.remove('active');
      }, APP_CONFIG.DROPDOWN_CLOSE_DELAY);
    });

    ecoleInput.addEventListener('input', () => {
      if (!ecoleInput.disabled) {
        if (ecoleDropdown.querySelectorAll('.select-option').length === 0 || 
            ecoleDropdown.querySelector('.no-results')) {
          resetEcoleOptions();
        }
        const options = Array.from(ecoleDropdown.querySelectorAll('.select-option')).map(opt => opt.textContent);
        AppUtils.filterOptions(ecoleInput, ecoleDropdown, options);
        
        if (ecoleInput.value.trim() === '') {
          selectedEcole = '';
          updateVisualStates();
          checkForm();
        }
      }
    });

    ecoleDropdown.addEventListener('click', (e) => {
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
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.select-wrapper')) {
      if (governoratDropdown) {
        governoratDropdown.style.display = 'none';
        const wrapper = governoratInput?.closest('.select-wrapper');
        if (wrapper) wrapper.classList.remove('active');
      }
      if (delegationDropdown) {
        delegationDropdown.style.display = 'none';
        const wrapper = delegationInput?.closest('.select-wrapper');
        if (wrapper) wrapper.classList.remove('active');
      }
      if (ecoleDropdown) {
        ecoleDropdown.style.display = 'none';
        const wrapper = ecoleInput?.closest('.select-wrapper');
        if (wrapper) wrapper.classList.remove('active');
      }
    }
  });

  updateVisualStates();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (selectedGovernorat && selectedDelegation && selectedEcole) {
<<<<<<< Updated upstream
        console.log('Sélection complète:', {
=======
        if (APP_DEBUG) console.log('Sélection complète:', {
>>>>>>> Stashed changes
          gouvernorat: governoratInput.value,
          délégation: delegationInput.value,
          école: ecoleInput.value,
          codes: {
            gouvernorat: selectedGovernorat,
            délégation: selectedDelegation,
            école: selectedEcole
          }
        });
        
        window.location.href = ROUTES.CLASSE;
      }
    });
  }
}

// Page Choisir Téléphone - Saisie du numéro (code simplifié pour l'exemple)
if (document.getElementById('phoneNumber')) {
  // Code pour la gestion du téléphone - conservé mais simplifié
  // (Le code complet est très long, on peut le garder tel quel ou le refactoriser)
<<<<<<< Updated upstream
  console.log('Page téléphone détectée');
=======
  if (APP_DEBUG) console.log('Page téléphone détectée');
>>>>>>> Stashed changes
}

// Page Classe - Sélection de classe
if (document.getElementById('classesContainer')) {
  const classesContainer = document.getElementById('classesContainer');
  const continueBtn = document.getElementById('continueBtn');
  
  // Créer les classes 1, 2, 3, 4, 5 et 6
  const classeNumbers = [1, 2, 3, 4, 5, 6];
  const classes = classeNumbers.map(() => ({
    lettres: ["أ", "ب", "ج", "د", "ه"],
    selected: new Set()
  }));

  const toggleLetter = (classIndex, letter) => {
    const selected = classes[classIndex].selected;
    if (selected.has(letter)) {
      selected.delete(letter);
    } else {
      selected.add(letter);
    }
    renderClasses();
    checkClasseForm();
  };

  const renderClasses = () => {
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
      // Afficher le numéro de classe correspondant à l'index
      classNum.textContent = classeNumbers[i];

      classeRow.appendChild(classNum);
      classeRow.appendChild(lettresDiv);
      classesContainer.appendChild(classeRow);
    });
  };

  const checkClasseForm = () => {
    const hasSelection = classes.some(classe => classe.selected.size > 0);
    if (continueBtn) {
      continueBtn.disabled = !hasSelection;
    }
  };

  // Gestion du modal de confirmation d'abonnement
  const subscriptionModal = new Modal({
    modalId: 'subscriptionModal',
    backdropSelector: '#modalBackdrop',
    closeBtnSelector: '#modalCloseBtn'
  });
  
  const modalAmount = document.getElementById('modalAmount');
  const modalPrice = document.getElementById('modalPrice');
  const classesDetails = document.getElementById('classesDetails');
  
  // Fonction pour ouvrir le modal avec les données
  const openSubscriptionModal = () => {
    const selections = [];
    classes.forEach((classe, index) => {
      const lettres = Array.from(classe.selected);
      // Utiliser le numéro de classe correspondant à l'index
      const classeNumber = classeNumbers[index];
      lettres.forEach(lettre => {
        selections.push({
          classe: classeNumber,
          lettre: lettre
        });
      });
    });
    
    // Mettre à jour le contenu du modal
    if (modalAmount) {
      const totalClasses = selections.length;
      modalAmount.textContent = totalClasses === 1 ? '1 Classe' : `${totalClasses} Classes`;
    }
    
    if (modalPrice) {
      const totalClasses = selections.length;
      modalPrice.textContent = `${totalClasses} DT`;
    }
    
    // Afficher les détails des classes
    if (classesDetails) {
      classesDetails.innerHTML = '';
      selections.forEach(item => {
        const classDiv = AppUtils.createElement('div', {
<<<<<<< Updated upstream
          style: 'padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;'
=======
          style: 'padding: 12px; border-radius: 8px; margin-bottom: 8px;'
>>>>>>> Stashed changes
        });
        classDiv.innerHTML = `<strong>${item.classe}ème Année ${item.lettre}</strong>`;
        classesDetails.appendChild(classDiv);
      });
    }
    
    subscriptionModal.open();
  };
  
  // Gestion du bouton "Je m'abonne"
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (!continueBtn.disabled) {
        openSubscriptionModal();
      }
    });
  }

  renderClasses();
  checkClasseForm();
  
  // Gestion des boutons d'achat dans le modal de confirmation
  const buyWithCardBtn = document.getElementById('buyWithCardBtn');
  const buyWithBalanceBtn = document.getElementById('buyWithBalanceBtn');
  
  const handleSubscription = () => {
    const selections = [];
    
    // Récupérer les informations de l'école
    const governorat = localStorage.getItem('selectedGovernorat') || '';
    const delegation = localStorage.getItem('selectedDelegation') || '';
    const ecole = localStorage.getItem('selectedEcole') || '';
    const ecoleCode = localStorage.getItem('selectedEcoleCode') || '';
    
    classes.forEach((classe, index) => {
      const lettres = Array.from(classe.selected);
      // Utiliser le numéro de classe correspondant à l'index
      const classeNumber = classeNumbers[index];
      lettres.forEach(lettre => {
        selections.push({
          classe: classeNumber,
          lettre: lettre,
          ecole: ecole,
          ecoleCode: ecoleCode,
          delegation: delegation,
          governorat: governorat
        });
      });
    });
    
    if (selections.length > 0) {
      // Récupérer le rôle de l'utilisateur
<<<<<<< Updated upstream
      const userRole = AppUtils.getUserRole();
=======
      let userRole = AppUtils.getUserRole();
      
      // Fallback : si le rôle n'est pas défini, essayer de le détecter depuis l'URL ou utiliser 'parent' par défaut
      if (!userRole) {
        // Vérifier si on vient de la page Parent ou Teacher
        const referrer = document.referrer;
        if (referrer.includes('Parent.html') || referrer.includes('parent')) {
          userRole = 'parent';
          AppUtils.saveUserRole('parent');
        } else if (referrer.includes('Teacher.html') || referrer.includes('teacher')) {
          userRole = 'teacher';
          AppUtils.saveUserRole('teacher');
        } else {
          // Par défaut, utiliser 'parent' si non défini
          userRole = 'parent';
          AppUtils.saveUserRole('parent');
        }
      }
>>>>>>> Stashed changes
      
      // Déterminer les clés de stockage selon le rôle
      const classesKey = userRole === 'parent' ? STORAGE_KEYS.PARENT_CLASSES : STORAGE_KEYS.TEACHER_CLASSES;
      const subscribedKey = userRole === 'parent' ? STORAGE_KEYS.PARENT_SUBSCRIBED : STORAGE_KEYS.TEACHER_SUBSCRIBED;
      
      // Récupérer les classes existantes selon le rôle
      const existingClasses = JSON.parse(localStorage.getItem(classesKey) || '[]');
      
      // Créer un Set pour éviter les doublons (basé sur école + classe + lettre)
      const classesSet = new Set();
      existingClasses.forEach(c => {
        const key = `${c.ecoleCode || ''}-${c.classe}-${c.lettre}`;
        classesSet.add(key);
      });
      
      // Ajouter les nouvelles classes (éviter les doublons)
      const newClasses = selections.filter(c => {
        const key = `${c.ecoleCode || ''}-${c.classe}-${c.lettre}`;
        if (!classesSet.has(key)) {
          classesSet.add(key);
          return true;
        }
        return false;
      });
      
      // Combiner les classes existantes avec les nouvelles
      const allClasses = [...existingClasses, ...newClasses];
      
      // Sauvegarder toutes les classes dans localStorage selon le rôle
      localStorage.setItem(classesKey, JSON.stringify(allClasses));
      localStorage.setItem(subscribedKey, 'true');
      
<<<<<<< Updated upstream
=======
      if (APP_DEBUG) console.log('Abonnement réussi pour', userRole, ':', allClasses);
      
>>>>>>> Stashed changes
      // Fermer le modal
      subscriptionModal.close();
      
      // Rediriger selon le rôle de l'utilisateur
      if (userRole === 'parent') {
        window.location.href = ROUTES.PARENT;
      } else {
        window.location.href = ROUTES.TEACHER;
      }
    }
  };
  
  if (buyWithCardBtn) {
    buyWithCardBtn.addEventListener('click', handleSubscription);
  }
  
  if (buyWithBalanceBtn) {
    buyWithBalanceBtn.addEventListener('click', handleSubscription);
  }
}

<<<<<<< Updated upstream
// Page Parent - Modal de bienvenue et affichage des classes
if (document.getElementById('welcomeModal') && document.body.classList.contains('app-style-page') && !document.getElementById('classesSection')) {
  const welcomeModal = new Modal({
    modalId: 'welcomeModal',
    backdropSelector: '.welcome-modal-backdrop',
    closeBtnSelector: null
  });
  
  const parentPostsContainer = document.getElementById('parentPostsContainer');
  
  // Vérifier si le parent est déjà abonné
  const isSubscribed = localStorage.getItem(STORAGE_KEYS.PARENT_SUBSCRIBED) === 'true';
  const parentClasses = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENT_CLASSES) || '[]');
  
  if (isSubscribed && parentClasses.length > 0) {
    // Afficher les classes sous forme de posts et masquer la modal
    console.log('Parent abonné, affichage des classes:', parentClasses);
    if (parentPostsContainer) {
      renderParentClasses(parentClasses);
    }
  } else {
    console.log('Parent non abonné, affichage de la modal');
    // Afficher le modal au chargement de la page
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => welcomeModal.open(), APP_CONFIG.MODAL_ANIMATION_DELAY);
      });
    } else {
      setTimeout(() => welcomeModal.open(), APP_CONFIG.MODAL_ANIMATION_DELAY);
    }
  }
=======
// Page Parent - Affichage des classes comme posts Facebook
if (document.getElementById('parentPostsContainer') && document.body.classList.contains('app-style-page') && !document.getElementById('classesSection')) {
  const parentPostsContainer = document.getElementById('parentPostsContainer');
  const subscriptionSection = document.getElementById('subscriptionSection');
  const parentFab = document.getElementById('parentFab');
>>>>>>> Stashed changes
  
  // Fonction pour afficher les classes sous forme de posts style Facebook
  function renderParentClasses(classes) {
    if (!parentPostsContainer || !classes || classes.length === 0) {
<<<<<<< Updated upstream
      console.log('Aucune classe à afficher');
      return;
    }
    
    console.log('Affichage des classes en posts:', classes);
=======
      if (APP_DEBUG) console.log('Aucune classe à afficher');
      return;
    }
    if (APP_DEBUG) console.log('Affichage des classes en posts:', classes);
>>>>>>> Stashed changes
    parentPostsContainer.innerHTML = '';
    
    // Grouper les classes par école
    const classesByEcole = {};
    classes.forEach((classe) => {
      const ecoleKey = classe.ecole || 'École inconnue';
      if (!classesByEcole[ecoleKey]) {
        classesByEcole[ecoleKey] = [];
      }
      classesByEcole[ecoleKey].push(classe);
    });
    
    // Créer un post pour chaque classe
    Object.keys(classesByEcole).forEach((ecoleName) => {
      const ecoleClasses = classesByEcole[ecoleName];
      
      ecoleClasses.forEach((classe) => {
<<<<<<< Updated upstream
=======
        // Container pour chaque post
        const postContainer = document.createElement('div');
        postContainer.className = 'parent-post-container';
        
>>>>>>> Stashed changes
        const post = document.createElement('div');
        post.className = 'parent-post';
        
        const classeNum = classe.classe;
        const classeLettre = classe.lettre;
        const avatarText = `${classeNum}${classeLettre}`;
        
        // Générer une date aléatoire pour la démonstration
        const postDate = getRandomDate();
        
        post.innerHTML = `
          <div class="parent-post-header">
            <div class="parent-post-avatar">
              <div class="parent-avatar-placeholder">${avatarText}</div>
            </div>
            <div class="parent-post-info">
              <h3 class="parent-post-author">${classeNum}ème Année ${classeLettre}</h3>
              <p class="parent-post-meta">${ecoleName} · ${postDate}</p>
            </div>
            <button class="parent-post-menu" aria-label="Options">
              <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
            </button>
          </div>
          <div class="parent-post-content">
            <p class="parent-post-text">Bienvenue dans la classe ${classeNum}ème Année ${classeLettre} ! Suivez les actualités et les communications de l'enseignant.</p>
          </div>
          <div class="parent-post-actions">
            <button class="parent-post-action-btn">
              <ion-icon name="thumbs-up-outline"></ion-icon>
              <span>J'aime</span>
            </button>
<<<<<<< Updated upstream
            <button class="parent-post-action-btn">
              <ion-icon name="chatbubble-outline"></ion-icon>
              <span>Commenter</span>
            </button>
            <button class="parent-post-action-btn">
              <ion-icon name="share-outline"></ion-icon>
              <span>Partager</span>
            </button>
          </div>
        `;
        
        parentPostsContainer.appendChild(post);
=======
          </div>
        `;
        
        postContainer.appendChild(post);
        parentPostsContainer.appendChild(postContainer);
>>>>>>> Stashed changes
      });
    });
  }
  
  // Gestion du bouton FAB pour ajouter un abonnement (uniquement sur Parent.html)
  if (parentPostsContainer) {
    const parentFabBtn = document.querySelector('.app-fab');
    if (parentFabBtn) {
      parentFabBtn.addEventListener('click', () => {
        // Rediriger vers gouvernorat.html pour ajouter un nouvel abonnement
        window.location.href = ROUTES.GOUVERNORAT;
      });
    }
  }

  // Fonction utilitaire pour générer une date aléatoire
  function getRandomDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
<<<<<<< Updated upstream
    if (daysAgo === 0) {
      return "Aujourd'hui";
    } else if (daysAgo === 1) {
      return "Hier";
    } else {
      const options = { day: 'numeric', month: 'long' };
      return date.toLocaleDateString('fr-FR', options);
    }
=======
    const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
  }
  
  // Vérifier si le parent est déjà abonné
  const isSubscribed = localStorage.getItem(STORAGE_KEYS.PARENT_SUBSCRIBED) === 'true';
  const parentClasses = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENT_CLASSES) || '[]');
  
  if (isSubscribed && parentClasses.length > 0) {
    // Afficher les classes sous forme de posts et masquer la section d'abonnement
    if (APP_DEBUG) console.log('Parent abonné, affichage des classes:', parentClasses);
    if (parentPostsContainer) {
      parentPostsContainer.style.display = 'block';
      renderParentClasses(parentClasses);
    }
    if (subscriptionSection) {
      subscriptionSection.style.display = 'none';
    }
    // Afficher le FAB
    if (parentFab) {
      parentFab.style.display = 'flex';
    }
  } else {
    if (APP_DEBUG) console.log('Parent non abonné, affichage de la section d\'abonnement');
    // Afficher la section d'abonnement et masquer les posts
    if (subscriptionSection) {
      subscriptionSection.style.display = 'block';
    }
    if (parentPostsContainer) {
      parentPostsContainer.style.display = 'none';
    }
    // Masquer le FAB
    if (parentFab) {
      parentFab.style.display = 'none';
    }
  }
  
  // Gestion du bouton FAB pour ajouter un abonnement (uniquement sur Parent.html)
  if (parentFab) {
    parentFab.addEventListener('click', () => {
      // Rediriger vers gouvernorat.html pour ajouter un nouvel abonnement
      window.location.href = ROUTES.GOUVERNORAT;
    });
>>>>>>> Stashed changes
  }
  
  // Gérer le bouton S'abonner
  const subscribeBtn = document.getElementById('subscribeBtn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      window.location.href = ROUTES.GOUVERNORAT;
    });
  }
  
<<<<<<< Updated upstream
  // Fermer le modal en glissant vers le bas (optionnel)
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  const dialog = welcomeModal.modal?.querySelector('.welcome-modal-dialog');
  
  if (dialog) {
    dialog.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    });
    
    dialog.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0) {
        dialog.style.transform = `translateY(${diff}px)`;
      }
    });
    
    dialog.addEventListener('touchend', () => {
      if (isDragging && currentY - startY > 100) {
        welcomeModal.close();
      }
      dialog.style.transform = '';
      isDragging = false;
    });
  }
}

// Page Teacher - Modal de bienvenue et gestion des classes
if (document.getElementById('welcomeModal') && document.getElementById('classesSection')) {
  const welcomeModal = new Modal({
    modalId: 'welcomeModal',
    backdropSelector: '.welcome-modal-backdrop',
    closeBtnSelector: null
  });
  
=======
  // Fermer le modal en glissant (uniquement si la page a un welcomeModal, ex. Teacher)
  var welcomeModalEl = document.getElementById('welcomeModal');
  if (welcomeModalEl) {
    var welcomeModalInstance = new Modal({
      modalId: 'welcomeModal',
      backdropSelector: '.welcome-modal-backdrop',
      closeBtnSelector: null
    });
    var dialog = welcomeModalInstance.modal && welcomeModalInstance.modal.querySelector('.welcome-modal-dialog');
    if (dialog) {
      var startY = 0, currentY = 0, isDragging = false;
      dialog.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = true;
      });
      dialog.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        var diff = currentY - startY;
        if (diff > 0) dialog.style.transform = 'translateY(' + diff + 'px)';
      });
      dialog.addEventListener('touchend', function() {
        if (isDragging && currentY - startY > 100) welcomeModalInstance.close();
        dialog.style.transform = '';
        isDragging = false;
      });
    }
  }
}

// Page Teacher - Gestion des classes (affichage si déjà abonné)
if (document.getElementById('classesSection') && document.getElementById('classesList')) {
  const welcomeModalEl = document.getElementById('welcomeModal');
  const welcomeModal = welcomeModalEl ? new Modal({
    modalId: 'welcomeModal',
    backdropSelector: '.welcome-modal-backdrop',
    closeBtnSelector: null
  }) : null;
  
  const subscriptionSection = document.getElementById('subscriptionSection');
>>>>>>> Stashed changes
  const classesSection = document.getElementById('classesSection');
  const classesList = document.getElementById('classesList');
  
  // Vérifier si l'enseignant est déjà abonné
  const isSubscribed = localStorage.getItem(STORAGE_KEYS.TEACHER_SUBSCRIBED) === 'true';
  const teacherClasses = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHER_CLASSES) || '[]');
  
  if (isSubscribed && teacherClasses.length > 0) {
<<<<<<< Updated upstream
    // Afficher les classes et masquer la modal
    console.log('Enseignant abonné, affichage des classes:', teacherClasses);
=======
    // Déjà abonné : masquer l'invitation d'abonnement, afficher les classes
    if (APP_DEBUG) console.log('Enseignant abonné, affichage des classes:', teacherClasses);
    if (subscriptionSection) {
      subscriptionSection.style.display = 'none';
    }
>>>>>>> Stashed changes
    if (classesSection) {
      classesSection.style.display = 'flex';
    }
    if (classesList) {
      renderTeacherClasses(teacherClasses);
    }
  } else {
<<<<<<< Updated upstream
    console.log('Enseignant non abonné, affichage de la modal');
    // Afficher la modal de bienvenue
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => welcomeModal.open(), APP_CONFIG.MODAL_ANIMATION_DELAY);
      });
    } else {
      setTimeout(() => welcomeModal.open(), APP_CONFIG.MODAL_ANIMATION_DELAY);
=======
    if (APP_DEBUG) console.log('Enseignant non abonné, affichage de la section d\'abonnement');
    // Non abonné : afficher l'invitation, masquer la liste des classes
    if (subscriptionSection) {
      subscriptionSection.style.display = 'block';
    }
    if (classesSection) {
      classesSection.style.display = 'none';
    }
    if (classesList) {
      classesList.style.display = 'none';
    }
    // Ouvrir la modal de bienvenue uniquement si elle existe
    if (welcomeModal) {
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => welcomeModal.open(), APP_CONFIG.MODAL_ANIMATION_DELAY);
        });
      } else {
        setTimeout(() => welcomeModal.open(), APP_CONFIG.MODAL_ANIMATION_DELAY);
      }
>>>>>>> Stashed changes
    }
  }
  
  // Gérer le bouton S'abonner aux classes
  const subscribeBtn = document.getElementById('subscribeBtn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      // Rediriger vers gouvernorat.html pour commencer le processus d'abonnement
      window.location.href = ROUTES.GOUVERNORAT;
    });
  }
  
<<<<<<< Updated upstream
  // Fermer le modal en glissant vers le bas
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  const dialog = welcomeModal.modal?.querySelector('.welcome-modal-dialog');
  
  if (dialog) {
=======
  // Fermer le modal en glissant vers le bas (uniquement si le modal existe)
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  const dialog = welcomeModal?.modal?.querySelector('.welcome-modal-dialog');
  
  if (welcomeModal && dialog) {
>>>>>>> Stashed changes
    dialog.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    });
    
    dialog.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0) {
        dialog.style.transform = `translateY(${diff}px)`;
      }
    });
    
    dialog.addEventListener('touchend', () => {
      if (isDragging && currentY - startY > 100) {
        welcomeModal.close();
      }
      dialog.style.transform = '';
      isDragging = false;
    });
  }
  
  // Fonction pour afficher les classes de l'enseignant
  function renderTeacherClasses(classes) {
    if (!classesList || !classes || classes.length === 0) {
<<<<<<< Updated upstream
      console.log('Aucune classe à afficher');
      return;
    }
    
    console.log('Affichage des classes:', classes);
=======
      if (APP_DEBUG) console.log('Aucune classe à afficher');
      return;
    }
    if (APP_DEBUG) console.log('Affichage des classes:', classes);
>>>>>>> Stashed changes
    classesList.innerHTML = '';
    
    // Grouper les classes par école
    const classesByEcole = {};
    classes.forEach((classe) => {
      const ecoleKey = classe.ecole || 'École inconnue';
      if (!classesByEcole[ecoleKey]) {
        classesByEcole[ecoleKey] = [];
      }
      classesByEcole[ecoleKey].push(classe);
    });
    
    // Afficher chaque école avec ses classes
    Object.keys(classesByEcole).forEach((ecoleName, ecoleIndex) => {
      const ecoleClasses = classesByEcole[ecoleName];
      
<<<<<<< Updated upstream
      // En-tête de l'école
      const ecoleHeader = document.createElement('div');
      ecoleHeader.className = 'teacher-ecole-header';
      ecoleHeader.innerHTML = `
        <div class="ecole-header-content">
          <ion-icon name="school-outline" class="ecole-header-icon"></ion-icon>
          <div class="ecole-header-text">
            <h4 class="ecole-header-title">${ecoleName}</h4>
            <p class="ecole-header-subtitle">${ecoleClasses.length} ${ecoleClasses.length === 1 ? 'classe' : 'classes'}</p>
          </div>
        </div>
      `;
=======
      // En-tête de l'école (nom échappé pour éviter XSS)
      var ecoleHeader = document.createElement('div');
      ecoleHeader.className = 'teacher-ecole-header';
      ecoleHeader.innerHTML =
        '<div class="ecole-header-content">' +
        '<ion-icon name="school-outline" class="ecole-header-icon"></ion-icon>' +
        '<div class="ecole-header-text">' +
        '<h4 class="ecole-header-title">' + escapeHtml(ecoleName) + '</h4>' +
        '<p class="ecole-header-subtitle">' + (ecoleClasses.length === 1 ? '1 classe' : ecoleClasses.length + ' classes') + '</p>' +
        '</div></div>';
>>>>>>> Stashed changes
      classesList.appendChild(ecoleHeader);
      
      // Classes de cette école
      ecoleClasses.forEach((classe, index) => {
        const classeItem = document.createElement('a');
        classeItem.href = 'chat.html';
        classeItem.className = 'app-chat-item';
        classeItem.style.textDecoration = 'none';
        classeItem.style.color = 'inherit';
        classeItem.style.display = 'flex';
        
        // Générer le texte de l'avatar (ex: "6A" -> "6A", "5B" -> "5B")
        const classeNum = classe.classe;
        const classeLettre = classe.lettre;
        const avatarText = `${classeNum}${classeLettre}`;
        
        const globalIndex = classes.indexOf(classe);
        
        classeItem.innerHTML = `
          <div class="chat-avatar">
            <div class="avatar-placeholder">${avatarText}</div>
          </div>
          <div class="chat-content">
            <div class="chat-header">
              <span class="chat-name">${classeNum}ème Année ${classeLettre}</span>
              <span class="chat-time">${getLastMessageTime(globalIndex)}</span>
            </div>
            <div class="chat-preview">
              <div class="chat-message-preview">
<<<<<<< Updated upstream
                <ion-icon name="send-outline" class="chat-send-icon"></ion-icon>
                <span class="chat-message-text">${getLastMessageText(globalIndex)}</span>
=======
                <span class="chat-message-text-list">${getLastMessageText(globalIndex)}</span>
>>>>>>> Stashed changes
              </div>
              <span class="chat-status-sent">
                <ion-icon name="checkmark-done"></ion-icon>
              </span>
            </div>
          </div>
        `;
        
        classesList.appendChild(classeItem);
      });
    });
    
    // S'assurer que la liste est visible
    classesList.style.display = 'block';
  }
  
  // Fonctions utilitaires pour les messages de démonstration
  function getLastMessageTime(index) {
    const times = ['14:30', 'Hier', 'Lun', 'Dim', 'Sam', 'Ven'];
    return times[index % times.length] || 'Aujourd\'hui';
  }
  
  function getLastMessageText(index) {
    const messages = [
      'Rappel : Réunion parents-professeurs demain à 15h',
      'Devoirs pour cette semaine : Mathématiques p.45-50',
      'Sortie scolaire prévue le 15 mars - Autorisation requise',
      'Contrôle de mathématiques prévu la semaine prochaine',
      'Rappel : Remise des bulletins le vendredi',
      'Devoirs de français à rendre pour lundi'
    ];
    return messages[index % messages.length] || 'Nouveau message';
  }
  
  // Gestion du bouton FAB pour ajouter un autre abonnement
  const fabBtn = document.querySelector('.app-fab');
  if (fabBtn) {
    fabBtn.addEventListener('click', () => {
      // Rediriger vers gouvernorat.html pour ajouter un nouvel abonnement
      window.location.href = ROUTES.GOUVERNORAT;
    });
  }
}

// Page Gouvernorat - Liste visible des gouvernorats
if (document.getElementById('governoratList') && !document.getElementById('delegation')) {
  const governoratList = document.getElementById('governoratList');
  const governoratSearch = document.getElementById('governoratSearch');
  const continueBtn = document.getElementById('continueBtn');
  const form = document.getElementById('governoratForm');
  
  const governorats = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Sfax', 'Mahdia', 'Monastir', 'Sousse',
    'Kébili', 'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur'
  ];
  
  let selectedGovernoratValue = '';
  let selectedGovernoratCode = '';
  
  // Fonction pour filtrer la liste
  const filterList = (searchTerm) => {
    if (!governoratList) return;
    
    const term = searchTerm.toLowerCase().trim();
    const items = governoratList.querySelectorAll('.governorat-item');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(term)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  };
  
  // Fonction pour mettre à jour l'état du bouton
  const updateButtonState = () => {
    if (continueBtn) {
      const hasSelection = selectedGovernoratValue.trim() !== '';
      continueBtn.disabled = !hasSelection;
      continueBtn.classList.toggle('active', hasSelection);
    }
  };
  
  // Initialiser le bouton comme désactivé
  updateButtonState();
  
  // Gestion de la recherche
  if (governoratSearch) {
    governoratSearch.addEventListener('input', (e) => {
      filterList(e.target.value);
    });
  }
  
  // Gestion du clic sur un élément de la liste
  if (governoratList) {
    governoratList.addEventListener('click', (e) => {
      const item = e.target.closest('.governorat-item');
      if (!item) return;
      
      // Retirer la sélection précédente
      governoratList.querySelectorAll('.governorat-item').forEach(li => {
        li.classList.remove('selected');
      });
      
      // Ajouter la sélection à l'élément cliqué
      item.classList.add('selected');
      
      selectedGovernoratValue = item.textContent;
      selectedGovernoratCode = item.getAttribute('data-value');
      
      updateButtonState();
    });
  }
  
  // Gestion du formulaire
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (continueBtn && !continueBtn.disabled && selectedGovernoratValue && selectedGovernoratCode) {
        localStorage.setItem('selectedGovernorat', selectedGovernoratValue);
        localStorage.setItem('selectedGovernoratCode', selectedGovernoratCode);
        window.location.href = 'delegation.html';
      }
    });
  }
  
  // Gestion du bouton Continuer
  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!continueBtn.disabled && selectedGovernoratValue && selectedGovernoratCode) {
        localStorage.setItem('selectedGovernorat', selectedGovernoratValue);
        localStorage.setItem('selectedGovernoratCode', selectedGovernoratCode);
        window.location.href = 'delegation.html';
      }
    });
  }
}

// Page Délégation - Liste visible des délégations
if (document.getElementById('delegationList') && !document.getElementById('governorat')) {
  const delegationList = document.getElementById('delegationList');
  const delegationSearch = document.getElementById('delegationSearch');
  const continueBtn = document.getElementById('continueBtn');
  const form = document.getElementById('delegationForm');
  
  const selectedGovernoratCode = localStorage.getItem('selectedGovernoratCode');
  
  // Vérifier si un gouvernorat a été sélectionné
  if (!selectedGovernoratCode || !TUNISIA_DATA.delegationsByGovernorat[selectedGovernoratCode]) {
    window.location.href = 'gouvernorat.html';
  } else {
    const delegations = TUNISIA_DATA.delegationsByGovernorat[selectedGovernoratCode] || [];
    let selectedDelegationValue = '';
    let selectedDelegationCode = '';
    
    // Remplir la liste avec les délégations
    const populateList = () => {
      if (!delegationList) return;
      delegationList.innerHTML = '';
      
      delegations.forEach(del => {
        const li = AppUtils.createElement('li', {
          className: 'governorat-item',
          'data-value': AppUtils.normalizeKey(del)
        }, del);
        delegationList.appendChild(li);
      });
    };
    
    populateList();
    
    // Fonction pour filtrer la liste
    const filterList = (searchTerm) => {
      if (!delegationList) return;
      
      const term = searchTerm.toLowerCase().trim();
      const items = delegationList.querySelectorAll('.governorat-item');
      
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    };
    
    // Fonction pour mettre à jour l'état du bouton
    const updateButtonState = () => {
      if (continueBtn) {
        const hasSelection = selectedDelegationValue.trim() !== '';
        continueBtn.disabled = !hasSelection;
        continueBtn.classList.toggle('active', hasSelection);
      }
    };
    
    // Initialiser le bouton comme désactivé
    updateButtonState();
    
    // Gestion de la recherche
    if (delegationSearch) {
      delegationSearch.addEventListener('input', (e) => {
        filterList(e.target.value);
      });
    }
    
    // Gestion du clic sur un élément de la liste
    if (delegationList) {
      delegationList.addEventListener('click', (e) => {
        const item = e.target.closest('.governorat-item');
        if (!item) return;
        
        // Retirer la sélection précédente
        delegationList.querySelectorAll('.governorat-item').forEach(li => {
          li.classList.remove('selected');
        });
        
        // Ajouter la sélection à l'élément cliqué
        item.classList.add('selected');
        
        selectedDelegationValue = item.textContent;
        selectedDelegationCode = item.getAttribute('data-value');
        
        updateButtonState();
      });
    }
    
    // Gestion du formulaire
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (continueBtn && !continueBtn.disabled && selectedDelegationValue && selectedDelegationCode) {
          localStorage.setItem('selectedDelegation', selectedDelegationValue);
          localStorage.setItem('selectedDelegationCode', selectedDelegationCode);
          window.location.href = 'ecole.html';
        }
      });
    }
    
    // Gestion du bouton Continuer
    if (continueBtn) {
      continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!continueBtn.disabled && selectedDelegationValue && selectedDelegationCode) {
          localStorage.setItem('selectedDelegation', selectedDelegationValue);
          localStorage.setItem('selectedDelegationCode', selectedDelegationCode);
          window.location.href = 'ecole.html';
        }
      });
    }
  }
}

// Page École - Liste visible des écoles
if (document.getElementById('ecoleList') && !document.getElementById('delegation')) {
  const ecoleList = document.getElementById('ecoleList');
  const ecoleSearch = document.getElementById('ecoleSearch');
  const continueBtn = document.getElementById('continueBtn');
  const form = document.getElementById('ecoleForm');
  
  const selectedDelegationCode = localStorage.getItem('selectedDelegationCode');
  
  // Vérifier si une délégation a été sélectionnée
  if (!selectedDelegationCode || !TUNISIA_DATA.ecolesByDelegation[selectedDelegationCode]) {
    window.location.href = 'delegation.html';
  } else {
    const ecoles = TUNISIA_DATA.ecolesByDelegation[selectedDelegationCode] || [];
    let selectedEcoleValue = '';
    let selectedEcoleCode = '';
    
    // Remplir la liste avec les écoles
    const populateList = () => {
      if (!ecoleList) return;
      ecoleList.innerHTML = '';
      
      ecoles.forEach(ec => {
        const li = AppUtils.createElement('li', {
          className: 'governorat-item',
          'data-value': AppUtils.normalizeKey(ec)
        }, ec);
        ecoleList.appendChild(li);
      });
    };
    
    populateList();
    
    // Fonction pour filtrer la liste
    const filterList = (searchTerm) => {
      if (!ecoleList) return;
      
      const term = searchTerm.toLowerCase().trim();
      const items = ecoleList.querySelectorAll('.governorat-item');
      
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    };
    
    // Fonction pour mettre à jour l'état du bouton
    const updateButtonState = () => {
      if (continueBtn) {
        const hasSelection = selectedEcoleValue.trim() !== '';
        continueBtn.disabled = !hasSelection;
        continueBtn.classList.toggle('active', hasSelection);
      }
    };
    
    // Initialiser le bouton comme désactivé
    updateButtonState();
    
    // Gestion de la recherche
    if (ecoleSearch) {
      ecoleSearch.addEventListener('input', (e) => {
        filterList(e.target.value);
      });
    }
    
    // Gestion du clic sur un élément de la liste
    if (ecoleList) {
      ecoleList.addEventListener('click', (e) => {
        const item = e.target.closest('.governorat-item');
        if (!item) return;
        
        // Retirer la sélection précédente
        ecoleList.querySelectorAll('.governorat-item').forEach(li => {
          li.classList.remove('selected');
        });
        
        // Ajouter la sélection à l'élément cliqué
        item.classList.add('selected');
        
        selectedEcoleValue = item.textContent;
        selectedEcoleCode = item.getAttribute('data-value');
        
        updateButtonState();
      });
    }
    
    // Gestion du formulaire
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (continueBtn && !continueBtn.disabled && selectedEcoleValue && selectedEcoleCode) {
          localStorage.setItem('selectedEcole', selectedEcoleValue);
          localStorage.setItem('selectedEcoleCode', selectedEcoleCode);
          window.location.href = ROUTES.CLASSE;
        }
      });
    }
    
    // Gestion du bouton Continuer
    if (continueBtn) {
      continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!continueBtn.disabled && selectedEcoleValue && selectedEcoleCode) {
          localStorage.setItem('selectedEcole', selectedEcoleValue);
          localStorage.setItem('selectedEcoleCode', selectedEcoleCode);
          window.location.href = ROUTES.CLASSE;
        }
      });
    }
  }
}

// ============================================
// Page Chat - Gestion des messages unidirectionnels
// ============================================
if (document.querySelector('.chat-page')) {
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');
<<<<<<< Updated upstream

  // Fonction pour ajouter un message à l'interface
  function addMessage(text) {
    if (!text.trim()) return;

    const messageItem = document.createElement('div');
    messageItem.className = 'chat-message-item sent';

    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    messageItem.innerHTML = `
      <div class="chat-message-bubble sent">
        <p class="chat-message-text">${text}</p>
        <div class="chat-message-footer">
          <span class="chat-message-time">${timeString}</span>
          <ion-icon name="checkmark-done" class="chat-message-status"></ion-icon>
        </div>
      </div>
    `;
=======
  const chatAttachBtn = document.getElementById('chatAttachBtn');
  const chatFileInput = document.getElementById('chatFileInput');
  const chatCameraBtn = document.getElementById('chatCameraBtn');
  const chatCameraInput = document.getElementById('chatCameraInput');

  // Clic sur l'icône caméra : ouvre la caméra (photo/vidéo selon appareil)
  if (chatCameraBtn && chatCameraInput) {
    chatCameraBtn.addEventListener('click', function() {
      chatCameraInput.click();
    });
    chatCameraInput.addEventListener('change', function(e) {
      var files = e.target.files;
      if (files && files.length > 0) {
        handleChatFiles(Array.from(files));
      }
      chatCameraInput.value = '';
    });
  }

  // Clic sur le bouton pièce jointe : ouvre le sélecteur de fichiers
  if (chatAttachBtn && chatFileInput) {
    chatAttachBtn.addEventListener('click', function() {
      chatFileInput.click();
    });
    chatFileInput.addEventListener('change', function(e) {
      var files = e.target.files;
      if (files && files.length > 0) {
        handleChatFiles(Array.from(files));
      }
      chatFileInput.value = '';
    });
  }

  function handleChatFiles(files) {
    if (!files.length || !chatMessages) return;
    var names = files.map(function(f) { return escapeHtml(f.name); }).join(', ');
    var label = files.length === 1 ? 'Fichier joint' : files.length + ' fichiers joints';
    var messageItem = document.createElement('div');
    messageItem.className = 'chat-message-item sent';
    var now = new Date();
    var timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    messageItem.innerHTML = '<div class="chat-message-bubble sent">' +
      '<p class="chat-message-text">' + escapeHtml(label) + ' : ' + names + '</p>' +
      '<div class="chat-message-footer">' +
      '<span class="chat-message-time">' + escapeHtml(timeString) + '</span>' +
      '<ion-icon name="checkmark-done" class="chat-message-status"></ion-icon></div></div>';
    chatMessages.appendChild(messageItem);
    setTimeout(function() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 10);
  }

  // Fonction pour ajouter un message à l'interface (texte échappé pour éviter XSS)
  function addMessage(text) {
    if (!text.trim()) return;

    var messageItem = document.createElement('div');
    messageItem.className = 'chat-message-item sent';

    var now = new Date();
    var timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    messageItem.innerHTML =
      '<div class="chat-message-bubble sent">' +
      '<p class="chat-message-text"></p>' +
      '<div class="chat-message-footer">' +
      '<span class="chat-message-time">' + escapeHtml(timeString) + '</span>' +
      '<ion-icon name="checkmark-done" class="chat-message-status"></ion-icon>' +
      '</div></div>';
    messageItem.querySelector('.chat-message-text').textContent = text;
>>>>>>> Stashed changes

    chatMessages.appendChild(messageItem);
    // Scroll vers le bas avec un léger délai pour s'assurer que le DOM est mis à jour
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 10);

    // Réinitialiser le champ de saisie
    chatInput.value = '';
    updateSendButton();
  }

  // Fonction pour mettre à jour l'état du bouton d'envoi
  function updateSendButton() {
    if (chatSendBtn && chatInput) {
      const hasText = chatInput.value.trim().length > 0;
      chatSendBtn.disabled = !hasText;
      
      if (hasText) {
        chatSendBtn.style.opacity = '1';
        chatSendBtn.style.cursor = 'pointer';
      } else {
        chatSendBtn.style.opacity = '0.5';
        chatSendBtn.style.cursor = 'not-allowed';
      }
    }
  }

  // Gestion de l'envoi de message
  if (chatSendBtn && chatInput) {
    // Clic sur le bouton d'envoi
    chatSendBtn.addEventListener('click', () => {
      const messageText = chatInput.value.trim();
      if (messageText) {
        addMessage(messageText);
      }
    });

    // Appui sur Entrée dans le champ de saisie
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const messageText = chatInput.value.trim();
        if (messageText) {
          addMessage(messageText);
        }
      }
    });

    // Mise à jour du bouton lors de la saisie
    chatInput.addEventListener('input', updateSendButton);

    // Initialisation de l'état du bouton
    updateSendButton();

    // Scroll vers le bas au chargement de la page
    if (chatMessages) {
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
    }
  }
}

// ============================================
// Gestion du menu header et déconnexion
// ============================================
if (document.getElementById('headerMenuBtn') && document.getElementById('headerDropdownMenu')) {
  const menuBtn = document.getElementById('headerMenuBtn');
  const dropdownMenu = document.getElementById('headerDropdownMenu');
  const logoutBtn = document.getElementById('logoutBtn');
<<<<<<< Updated upstream
  
  // Ouvrir/fermer le menu au clic sur le bouton
  if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
=======

  function setMenuOpen(open) {
    dropdownMenu.classList.toggle('show', open);
    dropdownMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Ouvrir/fermer le menu au clic sur le bouton
  if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      var isOpen = dropdownMenu.classList.contains('show');
      setMenuOpen(!isOpen);
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
      if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        setMenuOpen(false);
>>>>>>> Stashed changes
      }
    });
  }
  
<<<<<<< Updated upstream
  // Gestion de la déconnexion
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
=======
  // Fermer le menu au clic sur un élément du menu
  if (dropdownMenu) {
    dropdownMenu.addEventListener('click', function(e) {
      if (e.target.closest('.header-menu-item')) {
        setMenuOpen(false);
      }
    });
  }

  // Gestion de la déconnexion
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      setMenuOpen(false);
>>>>>>> Stashed changes
      // Confirmer la déconnexion
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Effacer toutes les données de session
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.TEACHER_CLASSES);
        localStorage.removeItem(STORAGE_KEYS.TEACHER_SUBSCRIBED);
        localStorage.removeItem(STORAGE_KEYS.PARENT_CLASSES);
        localStorage.removeItem(STORAGE_KEYS.PARENT_SUBSCRIBED);
        localStorage.removeItem('selectedGovernorat');
        localStorage.removeItem('selectedDelegation');
        localStorage.removeItem('selectedEcole');
        localStorage.removeItem('selectedEcoleCode');
        
        // Rediriger vers la page de choix de rôle
        window.location.href = ROUTES.CHOOSE_ROLE;
      }
    });
  }
}

// ============================================
// Page Abonnement - Affichage des abonnements
// ============================================
if (document.getElementById('subscriptionListContainer')) {
  const subscriptionListContainer = document.getElementById('subscriptionListContainer');
  const subscriptionEmptyState = document.getElementById('subscriptionEmptyState');
  const addSubscriptionBtn = document.getElementById('addSubscriptionBtn');
  
  // Récupérer le rôle de l'utilisateur
  const userRole = AppUtils.getUserRole();
  
  // Déterminer les clés de stockage selon le rôle
  const classesKey = userRole === 'parent' ? STORAGE_KEYS.PARENT_CLASSES : STORAGE_KEYS.TEACHER_CLASSES;
  const subscribedKey = userRole === 'parent' ? STORAGE_KEYS.PARENT_SUBSCRIBED : STORAGE_KEYS.TEACHER_SUBSCRIBED;
  
  // Récupérer les classes abonnées
  const isSubscribed = localStorage.getItem(subscribedKey) === 'true';
  const subscribedClasses = JSON.parse(localStorage.getItem(classesKey) || '[]');
  
  // Fonction pour afficher les abonnements
  function renderSubscriptions(classes) {
    if (!subscriptionListContainer) return;
    
    subscriptionListContainer.innerHTML = '';
    
    if (!isSubscribed || classes.length === 0) {
      // Afficher l'état vide
      if (subscriptionEmptyState) {
        subscriptionEmptyState.style.display = 'flex';
      }
      return;
    }
    
    // Masquer l'état vide
    if (subscriptionEmptyState) {
      subscriptionEmptyState.style.display = 'none';
    }
    
    // Grouper les classes par école
    const classesByEcole = {};
    classes.forEach((classe) => {
      const ecoleKey = classe.ecole || 'École inconnue';
      if (!classesByEcole[ecoleKey]) {
        classesByEcole[ecoleKey] = {
          ecole: ecoleKey,
          governorat: classe.governorat || '',
          delegation: classe.delegation || '',
          classes: []
        };
      }
      classesByEcole[ecoleKey].classes.push(classe);
    });
    
    // Créer les cartes d'abonnement avec animation
    Object.keys(classesByEcole).forEach((ecoleName, index) => {
      const ecoleData = classesByEcole[ecoleName];
      
      // Carte principale de l'école
      const ecoleCard = document.createElement('div');
      ecoleCard.className = 'subscription-card';
      ecoleCard.style.opacity = '0';
      ecoleCard.style.animationDelay = `${index * 0.1}s`;
      
      const firstClasse = ecoleData.classes[0];
      const avatarText = `${firstClasse.classe}${firstClasse.lettre}`;
      
      // Construire la localisation
      const locationParts = [];
      if (ecoleData.delegation) locationParts.push(ecoleData.delegation);
      if (ecoleData.governorat) locationParts.push(ecoleData.governorat);
      const locationText = locationParts.join(', ');
      
      ecoleCard.innerHTML = `
        <div class="subscription-card-header">
          <div class="subscription-avatar">
            <div class="subscription-avatar-placeholder">${avatarText}</div>
          </div>
          <div class="subscription-card-info">
            <h3 class="subscription-card-title">${ecoleName}</h3>
            ${locationText ? `<p class="subscription-card-location">${locationText}</p>` : ''}
          </div>
          <button class="subscription-card-menu" aria-label="Options">
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </button>
        </div>
        <div class="subscription-card-body">
          <div class="subscription-classes-list">
            ${ecoleData.classes.map(classe => `
              <div class="subscription-class-item">
                <div class="subscription-class-info">
                  <ion-icon name="school-outline" class="subscription-class-icon"></ion-icon>
                  <span class="subscription-class-name">${classe.classe}ème Année ${classe.lettre}</span>
                </div>
                <div class="subscription-class-status">
                  <span class="subscription-status-badge active">Actif</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="subscription-card-footer">
          <div class="subscription-card-stats">
            <span class="subscription-stat">
              <ion-icon name="calendar-outline"></ion-icon>
              <span>Abonné depuis</span>
            </span>
            <span class="subscription-date">Aujourd'hui</span>
          </div>
        </div>
      `;
      
      subscriptionListContainer.appendChild(ecoleCard);
      
      // Animation d'apparition
      setTimeout(() => {
        ecoleCard.style.opacity = '1';
      }, index * 100);
    });
  }
  
  // Afficher les abonnements au chargement
  renderSubscriptions(subscribedClasses);
  
  // Gérer le bouton d'ajout d'abonnement
  if (addSubscriptionBtn) {
    addSubscriptionBtn.addEventListener('click', () => {
      window.location.href = ROUTES.GOUVERNORAT;
    });
  }
<<<<<<< Updated upstream
=======
}

// ============================================
// Page Assistant IA - Chat ChatGPT
// ============================================
if (document.getElementById('aiChatMessages')) {
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiChatSendBtn = document.getElementById('aiChatSendBtn');
  const aiWelcomeMessage = document.querySelector('.ai-welcome-message');
  const aiChatFileInput = document.getElementById('aiChatFileInput');
  const aiChatFilesPreview = document.getElementById('aiChatFilesPreview');
  
  // Tableau pour stocker les fichiers sélectionnés
  let selectedFiles = [];
  
  // Réponses prédéfinies de l'IA (simulation)
  const aiResponses = [
    "Je comprends votre question. Voici une réponse détaillée...",
    "C'est une excellente question ! Laissez-moi vous expliquer...",
    "Je peux vous aider avec cela. Voici ce que je recommande...",
    "Merci pour votre question. Voici quelques informations utiles...",
    "Je suis là pour vous aider. Voici ce que vous devez savoir..."
  ];
  
  // Fonction pour générer une réponse IA simulée
  function generateAIResponse(userMessage) {
    // Simulation d'une réponse basée sur des mots-clés
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('devoir') || lowerMessage.includes('devoirs')) {
      return "Pour les devoirs, je recommande de créer un planning régulier et de réviser quotidiennement. N'hésitez pas à demander de l'aide à votre enseignant si nécessaire.";
    }
    
    if (lowerMessage.includes('classe') || lowerMessage.includes('classes')) {
      return "Les classes sont organisées par niveau et section. Vous pouvez consulter vos classes abonnées dans la section 'Mes classes' de votre profil.";
    }
    
    if (lowerMessage.includes('abonnement') || lowerMessage.includes('abonner')) {
      return "Pour vous abonner à une classe, allez dans la section 'Abonnement' et suivez les étapes : choisissez votre gouvernorat, délégation, école et classe.";
    }
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return "Bonjour ! Je suis ravi de vous aider. Comment puis-je vous assister aujourd'hui ?";
    }
    
    // Réponse par défaut
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }
  
  // Fonction pour ajouter un message utilisateur
  function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message user';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    avatar.textContent = 'Vous';
    
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    
    const messageText = document.createElement('p');
    messageText.className = 'ai-message-text';
    messageText.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'ai-message-time';
    time.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    bubble.appendChild(messageText);
    bubble.appendChild(time);
    content.appendChild(bubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    aiChatMessages.appendChild(messageDiv);
    
    // Masquer le message de bienvenue après le premier message
    if (aiWelcomeMessage) {
      aiWelcomeMessage.style.display = 'none';
    }
    
    scrollToBottom();
  }
  
  // Fonction pour ajouter un message de l'IA
  function addAIMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message assistant';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'sparkles-outline');
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    
    const messageText = document.createElement('p');
    messageText.className = 'ai-message-text';
    messageText.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'ai-message-time';
    time.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    bubble.appendChild(messageText);
    bubble.appendChild(time);
    content.appendChild(bubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    aiChatMessages.appendChild(messageDiv);
    
    scrollToBottom();
  }
  
  // Fonction pour afficher l'indicateur de frappe
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message assistant';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'sparkles-outline');
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-typing-indicator';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'ai-typing-dot';
      typingIndicator.appendChild(dot);
    }
    
    bubble.appendChild(typingIndicator);
    content.appendChild(bubble);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    aiChatMessages.appendChild(typingDiv);
    scrollToBottom();
  }
  
  // Fonction pour supprimer l'indicateur de frappe
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Fonction pour faire défiler vers le bas
  function scrollToBottom() {
    setTimeout(() => {
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }, 100);
  }
  
  // Fonction pour ajuster la hauteur du textarea
  function adjustTextareaHeight() {
    if (aiChatInput) {
      aiChatInput.style.height = 'auto';
      aiChatInput.style.height = Math.min(aiChatInput.scrollHeight, 120) + 'px';
    }
  }
  
  // Fonction pour formater la taille du fichier
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  // Fonction pour afficher les fichiers sélectionnés
  function displaySelectedFiles() {
    if (!aiChatFilesPreview) return;
    
    if (selectedFiles.length === 0) {
      aiChatFilesPreview.style.display = 'none';
      return;
    }
    
    aiChatFilesPreview.style.display = 'flex';
    aiChatFilesPreview.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'ai-chat-file-item';
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        fileItem.appendChild(img);
      } else {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', 'document-outline');
        icon.style.fontSize = '20px';
        icon.style.color = '#002FBD';
        fileItem.appendChild(icon);
      }
      
      const fileInfo = document.createElement('div');
      fileInfo.className = 'ai-chat-file-item-info';
      
      const fileName = document.createElement('div');
      fileName.className = 'ai-chat-file-item-name';
      fileName.textContent = file.name;
      
      const fileSize = document.createElement('div');
      fileSize.className = 'ai-chat-file-item-size';
      fileSize.textContent = formatFileSize(file.size);
      
      fileInfo.appendChild(fileName);
      fileInfo.appendChild(fileSize);
      fileItem.appendChild(fileInfo);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'ai-chat-file-item-remove';
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Supprimer le fichier');
      const removeIcon = document.createElement('ion-icon');
      removeIcon.setAttribute('name', 'close-outline');
      removeBtn.appendChild(removeIcon);
      
      removeBtn.addEventListener('click', () => {
        selectedFiles.splice(index, 1);
        displaySelectedFiles();
        if (aiChatFileInput) {
          aiChatFileInput.value = '';
        }
      });
      
      fileItem.appendChild(removeBtn);
      aiChatFilesPreview.appendChild(fileItem);
    });
  }
  
  // Gestion de la sélection de fichiers
  if (aiChatFileInput) {
    aiChatFileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      
      // Ajouter les nouveaux fichiers à la liste
      files.forEach(file => {
        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`Le fichier "${file.name}" est trop volumineux. Taille maximale : 10MB`);
          return;
        }
        
        // Vérifier si le fichier n'est pas déjà dans la liste
        if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
          selectedFiles.push(file);
        }
      });
      
      displaySelectedFiles();
      
      // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
      e.target.value = '';
    });
  }
  
  // Gestion de la soumission du formulaire
  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const message = aiChatInput.value.trim();
      
      // Vérifier qu'il y a au moins un message ou un fichier
      if (!message && selectedFiles.length === 0) return;
      
      // Construire le message avec les fichiers
      let fullMessage = message;
      if (selectedFiles.length > 0) {
        const fileNames = selectedFiles.map(f => f.name).join(', ');
        fullMessage = message 
          ? `${message}\n\n📎 Fichiers joints: ${fileNames}`
          : `📎 Fichiers joints: ${fileNames}`;
      }
      
      // Ajouter le message de l'utilisateur
      addUserMessage(fullMessage);
      
      // Vider le champ de saisie et les fichiers
      aiChatInput.value = '';
      selectedFiles = [];
      displaySelectedFiles();
      adjustTextareaHeight();
      
      // Désactiver le bouton d'envoi
      if (aiChatSendBtn) {
        aiChatSendBtn.disabled = true;
      }
      
      // Afficher l'indicateur de frappe
      showTypingIndicator();
      
      // Simuler une réponse de l'IA après un délai
      setTimeout(() => {
        removeTypingIndicator();
        const aiResponse = generateAIResponse(message || 'fichier');
        addAIMessage(aiResponse);
        
        // Réactiver le bouton d'envoi
        if (aiChatSendBtn) {
          aiChatSendBtn.disabled = false;
        }
      }, 1500 + Math.random() * 1000); // Délai aléatoire entre 1.5s et 2.5s
    });
  }
  
  // Ajuster la hauteur du textarea lors de la saisie
  if (aiChatInput) {
    aiChatInput.addEventListener('input', adjustTextareaHeight);
    
    // Gérer l'ajustement de la hauteur au chargement
    adjustTextareaHeight();
  }
  
  // Gestion du menu header pour l'assistant IA
  const aiHeaderMenuBtn = document.getElementById('aiHeaderMenuBtn');
  const aiHeaderDropdownMenu = document.getElementById('aiHeaderDropdownMenu');
  const aiLogoutBtn = document.getElementById('aiLogoutBtn');
  
  if (aiHeaderMenuBtn && aiHeaderDropdownMenu) {
    aiHeaderMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = aiHeaderDropdownMenu.classList.contains('show');
      
      // Fermer tous les autres menus
      document.querySelectorAll('.header-dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      
      if (!isOpen) {
        aiHeaderDropdownMenu.classList.add('show');
      }
    });
  }
  
  // Fermer le menu en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (aiHeaderDropdownMenu && !aiHeaderDropdownMenu.contains(e.target) && 
        aiHeaderMenuBtn && !aiHeaderMenuBtn.contains(e.target)) {
      aiHeaderDropdownMenu.classList.remove('show');
    }
  });
  
  // Gestion de la déconnexion
  if (aiLogoutBtn) {
    aiLogoutBtn.addEventListener('click', () => {
      // Nettoyer le localStorage
      Object.keys(localStorage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Rediriger vers la page de choix de rôle
      window.location.href = ROUTES.CHOOSE_ROLE;
    });
  }
}

// ============================================
// Page Notifications - Interface Facebook
// ============================================
if (document.getElementById('notificationListContainer')) {
  const notificationListContainer = document.getElementById('notificationListContainer');
  const notificationEmptyState = document.getElementById('notificationEmptyState');
  
  // Données de notifications (simulation)
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'Nouveau message',
      text: 'Vous avez reçu un nouveau message de la classe 6ème Année A',
      time: 'Il y a 5 minutes',
      unread: true,
      icon: 'chatbubble-outline',
      avatar: null
    },
    {
      id: 2,
      type: 'assignment',
      title: 'Nouveau devoir',
      text: 'Un nouveau devoir a été publié pour la classe 4ème Année ب',
      time: 'Il y a 1 heure',
      unread: true,
      icon: 'document-text-outline',
      avatar: null
    },
    {
      id: 3,
      type: 'event',
      title: 'Événement à venir',
      text: 'Réunion parents-professeurs prévue le 15 mars à 15h',
      time: 'Hier',
      unread: false,
      icon: 'calendar-outline',
      avatar: null
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Annonce importante',
      text: 'Sortie scolaire prévue le 20 mars - Autorisation requise',
      time: 'Il y a 2 jours',
      unread: false,
      icon: 'megaphone-outline',
      avatar: null
    },
    {
      id: 5,
      type: 'grade',
      title: 'Nouvelle note',
      text: 'Une nouvelle note a été ajoutée pour le contrôle de mathématiques',
      time: 'Il y a 3 jours',
      unread: false,
      icon: 'school-outline',
      avatar: null
    }
  ];
  
  // Fonction pour formater le temps relatif
  function formatRelativeTime(timeString) {
    return timeString;
  }
  
  // Fonction pour obtenir l'icône selon le type
  function getNotificationIcon(type) {
    const icons = {
      'message': 'chatbubble-outline',
      'assignment': 'document-text-outline',
      'event': 'calendar-outline',
      'announcement': 'megaphone-outline',
      'grade': 'school-outline',
      'default': 'notifications-outline'
    };
    return icons[type] || icons.default;
  }
  
  // Fonction pour obtenir la couleur de l'icône
  function getNotificationIconColor(type) {
    const colors = {
      'message': '#1877f2',
      'assignment': '#42b883',
      'event': '#f39c12',
      'announcement': '#e74c3c',
      'grade': '#9b59b6',
      'default': '#65676b'
    };
    return colors[type] || colors.default;
  }
  
  // Fonction pour rendre les notifications
  function renderNotifications(notificationsList) {
    if (!notificationListContainer) return;
    
    notificationListContainer.innerHTML = '';
    
    if (!notificationsList || notificationsList.length === 0) {
      if (notificationEmptyState) {
        notificationEmptyState.style.display = 'flex';
      }
      return;
    }
    
    if (notificationEmptyState) {
      notificationEmptyState.style.display = 'none';
    }
    
    notificationsList.forEach((notification, index) => {
      const notificationCard = document.createElement('div');
      notificationCard.className = `notification-card ${notification.unread ? 'unread' : ''}`;
      notificationCard.style.animationDelay = `${index * 0.05}s`;
      
      const iconName = getNotificationIcon(notification.type);
      const iconColor = getNotificationIconColor(notification.type);
      
      notificationCard.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon-wrapper" style="background-color: ${iconColor}20;">
            <ion-icon name="${iconName}" style="color: ${iconColor};"></ion-icon>
          </div>
          <div class="notification-info">
            <p class="notification-text">
              <strong>${notification.title}</strong><br>
              ${notification.text}
            </p>
            <div class="notification-time">
              <ion-icon name="time-outline"></ion-icon>
              <span>${formatRelativeTime(notification.time)}</span>
            </div>
            ${notification.unread ? '<div class="notification-actions"><button class="notification-action-btn primary" type="button"><ion-icon name="checkmark-outline"></ion-icon><span>Marquer comme lu</span></button></div>' : ''}
          </div>
          ${notification.unread ? '<div class="notification-badge"></div>' : ''}
        </div>
      `;
      
      // Gérer le clic sur la carte
      const content = notificationCard.querySelector('.notification-content');
      content.addEventListener('click', () => {
        // Marquer comme lu
        if (notification.unread) {
          notification.unread = false;
          renderNotifications(notificationsList);
        }
      });
      
      // Gérer le bouton "Marquer comme lu"
      const markReadBtn = notificationCard.querySelector('.notification-action-btn');
      if (markReadBtn) {
        markReadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          notification.unread = false;
          renderNotifications(notificationsList);
        });
      }
      
      notificationListContainer.appendChild(notificationCard);
    });
  }
  
  // Afficher les notifications au chargement
  renderNotifications(notifications);
  
  // Gestion du menu header pour les notifications
  const notificationHeaderMenuBtn = document.getElementById('notificationHeaderMenuBtn');
  const notificationHeaderDropdownMenu = document.getElementById('notificationHeaderDropdownMenu');
  const notificationLogoutBtn = document.getElementById('notificationLogoutBtn');
  
  if (notificationHeaderMenuBtn && notificationHeaderDropdownMenu) {
    notificationHeaderMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notificationHeaderDropdownMenu.classList.contains('show');
      
      // Fermer tous les autres menus
      document.querySelectorAll('.header-dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      
      if (!isOpen) {
        notificationHeaderDropdownMenu.classList.add('show');
      }
    });
  }
  
  // Fermer le menu en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (notificationHeaderDropdownMenu && !notificationHeaderDropdownMenu.contains(e.target) && 
        notificationHeaderMenuBtn && !notificationHeaderMenuBtn.contains(e.target)) {
      notificationHeaderDropdownMenu.classList.remove('show');
    }
  });
  
  // Gestion de la déconnexion
  if (notificationLogoutBtn) {
    notificationLogoutBtn.addEventListener('click', () => {
      // Nettoyer le localStorage
      Object.keys(localStorage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Rediriger vers la page de choix de rôle
      window.location.href = ROUTES.CHOOSE_ROLE;
    });
  }
>>>>>>> Stashed changes
}

// ============================================
// Page Assistant IA - Chat ChatGPT
// ============================================
if (document.getElementById('aiChatMessages')) {
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiChatSendBtn = document.getElementById('aiChatSendBtn');
  const aiWelcomeMessage = document.querySelector('.ai-welcome-message');
  const aiChatFileInput = document.getElementById('aiChatFileInput');
  const aiChatFilesPreview = document.getElementById('aiChatFilesPreview');
  
  // Tableau pour stocker les fichiers sélectionnés
  let selectedFiles = [];
  
  // Réponses prédéfinies de l'IA (simulation)
  const aiResponses = [
    "Je comprends votre question. Voici une réponse détaillée...",
    "C'est une excellente question ! Laissez-moi vous expliquer...",
    "Je peux vous aider avec cela. Voici ce que je recommande...",
    "Merci pour votre question. Voici quelques informations utiles...",
    "Je suis là pour vous aider. Voici ce que vous devez savoir..."
  ];
  
  // Fonction pour générer une réponse IA simulée
  function generateAIResponse(userMessage) {
    // Simulation d'une réponse basée sur des mots-clés
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('devoir') || lowerMessage.includes('devoirs')) {
      return "Pour les devoirs, je recommande de créer un planning régulier et de réviser quotidiennement. N'hésitez pas à demander de l'aide à votre enseignant si nécessaire.";
    }
    
    if (lowerMessage.includes('classe') || lowerMessage.includes('classes')) {
      return "Les classes sont organisées par niveau et section. Vous pouvez consulter vos classes abonnées dans la section 'Mes classes' de votre profil.";
    }
    
    if (lowerMessage.includes('abonnement') || lowerMessage.includes('abonner')) {
      return "Pour vous abonner à une classe, allez dans la section 'Abonnement' et suivez les étapes : choisissez votre gouvernorat, délégation, école et classe.";
    }
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return "Bonjour ! Je suis ravi de vous aider. Comment puis-je vous assister aujourd'hui ?";
    }
    
    // Réponse par défaut
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }
  
  // Fonction pour ajouter un message utilisateur
  function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message user';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    avatar.textContent = 'Vous';
    
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    
    const messageText = document.createElement('p');
    messageText.className = 'ai-message-text';
    messageText.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'ai-message-time';
    time.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    bubble.appendChild(messageText);
    bubble.appendChild(time);
    content.appendChild(bubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    aiChatMessages.appendChild(messageDiv);
    
    // Masquer le message de bienvenue après le premier message
    if (aiWelcomeMessage) {
      aiWelcomeMessage.style.display = 'none';
    }
    
    scrollToBottom();
  }
  
  // Fonction pour ajouter un message de l'IA
  function addAIMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message assistant';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'sparkles-outline');
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    
    const messageText = document.createElement('p');
    messageText.className = 'ai-message-text';
    messageText.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'ai-message-time';
    time.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    bubble.appendChild(messageText);
    bubble.appendChild(time);
    content.appendChild(bubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    aiChatMessages.appendChild(messageDiv);
    
    scrollToBottom();
  }
  
  // Fonction pour afficher l'indicateur de frappe
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message assistant';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'sparkles-outline');
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'ai-message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-message-bubble';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-typing-indicator';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'ai-typing-dot';
      typingIndicator.appendChild(dot);
    }
    
    bubble.appendChild(typingIndicator);
    content.appendChild(bubble);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    aiChatMessages.appendChild(typingDiv);
    scrollToBottom();
  }
  
  // Fonction pour supprimer l'indicateur de frappe
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Fonction pour faire défiler vers le bas
  function scrollToBottom() {
    setTimeout(() => {
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }, 100);
  }
  
  // Fonction pour ajuster la hauteur du textarea
  function adjustTextareaHeight() {
    if (aiChatInput) {
      aiChatInput.style.height = 'auto';
      aiChatInput.style.height = Math.min(aiChatInput.scrollHeight, 120) + 'px';
    }
  }
  
  // Fonction pour formater la taille du fichier
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  // Fonction pour afficher les fichiers sélectionnés
  function displaySelectedFiles() {
    if (!aiChatFilesPreview) return;
    
    if (selectedFiles.length === 0) {
      aiChatFilesPreview.style.display = 'none';
      return;
    }
    
    aiChatFilesPreview.style.display = 'flex';
    aiChatFilesPreview.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'ai-chat-file-item';
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        fileItem.appendChild(img);
      } else {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', 'document-outline');
        icon.style.fontSize = '20px';
        icon.style.color = '#002FBD';
        fileItem.appendChild(icon);
      }
      
      const fileInfo = document.createElement('div');
      fileInfo.className = 'ai-chat-file-item-info';
      
      const fileName = document.createElement('div');
      fileName.className = 'ai-chat-file-item-name';
      fileName.textContent = file.name;
      
      const fileSize = document.createElement('div');
      fileSize.className = 'ai-chat-file-item-size';
      fileSize.textContent = formatFileSize(file.size);
      
      fileInfo.appendChild(fileName);
      fileInfo.appendChild(fileSize);
      fileItem.appendChild(fileInfo);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'ai-chat-file-item-remove';
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Supprimer le fichier');
      const removeIcon = document.createElement('ion-icon');
      removeIcon.setAttribute('name', 'close-outline');
      removeBtn.appendChild(removeIcon);
      
      removeBtn.addEventListener('click', () => {
        selectedFiles.splice(index, 1);
        displaySelectedFiles();
        if (aiChatFileInput) {
          aiChatFileInput.value = '';
        }
      });
      
      fileItem.appendChild(removeBtn);
      aiChatFilesPreview.appendChild(fileItem);
    });
  }
  
  // Gestion de la sélection de fichiers
  if (aiChatFileInput) {
    aiChatFileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      
      // Ajouter les nouveaux fichiers à la liste
      files.forEach(file => {
        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`Le fichier "${file.name}" est trop volumineux. Taille maximale : 10MB`);
          return;
        }
        
        // Vérifier si le fichier n'est pas déjà dans la liste
        if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
          selectedFiles.push(file);
        }
      });
      
      displaySelectedFiles();
      
      // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
      e.target.value = '';
    });
  }
  
  // Gestion de la soumission du formulaire
  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const message = aiChatInput.value.trim();
      
      // Vérifier qu'il y a au moins un message ou un fichier
      if (!message && selectedFiles.length === 0) return;
      
      // Construire le message avec les fichiers
      let fullMessage = message;
      if (selectedFiles.length > 0) {
        const fileNames = selectedFiles.map(f => f.name).join(', ');
        fullMessage = message 
          ? `${message}\n\n📎 Fichiers joints: ${fileNames}`
          : `📎 Fichiers joints: ${fileNames}`;
      }
      
      // Ajouter le message de l'utilisateur
      addUserMessage(fullMessage);
      
      // Vider le champ de saisie et les fichiers
      aiChatInput.value = '';
      selectedFiles = [];
      displaySelectedFiles();
      adjustTextareaHeight();
      
      // Désactiver le bouton d'envoi
      if (aiChatSendBtn) {
        aiChatSendBtn.disabled = true;
      }
      
      // Afficher l'indicateur de frappe
      showTypingIndicator();
      
      // Simuler une réponse de l'IA après un délai
      setTimeout(() => {
        removeTypingIndicator();
        const aiResponse = generateAIResponse(message || 'fichier');
        addAIMessage(aiResponse);
        
        // Réactiver le bouton d'envoi
        if (aiChatSendBtn) {
          aiChatSendBtn.disabled = false;
        }
      }, 1500 + Math.random() * 1000); // Délai aléatoire entre 1.5s et 2.5s
    });
  }
  
  // Ajuster la hauteur du textarea lors de la saisie
  if (aiChatInput) {
    aiChatInput.addEventListener('input', adjustTextareaHeight);
    
    // Gérer l'ajustement de la hauteur au chargement
    adjustTextareaHeight();
  }
  
  // Gestion du menu header pour l'assistant IA
  const aiHeaderMenuBtn = document.getElementById('aiHeaderMenuBtn');
  const aiHeaderDropdownMenu = document.getElementById('aiHeaderDropdownMenu');
  const aiLogoutBtn = document.getElementById('aiLogoutBtn');
  
  if (aiHeaderMenuBtn && aiHeaderDropdownMenu) {
    aiHeaderMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = aiHeaderDropdownMenu.classList.contains('show');
      
      // Fermer tous les autres menus
      document.querySelectorAll('.header-dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      
      if (!isOpen) {
        aiHeaderDropdownMenu.classList.add('show');
      }
    });
  }
  
  // Fermer le menu en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (aiHeaderDropdownMenu && !aiHeaderDropdownMenu.contains(e.target) && 
        aiHeaderMenuBtn && !aiHeaderMenuBtn.contains(e.target)) {
      aiHeaderDropdownMenu.classList.remove('show');
    }
  });
  
  // Gestion de la déconnexion
  if (aiLogoutBtn) {
    aiLogoutBtn.addEventListener('click', () => {
      // Nettoyer le localStorage
      Object.keys(localStorage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Rediriger vers la page de choix de rôle
      window.location.href = ROUTES.CHOOSE_ROLE;
    });
  }
}

// ============================================
// Page Notifications - Interface Facebook
// ============================================
if (document.getElementById('notificationListContainer')) {
  const notificationListContainer = document.getElementById('notificationListContainer');
  const notificationEmptyState = document.getElementById('notificationEmptyState');
  
  // Données de notifications (simulation)
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'Nouveau message',
      text: 'Vous avez reçu un nouveau message de la classe 6ème Année A',
      time: 'Il y a 5 minutes',
      unread: true,
      icon: 'chatbubble-outline',
      avatar: null
    },
    {
      id: 2,
      type: 'assignment',
      title: 'Nouveau devoir',
      text: 'Un nouveau devoir a été publié pour la classe 4ème Année ب',
      time: 'Il y a 1 heure',
      unread: true,
      icon: 'document-text-outline',
      avatar: null
    },
    {
      id: 3,
      type: 'event',
      title: 'Événement à venir',
      text: 'Réunion parents-professeurs prévue le 15 mars à 15h',
      time: 'Hier',
      unread: false,
      icon: 'calendar-outline',
      avatar: null
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Annonce importante',
      text: 'Sortie scolaire prévue le 20 mars - Autorisation requise',
      time: 'Il y a 2 jours',
      unread: false,
      icon: 'megaphone-outline',
      avatar: null
    },
    {
      id: 5,
      type: 'grade',
      title: 'Nouvelle note',
      text: 'Une nouvelle note a été ajoutée pour le contrôle de mathématiques',
      time: 'Il y a 3 jours',
      unread: false,
      icon: 'school-outline',
      avatar: null
    }
  ];
  
  // Fonction pour formater le temps relatif
  function formatRelativeTime(timeString) {
    return timeString;
  }
  
  // Fonction pour obtenir l'icône selon le type
  function getNotificationIcon(type) {
    const icons = {
      'message': 'chatbubble-outline',
      'assignment': 'document-text-outline',
      'event': 'calendar-outline',
      'announcement': 'megaphone-outline',
      'grade': 'school-outline',
      'default': 'notifications-outline'
    };
    return icons[type] || icons.default;
  }
  
  // Fonction pour obtenir la couleur de l'icône
  function getNotificationIconColor(type) {
    const colors = {
      'message': '#1877f2',
      'assignment': '#42b883',
      'event': '#f39c12',
      'announcement': '#e74c3c',
      'grade': '#9b59b6',
      'default': '#65676b'
    };
    return colors[type] || colors.default;
  }
  
  // Fonction pour rendre les notifications
  function renderNotifications(notificationsList) {
    if (!notificationListContainer) return;
    
    notificationListContainer.innerHTML = '';
    
    if (!notificationsList || notificationsList.length === 0) {
      if (notificationEmptyState) {
        notificationEmptyState.style.display = 'flex';
      }
      return;
    }
    
    if (notificationEmptyState) {
      notificationEmptyState.style.display = 'none';
    }
    
    notificationsList.forEach((notification, index) => {
      const notificationCard = document.createElement('div');
      notificationCard.className = `notification-card ${notification.unread ? 'unread' : ''}`;
      notificationCard.style.animationDelay = `${index * 0.05}s`;
      
      const iconName = getNotificationIcon(notification.type);
      const iconColor = getNotificationIconColor(notification.type);
      
      notificationCard.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon-wrapper" style="background-color: ${iconColor}20;">
            <ion-icon name="${iconName}" style="color: ${iconColor};"></ion-icon>
          </div>
          <div class="notification-info">
            <p class="notification-text">
              <strong>${notification.title}</strong><br>
              ${notification.text}
            </p>
            <div class="notification-time">
              <ion-icon name="time-outline"></ion-icon>
              <span>${formatRelativeTime(notification.time)}</span>
            </div>
            ${notification.unread ? '<div class="notification-actions"><button class="notification-action-btn primary" type="button"><ion-icon name="checkmark-outline"></ion-icon><span>Marquer comme lu</span></button></div>' : ''}
          </div>
          ${notification.unread ? '<div class="notification-badge"></div>' : ''}
        </div>
      `;
      
      // Gérer le clic sur la carte
      const content = notificationCard.querySelector('.notification-content');
      content.addEventListener('click', () => {
        // Marquer comme lu
        if (notification.unread) {
          notification.unread = false;
          renderNotifications(notificationsList);
        }
      });
      
      // Gérer le bouton "Marquer comme lu"
      const markReadBtn = notificationCard.querySelector('.notification-action-btn');
      if (markReadBtn) {
        markReadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          notification.unread = false;
          renderNotifications(notificationsList);
        });
      }
      
      notificationListContainer.appendChild(notificationCard);
    });
  }
  
  // Afficher les notifications au chargement
  renderNotifications(notifications);
  
  // Gestion du menu header pour les notifications
  const notificationHeaderMenuBtn = document.getElementById('notificationHeaderMenuBtn');
  const notificationHeaderDropdownMenu = document.getElementById('notificationHeaderDropdownMenu');
  const notificationLogoutBtn = document.getElementById('notificationLogoutBtn');
  
  if (notificationHeaderMenuBtn && notificationHeaderDropdownMenu) {
    notificationHeaderMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notificationHeaderDropdownMenu.classList.contains('show');
      
      // Fermer tous les autres menus
      document.querySelectorAll('.header-dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      
      if (!isOpen) {
        notificationHeaderDropdownMenu.classList.add('show');
      }
    });
  }
  
  // Fermer le menu en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (notificationHeaderDropdownMenu && !notificationHeaderDropdownMenu.contains(e.target) && 
        notificationHeaderMenuBtn && !notificationHeaderMenuBtn.contains(e.target)) {
      notificationHeaderDropdownMenu.classList.remove('show');
    }
  });
  
  // Gestion de la déconnexion
  if (notificationLogoutBtn) {
    notificationLogoutBtn.addEventListener('click', () => {
      // Nettoyer le localStorage
      Object.keys(localStorage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Rediriger vers la page de choix de rôle
      window.location.href = ROUTES.CHOOSE_ROLE;
    });
  }
}
