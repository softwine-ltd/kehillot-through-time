#!/usr/bin/env python3
"""
Template for collecting real historical Jewish population data
This script provides a structured way to add verified data from reliable sources
"""

import csv
import shutil
from datetime import datetime

def backup_csv():
    """Create backup of original CSV"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f'kehilot_backup_{timestamp}.csv'
    shutil.copy('../kehilot.csv', backup_name)
    print(f"Created backup: {backup_name}")

def add_community_data(city_data):
    """Add verified community data to CSV"""
    
    # Load existing data
    with open('../kehilot.csv', 'r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        fieldnames = reader.fieldnames
        existing_data = list(reader)
    
    print(f"Loaded {len(existing_data)} existing communities")
    
    # Add new verified data
    all_data = existing_data + city_data
    
    # Write updated CSV
    with open('../kehilot.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_data)
    
    print(f"Added {len(city_data)} verified entries")
    print(f"Total communities: {len(all_data)}")

def create_city_template(city_name, country, lat, lon, year_estab, hebrew_name="", yiddish_name="", german_name=""):
    """Create a template for adding a city with multiple time periods"""
    
    print(f"\nCreating template for {city_name}, {country}")
    print("Please fill in the population data for each time period:")
    print("(Leave empty if no data available)")
    
    periods = [
        ("1750-1800", "Pre-modern period"),
        ("1800-1850", "Early modern period"), 
        ("1850-1900", "Industrial period"),
        ("1900-1920", "Pre-WWI period"),
        ("1920-1950", "Interwar and WWII period"),
        ("1950-2023", "Post-war period")
    ]
    
    city_entries = []
    
    for period, description in periods:
        print(f"\n{period} ({description}):")
        pop_start = input(f"  Population at start of period: ").strip()
        pop_end = input(f"  Population at end of period: ").strip()
        source = input(f"  Source of data: ").strip()
        comment = input(f"  Additional comments: ").strip()
        
        if pop_start or pop_end:  # Only add if there's some data
            year_start, year_end = period.split('-')
            
            entry = {
                'country': country,
                'city': city_name,
                'long': str(lon),
                'lat': str(lat),
                'year_estab': str(year_estab),
                'year_start': year_start,
                'year_end': year_end,
                'pop_start': pop_start or '0',
                'pop_end': pop_end or '0',
                'probability': '',
                'type': '',
                'symbol': '',
                'city_english': '',
                'city_hebrew': hebrew_name,
                'city_yid': yiddish_name,
                'city_german': german_name,
                'city_other': '',
                'source': source or 'Manual data collection',
                'comment': comment or f'Historical Jewish community data - {period}'
            }
            city_entries.append(entry)
    
    return city_entries

def main():
    print("HISTORICAL JEWISH POPULATION DATA COLLECTION")
    print("=" * 50)
    print("\nThis script helps you add verified historical data.")
    print("Make sure to have reliable sources ready before starting.")
    
    print("\nAvailable options:")
    print("1. Add data for a new city")
    print("2. View data collection guide")
    print("3. Exit")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        print("\n" + "="*50)
        print("ADDING NEW CITY DATA")
        print("="*50)
        
        city_name = input("City name: ").strip()
        country = input("Country: ").strip()
        lat = float(input("Latitude: ").strip())
        lon = float(input("Longitude: ").strip())
        year_estab = int(input("Year Jewish community established: ").strip())
        hebrew_name = input("Hebrew name (optional): ").strip()
        yiddish_name = input("Yiddish name (optional): ").strip()
        german_name = input("German name (optional): ").strip()
        
        city_data = create_city_template(city_name, country, lat, lon, year_estab, hebrew_name, yiddish_name, german_name)
        
        if city_data:
            print(f"\nCreated {len(city_data)} entries for {city_name}")
            save = input("Save to CSV? (y/n): ").strip().lower()
            if save == 'y':
                backup_csv()
                add_community_data(city_data)
                print("✅ Data saved successfully!")
            else:
                print("Data not saved.")
        else:
            print("No data entered.")
            
    elif choice == "2":
        print_data_collection_guide()
    else:
        print("Goodbye!")

def print_data_collection_guide():
    """Print comprehensive data collection guide"""
    print("\n" + "="*60)
    print("COMPREHENSIVE DATA COLLECTION GUIDE")
    print("="*60)
    
    print("\n📚 RELIABLE SOURCES:")
    print("1. IIJG Maps (Primary source):")
    print("   - https://www.iijg.org/tools-and-technologies/maps-of-jewish-communities/")
    print("   - Covers 827 communities from 1750-1950")
    print("   - Interactive maps with population data")
    
    print("\n2. JewishGen Communities Database:")
    print("   - https://www.jewishgen.org/communities/")
    print("   - Over 6,000 communities worldwide")
    print("   - Historical population data")
    
    print("\n3. Jewish Virtual Library:")
    print("   - https://www.jewishvirtuallibrary.org/")
    print("   - Country-specific Jewish history")
    print("   - Population statistics")
    
    print("\n4. Academic Sources:")
    print("   - Historical census data")
    print("   - Academic papers on Jewish demography")
    print("   - Local historical societies")
    
    print("\n📊 DATA TO COLLECT:")
    print("For each city, collect:")
    print("- Population figures for 6 time periods")
    print("- Establishment year of Jewish community")
    print("- Historical names (Hebrew, Yiddish, German)")
    print("- Source of each data point")
    print("- Comments about the community")
    
    print("\n⏰ TIME PERIODS:")
    periods = [
        ("1750-1800", "Pre-modern period", "Early Jewish settlements"),
        ("1800-1850", "Early modern period", "Enlightenment and emancipation"),
        ("1850-1900", "Industrial period", "Mass migration and urbanization"),
        ("1900-1920", "Pre-WWI period", "Peak Jewish populations"),
        ("1920-1950", "Interwar and WWII period", "Decline due to persecution"),
        ("1950-2023", "Post-war period", "Recovery and modern communities")
    ]
    
    for period, name, description in periods:
        print(f"  {period}: {name} - {description}")
    
    print("\n✅ QUALITY CHECKLIST:")
    print("- Verify data from at least 2 sources")
    print("- Note the reliability of each source")
    print("- Use ranges when exact figures unavailable")
    print("- Document any uncertainties")
    print("- Check for consistency across time periods")
    
    print("\n🚀 RECOMMENDED WORKFLOW:")
    print("1. Start with major cities (Warsaw, Berlin, Vienna, etc.)")
    print("2. Use IIJG maps as primary source")
    print("3. Cross-reference with JewishGen database")
    print("4. Add smaller communities gradually")
    print("5. Always backup before making changes")
    
    print("\n💡 TIPS:")
    print("- Population figures can vary between sources")
    print("- Some communities may not have data for all periods")
    print("- Focus on accuracy over completeness")
    print("- Document your sources clearly")
    print("="*60)

if __name__ == "__main__":
    main()
