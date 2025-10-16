# Internationalization (i18n) System

This document describes the internationalization system implemented for the Jewish Demographics & Historical Communities Map.

## Overview

The i18n system provides comprehensive language support with the following features:

- **Multi-language support**: English and Hebrew
- **RTL (Right-to-Left) language support**: Automatic layout adjustments for Hebrew
- **Browser language detection**: Automatically detects user's preferred language
- **Persistent language choice**: Saves user preference in localStorage
- **Dynamic content translation**: All UI elements and content are translatable
- **Easy maintenance**: Centralized translation files in JSON format

## File Structure

```
├── i18n.js                    # Main i18n system
├── translations/
│   ├── en.json               # English translations
│   └── he.json               # Hebrew translations
├── index.html                # Updated with data-i18n attributes
├── helpers.js                # Updated to use i18n system
└── styles.css                # RTL support styles
```

## Translation Files

### Structure

Translation files use a nested JSON structure for organization:

```json
{
  "meta": {
    "title": "Page title",
    "description": "Page description",
    "keywords": "SEO keywords"
  },
  "ui": {
    "title": "Main title",
    "about": "About button",
    "startTour": "Start Tour button"
  },
  "about": {
    "title": "About modal title",
    "overview": {
      "title": "Overview section title",
      "description": "Overview description"
    }
  }
}
```

### Adding New Translations

1. Add the new key-value pair to both `en.json` and `he.json`
2. Use the key in HTML with `data-i18n="key.path"` attribute
3. Use the key in JavaScript with `window.i18n.t('key.path')`

## Usage

### HTML Elements

Add `data-i18n` attribute to any element that should be translated:

```html
<h1 data-i18n="ui.title">Default English Text</h1>
<button data-i18n="ui.about">About</button>
```

### JavaScript

Use the translation function in JavaScript:

```javascript
// Get translation
const title = window.i18n.t('ui.title');

// With parameters
const message = window.i18n.t('welcome.message', { name: 'John' });

// Get current language
const currentLang = window.i18n.getCurrentLanguage();

// Check if RTL
const isRTL = window.i18n.isRTL();
```

### Language Switching

```javascript
// Switch to Hebrew
window.i18n.switchLanguage('he');

// Switch to English
window.i18n.switchLanguage('en');
```

## RTL Support

The system automatically handles RTL languages with:

- **Direction attribute**: Sets `dir="rtl"` on HTML element
- **CSS classes**: Adds `rtl` class to body for styling
- **Layout adjustments**: Reverses flex directions and text alignment
- **Floating elements**: Repositions elements for RTL layout

### RTL CSS Classes

```css
.rtl {
    direction: rtl;
}

.rtl .floating-icon {
    left: 20px;
    right: auto;
}

.rtl .timeline-section {
    text-align: right;
}
```

## Language Detection

The system detects user language preference in this order:

1. **Saved preference**: From localStorage
2. **Browser language**: From `navigator.language`
3. **Fallback**: Default to English

## Supported Languages

- **English (en)**: Default language
- **Hebrew (he)**: RTL language with full support

## Adding New Languages

To add a new language:

1. Create new translation file: `translations/[lang].json`
2. Add language code to `isLanguageSupported()` method
3. Add RTL languages to `rtlLanguages` array if needed
4. Update language switcher UI

## Browser Compatibility

- **Modern browsers**: Full support
- **IE11+**: Basic support (may need polyfills for fetch)
- **Mobile browsers**: Full support

## Performance

- **Lazy loading**: Translations loaded on demand
- **Caching**: Translations cached after first load
- **Minimal overhead**: Lightweight implementation
- **Fast switching**: Instant language changes

## Maintenance

### Updating Translations

1. Edit the appropriate JSON file in `translations/`
2. Test the changes in both languages
3. Verify RTL layout for Hebrew

### Adding New Content

1. Add `data-i18n` attribute to HTML elements
2. Add corresponding keys to translation files
3. Test in both languages

## Troubleshooting

### Common Issues

1. **Missing translations**: Check console for warnings
2. **RTL layout issues**: Verify CSS classes are applied
3. **Language not switching**: Check localStorage and browser console
4. **Tour not updating**: Ensure event listeners are properly set up

### Debug Mode

Enable debug mode by adding to console:

```javascript
window.i18n.debug = true;
```

This will log translation lookups and language changes.

## Future Enhancements

- **Pluralization support**: Handle singular/plural forms
- **Date/time formatting**: Localized date formats
- **Number formatting**: Localized number formats
- **More languages**: Spanish, French, German, etc.
- **Translation management**: Admin interface for translators

