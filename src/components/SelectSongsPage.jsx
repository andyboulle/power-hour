import { useEffect, useState } from "react"
import SongsDisplay from "./SongsDisplay"
import DevicesDisplay from "./DevicesDisplay"
import { useLocation, useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SelectSongsPage() {
    const { state } = useLocation()
    const navigate = useNavigate()
    let [songs, setSongs] = useState([])
    let [checkedSongs, setCheckedSongs] = useState([])
    let [deviceSelected, setDeviceSelected] = useState(null)
    let [deviceWarningVisible, setDeviceWarningVisible] = useState(false)

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

    function handleCheckSong(song, checked) {
        if (checked === true) {
            setCheckedSongs((currentSongs) => {
                return [
                    ...currentSongs,
                    song
                ]
            })
        } else {
            setCheckedSongs(currentSongs => {
                return currentSongs.filter(tempSong => tempSong.track.id !== song.track.id)
            })
        }
    }

    function getAllSongs() {
        const combinedSongs = [...checkedSongs]
        const remainingSongs = songs.filter(song => !checkedSongs.some(checkedSong => checkedSong.track.id === song.track.id))
        let remainingSongsCopy = [...remainingSongs]

        if (deviceSelected !== null) {
            while (combinedSongs.length < 60) {
                if (remainingSongsCopy.length === 0) {
                    remainingSongsCopy = [...remainingSongs]
                }
                const randomIndex = Math.floor(Math.random() * remainingSongsCopy.length)
                const selectedSong = remainingSongsCopy.splice(randomIndex, 1)[0]
                combinedSongs.push(selectedSong)
            }
    
            navigate(`/play`, { state: {playlistInfo: state, songs: combinedSongs, device: deviceSelected} })
        }
    }

    function handleDeviceSelection(event) {
        setDeviceSelected(event.target.value)
    }

    function handleStartPowerHour() {
        if (!deviceSelected) {
            setDeviceWarningVisible(true)
        } else {
            setDeviceWarningVisible(false)
            getAllSongs()
        }
    }

    return (
        <div className="container">
            <h1 className="text-center my-4">Select Songs</h1>
            <div className="d-flex align-items-center mb-4">
                {state.playlistImages && <img src={state.playlistImages[0].url} alt="Playlist" className="me-3" style={{ width: '100px', height: '100px' }} />}
                <div>
                    <h2>{state.playlistName}</h2>
                    <h4>{state.playlistOwner}</h4>
                </div>
            </div>
            <p>Select any songs you want to guarantee will show up during the power hour. The rest will be randomly selected to fill out the 60 minutes.</p>
            <SongsDisplay songs={songs} handleCheckSong={handleCheckSong} />
            <DevicesDisplay 
                handleDeviceSelection={handleDeviceSelection} 
                handleStartPowerHour={handleStartPowerHour} 
                deviceWarningVisible={deviceWarningVisible} 
            />
        </div>
    )
}