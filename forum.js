// Function to open the popup
function openPostPopup() {
    document.getElementById('postPopup').style.display = 'flex';
}

// Function to close the popup
function closePostPopup() {
    document.getElementById('postPopup').style.display = 'none';
}

// Function to submit a new post
async function submitPost(event) {
    event.preventDefault(); // Prevent form submission refresh

    const form = document.getElementById('postForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('http://127.0.0.1:5000/posts', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to create post');

        const result = await response.json();
        alert(result.message); // Display success message

        // Refresh posts on the page
        fetchPosts();

        // Close the popup
        closePostPopup();
    } catch (error) {
        console.error('Error submitting post:', error);
        alert('Failed to create post. Please try again.');
    }
}

// Function to fetch and render posts
async function fetchPosts() {
    try {
        const response = await fetch('http://127.0.0.1:5000/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');

        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to render posts in the forum
function renderPosts(posts) {
    const forumContainer = document.querySelector('.forum-posts');
    forumContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('forum-card');

        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="tags">${post.tags.join(', ')}</div>
            ${post.images.map(image => `<img src="${image}" alt="Post image" class="post-image">`).join('')}
            <div class="post-actions">
                <button class="action-button">Upvote</button>
                <button class="action-button">Downvote</button>
                <button class="action-button">Reply</button>
            </div>
        `;
        forumContainer.appendChild(postCard);
    });
}

// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);

