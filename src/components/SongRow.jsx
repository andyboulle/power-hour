export default function SongRow({ id, name, artists, album, albumImages }) {
    return (
        <li key={id}>
            <ul>
                <li key={`name${id}`}>
                    {name}
                </li>
                <li key={`artists${id}`}>
                    {artists.map(artist => artist.name).join(', ')}
                </li>
                <li key={`album${id}`}>
                    {album}
                </li>
                <li key={`albumImage${id}`}>
                    {albumImages && <img src={albumImages[2].url}></img>}
                </li>
            </ul>
        </li>
    )
}