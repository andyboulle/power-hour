import { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DevicesDisplay({ handleDeviceSelection, handleStartPowerHour, deviceWarningVisible }) {
    let [availableDevices, setAvailableDevices] = useState([])

    useEffect(() => {
        getAvailableDevices()
    }, [])

    async function getAvailableDevices() {
        const accessToken = localStorage.getItem('access_token')
        let devices = []

        const url = `https://api.spotify.com/v1/me/player/devices`

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
                devices = [...data.devices]
                console.log(devices)
            } else {
                console.error('Error retrieving available devices', response)
            }
        } catch (err) {
            console.error('Error sending request to get available devices: ', err)
        }

        setAvailableDevices(devices)
        console.log('All available devices retrieved successfully')
    }

    return (
        <div className="card">
            <div className="card-body">
                <h3>Available Devices:</h3>
                <button className="btn btn-secondary mb-3" onClick={getAvailableDevices}>
                    Check for Available Devices
                </button>
                {availableDevices.length === 0 && <p>No Devices Available</p>}
                {availableDevices.map(device => (
                    <div key={device.id} className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="device"
                            value={device.id}
                            onChange={handleDeviceSelection}
                        />
                        <label className="form-check-label" htmlFor={device.id}>{device.name}</label>
                    </div>
                ))}
                {deviceWarningVisible && <p className="text-danger">A device must be selected. Open Spotify on one of your devices, start playing a song, and press the "Check for Available Devices" button. That device will show up and can then be selected.</p>}
                <button className="btn btn-primary mt-3" onClick={handleStartPowerHour}>
                    Start Power Hour
                </button>
            </div>
        </div>
    )
}