import importlib.metadata
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from modules.reads.read_user import last20Songs, allPlaylists

import sys
sys.path.append('../backend/')

app = Flask(__name__)
# Explicit setup for Cross-Origin calls
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Setup custom logging
logging.basicConfig(filename='error.log', level=logging.DEBUG)
app.logger.addHandler(logging.StreamHandler())
app.logger.setLevel(logging.DEBUG)

# Add Werkzeug logger for access logs
logging.getLogger('werkzeug').setLevel(logging.INFO)
logging.getLogger('werkzeug').addHandler(logging.StreamHandler())



@app.route('/')
def home():
    """
    Return the ID of the app and Flask version.

    Returns:
        HTML: A string containing:
            - flask_version (str): The version of Flask being used.
            - host_name (str): The hostname of the machine running the app.
    """
    app.logger.info(f"Received request for home page")
    flask_version = importlib.metadata.version("flask")
    host_name = request.host
    return f"<h1>Hello World!</h1> <br /><h2>Backend is running :)</h2> <br /><h3>Flask Version: {flask_version}</h3> <br /><h3>Host Name: {host_name}</h3>"
    

@app.route('/favorites/<username>', methods=['GET', 'OPTIONS'])
def last_20_songs(username):
    """
    Return jsonify'ed list of favorites from the username provided.
    
    Args: 
        username (str): The Spotify username to fetch songs for.
    Returns:
        JSON: A dictionary of songs where:
            - keys (str): Ranking position from "0" to "19"
            - values (str): Song names
    Example Response:
        {
            "1": "Artist 1 - Song Name 1",
            "2": "Artist 2 - Song Name 2"
        }
    Raises:
        400: If username is invalid or request fails
    """
    try:
        if request.method == 'OPTIONS':
            # Explicitly handle OPTIONS request
            response = jsonify({'status': 'ok'})
            return response
    
        app.logger.info(f"Received request for favorites with username: {username}")
        # Simple read from your library using second method of authentication
        parsed_results = last20Songs()
        app.logger.info (f"\n\n=============== TOP 20 SONGS ===============\n\n{parsed_results}")
    
        return jsonify(parsed_results)

    except Exception as e:
        app.logger.error(f"Error, invalid username: {username}, {e}")
        return jsonify({"error": f"Invalid username {username}"}), 400


@app.route('/favorites/playlists/<username>', methods=['GET', 'OPTIONS'])
def my_playlists(username):
    """
    Return jsonify'ed list of playlists from the username provided.
    
    Args: 
        username (str): The Spotify username to fetch songs for.
    Returns:
        JSON: A dictionary of songs where:
            - keys (str): Ranking position from "1" to "n"
            - values (str): Playlist names
    Example Response:
        {
            "1": "Playlist Name 1",
            "2": "Playlist Name 2"
        }
    Raises:
        400: If username is invalid or request fails
    """
    try:

        if request.method == 'OPTIONS':
            # Explicitly handle OPTIONS request
            response = jsonify({'status': 'ok'})
            return response

        app.logger.info(f"Received request for playlists with username: {username}")
        # Simple read from your library using second method of authentication
        parsed_results = allPlaylists()
        app.logger.info (f"\n\n=============== MY PLAYLISTS ===============\n\n{parsed_results}")

        return jsonify(parsed_results)

    except Exception as e:
        app.logger.error(f"Error, invalid username: {username}, {e}")
        return jsonify({"error": f"Invalid username {username}"}), 400


# @app.route('/<username>/library/top20', methods=['GET'])
# def top_20(username):
    
#     """
#     Return user's top 20 most-listened to songs.

#     Args:
#         username (str): The Spotify username to query for.
#     Returns:
#         JSON: A dictionary of songs where:
#             - keys (str): Ranking position from "0" to "19"
#             - values (str): Song names
#     Example Response:
#         {
#             "1": "Artist 1 - Song Name 1",
#             "2": "Artist 2 - Song Name 2"
#         }
#     Raises:
#         400: If username is invalid or request fails
#     """
#     try:
#         app.logger.info(f"Received request for top 20 songs.")
#         parsed_results = top20Songs()
#         app.logger.info(f"\n\n=============== TOP 20 ===============\n\n{parsed_results}")

#         return parsed_results
#     except Exception as e:
#         app.logger.error(f"Error, invalid username: {username}, {e}")
#         return jsonify({"error": f"Invalid username {username}"}), 400
    

@app.route('/connection', methods=['GET'])
def conn_test():
    """
    Test connection btwn Vite <--> Flask
    
    Returns:
        JSON: { "Yo": "Hello World!" }
    Raises:
        400: If request fails
    """
    try:
        app.logger.info(f"Received request for connection test.")
        app.logger.info (f"\n\n=============== CONNECTION TEST ===============\n\nYo: Hello World!")

        return jsonify({ "message" : "Yo, Hello World!"})

    except Exception as e:
        app.logger.error(f"Error, {e}")
        return jsonify({"error": f"{e}"}), 40


# Add a catch-all route for debugging
@app.route('/<path:path>')
def catch_all(path):
    app.logger.info(f"Caught unhandled path: {path}")
    return jsonify({"error": "Route not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
   