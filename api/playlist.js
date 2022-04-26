const { getFullPlaylistData } = require('../utils/playlist');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const id = req.headers.id;
        const auth = req.headers.authorization;

        // to do : export url in some config file
        const url = `https://api.spotify.com/v1/playlists/${id}`;

        const playlistData = await getFullPlaylistData(url, auth);

        console.log('the playlist data', playlistData.tracks.length);

        // TODO: Return something like
        //  an array of artists in the playlist, 
        // which has the albums in the playlist, which has all the songs in the playlist
        // eg:
        // {
        //     // artists: [artist:{albums:album[]: song[]}]
        // }
        // : 


        res.json([
            { name: 'Test' }
        ])
    }
}