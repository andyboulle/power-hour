import { useEffect, useState } from "react"
import PlaylistRow from "./PlaylistRow"

export default function YourPlaylistDisplay({ title, playlists }) {
    let [searchedPlaylist, setSearchedPlaylist] = useState('')
    let [filteredPlaylists, setFilteredPlaylists] = useState(playlists)

    useEffect(() => {
        setFilteredPlaylists(playlists.filter(playlist => playlist.name.toLowerCase().includes(searchedPlaylist.toLowerCase())))
    }, [searchedPlaylist, playlists])

    return (
        <>
            <h1>{title}</h1>
            <form>
                <input 
                    type="text" 
                    placeholder="Search playlists" 
                    value={searchedPlaylist} 
                    onChange={e => {
                        setSearchedPlaylist(e.target.value)
                    }}>
                </input>
            </form>
            <ul>
                {filteredPlaylists.length === 0 && 'No Playlists'}
                {filteredPlaylists.map(playlist => {
                    return (
                        <PlaylistRow 
                            key={playlist.id}
                            id={playlist.id} 
                            name={playlist.name} 
                            total={playlist.tracks.total} 
                            images={playlist.images} 
                            owner={playlist.owner.display_name}
                        />
                    )
                })}
            </ul>
        </>
    )
}