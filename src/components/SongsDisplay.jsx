import { useEffect, useState } from "react"
import SongRow from "./SongRow"
import { useNavigate } from "react-router-dom"

export default function SongsDisplay({ songs, playlistInfo }) {
    const navigate = useNavigate()
    let [checkedSongs, setCheckedSongs] = useState([])
    let [availableDevices, setAvailableDevices] = useState([])
    let [deviceSelected, setDeviceSelected] = useState(null)
    let [deviceWarningVisible, setDeviceWarningVisible] = useState(false)

    useEffect(() => {
        getAvailableDevices()
    }, [])

    async function getAvailableDevices() {
        const accessToken = localStorage.getItem('access_token')
        let devices = []


        const url = `https://api.spotify.com/v1/me/player/devices`

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
                devices = [...data.devices]
            } else {
                console.error('Error retrieving available devices', response)
            }
        } catch (err) {
            console.error('Error sending request to get available devices: ', err)
        }

        setAvailableDevices(devices)
        console.log('All available devices retrieved successfully')
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
    
            navigate(`/play`, { state: {playlistInfo: playlistInfo, songs: combinedSongs, device: deviceSelected} })
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

    return(
        <>
            <ul>
                {songs.length === 0 && 'No Songs'}
                {songs.map(song => {
                    return (
                        <>
                            <input 
                                type="checkbox" 
                                key={`checkbox${song.track.id}`} 
                                onChange={e => { handleCheckSong(song, e.target.checked) }}
                            >
                            </input>
                            <SongRow
                                key={song.track.id}
                                id={song.track.id}
                                name={song.track.name}
                                artists={song.track.artists}
                                album={song.track.album.name}
                                albumImages={song.track.album.images}
                            />
                        </>
                    )
                })}
            </ul>
            <h3>Available Devices:</h3>
            {availableDevices.length === 0 && <p>No Devices Available</p>}
            {availableDevices.map(device => {
                return (
                    <>
                        <input
                            key={device.id}
                            type="radio"
                            name="name"
                            value={device.id}
                            onChange={handleDeviceSelection}
                        />
                        <label htmlFor={device.id}>{device.name}</label>
                    </>
                )
            })}
            {deviceWarningVisible === true && <p>A device must be selected</p>}
            <button onClick={handleStartPowerHour}>
                Start Power Hour
            </button>
        </>
    )
}