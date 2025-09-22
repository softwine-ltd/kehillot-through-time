#!/usr/bin/env python3
"""
Script to fix polygon coordinates in events_polygon.csv
Replace generic polygons with historically accurate geographical areas
"""

import csv

def generate_accurate_polygons():
    """Generate historically accurate polygon coordinates for each event"""
    
    # Accurate historical polygon coordinates
    accurate_polygons = {
        # Kingdom of Israel (United Monarchy) - from Dan to Beersheba, Mediterranean to Jordan
        1: "((35.2,33.3),(35.6,33.2),(35.7,32.9),(35.8,32.5),(35.9,32.0),(35.8,31.5),(35.6,31.2),(35.2,31.0),(34.8,31.0),(34.4,31.1),(34.2,31.3),(34.1,31.6),(34.2,32.0),(34.3,32.4),(34.5,32.7),(34.8,33.0),(35.2,33.3))",
        
        # Kingdom of Israel (Northern Kingdom) - northern territories
        2: "((35.2,33.3),(35.6,33.2),(35.7,32.9),(35.8,32.5),(35.6,32.2),(35.4,32.0),(35.2,31.9),(34.8,31.9),(34.4,32.0),(34.2,32.2),(34.3,32.4),(34.5,32.7),(34.8,33.0),(35.2,33.3))",
        
        # Kingdom of Judah (Southern Kingdom) - southern territories  
        3: "((35.4,32.0),(35.6,31.8),(35.8,31.5),(35.6,31.2),(35.2,31.0),(34.8,31.0),(34.4,31.1),(34.2,31.3),(34.1,31.6),(34.2,31.9),(34.4,32.0),(35.4,32.0))",
        
        # Babylonian administrative zone around Jerusalem - small area around Jerusalem
        4: "((35.15,31.85),(35.25,31.85),(35.25,31.75),(35.15,31.75),(35.15,31.85))",
        
        # Babylonian Exile - Mesopotamia region with Jewish communities
        5: "((44.0,32.0),(46.0,32.2),(47.5,32.8),(48.5,33.5),(48.8,34.2),(48.5,34.8),(47.5,35.2),(46.0,35.0),(44.5,34.5),(44.0,33.8),(43.8,33.0),(44.0,32.0))",
        
        # Second Temple period - Persian rule - expanded Judea
        6: "((35.0,32.2),(35.8,32.0),(36.0,31.5),(35.8,31.0),(35.4,30.8),(34.8,30.9),(34.2,31.2),(33.9,31.6),(34.0,32.0),(34.4,32.2),(35.0,32.2))",
        
        # Hasmonean Kingdom - peak territorial extent
        7: "((34.8,33.2),(36.0,33.0),(36.2,32.5),(36.0,31.8),(35.8,31.2),(35.4,30.7),(34.6,30.8),(33.8,31.2),(33.6,31.8),(33.8,32.4),(34.2,32.8),(34.8,33.2))",
        
        # Roman Judea - Roman provincial boundaries
        8: "((35.0,32.5),(35.8,32.2),(36.0,31.6),(35.8,31.0),(35.2,30.8),(34.6,30.9),(34.0,31.3),(33.8,31.8),(34.0,32.2),(34.4,32.4),(35.0,32.5))",
        
        # Alexandria pogrom - city of Alexandria
        9: "((29.85,31.25),(29.95,31.25),(29.95,31.15),(29.85,31.15),(29.85,31.25))",
        
        # Talmudic period - Galilee region
        10: "((35.0,33.3),(35.6,33.2),(35.8,32.8),(35.6,32.5),(35.2,32.4),(34.8,32.5),(34.6,32.8),(34.8,33.1),(35.0,33.3))",
        
        # Babylonian Jewish academies - specific cities in Mesopotamia
        11: "((44.2,32.5),(45.8,32.7),(46.5,33.2),(46.8,33.8),(46.5,34.2),(45.8,34.0),(44.8,33.5),(44.2,33.0),(44.2,32.5))",
        
        # Early Jewish communities in France - northern France
        12: "((1.5,48.5),(4.0,48.8),(5.5,49.5),(5.8,50.2),(4.5,50.5),(2.5,50.2),(1.0,49.5),(1.5,48.5))",
        
        # Al-Andalus - Iberian Peninsula under Muslim rule
        13: "((-9.5,36.0),(-6.5,36.2),(-3.5,36.8),(-1.0,37.5),(0.5,38.5),(0.8,39.8),(-1.0,40.5),(-3.5,40.2),(-6.0,39.5),(-8.5,38.5),(-9.5,37.0),(-9.5,36.0))",
        
        # Rhineland Jewish communities - Rhine valley
        14: "((6.0,49.0),(8.5,49.2),(9.5,50.0),(9.8,51.0),(8.5,51.5),(7.0,51.2),(6.0,50.5),(5.8,49.8),(6.0,49.0))",
        
        # Medieval Jewish communities in France - broader France
        15: "((-1.0,47.0),(2.0,47.2),(5.0,47.8),(7.0,48.5),(7.5,49.8),(6.0,50.8),(3.0,51.0),(0.0,50.5),(-2.0,49.0),(-2.5,47.5),(-1.0,47.0))",
        
        # Medieval Jewish communities in England - England proper
        16: "((-5.5,50.0),(-2.0,50.2),(1.5,50.5),(1.8,52.0),(1.5,54.0),(-1.0,55.0),(-3.5,54.5),(-5.0,52.5),(-5.5,50.0))"
    }
    
    return accurate_polygons

def update_events_polygon_csv():
    """Update the events_polygon.csv file with accurate coordinates"""
    
    accurate_polygons = generate_accurate_polygons()
    
    # Read the original file
    with open('events_polygon.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows = list(reader)
    
    # Update polygon coordinates
    for i, row in enumerate(rows):
        polygon_id = i + 1
        if polygon_id in accurate_polygons:
            row[0] = accurate_polygons[polygon_id]  # Update polygon_coordinates column
    
    # Write back to file
    with open('events_polygon.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
    
    print(f"Updated {len(accurate_polygons)} polygon coordinates in events_polygon.csv")

if __name__ == "__main__":
    update_events_polygon_csv()
