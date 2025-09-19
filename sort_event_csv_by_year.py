import csv
import sys

# Read the CSV file
with open('events.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

# Get header and data rows
header = rows[0]
data_rows = rows[1:]

# Sort by year_start (column 8, index 8)
data_rows.sort(key=lambda x: int(x[8]) if x[8].lstrip('-').isdigit() else 9999)

# Write sorted data back to file
with open('events.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data_rows)

print('Events sorted by year_start successfully!')