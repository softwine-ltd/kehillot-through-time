# CSV Converter for kehilot.csv Format

This Python script provides a GUI application to convert CSV files with specific columns to the kehilot.csv format used in the "Kehillot Through Time" project.

## Features

- **File Selection**: Choose any CSV file through a user-friendly GUI
- **Data Conversion**: Automatically converts data to kehilot.csv format
- **Excel-like Interface**: View and edit converted data in a table format
- **Save Functionality**: Save converted data to a new CSV file with smart default naming
- **Clipboard Support**: Copy data to clipboard in CSV format
- **Automatic Year Calculation**: Calculates year_end based on next row's year_start
- **City Name Enhancement**: Attempts to find additional city names in different languages

## Input Format

The input CSV file should have the following columns (in order):

1. **Country** - Country name
2. **Town Name** - City/town name
3. **Longitude** - Longitude coordinate
4. **Latitude** - Latitude coordinate
5. **Year Established** - First known Jewish settlement year
6. **Year of Population Data or Event** - Year for this data point
7. **Size of Jewish Population** - Population number (use "NA" if unknown)
8. **Notes** - Additional notes about the data
9. **Source** - Source URL or reference

## Output Format

The script converts data to the kehilot.csv format with these columns:

- country, city, long, lat, year_estab, year_start, year_end, pop_start, pop_end, probability, type, symbol, city_english, city_hebrew, city_yid, city_german, city_other, source, comment

## Installation

1. Install required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the script:
```bash
python csv_converter_gui.py
```

## Usage

1. **Select File**: Click "Select CSV File" to choose your input file
2. **Convert Data**: Click "Convert to kehilot.csv format" to process the data
3. **Review Data**: View the converted data in the table interface
4. **Edit Data**: Make any necessary edits directly in the table
5. **Save or Copy**: Use "Save to CSV" (with smart default filename) or "Copy to Clipboard" to export the data

## Data Conversion Rules

- **year_start**: Uses "Year of Population Data or Event"
- **year_end**: Uses next row's year minus 1, or 2024 for the last row of each city
- **pop_start**: Uses "Size of Jewish Population" (empty if "NA")
- **pop_end**: Uses next row's population data (corrected from same row)
- **probability**: Set to "high" unless notes indicate uncertainty
- **type/symbol**: Set to "1" for all entries
- **City Names**: Searches Wikipedia interlanguage links for additional names in Hebrew, Yiddish, German, etc.

## Smart Filename Feature

When saving converted data, the application automatically suggests a filename based on the input file:
- **Input file**: `data.csv` → **Suggested output**: `data_kehilot.csv`
- **Input file**: `my_file.csv` → **Suggested output**: `my_file_kehilot.csv`
- **Input file**: `input.txt` → **Suggested output**: `input.txt_kehilot.csv`

This makes it easy to keep track of which files have been converted and maintain the relationship between input and output files.

## Sample Input

See `sample_input.csv` for an example of the expected input format.

## Requirements

- Python 3.6+
- pandas
- beautifulsoup4
- requests
- pyperclip
- tkinter (usually included with Python)

## Notes

- The script handles missing data gracefully
- City name enhancement is basic and may need manual editing
- Large files may take some time to process
- The GUI provides progress indication during conversion
