import { useEffect, useState } from "react";
import { refreshAccessToken } from '../auth';
import 'bootstrap/dist/css/bootstrap.min.css';

export function HomePage() {
    let [instructionsVisible, setInstructionsVisible] = useState(false);
    const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

    // Set up a timer to refresh the access token every hour
    useEffect(() => {
        const interval = setInterval(() => {
            refreshAccessToken();
        }, 3600 * 1000); // Refresh the token every hour

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    function toggleInstructions() {
        setInstructionsVisible(!instructionsVisible);
    }

    // Handle user authentication through Spotify
    async function requestUserAuthorization() {
        // Get Code Verifier
        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        };

        const codeVerifier = generateRandomString(64);

        // Get Code Challenge
        const sha256 = async (plain) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest('SHA-256', data);
        };

        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        };

        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        // Request User Authorization
        const clientId = "c6d5e6e3440f4b4aa3e87e73b008f6ca";
        const redirectUri = `${baseUrl}/playlists`;

        const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private offline_access';
        const authUrl = new URL("https://accounts.spotify.com/authorize");

        window.localStorage.setItem('code_verifier', codeVerifier);

        const params = {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
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
            <br />
            <div className="d-flex align-items-center">
                <p className="mb-0">Presented by</p>
                <img src="/white_boolhead_logo.png" alt="Logo" style={{ width: '100px', height: 'auto', marginLeft: '10px' }} />
            </div>
        </div>
    );
}