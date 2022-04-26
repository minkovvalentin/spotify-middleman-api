const fetch = require('node-fetch');

const getFullPlaylistData = async (
    url,
    auth
) => {
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
        // TODO do this step only if tracks > 100 

        const allTracks = await getAllTracksInPlaylist(newUrl, auth, tracks);

        return { ...result, tracks: allTracks };

    } catch (error) {
        console.error("Error fetching full playlist data", error);
    }
}

const getAllTracksInPlaylist = async (
    url,
    auth,
    tracks = [],
) => {
    // TO DO maybe there is a better way to log this
    console.log('Fetching tracks. Currently fetched: ', tracks.length);

    try {

        const nextTracksInPlaylist = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: auth,
                "Content-Type": "application/json",
            },
        })

        const result = await nextTracksInPlaylist.json();
        // console.log('the result here', result);
        if (result.error) {
            // to do see how to best handle errors in api 
            console.error("Error in result in getAllTracksInPlaylist function", result);
            return tracks;
        }

        tracks = [...tracks, ...result.items]

        if (!result.next) {
            console.log(tracks.length);
            return tracks;
        }

       return await getAllTracksInPlaylist(result.next, auth, tracks)

    } catch (error) {
        console.error("Error in getAllTracksInPlaylist function :", error)
        return tracks;
    }
};

module.exports = {
    getFullPlaylistData,
    getAllTracksInPlaylist
}