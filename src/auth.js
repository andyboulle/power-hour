export async function refreshAccessToken() {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        console.error('No refresh token available');
        return;
    }

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    };

    const url = "https://accounts.spotify.com/api/token";

    try {
        const response = await fetch(url, payload);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            console.log('Access token refreshed');
        } else {
            console.error('Error refreshing access token: ', data);
        }
    } catch (err) {
        console.error('Error during token refresh: ', err);
    }
}