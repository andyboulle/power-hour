import { useEffect, useState } from "react"
import SongsDisplay from "./SongsDisplay"
import { useLocation } from "react-router-dom"

export default function SelectSongsPage() {
    const { state } = useLocation()
    let [songs, setSongs] = useState([])

    useEffect(() => {
        getSongsFromPlaylist()
    }, [])

    async function getSongsFromPlaylist() {
        const accessToken = localStorage.getItem('access_token')
        let allSongs = []
        let offset = 0
        const limit = 50

        while (true) {
            const url = `https://api.spotify.com/v1/playlists/${state.playlistId}/tracks?fields=items(track(album(name,images),artists,href,id,name,uri))&limit=${limit}&offset=${offset}`

            const payload = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            try {
                const response = await fetch(url, payload)
                const data = await response.json()

                if (response.ok) {
                    allSongs = [...allSongs, ...data.items]
                    if (data.items.length < limit) {
                        break
                    }
                    offset += limit
                } else {
                    console.error('Error retrieving playlist songs', response)
                    break
                }
            } catch (err) {
                console.error('Error sending request to get playlist songs: ', err)
                break
            }
        }

        setSongs(allSongs)
        console.log('All playlist songs retrieved successfully')
    }

    return (
        <>
            <h1>Select Songs</h1>
            <h1>{state.playlistName}</h1>
            <h3>{state.playlistOwner}</h3>
            {state.playlistImages && <img src={state.playlistImages[0].url}></img>}
            <p>Select any songs you want to guarantee will show up during the power hour. The rest will be randomly selected to fill out the 60 minutes.</p>
            <SongsDisplay songs={songs} playlistInfo={state} />
        </>
    )
}