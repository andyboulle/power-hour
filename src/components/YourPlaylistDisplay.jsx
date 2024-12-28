import { useEffect, useState } from "react"
import PlaylistRow from "./PlaylistRow"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function YourPlaylistDisplay({ title, playlists }) {
    let [searchedPlaylist, setSearchedPlaylist] = useState('')
    let [filteredPlaylists, setFilteredPlaylists] = useState(playlists)

    useEffect(() => {
        setFilteredPlaylists(playlists.filter(playlist => playlist.name.toLowerCase().includes(searchedPlaylist.toLowerCase())))
    }, [searchedPlaylist, playlists])

    return (
        <div id="your-playlist-box" className="card p-4">
            <h2 className="text-center">{title}</h2>
            <form className="mb-3">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Search playlists" 
                    value={searchedPlaylist} 
                    onChange={e => setSearchedPlaylist(e.target.value)}
                />
            </form>
            <ul id="your-playlist-list" className="list-group" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <li className="list-group-item d-flex justify-content-between li-headers">
                    <div className="row w-100">
                        <div className="col-2">Image</div>
                        <div className="col-4">Name</div>
                        <div className="col-3">Owner</div>
                        <div className="col-3"># of Songs</div>
                    </div>
                </li>
                {filteredPlaylists.length === 0 && <li className="list-group-item">No Playlists</li>}
                {filteredPlaylists.map(playlist => (
                    <PlaylistRow 
                        key={playlist.id}
                        id={playlist.id}
                        name={playlist.name}
                        total={playlist.tracks.total}
                        images={playlist.images}
                        owner={playlist.owner.display_name}
                    />
                ))}
            </ul>
        </div>
    )
}