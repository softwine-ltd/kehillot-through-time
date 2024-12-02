document.addEventListener('DOMContentLoaded', function () {
    // Load MarkerCluster after Leaflet is ready
    var markerClusterScript = document.createElement('script');
    markerClusterScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js';
    markerClusterScript.onload = initializeMap;  // Call initialization after MarkerCluster loads
    document.head.appendChild(markerClusterScript);
});

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
        year: 70,
        titleEn: "Temple Destruction",
        titleHe: "חורבן בית המקדש",
        hebrewYear: numberToHebrewLetters(convertToHebrewYear(70))
    },
    {
        year: 1492,
        titleEn: "Exile from Spain",
        titleHe: "גירוש ספרד",
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

function addEventMarkers() {
    const timelineElement = document.getElementById('timeline');
    const totalRange = 5024; // from -3000 to 2024

    historicalEvents.forEach(event => {
        const marker = document.createElement('div');
        marker.className = 'timeline-marker';

        const position = ((event.year + 3000) / totalRange) * 100;
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

async function loadData(year) {
    try {
        const response = await fetch('kehilot.csv');
        const csvText = await response.text();

        // Parse CSV
        const rows = csvText.split('\n').slice(1); // Skip header
        const kehilot = rows
            .filter(row => row.trim()) // Skip empty rows
            .map(row => {
                const [
                    country, city, long, lat, year_start, year_end,
                    pop_start, pop_end, probability, type, symbol,
                    city_english, city_hebrew, city_yid, city_german,
                    city_other, source, comment
                ] = parseCSVLine(row).slice(0, 18);


                // If year_end is empty, use current year
                const actualYearEnd = year_end == undefined || year_end.trim() === '' ? undefined : parseInt(year_end);
                const actualPopEnd = pop_end == undefined || pop_end.trim() === '' ? undefined : parseInt(pop_end);


                return {
                    name: city, // Fallback to city if English name not available
                    name_he: city_hebrew,
                    lat: lat,
                    lon: long,
                    year_start: parseInt(year_start),
                    year_end: actualYearEnd,
                    population_start: parseInt(pop_start),
                    population_end: actualPopEnd,
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

        const endYearDetails = kehila.year_end === undefined || kehila.year_end === '' ? '' : `
                    <small>
                        שנת חורבן: ${kehila.year_end < 0 ? Math.abs(kehila.year_end) + ' BCE' : kehila.year_end + ' CE'}
                        (${numberToHebrewLetters(convertToHebrewYear(kehila.year_end))})
                    </small>
                    <br>
        `;

        const populationEndDetails = kehila.population_end === undefined || kehila.population_end === '' ? '' : `
                    <div style="margin: 8px 0;">
                        <strong> אוכלוסייה בחורבן:</strong> ${kehila.population_end.toLocaleString()}
                    </div>
        `;

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
                    <strong> אוכלוסייה בהקמה:</strong> ${kehila.population_start.toLocaleString()}
                </div>
                ${populationEndDetails}
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
                        שנת ייסוד: ${kehila.year_start < 0 ? Math.abs(kehila.year_start) + ' BCE' : kehila.year_start + ' CE'}
                        (${numberToHebrewLetters(convertToHebrewYear(kehila.year_start))})
                    </small>
                    <br>
                    ${endYearDetails}
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

function initializeMap() {
    // Initialize map
    map = L.map('map', {
        center: [41.9028, 25.4324],
        zoom: 5,
        minZoom: 4,
        maxZoom: 8,
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

    // Initialize timeline
    const timeline = document.getElementById('timeline');
    const yearDisplay = document.getElementById('year-display');

    noUiSlider.create(timeline, {
        start: [-3000],
        range: {
            'min': [-3000],
            'max': [2024]
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
    });

    const playButton = document.getElementById('playButton');
    let isPlaying = false;

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
    const maxYear = 2024;
    const interval = 1000 / 24;

    const playInterval = setInterval(() => {
        const currentYear = parseInt(timeline.noUiSlider.get());
        if (currentYear >= maxYear) {
            clearInterval(playInterval);
            const playButton = document.getElementById('playButton');
            playButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>';
            return;
        }

        timeline.noUiSlider.set(currentYear + 10);
    }, interval);
    playIntervalGlobal = playInterval;
}

function getMarkerSize(population) {
    // Base size for the marker
    const baseSize = 8;
    if (population < 1000) return baseSize;
    if (population < 5000) return baseSize * 1.5;
    if (population < 10000) return baseSize * 2;
    if (population < 50000) return baseSize * 2.5;
    return baseSize * 3;
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
    const size = getMarkerSize(kehila.population_start);
    const color = getConfidenceColor(kehila.confidence);

    // Create custom div icon
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: ${size * 2}px;
            height: ${size * 2}px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
            opacity: 0.9;
        "></div>`,
        iconSize: [size * 2, size * 2],
        iconAnchor: [size, size]
    });

    return L.marker([kehila.lat, kehila.lon], { icon });
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
