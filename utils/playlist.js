const fetch = require('node-fetch');

const getFullPlaylistData = async (
    id,
    auth,
    limit
) => {
    // TODO add offset option in the url in this function
    // to do : export url in some config file
    const url = `https://api.spotify.com/v1/playlists/${id}`;

    try {
        // Get the playlist data
        const playlist = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: auth,
                "Content-Type": "application/json",
            },
        });

        const result = await playlist.json();


        if (result.error) {
            // to do see how to best handle errors in api 
            console.error("Error fetching playlist", result);
        }

        const tracks = result.tracks.items;
        const newUrl = result.tracks.next;
        // fetch all the tracks in the playlist
        // as spotify returns only 100 at a time.
        // TODO do this step only if total tracks > 100 

        const allTracks = await getTracksInPlaylist(newUrl, auth, tracks, limit);

        return { ...result, tracks: allTracks };

    } catch (error) {
        console.error("Error fetching full playlist data", error);
    }
}

const getTracksInPlaylist = async (
    url,
    auth,
    tracks = [],
    max = 0
) => {
    // TO DO maybe there is a better way to log this
    console.log('Fetching tracks. Currently fetched: ', tracks.length);
    // If max is specified do not attempt to fetch more playlists
    if (!url || (max > 0 && tracks.length >= max)) return tracks;

    try {
        const nextTracksInPlaylist = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: auth,
                "Content-Type": "application/json",
            },
        })

        const result = await nextTracksInPlaylist.json();

        if (result.error) {
            // to do see how to best handle errors in api 
            console.error("Error in result in getTracksInPlaylist function", result);
            return tracks;
        }

        tracks = [...tracks, ...result.items]

        if (!result.next) {
            console.log(tracks.length);
            return tracks;
        }

        return await getTracksInPlaylist(result.next, auth, tracks, max)

    } catch (error) {
        console.error("Error in getTracksInPlaylist function :", error)
        return tracks;
    }
};

module.exports = {
    getFullPlaylistData,
    getTracksInPlaylist
}