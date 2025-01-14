from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from gridfs import GridFS
import datetime
from bson.objectid import ObjectId
from io import BytesIO

# Flask app setup
app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient('mongodb+srv://nightanon038:dah9NfhKw71cA9ix@test-cluster.l9zqd.mongodb.net/?retryWrites=true&w=majority&appName=test-cluster')  # Replace with your MongoDB URI
db = client['travel_platform']  # Database name
posts_collection = db['posts']
fs = GridFS(db)  # GridFS for storing images

# Routes

# Create a new post
@app.route('/posts', methods=['POST'])
def create_post():
    title = request.form.get('title')
    content = request.form.get('content')
    tags = request.form.get('tags', '').split(',')
    images = request.files.getlist('images')

    image_ids = []
    for image in images:
        # Store image in GridFS and get its ID
        image_id = fs.put(image, filename=image.filename)
        image_ids.append(str(image_id))

    post = {
        "title": title,
        "content": content,
        "tags": tags,
        "images": image_ids,
        "created_at": datetime.datetime.utcnow(),
        "comments": []
    }
    posts_collection.insert_one(post)
    return jsonify({'message': 'Post created successfully'}), 201

# Get all posts
@app.route('/posts', methods=['GET'])
def get_posts():
    posts = []
    for post in posts_collection.find():
        post['_id'] = str(post['_id'])  # Convert ObjectId to string
        post['images'] = [str(image_id) for image_id in post['images']]  # Convert image ObjectIds to strings
        posts.append(post)
    return jsonify(posts), 200

# Retrieve an image by its ID
@app.route('/images/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        image_file = fs.get(ObjectId(image_id))
        return send_file(BytesIO(image_file.read()), mimetype=image_file.content_type, as_attachment=False,
                         download_name=image_file.filename)
    except Exception as e:
        return jsonify({'message': 'Image not found'}), 404

# Add a comment to a post
@app.route('/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    comment_content = request.json.get('content')
    comment = {
        "content": comment_content,
        "created_at": datetime.datetime.utcnow()
    }
    posts_collection.update_one({'_id': ObjectId(post_id)}, {'$push': {'comments': comment}})
    return jsonify({'message': 'Comment added successfully'}), 201

# Get a single post with comments
@app.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    post = posts_collection.find_one({'_id': ObjectId(post_id)})
    if not post:
        return jsonify({'message': 'Post not found'}), 404
    post['_id'] = str(post['_id'])  # Convert ObjectId to string
    post['images'] = [str(image_id) for image_id in post['images']]  # Convert image ObjectIds to strings
    return jsonify(post), 200

# Run the app
if __name__ == '__main__':
    app.run(debug=True)




