const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

// Function to fetch data and filter based on search keyword
async function performSearch() {
    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword) return;

    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        
        resultsContainer.innerHTML = ''; // Clear previous results

        let results = [];

        // Simple keyword matching logic
        if (keyword.includes('beach')) {
            results = data.beaches;
        } else if (keyword.includes('temple')) {
            results = data.temples;
        } else if (keyword.includes('country') || keyword.includes('countries')) {
            // Extract all cities from countries
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        } else {
            // Check specific countries
            const countryMatch = data.countries.find(c => c.name.toLowerCase().includes(keyword));
            if (countryMatch) {
                results = countryMatch.cities;
            }
        }

        // Display the results
        if (results.length > 0) {
            results.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="card-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <button class="visit-btn">Visit</button>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.innerHTML = '<div class="card"><div class="card-content"><h3>No results found</h3><p>Try searching for "beaches", "temples", or "countries".</p></div></div>';
        }

    } catch (error) {
        console.error("Error fetching the travel data:", error);
    }
}

// Function to clear the search and results
function clearSearch() {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
}

// Event Listeners
searchBtn.addEventListener('click', performSearch);
clearBtn.addEventListener('click', clearSearch);
