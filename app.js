//# allFunctionsCalledOnLoad

async function getEventsByLocation(jsonUrl, locationInput) {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const events = await response.json();
        const normalizedInput = normalize(locationInput);

        return events.filter(event => {
            const loc = event.location || "";
            return normalize(loc).includes(normalizedInput);
        });

    } catch (error) {
        console.error("Error fetching or filtering events:", error);
        return [];
    }
}

// Normalize location "RKC 101", "rkc 101", "rkc101"
function normalize(str) {
    return str.toLowerCase().replace(/\s+/g, '');
}

async function handleSearch() {
    const input = document.getElementById("locationInput").value.trim();
    const output = document.getElementById("jsonOutput");
    output.value = "";

    if (!input) {
        output.value = "Please enter a location to search.";
        return;
    }

    const results = await getEventsByLocation(CONFIG.jsonUrl, input);

    if (results.length === 0) {
        output.value = "No events found for the specified location.";
    } else {
        output.value = JSON.stringify(results, null, 2);
    }
}

// Enable Enter key to trigger search
document.getElementById("locationInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
    }
});

// Set calendar link dynamically
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calendarAnchor").href = CONFIG.calendarUrl;
});

