import { useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PlaylistRow({ id, name, total, images, owner }) {
    const navigate = useNavigate()

    function selectPlaylist() {
        navigate(`/songs`, { state: {playlistId: id, playlistName: name, playlistImages: images, playlistOwner: owner} })
    }

    return (
        <li 
            key={id} 
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={selectPlaylist}
            style={{ cursor: 'pointer' }}
        >
            <div className="row w-100">
                <div className="col-2">
                {images !== null && <img src={images[0]?.url} alt={name} style={{ width: '50px', height: '50px' }} />}
                </div>
                <div className="col-4">
                    <span>{name}</span>
                </div>
                <div className="col-3">
                    <span>{owner}</span>
                </div>
                <div className="col-3">
                    <span>{total}</span>
                </div>
            </div>
        </li>
    )
}