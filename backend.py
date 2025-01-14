# import cloudinary
# import cloudinary.uploader
# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from datetime import datetime

# app = Flask(__name__)

# # MongoDB setup
# client = MongoClient("mongodb+srv://nightanon038:dah9NfhKw71cA9ix@test-cluster.l9zqd.mongodb.net/?retryWrites=true&w=majority&appName=test-cluster")
# db = client['travel_trove']
# posts_collection = db['posts']

# # Cloudinary setup
# cloudinary.config(
#     cloud_name="<dytswns8o>",
#     api_key="561987693353329",
#     api_secret="QSnK5tb4sNj3mRCColZnWBhDjiw"
# )

# @app.route('/posts', methods=['POST'])
# def add_post():
#     data = request.json

#     # Handle image upload
#     uploaded_images = []
#     if 'images' in request.files:
#         images = request.files.getlist('images')
#         for image in images:
#             upload_result = cloudinary.uploader.upload(image)
#             uploaded_images.append(upload_result['secure_url'])  # Get the secure URL for the image

#     post = {
#         "title": data.get("title"),
#         "content": data.get("content"),
#         "author": data.get("author"),
#         "images": uploaded_images,
#         "tags": data.get("tags", []),
#         "created_at": datetime.utcnow().isoformat()
#     }

#     posts_collection.insert_one(post)
#     return jsonify({"message": "Post added successfully!"}), 201

# if __name__ == '__main__':
#     app.run(debug=True)
