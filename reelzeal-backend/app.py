from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import linear_kernel

movies_per_page = 20

# Assuming the CSV file is located at the specified file path
df = pd.read_csv('modified.csv')
#delect only title vote_average and genre_modified columns
df = df[['original_title', 'vote_average', 'genre_modified','overview','tagline']]
#delect all rows with null values
df = df.dropna()
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['MONGO_URI'] = 'mongodb+srv://admin:admin123@cluster0.vn24myn.mongodb.net/main?retryWrites=true&w=majority'
mongo = PyMongo(app)
CORS(app)
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = generate_password_hash(data['password'], method='pbkdf2:sha256')


    existing_user = mongo.db.users.find_one({'username': username})
    if existing_user:
        return jsonify({'message': 'User already exists!'}), 400

    user_id = mongo.db.users.insert_one({'username': username, 'password': password,'my_genres':""}).inserted_id
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = mongo.db.users.find_one({'username': username})
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                           app.config['SECRET_KEY'])
        return jsonify({'token': token})

    return jsonify({'message': 'Invalid credentials'}), 401


        
@app.route('/get_comments', methods=['GET'])
def get_comments():
    movie_title = request.args.get('movie_title')  # Assuming 'movie_title' is passed as a query parameter

    # Query the database to retrieve comments for the specified movie title
    comments = list(mongo.db.comments.find({'movie_title': movie_title}))

    # Format the comments as a list of dictionaries
    formatted_comments = [
        {
            'username': comment['username'],
            'comment': comment['comment']
        }
        for comment in comments
    ]

    return jsonify(formatted_comments), 200
@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    username = data['username']
    movie_title = data['movie_title']
    comment = data['comment']

    # Check if the user exists
    user = mongo.db.users.find_one({'username': username})
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    # Save the comment in the database
    comment_data = {
        'username': username,
        'movie_title': movie_title,
        'comment': comment
    }
    mongo.db.comments.insert_one(comment_data)

    return jsonify({'message': 'Comment added successfully'}), 201
@app.route('/add_like', methods=['POST'])
def add_like():
    data = request.get_json()
    username = data['username']
    movie_title = data['movie_title']

    # Check if the user exists
    user = mongo.db.users.find_one({'username': username})
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    

    # Save the like in the database
    like_data = {
        'username': username,
        'movie_title': movie_title
    }
    mongo.db.likes.insert_one(like_data)

    return jsonify({'message': 'Like added successfully'}), 201
@app.route('/check_like', methods=['GET'])
def check_like():
    username = request.args.get('username')  # Assuming 'username' is passed as a query parameter
    movie_title = request.args.get('movie_title')  # Assuming 'movie_title' is passed as a query parameter

    # Check if the user has liked the movie
    like = mongo.db.likes.find_one({'username': username, 'movie_title': movie_title})

    if like:
        return jsonify({'liked': True}), 200
    else:
        return jsonify({'liked': False}), 200
@app.route('/delete_like', methods=['POST'])
def delete_like():
    data = request.get_json()
    username = data['username']
    movie_title = data['movie_title']

    # Check if the user has liked the movie
    like = mongo.db.likes.find_one({'username': username, 'movie_title': movie_title})

    if like:
        # Remove the like entry from the database
        mongo.db.likes.delete_one({'username': username, 'movie_title': movie_title})
        return jsonify({'message': 'Like deleted successfully'}), 200
    else:
        return jsonify({'message': 'Like not found'}), 404
@app.route('/update_my_genres', methods=['POST'])
def update_my_genres():
    data = request.get_json()
    username = data['username']
    my_genres = data['my_genres']

    # Find the user document in the database
    user = mongo.db.users.find_one({'username': username})
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    # Update the 'my_genres' field in the user document
    mongo.db.users.update_one({'username': username}, {'$set': {'my_genres': my_genres}})

    return jsonify({'message': 'my_genres updated successfully'}), 200
@app.route('/get_my_genres', methods=['GET'])
def get_my_genres():
    username = request.args.get('username')  # Assuming 'username' is passed as a query parameter

    # Find the user document in the database
    user = mongo.db.users.find_one({'username': username})
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    my_genres = user.get('my_genres', '')  # Get the 'my_genres' value, or an empty string if it's not set

    return jsonify({'my_genres': my_genres}), 200

@app.route('/get_movies', methods=['GET'])
def get_movies():
    page = int(request.args.get('page', 1))  # Default to page 1 if 'page' parameter is not provided
    total_movies = df.shape[0]

    # Calculate the start and end indices for the current page
    start_idx = (page - 1) * movies_per_page
    end_idx = min(page * movies_per_page, total_movies)

    if start_idx >= total_movies:
        return jsonify({'message': 'No more movies'}), 200

    # Get query parameters for filtering
    name = request.args.get('name', '').strip()
    genre = request.args.get('genre', 'All')
    rating = float(request.args.get('rating', -1))  # Default to -1 if 'rating' is not provided

    # Filter the DataFrame based on the query parameters
    filtered_df = df
    if name:
        filtered_df = filtered_df[filtered_df['original_title'].str.contains(name, case=False)]
    if genre != 'All':
        # Check for missing values in the "genre_modified" column and filter them out
        filtered_df = filtered_df[filtered_df['genre_modified'].notna() & filtered_df['genre_modified'].str.contains(genre, case=False)]
    if rating >= 0:
        filtered_df = filtered_df[filtered_df['vote_average'] >= rating]

    # Get the movies for the current page after filtering
    movies = filtered_df[start_idx:end_idx].to_dict(orient='records')

    # Calculate the total number of pages based on the filtered data
    total_movies_after_filtering = filtered_df.shape[0]
    total_pages = (total_movies_after_filtering + movies_per_page - 1) // movies_per_page

    return jsonify({'movies': movies, 'total_pages': total_pages}), 200
@app.route('/get_genre_recommends', methods=['GET'])
def get_genre_recommends():
    username = request.args.get('username')  # Assuming 'username' is passed as a query parameter

    # Find the user document in the database
    user = mongo.db.users.find_one({'username': username})
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    my_genres = user.get('my_genres', '')  # Get the 'my_genres' value, or an empty string if it's not set

    tfidf = TfidfVectorizer(stop_words="english")
    
    

    # Initialize the TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer()

    # Fit and transform the string array

    genre_array = df["genre_modified"]
    genre_array = genre_array.fillna('')
    tfidf_matrix = tfidf_vectorizer.fit_transform(genre_array)

    # Transform the query using the same vectorizer
    query_tfidf = tfidf_vectorizer.transform([my_genres])

    # Calculate cosine similarity between the query and documents
    cosine_similarities = linear_kernel(query_tfidf, tfidf_matrix)

    # Get the indices of the most similar documents (in descending order)
    document_indices = cosine_similarities[0].argsort()[::-1]

    
    movie_list = []
    i = 0
    for index in document_indices:
        movie_list.append(df.iloc[index].to_dict())
        i = i + 1
        if(i==15):
            break
    return jsonify({'movie_list': movie_list}), 200
@app.route('/get_liked_movies', methods=['GET'])
def get_liked_movies():
    username = request.args.get('username')  # Assuming 'username' is passed as a query parameter

    # Find the user document in the database
    user = mongo.db.users.find_one({'username': username})
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    # Get the list of liked movie documents for the user
    liked_movies = list(mongo.db.likes.find({'username': username}))

    # Extract the movie titles from the documents
    movie_titles = [movie['movie_title'] for movie in liked_movies]

    return jsonify({'liked_movies': movie_titles}), 200

@app.route('/get_content_recommends', methods=['GET'])
def get_content_recommends():
    movie = request.args.get('movie')      

    tfidf = TfidfVectorizer(stop_words="english")
    df['overview'] = df['overview'].fillna("")
    tfidf_matrix = tfidf.fit_transform(df['overview'])
    cosine_sim = linear_kernel(tfidf_matrix,tfidf_matrix)
    indices=pd. Series(df.index,index=df['original_title']).drop_duplicates()

    idx = indices[movie]

    sim_scores=enumerate(cosine_sim[idx])
    sim_scores=sorted(sim_scores,key=lambda x:x[1],reverse=True)
    sim_scores = sim_scores[1:11]
    sim_index=[i[0] for i in sim_scores]
    result = df.iloc[sim_index].to_dict(orient='records')
    
    return jsonify({'list': result}), 200
@app.route('/get_tag_recommends', methods=['GET'])
def get_tag_recommends():
    movie = request.args.get('movie')      

    tfidf = TfidfVectorizer(stop_words="english")
    df['tagline'] = df['tagline'].fillna("")
    tfidf_matrix = tfidf.fit_transform(df['tagline'])
    cosine_sim = linear_kernel(tfidf_matrix,tfidf_matrix)
    indices=pd. Series(df.index,index=df['original_title']).drop_duplicates()

    idx = indices[movie]

    sim_scores=enumerate(cosine_sim[idx])
    sim_scores=sorted(sim_scores,key=lambda x:x[1],reverse=True)
    sim_scores = sim_scores[1:11]
    sim_index=[i[0] for i in sim_scores]
    result = df.iloc[sim_index].to_dict(orient='records')
    
    return jsonify({'list': result}), 200



if __name__ == '__main__':
    app.run(debug=True)
