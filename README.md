# Flight Category Stream Deck Plugin

A Stream Deck plugin that displays real-time METAR flight categories (VFR, MVFR, IFR, LIFR) with color-coded icons for any airport.

## Features

- **Real-time weather**: Fetches current METAR data from the FAA Aviation Weather API
- **Color-coded display**: Standard aviation colors (Green=VFR, Blue=MVFR, Red=IFR, Purple=LIFR)
- **Auto-refresh**: Polls for updates at configurable intervals (5-60 minutes)
- **Manual refresh**: Press the button to refresh immediately
- **Weather dashboard**: Opens aviationweather.gov with decoded METAR and TAF on button press
- **Multiple airports**: Add multiple buttons for different airports

## Installation

### Quick Install
1. Download the latest `com.kenscode.flightcategory.streamDeckPlugin` from this repository
2. Double-click the file to install it into Stream Deck

### Manual Install
1. Download or clone this repository
2. Copy the `com.kenscode.flightcategory.sdPlugin` folder to your Stream Deck plugins folder:
   - **Windows**: `%APPDATA%\Elgato\StreamDeck\Plugins\`
   - **macOS**: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`
3. Restart Stream Deck

## Usage

1. Drag the **Flight Category** action from the action list to a button
2. In the settings panel, enter the **ICAO airport code** (e.g., KJFK, KLAX, EGLL)
3. Optionally adjust the poll interval
4. The button will display the airport code and current flight category

### Button Press
When you press the button:
- Opens the aviationweather.gov page with decoded METAR and TAF for the airport
- Refreshes the weather data on the button

## Flight Categories

| Category | Color | Ceiling | Visibility |
|----------|-------|---------|------------|
| VFR | Green | > 3,000 ft | > 5 miles |
| MVFR | Blue | 1,000-3,000 ft | 3-5 miles |
| IFR | Red | 500-1,000 ft | 1-3 miles |
| LIFR | Purple | < 500 ft | < 1 mile |

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| ICAO Code | 4-letter airport identifier | KMQS |
| Poll Interval | How often to fetch weather (minutes) | 15 |
| API URL | Custom METAR API endpoint (optional) | FAA AWC API |

## Building from Source

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# The built plugin will be in com.kenscode.flightcategory.sdPlugin/
```

## Requirements

- Stream Deck 6.5 or later
- Windows 10+ or macOS 10.15+

## Data Source

Weather data is provided by the [FAA Aviation Weather Center](https://aviationweather.gov/) API, which is free and requires no API key.

## License

MIT License - See [LICENSE](LICENSE) for details.
