import pandas as pd
import requests
import json
import time


def get_nominatim_names(city_name, lat, lon):
    """
    Fetches alternative names using OpenStreetMap's Nominatim API.
    """
    # Nominatim requires a descriptive User-Agent
    headers = {'User-Agent': 'CityNameFetcher/1.0 (oferman@gmail.com)'}
    base_url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        'format': 'json',
        'lat': lat,
        'lon': lon,
        'zoom': 10,
        'namedetails': 1  # This is the key to getting alternative names
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        # 'namedetails' contains a dictionary of names in various languages
        namedetails = data.get('namedetails', {})

        # We collect all unique values from the name dictionary
        alt_names = list(set(namedetails.values()))
        return alt_names

    except Exception as e:
        print(f"  ! Error for {city_name}: {e}")
        return []


def process_cities_csv(input_csv, output_json):
    # 1. Load your CSV
    df = pd.read_excel(input_csv)

    # Standardize column names (Change the strings below if your CSV uses different names)
    col_city = 'City'
    col_lat = 'Latitude'
    col_lon = 'Longitude'
    col_country = 'Country'

    results = []

    print(f"Starting processing {len(df)} cities...")

    for index, row in df.iterrows():
        city = row[col_city]
        lat = row[col_lat]
        lon = row[col_lon]
        country = row[col_country]

        print(f"[{index + 1}/{len(df)}] Fetching: {city}, {country}...")

        # Get alternative names
        alternates = get_nominatim_names(city, lat, lon)

        # Combine input data with found alternates
        entry = {
            "original_name": city,
            "country": country,
            "latitude": lat,
            "longitude": lon,
            "alternative_names": alternates
        }
        results.append(entry)

        # Nominatim policy requires a limit of 1 request per second
        time.sleep(1.1)

    # 2. Save to JSON file
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=4, ensure_ascii=False)

    print(f"\nSuccess! Data saved to {output_json}")


# --- Execution ---
if __name__ == "__main__":
    # Ensure this CSV exists in your folder with headers: name, country, lat, lon
    INPUT_CSV = r'C:\Users\oferm\OneDrive\Ofer\europe_jews\european_cities_full_names_20250829_174341.xlsx'
    OUTPUT_JSON = 'city_alternatives.json'

    process_cities_csv(INPUT_CSV, OUTPUT_JSON)