import csv
from collections import Counter

# Read the CSV file and count occurrences of each city
city_counts = Counter()
cities_data = {}
with open('kehilot.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)  # Skip header
    for row in reader:
        if len(row) > 1:
            city = row[1]
            country = row[0]
            city_country = f'{country},{city}'
            city_counts[city_country] += 1
            cities_data[city_country] = row

# Find cities that appear only once
single_line_cities = []
for city_country, count in city_counts.items():
    if count == 1:
        row = cities_data[city_country]
        single_line_cities.append((city_country, row))

print(f'Found {len(single_line_cities)} cities with only one line:')
for i, (city_country, row) in enumerate(single_line_cities[:50]):  # Show first 50
    pop_start = row[7] if len(row) > 7 else 'N/A'
    print(f'{i+1:2d}. {city_country} - Population: {pop_start}')
