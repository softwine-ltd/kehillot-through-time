#!/usr/bin/env python3
"""
Convert alternative_names list to dictionary with language names as keys.

Reads city_alternatives.json and converts the alternative_names list
to a dictionary where keys are language names and values are the alternative names.
Uses language detection to identify the language of each alternative name.
"""

import json
import os
import time
import requests
from typing import List, Dict, Any
from collections import defaultdict

# Try to import langdetect, fallback to web-based detection if not available
try:
    from langdetect import detect, DetectorFactory, LangDetectException
    DetectorFactory.seed = 0  # For consistent results
    HAS_LANGDETECT = True
except ImportError:
    HAS_LANGDETECT = False
    print("Warning: langdetect not installed. Using web-based language detection.")
    print("To install: pip install langdetect")
    LangDetectException = Exception


def detect_language_web(text: str) -> str:
    """
    Detect language using a web service as fallback.
    Uses Google Translate's language detection (no API key needed for detection).
    """
    try:
        # Use Google Translate's language detection endpoint
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            'client': 'gtx',
            'sl': 'auto',
            'tl': 'en',
            'dt': 't',
            'q': text[:100]  # Limit to first 100 chars
        }
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 2:
                lang_code = data[2]  # Language code is usually in index 2
                return lang_code
    except Exception as e:
        print(f"  Web detection failed for '{text}': {e}")
    
    return "unknown"


def get_language_name(lang_code: str) -> str:
    """
    Convert language code to full language name.
    """
    language_map = {
        'en': 'English',
        'he': 'Hebrew',
        'yi': 'Yiddish',
        'de': 'German',
        'fr': 'French',
        'es': 'Spanish',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'pl': 'Polish',
        'cs': 'Czech',
        'sk': 'Slovak',
        'hu': 'Hungarian',
        'ro': 'Romanian',
        'bg': 'Bulgarian',
        'hr': 'Croatian',
        'sr': 'Serbian',
        'uk': 'Ukrainian',
        'be': 'Belarusian',
        'lt': 'Lithuanian',
        'lv': 'Latvian',
        'et': 'Estonian',
        'fi': 'Finnish',
        'sv': 'Swedish',
        'no': 'Norwegian',
        'da': 'Danish',
        'is': 'Icelandic',
        'ga': 'Irish',
        'cy': 'Welsh',
        'mt': 'Maltese',
        'sl': 'Slovenian',
        'mk': 'Macedonian',
        'sq': 'Albanian',
        'tr': 'Turkish',
        'az': 'Azerbaijani',
        'ka': 'Georgian',
        'hy': 'Armenian',
        'kk': 'Kazakh',
        'ky': 'Kyrgyz',
        'uz': 'Uzbek',
        'mn': 'Mongolian',
        'ko': 'Korean',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'th': 'Thai',
        'vi': 'Vietnamese',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'ta': 'Tamil',
        'te': 'Telugu',
        'ml': 'Malayalam',
        'kn': 'Kannada',
        'gu': 'Gujarati',
        'pa': 'Punjabi',
        'or': 'Odia',
        'as': 'Assamese',
        'ne': 'Nepali',
        'si': 'Sinhala',
        'my': 'Burmese',
        'km': 'Khmer',
        'lo': 'Lao',
        'am': 'Amharic',
        'ti': 'Tigrinya',
        'sw': 'Swahili',
        'af': 'Afrikaans',
        'eu': 'Basque',
        'ca': 'Catalan',
        'gl': 'Galician',
        'nl': 'Dutch',
        'ar': 'Arabic',
        'fa': 'Persian',
        'ur': 'Urdu',
        'id': 'Indonesian',
        'ms': 'Malay',
        'tl': 'Tagalog',
        'el': 'Greek',
        'unknown': 'Unknown'
    }
    
    return language_map.get(lang_code, lang_code.title())


def detect_language(text: str) -> str:
    """
    Detect the language of a text string.
    Returns the full language name.
    """
    if not text or not text.strip():
        return "Unknown"
    
    # Clean the text
    text = text.strip()
    
    # Try langdetect first if available
    if HAS_LANGDETECT:
        try:
            lang_code = detect(text)
            return get_language_name(lang_code)
        except LangDetectException:
            # Text too short or ambiguous, try web detection
            pass
        except Exception as e:
            print(f"      langdetect error for '{text}': {e}, trying web detection...")
    
    # Fallback to web-based detection
    lang_code = detect_language_web(text)
    return get_language_name(lang_code)


# Global cache for language detection results
_language_cache = {}


def convert_alternative_names(alt_names: List[str], city_name: str, country: str) -> Dict[str, str]:
    """
    Convert a list of alternative names to a dictionary with language names as keys.
    
    Args:
        alt_names: List of alternative city names
        city_name: Original city name (for context)
        country: Country name (for context)
    
    Returns:
        Dictionary with language names as keys and alternative names as values
    """
    result = {}
    
    if not alt_names:
        return result
    
    print(f"  Processing {len(alt_names)} alternative names...")
    
    for i, alt_name in enumerate(alt_names):
        if not alt_name or not alt_name.strip():
            continue
        
        alt_name = alt_name.strip()
        
        # Skip if it's the same as the original name
        if alt_name.lower() == city_name.lower():
            continue
        
        # Check cache first
        if alt_name in _language_cache:
            language = _language_cache[alt_name]
            print(f"    [{i+1}/{len(alt_names)}] Using cached language for: {alt_name} -> {language}")
        else:
            # Detect language
            print(f"    [{i+1}/{len(alt_names)}] Detecting language for: {alt_name}")
            language = detect_language(alt_name)
            _language_cache[alt_name] = language  # Cache the result
        
        # If multiple names have the same language, append a number
        if language in result:
            # Check if it's a different name (not duplicate)
            if alt_name not in result.values():
                # Create a unique key by appending a number
                counter = 2
                new_key = f"{language}_{counter}"
                while new_key in result:
                    counter += 1
                    new_key = f"{language}_{counter}"
                result[new_key] = alt_name
                print(f"      -> {new_key}: {alt_name}")
            else:
                print(f"      -> Skipping duplicate: {alt_name}")
        else:
            result[language] = alt_name
            print(f"      -> {language}: {alt_name}")
        
        # Rate limiting for web-based detection
        if not HAS_LANGDETECT:
            time.sleep(0.5)  # Be respectful to the API
    
    return result


def save_cache(cache_file: str = 'language_detection_cache.json'):
    """Save the language detection cache to a file"""
    try:
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(_language_cache, f, indent=2, ensure_ascii=False)
        print(f"Cache saved to {cache_file}")
    except Exception as e:
        print(f"Warning: Could not save cache: {e}")


def load_cache(cache_file: str = 'language_detection_cache.json'):
    """Load the language detection cache from a file"""
    global _language_cache
    if os.path.exists(cache_file):
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                _language_cache = json.load(f)
            print(f"Loaded {len(_language_cache)} cached language detections from {cache_file}")
        except Exception as e:
            print(f"Warning: Could not load cache: {e}")
            _language_cache = {}


def process_city_alternatives(input_file: str, output_file: str, cache_file: str = 'language_detection_cache.json', 
                              limit: int = None):
    """
    Process the city_alternatives.json file and convert alternative_names lists to dictionaries.
    
    Args:
        input_file: Path to input JSON file
        output_file: Path to output JSON file
        cache_file: Path to cache file for language detection
        limit: Optional limit on number of cities to process (for testing)
    """
    print(f"Reading input file: {input_file}")
    
    # Load cache if it exists
    load_cache(cache_file)
    
    # Check if file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found!")
        return
    
    # Read the JSON file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            cities_data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        return
    
    # Apply limit if specified (for testing)
    if limit:
        cities_data = cities_data[:limit]
        print(f"TEST MODE: Processing only first {limit} cities")
    
    print(f"Loaded {len(cities_data)} cities")
    print(f"Cache contains {len(_language_cache)} entries")
    print("\nProcessing cities...")
    
    # Process each city
    processed_cities = []
    total_cities = len(cities_data)
    
    # Save cache every N cities
    save_interval = 100
    
    for index, city in enumerate(cities_data):
        original_name = city.get('original_name', '')
        country = city.get('country', '')
        alt_names = city.get('alternative_names', [])
        
        print(f"\n[{index + 1}/{total_cities}] Processing: {original_name}, {country}")
        
        # Convert alternative_names list to dictionary
        alt_names_dict = convert_alternative_names(alt_names, original_name, country)
        
        # Create new city entry
        new_city = {
            'original_name': original_name,
            'country': country,
            'latitude': city.get('latitude'),
            'longitude': city.get('longitude'),
            'alternative_names': alt_names_dict  # Now a dictionary instead of list
        }
        
        processed_cities.append(new_city)
        
        print(f"  Converted {len(alt_names)} names to {len(alt_names_dict)} language entries")
        
        # Periodically save cache and output (in case of interruption)
        if (index + 1) % save_interval == 0:
            save_cache(cache_file)
            # Also save partial output
            try:
                with open(output_file + '.partial', 'w', encoding='utf-8') as f:
                    json.dump(processed_cities, f, indent=2, ensure_ascii=False)
                print(f"  Progress saved (partial output: {output_file}.partial)")
            except Exception as e:
                print(f"  Warning: Could not save partial output: {e}")
    
    # Save final cache
    save_cache(cache_file)
    
    # Save to output file
    print(f"\n\nSaving results to: {output_file}")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_cities, f, indent=2, ensure_ascii=False)
        print(f"Success! Saved {len(processed_cities)} cities to {output_file}")
        
        # Remove partial file if it exists
        partial_file = output_file + '.partial'
        if os.path.exists(partial_file):
            os.remove(partial_file)
            print(f"Removed partial file: {partial_file}")
    except Exception as e:
        print(f"Error saving output file: {e}")


def main():
    """Main function"""
    import sys
    
    # File paths
    input_file = 'city_alternatives.json'
    output_file = 'city_alternatives_with_languages.json'
    cache_file = 'language_detection_cache.json'
    limit = None
    
    # Check for command-line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == '--test' or sys.argv[1] == '-t':
            limit = 10  # Test with 10 cities
            print("TEST MODE: Processing only first 10 cities")
        elif sys.argv[1].isdigit():
            limit = int(sys.argv[1])
            print(f"LIMIT MODE: Processing only first {limit} cities")
        else:
            print("Usage: python convert_alternative_names_to_languages.py [--test|-t] [number]")
            print("  --test or -t: Process only first 10 cities (for testing)")
            print("  number: Process only first N cities")
            return
    
    # Check if we're in the right directory
    if not os.path.exists(input_file):
        # Try parent directory
        parent_input = os.path.join('..', input_file)
        if os.path.exists(parent_input):
            input_file = parent_input
            output_file = os.path.join('..', output_file)
            cache_file = os.path.join('..', cache_file)
        else:
            print(f"Error: Could not find {input_file}")
            print("Please run this script from the project root directory or utils directory")
            return
    
    process_city_alternatives(input_file, output_file, cache_file, limit)


if __name__ == "__main__":
    main()
