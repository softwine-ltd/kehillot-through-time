document.addEventListener('DOMContentLoaded', function () {
    // Load MarkerCluster after Leaflet is ready
    var markerClusterScript = document.createElement('script');
    markerClusterScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js';
    markerClusterScript.onload = initializeMap;  // Call initialization after MarkerCluster loads
    document.head.appendChild(markerClusterScript);
});
const expulsion_color ="#e74c3c"
const emigration_color ="#2ecc71"  // "#3498db"
const crusades_color = "#ff2222"
const historicalArrows = [
    {
        startLat: 31.7683,
        startLon: 35.2137,
        endLat: 33.351111,
        endLon: 43.786111,
        midLat: 32.5,
        midLon: 39.5,
        yearStart: -586,
        yearEnd: -516,
        titleEn: "Babylonian Exile",
        titleHe: "גלות בבל",
        color: expulsion_color,
        description: "Migration pattern from Jerusalem to major diaspora centers"
    },
        {
        startLat: 50,
        startLon: 5,
        endLat: 31.76830,
        endLon: 35.2137,
        midLat: 42,
        midLon: 32,
        yearStart: 1096,
        yearEnd: 1100,
        titleEn: "First Crusade",
        titleHe: "מסע הצלב הראשון",
        color: crusades_color,
        description: "First Crusade"
    },
    {
        startLat: 39.88207,
        startLon: -3.9341,
        endLat: 50,
        endLon: 13.4050,
        midLat: 45,
        midLon: 5,
        yearStart: 1492,
        yearEnd: 1600,
        titleEn: "Spanish Expulsion to Central Europe",
        titleHe: "גירוש ספרד למרכז אירופה",
        color: expulsion_color,
        description: "Migration of Sephardic Jews after the Spanish Inquisition"
    },
    {
        startLat: 39.88207,
        startLon: -3.9341,
        endLat: 30.045964312758123, 
        endLon: 31.236493887508182,
        midLat: 28,
        midLon: -13,
        yearStart: 1492,
        yearEnd: 1600,
        titleEn: "Spanish Expulsion to North Africa",
        titleHe: "גירוש ספרד לצפון אפריקה",
        color: expulsion_color,
        description: "Migration of Sephardic Jews after the Spanish Inquisition"
    },
    {
        startLat: 52.5200,
        startLon: 23.4050,
        endLat: 40.69857,
        endLon: -74.0401,
        midLat: 60,
        midLon: -25,
        yearStart: 1880,
        yearEnd: 1920,
        titleEn: "Eastern European Immigration to America",
        titleHe: "הגירה ממזרח אירופה לאמריקה",
        color: emigration_color,
        description: "Mass migration during the late 19th and early 20th centuries"
    },
    {
        startLat: 50.590556,
        startLon: 21.002778,
        endLat: 31.7683,
        endLon: 35.2137,
        midLat: 49.5,
        midLon: 17,
        yearStart: 1697,
        yearEnd: 1710,
        titleEn: "Aliyah of Judah HeHasid ",
        titleHe: " עליית רבי יהודה החסיד  (1000 איש)",
        color: emigration_color,
        description: "en.wikipedia.org/wiki/Judah_HeHasid_(Jerusalem)"
    }
];

const historicalEvents = [
    {
        year: -1313,
        titleEn: "Exodus",
        titleHe: "יציאת מצרים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1313)),
        url: "https://en.wikipedia.org/wiki/Exodus_(biblical_book)"
    },
    {
        year: -1205,
        titleEn: " Merneptah Stele: 'Israel is laid waste—its seed is no more' ",
        titleHe: "'ישראל הושם אין זרע לו' מצבת מרנפתח (מצבת ישראל)",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1205)),
        url: "https://en.wikipedia.org/wiki/Merneptah_Stele"
    },
    {
        year: -1000,
        titleEn: "Reign of King David",
        titleHe: "מלכות דוד",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1000)),
        url: "https://en.wikipedia.org/wiki/David"
    },
    {
        year: -928,
        titleEn: "Dissolution of the United Kingdom of Israel",
        titleHe: "פילוג ממלכת ישראל המאוחדת",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-928)),
        url: "https://en.wikipedia.org/wiki/Kingdom_of_Israel_(united_monarchy)"
    },
    {
        year: -722,
        titleEn: "Temple Destruction",
        titleHe: "חורבן ממלכת ישראל",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-722)),
        url: "https://en.wikipedia.org/wiki/Kingdom_of_Israel_(Samaria)"
    },
    {
        year: -586,
        titleEn: "Destruction of the First Temple",
        titleHe: "חורבן בית המקדש הראשון",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-586)),
        url: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(587_BC)"
    },
     {
        year: -457,
        titleEn: "Aliya of Ezra",
        titleHe: "עליית עזרא לירושלים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-457)),
        url: "https://en.wikipedia.org/wiki/Ezra"
    },
      {
        year: -167,
        titleEn: "Maccabean Revolt",
        titleHe: "מרד חשמונאים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-167)),
        url: "https://en.wikipedia.org/wiki/Maccabean_Revolt"
    },
    {
        year: 70,
        titleEn: "Destruction of the Second Temple",
        titleHe: "חורבן בית המקדש השני",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(70)),
        url: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(70_CE)"
    },
        {
        year: 132,
        titleEn: "Bar Kokhba revolt",
        titleHe: "מרד בר כוכבא",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(132)),
        url: "https://en.wikipedia.org/wiki/Bar_Kokhba_revolt"
    },
     {
        year: 200,
        titleEn: "End of Tannaim Period",
        titleHe: "סוף תקופת התנאים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(200)),
        url: "https://en.wikipedia.org/wiki/Tannaim"
    },
      {
        year: 500,
        titleEn: "End of Amoraim Period",
        titleHe: "סוף תקופת האמוראים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(500)),
        url: "https://en.wikipedia.org/wiki/Amoraim"
    },
    {
        year: 1038,
        titleEn: "End of Amoraim Geonim",
        titleHe: "סוף תקופת הגאונים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1038)),
        url: "https://en.wikipedia.org/wiki/Geonim"
    },
    {
        year: 1096,
        titleEn: "First Crusade",
        titleHe: "מסע הצלב הראשון",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1096)),
        url: "https://en.wikipedia.org/wiki/First_Crusade"
    },
    {
        year: 1147,
        titleEn: "Second Crusade",
        titleHe: "מסע הצלב השני",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1147)),
        url: "https://en.wikipedia.org/wiki/Second_Crusade"
    },
    {
        year: 1189,
        titleEn: "Exile from Spain",
        titleHe: "מסע הצלב השלישי",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1189)),
        url: "https://en.wikipedia.org/wiki/Third_Crusade"
    },
    {
        year: 1492,
        titleEn: "Exile from Spain and End of Rishonim Period",
        titleHe: "גירוש ספרד וסוף תקופת הראשונים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1492)),
        url: "https://en.wikipedia.org/wiki/Expulsion_of_Jews_from_Spain"
    },
    {
        year: 1939,
        titleEn: "The Holocaust",
        titleHe: "השואה",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1939)),
        url: "https://en.wikipedia.org/wiki/The_Holocaust"
    },
    {
        year: 1948,
        titleEn: "Israel Independence",
        titleHe: "הקמת מדינת ישראל",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1948)),
        url: "https://en.wikipedia.org/wiki/Israeli_Declaration_of_Independence"
    }
];

function numberToHebrewLetters(number) {
    const digits = {
        1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
        10: 'י', 20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס', 70: 'ע', 80: 'פ', 90: 'צ',
        100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת', 500: 'תק', 600: 'תר', 700: 'תש', 800: 'תת', 900: 'תתק'
    };

    let result = '';

    // Handle thousands
    const thousands = Math.floor(number / 1000);
    if (thousands > 0) {
        result = digits[thousands] + "'";  // Add the thousand digit with geresh
    }
    // Handle remaining digits
    let remaining = number % 1000;

    // Convert hundreds
    while (remaining >= 100) {
        const hundreds = Math.floor(remaining / 100) * 100;
        result += digits[hundreds];
        remaining %= 100;
    }

    // Convert tens
    if (remaining >= 10) {
        const tens = Math.floor(remaining / 10) * 10;
        remaining %= 10;
        if (remaining === 0) {
            result += '"';
            result += digits[tens];
        } else {
            result += digits[tens];
            result += '"';
        }
    }

    // Convert ones
    if (remaining > 0) {
        result += digits[remaining];
    }

    return result;
}

function convertToHebrewYear(gregorianYear) {
    // For CE years: add 3760
    // For BCE years: subtract from 3761
    const jewishYear = gregorianYear > 0
        ? gregorianYear + 3760
        : 3761 - Math.abs(gregorianYear);

    return jewishYear;
}
const startYear0 = -1400;
const endYear0 = 2023;
const totalRange0 = endYear0 - startYear0; // from -1400 to 2023

function addEventMarkers() {
    const timelineElement = document.getElementById('timeline');
    const totalRange = totalRange0; // from -1400 to 2023

    // Remove existing markers to avoid duplicates (e.g., on resize)
    const existingMarkers = timelineElement.querySelectorAll('.timeline-marker');
    existingMarkers.forEach(m => m.remove());

    historicalEvents.forEach(event => {
        const marker = document.createElement('div');
        marker.className = 'timeline-marker';

        const position = ((event.year - startYear0) / totalRange) * 100;
        marker.style.left = `${position}%`;

        const tooltip = document.createElement('div');
        tooltip.className = 'timeline-tooltip';

        // Create structured tooltip content
        const linkHtml = event.url ? `
            <div class="tooltip-link">
                <a href="${event.url}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-size: 11px;">
                    Learn more ↗
                </a>
            </div>
        ` : '';
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-hebrew">${event.titleHe}</div>
                <div class="tooltip-english">${event.titleEn}</div>
                <div class="tooltip-year">
                    ${event.year < 0 ? Math.abs(event.year) + ' BCE' : event.year + ' CE'} 
                    / ${event.hebrewYear}
                </div>
                ${linkHtml}
            </div>
        `;

        marker.appendChild(tooltip);
        
        // Add hover delay to prevent tooltip from disappearing too quickly
        let hoverTimeout;
        
        marker.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            tooltip.style.opacity = '1';
            tooltip.style.pointerEvents = 'auto';
        });
        
        marker.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.pointerEvents = 'none';
            }, 100);
        });
        
        tooltip.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            tooltip.style.opacity = '1';
            tooltip.style.pointerEvents = 'auto';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.pointerEvents = 'none';
            }, 100);
        });
        
        // Add click event handler to change the timeline year
        marker.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const timeline = document.getElementById('timeline');
            timeline.noUiSlider.set(event.year);
        });
        
        // Add cursor pointer style to indicate clickability
        marker.style.cursor = 'pointer';
        
        timelineElement.appendChild(marker);
    });
}

// Parse CSV while respecting quotes
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }

        if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
            continue;
        }

        current += char;
    }
    result.push(current); // Push the last field

    return result;
}


let markersLayer = {};
let currentMarkers = [];
let arrowsLayer = {};
let currentArrows = [];
// Data is fetched only once
let cachedCsvData = null; // Variable to store the data
let eventsLayer = {};
let currentEvents = [];
// Events data fetch (cached single fetch like kehilot)
const getEventsData = (() => {
    let dataPromise = null;
    return async () => {
        if (!dataPromise) {
            console.log("Fetching events data for the first time...");
            dataPromise = fetch('events.csv').then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            });
        } else {
            console.log("Events fetch already in progress or completed, returning existing promise.");
        }
        return dataPromise;
    };
})();

// Polygon events data fetch (cached single fetch like kehilot)
const getPolygonEventsData = (() => {
    let dataPromise = null;
    return async () => {
        if (!dataPromise) {
            console.log("Fetching polygon events data for the first time...");
            dataPromise = fetch('events_polygon.csv').then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            });
        } else {
            console.log("Polygon events fetch already in progress or completed, returning existing promise.");
        }
        return dataPromise;
    };
})();

// A self-executing function to create a private scope for our promise
const getData = (() => {
    let dataPromise = null;
  
    return async () => {
      // If the promise doesn't exist yet, create it
      if (!dataPromise) {
        console.log("Fetching data for the first time...");
        dataPromise = fetch('kehilot.csv').then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        });
      } else {
        console.log("Fetch already in progress or completed, returning existing promise.");
      }
      // Return the promise (either the new one or the existing one)
      return dataPromise;
    };
  })();

async function loadData(year) {
    try {
        // Check if data is already loaded
    //    if (!cachedCsvData) {
    //        console.log("Fetching data for the first time...");
    //        const response = await fetch('kehilot.csv');
    //        cachedCsvData = await response.text(); //  Store the data
    //        console.log("Data fetched and cached.");
    //        }
       console.log("Requesting data...");
         const csvData = await getData(); // This will only fetch the first time
         const csvText = csvData;

        // Parse CSV
        const rows = csvText.split('\n').slice(1); // Skip header
        const kehilot = rows
            .filter(row => row.trim()) // Skip empty rows
            .map(row => {
                const [
                    country, city, long, lat, year_estab, year_start, year_end,
                    pop_start, pop_end, probability, type, symbol,
                    city_english, city_hebrew, city_yid, city_german,
                    city_other, source, comment
                ] = parseCSVLine(row).slice(0, 19);


                // If year_end is empty, use current year
                const actualYearEnd = year_end == undefined || year_end.trim() === '' ? undefined : parseInt(year_end);
                const actualPopEnd = pop_end == undefined || pop_end.trim() === '' ? parseInt(pop_start) : parseInt(pop_end);
                if (actualYearEnd == undefined) {
                    actualPop = parseInt(pop_start);
                } else {    
                    const year_start_int = parseInt(year_start);
                    const years_span = actualYearEnd - year_start_int;
                    var actualPop = Math.floor(((actualYearEnd - year)*parseInt(pop_start) + (year - year_start_int)*actualPopEnd)/years_span);
                }
                
                return {
                    name: city, // Fallback to city if English name not available
                    name_he: city_hebrew,
                    lat: lat,
                    lon: long,
                    year_estab: parseInt(year_estab),
                    year_start: parseInt(year_start),
                    year_end: actualYearEnd,
                    population_start: parseInt(pop_start),
                    population_end: actualPopEnd,
                    actual_pop: actualPop,
                    confidence: probability, // Using probability as confidence indicator
                    type: parseInt(type),
                    symbol: parseInt(symbol),
                    country,
                    names: {
                        english: city_english,
                        yiddish: city_yid,
                        german: city_german,
                        other: city_other
                    },
                    source: source.replace(/"/g, ''), // Remove quotes from source
                    comment
                };
            });

        // Filter data based on the given year
        const relevantKehilot = kehilot.filter(kehila =>
            kehila.year_start <= year && (kehila.year_end === undefined || kehila.year_end >= year)
        );

        updateMarkers(relevantKehilot);
    } catch (error) {
        console.error('Error loading kehilot data:', error);
    }
}

function updateMarkers(kehilot) {
    // Clear existing markers
    markersLayer.clearLayers();
    currentMarkers = [];

    // Add new markers
    kehilot.forEach(kehila => {
        const marker = createCustomMarker(kehila);

        // const endYearDetails = kehila.year_end === undefined || kehila.year_end === '' ? '' : `
        //             <small>
        //                 שנת חורבן: ${kehila.year_end < 0 ? Math.abs(kehila.year_end) + ' BCE' : kehila.year_end + ' CE'}
        //                 (${numberToHebrewLetters(convertToHebrewYear(kehila.year_end))})
        //             </small>
        //             <br>
        // `;

        // const populationEndDetails = kehila.actual_pop === undefined || kehila.actual_pop === '' ? '' : `
        //             <div style="margin: 8px 0;">
        //                 <strong> אוכלוסייה:</strong> ${kehila.actual_pop.toLocaleString()}
        //             </div>
        // `;

        const commentDetails = kehila.comment === undefined || kehila.comment === '' ? '' : `
                    <div style="margin: 8px 0;">
                        <strong> הערות:</strong> ${kehila.comment}
                    </div>
        `;

        // Create popup content
        const popupContent = `
            <div style="direction: rtl; text-align: right;">
                <strong style="font-size: 16px;">${kehila.name_he}</strong>
                <br>
                ${kehila.name}
                <br>
                ${kehila.names.english ? `English: ${kehila.names.english} <br>` : ''}                
                ${kehila.names.yiddish ? `ייִדיש: ${kehila.names.yiddish} <br>` : ''}                
                ${kehila.names.german ? `Deutsch: ${kehila.names.german} <br>` : ''}                
                ${kehila.names.other ? `אחר: ${kehila.names.other} <br>` : ''}
                <div style="margin: 8px 0;">
                    <strong> אוכלוסייה:</strong> ${formatPopulation(kehila.actual_pop)}
                </div>
  
                <div style="
                    padding: 4px 8px;
                    background: ${getConfidenceColor(kehila.confidence)}22;
                    border-radius: 4px;
                    display: inline-block;
                    color: ${getConfidenceColor(kehila.confidence)};
                    font-size: 12px;
                ">
                    ${getConfidenceText(kehila.confidence)}
                </div>
                <div style="margin-top: 8px;">
                    <small>
                        שנת ייסוד: ${kehila.year_estab < 0 ? Math.abs(kehila.year_estab) + ' BCE' : kehila.year_estab + ' CE'}
                        (${numberToHebrewLetters(convertToHebrewYear(kehila.year_estab))})
                    </small>
                    <br>
                    <small>מקור: ${formatSource(kehila.source)}</small>
                    <br>
                    ${commentDetails}
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });
        currentMarkers.push(marker);
        markersLayer.addLayer(marker);
    });

    // Add marker cluster layer to map if not already added
    if (!map.hasLayer(markersLayer)) {
        map.addLayer(markersLayer);
    }
}
var playIntervalGlobal = null;
var animationSpeed = 4; // Default speed multiplier

function initializeMap() {
    // Initialize map
    map = L.map('map', {
        center: [41.9028, 25.4324],
        zoom: 5,
        minZoom: 3,
        maxZoom: 12,
        maxBounds: [
            [-60, -180],
            [80, 180]
        ]
    });

    // Create tile layers
    const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });
    
    const osmDeTileLayer = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });
    
    // CartoDB tile layer with English labels
    const cartoDbTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    // OpenMapTiles with English labels (requires API key, using demo)
    const openMapTilesEnLayer = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL', {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20
    });
    
    
    // Add default tile layer
    osmTileLayer.addTo(map);

    // Initialize markers layer with custom cluster icon
    markersLayer = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            const childCount = cluster.getChildCount();
            let totalPopulation = 0;
            
            // Calculate total population for all markers in this cluster
            cluster.getAllChildMarkers().forEach(marker => {
                // Access the population data from the marker's popup content or stored data
                if (marker.kehilaData && marker.kehilaData.actual_pop) {
                    totalPopulation += marker.kehilaData.actual_pop;
                }
            });
            
            // Format population with shorter format for large numbers
            const formattedPopulation = formatPopulation(totalPopulation);
            
            // Calculate cluster size based on total population using the same function as individual markers
            const clusterSize = getMarkerSize(totalPopulation);
            const iconSize = Math.max(32, clusterSize * 2.5); // Increased multiplier and minimum size for better readability
            const iconAnchor = iconSize / 2; // Center the anchor
            
            // Create cluster icon with count and population
            return L.divIcon({
                html: `<div style="
                    background-color: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    width: ${iconSize}px;
                    height: ${iconSize}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${Math.max(12, Math.min(18, iconSize * 0.3))}px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                    <div>${childCount}</div>
                    <div style="font-size: ${Math.max(9, Math.min(14, iconSize * 0.25))}px; margin-top: -2px;">${formattedPopulation}</div>
                </div>`,
                className: 'custom-cluster-icon',
                iconSize: [iconSize, iconSize],
                iconAnchor: [iconAnchor, iconAnchor]
            });
        }
    });
    map.addLayer(markersLayer);

    // Initialize arrows layer
    arrowsLayer = L.layerGroup();
    map.addLayer(arrowsLayer);

    // Initialize events layer (ellipses)
    eventsLayer = L.layerGroup();
    map.addLayer(eventsLayer);

    // Initialize timeline
    const timeline = document.getElementById('timeline');
    const yearDisplay = document.getElementById('year-display');

    noUiSlider.create(timeline, {
        start: [startYear0],
        range: {
            'min': [startYear0],
            'max': [endYear0]
        },
        step: 1,
        tooltips: false
    });
    addEventMarkers();

    // Add window resize handler to reposition markers
    window.addEventListener('resize', addEventMarkers);
    // Update year display and trigger data loading
    timeline.noUiSlider.on('update', function (values) {
        const year = parseInt(values[0]);
        const jewishYear = convertToHebrewYear(year);
        const hebrewLetters = numberToHebrewLetters(jewishYear);
        const yearText = year < 0
            ? `${Math.abs(year)} BCE (${hebrewLetters})`
            : `${year} CE (${hebrewLetters})`;
        yearDisplay.textContent = yearText;
        loadData(year);
        updateArrows(year);
        updateEvents(year);
    });

    // Add click functionality to year display for direct year input
    yearDisplay.addEventListener('click', function() {
        showYearInputDialog();
    });
    
    // Add visual indication that year display is clickable
    yearDisplay.style.cursor = 'pointer';
    yearDisplay.title = 'Click to enter a specific year';

    const playButton = document.getElementById('playButton');
    let isPlaying = false;

    // Speed control
    const speedControl = document.getElementById('speedControl');
    const speedDisplay = document.getElementById('speedDisplay');
    
    speedControl.addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
        speedDisplay.textContent = animationSpeed + 'x';
    });

    // Tile layer control
    const tileSelector = document.getElementById('tileSelector');
    let currentTileLayer = osmTileLayer;
    
    tileSelector.addEventListener('change', (e) => {
        const selectedTile = e.target.value;
        
        // Remove current tile layer
        map.removeLayer(currentTileLayer);
        
        // Add new tile layer based on selection
        switch(selectedTile) {
            case 'osm-de':
                currentTileLayer = osmDeTileLayer;
                break;
            case 'cartodb':
                currentTileLayer = cartoDbTileLayer;
                break;
            case 'maptiler':
                currentTileLayer = openMapTilesEnLayer;
                break;
            default:
                currentTileLayer = osmTileLayer;
        }
        
        currentTileLayer.addTo(map);
    });

    // Map center control
    const mapCenterSelector = document.getElementById('mapCenterSelector');
    
    mapCenterSelector.addEventListener('change', (e) => {
        const selectedCenter = e.target.value;
        
        if (selectedCenter === 'europe') {
            // Center on Europe & Middle East (Bulgaria)
            map.setView([41.9028, 25.4324], 5);
        } else if (selectedCenter === 'americas') {
            // Center on Americas (US)
            map.setView([38, -90], 5);
        }
    });

    // City search functionality
    const citySearch = document.getElementById('citySearch');
    const clearSearch = document.getElementById('clearSearch');
    let searchMarker = null;
    let searchLayer = null;

    // Initialize search layer
    searchLayer = L.layerGroup();
    map.addLayer(searchLayer);

    // Search function
    async function searchCity(cityName) {
        if (!cityName.trim()) return;

        try {
            // Use Nominatim geocoding service
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1`, {
                headers: {
                    'User-Agent': 'JewishCommunitiesMap/1.0'
                }
            });
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                
                // Remove existing search marker
                if (searchMarker) {
                    searchLayer.removeLayer(searchMarker);
                }
                
                // Create new search marker
                searchMarker = L.marker([lat, lon], {
                    icon: L.divIcon({
                        className: 'search-marker',
                        html: `<div style="
                            width: 20px;
                            height: 20px;
                            background: #ef4444;
                            border: 3px solid white;
                            border-radius: 50%;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                            animation: pulse 2s infinite;
                        "></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                });
                
                // Add popup with search result info
                searchMarker.bindPopup(`
                    <div style="direction: rtl; text-align: right;">
                        <strong>${result.display_name}</strong>
                        <br>
                        <small>Search result</small>
                    </div>
                `);
                
                searchLayer.addLayer(searchMarker);
                
                // Zoom to the location
                map.setView([lat, lon], 8);
                
                // Open popup
                searchMarker.openPopup();
                
                console.log('Found city:', result.display_name);
            } else {
                alert('City not found. Please try a different name.');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        }
    }

    // Search on Enter key
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchCity(citySearch.value);
        }
    });

    // Clear search
    clearSearch.addEventListener('click', () => {
        citySearch.value = '';
        if (searchMarker) {
            searchLayer.removeLayer(searchMarker);
            searchMarker = null;
        }
    });

    // Print functionality
    const printButton = document.getElementById('printButton');
    
    printButton.addEventListener('click', () => {
        try {
            // Check if required elements exist
            if (!map) {
                throw new Error('Map not initialized');
            }
            if (!timeline || !timeline.noUiSlider) {
                throw new Error('Timeline not initialized');
            }
            
            // Get current map state
            const center = map.getCenter();
            const zoom = map.getZoom();
            const currentYear = Math.round(timeline.noUiSlider.get());
            const yearDisplay = currentYear < 0 ? `${Math.abs(currentYear)} BCE` : `${currentYear} CE`;
            const mapView = mapCenterSelector.value === 'europe' ? 'Europe & Middle East' : 'Americas';
            
            // Create a simple print view by hiding controls and printing the current page
            const originalControls = document.querySelector('.controls');
            const originalTimeline = document.querySelector('#timeline');
            const originalYearSteps = document.querySelector('#year-steps');
            const originalTitle = document.querySelector('h1');
            const originalSubtitle = document.querySelector('p');
            const timelineLabels = document.querySelector('.flex.justify-between.mt-2');
            const yearDisplayElement = document.querySelector('#year-display');
            const speedDisplay = document.getElementById('speedDisplay');
            
            // Hide all controls and original title
            if (originalControls) originalControls.style.display = 'none';
            if (originalTimeline) originalTimeline.style.display = 'none';
            if (originalYearSteps) originalYearSteps.style.display = 'none';
            if (originalTitle) originalTitle.style.display = 'none';
            if (originalSubtitle) originalSubtitle.style.display = 'none';
            if (timelineLabels) timelineLabels.style.display = 'none';
            if (yearDisplayElement) yearDisplayElement.style.display = 'none';
            if (speedDisplay) speedDisplay.style.display = 'none';
            
            // Hide all Leaflet controls
            const leafletControls = document.querySelectorAll('.leaflet-control-container');
            leafletControls.forEach(control => {
                control.style.display = 'none';
            });
            
            // Hide all buttons and interactive elements
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.display = 'none';
            });
            
            // Hide all select elements
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                select.style.display = 'none';
            });
            
            // Hide all input elements
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.display = 'none';
            });
            
            // Hide all labels
            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                label.style.display = 'none';
            });
            
            // Add print header with smaller title
            const printHeader = document.createElement('div');
            printHeader.className = 'print-header';
            printHeader.innerHTML = `
                <div style="text-align: center; margin-bottom: 10px; padding-bottom: 5px;">
                    <h2 style="margin: 0; color: #333; font-size: 16px; font-weight: normal;">Jewish Demographics & Historical Communities Map</h2>
                    <p style="margin: 2px 0 0 0; color: #666; font-size: 12px;">Year: ${yearDisplay}</p>
                </div>
            `;
            document.body.insertBefore(printHeader, document.body.firstChild);
            
            // Ensure map is properly sized for print
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.style.height = '90vh';
                mapElement.style.width = '100%';
                mapElement.style.maxWidth = '100%';
                
                // Trigger map resize to ensure proper rendering
                setTimeout(() => {
                    if (map && map.invalidateSize) {
                        map.invalidateSize();
                    }
                }, 100);
            }
            
            // Trigger print after a short delay to ensure map is properly sized
            setTimeout(() => {
                window.print();
            }, 200);
            
            // Restore controls after printing
            setTimeout(() => {
                try {
                    // Restore main elements
                    if (originalControls) originalControls.style.display = '';
                    if (originalTimeline) originalTimeline.style.display = '';
                    if (originalYearSteps) originalYearSteps.style.display = '';
                    if (originalTitle) originalTitle.style.display = '';
                    if (originalSubtitle) originalSubtitle.style.display = '';
                    if (timelineLabels) timelineLabels.style.display = '';
                    if (yearDisplayElement) yearDisplayElement.style.display = '';
                    if (speedDisplay) speedDisplay.style.display = '';
                    
                    // Restore Leaflet controls
                    if (leafletControls) {
                        leafletControls.forEach(control => {
                            control.style.display = '';
                        });
                    }
                    
                    // Restore all buttons
                    if (buttons) {
                        buttons.forEach(button => {
                            button.style.display = '';
                        });
                    }
                    
                    // Restore all select elements
                    if (selects) {
                        selects.forEach(select => {
                            select.style.display = '';
                        });
                    }
                    
                    // Restore all input elements
                    if (inputs) {
                        inputs.forEach(input => {
                            input.style.display = '';
                        });
                    }
                    
                    // Restore all labels
                    if (labels) {
                        labels.forEach(label => {
                            label.style.display = '';
                        });
                    }
                    
                    // Remove print header
                    if (printHeader) printHeader.remove();
                    
                } catch (restoreError) {
                    console.error('Error restoring controls:', restoreError);
                    // Force reload if restoration fails
                    location.reload();
                }
            }, 2000);
            
        } catch (error) {
            console.error('Print error details:', error);
            alert(`Print failed: ${error.message}. Please try again.`);
        }
    });

    // Year step buttons
    const stepsContainer = document.getElementById('year-steps');
    if (stepsContainer) {
        stepsContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            const stepAttr = target.getAttribute('data-step');
            if (!stepAttr) return;
            const step = parseInt(stepAttr, 10);
            if (isNaN(step)) return;
            const current = parseInt(timeline.noUiSlider.get());
            let next = current + step;
            if (next < startYear0) next = startYear0;
            if (next > endYear0) next = endYear0;
            timeline.noUiSlider.set(next);
        });
    }

    // Toggle play/pause
    playButton.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playButton.innerHTML = isPlaying ?
            '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"/></svg>' :
            '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>';
        if (isPlaying) {
            playTimeline(timeline);
        } else if (playIntervalGlobal) {
            clearInterval(playIntervalGlobal);
        }
    });

    // About modal functionality
    const aboutButton = document.getElementById('aboutButton');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModal = document.getElementById('closeAboutModal');
    const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');

    // Open modal
    aboutButton.addEventListener('click', () => {
        aboutModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close modal functions
    function closeModal() {
        aboutModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    closeAboutModal.addEventListener('click', closeModal);
    closeAboutModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Tour functionality
    const startTourButton = document.getElementById('startTourButton');
    const tourModal = document.getElementById('tourModal');
    const closeTourModal = document.getElementById('closeTourModal');
    const skipTour = document.getElementById('skipTour');
    const prevTourStep = document.getElementById('prevTourStep');
    const nextTourStep = document.getElementById('nextTourStep');
    const tourContent = document.getElementById('tourContent');
    const tourProgress = document.getElementById('tourProgress');
    const tourOverlay = document.getElementById('tourOverlay');
    const tourHighlight = document.getElementById('tourHighlight');

    let currentTourStep = 0;
    const tourSteps = [
        {
            title: "Welcome to the Jewish Communities Timeline",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Welcome! This interactive visualization shows the demographic history of Jewish communities 
                    worldwide from ancient times to the present. You'll explore 3,400+ years of Jewish history 
                    through population data, migration patterns, and historical events.
                </p>
                <p class="text-gray-700 leading-relaxed">
                    Let's start by learning about the timeline controls and how to navigate through history.
                </p>
            `,
            highlight: null
        },
        {
            title: "Timeline Navigation",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    The timeline at the bottom allows you to navigate through history. You can:
                </p>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Drag the slider</strong> to jump to any year</li>
                    <li><strong>Use the play button</strong> to animate through time automatically</li>
                    <li><strong>Adjust the speed</strong> with the speed control</li>
                    <li><strong>Use step buttons</strong> (-10, -5, -1, +1, +5, +10) for precise navigation</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Try dragging the timeline slider to see how the map changes!
                </p>
            `,
            highlight: 'timeline'
        },
        {
            title: "Community Markers",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Each circle on the map represents a Jewish community (kehila) at that time period. 
                    The markers show:
                </p>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Population size</strong> - displayed as numbers inside the markers</li>
                    <li><strong>Confidence level</strong> - color indicates data reliability (blue = high, lighter = lower)</li>
                    <li><strong>Marker size</strong> - larger markers = larger populations</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Click on any marker to see detailed information about that community!
                </p>
            `,
            highlight: 'map'
        },
        {
            title: "Understanding Community Markers",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Let's explore the different types of markers you'll see on the map:
                </p>
                <div class="space-y-4 mb-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-blue-800 mb-2">Individual Community Markers</h4>
                        <div class="flex items-center space-x-4">
                            <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">1.2k</div>
                            <div class="text-sm text-gray-700">
                                <strong>Small marker:</strong> Smaller communities
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 mt-2">
                            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">15k</div>
                            <div class="text-sm text-gray-700">
                                <strong>Medium marker:</strong> Medium-sized communities
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 mt-2">
                            <div class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">250k</div>
                            <div class="text-sm text-gray-700">
                                <strong>Large marker:</strong> Major communities
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-2 italic">
                            Larger markers represent larger communities
                        </p>
                    </div>
                    
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-green-800 mb-2">Cluster Markers</h4>
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-green-600 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
                                <div>5</div>
                                <div class="text-xs">2.1M</div>
                            </div>
                            <div class="text-sm text-gray-700">
                                <strong>Cluster marker:</strong> Groups nearby communities together<br>
                                <em>Top number:</em> Number of communities<br>
                                <em>Bottom number:</em> Total population
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-yellow-800 mb-2">Confidence Levels</h4>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-blue-800 rounded-full"></div>
                                <span class="text-sm text-gray-700"><strong>Dark blue:</strong> High confidence data</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-blue-400 rounded-full"></div>
                                <span class="text-sm text-gray-700"><strong>Medium blue:</strong> Medium confidence data</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-blue-200 rounded-full"></div>
                                <span class="text-sm text-gray-700"><strong>Light blue:</strong> Lower confidence data</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="text-blue-600 font-medium">
                    Look for these different marker types as you explore the map!
                </p>
            `,
            highlight: 'map'
        },
        {
            title: "Historical Events Timeline",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    The small markers on the timeline represent major historical events. Hover over them to see:
                </p>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Event name</strong> in Hebrew and English</li>
                    <li><strong>Historical year</strong> in both Gregorian and Hebrew calendars</li>
                    <li><strong>Wikipedia links</strong> for detailed information</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Hover over the timeline markers to explore historical events!
                </p>
            `,
            highlight: 'timeline-markers'
        },
        {
            title: "Historical Events on Map",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Colored ellipses on the map show the geographic scope of major historical events:
                </p>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Red ellipses</strong> - Massacres and persecutions</li>
                    <li><strong>Other colors</strong> - Different types of historical events</li>
                    <li><strong>Click ellipses</strong> to learn more about specific events</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Look for the colored shapes on the map - they show where major events occurred!
                </p>
            `,
            highlight: 'map'
        },
        {
            title: "Map View Options",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    You can customize your map view using the controls:
                </p>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Place names</strong> - Choose between local language, German, or English labels</li>
                    <li><strong>Map view</strong> - Switch between Europe & Middle East or Americas focus</li>
                    <li><strong>Different perspectives</strong> help you explore different regions</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Try switching between different map views to see how it changes the perspective!
                </p>
            `,
            highlight: 'controls'
        },
        {
            title: "Journey Through Time: Ancient Period",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Let's take a journey through time! We'll start in ancient times and see how Jewish 
                    communities developed and spread across the world.
                </p>
                <p class="text-gray-700 leading-relaxed mb-4">
                    <strong>Ancient Period (-1400 to 0 BCE):</strong> The story begins with the Exodus 
                    and the establishment of the Kingdom of Israel. Watch how communities form in the 
                    ancient Near East.
                </p>
                <p class="text-blue-600 font-medium">
                    The timeline will now automatically show the ancient period. Watch the communities appear!
                </p>
            `,
            highlight: 'timeline',
            action: () => {
                const timeline = document.getElementById('timeline');
                timeline.noUiSlider.set(-1000);
            }
        },
        {
            title: "Journey Through Time: Modern Period",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Now let's see the modern period and how Jewish communities spread worldwide:
                </p>
                <p class="text-gray-700 leading-relaxed mb-4">
                    <strong>Modern Period (1800-1948 CE):</strong> Major migrations to the Americas, 
                    the Holocaust, and the establishment of modern Israel. Notice how communities 
                    appear across the globe.
                </p>
                <p class="text-blue-600 font-medium">
                    The timeline will now show the modern period. See how communities spread worldwide!
                </p>
            `,
            highlight: 'timeline',
            action: () => {
                const timeline = document.getElementById('timeline');
                timeline.noUiSlider.set(1900);
            }
        },
        {
            title: "Tour Complete!",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Congratulations! You've completed the tour and learned about the key features of 
                    this Jewish communities timeline visualization.
                </p>
                <p class="text-gray-700 leading-relaxed mb-4">
                    You now know how to:
                </p>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Navigate through 3,400+ years of history</li>
                    <li>Understand different marker types and their meanings</li>
                    <li>Read population data and confidence levels</li>
                    <li>Explore community populations and details</li>
                    <li>Learn about historical events and their impact</li>
                    <li>Customize your map view and language preferences</li>
                    <li>Use all the interactive features</li>
                </ul>
                <p class="text-green-600 font-medium">
                    Start exploring! Use the timeline to discover the rich history of Jewish communities worldwide.
                </p>
            `,
            highlight: null
        }
    ];

    function showTourStep(stepIndex) {
        const step = tourSteps[stepIndex];
        currentTourStep = stepIndex;
        
        // Update progress
        tourProgress.textContent = `Step ${stepIndex + 1} of ${tourSteps.length}`;
        
        // Update content
        tourContent.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-800 mb-4">${step.title}</h3>
            ${step.content}
        `;
        
        // Update buttons
        prevTourStep.disabled = stepIndex === 0;
        nextTourStep.textContent = stepIndex === tourSteps.length - 1 ? 'Finish' : 'Next';
        
        // Handle highlighting
        if (step.highlight) {
            highlightElement(step.highlight);
        } else {
            hideHighlight();
        }
        
        // Execute action if present
        if (step.action) {
            setTimeout(step.action, 500);
        }
    }

    function highlightElement(selector) {
        tourOverlay.classList.remove('hidden');
        
        let element;
        switch(selector) {
            case 'timeline':
                element = document.getElementById('timeline');
                break;
            case 'timeline-markers':
                element = document.querySelector('.timeline-marker');
                break;
            case 'map':
                element = document.getElementById('map');
                break;
            case 'controls':
                element = document.querySelector('.timeline-section');
                break;
        }
        
        if (element) {
            const rect = element.getBoundingClientRect();
            tourHighlight.style.left = `${rect.left - 8}px`;
            tourHighlight.style.top = `${rect.top - 8}px`;
            tourHighlight.style.width = `${rect.width + 16}px`;
            tourHighlight.style.height = `${rect.height + 16}px`;
        }
    }

    function hideHighlight() {
        tourOverlay.classList.add('hidden');
    }

    function closeTour() {
        tourModal.classList.add('hidden');
        tourOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        currentTourStep = 0;
    }

    // Tour event listeners
    startTourButton.addEventListener('click', () => {
        tourModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        showTourStep(0);
    });

    closeTourModal.addEventListener('click', closeTour);
    skipTour.addEventListener('click', closeTour);

    prevTourStep.addEventListener('click', () => {
        if (currentTourStep > 0) {
            showTourStep(currentTourStep - 1);
        }
    });

    nextTourStep.addEventListener('click', () => {
        if (currentTourStep < tourSteps.length - 1) {
            showTourStep(currentTourStep + 1);
        } else {
            closeTour();
        }
    });

    // Close tour with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !tourModal.classList.contains('hidden')) {
            closeTour();
        }
    });
}

function playTimeline(timeline) {
    const currentYear = parseInt(timeline.noUiSlider.get());
    const maxYear = endYear0;
    const baseInterval = 1000 / 24; // Base interval for 1x speed
    const interval = baseInterval / animationSpeed; // Adjust interval based on speed

    const playInterval = setInterval(() => {
        const currentYear = parseInt(timeline.noUiSlider.get());
        if (currentYear >= maxYear) {
            clearInterval(playInterval);
            const playButton = document.getElementById('playButton');
            playButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>';
            return;
        }

        // Advance by 1 year per step (regardless of speed)
        timeline.noUiSlider.set(currentYear + animationSpeed);
    }, interval);
    playIntervalGlobal = playInterval;
}

function getMarkerSize(population) {
    // Base size for the marker
    const baseSize = 8;
//    if (population < 1000) return baseSize;
//    if (population < 5000) return baseSize * 1.5;
//    if (population < 10000) return baseSize * 2;
//    if (population < 50000) return baseSize * 2.5;
    return Math.max(baseSize, Math.floor(2.2 * Math.log(population)));
}


function getConfidenceColor(confidence) {
    switch (confidence.toLowerCase()) {
        case 'high':
            return '#1a5f7a';  // Solid blue
        case 'medium':
            return '#699eb3';  // Lighter blue
        case 'low':
            return '#a8c9d5';  // Very light blue
        default:
            return '#84a7b4';  // Default blue
    }
}


function getConfidenceText(confidence) {
    switch (confidence.toLowerCase()) {
        case 'high':
            return 'רמת ודאות גבוהה';
        case 'medium':
            return 'רמת ודאות בינונית';
        case 'low':
            return 'רמת ודאות נמוכה';
        default:
            return 'רמת ודאות לא ידועה';
    }
}

function formatPopulation(population) {
    if (population >= 1000000) {
        return (population / 1000000).toFixed(1) + 'M';
    } else if (population >= 1000) {
        return (population / 1000).toFixed(1) + 'k';
    } else {
        return population.toLocaleString();
    }
}


function createCustomMarker(kehila) {
    const size = getMarkerSize(kehila.actual_pop);
    const color = getConfidenceColor(kehila.confidence);
    
    // Format population number for display
    const populationText = formatPopulation(kehila.actual_pop);
    
    // Determine CSS class based on marker size
    let sizeClass = 'population-marker-small';
    if (size >= 16) {
        sizeClass = 'population-marker-large';
    } else if (size >= 12) {
        sizeClass = 'population-marker-medium';
    }

    // Create custom div icon with population display
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="population-marker ${sizeClass}" style="
            width: ${size * 2}px;
            height: ${size * 2}px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            opacity: 0.9;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            transition: all 0.3s ease;
            cursor: pointer;
        ">${populationText}</div>`,
        iconSize: [size * 2, size * 2],
        iconAnchor: [size, size]
    });

    const marker = L.marker([kehila.lat, kehila.lon], { icon });
    
    // Store kehila data on the marker for cluster calculations
    marker.kehilaData = kehila;
    
    return marker;
}

function generateBezierCurve(startPoint, midPoint, endPoint) {
    // Generate a quadratic Bezier curve with the midpoint as control point
    const points = [];
    const steps = 50; // Number of points along the curve
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        
        // Quadratic Bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const lat = Math.pow(1 - t, 2) * startPoint[0] + 
                   2 * (1 - t) * t * midPoint[0] + 
                   Math.pow(t, 2) * endPoint[0];
        
        const lon = Math.pow(1 - t, 2) * startPoint[1] + 
                   2 * (1 - t) * t * midPoint[1] + 
                   Math.pow(t, 2) * endPoint[1];
        
        points.push([lat, lon]);
    }
    
    return points;
}

function createArrow(arrowData) {
    // Generate Bezier curve points
    const curvePoints = generateBezierCurve(
        [arrowData.startLat, arrowData.startLon],
        [arrowData.midLat, arrowData.midLon],
        [arrowData.endLat, arrowData.endLon]
    );

    // Create the curved polyline for the arrow
    const polyline = L.polyline(curvePoints, {
        color: arrowData.color,
        weight: 5,
        opacity: 0.8,
        className: 'historical-arrow'
    });

    // Calculate the direction for the arrowhead based on the last segment of the curve
    const lastSegmentStart = curvePoints[curvePoints.length - 2];
    const lastSegmentEnd = curvePoints[curvePoints.length - 1];
    const arrowRotation = getArrowRotation(
        lastSegmentStart[0], lastSegmentStart[1],
        lastSegmentEnd[0], lastSegmentEnd[1]
    );

    // Create arrowhead marker
    const arrowhead = L.marker([arrowData.endLat, arrowData.endLon], {
        icon: L.divIcon({
            className: 'arrowhead-marker',
            html: `<div style="
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 12px solid ${arrowData.color};
                transform: rotate(${arrowRotation}deg);
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 6]
        })
    });

    // Create popup content for the arrow
    const popupContent = `
        <div style="direction: rtl; text-align: right;">
            <strong style="font-size: 16px;">${arrowData.titleHe}</strong>
            <br>
            ${arrowData.titleEn}
            <br>
            <div style="margin: 8px 0;">
                <strong>תקופה:</strong> 
                ${arrowData.yearStart < 0 ? Math.abs(arrowData.yearStart) + ' BCE' : arrowData.yearStart + ' CE'} - 
                ${arrowData.yearEnd < 0 ? Math.abs(arrowData.yearEnd) + ' BCE' : arrowData.yearEnd + ' CE'}
            </div>
            <div style="margin: 8px 0;">
                <strong>תיאור:</strong> ${arrowData.description}
            </div>
        </div>
    `;

    // Bind popup to both polyline and arrowhead
    polyline.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });
    arrowhead.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });

    return { polyline, arrowhead };
}

function getArrowRotation(startLat, startLon, endLat, endLon) {
    const deltaLat = endLat - startLat;
    const deltaLon = endLon - startLon;
    const angle = Math.atan2(deltaLon, deltaLat) * (180 / Math.PI);
    return angle;
}

function updateArrows(year) {
    // Clear existing arrows
    arrowsLayer.clearLayers();
    currentArrows = [];

    // Filter arrows based on the current year
    const relevantArrows = historicalArrows.filter(arrow => 
        year >= arrow.yearStart && year <= arrow.yearEnd
    );

    // Add new arrows
    relevantArrows.forEach(arrowData => {
        const arrow = createArrow(arrowData);
        currentArrows.push(arrow);
        arrowsLayer.addLayer(arrow.polyline);
        arrowsLayer.addLayer(arrow.arrowhead);
    });

    // Add arrows layer to map if not already added
    if (!map.hasLayer(arrowsLayer)) {
        map.addLayer(arrowsLayer);
    }
}

function formatSource(source) {
    // Check if the source is a URL
    const isUrl = source.startsWith('http://') || source.startsWith('https://') || source.startsWith('www.');

    if (isUrl) {
        return `<a href="${source}" target="_blank" style="
            color: #2563eb;
            text-decoration: underline;
            font-weight: 500;
        ">מקור מקוון ↗</a>`;
    }

    return source;
}

// Parse and update events (ellipses and polygons) for a given year
async function updateEvents(year) {
    try {
        // Clear existing events
        eventsLayer.clearLayers();
        currentEvents = [];

        // Process ellipse events
        await processEllipseEvents(year);
        
        // Process polygon events
        await processPolygonEvents(year);

        if (!map.hasLayer(eventsLayer)) {
            map.addLayer(eventsLayer);
        }
    } catch (error) {
        console.error('Error loading events data:', error);
    }
}

// Process ellipse events
async function processEllipseEvents(year) {
    try {
        const csvText = await getEventsData();
        const rows = csvText.split('\n').slice(1); // skip header
        // Each row: center_lon, center_lat, radii1, radii2, tilt_deg, color, fillColor, fillOpacity, year_start, year_end, description, source, type
        const events = rows
            .filter(row => row.trim())
            .map(row => {
                const [
                    center_lon, center_lat, radii1, radii2, tilt_deg,
                    color, fillColor, fillOpacity, year_start, year_end,
                    description, source, type
                ] = parseCSVLine(row).slice(0, 13);

                const actualYearEnd = year_end == undefined || year_end.trim() === '' ? undefined : parseInt(year_end);
                return {
                    center: [parseFloat(center_lat), parseFloat(center_lon)],
                    radii1: parseFloat(radii1),
                    radii2: parseFloat(radii2),
                    tiltDeg: parseFloat(tilt_deg),
                    color: color,
                    fillColor: fillColor,
                    fillOpacity: parseFloat(fillOpacity),
                    yearStart: parseInt(year_start),
                    yearEnd: actualYearEnd,
                    description: description ? description.replace(/"/g, '') : '',
                    source: source ? source.replace(/"/g, '') : '',
                    type: parseInt(type)
                };
            });

        // Events are sorted by yearStart ascending per specification; stop scanning once > year
        const relevant = [];
        for (let i = 0; i < events.length; i++) {
            const ev = events[i];
            if (ev.yearStart > year) break;
            if (ev.yearStart <= year && (ev.yearEnd === undefined || ev.yearEnd >= year)) {
                relevant.push(ev);
            }
        }

        relevant.forEach(ev => {
            const polygon = createEllipsePolygon(ev.center, ev.radii1, ev.radii2, ev.tiltDeg, {
                color: ev.color,
                weight: 2,
                fillColor: ev.fillColor,
                fillOpacity: isNaN(ev.fillOpacity) ? 0.25 : ev.fillOpacity
            });

            addEventPopup(polygon, ev);
            eventsLayer.addLayer(polygon);
            currentEvents.push(polygon);
        });
    } catch (error) {
        console.error('Error loading ellipse events data:', error);
    }
}

// Process polygon events
async function processPolygonEvents(year) {
    try {
        const csvText = await getPolygonEventsData();
        const rows = csvText.split('\n').slice(1); // skip header
        // Each row: polygon_coordinates, color, fillColor, fillOpacity, year_start, year_end, description, source, type
        const events = rows
            .filter(row => row.trim())
            .map(row => {
                const [
                    polygon_coords, color, fillColor, fillOpacity, year_start, year_end,
                    description, source, type
                ] = parseCSVLine(row).slice(0, 8);

                const actualYearEnd = year_end == undefined || year_end.trim() === '' ? undefined : parseInt(year_end);
                return {
                    coordinates: parsePolygonCoordinates(polygon_coords),
                    color: color,
                    fillColor: fillColor,
                    fillOpacity: parseFloat(fillOpacity),
                    yearStart: parseInt(year_start),
                    yearEnd: actualYearEnd,
                    description: description ? description.replace(/"/g, '') : '',
                    source: source ? source.replace(/"/g, '') : '',
                    type: parseInt(type)
                };
            });

        // Events are sorted by yearStart ascending per specification; stop scanning once > year
        const relevant = [];
        for (let i = 0; i < events.length; i++) {
            const ev = events[i];
            if (ev.yearStart > year) break;
            if (ev.yearStart <= year && (ev.yearEnd === undefined || ev.yearEnd >= year)) {
                relevant.push(ev);
            }
        }

        relevant.forEach(ev => {
            if (ev.coordinates.length >= 3) {
                const polygon = createPolygonFromCoordinates(ev.coordinates, {
                    color: ev.color,
                    weight: 2,
                    fillColor: ev.fillColor,
                    fillOpacity: isNaN(ev.fillOpacity) ? 0.25 : ev.fillOpacity
                });

                if (polygon) {
                    addEventPopup(polygon, ev);
                    eventsLayer.addLayer(polygon);
                    currentEvents.push(polygon);
                }
            }
        });
    } catch (error) {
        console.error('Error loading polygon events data:', error);
    }
}

// Add popup to event polygon
function addEventPopup(polygon, ev) {
    // Generate titles based on event type
    function getEventTitles(type) {
        const titles = {
            1: { he: "גלות", en: "Exile" },
            2: { he: "מהומות", en: "Riots" },
            3: { he: "גירוש", en: "Expulsion" },
            4: { he: "הגירה", en: "Migration" },
            5: { he: "רדיפות", en: "Persecution" },
            6: { he: "אירועי מדינה", en: "State Events" },
            9: { he: "פוגרום", en: "Pogrom" }
        };
        return titles[type] || { he: "אירוע", en: "Event" };
    }

    const eventTitles = getEventTitles(ev.type);
    const popupContent = `
    <div style="direction: rtl; text-align: right;">
        <div style="font-weight: 600; margin-bottom: 4px;">${eventTitles.he}</div>
        <div style="font-weight: 500; margin-bottom: 8px; color: #666; font-size: 14px;">${eventTitles.en}</div>
        <div style="margin: 6px 0;">
            <strong>תקופה:</strong> ${ev.yearStart < 0 ? Math.abs(ev.yearStart) + ' BCE' : ev.yearStart + ' CE'}
            ${ev.yearEnd !== undefined ? ' - ' + (ev.yearEnd < 0 ? Math.abs(ev.yearEnd) + ' BCE' : ev.yearEnd + ' CE') : ''}
        </div>
        ${ev.description ? `<div style="margin: 6px 0;"><strong>תיאור:</strong> ${ev.description}</div>` : ''}
        ${ev.source ? `<div style="margin: 6px 0;"><strong>מקור:</strong> ${formatSource(ev.source)}</div>` : ''}
    </div>`;

    polygon.bindPopup(popupContent, { maxWidth: 320, className: 'custom-popup' });
}

// Parse polygon coordinates from string format like "((35, 32),(35.2,32),(35.2,32.2),(35.1,32.3),(35,32.2),(34.9,32.1))"
function parsePolygonCoordinates(coordinateString) {
    try {
        // Remove outer parentheses and split by coordinate pairs
        const cleanString = coordinateString.replace(/^\(|\)$/g, '');
        const coordinatePairs = cleanString.split('),(');
        
        const coordinates = coordinatePairs.map(pair => {
            // Remove any remaining parentheses and split by comma
            const cleanPair = pair.replace(/[()]/g, '');
            const [lon, lat] = cleanPair.split(',').map(coord => parseFloat(coord.trim()));
            return [lat, lon]; // Leaflet expects [lat, lon] format
        });
        
        return coordinates;
    } catch (error) {
        console.error('Error parsing polygon coordinates:', error);
        return [];
    }
}

// Create a polygon from coordinate array
function createPolygonFromCoordinates(coordinates, styleOptions) {
    if (coordinates.length < 3) {
        console.warn('Polygon needs at least 3 coordinates');
        return null;
    }
    return L.polygon(coordinates, styleOptions);
}

// Generate an approximate ellipse on the sphere by sampling points
function createEllipsePolygon(centerLatLng, radiusMetersMajor, radiusMetersMinor, tiltDegrees, styleOptions) {
    // Convert radii in meters to degrees approximately using latitude
    const lat = centerLatLng[0];
    const lon = centerLatLng[1];
    const metersPerDegLat = 111320; // approximate
    const metersPerDegLon = 40075000 * Math.cos(lat * Math.PI / 180) / 360; // varies with latitude

    const aDeg = radiusMetersMajor / metersPerDegLat; // along Y before rotation
    const bDeg = radiusMetersMinor / metersPerDegLon; // along X before rotation

    const theta = (tiltDegrees || 0) * Math.PI / 180; // rotation angle
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    const points = [];
    const steps = 90; // resolution
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const x = bDeg * Math.cos(t); // lon delta before rotation
        const y = aDeg * Math.sin(t); // lat delta before rotation
        // rotate
        const xRot = x * cosT - y * sinT;
        const yRot = x * sinT + y * cosT;
        points.push([lat + yRot, lon + xRot]);
    }
    return L.polygon(points, styleOptions);
}

// Show year input dialog for direct year entry
function showYearInputDialog() {
    const currentYear = parseInt(timeline.noUiSlider.get());
    const yearInput = prompt(
        `Enter a year to jump to:\n\n` +
        `Current year: ${currentYear < 0 ? Math.abs(currentYear) + ' BCE' : currentYear + ' CE'}\n` +
        `Valid range: ${startYear0 < 0 ? Math.abs(startYear0) + ' BCE' : startYear0 + ' CE'} to ${endYear0} CE\n\n` +
        `Enter year (use negative numbers for BCE, e.g., -1000 for 1000 BCE):`,
        currentYear.toString()
    );
    
    if (yearInput !== null) {
        const newYear = parseInt(yearInput);
        
        // Validate input
        if (isNaN(newYear)) {
            alert('Please enter a valid number.');
            return;
        }
        
        if (newYear < startYear0 || newYear > endYear0) {
            alert(`Year must be between ${startYear0} and ${endYear0}.`);
            return;
        }
        
        // Update timeline to new year
        timeline.noUiSlider.set(newYear);
    }
}
