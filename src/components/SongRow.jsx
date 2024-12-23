import 'bootstrap/dist/css/bootstrap.min.css';

export default function SongRow({ id, name, artists, album, albumImages, handleCheckSong }) {
    return (
        <tr key={id}>
            <td>
                {albumImages && <img src={albumImages[2].url} alt={name} style={{ width: '50px', height: '50px' }} />}
            </td>
            <td>{name}</td>
            <td>{artists.map(artist => artist.name).join(', ')}</td>
            <td>{album}</td>
            <td>
                <input 
                    type="checkbox" 
                    onChange={e => handleCheckSong({ track: { id, name, artists, album, albumImages } }, e.target.checked)}
                />
            </td>
        </tr>
    )
}