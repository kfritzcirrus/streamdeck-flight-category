# Stream Deck Flight Category Plugin

## Project Overview
A Stream Deck plugin that displays real-time METAR flight categories (VFR, MVFR, IFR, LIFR) with color-coded icons. Designed for pilots and aviation enthusiasts who want at-a-glance weather conditions.

## Goals
1. Display current flight category for a configurable airport (ICAO code)
2. Color-coded button icons matching standard aviation colors
3. Automatic polling with manual refresh option
4. Cross-platform support (Windows and macOS)
5. Publish to Elgato Marketplace

## Technical Requirements

### Core Functionality
- Poll METAR API every 15 minutes (configurable)
- Manual refresh on button press
- Display flight category text on button (VFR/MVFR/IFR/LIFR)
- Show color-coded icon based on category:
  - VFR: Green
  - MVFR: Blue
  - IFR: Red
  - LIFR: Magenta/Purple
- Error handling with "ERR" display on failures
- Clean up polling interval when button removed

### Property Inspector (Settings UI)
- ICAO airport code input (e.g., KMQS, KPHL)
- Optional: Poll interval customization
- Optional: API URL override for different METAR sources

### API Details
Example METAR API response:
```json
{
  "results": 1,
  "data": [
    {
      "icao": "KMQS",
      "flight_category": "VFR",
      "raw_text": "KMQS 231856Z AUTO 27010KT 10SM CLR 12/M03 A3012"
    }
  ]
}
```
JSON path to flight category: `data[0].flight_category`

## Tech Stack
- Node.js v20+
- TypeScript
- @elgato/streamdeck SDK
- Rollup for bundling
- Stream Deck 6.9+

## Project Structure
```
streamdeck-flight-category/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── src/
│   ├── plugin.ts
│   └── actions/
│       └── flight-category.ts
└── com.kenscode.flightcategory.sdPlugin/
    ├── manifest.json
    ├── bin/
    │   └── plugin.js (built output)
    ├── imgs/
    │   ├── plugin-icon.png (288x288)
    │   ├── action-icon.png (20x20 + 40x40 @2x)
    │   ├── vfr.png
    │   ├── mvfr.png
    │   ├── ifr.png
    │   └── lifr.png
    ├── ui/
    │   └── flight-category.html (property inspector)
    └── previews/
        └── preview1.png (for Marketplace)
```

## Development Workflow

### Setup
```bash
npm init -y
npm install @elgato/streamdeck
npm install -D typescript rollup @rollup/plugin-node-resolve @rollup/plugin-typescript
```

### Build
```bash
npm run build
```

### Test Locally (copy to Stream Deck plugins folder)
Windows path: `%APPDATA%\Elgato\StreamDeck\Plugins\`
From WSL: `/mnt/c/Users/Ken/AppData/Roaming/Elgato/StreamDeck/Plugins/`

```bash
cp -r ./com.kenscode.flightcategory.sdPlugin /mnt/c/Users/Ken/AppData/Roaming/Elgato/StreamDeck/Plugins/
```

Restart Stream Deck after copying.

### Package for Distribution
```bash
streamdeck pack com.kenscode.flightcategory.sdPlugin
```

## Marketplace Submission Requirements
- Plugin icon: 288 x 288 px PNG
- Action icons: 20x20 px (with @2x variants at 40x40)
- At least 1 preview image in `previews/` folder
- Accurate manifest.json metadata:
  - Unique name
  - Description
  - Author
  - Version (semantic: X.Y.Z)
  - URL (plugin homepage or README)
- Cross-platform OS support array in manifest

## Key Implementation Notes

### Action Class Structure
```typescript
@action({ UUID: "com.kenscode.flightcategory.check" })
export class FlightCategoryAction extends SingletonAction {
    private pollInterval: NodeJS.Timeout | null = null;
    
    // onWillAppear: Start polling, initial fetch
    // onWillDisappear: Clear interval
    // onKeyDown: Manual refresh
    // fetchAndUpdate: API call, update title and image
}
```

### Manifest UUID Convention
- Plugin UUID: `com.kenscode.flightcategory`
- Action UUID: `com.kenscode.flightcategory.check`

### Property Inspector
Use the Stream Deck SDK's built-in property inspector communication:
- `streamDeck.settings.getGlobalSettings()`
- `streamDeck.settings.setGlobalSettings()`
- Or per-action settings via the action's settings object

## Resources
- [Stream Deck SDK Docs](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started/)
- [Plugin Samples](https://github.com/elgatosf/streamdeck-plugin-samples)
- [Manifest Reference](https://docs.elgato.com/streamdeck/sdk/references/manifest/)
- [Style Guidelines](https://docs.elgato.com/guidelines/streamdeck/plugins/metadata/)
- [Maker Console](https://marketplace.elgato.com/) (for submission)

## Notes
- Developing in WSL, outputting to Windows filesystem for testing
- User's Windows username: Ken
- Consider adding support for multiple airports (multi-action or tabs)
