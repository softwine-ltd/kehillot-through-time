document.addEventListener('DOMContentLoaded', function () {
    // Load MarkerCluster after Leaflet is ready
    var markerClusterScript = document.createElement('script');
    markerClusterScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js';
    markerClusterScript.onload = initializeMap;  // Call initialization after MarkerCluster loads
    document.head.appendChild(markerClusterScript);
});
// Latitude:  north-south
// Longitude: east-west
const expulsion_color ="#e74c3c"
const emigration_color ="#2ecc71"  // "#3498db"
const crusades_color = "#ff2222"
// Historical arrows will be loaded from CSV file
let historicalArrows = [];

const historicalEvents = [
    {
        year: -1313,
        titleEn: "Exodus",
        titleHe: "יציאת מצרים",
        titleFr: "Exode",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1313)),
        url: "https://en.wikipedia.org/wiki/Exodus_(biblical_book)"
    },
    {
        year: -1205,
        titleEn: " Merneptah Stele: 'Israel is laid waste—its seed is no more' ",
        titleHe: "'ישראל הושם אין זרע לו' מצבת מרנפתח (מצבת ישראל)",
        titleFr: "Stèle de Merneptah : 'Israël est dévasté—sa semence n'est plus'",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1205)),
        url: "https://en.wikipedia.org/wiki/Merneptah_Stele"
    },
    {
        year: -1000,
        titleEn: "Reign of King David",
        titleHe: "מלכות דוד",
        titleFr: "Règne du Roi David",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1000)),
        url: "https://en.wikipedia.org/wiki/David"
    },
    {
        year: -928,
        titleEn: "Dissolution of the United Kingdom of Israel",
        titleHe: "פילוג ממלכת ישראל המאוחדת",
        titleFr: "Dissolution du Royaume Unifié d'Israël",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-928)),
        url: "https://en.wikipedia.org/wiki/Kingdom_of_Israel_(united_monarchy)"
    },
    {
        year: -722,
        titleEn: "Temple Destruction",
        titleHe: "חורבן ממלכת ישראל",
        titleFr: "Destruction du Temple",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-722)),
        url: "https://en.wikipedia.org/wiki/Kingdom_of_Israel_(Samaria)"
    },
    {
        year: -586,
        titleEn: "Destruction of the First Temple",
        titleHe: "חורבן בית המקדש הראשון",
        titleFr: "Destruction du Premier Temple",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-586)),
        url: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(587_BC)"
    },
     {
        year: -457,
        titleEn: "Aliya of Ezra",
        titleHe: "עליית עזרא לירושלים",
        titleFr: "Aliya d'Ezra",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-457)),
        url: "https://en.wikipedia.org/wiki/Ezra"
    },
      {
        year: -167,
        titleEn: "Maccabean Revolt",
        titleHe: "מרד חשמונאים",
        titleFr: "Révolte des Maccabées",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-167)),
        url: "https://en.wikipedia.org/wiki/Maccabean_Revolt"
    },
    {
        year: 70,
        titleEn: "Destruction of the Second Temple",
        titleHe: "חורבן בית המקדש השני",
        titleFr: "Destruction du Second Temple",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(70)),
        url: "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(70_CE)"
    },
        {
        year: 132,
        titleEn: "Bar Kokhba revolt",
        titleHe: "מרד בר כוכבא",
        titleFr: "Révolte de Bar Kokhba",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(132)),
        url: "https://en.wikipedia.org/wiki/Bar_Kokhba_revolt"
    },
     {
        year: 200,
        titleEn: "End of Tannaim Period",
        titleHe: "סוף תקופת התנאים",
        titleFr: "Fin de la Période des Tannaïm",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(200)),
        url: "https://en.wikipedia.org/wiki/Tannaim"
    },
      {
        year: 500,
        titleEn: "End of Amoraim Period",
        titleHe: "סוף תקופת האמוראים",
        titleFr: "Fin de la Période des Amoraïm",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(500)),
        url: "https://en.wikipedia.org/wiki/Amoraim"
    },
    {
        year: 1038,
        titleEn: "End of Amoraim Geonim",
        titleHe: "סוף תקופת הגאונים",
        titleFr: "Fin de la Période des Gaonim",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1038)),
        url: "https://en.wikipedia.org/wiki/Geonim"
    },
    {
        year: 1096,
        titleEn: "First Crusade",
        titleHe: "מסע הצלב הראשון",
        titleFr: "Première Croisade",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1096)),
        url: "https://en.wikipedia.org/wiki/First_Crusade"
    },
    {
        year: 1147,
        titleEn: "Second Crusade",
        titleHe: "מסע הצלב השני",
        titleFr: "Deuxième Croisade",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1147)),
        url: "https://en.wikipedia.org/wiki/Second_Crusade"
    },
    {
        year: 1189,
        titleEn: "Exile from Spain",
        titleHe: "מסע הצלב השלישי",
        titleFr: "Troisième Croisade",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1189)),
        url: "https://en.wikipedia.org/wiki/Third_Crusade"
    },
    {
        year: 1492,
        titleEn: "Exile from Spain and End of Rishonim Period",
        titleHe: "גירוש ספרד וסוף תקופת הראשונים",
        titleFr: "Expulsion d'Espagne et Fin de la Période des Rishonim",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1492)),
        url: "https://en.wikipedia.org/wiki/Expulsion_of_Jews_from_Spain"
    },
    {
        year: 1939,
        titleEn: "The Holocaust",
        titleHe: "השואה",
        titleFr: "L'Holocauste",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1939)),
        url: "https://en.wikipedia.org/wiki/The_Holocaust"
    },
    {
        year: 1948,
        titleEn: "Israel Independence",
        titleHe: "הקמת מדינת ישראל",
        titleFr: "Indépendance d'Israël",
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
        
        // Get current language for tooltip display
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        
        // Create language-specific tooltip content
        let tooltipContent = '';
        if (currentLang === 'he') {
            tooltipContent = `
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
        } else if (currentLang === 'fr') {
            tooltipContent = `
                <div class="tooltip-content">
                    <div class="tooltip-french" style="font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold;">${event.titleFr}</div>
                    <div class="tooltip-english" style="font-size: 12px; color: #e2e8f0;">${event.titleEn}</div>
                    <div class="tooltip-year" style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                        ${event.year < 0 ? Math.abs(event.year) + ' AEC' : event.year + ' EC'} 
                        / ${event.hebrewYear}
                    </div>
                    ${linkHtml}
                </div>
            `;
        } else {
            tooltipContent = `
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
        }
        
        tooltip.innerHTML = tooltipContent;

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

async function loadHistoricalArrows() {
    try {
        console.log("Loading historical arrows from CSV...");
        const response = await fetch('historical_arrows.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const rows = csvText.split('\n').slice(1); // Skip header
        historicalArrows = rows
            .filter(row => row.trim()) // Skip empty rows
            .map(row => {
                const cols = parseCSVLine(row);
                const [
                    startLat, startLon, endLat, endLon, midLat, midLon,
                    yearStart, yearEnd, titleEn, titleHe, color, description
                ] = cols;
                const url = cols[12]; // optional URL column (backward compatible)
                
                // Convert color string to actual color variable
                let colorValue;
                switch(color) {
                    case 'expulsion_color':
                        colorValue = expulsion_color;
                        break;
                    case 'emigration_color':
                        colorValue = emigration_color;
                        break;
                    case 'crusades_color':
                        colorValue = crusades_color;
                        break;
                    default:
                        colorValue = expulsion_color; // Default fallback
                }
                
                // Build final URL: prefer provided URL, otherwise generate a Wikipedia link from English title
                const buildFallbackUrl = (title) => {
                    if (!title) return '';
                    try {
                        // Remove extra spaces and some bracketed details for cleaner URLs
                        const cleaned = title
                            .replace(/\s*\([^\)]*\)\s*/g, ' ') // remove parentheses content
                            .replace(/\s+/g, ' ')                 // collapse whitespace
                            .trim();
                        return `https://en.wikipedia.org/wiki/${encodeURIComponent(cleaned.replace(/\s+/g, '_'))}`;
                    } catch (_) { return ''; }
                };

                return {
                    startLat: parseFloat(startLat),
                    startLon: parseFloat(startLon),
                    endLat: parseFloat(endLat),
                    endLon: parseFloat(endLon),
                    midLat: parseFloat(midLat),
                    midLon: parseFloat(midLon),
                    yearStart: parseInt(yearStart),
                    yearEnd: parseInt(yearEnd),
                    titleEn: titleEn,
                    titleHe: titleHe,
                    color: colorValue,
                    description: description,
                    url: (url ? url.replace(/"/g, '') : '') || buildFallbackUrl(titleEn)
                };
            });
        
        console.log(`Loaded ${historicalArrows.length} historical arrows from CSV`);
    } catch (error) {
        console.error('Error loading historical arrows:', error);
        // Fallback to empty array if loading fails
        historicalArrows = [];
    }
}

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
                    source: source ? source.replace(/"/g, '') : '', // Remove quotes from source, handle undefined
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
var animationSpeed = 2; // Default speed multiplier

function initializeMap() {
    // Initialize map
    map = L.map('map', {
        center: [41.9028, 25.4324],
        zoom: 5,
        minZoom: 3,
        maxZoom: 14,
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
    
    // OpenStreetMap France with French labels
    const osmFranceTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20
    });
    
    
    // Add default tile layer
    osmTileLayer.addTo(map);

    // Initialize markers layer with custom cluster icon
    markersLayer = L.markerClusterGroup({
        maxClusterRadius: 80, // Default cluster radius
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
    
    // Load initial data and historical arrows
    (async () => {
        await loadHistoricalArrows();
        const initialYear = parseInt(timeline.noUiSlider.get());
        const jewishYear = convertToHebrewYear(initialYear);
        const hebrewLetters = numberToHebrewLetters(jewishYear);
        const yearText = initialYear < 0
            ? `${Math.abs(initialYear)} BCE (${hebrewLetters})`
            : `${initialYear} CE (${hebrewLetters})`;
        yearDisplay.textContent = yearText;
        loadData(initialYear);
        updateArrows(initialYear);
        updateEvents(initialYear);
    })();
    
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
        makeYearEditable();
    });
    
    // Add visual indication that year display is clickable
    yearDisplay.style.cursor = 'pointer';
    yearDisplay.title = 'Click to edit year';

    // Add historical periods functionality
    addHistoricalPeriodsInteraction();
    
    // Add clustering control functionality
    addClusteringControl();

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
            case 'osm-france':
                currentTileLayer = osmFranceTileLayer;
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
        console.log('Print button clicked');
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
            
            // Check if this is Edge browser
            const isEdge = /Edg\/|Edge|Trident|MSIE/.test(navigator.userAgent);
            console.log('Is Edge detected:', isEdge);
            
            if (isEdge) {
                console.log('Using Edge-specific print approach');
                createTemporaryMapForPrint(center, zoom, yearDisplay);
            } else {
                console.log('Using standard print approach');
                printWithStandardApproach(center, zoom, yearDisplay);
            }
            
        } catch (error) {
            console.error('Print error details:', error);
            alert(`Print failed: ${error.message}. Please try again.`);
        }
    });

    // Standard print approach for non-Edge browsers
    function printWithStandardApproach(center, zoom, yearDisplay) {
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
            console.log('Printing with map center:', map.getCenter(), 'zoom:', map.getZoom());
            window.print();
            
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
        }, 200);
    }

    // Edge-specific print approach using temporary map
    function createTemporaryMapForPrint(center, zoom, yearDisplay) {
        // Hide all controls and elements first
        const originalControls = document.querySelector('.controls');
        const originalTimeline = document.querySelector('#timeline');
        const originalYearSteps = document.querySelector('#year-steps');
        const originalTitle = document.querySelector('h1');
        const originalSubtitle = document.querySelector('p');
        const timelineLabels = document.querySelector('.flex.justify-between.mt-2');
        const yearDisplayElement = document.querySelector('#year-display');
        const speedDisplay = document.getElementById('speedDisplay');
        const mainMap = document.getElementById('map');
        
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
        
        // Hide the main map completely
        if (mainMap) {
            mainMap.style.display = 'none';
        }
        
        // Create a temporary container for the print map
        const tempContainer = document.createElement('div');
        tempContainer.id = 'temp-print-map';
        tempContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            visibility: visible;
        `;
        document.body.appendChild(tempContainer);
        
        // Add print header
        const printHeader = document.createElement('div');
        printHeader.className = 'print-header';
        printHeader.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px; padding-bottom: 5px;">
                <h2 style="margin: 0; color: #333; font-size: 16px; font-weight: normal;">Jewish Demographics & Historical Communities Map</h2>
                <p style="margin: 2px 0 0 0; color: #666; font-size: 12px;">Year: ${yearDisplay}</p>
            </div>
        `;
        document.body.insertBefore(printHeader, document.body.firstChild);
        
        // Create a new map instance
        const tempMap = L.map('temp-print-map', {
            center: [32, 20],
            zoom: zoom,
            zoomControl: false,
            attributionControl: false
        });
        
        // Add the same tile layer as the main map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(tempMap);
        
        // Wait for the map to load, then print
        tempMap.whenReady(() => {
            console.log('Temporary map ready, center:', tempMap.getCenter(), 'zoom:', tempMap.getZoom());
            
            // Force the map to render completely
            setTimeout(() => {
                // Print after a short delay
                setTimeout(() => {
                    window.print();
                    
                    // Clean up after printing
                    setTimeout(() => {
                        // Remove temporary elements
                        if (document.body.contains(tempContainer)) {
                            document.body.removeChild(tempContainer);
                        }
                        if (printHeader && document.body.contains(printHeader)) {
                            printHeader.remove();
                        }
                        tempMap.remove();
                        
                        // Restore main map
                        if (mainMap) {
                            mainMap.style.display = 'block';
                        }
                        
                        // Restore all controls
                        try {
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
                            
                        } catch (restoreError) {
                            console.error('Error restoring controls:', restoreError);
                            location.reload();
                        }
                    }, 1000);
                }, 500);
            }, 1000);
        });
    }

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
        // Hide the arrow after first click
        const playButtonArrow = document.getElementById('playButtonArrow');
        if (playButtonArrow) {
            playButtonArrow.style.display = 'none';
        }
        
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
    const languageModal = document.getElementById('languageModal');
    const tourModal = document.getElementById('tourModal');
    const closeTourModal = document.getElementById('closeTourModal');
    const skipTour = document.getElementById('skipTour');
    const prevTourStep = document.getElementById('prevTourStep');
    const nextTourStep = document.getElementById('nextTourStep');
    const tourContent = document.getElementById('tourContent');
    const tourProgress = document.getElementById('tourProgress');
    const tourTitle = document.getElementById('tourTitle');
    const prevTourText = document.getElementById('prevTourText');
    const tourOverlay = document.getElementById('tourOverlay');
    const tourHighlight = document.getElementById('tourHighlight');

    let currentTourStep = 0;
    let tourLanguage = 'en'; // 'en', 'he', or 'fr'
    const tourSteps = {
        en: [
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
                    <li><strong>Click the year display</strong> to edit it directly and jump to a specific year</li>
                    <li><strong>Use the play button</strong> to animate through time automatically</li>
                    <li><strong>Adjust the speed</strong> with the speed control</li>
                    <li><strong>Use step buttons</strong> (-10, -5, -1, +1, +5, +10) for precise navigation</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Try dragging the timeline slider or clicking the year display to see how the map changes!
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
                    <div class="bg-red-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-red-800 mb-2">Individual Community Markers</h4>
                        <div class="flex items-center space-x-4">
                            <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">1.2k</div>
                            <div class="text-sm text-gray-700">
                                <strong>Small marker:</strong> Smaller communities
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 mt-2">
                            <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">15k</div>
                            <div class="text-sm text-gray-700">
                                <strong>Medium marker:</strong> Medium-sized communities
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 mt-2">
                            <div class="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">250k</div>
                            <div class="text-sm text-gray-700">
                                <strong>Large marker:</strong> Major communities
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-2 italic">
                            Larger markers represent larger communities
                        </p>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-blue-800 mb-2">Cluster Markers</h4>
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
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
                                <div class="w-4 h-4 bg-red-800 rounded-full"></div>
                                <span class="text-sm text-gray-700"><strong>Dark red:</strong> High confidence data</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span class="text-sm text-gray-700"><strong>Medium red:</strong> Medium confidence data</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-red-300 rounded-full"></div>
                                <span class="text-sm text-gray-700"><strong>Light red:</strong> Lower confidence data</span>
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
            title: "Clustering Control",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    You can control how communities are grouped together using the clustering slider:
                </p>
                <div class="space-y-4 mb-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-blue-800 mb-2">Clustering Options</h4>
                        <ul class="text-sm text-gray-700 space-y-2">
                            <li><strong>Small radius (10-50px):</strong> More individual communities visible, smaller clusters</li>
                            <li><strong>Medium radius (50-100px):</strong> Balanced view - default setting</li>
                            <li><strong>Large radius (100-200px):</strong> More aggregated view, larger clusters</li>
                        </ul>
                    </div>
                </div>
                <p class="text-blue-600 font-medium">
                    Try adjusting the clustering slider to see how it changes the map view!
                </p>
            `,
            highlight: 'cluster-control'
        },
        {
            title: "Historical Periods Timeline",
            content: `
                <p class="text-gray-700 leading-relaxed mb-4">
                    Below the main timeline, you'll see a color-coded bar showing different historical periods:
                </p>
                <div class="space-y-4 mb-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-gray-800 mb-3">Historical Periods</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded" style="background-color: #8B4513;"></div>
                                <span>Biblical Era (1400-586 BCE)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded" style="background-color: #B8860B;"></div>
                                <span>Second Temple (586 BCE-70 CE)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded" style="background-color: #228B22;"></div>
                                <span>Talmudic Era (70-500 CE)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded" style="background-color: #4169E1;"></div>
                                <span>Medieval (500-1500 CE)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded" style="background-color: #9370DB;"></div>
                                <span>Early Modern (1500-1800 CE)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 rounded" style="background-color: #FF6347;"></div>
                                <span>Modern (1800-2025 CE)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li><strong>Click any period</strong> to jump to the beginning of that era</li>
                    <li><strong>Current period</strong> is highlighted with a border and shadow</li>
                    <li><strong>Year labels</strong> show the boundaries between periods</li>
                </ul>
                <p class="text-blue-600 font-medium">
                    Click on any historical period to quickly navigate to that era!
                </p>
            `,
            highlight: 'historical-periods'
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
                    <li>Control clustering granularity for different views</li>
                    <li>Use historical periods for quick navigation</li>
                    <li>Use all the interactive features</li>
                </ul>
                <p class="text-green-600 font-medium">
                    Start exploring! Use the timeline to discover the rich history of Jewish communities worldwide.
                </p>
            `,
            highlight: null
        }
        ],
        he: [
            {
                title: "ברוכים הבאים לציר הזמן של הקהילות היהודיות",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        ברוכים הבאים! ויזואליזציה אינטראקטיבית זו מציגה את ההיסטוריה הדמוגרפית של הקהילות היהודיות 
                        ברחבי העולם מתקופות קדומות ועד היום. תחקרו 3,400+ שנות היסטוריה יהודית 
                        דרך נתוני אוכלוסייה, דפוסי הגירה ואירועים היסטוריים.
                    </p>
                    <p class="text-gray-700 leading-relaxed" style="direction: rtl; text-align: right;">
                        בואו נתחיל בלימוד על פקדי ציר הזמן ואיך לנווט בהיסטוריה.
                    </p>
                `,
                highlight: null
            },
            {
                title: "ניווט בציר הזמן",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        ציר הזמן בתחתית מאפשר לכם לנווט בהיסטוריה. אתם יכולים:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>גרור את המחוון</strong> כדי לקפוץ לכל שנה</li>
                        <li><strong>לחץ על תצוגת השנה</strong> כדי לערוך אותה ישירות ולקפוץ לשנה ספציפית</li>
                        <li><strong>השתמש בכפתור ההפעלה</strong> כדי להניע בזמן אוטומטית</li>
                        <li><strong>התאם את המהירות</strong> עם פקד המהירות</li>
                        <li><strong>השתמש בכפתורי הצעדים</strong> (-10, -5, -1, +1, +5, +10) לניווט מדויק</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        נסו לגרור את מחוון ציר הזמן או ללחוץ על תצוגת השנה כדי לראות איך המפה משתנה!
                    </p>
                `,
                highlight: 'timeline'
            },
            {
                title: "סמני קהילות",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        כל עיגול על המפה מייצג קהילה יהודית (קהילה) בתקופה ההיא. 
                        הסמנים מציגים:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>גודל אוכלוסייה</strong> - מוצג כמספרים בתוך הסמנים</li>
                        <li><strong>רמת אמינות</strong> - צבע מציין אמינות הנתונים (כחול = גבוה, בהיר יותר = נמוך יותר)</li>
                        <li><strong>גודל סמן</strong> - סמנים גדולים יותר = אוכלוסיות גדולות יותר</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        לחצו על כל סמן כדי לראות מידע מפורט על הקהילה ההיא!
                    </p>
                `,
                highlight: 'map'
            },
            {
                title: "הבנת סמני קהילות",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        בואו נחקור את סוגי הסמנים השונים שתראו על המפה:
                    </p>
                    <div class="space-y-4 mb-4">
                        <div class="bg-red-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-red-800 mb-2" style="direction: rtl; text-align: right;">סמני קהילות בודדות</h4>
                            <div class="flex items-center space-x-4" style="direction: rtl;">
                                <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">1.2k</div>
                                <div class="text-sm text-gray-700" style="direction: rtl; text-align: right;">
                                    <strong>סמן קטן:</strong> קהילות קטנות יותר
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 mt-2" style="direction: rtl;">
                                <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">15k</div>
                                <div class="text-sm text-gray-700" style="direction: rtl; text-align: right;">
                                    <strong>סמן בינוני:</strong> קהילות בגודל בינוני
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 mt-2" style="direction: rtl;">
                                <div class="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">250k</div>
                                <div class="text-sm text-gray-700" style="direction: rtl; text-align: right;">
                                    <strong>סמן גדול:</strong> קהילות מרכזיות
                                </div>
                            </div>
                            <p class="text-xs text-gray-600 mt-2 italic" style="direction: rtl; text-align: right;">
                                סמנים גדולים יותר מייצגים קהילות גדולות יותר
                            </p>
                        </div>
                        
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800 mb-2" style="direction: rtl; text-align: right;">סמני קיבוץ</h4>
                            <div class="flex items-center space-x-4" style="direction: rtl;">
                                <div class="w-12 h-12 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
                                    <div>5</div>
                                    <div class="text-xs">2.1M</div>
                                </div>
                                <div class="text-sm text-gray-700" style="direction: rtl; text-align: right;">
                                    <strong>סמן קיבוץ:</strong> מקובץ קהילות סמוכות יחד<br>
                                    <em>מספר עליון:</em> מספר הקהילות<br>
                                    <em>מספר תחתון:</em> אוכלוסייה כוללת
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-yellow-800 mb-2" style="direction: rtl; text-align: right;">רמות אמינות</h4>
                            <div class="space-y-2">
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 bg-red-800 rounded-full"></div>
                                    <span class="text-sm text-gray-700" style="direction: rtl; text-align: right;"><strong>אדום כהה:</strong> נתונים ברמת אמינות גבוהה</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                    <span class="text-sm text-gray-700" style="direction: rtl; text-align: right;"><strong>אדום בינוני:</strong> נתונים ברמת אמינות בינונית</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 bg-red-300 rounded-full"></div>
                                    <span class="text-sm text-gray-700" style="direction: rtl; text-align: right;"><strong>אדום בהיר:</strong> נתונים ברמת אמינות נמוכה יותר</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        חפשו את סוגי הסמנים השונים האלה כשאתם חוקרים את המפה!
                    </p>
                `,
                highlight: 'map'
            },
            {
                title: "ציר זמן אירועים היסטוריים",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        הסמנים הקטנים על ציר הזמן מייצגים אירועים היסטוריים מרכזיים. רחפו מעליהם כדי לראות:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>שם האירוע</strong> בעברית ובאנגלית</li>
                        <li><strong>שנה היסטורית</strong> בלוח הגרגוריאני והעברי</li>
                        <li><strong>קישורי ויקיפדיה</strong> למידע מפורט</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        רחפו מעל סמני ציר הזמן כדי לחקור אירועים היסטוריים!
                    </p>
                `,
                highlight: 'timeline-markers'
            },
            {
                title: "אירועים היסטוריים על המפה",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        אליפסות צבעוניות על המפה מציגות את ההיקף הגיאוגרפי של אירועים היסטוריים מרכזיים:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>אליפסות אדומות</strong> - טבחים ורדיפות</li>
                        <li><strong>צבעים אחרים</strong> - סוגים שונים של אירועים היסטוריים</li>
                        <li><strong>לחצו על אליפסות</strong> כדי ללמוד עוד על אירועים ספציפיים</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        חפשו את הצורות הצבעוניות על המפה - הן מציגות איפה התרחשו אירועים מרכזיים!
                    </p>
                `,
                highlight: 'map'
            },
            {
                title: "אפשרויות תצוגת מפה",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        אתם יכולים להתאים את תצוגת המפה באמצעות הפקדים:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>שמות מקומות</strong> - בחרו בין שפה מקומית, גרמנית או אנגלית</li>
                        <li><strong>תצוגת מפה</strong> - החלפו בין התמקדות באירופה והמזרח התיכון או באמריקות</li>
                        <li><strong>פרספקטיבות שונות</strong> עוזרות לכם לחקור אזורים שונים</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        נסו להחליף בין תצוגות מפה שונות כדי לראות איך זה משנה את הפרספקטיבה!
                    </p>
                `,
                highlight: 'controls'
            },
            {
                title: "מסע בזמן: תקופה עתיקה",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        בואו נצא למסע בזמן! נתחיל בתקופות עתיקות ונראה איך הקהילות היהודיות 
                        התפתחו והתפשטו ברחבי העולם.
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        <strong>תקופה עתיקה (-1400 עד 0 לפנה"ס):</strong> הסיפור מתחיל עם יציאת מצרים 
                        והקמת ממלכת ישראל. צפו איך קהילות נוצרות במזרח הקרוב העתיק.
                    </p>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        ציר הזמן יציג כעת אוטומטית את התקופה העתיקה. צפו בקהילות מופיעות!
                    </p>
                `,
                highlight: 'timeline',
                action: () => {
                    const timeline = document.getElementById('timeline');
                    timeline.noUiSlider.set(-1000);
                }
            },
            {
                title: "מסע בזמן: תקופה מודרנית",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        עכשיו בואו נראה את התקופה המודרנית ואיך הקהילות היהודיות התפשטו ברחבי העולם:
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        <strong>תקופה מודרנית (1800-1948 לספירה):</strong> הגירות מרכזיות לאמריקות, 
                        השואה, והקמת ישראל המודרנית. שימו לב איך קהילות מופיעות ברחבי הגלובוס.
                    </p>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        ציר הזמן יציג כעת את התקופה המודרנית. ראו איך קהילות מתפשטות ברחבי העולם!
                    </p>
                `,
                highlight: 'timeline',
                action: () => {
                    const timeline = document.getElementById('timeline');
                    timeline.noUiSlider.set(1900);
                }
            },
            {
                title: "פקד קיבוץ",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        אתם יכולים לשלוט איך קהילות מקובצות יחד באמצעות מחוון הקיבוץ:
                    </p>
                    <div class="space-y-4 mb-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800 mb-2" style="direction: rtl; text-align: right;">אפשרויות קיבוץ</h4>
                            <ul class="text-sm text-gray-700 space-y-2" style="direction: rtl; text-align: right;">
                                <li><strong>רדיוס קטן (10-50px):</strong> יותר קהילות בודדות נראות, קיבוצים קטנים יותר</li>
                                <li><strong>רדיוס בינוני (50-100px):</strong> תצוגה מאוזנת - הגדרה ברירת מחדל</li>
                                <li><strong>רדיוס גדול (100-200px):</strong> תצוגה יותר מצטברת, קיבוצים גדולים יותר</li>
                            </ul>
                        </div>
                    </div>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        נסו להתאים את מחוון הקיבוץ כדי לראות איך זה משנה את תצוגת המפה!
                    </p>
                `,
                highlight: 'cluster-control'
            },
            {
                title: "ציר זמן תקופות היסטוריות",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        מתחת לציר הזמן הראשי, תראו פס מקודד בצבעים המציג תקופות היסטוריות שונות:
                    </p>
                    <div class="space-y-4 mb-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-3" style="direction: rtl; text-align: right;">תקופות היסטוריות</h4>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 rounded" style="background-color: #8B4513;"></div>
                                    <span>תקופה מקראית (1400-586 לפנה"ס)</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 rounded" style="background-color: #B8860B;"></div>
                                    <span>בית שני (586 לפנה"ס-70 לספירה)</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 rounded" style="background-color: #228B22;"></div>
                                    <span>תקופה תלמודית (70-500 לספירה)</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 rounded" style="background-color: #4169E1;"></div>
                                    <span>ימי הביניים (500-1500 לספירה)</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 rounded" style="background-color: #9370DB;"></div>
                                    <span>מודרני מוקדם (1500-1800 לספירה)</span>
                                </div>
                                <div class="flex items-center space-x-2" style="direction: rtl;">
                                    <div class="w-4 h-4 rounded" style="background-color: #FF6347;"></div>
                                    <span>מודרני (1800-2025 לספירה)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>לחצו על כל תקופה</strong> כדי לקפוץ לתחילת העידן ההוא</li>
                        <li><strong>התקופה הנוכחית</strong> מודגשת עם גבול וצל</li>
                        <li><strong>תוויות שנים</strong> מציגות את הגבולות בין התקופות</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        לחצו על כל תקופה היסטורית כדי לנווט במהירות לעידן ההוא!
                    </p>
                `,
                highlight: 'historical-periods'
            },
            {
                title: "הסיור הושלם!",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        מזל טוב! סיימתם את הסיור ולמדתם על התכונות המרכזיות של 
                        ויזואליזציית ציר הזמן של הקהילות היהודיות הזו.
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        עכשיו אתם יודעים איך:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li>לנווט דרך 3,400+ שנות היסטוריה</li>
                        <li>להבין סוגי סמנים שונים ואת משמעותם</li>
                        <li>לקרוא נתוני אוכלוסייה ורמות אמינות</li>
                        <li>לחקור אוכלוסיות קהילות ופרטים</li>
                        <li>ללמוד על אירועים היסטוריים והשפעתם</li>
                        <li>להתאים את תצוגת המפה והעדפות השפה</li>
                        <li>לשלוט בגרגריות הקיבוץ לתצוגות שונות</li>
                        <li>להשתמש בתקופות היסטוריות לניווט מהיר</li>
                        <li>להשתמש בכל התכונות האינטראקטיביות</li>
                    </ul>
                    <p class="text-green-600 font-medium" style="direction: rtl; text-align: right;">
                        התחילו לחקור! השתמשו בציר הזמן כדי לגלות את ההיסטוריה העשירה של הקהילות היהודיות ברחבי העולם.
                    </p>
                `,
                highlight: null
            },
            {
                title: "פקדי מפה",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        השתמשו בפקדי המפה כדי להתאים את התצוגה:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>חיפוש</strong> - מצא ערים או אזורים ספציפיים</li>
                        <li><strong>תוויות</strong> - החלף בין סגנונות מפה ושפות שונים</li>
                        <li><strong>תצוגה</strong> - החלף בין ספקי מפה שונים</li>
                        <li><strong>קיבוץ</strong> - התאם איך קהילות מקובצות יחד</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        נסו לשנות את סגנון המפה או לחפש מיקום ספציפי!
                    </p>
                `,
                highlight: 'controls'
            },
            {
                title: "מקורות נתונים ואמינות",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        הנתונים מגיעים מרשומות היסטוריות, ממצאים ארכיאולוגיים ומחקר אקדמי. 
                        הערכות אוכלוסייה מבוססות על:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li>רשומות מס ונתוני מפקד</li>
                        <li>ראיות ארכיאולוגיות</li>
                        <li>מסמכים היסטוריים וכרוניקות</li>
                        <li>הערכות אקדמיות ושיחזורים</li>
                    </ul>
                    <p class="text-gray-700 leading-relaxed" style="direction: rtl; text-align: right;">
                        רמות אמינות מציינות את האמינות של כל נקודת נתונים בהתבסס על מקורות זמינים.
                    </p>
                `,
                highlight: null
            },
            {
                title: "תקופות היסטוריות",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        ציר הזמן מכסה תקופות מרכזיות בהיסטוריה היהודית:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li><strong>תקופה עתיקה</strong> (1400 לפנה"ס - 70 לספירה) - זמנים מקראיים, בית ראשון ושני</li>
                        <li><strong>תקופה רבנית</strong> (70 - 500 לספירה) - פיתוח המשנה והתלמוד</li>
                        <li><strong>תקופה מימי הביניים</strong> (500 - 1500 לספירה) - קהילות גולה, תור הזהב של ספרד</li>
                        <li><strong>תקופה מודרנית מוקדמת</strong> (1500 - 1800 לספירה) - גירושים, הגירות, קהילות חדשות</li>
                        <li><strong>תקופה מודרנית</strong> (1800 - היום) - אמנציפציה, הגירה, מדינות מודרניות</li>
                    </ul>
                    <p class="text-blue-600 font-medium" style="direction: rtl; text-align: right;">
                        השתמשו בכפתורי התקופות ההיסטוריות לניווט מהיר לתקופות מרכזיות!
                    </p>
                `,
                highlight: 'periods'
            },
            {
                title: "אתם מוכנים לחקור!",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4" style="direction: rtl; text-align: right;">
                        עכשיו אתם יודעים איך לנווט בציר הזמן האינטראקטיבי הזה! זכרו:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4" style="direction: rtl; text-align: right;">
                        <li>השתמשו בציר הזמן לחקור תקופות זמן שונות</li>
                        <li>לחצו על קהילות ואירועים למידע מפורט</li>
                        <li>שלטו בגרגריות הקיבוץ לתצוגות שונות</li>
                        <li>השתמשו בתקופות היסטוריות לניווט מהיר</li>
                        <li>השתמשו בכל התכונות האינטראקטיביות</li>
                    </ul>
                    <p class="text-green-600 font-medium" style="direction: rtl; text-align: right;">
                        התחילו לחקור! השתמשו בציר הזמן כדי לגלות את ההיסטוריה העשירה של הקהילות היהודיות ברחבי העולם.
                    </p>
                `,
                highlight: null
            }
        ],
        fr: [
            {
                title: "Bienvenue dans la Chronologie des Communautés Juives",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Bienvenue ! Cette visualisation interactive montre l'histoire démographique des communautés juives 
                        dans le monde entier, des temps anciens à nos jours. Vous explorerez plus de 3 400 ans d'histoire juive 
                        à travers les données démographiques, les modèles de migration et les événements historiques.
                    </p>
                    <p class="text-gray-700 leading-relaxed">
                        Commençons par apprendre les contrôles de la chronologie et comment naviguer dans l'histoire.
                    </p>
                `,
                highlight: null
            },
            {
                title: "Navigation dans la Chronologie",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        La chronologie en bas vous permet de naviguer dans l'histoire. Vous pouvez :
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Faire glisser le curseur</strong> pour sauter à n'importe quelle année</li>
                        <li><strong>Cliquer sur l'affichage de l'année</strong> pour l'éditer directement et sauter à une année spécifique</li>
                        <li><strong>Utiliser le bouton de lecture</strong> pour animer automatiquement dans le temps</li>
                        <li><strong>Ajuster la vitesse</strong> avec le contrôle de vitesse</li>
                        <li><strong>Utiliser les boutons d'étape</strong> (-10, -5, -1, +1, +5, +10) pour une navigation précise</li>
                    </ul>
                    <p class="text-blue-600 font-medium">
                        Essayez de faire glisser le curseur de la chronologie ou de cliquer sur l'affichage de l'année pour voir comment la carte change !
                    </p>
                `,
                highlight: 'timeline'
            },
            {
                title: "Marqueurs de Communautés",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Chaque cercle sur la carte représente une communauté juive (kehila) à cette période. 
                        Les marqueurs montrent :
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Taille de la population</strong> - affichée sous forme de nombres dans les marqueurs</li>
                        <li><strong>Niveau de confiance</strong> - la couleur indique la fiabilité des données (bleu = élevé, plus clair = plus bas)</li>
                        <li><strong>Taille du marqueur</strong> - marqueurs plus grands = populations plus importantes</li>
                    </ul>
                    <p class="text-blue-600 font-medium">
                        Cliquez sur n'importe quel marqueur pour voir des informations détaillées sur cette communauté !
                    </p>
                `,
                highlight: 'map'
            },
            {
                title: "Comprendre les Marqueurs de Communautés",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Explorons les différents types de marqueurs que vous verrez sur la carte :
                    </p>
                    <div class="space-y-4 mb-4">
                        <div class="bg-red-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-red-800 mb-2">Marqueurs de Communautés Individuelles</h4>
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">1.2k</div>
                                <div class="text-sm text-gray-700">
                                    <strong>Petit marqueur :</strong> Communautés plus petites
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 mt-2">
                                <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">15k</div>
                                <div class="text-sm text-gray-700">
                                    <strong>Marqueur moyen :</strong> Communautés de taille moyenne
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 mt-2">
                                <div class="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold" style="box-shadow: 0 2px 6px rgba(0,0,0,0.4);">250k</div>
                                <div class="text-sm text-gray-700">
                                    <strong>Grand marqueur :</strong> Communautés majeures
                                </div>
                            </div>
                            <p class="text-xs text-gray-600 mt-2 italic">
                                Les marqueurs plus grands représentent des communautés plus importantes
                            </p>
                        </div>
                        
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800 mb-2">Marqueurs de Regroupement</h4>
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold" style="box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
                                    <div>5</div>
                                    <div class="text-xs">2.1M</div>
                                </div>
                                <div class="text-sm text-gray-700">
                                    <strong>Marqueur de regroupement :</strong> Groupe les communautés voisines ensemble<br>
                                    <em>Nombre du haut :</em> Nombre de communautés<br>
                                    <em>Nombre du bas :</em> Population totale
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-yellow-800 mb-2">Niveaux de Confiance</h4>
                            <div class="space-y-2">
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 bg-red-800 rounded-full"></div>
                                    <span class="text-sm text-gray-700"><strong>Rouge foncé :</strong> Données de haute confiance</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                    <span class="text-sm text-gray-700"><strong>Rouge moyen :</strong> Données de confiance moyenne</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 bg-red-300 rounded-full"></div>
                                    <span class="text-sm text-gray-700"><strong>Rouge clair :</strong> Données de confiance plus faible</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-blue-600 font-medium">
                        Cherchez ces différents types de marqueurs pendant que vous explorez la carte !
                    </p>
                `,
                highlight: 'map'
            },
            {
                title: "Chronologie des Événements Historiques",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Les petits marqueurs sur la chronologie représentent des événements historiques majeurs. Survolez-les pour voir :
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Nom de l'événement</strong> en hébreu et en anglais</li>
                        <li><strong>Année historique</strong> dans les calendriers grégorien et hébreu</li>
                        <li><strong>Liens Wikipédia</strong> pour des informations détaillées</li>
                    </ul>
                    <p class="text-blue-600 font-medium">
                        Survolez les marqueurs de la chronologie pour explorer les événements historiques !
                    </p>
                `,
                highlight: 'timeline-markers'
            },
            {
                title: "Événements Historiques sur la Carte",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Les ellipses colorées sur la carte montrent la portée géographique des événements historiques majeurs :
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Ellipses rouges</strong> - Massacres et persécutions</li>
                        <li><strong>Autres couleurs</strong> - Différents types d'événements historiques</li>
                        <li><strong>Cliquez sur les ellipses</strong> pour en savoir plus sur des événements spécifiques</li>
                    </ul>
                    <p class="text-blue-600 font-medium">
                        Cherchez les formes colorées sur la carte - elles montrent où se sont produits les événements majeurs !
                    </p>
                `,
                highlight: 'map'
            },
            {
                title: "Options d'Affichage de la Carte",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Vous pouvez personnaliser votre vue de la carte en utilisant les contrôles :
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Noms de lieux</strong> - Choisissez entre langue locale, allemande ou anglaise</li>
                        <li><strong>Vue de la carte</strong> - Basculez entre Europe & Moyen-Orient ou Amériques</li>
                        <li><strong>Perspectives différentes</strong> vous aident à explorer différentes régions</li>
                    </ul>
                    <p class="text-blue-600 font-medium">
                        Essayez de basculer entre différentes vues de carte pour voir comment cela change la perspective !
                    </p>
                `,
                highlight: 'controls'
            },
            {
                title: "Voyage dans le Temps : Période Ancienne",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Faisons un voyage dans le temps ! Nous commencerons dans les temps anciens et verrons comment les 
                        communautés juives se sont développées et répandues dans le monde.
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        <strong>Période Ancienne (-1400 à 0 AEC) :</strong> L'histoire commence avec l'Exode 
                        et l'établissement du Royaume d'Israël. Regardez comment les communautés se forment dans 
                        l'ancien Proche-Orient.
                    </p>
                    <p class="text-blue-600 font-medium">
                        La chronologie va maintenant automatiquement montrer la période ancienne. Regardez les communautés apparaître !
                    </p>
                `,
                highlight: 'timeline',
                action: () => {
                    const timeline = document.getElementById('timeline');
                    timeline.noUiSlider.set(-1000);
                }
            },
            {
                title: "Voyage dans le Temps : Période Moderne",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Maintenant, voyons la période moderne et comment les communautés juives se sont répandues dans le monde :
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        <strong>Période Moderne (1800-1948 EC) :</strong> Migrations majeures vers les Amériques, 
                        l'Holocauste, et l'établissement d'Israël moderne. Remarquez comment les communautés 
                        apparaissent à travers le globe.
                    </p>
                    <p class="text-blue-600 font-medium">
                        La chronologie va maintenant montrer la période moderne. Voyez comment les communautés se répandent dans le monde !
                    </p>
                `,
                highlight: 'timeline',
                action: () => {
                    const timeline = document.getElementById('timeline');
                    timeline.noUiSlider.set(1900);
                }
            },
            {
                title: "Contrôle de Regroupement",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Vous pouvez contrôler comment les communautés sont regroupées ensemble en utilisant le curseur de regroupement :
                    </p>
                    <div class="space-y-4 mb-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800 mb-2">Options de Regroupement</h4>
                            <ul class="text-sm text-gray-700 space-y-2">
                                <li><strong>Petit rayon (10-50px) :</strong> Plus de communautés individuelles visibles, regroupements plus petits</li>
                                <li><strong>Rayon moyen (50-100px) :</strong> Vue équilibrée - réglage par défaut</li>
                                <li><strong>Grand rayon (100-200px) :</strong> Vue plus agrégée, regroupements plus grands</li>
                            </ul>
                        </div>
                    </div>
                    <p class="text-blue-600 font-medium">
                        Essayez d'ajuster le curseur de regroupement pour voir comment cela change la vue de la carte !
                    </p>
                `,
                highlight: 'cluster-control'
            },
            {
                title: "Chronologie des Périodes Historiques",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Sous la chronologie principale, vous verrez une barre codée par couleur montrant différentes périodes historiques :
                    </p>
                    <div class="space-y-4 mb-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-3">Périodes Historiques</h4>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded" style="background-color: #8B4513;"></div>
                                    <span>Ère Biblique (1400-586 AEC)</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded" style="background-color: #B8860B;"></div>
                                    <span>Second Temple (586 AEC-70 EC)</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded" style="background-color: #228B22;"></div>
                                    <span>Ère Talmudique (70-500 EC)</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded" style="background-color: #4169E1;"></div>
                                    <span>Médiéval (500-1500 EC)</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded" style="background-color: #9370DB;"></div>
                                    <span>Moderne Précoce (1500-1800 EC)</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="w-4 h-4 rounded" style="background-color: #FF6347;"></div>
                                    <span>Moderne (1800-2025 EC)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li><strong>Cliquez sur n'importe quelle période</strong> pour sauter au début de cette ère</li>
                        <li><strong>Période actuelle</strong> est mise en surbrillance avec une bordure et une ombre</li>
                        <li><strong>Étiquettes d'années</strong> montrent les frontières entre les périodes</li>
                    </ul>
                    <p class="text-blue-600 font-medium">
                        Cliquez sur n'importe quelle période historique pour naviguer rapidement vers cette ère !
                    </p>
                `,
                highlight: 'historical-periods'
            },
            {
                title: "Visite Terminée !",
                content: `
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Félicitations ! Vous avez terminé la visite et appris les fonctionnalités clés de 
                        cette visualisation de chronologie des communautés juives.
                    </p>
                    <p class="text-gray-700 leading-relaxed mb-4">
                        Vous savez maintenant comment :
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
                        <li>Naviguer à travers plus de 3 400 ans d'histoire</li>
                        <li>Comprendre différents types de marqueurs et leurs significations</li>
                        <li>Lire les données démographiques et les niveaux de confiance</li>
                        <li>Explorer les populations et détails des communautés</li>
                        <li>Apprendre sur les événements historiques et leur impact</li>
                        <li>Personnaliser votre vue de carte et préférences linguistiques</li>
                        <li>Contrôler la granularité du regroupement pour différentes vues</li>
                        <li>Utiliser les périodes historiques pour une navigation rapide</li>
                        <li>Utiliser toutes les fonctionnalités interactives</li>
                    </ul>
                    <p class="text-green-600 font-medium">
                        Commencez à explorer ! Utilisez la chronologie pour découvrir la riche histoire des communautés juives dans le monde.
                    </p>
                `,
                highlight: null
            }
        ]
    };

    function showTourStep(stepIndex) {
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        const steps = window.i18n ? window.i18n.t('tour.steps') : tourSteps[tourLanguage];
        const step = steps[stepIndex];
        currentTourStep = stepIndex;
        
        // Get highlighting info from hardcoded tourSteps (which has highlight property)
        const highlightStep = tourSteps[tourLanguage] ? tourSteps[tourLanguage][stepIndex] : tourSteps['en'][stepIndex];
        
        // Update progress
        const stepText = window.i18n ? window.i18n.t('tour.step') : 'Step';
        const ofText = window.i18n ? window.i18n.t('tour.of') : 'of';
        tourProgress.textContent = `${stepText} ${stepIndex + 1} ${ofText} ${steps.length}`;
        
        // Update content
        tourContent.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-800 mb-4">${step.title}</h3>
            ${step.content}
        `;
        
        // Update buttons
        prevTourStep.disabled = stepIndex === 0;
        const nextText = window.i18n ? window.i18n.t('ui.next') : 'Next';
        const finishText = stepIndex === steps.length - 1 ? 
            (currentLang === 'he' ? 'סיום' : 
             currentLang === 'fr' ? 'Terminer' : 'Finish') : nextText;
        nextTourStep.textContent = finishText;
        
        // Update previous button text
        const prevText = window.i18n ? window.i18n.t('ui.previous') : 'Previous';
        prevTourText.textContent = prevText;
        
        // Update skip button text
        const skipText = window.i18n ? window.i18n.t('ui.skipTour') : 'Skip Tour';
        skipTour.textContent = skipText;
        
        // Update title
        const titleText = window.i18n ? window.i18n.t('tour.title') : 'Interactive Tour';
        tourTitle.textContent = titleText;
        
        // Handle highlighting using hardcoded tourSteps
        if (highlightStep && highlightStep.highlight) {
            highlightElement(highlightStep.highlight);
        } else {
            hideHighlight();
        }
        
        // Execute action if present
        if (highlightStep && highlightStep.action) {
            setTimeout(highlightStep.action, 500);
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
            case 'cluster-control':
                element = document.getElementById('clusterRadius');
                break;
            case 'historical-periods':
                element = document.getElementById('historical-periods');
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
        languageModal.classList.add('hidden');
        tourOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        currentTourStep = 0;
    }

    // Language selection event listeners
    document.getElementById('selectEnglish').addEventListener('click', () => {
        if (window.i18n) {
            window.i18n.switchLanguage('en');
        }
        tourLanguage = 'en';
        languageModal.classList.add('hidden');
        tourModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        showTourStep(0);
    });

    document.getElementById('selectHebrew').addEventListener('click', () => {
        if (window.i18n) {
            window.i18n.switchLanguage('he');
        }
        tourLanguage = 'he';
        languageModal.classList.add('hidden');
        tourModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        showTourStep(0);
    });

    const frenchButton = document.getElementById('selectFrench');
    if (frenchButton) {
        frenchButton.addEventListener('click', () => {
            console.log('French language selected');
            if (window.i18n) {
                window.i18n.switchLanguage('fr');
            }
            tourLanguage = 'fr';
            languageModal.classList.add('hidden');
            tourModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            showTourStep(0);
        });
    } else {
        console.error('French button not found in DOM');
    }

    // Tour event listeners
    startTourButton.addEventListener('click', () => {
        languageModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    closeTourModal.addEventListener('click', closeTour);
    skipTour.addEventListener('click', closeTour);

    prevTourStep.addEventListener('click', () => {
        if (currentTourStep > 0) {
            showTourStep(currentTourStep - 1);
        }
    });

    nextTourStep.addEventListener('click', () => {
        const steps = tourSteps[tourLanguage];
        if (currentTourStep < steps.length - 1) {
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

    // Listen for language changes to update tour and tooltips
    window.addEventListener('languageChanged', (e) => {
        tourLanguage = e.detail.language;
        if (!tourModal.classList.contains('hidden')) {
            showTourStep(currentTourStep);
        }
        // Refresh event markers with new language
        addEventMarkers();
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
    const baseSize = 10;
//    if (population < 1000) return baseSize;
//    if (population < 5000) return baseSize * 1.5;
//    if (population < 10000) return baseSize * 2;
//    if (population < 50000) return baseSize * 2.5;
    return Math.max(baseSize, Math.floor(2.38862 * Math.log(population)));  //  Math.log computes the Natural Logarithm, 2.38862*np.log(100) = 11
}


function getConfidenceColor(confidence) {
    switch (confidence.toLowerCase()) {
        case 'high':
            return '#dc2626';  // Dark red
        case 'medium':
            return '#ef4444';  // Medium red
        case 'low':
            return '#f87171';  // Light red
        default:
            return '#ef3333';  // Default: Medium red
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
    const linkHtml = arrowData.url ? `
            <div class="tooltip-link" style="margin-top:6px;">
                <a href="${arrowData.url}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-size: 12px;">
                    Learn more ↗
                </a>
            </div>
        ` : '';

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
            ${linkHtml}
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
    const relevantArrows = historicalArrows.filter(arrow => {
        const isInRange = year >= arrow.yearStart && year <= arrow.yearEnd;
        const isSingleYearEvent = arrow.yearStart === arrow.yearEnd && year === arrow.yearEnd + 1;
        return isInRange || isSingleYearEvent;
    });

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
        // Each row: center_lon, center_lat, radii1, radii2, tilt_deg, color, fillColor, fillOpacity, year_start, year_end, description_eng, description_heb, source, type
        const events = rows
            .filter(row => row.trim())
            .map(row => {
                const [
                    center_lon, center_lat, radii1, radii2, tilt_deg,
                    color, fillColor, fillOpacity, year_start, year_end,
                    description_eng, description_heb, source, type
                ] = parseCSVLine(row).slice(0, 14);

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
                    descriptionEng: description_eng ? description_eng.replace(/"/g, '') : '',
                    descriptionHeb: description_heb ? description_heb.replace(/"/g, '') : '',
                    source: source ? source.replace(/"/g, '') : '',
                    type: parseInt(type)
                };
            });

        // Events are sorted by yearStart ascending per specification; stop scanning once > year
        const relevant = [];
        for (let i = 0; i < events.length; i++) {
            const ev = events[i];
            if (ev.yearStart > year) break;
            const isInRange = ev.yearStart <= year && (ev.yearEnd === undefined || ev.yearEnd >= year);
            const isSingleYearEvent = ev.yearStart === ev.yearEnd && year === ev.yearEnd + 1;
            if (isInRange || isSingleYearEvent) {
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
        // Each row: polygon_coordinates, color, fillColor, fillOpacity, year_start, year_end, description_eng, description_heb, source, type
        const events = rows
            .filter(row => row.trim())
            .map(row => {
                const [
                    polygon_coords, color, fillColor, fillOpacity, year_start, year_end,
                    description_eng, description_heb, source, type
                ] = parseCSVLine(row).slice(0, 10);

                const actualYearEnd = year_end == undefined || year_end.trim() === '' ? undefined : parseInt(year_end);
                return {
                    coordinates: parsePolygonCoordinates(polygon_coords),
                    color: color,
                    fillColor: fillColor,
                    fillOpacity: parseFloat(fillOpacity),
                    yearStart: parseInt(year_start),
                    yearEnd: actualYearEnd,
                    descriptionEng: description_eng ? description_eng.replace(/"/g, '') : '',
                    descriptionHeb: description_heb ? description_heb.replace(/"/g, '') : '',
                    source: source ? source.replace(/"/g, '') : '',
                    type: parseInt(type)
                };
            });

        // Events are sorted by yearStart ascending per specification; stop scanning once > year
        const relevant = [];
        for (let i = 0; i < events.length; i++) {
            const ev = events[i];
            if (ev.yearStart > year) break;
            const isInRange = ev.yearStart <= year && (ev.yearEnd === undefined || ev.yearEnd >= year);
            const isSingleYearEvent = ev.yearStart === ev.yearEnd && year === ev.yearEnd + 1;
            if (isInRange || isSingleYearEvent) {
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
            7: { he: "גטו", en: "Ghetto" },
            8: { he: "מהפכה", en: "Revolution" },
            9: { he: "פוגרום", en: "Pogrom" },
            10: { he: "ממלכה", en: "Kingdom" },
            11: { he: "מחשבת ישראל", en: "Jewish Thought" }
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
        ${ev.descriptionEng || ev.descriptionHeb ? `
            <div style="margin: 6px 0;">
                <strong>תיאור:</strong>
                ${ev.descriptionHeb ? `<div style="margin: 2px 0;">${ev.descriptionHeb}</div>` : ''}
                ${ev.descriptionEng ? `<div style="margin: 2px 0; color: #666; font-size: 12px;">${ev.descriptionEng}</div>` : ''}
            </div>
        ` : ''}
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

// Make year display editable inline
function makeYearEditable() {
    const yearDisplay = document.getElementById('year-display');
    const currentYear = parseInt(timeline.noUiSlider.get());
    
    // Store original content
    const originalContent = yearDisplay.innerHTML;
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentYear.toString();
    input.style.cssText = `
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        border: 2px solid #3b82f6;
        border-radius: 4px;
        padding: 2px 6px;
        background: white;
        color: #1f2937;
        width: 120px;
        text-align: center;
        outline: none;
    `;
    
    // Replace year display with input
    yearDisplay.innerHTML = '';
    yearDisplay.appendChild(input);
    yearDisplay.style.cursor = 'text';
    
    // Focus and select text
    input.focus();
    input.select();
    
    // Handle input events
    const handleInput = (e) => {
        if (e.key === 'Enter') {
            saveYear();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };
    
    const saveYear = () => {
        const newYear = parseInt(input.value);
        
        // Validate input
        if (isNaN(newYear)) {
            showError('Please enter a valid number');
            return;
        }
        
        if (newYear < startYear0 || newYear > endYear0) {
            showError(`Year must be between ${startYear0} and ${endYear0}`);
            return;
        }
        
        // Update timeline to new year
        timeline.noUiSlider.set(newYear);
        
        // The timeline update will trigger the 'update' event which will update the display text
        // We need to wait for the update event to complete, then restore the display
        setTimeout(() => {
            yearDisplay.style.cursor = 'pointer';
        }, 50);
    };
    
    const cancelEdit = () => {
        yearDisplay.innerHTML = originalContent;
        yearDisplay.style.cursor = 'pointer';
    };
    
    const showError = (message) => {
        input.style.borderColor = '#ef4444';
        input.style.backgroundColor = '#fef2f2';
        
        // Show error message briefly
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            margin-top: 4px;
        `;
        
        yearDisplay.style.position = 'relative';
        yearDisplay.appendChild(errorDiv);
        
        // Remove error after 2 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
            input.style.borderColor = '#3b82f6';
            input.style.backgroundColor = 'white';
        }, 2000);
    };
    
    // Add event listeners
    input.addEventListener('keydown', handleInput);
    input.addEventListener('blur', saveYear); // Save when clicking outside
    
    // Prevent year display click during editing
    yearDisplay.removeEventListener('click', makeYearEditable);
    
    // Re-add click listener after editing is done
    const reAddListener = () => {
        setTimeout(() => {
            yearDisplay.addEventListener('click', makeYearEditable);
        }, 100);
    };
    
    input.addEventListener('blur', reAddListener);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            reAddListener();
        }
    });
}

// Historical periods data (matching the HTML)
const historicalPeriods = {
    "Biblical Era": { start: -1400, end: -586, color: "#8B4513" },
    "Second Temple": { start: -586, end: 70, color: "#B8860B" },
    "Talmudic Era": { start: 70, end: 500, color: "#228B22" },
    "Medieval": { start: 500, end: 1500, color: "#4169E1" },
    "Early Modern": { start: 1500, end: 1800, color: "#9370DB" },
    "Modern": { start: 1800, end: 2025, color: "#FF6347" }
};

// Add historical periods interaction functionality
function addHistoricalPeriodsInteraction() {
    const periodBars = document.querySelectorAll('.period-bar');
    
    // Add click handlers to period bars
    periodBars.forEach(bar => {
        bar.addEventListener('click', function() {
            const period = this.dataset.period;
            const periodData = historicalPeriods[period];
            if (periodData) {
                // Set timeline to the beginning of the period
                timeline.noUiSlider.set(periodData.start);
            }
        });
    });
    
    // Update period highlighting based on current year
    timeline.noUiSlider.on('update', function(values) {
        const currentYear = parseInt(values[0]);
        updatePeriodHighlighting(currentYear);
    });
}

// Add clustering control functionality
function addClusteringControl() {
    const clusterRadiusSlider = document.getElementById('clusterRadius');
    const clusterValueDisplay = document.getElementById('clusterValue');
    
    // Update display value
    function updateClusterValue() {
        const value = clusterRadiusSlider.value;
        clusterValueDisplay.textContent = value + 'px';
    }
    
    // Handle slider change
    clusterRadiusSlider.addEventListener('input', function() {
        updateClusterValue();
        updateClusterRadius(parseInt(this.value));
    });
    
    // Initialize display
    updateClusterValue();
}

// Update cluster radius
function updateClusterRadius(radius) {
    if (markersLayer && map) {
        // Store current markers
        const currentMarkers = [];
        markersLayer.eachLayer(function(marker) {
            currentMarkers.push(marker);
        });
        
        // Remove current cluster group from map
        map.removeLayer(markersLayer);
        
        // Create new cluster group with updated radius
        markersLayer = L.markerClusterGroup({
            maxClusterRadius: radius,
            iconCreateFunction: function(cluster) {
                const childCount = cluster.getChildCount();
                let totalPopulation = 0;
                
                // Calculate total population for all markers in this cluster
                cluster.getAllChildMarkers().forEach(marker => {
                    if (marker.kehilaData && marker.kehilaData.actual_pop) {
                        totalPopulation += marker.kehilaData.actual_pop;
                    }
                });
                
                // Format population with shorter format for large numbers
                const formattedPopulation = formatPopulation(totalPopulation);
                
                // Calculate cluster size based on total population using the same function as individual markers
                const clusterSize = getMarkerSize(totalPopulation);
                const iconSize = Math.max(32, clusterSize * 2.5);
                const iconAnchor = iconSize / 2;
                
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
        
        // Add markers back to the new cluster group
        currentMarkers.forEach(marker => {
            markersLayer.addLayer(marker);
        });
        
        // Add the new cluster group to the map
        map.addLayer(markersLayer);
        
        console.log(`Cluster radius updated to ${radius}px`);
    }
}

// Update period highlighting based on current year
function updatePeriodHighlighting(year) {
    const periodBars = document.querySelectorAll('.period-bar');
    
    periodBars.forEach(bar => {
        const period = bar.dataset.period;
        const periodData = historicalPeriods[period];
        
        if (year >= periodData.start && year <= periodData.end) {
            // Current period - add highlight
            bar.style.border = '2px solid #333';
            bar.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
            bar.style.transform = 'scale(1.05)';
        } else {
            // Not current period - remove highlight
            bar.style.border = 'none';
            bar.style.boxShadow = 'none';
            bar.style.transform = 'scale(1)';
        }
    });
}
