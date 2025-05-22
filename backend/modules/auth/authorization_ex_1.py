import spotipy
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util

# The following imports support the .env secret store
import os
from dotenv import load_dotenv
load_dotenv()

"""
Can use the function SpotifyOAuth(client_id=None, client_secret=None, redirect_uri=None, 

state=None, scope=None, cache_path=None, username=None, proxies=None, show_dialog=False, 
requests_session=True, requests_timeout=None, open_browser=True, cache_handler=None)

This assumes:
OAUTH_AUTHORIZE_URL= 'https://accounts.spotify.com/authorize'
OAUTH_TOKEN_URL= 'https://accounts.spotify.com/api/token'

More info here: https://spotipy.readthedocs.io/en/2.25.0/#module-spotipy.oauth2

Allows SSO-ing into Spotify. Grants access to more API features.
"""

"""
This function only works if you copy the entire URL it redirects you to and pasting it in the terminal. 
    Refer to OAuth2.png under Images folder.

On first run, will have to click allow.
"""
def authorization_one(scope):
    try:
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=os.getenv('CLIENT_ID'), 
            client_secret=os.getenv('CLIENT_SECRET'),
            redirect_uri=os.getenv('REDIRECT_URI'), 
            scope=scope))
        
        # return the authenticated object for querying the API
        print(sp.current_user())
        return sp

    except Exception as e:
        print(f"Please check your credentials, the following occurred: {e}")