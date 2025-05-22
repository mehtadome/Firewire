import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import os
from dotenv import load_dotenv
load_dotenv()

"""
Can use the function SpotifyClientCredentials(client_id=None, client_secret=None, 

proxies=None, requests_session=True, requests_timeout=None, cache_handler=None)

This assumes OAUTH_TOKEN_URL='https://accounts.spotify.com/api/token'
More info here: https://spotipy.readthedocs.io/en/2.25.0/#spotipy.oauth2.SpotifyClientCredentials

I believe this doesn't require User interaction.
"""

def authorization_two():
    try:
        auth_manager = SpotifyClientCredentials(
            client_id=os.getenv('CLIENT_ID'),
            client_secret=os.getenv('CLIENT_SECRET'))
        
        sp = spotipy.Spotify(auth_manager=auth_manager)
        return sp 

    except Exception as e:
        print(f"Please check your credentials, the following occurred: {e}")
