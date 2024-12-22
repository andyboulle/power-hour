import { useEffect, useState } from "react"
import PlaylistRow from "./PlaylistRow"

export default function SpotifyPlaylistDisplay({ title, playlists, getSearchResults }) {
    let [searchItem, setSearchItem] = useState('')

    return (
        <>
            <h1>{title}</h1>
            <input 
                type="text" 
                placeholder="Search playlists" 
                value={searchItem}
                onChange={e => {
                    setSearchItem(e.target.value)
                }}
            >
            </input>
            <button onClick={() => getSearchResults(searchItem)}>Search</button>
            <ul>
                {playlists.length === 0 && 'No Playlists'}
                {playlists.map(playlist => {
                    if (playlist !== null) {
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
                    }
                })}
            </ul>
        </>
    )
}