import { useState } from "react"
import PlaylistRow from "./PlaylistRow"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SpotifyPlaylistDisplay({ title, playlists, getSearchResults }) {
    let [searchItem, setSearchItem] = useState('')

    // Handle searching for an item
    const handleSubmit = (e) => {
        e.preventDefault()
        getSearchResults(searchItem)
    }

    return (
        <div id="spotifys-playlist-box" className="card p-4">
            <h2 className="text-center">{title}</h2>
            <form className="mb-3 d-flex" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="form-control me-2"
                    placeholder="Search playlists" 
                    value={searchItem}
                    onChange={e => setSearchItem(e.target.value)}
                />
                <button id="spotify-search-button" className="btn" type="button" onClick={() => getSearchResults(searchItem)}>Search</button>
            </form>
            <ul className="list-group" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <li className="list-group-item d-flex justify-content-between li-headers">
                    <div className="row w-100">
                        <div className="col-2">Image</div>
                        <div className="col-4">Name</div>
                        <div className="col-3">Owner</div>
                        <div className="col-3"># of Songs</div>
                    </div>
                </li>
                {playlists.length === 0 && <li className="list-group-item">No Playlists</li>}
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
        </div>
    )
}