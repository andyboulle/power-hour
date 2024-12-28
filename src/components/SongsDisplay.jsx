import SongRow from "./SongRow"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SongsDisplay({ songs, handleCheckSong }) {
    return (
        <div id="songs-box" className="card mb-4">
            <div className="card-body">
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Artist</th>
                                <th scope="col">Album</th>
                                <th scope="col">Include</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.length === 0 && <tr><td colSpan="5">No Songs</td></tr>}
                            {songs.map(song => (
                                <SongRow
                                    key={song.track.id}
                                    id={song.track.id}
                                    name={song.track.name}
                                    artists={song.track.artists}
                                    album={song.track.album.name}
                                    albumImages={song.track.album.images}
                                    handleCheckSong={handleCheckSong}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}