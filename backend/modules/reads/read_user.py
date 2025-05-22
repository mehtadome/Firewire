from modules.auth import authorization_ex_1 as auth1
from modules.auth import authorization_ex_2 as auth2

import os

def last20Songs():
    """
    Returns list of last 20 songs liked to by the user provided.
    """
    sp = auth1.authorization_one("user-library-read")
    results = sp.current_user_saved_tracks()
    parsed_results = {}

    for idx, item in enumerate(results['items']):
        track = item['track']
        parsed_results[idx] = track['artists'][0]['name'] + " – " + track['name']

    return parsed_results


def allPlaylists():
    """
    Returns list of all playlists in the user's library.
    """
    sp2 = auth2.authorization_two()
    playlists = sp2.user_playlists(user=os.getenv('USERNAME'))
    parsed_results = {}

    while playlists:
        for i, playlist in enumerate(playlists['items']):
            parsed_results[i + 1 + playlists['offset']] = playlist['name']

        if playlists['next']:
            playlists = sp2.next(playlists)
        else:
            playlists = None

    return parsed_results