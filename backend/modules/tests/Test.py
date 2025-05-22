from types import NoneType
import spotipy

import os
import sys
from dotenv import load_dotenv
load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from modules.auth import authorization_ex_1 as auth1, authorization_ex_2 as auth2


def main():
    # Simple read from your library using first method of authentication
    print ("\n\n=============== AUTHORIZATION ONE ===============\n\n")
    try: 
        sp = auth1.authorization_one("user-library-read")
        results = sp.current_user_saved_tracks()
        
        # loop to print those artists and tracks
        for idx, item in enumerate(results['items']):
            track = item['track']
            print(idx, track['artists'][0]['name'], " – ", track['name'])

    except Exception as e:
        print(f"The following error occurred trying to parse the songs in your library: {e}")

    # Simple read from your library using second method of authentication
    print ("\n\n=============== AUTHORIZATION TWO ===============\n\n")
    sp2 = auth2.authorization_two()
    try:
        playlists = sp2.user_playlists(user=os.getenv('USERNAME'))
        while playlists:
            for i, playlist in enumerate(playlists['items']):
                print("%4d %s" % (i + 1 + playlists['offset'], playlist['name']))
            
            if playlists['next']:
                playlists = sp2.next(playlists)
            else:
                playlists = None
            
    except Exception as e:
        print(f"The following error occurred trying to parse the playlists in your library: {e}")
    

if __name__ == "__main__":
    print("Starting Main Testing function\n-----------------------\n")
    print("The purpose of this file is to validate the connection to Spotify through spotipy is working.")
    main()
    print("\n-----------------------\nEnd of program")