import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export function HomePage() {
    let [instructionsVisible, setInstructionsVisible] = useState(false)

    function toggleInstructions() {
        setInstructionsVisible(!instructionsVisible)
    }

    async function requestUserAuthorization() {

        // Get Code Verifier
        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }
          
        const codeVerifier  = generateRandomString(64);
        console.log(`code verifier: ${codeVerifier}`)

        // Get Code Challenge
        const sha256 = async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return window.crypto.subtle.digest('SHA-256', data)
        }

        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
        }

        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed)
        console.log(`code challenge: ${codeChallenge}`)

        // Request User Authorization
        const clientId = "c6d5e6e3440f4b4aa3e87e73b008f6ca"
        const redirectUri = 'http://localhost:5173/playlists'

        const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private'
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        window.localStorage.setItem('code_verifier', codeVerifier)

        const params =  {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        authUrl.search = new URLSearchParams(params).toString()
        window.location.href = authUrl.toString()
    }

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="text-center">Power Hour</h1>
            <i className="fa-solid fa-beer-mug-empty fa-3x mb-4"></i>
            <div id="home-button-holder" className="card p-4 text-center" style={{ width: '300px' }}>
                <button id="spotify-login-button" className="btn mb-2" onClick={requestUserAuthorization}>
                    Log In with Spotify
                </button>
                <button className="btn btn-secondary mb-2" onClick={toggleInstructions}>
                    {instructionsVisible ? 'Hide Instructions' : 'Show Instructions'}
                </button>
                {instructionsVisible &&
                    <p className="mt-3">
                        Power Hour is a drinking game that involves taking a shot of beer every minute for an hour. 
                        This game is typically played with music that switches every minute to let the players know it is time to drink. 
                        This app allows you to connect to your spotify playlists and use those songs as your power hour songs.
                        Once you have logged in, you can select a playlist, select what songs you want to use, and the app will play a new one of these songs every minute for an hour.
                    </p>
                }
            </div>
        </div>
    )
}