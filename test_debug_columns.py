import sys
import os
import csv

def test_debug_columns():
    """Debug the column count issue"""
    
    # Create a temporary file with 19 columns
    sample_kehilot_data = [
        ['country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
         'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
         'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment'],
        ['Test Country', 'Test City', '1.0', '1.0', '1000', '1000', '1100', 
         '100', '200', 'high', '1', '1', 'Test City', '', '', '', '', 'Test Source', 'Test Comment']
    ]
    
    # Create a temporary file
    temp_file = 'data_temp/test_kehilot.csv'
    with open(temp_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(sample_kehilot_data)
    
    print(f"Created temp file: {temp_file}")
    
    # Read it back and check columns
    with open(temp_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        data = list(reader)
    
    print(f"Data loaded: {len(data)} rows")
    if len(data) > 0:
        first_row = data[0]
        print(f"First row length: {len(first_row)}")
        print(f"First row: {first_row}")
        print(f"Length == 19: {len(first_row) == 19}")
    
    # Clean up
    if os.path.exists(temp_file):
        os.remove(temp_file)

if __name__ == "__main__":
    test_debug_columns()
