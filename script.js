// script.js

// Function to fetch posts from the database
async function fetchPosts() {
    const sortOption = document.getElementById('sortOptions').value;
    const filterOption = document.getElementById('filterOptions').value;

    // Construct the API endpoint with query parameters for sorting and filtering
    const apiUrl = `/api/posts?sort=${sortOption}&filter=${filterOption}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Clear previous posts
        document.getElementById('recommendedLocations').innerHTML = '';
        document.getElementById('trendingLocations').innerHTML = '';

        // Populate Recommended Locations
        data.recommended.forEach(post => {
            const card = createCard(post);
            document.getElementById('recommendedLocations').appendChild(card);
        });

        // Populate Trending Locations
        data.trending.forEach(post => {
            const card = createCard(post);
            document.getElementById('trendingLocations').appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to create a card for a post
function createCard(post) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => location.href = `post.html?id=${post.id}`;
    card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
    `;
    return card;
}

// Fetch posts on page load
window.onload = fetchPosts;