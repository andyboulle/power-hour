# Power Hour

Power Hour is a web application that plays a playlist of songs from Spotify, switching to a new song every minute. The app allows users to pause and resume the playback, and navigate to different pages.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Node.js and npm.
- You have a Spotify account.
- You have created a spotify app and received a Client ID following the steps listed here: https://developer.spotify.com/documentation/web-api/concepts/apps
    - This will give you access to the Spotify developer API

## Getting Started

To get a local copy up and running, follow these simple steps.

### Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/power-hour.git
    ```
2. Navigate to the project directory:
    ```sh
    cd power-hour
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. In `.env`, set `VITE_REACT_APP_SPOTIFY_CLIENT_ID` to the client ID that was created in the prerequisites for the Spotify API. Set the `VITE_REACT_APP_BASE_URL` to the base url of your project. (For local development you should set this to `http://localhost:5173`)
    
    Example:
    ```bash
    VITE_REACT_APP_SPOTIFY_CLIENT_ID="sdhgv16tg3hkb71293gk1898o"
    VITE_REACT_APP_BASE_URL="http://localhost:5173
    ```

### Execution

1. Start the development server:
    ```sh
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:5173`.

**NOTE**: This port may be different depending on your vite installation. Check the output message to see what port to navigate to. (Default is 5173)

## Usage

1. Log in with your Spotify account.
2. Select a playlist you want to use for the Power Hour.'
    - You can select from your own playlists or search Spotify for any other public playlist.
3. Select any songs you want to GUARANTEE will play during the power hour. 
    - If you select less than 60 songs, it will randomize the rest of the songs to get to 60 minutes.
    - If there are less than 60 songs on the playlist, it will loop through all songs randomly, making sure not to repeat songs until all other songs have been played.
4. Click the "Check for Available Devices" button and select the device you want to play the music from
    - **IMPORTANT**: You must have spotify open and be playing a song on a device for it to show up in the Available Devices area
5. Press the "Start Power Hour" button to start the Power Hour
6. Play/Pause or navigate throughout the app using the buttons on the play page


## License

This project is licensed under the MIT License.