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
        result += digits[tens];
        remaining %= 10;
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