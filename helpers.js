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
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1313))
    },
    {
        year: -1813,
        titleEn: "Abraham Born",
        titleHe: "לידת אברהם אבינו",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1813))
    },
    {
        year: -1000,
        titleEn: "Reign of King David",
        titleHe: "מלכות דוד",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-1000))
    },
    {
        year: -722,
        titleEn: "Temple Destruction",
        titleHe: "חורבן ממלכת ישראל",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-722))
    },
    {
        year: -586,
        titleEn: "Destruction of the First Temple",
        titleHe: "חורבן בית המקדש הראשון",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-586))
    },
     {
        year: -457,
        titleEn: "Aliya of Ezra",
        titleHe: "עליית עזרא לירושלים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-457))
    },
      {
        year: -167,
        titleEn: "Maccabean Revolt",
        titleHe: "מרד חשמונאים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(-167))
    },
    {
        year: 70,
        titleEn: "Destruction of the Second Temple",
        titleHe: "חורבן בית המקדש השני",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(70))
    },
        {
        year: 132,
        titleEn: "Bar Kokhba revolt",
        titleHe: "מרד בר כוכבא",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(132))
    },
     {
        year: 200,
        titleEn: "End of Tannaim Period",
        titleHe: "סוף תקופת התנאים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(200))
    },
      {
        year: 500,
        titleEn: "End of Amoraim Period",
        titleHe: "סוף תקופת האמוראים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(500))
    },
    {
        year: 1038,
        titleEn: "End of Amoraim Geonim",
        titleHe: "סוף תקופת הגאונים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1038))
    },
    {
        year: 1096,
        titleEn: "First Crusade",
        titleHe: "מסע הצלב הראשון",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1096))
    },
    {
        year: 1147,
        titleEn: "Second Crusade",
        titleHe: "מסע הצלב השני",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1147))
    },
    {
        year: 1189,
        titleEn: "Exile from Spain",
        titleHe: "מסע הצלב השלישי",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1189))
    },
    {
        year: 1492,
        titleEn: "Exile from Spain and End of Rishonim Period",
        titleHe: "גירוש ספרד וסוף תקופת הראשונים",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1492))
    },
    {
        year: 1939,
        titleEn: "The Holocaust",
        titleHe: "השואה",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1939))
    },
    {
        year: 1948,
        titleEn: "Israel Independence",
        titleHe: "הקמת מדינת ישראל",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(1948))
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
const endYear0 = 2025;
const totalRange0 = endYear0 - startYear0; // from -1600 to 2025

function addEventMarkers() {
    const timelineElement = document.getElementById('timeline');
    const totalRange = totalRange0; // from -1600 to 2025

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
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-hebrew">${event.titleHe}</div>
                <div class="tooltip-english">${event.titleEn}</div>
                <div class="tooltip-year">
                    ${event.year < 0 ? Math.abs(event.year) + ' BCE' : event.year + ' CE'} 
                    / ${event.hebrewYear}
                </div>
            </div>
        `;

        marker.appendChild(tooltip);
        
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
                    <strong> אוכלוסייה:</strong> ${kehila.actual_pop.toLocaleString()}
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
var animationSpeed = 10; // Default speed multiplier

function initializeMap() {
    // Initialize map
    map = L.map('map', {
        center: [41.9028, 25.4324],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10,
        maxBounds: [
            [20, -20],
            [65, 65]
        ]
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Initialize markers layer
    markersLayer = L.markerClusterGroup();
    map.addLayer(markersLayer);

    // Initialize arrows layer
    arrowsLayer = L.layerGroup();
    map.addLayer(arrowsLayer);

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
    });

    const playButton = document.getElementById('playButton');
    let isPlaying = false;

    // Speed control
    const speedControl = document.getElementById('speedControl');
    const speedDisplay = document.getElementById('speedDisplay');
    
    speedControl.addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
        speedDisplay.textContent = animationSpeed + 'x';
    });

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


function createCustomMarker(kehila) {
    const size = getMarkerSize(kehila.actual_pop);
    const color = getConfidenceColor(kehila.confidence);

    // Create custom div icon
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: ${size * 2}px;
            height: ${size * 2}px;
            background: ${color};
            border: 2px solid red;
            border-radius: 50%;
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
            opacity: 0.9;
        "></div>`,
        iconSize: [size * 2, size * 2],
        iconAnchor: [size, size]
    });

    return L.marker([kehila.lat, kehila.lon], { icon });
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
