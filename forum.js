// forum.js

let postIdCounter = 0;
const posts = [];

// Function to open the post creation popup
function openPostPopup() {
    document.getElementById('postPopup').style.display = 'block';
}

// Function to close the post creation popup
function closePostPopup() {
    document.getElementById('postPopup').style.display = 'none';
}

// Function to submit the post
function submitPost(event) {
    event.preventDefault(); // Prevent the default form submission

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const images = document.getElementById('images').files;
    const videos = document.getElementById('videos').files;

    // Create a new post object
    const post = {
        id: postIdCounter++,
        title: title,
        content: content,
        tags: tags,
        upvotes: 0,
        downvotes: 0,
        images: Array.from(images).map(file => URL.createObjectURL(file)),
        videos: Array.from(videos).map(file => URL.createObjectURL(file)),
        replies: [] // Initialize replies array
    };

    posts.push(post);
    renderPosts(); // Render posts after adding a new one

    // Reset the form
    document.getElementById('postForm').reset();
    closePostPopup();
}

// Function to render posts
function renderPosts() {
    const forumPostsContainer = document.getElementById('forumPosts');
    forumPostsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.setAttribute('data-post-id', post.id);

        // Create HTML for images
        const imagesHtml = post.images.map(img => `<img src="${img}" alt="Post Image" class="post-image">`).join('');

        // Create HTML for videos
        const videosHtml = post.videos.map(video => `<video controls class="post-video"><source src="${video}" type="video/mp4">Your browser does not support the video tag.</video>`).join('');

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
            <div class="post-media">
                ${imagesHtml}
                ${videosHtml}
            </div>
            <div class="post-actions">
                <button onclick="upvotePost(${post.id})">Upvote (<span class="upvote-count" id="upvote-${post.id}">${post.upvotes}</span>)</button>
                <button onclick="downvotePost(${post.id})">Downvote (<span class="downvote-count" id="downvote-${post.id}">${post.downvotes}</span>)</button>
                <button onclick="sharePost()">Share</button>
                <button onclick="toggleReplyField(${post.id})">Reply</button>
            </div>
            <div class="reply-field" id="reply-field-${post.id}" style="display: none;">
                <textarea placeholder="Write your reply..."></textarea>
                <button onclick="submitReply(${post.id})">Submit Reply</button>
            </div>
            <div class="replies" id="replies-${post.id}"></div>
        `;

        forumPostsContainer.appendChild(postElement);
    });
}

// Filtering posts based on selected category
function filterPosts() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredPosts = selectedCategory ? posts.filter(post => post.tags.includes(selectedCategory)) : posts;
    renderFilteredPosts(filteredPosts);
}

// Sorting posts based on selected order
function sortPosts() {
    const sortOrder = document.getElementById('sortOrder').value;
    const sortedPosts = [...posts];

    if (sortOrder === 'latest') {
        sortedPosts.sort((a, b) => b.id - a.id); // Sort by latest
    } else if (sortOrder === 'upvotes') {
        sortedPosts.sort((a, b) => b.upvotes - a.upvotes); // Sort by upvotes
    }

    renderFilteredPosts(sortedPosts);
}

// Render filtered posts
function renderFilteredPosts(filteredPosts) {
    const forumPostsContainer = document.getElementById('forumPosts');
    forumPostsContainer.innerHTML = ''; // Clear previous posts

    filteredPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.setAttribute('data-post-id', post.id);

        // Create HTML for images
        const imagesHtml = post.images.map(img => `<img src="${img}" alt="Post Image" class="post-image">`).join('');

        // Create HTML for videos
        const videosHtml = post.videos.map(video => `<video controls class="post-video"><source src="${video}" type="video/mp4">Your browser does not support the video tag.</video>`).join('');

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
            <div class="post-media">
                ${imagesHtml}
                ${videosHtml}
            </div>
            <div class="post-actions">
                <button onclick="upvotePost(${post.id})">Upvote (<span class="upvote-count" id="upvote-${post.id}">${post.upvotes}</span>)</button>
                <button onclick="downvotePost(${post.id})">Downvote (<span class="downvote-count" id="downvote-${post.id}">${post.downvotes}</span>)</button>
                <button onclick="sharePost()">Share</button>
                <button onclick="toggleReplyField(${post.id})">Reply</button>
            </div>
            <div class="reply-field" id="reply-field-${post.id}" style="display: none;">
                <textarea placeholder="Write your reply..."></textarea>
                <button onclick="submitReply(${post.id})">Submit Reply</button>
            </div>
            <div class="replies" id="replies-${post.id}"></div>
        `;

        forumPostsContainer.appendChild(postElement);
    });
}

function upvotePost(postId) {
    const post = posts.find(p => p.id === postId);
    post.upvotes++;
    document.getElementById(`upvote-${postId}`).innerText = post.upvotes;
}

function downvotePost(postId) {
    const post = posts.find(p => p.id === postId);
    post.downvotes++;
    document.getElementById(`downvote-${postId}`).innerText = post.downvotes;
}

function sharePost() {
    alert("Post shared!");
}

function toggleReplyField(postId) {
    const replyField = document.getElementById(`reply-field-${postId}`);
    replyField.style.display = replyField.style.display === 'none' ? 'block' : 'none';
}

function submitReply(postId) {
    const replyTextArea = document.querySelector(`#reply-field-${postId} textarea`);
    const replyContent = replyTextArea.value;

    const repliesContainer = document.getElementById(`replies-${postId}`);
    const replyElement = document.createElement('div');
    replyElement.className = 'reply';

    // Initialize upvotes and downvotes for replies
    replyElement.innerHTML = `
        <p>${replyContent}</p>
        <div class="reply-actions">
            <button onclick="upvoteReply(this)">Upvote (<span class="reply-upvote-count">0</span>)</button>
            <button onclick="downvoteReply(this)">Downvote (<span class="reply-downvote-count">0</span>)</button>
        </div>
    `;

    repliesContainer.appendChild(replyElement);
    replyTextArea.value = ''; // Clear the textarea
}

// Functions to handle reply upvotes and downvotes
function upvoteReply(button) {
    const upvoteCountSpan = button.querySelector('.reply-upvote-count');
    upvoteCountSpan.innerText = parseInt(upvoteCountSpan.innerText) + 1;
}

function downvoteReply(button) {
    const downvoteCountSpan = button.querySelector('.reply-downvote-count');
    downvoteCountSpan.innerText = parseInt(downvoteCountSpan.innerText) + 1;
}