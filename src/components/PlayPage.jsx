import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PlayPage() {
    const { state } = useLocation()
    const songs = state.songs
    const device = state.device
    const navigate = useNavigate()
    const intervalRef = useRef(null)

    let [minute, setMinute] = useState(1)
    let [timer, setTimer] = useState(60)
    let [currentSong, setCurrentSong] = useState(songs[minute])
    let [isPlaying, setIsPlaying] = useState(true)

    // Set the current song to the song at the current minute
    useEffect(() => {
        setCurrentSong(songs[minute])
    }, [minute])

    // Play the new current song when the current song changes
    useEffect(() => {
        playSong(currentSong, (60 - timer) * 1000)
    }, [currentSong])

    // Start/pause the timer when the song is played/paused
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => { // Decrement the timer every second
                setTimer(prevTimer => {
                    if (prevTimer === 1) {
                        setMinute(prevMinute => prevMinute + 1)
                        return 60
                    }
                    return prevTimer - 1
                })
            }, 1000)
        } else if (intervalRef.current) { // Pause the timer when the song is paused
            clearInterval(intervalRef.current)
        }

        return () => clearInterval(intervalRef.current)
    }, [isPlaying])

    // Play the song at the given time into the song using the Spotify API
    async function playSong(song, msIntoSong = 0) {
        const accessToken = localStorage.getItem('access_token')

        const url = `https://api.spotify.com/v1/me/player/play?device_id=${device}`

        const payload = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                uris: [song.track.uri],
                position_ms: msIntoSong
            })
        }

        try {
            const response = await fetch(url, payload)
            const data = await response.json()

            if (response.ok) {
                console.log('Started song playback')
            } else {
                console.error('Error playing song', response)
            }
        } catch (err) {
            console.error('Error sending request to play song: ', err)
        }
    }

    // Pause the song using the Spotify API
    function pauseSong() {
        const accessToken = localStorage.getItem('access_token')

        const url = `https://api.spotify.com/v1/me/player/pause?device_id=${device}`

        const payload = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        fetch(url, payload)
            .then(response => {
                if (response.ok) {
                    console.log('Paused song playback')
                } else {
                    console.error('Error pausing song', response)
                }
            })
            .catch(err => console.error('Error sending request to pause song: ', err))
    }

    // Pause or play the song depending on the current state
    function pauseOrPlaySong() {
        if (isPlaying) {
            pauseSong()
        } else {
            playSong(currentSong, (60 - timer) * 1000)
        }
        setIsPlaying(prevIsPlaying => !prevIsPlaying)
    }

    function navigateToPage(page) {
        pauseSong()
        setIsPlaying(false)
        navigate(page)
    }

    return (
        <div className="container">
            <h1 className="text-center my-4">Power Hour</h1>
            <div className="d-flex align-items-center mb-4">
                {state.playlistInfo.playlistImages && <img src={state.playlistInfo.playlistImages[0].url} alt="Playlist" className="me-3" style={{ width: '100px', height: '100px' }} />}
                <div>
                    <h2>{state.playlistInfo.playlistName}</h2>
                    <h4>{state.playlistInfo.playlistOwner}</h4>
                </div>
            </div>
            <div id="play-box" className="card p-4">
                <div className="d-flex justify-content-between mb-4">
                    <div>
                        <h4>Timer: {timer}</h4>
                    </div>
                    <div>
                        <h4>Minutes: {minute}/60</h4>
                    </div>
                </div>
                <div className="text-center">
                    {currentSong.track.album.images && <img src={currentSong.track.album.images[1].url} alt="Current Song" className="mb-3" style={{ width: '200px', height: '200px' }} />}
                    <h3>{currentSong.track.name}</h3>
                    <h5>by: {currentSong.track.artists.map(artist => artist.name).join(', ')}</h5>
                </div>
            </div>
            <div id="navigate-buttons" className="row mt-4">
                <div className="col text-center">
                    <button className="btn" onClick={() => navigateToPage('/')}>Return Home</button>
                </div>
                <div className="col text-center">
                    <button className="btn" onClick={pauseOrPlaySong}>{isPlaying ? 'Pause' : 'Play'}</button>
                </div>
                <div className="col text-center">
                    <button className="btn" onClick={() => navigateToPage('/playlists')}>Pick New Playlist</button>
                </div>
            </div>
        </div>
    )
}