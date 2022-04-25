const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const id = req.headers.id;
        const auth = req.headers.authorization;



        // to do : export url in some config file
        const url = `https://api.spotify.com/v1/playlists/${id}`;

        try {
            const playlists = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: auth,
                    "Content-Type": "application/json",
                },
            });

            const result = await playlists.json();

            console.log('the result here', result);

            if (result.error) {
                // to do see how to best handle errors in api 
                console.error("Error fetching playlists", result);
            }


        } catch (error) {
            console.error("Error fetching playlists", error);
        }


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