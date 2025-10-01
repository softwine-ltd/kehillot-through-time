#!/usr/bin/env python3
"""
CSV Converter GUI for kehilot.csv format
Converts CSV files with specific columns to kehilot.csv format
"""
import os
import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import csv
import pandas as pd
import webbrowser
import requests
from bs4 import BeautifulSoup
import re
import pyperclip
import threading

class CSVConverterGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("CSV Converter for kehilot.csv")
        self.root.geometry("2400x1300+100+50")
        
        # Data storage
        self.original_data = None
        self.converted_data = None
        self.df = None
        self.input_file_path = None  # Store the input file path
        self.input_format = "unknown"  # Format detection: "input", "kehilot", "unknown"
        
        # City names cache
        self.cache_file = "utils/city_names_cache.json"
        self.city_names_cache = {}
        self.load_city_names_cache()
        
        self.setup_ui()
        
    def setup_ui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # File selection frame
        file_frame = ttk.LabelFrame(main_frame, text="File Selection", padding="5")
        file_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Button(file_frame, text="Select CSV File", command=self.select_file).grid(row=0, column=0, padx=(0, 10))
        self.file_label = ttk.Label(file_frame, text="No file selected")
        self.file_label.grid(row=0, column=1, sticky=tk.W)
        
        # Convert button
        ttk.Button(file_frame, text="Convert to kehilot.csv format", command=self.convert_data).grid(row=0, column=2, padx=(10, 0))
        
        # Progress bar
        self.progress = ttk.Progressbar(file_frame, mode='indeterminate')
        self.progress.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Data display frame
        data_frame = ttk.LabelFrame(main_frame, text="Converted Data (Double-click to edit cells)", padding="5")
        data_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        # Treeview for data display
        columns = ['line_num', 'country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
                  'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
                  'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment']
        
        self.tree = ttk.Treeview(data_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        for col in columns:
            if col == 'line_num':
                self.tree.heading(col, text='#')
                self.tree.column(col, width=20, minwidth=10)
            elif  col in ['source', 'comment']:
                self.tree.heading(col, text=col)
                self.tree.column(col, width=150, minwidth=100)
            elif col in ['year_estab', 'year_start', 'year_end']:
                self.tree.heading(col, text=col)
                self.tree.column(col, width=30, minwidth=50)
            elif col in ['type', 'symbol']:
                self.tree.heading(col, text=col)
                self.tree.column(col, width=30, minwidth=50)
            else:
                self.tree.heading(col, text=col)
                self.tree.column(col, width=70, minwidth=50)
        
        # Scrollbars
        v_scrollbar = ttk.Scrollbar(data_frame, orient=tk.VERTICAL, command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(data_frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Grid layout
        self.tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        # Configure grid weights
        data_frame.columnconfigure(0, weight=1)
        data_frame.rowconfigure(0, weight=1)
        
        # Bind events for editing
        self.tree.bind('<Double-1>', self.on_double_click)
        self.tree.bind('<Button-1>', self.on_single_click)
        self.tree.bind('<Button-3>', self.on_right_click)  # Right-click for context menu
        self.tree.bind('<F2>', self.on_f2_edit)  # F2 key to edit selected cell
        
        # Original data display frame (only for 9-column input files)
        self.original_data_frame = ttk.LabelFrame(main_frame, text="Original CSV Data (Selected Line + Next Line)", padding="5")
        self.original_data_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        # Treeview for original data display
        original_columns = ['line', 'Country', 'Town Name', 'Longitude', 'Latitude', 'Year Established', 
                           'Year of Population Data or Event', 'Size of Jewish Population', 'Notes', 'Source']
        
        self.original_tree = ttk.Treeview(self.original_data_frame, columns=original_columns, show='headings', height=2)
        
        # Configure original data columns
        for col in original_columns:
            if col == 'line':
                self.original_tree.heading(col, text='#')
                self.original_tree.column(col, width=30, minwidth=20)
            elif col in ['Notes', 'Source']:
                self.original_tree.heading(col, text=col)
                self.original_tree.column(col, width=200, minwidth=100)
            else:
                self.original_tree.heading(col, text=col)
                self.original_tree.column(col, width=100, minwidth=80)
        
        # Scrollbar for original data
        original_v_scrollbar = ttk.Scrollbar(self.original_data_frame, orient=tk.VERTICAL, command=self.original_tree.yview)
        original_h_scrollbar = ttk.Scrollbar(self.original_data_frame, orient=tk.HORIZONTAL, command=self.original_tree.xview)
        self.original_tree.configure(yscrollcommand=original_v_scrollbar.set, xscrollcommand=original_h_scrollbar.set)
        
        # Grid layout for original data
        self.original_tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        original_v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        original_h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        # Configure grid weights for original data
        self.original_data_frame.columnconfigure(0, weight=1)
        self.original_data_frame.rowconfigure(0, weight=1)
        
        # Initially hide the original data frame
        self.original_data_frame.grid_remove()
        
        # Variables for editing
        self.editing_item = None
        self.editing_column = None
        self.edit_window = None
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=0)  # Original data frame doesn't expand
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        
        # Action buttons frame
        action_frame = ttk.Frame(main_frame)
        action_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(10, 0))
        
        ttk.Button(action_frame, text="Save to CSV", command=self.save_to_csv).grid(row=0, column=0, padx=(0, 10))
        ttk.Button(action_frame, text="Copy to Clipboard", command=self.copy_to_clipboard).grid(row=0, column=1, padx=(0, 10))
        ttk.Button(action_frame, text="Refresh Data", command=self.refresh_display).grid(row=0, column=2)
        
        # Status label
        self.status_label = ttk.Label(main_frame, text="Ready")
        self.status_label.grid(row=4, column=0, columnspan=2, sticky=tk.W, pady=(10, 0))
        
    def select_file(self):
        """Select CSV file to convert"""
        file_path = filedialog.askopenfilename(
            title="Select CSV file",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        
        if file_path:
            self.input_file_path = file_path  # Store the input file path
            self.file_label.config(text=file_path)
            self.status_label.config(text=f"File selected: {file_path}")
            self.load_original_data(file_path)
    
    def load_original_data(self, file_path):
        """Load the original CSV data and detect format"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                self.original_data = list(reader)
            
            # Detect format based on number of columns
            if len(self.original_data) > 0:
                first_row = self.original_data[0]
                # Update status to show what we're checking
                self.status_label.config(text=f"Checking format: {len(first_row)} columns")
                print(f"DEBUG: First row has {len(first_row)} columns: {first_row[:5]}...")
                if len(first_row) == 19:
                    self.input_format = "kehilot"  # Already in kehilot.csv format
                    self.status_label.config(text=f"Loaded {len(self.original_data)} rows (kehilot.csv format) - displaying...")
                    # Hide the original data frame for 19-column files
                    self.original_data_frame.grid_remove()
                    # Immediately display the data since it's already in the correct format
                    try:
                        self._display_kehilot_data()
                    except Exception as e:
                        self.status_label.config(text=f"Error displaying: {str(e)}")
                        print(f"Error in _display_kehilot_data: {e}")
                elif len(first_row) == 9:
                    self.input_format = "input"  # Input format (9 columns)
                    self.status_label.config(text=f"Loaded {len(self.original_data)} rows (input format) - converting automatically...")
                    # Show the original data frame for 9-column files
                    self.original_data_frame.grid()
                    # Automatically start conversion for 9-column files
                    try:
                        self.convert_data()
                    except Exception as e:
                        self.status_label.config(text=f"Error converting: {str(e)}")
                        print(f"Error in convert_data: {e}")
                else:
                    self.input_format = "unknown"
                    self.status_label.config(text=f"Loaded {len(self.original_data)} rows (unknown format - {len(first_row)} columns)")
            else:
                self.input_format = "empty"
                self.status_label.config(text="File is empty")
                
        except Exception as e:
            self.status_label.config(text=f"Error loading file: {str(e)}")
            messagebox.showerror("Error", f"Failed to load file: {str(e)}")
    
    def _display_kehilot_data(self):
        """Immediately display kehilot.csv format data without conversion"""
        try:
            # Use the original data as converted data since it's already in the right format
            self.converted_data = self.original_data
            self.df = pd.DataFrame(self.converted_data)
            
            # Update the display
            self.refresh_display()
            self.status_label.config(text=f"Displayed {len(self.converted_data)} rows (kehilot.csv format)")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to display data: {str(e)}")
    
    def convert_data(self):
        """Convert the data to kehilot.csv format"""
        if not self.original_data:
            messagebox.showwarning("Warning", "Please select a file first")
            return
        
        self.progress.start()
        self.status_label.config(text="Converting data...")
        
        # Run conversion in a separate thread to prevent GUI freezing
        thread = threading.Thread(target=self._convert_data_thread)
        thread.daemon = True
        thread.start()
    
    def _convert_data_thread(self):
        """Convert data in a separate thread"""
        try:
            converted_rows = []
            
            if self.input_format == "kehilot":
                # Already in kehilot.csv format - just use as is
                data_rows = self.original_data
                for i, row in enumerate(data_rows):
                    if len(row) >= 19:  # Ensure we have enough columns for kehilot format
                        converted_rows.append(row)
            
            elif self.input_format == "input":
                # Input format - convert to kehilot.csv format
                # Check if first row is a header
                data_rows = self.original_data
                num_data_rows = len(data_rows)
                if num_data_rows > 0:
                    first_row = data_rows[0]
                    # Check if first row looks like a header
                    if any(header_word in first_row[0].lower() for header_word in ['country', 'town', 'name']):
                        data_rows = data_rows[1:]  # Skip header
                
                for i, row in enumerate(data_rows):
                    if len(row) < 9:  # Ensure we have enough columns
                        continue
                    self.status_label.config(text=f"Converting line {i}/{num_data_rows}...")
                    # Extract data from input format
                    country = row[0].strip()
                    city = row[1].strip()
                    longitude = row[2].strip()
                    latitude = row[3].strip()
                    year_estab = row[4].strip()
                    year_data = row[5].strip()
                    population = row[6].strip()
                    notes = row[7].strip()
                    source = row[8].strip()
                    
                    # Convert to kehilot.csv format
                    converted_row = self.convert_single_row(
                        country, city, longitude, latitude, year_estab, 
                        year_data, population, notes, source, i, data_rows
                    )
                    
                    if converted_row:
                        converted_rows.append(converted_row)
            
            else:
                # Unknown format - try to handle gracefully
                messagebox.showwarning("Warning", f"Unknown file format with {len(self.original_data[0]) if self.original_data else 0} columns")
                return
            
            self.converted_data = converted_rows
            self.df = pd.DataFrame(converted_rows)
            
            # Update GUI in main thread
            self.root.after(0, self._conversion_complete)
            
        except Exception as e:
            self.root.after(0, lambda: self._conversion_error(str(e)))
    
    def convert_single_row(self, country, city, longitude, latitude, year_estab, 
                          year_data, population, notes, source, row_index, all_rows):
        """Convert a single row to kehilot.csv format"""
        try:
            # Basic conversion
            year_start = year_data if year_data and year_data != 'NA' else year_estab
            
            # Find next row for same city to determine year_end and pop_end
            year_end = "2024"  # Default for last row
            pop_end = ""  # Default for last row
            
            # Look for next row with same city
            for j in range(row_index + 1, len(all_rows)):
                if len(all_rows[j]) >= 7 and all_rows[j][1].strip() == city:
                    next_year = all_rows[j][5].strip()
                    next_pop = all_rows[j][6].strip()
                    if next_year and next_year != 'NA':
                        try:
                            year_end = str(int(next_year) - 1)
                        except ValueError:
                            year_end = "2024"
                    if next_pop and next_pop != 'NA':
                        pop_end = next_pop
                    break
            
            # Determine probability based on notes
            probability = "high"
            if notes and ("uncertain" in notes.lower() or "unknown" in notes.lower()):
                probability = "medium"
            elif notes and ("estimated" in notes.lower() or "approx" in notes.lower()):
                probability = "medium"
            
            # Get additional city names (this will be done asynchronously)
            city_names = self.get_city_names(city, country)
            
            # Create converted row
            converted_row = [
                country,  # country
                city,     # city
                longitude,  # long
                latitude,   # lat
                year_estab, # year_estab
                year_start, # year_start
                year_end,   # year_end
                population if population != 'NA' else "",  # pop_start
                pop_end,    # pop_end
                probability, # probability
                "1",        # type
                "1",        # symbol
                city_names.get('english', city),  # city_english
                city_names.get('hebrew', ''),     # city_hebrew
                city_names.get('yiddish', ''),    # city_yid
                city_names.get('german', ''),     # city_german
                city_names.get('other', ''),      # city_other
                source,     # source
                notes       # comment
            ]
            
            return converted_row
            
        except Exception as e:
            print(f"Error converting row {row_index}: {str(e)}")
            return None
    
    def get_city_names(self, city, country):
        """Get additional city names from Wikipedia interlanguage links with caching"""
        # Create a cache key combining city and country
        cache_key = f"{city}|{country}".lower().strip()
        
        # Ensure cache is initialized
        if not hasattr(self, 'city_names_cache'):
            self.city_names_cache = {}
        
        # Check if we have this city in cache
        if cache_key in self.city_names_cache:
            cached_result = self.city_names_cache[cache_key].copy()
            cached_result['english'] = city  # Always use the current city name
            return cached_result
        
        city_names = {
            'english': city,
            'hebrew': '',
            'yiddish': '',
            'german': '',
            'other': ''
        }
        
        try:
            # Search Wikipedia for the city
            search_url = f"https://en.wikipedia.org/wiki/{city.replace(' ', '_')}"
            
            # Try to get the page with proper headers
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(search_url, timeout=10, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for interlanguage links - try multiple approaches
                interlang_links = []
                
                # Method 1: Look for the specific interlanguage section
                interlang_section = soup.find('div', class_='row uls-language-list uls-lcd')
                if interlang_section:
                    interlang_links = interlang_section.find_all('li', class_='interlanguage-link')
                
                # Method 2: Look for all links to other language Wikipedia pages
                if not interlang_links:
                    # Find all links to other language Wikipedia pages
                    all_links = soup.find_all('a', href=lambda x: x and 'wikipedia.org' in x and '/wiki/' in x)
                    # Filter out English Wikipedia links and non-article links
                    interlang_links = [link for link in all_links 
                                    if not link.get('href', '').startswith('https://en.wikipedia.org') 
                                    and not link.get('href', '').startswith('//en.wikipedia.org')
                                    and ':' not in link.get('href', '').split('/wiki/')[-1]  # Exclude special pages
                                    and link.get_text().strip()]  # Must have text content
                
                # Method 3: Look in the language dropdown
                if not interlang_links:
                    lang_dropdown = soup.find('div', id='p-lang')
                    if lang_dropdown:
                        interlang_links = lang_dropdown.find_all('a', href=lambda x: x and 'wikipedia.org' in x and '/wiki/' in x)
                
                if interlang_links:
                    for link in interlang_links:
                        href = link.get('href', '')
                        lang_code = link.get('lang', '')
                        
                        # Extract language code from href if available
                        if href and 'wikipedia.org' in href:
                            # Extract language code from URL like https://de.wikipedia.org/wiki/Prag
                            import re
                            lang_match = re.search(r'https://([a-z]{2,3})\.wikipedia\.org', href)
                            if lang_match:
                                lang_code = lang_match.group(1)
                        
                        # Get the city name from the title attribute (contains actual city name)
                        city_name = link.get('title', '').strip()
                        
                        # If title is empty, try the text
                        if not city_name:
                            city_name = link.get_text().strip()
                        
                        # Extract city name from title if it contains language info (e.g., "Praha – Czech")
                        if '–' in city_name:
                            city_name = city_name.split('–')[0].strip()
                        elif ' - ' in city_name:
                            city_name = city_name.split(' - ')[0].strip()
                        
                        # Remove language codes like "de:", "he:", etc.
                        if ':' in city_name and len(city_name.split(':')[0]) <= 3:
                            city_name = city_name.split(':', 1)[1].strip()
                        
                        # Skip if the result is too long (likely not a city name)
                        if len(city_name) > 50:
                            continue
                        
                        # Skip if it doesn't look like a city name
                        if (len(city_name.split()) > 3 or 
                            any(char in city_name for char in ['(', ')', '[', ']', '{', '}']) or
                            ' ' in city_name and len(city_name.split()) > 2 or
                            any(word in city_name.lower() for word in ['university', 'school', 'college', 'institute', 'academy', 'center', 'centre', 'vysoká', 'škola', 'stanisławowska', 'vojtíšek', 'ernst', 'gustav', 'schultz', 'testnevelési', 'egyetem', 'gara', 'progresul', 'mäkelänrinteen', 'uintikeskus', 'stadsarkiv', 'skansen', 'restaurant', 'privatbane', 'parpusa', 'avenue', 'raphaël', 'präfektur', 'tokio'])):
                            continue
                        
                        # Skip common language names that are not city names
                        language_names = [
                            'עברית', 'יידיש', 'Deutsch', 'Afrikaans', 'English', 'Français', 'Español', 
                            'Italiano', 'Português', 'Русский', 'Polski', 'Čeština', 'Slovenčina',
                            'Magyar', 'Română', 'Български', 'Hrvatski', 'Српски', 'Українська',
                            'Беларуская', 'Lietuvių', 'Latviešu', 'Eesti', 'Suomi', 'Norsk', 'Svenska',
                            'Dansk', 'Íslenska', 'Gaeilge', 'Cymraeg', 'Malti', 'Slovenščina', 'Македонски',
                            'Shqip', 'Türkçe', 'Azərbaycan', 'Azərbaycanca', 'ქართული', 'Հայերեն', 'Қазақша', 'Кыргызча',
                            'O\'zbekcha', 'Монгол', '한국어', '日本語', '中文', 'ไทย', 'Tiếng Việt',
                            'हिन्दी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'മലയാളം', 'ಕನ್ನಡ', 'ગુજરાતી',
                            'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'नेपाली', 'සිංහල', 'မြန်မာ', 'ខ្មែរ',
                            'ລາວ', 'አማርኛ', 'ትግርኛ', 'Kiswahili', 'IsiZulu', 'IsiXhosa',
                            'Euskera', 'Euskara', 'Català', 'Galego', 'Nederlands', 'Alemannisch', 'Aragonés',
                            'Asturianu', 'Avañe\'ẽ', 'Basa Bali', 'Bân-lâm-gú'
                        ]
                        
                        if city_name in language_names:
                            continue
                        
                        # Skip if city_name is just a language code or very short
                        if city_name and len(city_name) <= 3 and city_name.islower():
                            continue
                            
                        if city_name and lang_code:
                            # Map to our target languages
                            if lang_code == 'de':  # German
                                city_names['german'] = city_name
                            elif lang_code == 'he':  # Hebrew
                                city_names['hebrew'] = city_name
                            elif lang_code == 'yi':  # Yiddish
                                city_names['yiddish'] = city_name
                            else:
                                # For other languages, prioritize local languages
                                local_languages = {
                                    'Prague': 'cs', 'Praha': 'cs',  # Czech
                                    'Warsaw': 'pl', 'Warszawa': 'pl',  # Polish
                                    'Moscow': 'ru', 'Moskva': 'ru',  # Russian
                                    'Kiev': 'uk', 'Kyiv': 'uk',  # Ukrainian
                                    'Budapest': 'hu',  # Hungarian
                                    'Bucharest': 'ro',  # Romanian
                                    'Sofia': 'bg',  # Bulgarian
                                    'Zagreb': 'hr',  # Croatian
                                    'Belgrade': 'sr', 'Beograd': 'sr',  # Serbian
                                    'Minsk': 'be',  # Belarusian
                                    'Vilnius': 'lt',  # Lithuanian
                                    'Riga': 'lv',  # Latvian
                                    'Tallinn': 'et',  # Estonian
                                    'Helsinki': 'fi',  # Finnish
                                    'Oslo': 'no',  # Norwegian
                                    'Stockholm': 'sv',  # Swedish
                                    'Copenhagen': 'da',  # Danish
                                    'Reykjavik': 'is',  # Icelandic
                                    'Dublin': 'ga',  # Irish
                                    'Cardiff': 'cy',  # Welsh
                                    'Valletta': 'mt',  # Maltese
                                    'Ljubljana': 'sl',  # Slovenian
                                    'Skopje': 'mk',  # Macedonian
                                    'Tirana': 'sq',  # Albanian
                                    'Istanbul': 'tr',  # Turkish
                                    'Baku': 'az',  # Azerbaijani
                                    'Tbilisi': 'ka',  # Georgian
                                    'Yerevan': 'hy',  # Armenian
                                    'Almaty': 'kk',  # Kazakh
                                    'Bishkek': 'ky',  # Kyrgyz
                                    'Tashkent': 'uz',  # Uzbek
                                    'Ulaanbaatar': 'mn',  # Mongolian
                                    'Seoul': 'ko',  # Korean
                                    'Tokyo': 'ja',  # Japanese
                                    'Beijing': 'zh',  # Chinese
                                    'Bangkok': 'th',  # Thai
                                    'Hanoi': 'vi',  # Vietnamese
                                    'New Delhi': 'hi',  # Hindi
                                    'Dhaka': 'bn',  # Bengali
                                    'Chennai': 'ta',  # Tamil
                                    'Hyderabad': 'te',  # Telugu
                                    'Kochi': 'ml',  # Malayalam
                                    'Bangalore': 'kn',  # Kannada
                                    'Ahmedabad': 'gu',  # Gujarati
                                    'Chandigarh': 'pa',  # Punjabi
                                    'Bhubaneswar': 'or',  # Odia
                                    'Guwahati': 'as',  # Assamese
                                    'Kathmandu': 'ne',  # Nepali
                                    'Colombo': 'si',  # Sinhala
                                    'Yangon': 'my',  # Burmese
                                    'Phnom Penh': 'km',  # Khmer
                                    'Vientiane': 'lo',  # Lao
                                    'Addis Ababa': 'am',  # Amharic
                                    'Asmara': 'ti',  # Tigrinya
                                    'Nairobi': 'sw',  # Swahili
                                    'Cape Town': 'af',  # Afrikaans
                                    'Johannesburg': 'af',  # Afrikaans
                                    'Bilbao': 'eu',  # Basque
                                    'Barcelona': 'ca',  # Catalan
                                    'Santiago': 'gl',  # Galician
                                    'Lisbon': 'pt',  # Portuguese
                                    'Madrid': 'es',  # Spanish
                                    'Paris': 'fr',  # French
                                    'Rome': 'it',  # Italian
                                    'Amsterdam': 'nl',  # Dutch
                                }
                                
                                # Check if this is a local language for the current city
                                is_local = False
                                for city_variant, local_lang in local_languages.items():
                                    if (city_variant.lower() in city.lower() or 
                                        city.lower() in city_variant.lower()):
                                        if lang_code == local_lang:
                                            is_local = True
                                            break
                                
                                # Set as 'other' with priority for local languages
                                if not city_names['other'] or is_local:
                                    city_names['other'] = city_name
                
                # If we didn't find interlanguage links, try the old method as fallback
                if not any(city_names[key] for key in ['hebrew', 'yiddish', 'german', 'other']):
                    # Look for alternative names in the infobox
                    infobox = soup.find('table', class_='infobox')
                    if infobox:
                        # Look for native name or other language names
                        for row in infobox.find_all('tr'):
                            th = row.find('th')
                            td = row.find('td')
                            if th and td:
                                th_text = th.get_text().strip().lower()
                                td_text = td.get_text().strip()
                                
                                # Check for Hebrew name
                                if 'hebrew' in th_text or 'עברית' in th_text:
                                    city_names['hebrew'] = td_text
                                # Check for German name
                                elif 'german' in th_text or 'deutsch' in th_text:
                                    city_names['german'] = td_text
                                # Check for Yiddish name
                                elif 'yiddish' in th_text or 'יידיש' in th_text:
                                    city_names['yiddish'] = td_text
                                # Check for native name
                                elif 'native' in th_text or 'local' in th_text:
                                    if any('\u0590' <= char <= '\u05FF' for char in td_text):  # Hebrew characters
                                        city_names['hebrew'] = td_text
                                    elif any('\u0400' <= char <= '\u04FF' for char in td_text):  # Cyrillic characters
                                        city_names['other'] = td_text
                                    else:
                                        city_names['other'] = td_text
                    
                    # Also look for alternative names in the first paragraph
                    first_para = soup.find('p')
                    if first_para:
                        text = first_para.get_text()
                        # Look for patterns like "City Name (Hebrew: עברית)"
                        import re
                        hebrew_match = re.search(r'\([^)]*[Hh]ebrew[^)]*:?\s*([^)]+)\)', text)
                        if hebrew_match:
                            city_names['hebrew'] = hebrew_match.group(1).strip()
                        
                        german_match = re.search(r'\([^)]*[Gg]erman[^)]*:?\s*([^)]+)\)', text)
                        if german_match:
                            city_names['german'] = german_match.group(1).strip()
        
        except Exception as e:
            # If web search fails, fall back to basic mappings
            print(f"Web search failed for {city}: {str(e)}")
            pass
        
        # Fallback to basic mappings if web search didn't find anything
        if not any(city_names[key] for key in ['hebrew', 'yiddish', 'german', 'other']):
            common_mappings = {
                'Jerusalem': {'hebrew': 'ירושלים', 'yiddish': 'ירושלים', 'german': 'Jerusalem'},
                'Tel Aviv': {'hebrew': 'תל אביב', 'yiddish': 'תל אביב', 'german': 'Tel Aviv'},
                'New York': {'hebrew': 'ניו יורק', 'yiddish': 'ניו יארק', 'german': 'New York'},
                'London': {'hebrew': 'לונדון', 'yiddish': 'לונדן', 'german': 'London'},
                'Paris': {'hebrew': 'פריז', 'yiddish': 'פאריז', 'german': 'Paris'},
                'Berlin': {'hebrew': 'ברלין', 'yiddish': 'בערלין', 'german': 'Berlin'},
                'Rome': {'hebrew': 'רומא', 'yiddish': 'רומא', 'german': 'Rom'},
                'Madrid': {'hebrew': 'מדריד', 'yiddish': 'מאדריד', 'german': 'Madrid'},
                'Amsterdam': {'hebrew': 'אמסטרדם', 'yiddish': 'אמסטערדאם', 'german': 'Amsterdam'},
                'Vienna': {'hebrew': 'וינה', 'yiddish': 'ווין', 'german': 'Wien'}
            }
            
            if city in common_mappings:
                city_names.update(common_mappings[city])
        
        # Store the result in cache
        cache_result = city_names.copy()
        cache_result['english'] = city  # Store the original city name
        self.city_names_cache[cache_key] = cache_result
        
        # Save cache
        if len(self.city_names_cache):
            self.save_city_names_cache()
        
        return city_names
    
    def load_city_names_cache(self):
        """Load city names cache from file"""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    self.city_names_cache = json.load(f)
                print(f"Loaded {len(self.city_names_cache)} city names from cache")
            else:
                print("No city names cache file found, starting with empty cache")
        except Exception as e:
            print(f"Error loading city names cache: {e}")
            self.city_names_cache = {}
    
    def save_city_names_cache(self):
        """Save city names cache to file"""
        try:
            # Ensure the utils directory exists
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(self.city_names_cache, f, ensure_ascii=False, indent=2)
            print(f"Saved {len(self.city_names_cache)} city names to cache")
        except Exception as e:
            print(f"Error saving city names cache: {e}")
    
    def cleanup(self):
        """Cleanup method to save cache before closing"""
        self.save_city_names_cache()
    
    def on_double_click(self, event):
        """Handle double-click to start editing"""
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.tree.identify_row(event.y)
            column = self.tree.identify_column(event.x)
            if item and column:
                self.start_edit(item, column)
    
    def on_single_click(self, event):
        """Handle single click to select item"""
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.tree.identify_row(event.y)
            if item:
                self.tree.selection_set(item)
                # Update original data display if this is a 9-column input file
                if self.input_format == "input" and self.original_data is not None:
                    self.update_original_data_display(item)
    
    def on_right_click(self, event):
        """Handle right-click to show context menu"""
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.tree.identify_row(event.y)
            column = self.tree.identify_column(event.x)
            if item and column:
                self.tree.selection_set(item)
                self.show_context_menu(event, item, column)
    
    def show_context_menu(self, event, item, column):
        """Show context menu for editing"""
        context_menu = tk.Menu(self.root, tearoff=0)
        context_menu.add_command(label="Edit Cell", command=lambda: self.start_edit(item, column))
        context_menu.add_separator()
        context_menu.add_command(label="Copy Cell", command=lambda: self.copy_cell(item, column))
        context_menu.add_command(label="Clear Cell", command=lambda: self.clear_cell(item, column))
        
        try:
            context_menu.tk_popup(event.x_root, event.y_root)
        finally:
            context_menu.grab_release()
    
    def copy_cell(self, item, column):
        """Copy cell value to clipboard"""
        col_index = int(column.replace('#', '')) - 1
        values = self.tree.item(item, 'values')
        if col_index < len(values):
            self.root.clipboard_clear()
            self.root.clipboard_append(values[col_index])
            self.status_label.config(text="Cell value copied to clipboard")
    
    def clear_cell(self, item, column):
        """Clear cell value"""
        col_index = int(column.replace('#', '')) - 1
        self.update_cell(item, col_index, "")
    
    def on_f2_edit(self, event):
        """Handle F2 key to edit selected cell"""
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            # Get the first column for editing
            column = '#1'
            self.start_edit(item, column)
    
    def start_edit(self, item, column):
        """Start editing a cell"""
        # Get the column index
        col_index = int(column.replace('#', '')) - 1
        columns = ['line_num', 'country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
                  'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
                  'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment']
        
        if col_index >= len(columns):
            return
        
        col_name = columns[col_index]
        
        # Don't allow editing of line numbers
        if col_name == 'line_num':
            return
        
        # Get current value (adjust for line number column)
        current_value = self.tree.item(item, 'values')[col_index]
        
        # Get cell coordinates
        bbox = self.tree.bbox(item, column)
        if not bbox:
            return
        
        x, y, width, height = bbox
        
        # Create edit window
        self.edit_window = tk.Toplevel(self.root)
        self.edit_window.title(f"Edit {col_name}")
        self.edit_window.geometry("500x200")
        self.edit_window.transient(self.root)
        self.edit_window.grab_set()
        
        # Center the window
        self.edit_window.geometry("+%d+%d" % (
            self.root.winfo_rootx() + 100,
            self.root.winfo_rooty() + 100
        ))
        
        # Make sure window is on top
        self.edit_window.lift()
        self.edit_window.focus_force()
        
        # Create frame
        frame = ttk.Frame(self.edit_window, padding="10")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Label
        ttk.Label(frame, text=f"Edit {col_name}:").pack(anchor=tk.W, pady=(0, 5))
        
        # Text widget for editing
        text_widget = tk.Text(frame, height=4, wrap=tk.WORD)
        text_widget.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        text_widget.insert(tk.END, current_value)
        text_widget.focus()
        text_widget.tag_add(tk.SEL, "1.0", tk.END)
        text_widget.mark_set(tk.INSERT, "1.0")
        
        # Buttons frame
        button_frame = ttk.Frame(frame)
        button_frame.pack(fill=tk.X, pady=(10, 0))
        
        def save_edit():
            new_value = text_widget.get(1.0, tk.END).strip()
            self.update_cell(item, col_index, new_value)
            self.edit_window.destroy()
            self.edit_window = None
        
        def cancel_edit():
            self.edit_window.destroy()
            self.edit_window = None
        
        # Buttons
        save_btn = ttk.Button(button_frame, text="Save (Ctrl+Enter)", command=save_edit)
        save_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        cancel_btn = ttk.Button(button_frame, text="Cancel (Escape)", command=cancel_edit)
        cancel_btn.pack(side=tk.LEFT)
        
        # Add some spacing
        ttk.Label(button_frame, text="").pack(side=tk.LEFT, padx=(20, 0))
        
        # Bind keyboard shortcuts
        text_widget.bind('<Control-Return>', lambda e: save_edit())
        text_widget.bind('<Escape>', lambda e: cancel_edit())
        self.edit_window.bind('<Escape>', lambda e: cancel_edit())
        
        # Store editing info
        self.editing_item = item
        self.editing_column = col_index
    
    def update_cell(self, item, col_index, new_value):
        """Update a cell value"""
        if not self.converted_data:
            return
        
        # Get the item index
        item_index = self.tree.index(item)
        
        # Update the data (adjust for line number column)
        if item_index < len(self.converted_data):
            # col_index includes line number column, so subtract 1 for actual data
            data_col_index = col_index - 1
            if data_col_index >= 0 and data_col_index < len(self.converted_data[item_index]):
                self.converted_data[item_index][data_col_index] = new_value
                
                # Update the tree display
                values = list(self.tree.item(item, 'values'))
                values[col_index] = new_value
                self.tree.item(item, values=values)
            
            # Update status
            self.status_label.config(text=f"Updated row {item_index + 1}, column {col_index + 1}")
    
    def _conversion_complete(self):
        """Called when conversion is complete"""
        self.progress.stop()
        self.status_label.config(text=f"Conversion complete: {len(self.converted_data)} rows")
        self.refresh_display()
    
    def _conversion_error(self, error_msg):
        """Called when conversion encounters an error"""
        self.progress.stop()
        messagebox.showerror("Conversion Error", f"Failed to convert data: {error_msg}")
        self.status_label.config(text="Conversion failed")
    
    def refresh_display(self):
        """Refresh the data display"""
        if self.df is not None:
            # Clear existing data
            for item in self.tree.get_children():
                self.tree.delete(item)
            
            # Insert new data with line numbers
            for index, row in self.df.iterrows():
                # Add line number as first column
                values_with_line_num = [index + 1] + list(row)
                self.tree.insert('', 'end', values=values_with_line_num)
    
    def save_to_csv(self):
        """Save the converted data to a new CSV file"""
        if self.converted_data is None:
            messagebox.showwarning("Warning", "No data to save")
            return
        
        # Generate default filename based on input file
        default_filename = ""
        initialdir = "c:"
        if self.input_file_path:
            initialdir, initial_filename = os.path.split(self.input_file_path)
            # Replace .csv with _kehilot.csv
            if initial_filename.lower().endswith('.csv'):
                default_filename = initial_filename.replace('.csv', "_kehilot.csv")
            elif initial_filename.lower().endswith('.txt'):
                default_filename = initial_filename.replace('.txt', "_kehilot.csv")
            else:
                default_filename = self.input_file_path + "_kehilot.csv"
        
        file_path = filedialog.asksaveasfilename(
            title="Save converted data",
            defaultextension=".csv",
            initialdir=initialdir,
            initialfile=default_filename,
            filetypes=[("CSV files", "*.csv"), ("text files", "*.txt"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                # Write CSV file
                with open(file_path, 'w', encoding='utf-8', newline='') as f:
                    writer = csv.writer(f)
                    
                    # Write header
                    header = ['country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
                             'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
                             'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment']
                    writer.writerow(header)
                    
                    # Write data
                    writer.writerows(self.converted_data)
                
                self.status_label.config(text=f"Data saved to {file_path}")
                messagebox.showinfo("Success", f"Data saved to {file_path}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save file: {str(e)}")
    
    def copy_to_clipboard(self):
        """Copy the converted data to clipboard in CSV format"""
        if self.converted_data is None:
            messagebox.showwarning("Warning", "No data to copy")
            return
        
        try:
            # Create CSV string
            csv_string = "country,city,long,lat,year_estab,year_start,year_end,pop_start,pop_end,probability,type,symbol,city_english,city_hebrew,city_yid,city_german,city_other,source,comment\n"
            
            for row in self.converted_data:
                csv_string += ",".join(f'{str(cell)}' for cell in row) + "\n"
            
            # Copy to clipboard
            pyperclip.copy(csv_string)
            self.status_label.config(text="Data copied to clipboard")
            messagebox.showinfo("Success", "Data copied to clipboard")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to copy to clipboard: {str(e)}")
    
    def update_original_data_display(self, selected_item):
        """Update the original data display with the selected line and next line"""
        if self.original_data is None or len(self.original_data) <= 1:
            return
        
        # Clear existing data
        for item in self.original_tree.get_children():
            self.original_tree.delete(item)
        
        # Get the selected row index from the Treeview item
        # The selected_item is a Treeview item ID, we need to get its position
        children = self.tree.get_children()
        try:
            selected_index = children.index(selected_item)
        except ValueError:
            # If item not found, return
            return
        
        # Keep the selected_index as is, but adjust the data access
        # The user reports seeing the next row instead of the selected row,
        # so we need to access the data with selected_index instead of selected_index + 1
        
        # Show the selected line and next line (if available)
        lines_to_show = []
        
          # Add the selected line (skip header row in original_data)
        if 0 <= selected_index < len(self.original_data) :
            lines_to_show.append((selected_index , self.original_data[selected_index ]))
        
        # Add the next line if it exists
        if selected_index + 1 < len(self.original_data):  # -1 to account for header
            lines_to_show.append((selected_index + 1, self.original_data[selected_index + 1]))  # +1 to skip header
        
        # Populate the treeview
        for line_num, row_data in lines_to_show:
            # Ensure we have enough columns (pad with empty strings if needed)
            while len(row_data) < 10:
                row_data.append("")
            
            # Insert the row
            self.original_tree.insert("", "end", values=[
                line_num,
                row_data[0] if len(row_data) > 0 else "",  # Country
                row_data[1] if len(row_data) > 1 else "",  # Town Name
                row_data[2] if len(row_data) > 2 else "",  # Longitude
                row_data[3] if len(row_data) > 3 else "",  # Latitude
                row_data[4] if len(row_data) > 4 else "",  # Year Established
                row_data[5] if len(row_data) > 5 else "",  # Year of Population Data or Event
                row_data[6] if len(row_data) > 6 else "",  # Size of Jewish Population
                row_data[7] if len(row_data) > 7 else "",  # Notes
                row_data[8] if len(row_data) > 8 else ""   # Source
            ])

def main():
    root = tk.Tk()
    app = CSVConverterGUI(root)
    
    # Set up cleanup on window close
    def on_closing():
        app.cleanup()
        root.destroy()
    
    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()

if __name__ == "__main__":
    main()
