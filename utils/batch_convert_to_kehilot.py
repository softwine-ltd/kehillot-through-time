#!/usr/bin/env python3
"""
Headless/batch equivalent of csv_converter_gui.py.

Converts one or more input CSV files -- either the 9-column "raw research"
format (country, town, long, lat, year_estab, year_of_data, population,
notes, source) or files already in the 19-column kehilot.csv format -- and
merges the result directly into kehilot.csv.

The conversion rules (year_end/pop_end look-ahead, probability heuristic,
DMS coordinate parsing, Wikipedia interlanguage-link name lookup with a
persistent cache) are ported as-is from csv_converter_gui.py so this produces
the same rows the GUI would have, minus the manual review step -- rows are
appended straight into kehilot.csv, with a timestamped backup made first and
exact-duplicate rows skipped.

Usage:
    python batch_convert_to_kehilot.py file1.csv file2.csv ...
    python batch_convert_to_kehilot.py "data_temp/*_kehilot.csv"
    python batch_convert_to_kehilot.py --no-name-lookup --no-backup file.csv
"""
import argparse
import csv
import glob
import json
import os
import re
import shutil
import sys
from datetime import datetime

import requests
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_KEHILOT_CSV = os.path.join(SCRIPT_DIR, "..", "kehilot.csv")
DEFAULT_CACHE_FILE = os.path.join(SCRIPT_DIR, "city_names_cache.json")

KEHILOT_FIELDNAMES = [
    'country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end',
    'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english',
    'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment'
]

# --- ported verbatim from csv_converter_gui.py: get_city_names() heuristics ---

LANGUAGE_NAMES = [
    'עברית', 'יידיש', 'Deutsch', 'Afrikaans', 'English', 'Français', 'Español',
    'Italiano', 'Português', 'Русский', 'Polski', 'Čeština', 'Slovenčina',
    'Magyar', 'Română', 'Български', 'Hrvatski', 'Српски', 'Українська',
    'Беларуская', 'Lietuvių', 'Latviešu', 'Eesti', 'Suomi', 'Norsk', 'Svenska',
    'Dansk', 'Íslenska', 'Gaeilge', 'Cymraeg', 'Malti', 'Slovenščina', 'Македонски',
    'Shqip', 'Türkçe', 'Azərbaycan', 'Azərbaycanca', 'ქართული', 'Հայերեն', 'Қазақша', 'Кыргызча',
    "O'zbekcha", 'Монгол', '한국어', '日本語', '中文', 'ไทย', 'Tiếng Việt',
    'हिन्दी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'മലയാളം', 'ಕನ್ನಡ', 'ગુજરાતી',
    'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'नेपाली', 'සිංහල', 'မြန်မာ', 'ខ្មែរ',
    'ລາວ', 'አማርኛ', 'ትግርኛ', 'Kiswahili', 'IsiZulu', 'IsiXhosa',
    'Euskera', 'Euskara', 'Català', 'Galego', 'Nederlands', 'Alemannisch', 'Aragonés',
    'Asturianu', "Avañe'ẽ", 'Basa Bali', 'Bân-lâm-gú'
]

LOCAL_LANGUAGES = {
    'Prague': 'cs', 'Praha': 'cs', 'Warsaw': 'pl', 'Warszawa': 'pl',
    'Moscow': 'ru', 'Moskva': 'ru', 'Kiev': 'uk', 'Kyiv': 'uk',
    'Budapest': 'hu', 'Bucharest': 'ro', 'Sofia': 'bg', 'Zagreb': 'hr',
    'Belgrade': 'sr', 'Beograd': 'sr', 'Minsk': 'be', 'Vilnius': 'lt',
    'Riga': 'lv', 'Tallinn': 'et', 'Helsinki': 'fi', 'Oslo': 'no',
    'Stockholm': 'sv', 'Copenhagen': 'da', 'Reykjavik': 'is', 'Dublin': 'ga',
    'Cardiff': 'cy', 'Valletta': 'mt', 'Ljubljana': 'sl', 'Skopje': 'mk',
    'Tirana': 'sq', 'Istanbul': 'tr', 'Baku': 'az', 'Tbilisi': 'ka',
    'Yerevan': 'hy', 'Almaty': 'kk', 'Bishkek': 'ky', 'Tashkent': 'uz',
    'Ulaanbaatar': 'mn', 'Seoul': 'ko', 'Tokyo': 'ja', 'Beijing': 'zh',
    'Bangkok': 'th', 'Hanoi': 'vi', 'New Delhi': 'hi', 'Dhaka': 'bn',
    'Chennai': 'ta', 'Hyderabad': 'te', 'Kochi': 'ml', 'Bangalore': 'kn',
    'Ahmedabad': 'gu', 'Chandigarh': 'pa', 'Bhubaneswar': 'or', 'Guwahati': 'as',
    'Kathmandu': 'ne', 'Colombo': 'si', 'Yangon': 'my', 'Phnom Penh': 'km',
    'Vientiane': 'lo', 'Addis Ababa': 'am', 'Asmara': 'ti', 'Nairobi': 'sw',
    'Cape Town': 'af', 'Johannesburg': 'af', 'Bilbao': 'eu', 'Barcelona': 'ca',
    'Santiago': 'gl', 'Lisbon': 'pt', 'Madrid': 'es', 'Paris': 'fr',
    'Rome': 'it', 'Amsterdam': 'nl',
}

COMMON_MAPPINGS = {
    'Jerusalem': {'hebrew': 'ירושלים', 'yiddish': 'ירושלים', 'german': 'Jerusalem'},
    'Tel Aviv': {'hebrew': 'תל אביב', 'yiddish': 'תל אביב', 'german': 'Tel Aviv'},
    'New York': {'hebrew': 'ניו יורק', 'yiddish': 'ניו יארק', 'german': 'New York'},
    'London': {'hebrew': 'לונדון', 'yiddish': 'לונדן', 'german': 'London'},
    'Paris': {'hebrew': 'פריז', 'yiddish': 'פאריז', 'german': 'Paris'},
    'Berlin': {'hebrew': 'ברלין', 'yiddish': 'בערלין', 'german': 'Berlin'},
    'Rome': {'hebrew': 'רומא', 'yiddish': 'רומא', 'german': 'Rom'},
    'Madrid': {'hebrew': 'מדריד', 'yiddish': 'מאדריד', 'german': 'Madrid'},
    'Amsterdam': {'hebrew': 'אמסטרדם', 'yiddish': 'אמסטערדאם', 'german': 'Amsterdam'},
    'Vienna': {'hebrew': 'וינה', 'yiddish': 'ווין', 'german': 'Wien'},
}


def convert_coordinate_to_decimal(coord_str):
    """Convert coordinate from DMS ("18° 0′ 5″ E") to decimal degrees; pass through if already decimal."""
    if not coord_str:
        return coord_str
    coord_str = str(coord_str).strip()
    try:
        return str(float(coord_str))
    except ValueError:
        pass
    if '°' not in coord_str and 'º' not in coord_str:
        return coord_str

    direction = ""
    coord_upper = coord_str.upper()
    if coord_upper.endswith(' E') or (coord_upper.endswith('E') and not coord_upper.endswith('°E')):
        direction = "E"
        coord_str = coord_str.rstrip('Ee ').strip()
    elif coord_upper.endswith(' W') or (coord_upper.endswith('W') and not coord_upper.endswith('°W')):
        direction = "W"
        coord_str = coord_str.rstrip('Ww ').strip()
    elif coord_upper.endswith(' N') or (coord_upper.endswith('N') and not coord_upper.endswith('°N')):
        direction = "N"
        coord_str = coord_str.rstrip('Nn ').strip()
    elif coord_upper.endswith(' S') or (coord_upper.endswith('S') and not coord_upper.endswith('°S')):
        direction = "S"
        coord_str = coord_str.rstrip('Ss ').strip()

    pattern = r'(\d+(?:\.\d+)?)\s*[°º]\s*(\d+(?:\.\d+)?)?\s*[′\']?\s*(\d+(?:\.\d+)?)?\s*[″"]?'
    match = re.search(pattern, coord_str)
    if not match:
        return coord_str

    degrees = float(match.group(1))
    minutes = float(match.group(2)) if match.group(2) else 0.0
    seconds = float(match.group(3)) if match.group(3) else 0.0
    decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
    if direction in ['W', 'S']:
        decimal = -decimal
    return str(decimal)


POPULATION_RANGE_RE = re.compile(r'^(\d[\d,]*)\s*-\s*(\d[\d,]*)$')


def sanitize_population(value):
    """Coerce a raw population field to a clean integer string, or '' if it carries no
    reliable number at all.

    Source rows have used several placeholders besides a clean integer: a bare "-"/"--"
    meaning "no estimate", a numeric range like "20-30", and -- from an older CSV-quoting
    bug -- stray free text that leaked into this column from the notes field. Passing any
    of those straight into kehilot.csv makes the site's JS parseInt() it into NaN, which
    then surfaces as a literal "NaN" population badge on the map (and can poison an entire
    marker cluster's summed total, since one bad marker taints the whole sum). A range is
    reduced to its midpoint -- a reasonable point estimate is more useful than discarding
    the only number the source actually gave us -- and anything else unparseable is dropped
    (blank), matching the meaning of "no reliable number" used elsewhere in this pipeline.
    """
    value = value.strip()
    if not value or value.upper() == 'NA':
        return ''
    cleaned = value.replace('~', '').replace('>', '').replace('<', '').replace(',', '')
    range_match = POPULATION_RANGE_RE.match(cleaned)
    if range_match:
        lo, hi = int(range_match.group(1)), int(range_match.group(2))
        return str((lo + hi) // 2)
    try:
        return str(int(cleaned))
    except ValueError:
        return ''


YEAR_DECADE_RE = re.compile(r'(\d{2,3})0s')
YEAR_RANGE_RE = re.compile(r'^(\d{3,4})\s*-\s*(\d{3,4})$')
YEAR_CIRCA_RE = re.compile(r'^c\.?\s*(\d{1,4})$', re.IGNORECASE)
YEAR_APPROX_RE = re.compile(r'^~\s*(\d{1,4})$')
YEAR_BARE_BCE_RE = re.compile(r'^(\d{1,4})\s*bce?$')
YEAR_BARE_CE_RE = re.compile(r'^(\d{1,4})\s*ce$')
YEAR_CENTURY_RE = re.compile(r'(\d{1,2})(?:st|nd|rd|th)\s+century', re.IGNORECASE)
YEAR_ORDINAL_BCE_RE = re.compile(r'^(\d{1,2})(?:st|nd|rd|th)\s+bce?$')
YEAR_ANY_4DIGIT_RE = re.compile(r'(\d{3,4})')
# Named eras with no specific number in the text at all -- point estimates picked to fall
# roughly in the middle of what the phrase usually refers to in a Jewish-history context.
# Checked longest-key-first (see below) so a specific compound phrase like "post-wwii" is
# matched before the shorter "wwii" it happens to contain.
YEAR_ERA_MAP = {
    'middle ages': 1000, 'medieval': 1000,
    'roman times': 100, 'roman era': 100,
    'pre-holocaust': 1938,
    'world war ii': 1942, 'wwii': 1942, 'holocaust': 1942, 'shoah': 1942,
    'pre-wwii': 1930, 'before wwii': 1930,
    'post-wwii': 1950, 'after wwii': 1950, 'post-war': 1950, 'interwar period': 1930,
    'pre-1939': 1930, 'post-1789': 1800,
    # Biblical/ancient-Israel eras -- point estimates picked at the traditional midpoint of
    # each period/figure's usual dating in Jewish-history sources (all BCE unless noted).
    'time of the divided kingdoms': -800, 'time of the judges': -1150, 'time of judges': -1150,
    "period of joshua's conquest": -1200, 'conquest of canaan': -1200,
    'post-babylonian exile': -500, 'babylonian period': -580,
    'after assyrian conquest': -700, 'assyrian period': -722,
    'hasmonean period': -100, 'maccabean period': -160, 'bar kokhba revolt': 132,
    'reign of solomon': -950, 'reign of david': -1000, 'reign of saul': -1050,
    'time of solomon': -950, 'time of david': -1000, 'time of saul': -1050,
    'time of elijah': -850, 'time of jeremiah': -600, 'time of ezra': -450,
    'time of abram': -1800, 'time of jacob': -1700,
    'biblical era': -1200, 'biblical period': -1200,
}
YEAR_ERA_MAP_BY_LENGTH = sorted(YEAR_ERA_MAP.items(), key=lambda kv: -len(kv[0]))


def sanitize_year(value):
    """Coerce a raw year field (year_estab, year_start/"Year of Data", or a year_end
    look-ahead) to a clean integer string (negative for BCE), or '' if it carries no usable
    year at all ("Unknown", "Undated", "?", a bare "Present", etc.).

    Source rows have used a wide variety of approximate-date phrasing instead of a plain
    year: centuries ("15th century", "Late 16th Century", "5th BCE"), decades ("1940s"),
    ranges ("1939-1945"), circa notation ("c. 1334"), and a handful of named eras ("Middle
    Ages", "WWII"). Passing any of these straight through makes the site's JS parseInt() it
    into NaN -- for year_start specifically that is worse than a bad population number,
    since any comparison against NaN is false, so the row's "don't show before it starts"
    check never fires and it renders at literally every point on the timeline. Centuries/
    decades/ranges are reduced to a reasonable point estimate (a century's early/late/mid
    wording shifts where in that century the estimate falls); genuinely date-free text is
    dropped (blank) rather than guessed at.
    """
    if value is None:
        return ''
    value = value.strip()
    if not value or value.upper() in ('NA', 'N/A', 'UNKNOWN', 'UNDATED', 'PRESENT',
                                       'CURRENT', 'NOT SPECIFIED', 'NOT STATED',
                                       'NOT PROVIDED', 'N.D.', '?', '.'):
        return ''
    try:
        return str(int(value))
    except ValueError:
        pass

    # Normalize away punctuation ("B.C.E." -> "bce") so every pattern below can match a
    # plain lowercase word regardless of how the source spelled out BCE/BC.
    lower = re.sub(r'[.,]', '', value.lower())
    is_bce = bool(re.search(r'\bbce?\b', lower))

    for pattern in (YEAR_CIRCA_RE, YEAR_APPROX_RE):
        m = pattern.match(value)
        if m:
            year = int(m.group(1))
            return str(-year if is_bce else year)

    for pattern in (YEAR_BARE_BCE_RE, YEAR_ORDINAL_BCE_RE):
        m = pattern.match(lower)
        if m:
            num = int(m.group(1))
            if pattern is YEAR_ORDINAL_BCE_RE:
                return str(-((num - 1) * 100 + 50))
            return str(-num)

    # A bare small year with an explicit "CE" marker ("68 CE") isn't caught by the
    # 3-4-digit last-resort fallback below -- ancient-era years under 100 are common enough
    # (1st-2nd century CE events) to be worth a dedicated, unambiguous pattern rather than
    # loosening that fallback (which would risk matching stray numbers in unrelated text).
    m = YEAR_BARE_CE_RE.match(lower)
    if m:
        return str(int(m.group(1)))

    m = YEAR_RANGE_RE.match(value)
    if m:
        lo, hi = int(m.group(1)), int(m.group(2))
        mid = (lo + hi) // 2
        return str(-mid if is_bce else mid)

    m = YEAR_CENTURY_RE.search(value)
    if m:
        century = int(m.group(1))
        if any(w in lower for w in ('early', 'beginning', 'first half')):
            offset = 15
        elif any(w in lower for w in ('late', 'end', 'second half')):
            offset = 85
        else:
            offset = 50
        year = (century - 1) * 100 + offset
        return str(-year if is_bce else year)

    m = YEAR_DECADE_RE.search(lower)
    if m:
        year = int(m.group(1)) * 10
        return str(-year if is_bce else year)

    for era, year in YEAR_ERA_MAP_BY_LENGTH:
        if era in lower:
            return str(year)

    # Last resort: if a plain 3-4 digit year is sitting in an otherwise-unparsed phrase
    # ("Shortly after 1468", "Before 1143", "November 1938", "Pre-1118"), that's still a
    # far more useful point estimate than dropping the row entirely.
    m = YEAR_ANY_4DIGIT_RE.search(value)
    if m:
        year = int(m.group(1))
        return str(-year if is_bce else year)

    return ''


def should_skip_file(file_data, file_format):
    """Skip a raw-input file whose only data row shows no Jewish population (0/NA/empty)."""
    if file_format != "input":
        return False
    if len(file_data) < 2:
        return False
    first_row = file_data[0]
    has_header = any(w in str(first_row[0]).lower() for w in ['country', 'town', 'name'])
    data_rows = file_data[1:] if has_header else file_data
    if len(data_rows) != 1:
        return False
    row = data_rows[0]
    if len(row) < 7:
        return False
    population = row[6].strip().replace('~', '').replace('>', '').replace('<', '')
    if not population or population.upper() == 'NA' or population == '0':
        return True
    try:
        if float(population) == 0:
            return True
    except ValueError:
        pass
    return False


def load_city_names_cache(cache_file):
    if os.path.exists(cache_file):
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                cache = json.load(f)
            print(f"Loaded {len(cache)} city names from cache ({cache_file})")
            return cache
        except Exception as e:
            print(f"Error loading city names cache: {e}")
    else:
        print("No city names cache file found, starting with empty cache")
    return {}


def save_city_names_cache(cache, cache_file):
    try:
        os.makedirs(os.path.dirname(cache_file), exist_ok=True)
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(cache)} city names to cache ({cache_file})")
    except Exception as e:
        print(f"Error saving city names cache: {e}")


def get_city_names(city, country, cache, do_lookup=True):
    """Get Hebrew/Yiddish/German/other names for a city from Wikipedia interlanguage links, with caching."""
    cache_key = f"{city}|{country}".lower().strip()
    if cache_key in cache:
        cached_result = cache[cache_key].copy()
        cached_result['english'] = city
        return cached_result

    city_names = {'english': city, 'hebrew': '', 'yiddish': '', 'german': '', 'other': ''}

    if not do_lookup:
        return city_names

    try:
        search_url = f"https://en.wikipedia.org/wiki/{city.replace(' ', '_')}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                          '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(search_url, timeout=10, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')

            interlang_links = []
            interlang_section = soup.find('div', class_='row uls-language-list uls-lcd')
            if interlang_section:
                interlang_links = interlang_section.find_all('li', class_='interlanguage-link')
            if not interlang_links:
                all_links = soup.find_all('a', href=lambda x: x and 'wikipedia.org' in x and '/wiki/' in x)
                interlang_links = [
                    link for link in all_links
                    if not link.get('href', '').startswith('https://en.wikipedia.org')
                    and not link.get('href', '').startswith('//en.wikipedia.org')
                    and ':' not in link.get('href', '').split('/wiki/')[-1]
                    and link.get_text().strip()
                ]
            if not interlang_links:
                lang_dropdown = soup.find('div', id='p-lang')
                if lang_dropdown:
                    interlang_links = lang_dropdown.find_all('a', href=lambda x: x and 'wikipedia.org' in x and '/wiki/' in x)

            for link in interlang_links:
                href = link.get('href', '')
                lang_code = link.get('lang', '')
                if href and 'wikipedia.org' in href:
                    lang_match = re.search(r'https://([a-z]{2,3})\.wikipedia\.org', href)
                    if lang_match:
                        lang_code = lang_match.group(1)

                city_name = link.get('title', '').strip()
                if not city_name:
                    city_name = link.get_text().strip()
                if '–' in city_name:
                    city_name = city_name.split('–')[0].strip()
                elif ' - ' in city_name:
                    city_name = city_name.split(' - ')[0].strip()
                if ':' in city_name and len(city_name.split(':')[0]) <= 3:
                    city_name = city_name.split(':', 1)[1].strip()

                if len(city_name) > 50:
                    continue
                if (len(city_name.split()) > 3
                        or any(ch in city_name for ch in ['(', ')', '[', ']', '{', '}'])
                        or (' ' in city_name and len(city_name.split()) > 2)
                        or any(word in city_name.lower() for word in [
                            'university', 'school', 'college', 'institute', 'academy', 'center', 'centre',
                            'vysoká', 'škola', 'stanisławowska', 'vojtíšek', 'ernst', 'gustav', 'schultz',
                            'testnevelési', 'egyetem', 'gara', 'progresul', 'mäkelänrinteen', 'uintikeskus',
                            'stadsarkiv', 'skansen', 'restaurant', 'privatbane', 'parpusa', 'avenue',
                            'raphaël', 'präfektur', 'tokio'])):
                    continue
                if city_name in LANGUAGE_NAMES:
                    continue
                if city_name and len(city_name) <= 3 and city_name.islower():
                    continue

                if city_name and lang_code:
                    if lang_code == 'de':
                        city_names['german'] = city_name
                    elif lang_code == 'he':
                        city_names['hebrew'] = city_name
                    elif lang_code == 'yi':
                        city_names['yiddish'] = city_name
                    else:
                        is_local = False
                        for city_variant, local_lang in LOCAL_LANGUAGES.items():
                            if city_variant.lower() in city.lower() or city.lower() in city_variant.lower():
                                if lang_code == local_lang:
                                    is_local = True
                                    break
                        if not city_names['other'] or is_local:
                            city_names['other'] = city_name

            if not any(city_names[k] for k in ['hebrew', 'yiddish', 'german', 'other']):
                infobox = soup.find('table', class_='infobox')
                if infobox:
                    for row in infobox.find_all('tr'):
                        th = row.find('th')
                        td = row.find('td')
                        if th and td:
                            th_text = th.get_text().strip().lower()
                            td_text = td.get_text().strip()
                            if 'hebrew' in th_text or 'עברית' in th_text:
                                city_names['hebrew'] = td_text
                            elif 'german' in th_text or 'deutsch' in th_text:
                                city_names['german'] = td_text
                            elif 'yiddish' in th_text or 'יידיש' in th_text:
                                city_names['yiddish'] = td_text
                            elif 'native' in th_text or 'local' in th_text:
                                if any('֐' <= ch <= '׿' for ch in td_text):
                                    city_names['hebrew'] = td_text
                                elif any('Ѐ' <= ch <= 'ӿ' for ch in td_text):
                                    city_names['other'] = td_text
                                else:
                                    city_names['other'] = td_text

                first_para = soup.find('p')
                if first_para:
                    text = first_para.get_text()
                    hebrew_match = re.search(r'\([^)]*[Hh]ebrew[^)]*:?\s*([^)]+)\)', text)
                    if hebrew_match:
                        city_names['hebrew'] = hebrew_match.group(1).strip()
                    german_match = re.search(r'\([^)]*[Gg]erman[^)]*:?\s*([^)]+)\)', text)
                    if german_match:
                        city_names['german'] = german_match.group(1).strip()
    except Exception as e:
        print(f"  Web search failed for {city}: {e}")

    if not any(city_names[k] for k in ['hebrew', 'yiddish', 'german', 'other']):
        if city in COMMON_MAPPINGS:
            city_names.update(COMMON_MAPPINGS[city])

    cache_result = city_names.copy()
    cache_result['english'] = city
    cache[cache_key] = cache_result
    return city_names


def convert_single_row(country, city, longitude, latitude, year_estab, year_data,
                        population, notes, source, row_index, all_rows, cache, do_lookup=True):
    try:
        year_estab = sanitize_year(year_estab)
        year_data = sanitize_year(year_data)
        year_start = year_data if year_data else year_estab
        if not year_start:
            # Neither field carried a usable year -- there's no sensible point in time to
            # place this row at, so drop it rather than merge a row that (pre-fix) would
            # have rendered at every year on the timeline.
            return None

        # Default when no later sibling row exists (below): a single point-in-time
        # citation (year_end == year_start), NOT "held true through the present day".
        # This used to default to str(datetime.now().year), which silently asserted
        # that a town's LAST known citation -- often a wartime ghetto count or a single
        # postwar survivor tally -- remained true for decades afterward, including
        # straight through the Holocaust in towns with no later citation to contradict
        # it (found 2026-09-17: this alone accounted for a ~400,000-person inflation of
        # Poland's implied 2020 Jewish population, e.g. Belzec's camp-wide death toll
        # rendering as the village's own population every year from 1942 to today). A
        # later real citation for this same city (handled by the loop below) still
        # correctly overrides this default with a real year_end.
        year_end = year_start
        pop_end = ""
        population = sanitize_population(population)
        own_year = int(year_start)
        for j in range(row_index + 1, len(all_rows)):
            if len(all_rows[j]) >= 7 and all_rows[j][1].strip() == city:
                next_year = sanitize_year(all_rows[j][5])
                next_pop = sanitize_population(all_rows[j][6])
                if not next_year:
                    continue
                try:
                    next_year_num = int(next_year)
                except ValueError:
                    continue
                # The Historian frequently records several distinct facts under the same
                # year (a census figure, a notable event, a second source, all dated e.g.
                # "1938"), and occasionally years arrive out of order. Either way, a
                # sibling row whose year isn't strictly later than this row's own year_start
                # is not really "the next segment" -- using it would set year_end to
                # (that year - 1), which is before this row even starts. Keep scanning
                # forward until a genuinely later year turns up.
                if next_year_num <= own_year:
                    continue
                year_end = str(next_year_num - 1)
                # Chain the next row's population onto THIS row only if this row has a population of
                # its own. A narrative row (no number) inheriting the next row's number got a blank
                # start and a real end, which the map reads as 0 -> N: a false ramp from zero over
                # the whole span (London 1936-2000 climbing to 149,789; Wroclaw 1100-1938 climbing
                # to 20,000). Found 2026-09-20: 510 rows across 222 towns. The next row's number is
                # still present as that row's own starting population, so nothing is lost.
                if next_pop and population:
                    pop_end = next_pop
                break

        probability = "high"
        if notes and ("uncertain" in notes.lower() or "unknown" in notes.lower()):
            probability = "medium"
        elif notes and ("estimated" in notes.lower() or "approx" in notes.lower()):
            probability = "medium"

        city_names = get_city_names(city, country, cache, do_lookup=do_lookup)

        return [
            country, city, longitude, latitude, year_estab, year_start, year_end,
            population, pop_end, probability, "1", "1",
            city_names.get('english', city), city_names.get('hebrew', ''),
            city_names.get('yiddish', ''), city_names.get('german', ''),
            city_names.get('other', ''), source, notes,
        ]
    except Exception as e:
        print(f"Error converting row {row_index}: {e}")
        return None


def detect_format(rows):
    if not rows:
        return "empty"
    first_row = rows[0]
    if len(first_row) == 19:
        return "kehilot"
    if len(first_row) == 9:
        return "input"
    return "unknown"


def convert_file(path, cache, do_lookup=True):
    """Convert one input file to a list of 19-column kehilot rows."""
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        file_data = list(reader)

    file_format = detect_format(file_data)
    if file_format == "empty":
        print("    empty file, skipping")
        return []

    if should_skip_file(file_data, file_format):
        print("    skipped: only one data row with no Jewish population (0/NA/empty)")
        return []

    converted = []
    if file_format == "kehilot":
        data_rows = file_data
        if data_rows and any(h in str(data_rows[0][0]).lower() for h in ['country', 'city']):
            data_rows = data_rows[1:]
        for row in data_rows:
            if len(row) >= 19:
                converted.append(row[:19])

    elif file_format == "input":
        data_rows = file_data
        if data_rows and any(h in str(data_rows[0][0]).lower() for h in ['country', 'town', 'name']):
            data_rows = data_rows[1:]
        for i, row in enumerate(data_rows):
            if len(row) < 9:
                continue
            country = row[0].strip()
            city = row[1].strip()
            longitude = convert_coordinate_to_decimal(row[2].strip())
            latitude = convert_coordinate_to_decimal(row[3].strip())
            year_estab = row[4].strip()
            year_data = row[5].strip()
            population = row[6].strip().replace('~', '').replace('>', '').replace('<', '')
            notes = row[7].strip()
            source = row[8].strip()
            converted_row = convert_single_row(
                country, city, longitude, latitude, year_estab, year_data,
                population, notes, source, i, data_rows, cache, do_lookup=do_lookup
            )
            if converted_row:
                converted.append(converted_row)
    else:
        cols = len(file_data[0]) if file_data else 0
        print(f"    unknown format ({cols} columns), skipping")

    return converted


def load_kehilot_csv(path):
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        rows = list(reader)
    if not rows:
        raise SystemExit(f"{path} is empty")
    return rows[0], rows[1:]


def row_key(row):
    """Dedup key: same city/country/period/source counts as the same fact already recorded."""
    return (row[0].strip().lower(), row[1].strip().lower(), row[5].strip(), row[6].strip(), row[17].strip().lower())


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('inputs', nargs='+', help='Input CSV file(s) or glob pattern(s)')
    parser.add_argument('--kehilot-csv', default=DEFAULT_KEHILOT_CSV,
                         help='Path to kehilot.csv to merge into (default: ../kehilot.csv relative to this script)')
    parser.add_argument('--cache-file', default=DEFAULT_CACHE_FILE,
                         help='Path to the city-names cache JSON (default: utils/city_names_cache.json)')
    parser.add_argument('--no-backup', action='store_true',
                         help='Skip creating a timestamped backup of kehilot.csv before writing')
    parser.add_argument('--no-name-lookup', action='store_true',
                         help='Skip the Wikipedia Hebrew/Yiddish/German name lookup for new cities (faster, leaves those columns blank)')
    args = parser.parse_args()

    input_files = []
    for pattern in args.inputs:
        matches = sorted(glob.glob(pattern))
        if matches:
            input_files.extend(matches)
        elif os.path.exists(pattern):
            input_files.append(pattern)
        else:
            print(f"Warning: no files matched '{pattern}'")
    if not input_files:
        print("No input files found.")
        sys.exit(1)

    do_lookup = not args.no_name_lookup
    cache = load_city_names_cache(args.cache_file) if do_lookup else {}

    all_converted = []
    print(f"\nProcessing {len(input_files)} file(s)...")
    for path in input_files:
        print(f"- {path}")
        rows = convert_file(path, cache, do_lookup=do_lookup)
        print(f"    -> {len(rows)} rows")
        all_converted.extend(rows)

    if do_lookup:
        save_city_names_cache(cache, args.cache_file)

    if not all_converted:
        print("\nNo rows to merge. Done.")
        return

    kehilot_path = os.path.abspath(args.kehilot_csv)
    header, existing_rows = load_kehilot_csv(kehilot_path)

    if not args.no_backup:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = os.path.join(os.path.dirname(kehilot_path), f"kehilot_backup_{timestamp}.csv")
        shutil.copy(kehilot_path, backup_path)
        print(f"\nBackup created: {backup_path}")

    existing_keys = {row_key(r) for r in existing_rows if len(r) >= 18}
    new_rows = []
    skipped_dupes = 0
    for row in all_converted:
        key = row_key(row)
        if key in existing_keys:
            skipped_dupes += 1
            continue
        new_rows.append(row)
        existing_keys.add(key)

    with open(kehilot_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(existing_rows)
        writer.writerows(new_rows)

    print(f"\nMerged {len(new_rows)} new rows into {kehilot_path} ({skipped_dupes} exact duplicates skipped).")
    print(f"kehilot.csv now has {len(existing_rows) + len(new_rows)} data rows.")


if __name__ == '__main__':
    main()
