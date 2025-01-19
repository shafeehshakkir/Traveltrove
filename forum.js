// URL of your backend API
const API_URL = 'http://localhost:3000/posts'; // Replace with your actual API URL

// Function to fetch posts from the database
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to render posts
function renderPosts(posts) {
    const forumPostsContainer = document.getElementById('forumPosts');
    forumPostsContainer.innerHTML = '';

    posts.forEach(post => {
        const postTemplate = document.getElementById('postTemplate').content.cloneNode(true);

        postTemplate.querySelector('.post').setAttribute('data-post-id', post.id);
        postTemplate.querySelector('.post-title').textContent = post.title;
        postTemplate.querySelector('.post-content').textContent = post.content;
        postTemplate.querySelector('.post-tags').textContent = post.tags.join(', ');

        const postMedia = postTemplate.querySelector('.post-media');
        post.images.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.className = 'post-image';
            postMedia.appendChild(imgElement);
        });
        post.videos.forEach(video => {
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.innerHTML = `<source src="${video}" type="video/mp4">Your browser does not support the video tag.`;
            videoElement.className = 'post-video';
            postMedia.appendChild(videoElement);
        });

        // Render replies
        const repliesContainer = postTemplate.querySelector('.replies');
        post.replies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.innerHTML = `
                <p>${reply.content}</p>
                <small>Replied on: ${reply.timestamp}</small>
            `;
            repliesContainer.appendChild(replyElement);
        });

        // Attach event listeners
        postTemplate.querySelector('.upvote-btn').addEventListener('click', () => upvotePost(post.id));
        postTemplate.querySelector('.downvote-btn').addEventListener('click', () => downvotePost(post.id));
        postTemplate.querySelector('.share-btn').addEventListener('click', () => sharePost(post.id));
        postTemplate.querySelector('.reply-btn').addEventListener('click', () => toggleReplyField(post.id));

        forumPostsContainer.appendChild(postTemplate);
    });
}

// Function to toggle the reply field
function toggleReplyField(postId) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    const replyField = postElement.querySelector('.reply-field');
    replyField.style.display = replyField.style.display === 'none' ? 'block' : 'none';

    // Add event listener for the "Submit Reply" button
    const submitReplyBtn = postElement.querySelector('.submit-reply-btn');
    submitReplyBtn.onclick = () => submitReply(postId, replyField);
}

// Function to handle reply submission
async function submitReply(postId, replyField) {
    const textarea = replyField.querySelector('textarea');
    const replyContent = textarea.value.trim();

    if (!replyContent) {
        alert('Reply cannot be empty!');
        return;
    }

    try {
        // Send the reply to the server
        const response = await fetch(`${API_URL}/${postId}/replies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: replyContent,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit reply');
        }

        // Clear the reply field and hide it
        textarea.value = '';
        replyField.style.display = 'none';

        // Fetch and re-render posts
        fetchPosts();
    } catch (error) {
        console.error('Error submitting reply:', error);
    }
}

// Placeholder for upvote functionality
function upvotePost(postId) {
    alert(`Upvoted post ${postId}`);
}

// Placeholder for downvote functionality
function downvotePost(postId) {
    alert(`Downvoted post ${postId}`);
}

// Placeholder for share functionality
function sharePost(postId) {
    alert(`Shared post ${postId}`);
}

// Add new post (saving to the database)
async function addPost(title, content, tags, images = [], videos = []) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                tags,
                images,
                videos,
                replies: [],
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add new post');
        }

        // Fetch and re-render posts
        fetchPosts();
    } catch (error) {
        console.error('Error adding new post:', error);
    }
}

// Render the posts on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});
