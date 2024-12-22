import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function PlayPage() {
    const { state } = useLocation()
    const songs = state.songs
    const device = state.device
    let [minute, setMinute] = useState(1)
    let [timer, setTimer] = useState(60)
    let [currentSong, setCurrentSong] = useState(songs[minute])

    useEffect(() => {
        setCurrentSong(songs[minute])
    }, [minute])

    useEffect(() => {
        playSong(currentSong)
    }, [currentSong])

    useEffect(() => {
        const id = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    setMinute(prevMinute => prevMinute + 1)
                    return 60
                }
                return prevTimer - 1
            })
        }, 1000)

        return () => clearInterval(id)
    }, [])

    async function playSong(song) {
        const accessToken = localStorage.getItem('access_token')

        const url = `https://api.spotify.com/v1/me/player/play?device_id=${device}`

        const payload = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                uris: [song.track.uri],
                position_ms: 0
            })
        }

        try {
            const response = await fetch(url, payload)
            const data = await response.json()
            console.log(data)

            if (response.ok) {
                console.log('Started song playback')
            } else {
                console.error('Error playing song', response)
            }
        } catch (err) {
            console.error('Error sending request to play song: ', err)
        }
    }

    return (
        <>
            <h1>Power Hour</h1>
            <h1>{state.playlistInfo.playlistName}</h1>
            <h3>{state.playlistInfo.playlistOwner}</h3>   
            {state.playlistInfo.playlistImages && <img src={state.playlistInfo.playlistImages[0].url}></img>}
            <h4>Minutes: {minute}/60</h4>
            <h4>Timer: {timer}</h4>
            <h4>Current Song: {currentSong.track.name}</h4>
            <h4>by: {currentSong.track.artists.map(artist => artist.name).join(', ')}</h4>
            {currentSong.track.album.images && <img src={currentSong.track.album.images[1].url}></img>}
        </>
    )
}