import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PlaylistRow({ id, name, total, images, owner }) {
    const navigate = useNavigate()

    function selectPlaylist() {
        navigate(`/songs`, { state: {playlistId: id, playlistName: name, playlistImages: images, playlistOwner: owner} })
    }

    return (
        <li key={id} onClick={selectPlaylist}>
            <ul>
                <li key={`name${id}`}>
                    {name}
                </li>
                <li key={`owner${id}`}>
                    {owner}
                </li>
                <li key={`total${id}`}>
                    {total}
                </li>
                <li key={`images${id}`}>
                    {images && <img src={images[0].url}></img>}
                </li>
            </ul>
        </li>
    )
}