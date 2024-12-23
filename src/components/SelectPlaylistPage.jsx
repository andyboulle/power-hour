import { useEffect, useState } from "react"
import YourPlaylistDisplay from "./YourPlaylistDisplay"
import SpotifyPlaylistDisplay from "./SpotifyPlaylistDisplay"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SelectPlaylistPage() {
    let [redirectHandled, setRedirectHandled] = useState(false)
    let [yourPlaylists, setYourPlaylists] = useState([])
    let [spotifysPlaylists, setSpotifysPlaylists] = useState([])

    useEffect(() => {
        if (!redirectHandled) {
            handleRedirect()
            setRedirectHandled(true)
        }
        getUserPlaylists()
    }, [])

    async function handleRedirect() {
        const urlParams = new URLSearchParams(window.location.search)
        let code = urlParams.get('code')
        if (!code) return

        let codeVerifier = localStorage.getItem('code_verifier')
        if (!codeVerifier) {
            console.log('Code verifier not found in local storage')
            return
        }

        const clientId = "c6d5e6e3440f4b4aa3e87e73b008f6ca"
        const redirectUri = 'http://localhost:5173/playlists'
          
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        }

        const url = "https://accounts.spotify.com/api/token"

        try {
            const response = await fetch(url, payload)
            const data = await response.json()

            if (response.ok) {
                console.log('Access token: ', data.access_token)
                localStorage.setItem('access_token', data.access_token)
            } else {
                console.error('Error fetching access token: ', data)
            }
        } catch (err) {
            console.error('Error during token exchange: ', err)
        }
    }

    async function getUserPlaylists() {
        const accessToken = localStorage.getItem('access_token')
        let allPlaylists = []
        let offset = 0
        const limit = 50
    
        while (true) {
            const url = `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`
    
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
                    allPlaylists = [...allPlaylists, ...data.items]
                    if (data.items.length < limit) {
                        break
                    }
                    offset += limit
                } else {
                    console.error('Error retrieving user playlists', response)
                    break
                }
            } catch (err) {
                console.error('Error sending request to get user playlists: ', err)
                break
            }
        }
    
        setYourPlaylists(allPlaylists)
        console.log('All user playlists retrieved successfully')
    }

    async function getSpotifyPlaylists(searchItem) {
        let url = 'https://api.spotify.com/v1/search'
        const accessToken = localStorage.getItem('access_token')

        const params = {
            q: searchItem,
            type: 'playlist',
            market: 'ES',
            limit: 50,
            offset: 0,
            include_external: 'audio'
        }
        const searchParams = new URLSearchParams(params).toString()
        url = url + '?' + searchParams

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
                console.log('Spotify playlists retrieved successfully')
                console.log(data.playlists.items)
                setSpotifysPlaylists([...data.playlists.items])
            } else {
                console.error('Error retrieving spotify playlists', response)
            }
        } catch (err) {
            console.error('Error sending request to get spotify playlists: ', err)
        }
    }

    return (
        <div className="container">
            <h1 className="text-center my-4">Select Playlist</h1>
            <div className="row">
                <div className="col-md-6">
                    <YourPlaylistDisplay title="Your Playlists" playlists={yourPlaylists} />
                </div>
                <div className="col-md-6">
                    <SpotifyPlaylistDisplay title="Spotify's Playlists" playlists={spotifysPlaylists} getSearchResults={getSpotifyPlaylists} />
                </div>
            </div>
        </div>
    )
}