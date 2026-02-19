/**
 * Droussi - Français et Arabe côte à côte sur toutes les pages
 * Affiche pour chaque texte : Français · العربية
 */
(function (global) {
  'use strict';

  var SEP = '\n'; /* pour placeholder/title/aria : séparateur ligne */

  var messages = {
    fr: {
      menuHome: 'Accueil',
      menuMyClasses: 'Mes classes',
      menuMyHomework: 'Mes devoirs',
      menuVerification: 'Vérification',
      verificationTitle: 'Vérification du compte enseignant',
      verificationText: 'Ouvrez la caméra et scannez le QR code fourni par l\'école.',
      verificationStatusRequesting: 'Demande d\'accès à la caméra…',
      verificationStatusFrame: 'Cadrez le QR code dans le cadre.',
      verificationStatusSuccess: 'Compte vérifié ! Redirection…',
      verificationStatusNoCamera: 'La caméra n\'est pas disponible. Utilisez le bouton ci-dessous si votre compte a déjà été vérifié.',
      verificationStatusDenied: 'Accès à la caméra refusé. Utilisez le bouton ci-dessous si votre compte a déjà été vérifié.',
      verificationManualBtn: 'Mon compte a déjà été vérifié',
      menuAssistantIA: 'Assistant IA',
      menuAddSubscription: 'Ajouter un abonnement',
      notifications: 'Notifications',
      settings: 'Paramètres',
      subscriptionWelcome: 'Bienvenue sur Droussi',
      subscriptionText: "Bienvenue sur Droussi ! Pour commencer à utiliser toutes les fonctionnalités, veuillez vous s'abonner",
      subscribe: "S'abonner",
      subscribeClasses: "S'abonner aux classes",
      subscriptionTextTeacher: 'Bienvenue sur Droussi ! Pour commencer à utiliser toutes les fonctionnalités, veuillez vous abonner à une ou plusieurs écoles et choisir vos classes dans chaque école.',
      titleMyClasses: 'Mes classes',
      titleMyHomework: 'Mes devoirs',
      titleNotifications: 'Notifications',
      titleAssistantIA: 'Assistant IA',
      titleParams: 'Paramètres',
      titleGovernorat: 'Gouvernorats',
      titleDelegation: 'Délégations',
      titleSchool: 'Écoles primaires',
      titleChooseClass: 'Choix des classes',
      account: 'Compte',
      privacy: 'Confidentialité',
      about: 'À propos',
      logout: 'Déconnexion',
      back: 'Retour',
      close: 'Fermer',
      installAppText: "Utilisez l'application sur votre téléphone",
      roleParent: 'Continuer en tant que parent',
      roleTeacher: "Continuer en tant qu'enseignant(e)",
      legalConditions: "Conditions d'utilisation",
      noSubscription: 'Aucun abonnement',
      noSubscriptionText: "Vous n'avez pas encore d'abonnement actif.",
      subscribeNow: "S'abonner",
      noNotifications: 'Aucune notification',
      noNotificationsText: "Vous n'avez pas encore de notifications.",
      aiWelcome: 'Bonjour ! Je suis votre Assistant IA',
      aiWelcomeText: "Je suis là pour vous aider avec vos questions sur l'éducation, les classes, les devoirs et bien plus encore. Posez-moi une question !",
      aiPlaceholder: 'Tapez votre message...',
      onlineRestored: 'Connexion internet rétablie',
      offlineMessage: 'Pas de connexion internet',
      /* Gouvernorats */
      gov_tunis: 'Tunis',
      gov_ariana: 'Ariana',
      gov_ben_arous: 'Ben Arous',
      gov_manouba: 'Manouba',
      gov_nabeul: 'Nabeul',
      gov_zaghouan: 'Zaghouan',
      gov_bizerte: 'Bizerte',
      gov_beja: 'Béja',
      gov_jendouba: 'Jendouba',
      gov_kef: 'Le Kef',
      gov_siliana: 'Siliana',
      gov_kairouan: 'Kairouan',
      gov_kasserine: 'Kasserine',
      gov_sidi_bouzid: 'Sidi Bouzid',
      gov_sfax: 'Sfax',
      gov_mahdia: 'Mahdia',
      gov_monastir: 'Monastir',
      gov_sousse: 'Sousse',
      gov_kebili: 'Kébili',
      gov_gabes: 'Gabès',
      gov_medenine: 'Médenine',
      gov_tataouine: 'Tataouine',
      gov_gafsa: 'Gafsa',
      gov_tozeur: 'Tozeur'
    },
    ar: {
      menuHome: 'الرئيسية',
menuMyClasses: 'أقسامـي',
menuMyHomework: 'واجباتي',
menuVerification: 'التحقق',
verificationTitle: 'التحقق من حساب المعلم',
verificationText: 'افتح الكاميرا وامسح رمز QR المقدم من المدرسة.',
verificationStatusRequesting: 'طلب الوصول إلى الكاميرا…',
verificationStatusFrame: 'ضع رمز QR في الإطار.',
verificationStatusSuccess: 'تم التحقق! جاري التحويل…',
verificationStatusNoCamera: 'الكاميرا غير متاحة. استخدم الزر أدناه إذا تم التحقق من حسابك مسبقاً.',
verificationStatusDenied: 'تم رفض الوصول إلى الكاميرا. استخدم الزر أدناه إذا تم التحقق من حسابك مسبقاً.',
verificationManualBtn: 'تم التحقق من حسابي مسبقاً',
menuAssistantIA: 'المساعد الذكي',
menuAddSubscription: 'إضافة اشتراك',
notifications: 'الإشعارات',
settings: 'الإعدادات',
subscriptionWelcome: 'مرحبًا بك في دروسي',
subscriptionText: 'مرحبًا بك في دروسي! للبدء في استخدام جميع الميزات، يرجى الاشتراك ',
subscribe: 'اشترك الآن',
subscribeClasses: 'الاشتراك في الأقسام',
subscriptionTextTeacher: 'مرحبًا بك في دروسي! للبدء في استخدام جميع الميزات، يرجى الاشتراك في مدرسة واحدة أو أكثر واختيار أقسامك في كل مدرسة.',
titleMyClasses: 'أقسامـي',
titleMyHomework: 'واجباتي',
titleNotifications: 'الإشعارات',
titleAssistantIA: 'المساعد الذكي',
titleParams: 'الإعدادات',
titleGovernorat: 'الولايات',
titleDelegation: 'المعتمديات',
titleSchool: 'المدارس الابتدائية',
titleChooseClass: 'اختر الأقسام',
account: 'الحساب',
privacy: 'الخصوصية',
about: 'حول التطبيق',
logout: 'تسجيل الخروج',
back: 'رجوع',
close: 'إغلاق',
installAppText: 'استخدم التطبيق على هاتفك',
roleParent: 'المتابعة كولي',
roleTeacher: 'المتابعة كمعلم(ة)',
legalConditions: 'شروط الاستخدام',
noSubscription: 'لا يوجد اشتراك',
noSubscriptionText: 'ليس لديك اشتراك نشط بعد.',
subscribeNow: 'اشترك الآن',
noNotifications: 'لا توجد إشعارات',
noNotificationsText: 'ليس لديك إشعارات بعد.',
aiWelcome: 'مرحبًا! أنا مساعدك الذكي',
aiWelcomeText: 'أنا هنا لمساعدتك في أسئلتك حول التعليم، الأقسام، الواجبات والمزيد. اطرح سؤالك!',
aiPlaceholder: 'اكتب رسالتك...',
onlineRestored: 'تم استعادة الاتصال بالإنترنت',
offlineMessage: 'لا يوجد اتصال بالإنترنت',
      /* Gouvernorats */
      gov_tunis: 'تونس',
      gov_ariana: 'أريانة',
      gov_ben_arous: 'بن عروس',
      gov_manouba: 'منوبة',
      gov_nabeul: 'نابل',
      gov_zaghouan: 'زغوان',
      gov_bizerte: 'بنزرت',
      gov_beja: 'باجة',
      gov_jendouba: 'جندوبة',
      gov_kef: 'الكاف',
      gov_siliana: 'سليانة',
      gov_kairouan: 'القيروان',
      gov_kasserine: 'القصرين',
      gov_sidi_bouzid: 'سيدي بوزيد',
      gov_sfax: 'صفاقس',
      gov_mahdia: 'المهدية',
      gov_monastir: 'المنستير',
      gov_sousse: 'سوسة',
      gov_kebili: 'قبلي',
      gov_gabes: 'قابس',
      gov_medenine: 'مدنين',
      gov_tataouine: 'تطاوين',
      gov_gafsa: 'قفصة',
      gov_tozeur: 'توزر'
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getBoth(key) {
    var fr = messages.fr[key] != null ? messages.fr[key] : key;
    var ar = messages.ar[key] != null ? messages.ar[key] : key;
    return { fr: fr, ar: ar };
  }

  /** Affiche français puis arabe l'un en dessous de l'autre dans chaque élément [data-i18n] */
  function applyPage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var both = getBoth(key);
      el.innerHTML = '<span class="i18n-fr">' + escapeHtml(both.fr) + '</span><span class="i18n-ar" dir="rtl">' + escapeHtml(both.ar) + '</span>';
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (!key || el.placeholder === undefined) return;
      var both = getBoth(key);
      el.placeholder = both.fr + '\n' + both.ar;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (!key) return;
      var both = getBoth(key);
      el.setAttribute('title', both.fr + ' — ' + both.ar);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (!key) return;
      var both = getBoth(key);
      el.setAttribute('aria-label', both.fr + ' — ' + both.ar);
    });
  }

  function init() {
    document.documentElement.setAttribute('lang', 'fr');
    document.documentElement.setAttribute('dir', 'ltr');
    applyPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.I18n = {
    t: function (key, lang) { return (lang === 'ar' ? messages.ar : messages.fr)[key] || key; },
    getBoth: getBoth,
    applyPage: applyPage,
    escapeHtml: escapeHtml
  };
  if (typeof global.escapeHtml === 'undefined') global.escapeHtml = escapeHtml;
})(typeof window !== 'undefined' ? window : this);
