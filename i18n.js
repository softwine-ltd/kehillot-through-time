/**
 * Internationalization (i18n) System
 * Handles language switching, text translation, and RTL support
 */

class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.rtlLanguages = ['he', 'ar', 'fa', 'ur']; // Right-to-left languages
        
        // Initialize the system
        this.init();
    }

    /**
     * Initialize the i18n system
     */
    async init() {
        // Load saved language preference or detect browser language
        const savedLanguage = localStorage.getItem('preferredLanguage');
        const browserLanguage = this.detectBrowserLanguage();
        this.currentLanguage = savedLanguage || browserLanguage || this.fallbackLanguage;

        // Load translations
        await this.loadTranslations();

        // i18n.js loads via a blocking <script> in <head>, so this can resume
        // before <body> (and the data-i18n elements in it) exist yet -- wait
        // for the DOM if so, otherwise applyLanguage()/setupLanguageSwitcher()
        // either throw on document.body being null or silently update nothing.
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
        }

        // Apply initial language
        this.applyLanguage();

        // Set up language switcher
        this.setupLanguageSwitcher();
    }

    /**
     * Detect browser language preference
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Check if we support this language
        if (this.isLanguageSupported(langCode)) {
            return langCode;
        }
        
        // Check if browser has multiple language preferences
        if (navigator.languages) {
            for (const lang of navigator.languages) {
                const code = lang.split('-')[0];
                if (this.isLanguageSupported(code)) {
                    return code;
                }
            }
        }
        
        return this.fallbackLanguage;
    }

    /**
     * Check if a language is supported
     */
    isLanguageSupported(langCode) {
        return ['en', 'he', 'fr'].includes(langCode);
    }

    /**
     * Load translation files
     */
    async loadTranslations() {
        const supportedLanguages = ['en', 'he', 'fr'];
        
        for (const lang of supportedLanguages) {
            try {
                const response = await fetch(`translations/${lang}.json`);
                if (response.ok) {
                    this.translations[lang] = await response.json();
                } else {
                    console.warn(`Failed to load translations for ${lang}`);
                }
            } catch (error) {
                console.error(`Error loading translations for ${lang}:`, error);
            }
        }
    }

    /**
     * Get translation for a key
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navigate through nested keys
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = this.translations[this.fallbackLanguage];
                for (const k of keys) {
                    if (translation && translation[k]) {
                        translation = translation[k];
                    } else {
                        console.warn(`Translation key not found: ${key}`);
                        return key; // Return the key itself as fallback
                    }
                }
                break;
            }
        }
        
        // Handle arrays (like feature lists)
        if (Array.isArray(translation)) {
            return translation;
        }
        
        // Handle string interpolation
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            return this.interpolate(translation, params);
        }
        
        return translation || key;
    }

    /**
     * String interpolation for dynamic values
     */
    interpolate(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] || match;
        });
    }

    /**
     * Switch to a different language
     */
    async switchLanguage(langCode) {
        if (!this.isLanguageSupported(langCode)) {
            console.warn(`Language ${langCode} is not supported`);
            return;
        }

        this.currentLanguage = langCode;

        // Save preference
        localStorage.setItem('preferredLanguage', langCode);

        // Apply language changes (dispatches 'languageChanged' itself, see below)
        this.applyLanguage();
    }

    /**
     * Apply language to the page
     */
    applyLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        // Update dir attribute for RTL languages
        const isRTL = this.rtlLanguages.includes(this.currentLanguage);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

        // Update body class for RTL styling
        document.body.classList.toggle('rtl', isRTL);

        // Update meta tags
        this.updateMetaTags();

        // Update all translatable elements
        this.updateTranslatableElements();

        // Update language switcher
        this.updateLanguageSwitcher();

        // Trigger custom event for other components. Dispatched here (rather than only from
        // switchLanguage()) so init()'s own initial call -- which applies a language restored
        // from localStorage/browser detection before the user ever touches the switcher --
        // fires it too. That initial call races against helpers.js's own DOMContentLoaded
        // handler (which waits on a *dynamically loaded* MarkerCluster <script> before running
        // initializeMap()), so whichever finishes first, listeners like the timeline-slider's
        // direction check below need this event to know the page's real text direction --
        // relying only on the user-initiated path left a page that *loads* straight into
        // Hebrew (a returning visitor's saved preference) with a slider stuck in ltr.
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    /**
     * Update meta tags with translated content
     */
    updateMetaTags() {
        const title = this.t('meta.title');
        const description = this.t('meta.description');
        const keywords = this.t('meta.keywords');
        
        document.title = title;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = description;
        }
        
        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = keywords;
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = title;
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.content = description;
        }
        
        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.content = title;
        }
        
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        if (twitterDesc) {
            twitterDesc.content = description;
        }
    }

    /**
     * Update all elements with data-i18n attributes
     */
    updateTranslatableElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (Array.isArray(translation)) {
                // Handle arrays (like lists)
                if (element.tagName === 'UL' || element.tagName === 'OL') {
                    element.innerHTML = translation.map(item => `<li>${item}</li>`).join('');
                } else {
                    element.textContent = translation.join(', ');
                }
            } else {
                // Handle strings
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    /**
     * Set up language switcher functionality
     */
    setupLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        if (!document.getElementById('languageSwitcher')) {
            this.createLanguageSwitcher();
        }
        
        // Add event listeners
        const enButton = document.getElementById('selectEnglish');
        const heButton = document.getElementById('selectHebrew');
        const frButton = document.getElementById('selectFrench');
        
        if (enButton) {
            enButton.addEventListener('click', () => this.switchLanguage('en'));
        }
        
        if (heButton) {
            heButton.addEventListener('click', () => this.switchLanguage('he'));
        }
        
        if (frButton) {
            frButton.addEventListener('click', () => this.switchLanguage('fr'));
        }
    }

    /**
     * Create language switcher UI
     */
    createLanguageSwitcher() {
        // Add language switcher to header
        const header = document.querySelector('header .flex');
        if (header) {
            const languageSwitcher = document.createElement('div');
            languageSwitcher.id = 'languageSwitcher';
            languageSwitcher.className = 'flex items-center gap-2';
            languageSwitcher.innerHTML = `
                <button id="langEn" class="px-2 py-1 text-xs lg:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors ${this.currentLanguage === 'en' ? 'bg-blue-100 text-blue-700' : ''}">
                    EN
                </button>
                <button id="langHe" class="px-2 py-1 text-xs lg:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors ${this.currentLanguage === 'he' ? 'bg-blue-100 text-blue-700' : ''}">
                    ע
                </button>
                <button id="langFr" class="px-2 py-1 text-xs lg:text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors ${this.currentLanguage === 'fr' ? 'bg-blue-100 text-blue-700' : ''}">
                    FR
                </button>
            `;
            
            header.insertBefore(languageSwitcher, header.firstChild);
            
            // Add event listeners
            document.getElementById('langEn').addEventListener('click', () => this.switchLanguage('en'));
            document.getElementById('langHe').addEventListener('click', () => this.switchLanguage('he'));
            document.getElementById('langFr').addEventListener('click', () => this.switchLanguage('fr'));
        }
    }

    /**
     * Update language switcher active state
     */
    updateLanguageSwitcher() {
        const enButton = document.getElementById('langEn');
        const heButton = document.getElementById('langHe');
        const frButton = document.getElementById('langFr');
        
        if (enButton && heButton && frButton) {
            // Remove active classes
            enButton.classList.remove('bg-blue-100', 'text-blue-700');
            heButton.classList.remove('bg-blue-100', 'text-blue-700');
            frButton.classList.remove('bg-blue-100', 'text-blue-700');
            
            // Add active class to current language
            if (this.currentLanguage === 'en') {
                enButton.classList.add('bg-blue-100', 'text-blue-700');
            } else if (this.currentLanguage === 'he') {
                heButton.classList.add('bg-blue-100', 'text-blue-700');
            } else if (this.currentLanguage === 'fr') {
                frButton.classList.add('bg-blue-100', 'text-blue-700');
            }
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if current language is RTL
     */
    isRTL() {
        return this.rtlLanguages.includes(this.currentLanguage);
    }
}

// Create global i18n instance
window.i18n = new I18n();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
