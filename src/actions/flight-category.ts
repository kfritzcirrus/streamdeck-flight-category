import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
  DidReceiveSettingsEvent,
} from "@elgato/streamdeck";

type FlightCategory = "VFR" | "MVFR" | "IFR" | "LIFR";

// FAA Aviation Weather API response format
type AwcMetarResponse = Array<{
  icaoId: string;
  fltCat: FlightCategory;
  rawOb: string;
}>;

interface ActionSettings {
  icao?: string;
  pollInterval?: number;
  apiUrl?: string;
  [key: string]: string | number | boolean | null | undefined;
}

const CATEGORY_IMAGES: Record<FlightCategory | "ERR", string> = {
  VFR: "imgs/vfr",
  MVFR: "imgs/mvfr",
  IFR: "imgs/ifr",
  LIFR: "imgs/lifr",
  ERR: "imgs/action-icon",
};

// FAA Aviation Weather Center API - free, no authentication required
const DEFAULT_API_URL = "https://aviationweather.gov/api/data/metar";

@action({ UUID: "com.kenscode.flightcategory.check" })
export class FlightCategoryAction extends SingletonAction<ActionSettings> {
  private pollIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private actionSettings: Map<string, ActionSettings> = new Map();

  override async onWillAppear(ev: WillAppearEvent<ActionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const icao = settings.icao?.toUpperCase() || "KMQS";
    this.actionSettings.set(ev.action.id, settings);

    // Show ICAO on button immediately
    await ev.action.setTitle(icao);

    // Initial fetch
    await this.fetchAndUpdate(ev.action, settings);

    // Start polling
    this.startPolling(ev.action.id, ev.action, settings);
  }

  override async onWillDisappear(ev: WillDisappearEvent<ActionSettings>): Promise<void> {
    this.stopPolling(ev.action.id);
    this.actionSettings.delete(ev.action.id);
  }

  override async onKeyDown(ev: KeyDownEvent<ActionSettings>): Promise<void> {
    const settings = this.actionSettings.get(ev.action.id) || ev.payload.settings;
    const icao = (settings.icao as string)?.toUpperCase() || "KMQS";

    // Open weather dashboard in browser
    const weatherUrl = `https://aviationweather.gov/data/metar/?decoded=1&ids=${icao}&taf=1`;
    await streamDeck.system.openUrl(weatherUrl);

    // Manual refresh on key press
    await ev.action.setTitle("...");
    await this.fetchAndUpdate(ev.action, settings);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<ActionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    this.actionSettings.set(ev.action.id, settings);

    // Restart polling with new settings
    this.stopPolling(ev.action.id);
    this.startPolling(ev.action.id, ev.action, settings);

    // Fetch immediately with new settings
    await this.fetchAndUpdate(ev.action, settings);
  }

  private startPolling(actionId: string, actionInstance: any, settings: ActionSettings): void {
    const intervalMinutes = typeof settings.pollInterval === "number"
      ? Number(settings.pollInterval)
      : 15;
    const interval = intervalMinutes * 60 * 1000;

    const timer = setInterval(async () => {
      const currentSettings = this.actionSettings.get(actionId) || settings;
      await this.fetchAndUpdate(actionInstance, currentSettings);
    }, interval);

    this.pollIntervals.set(actionId, timer);
  }

  private stopPolling(actionId: string): void {
    const timer = this.pollIntervals.get(actionId);
    if (timer) {
      clearInterval(timer);
      this.pollIntervals.delete(actionId);
    }
  }

  private async fetchAndUpdate(actionInstance: any, settings: ActionSettings): Promise<void> {
    const icao = (settings.icao as string)?.toUpperCase() || "KMQS";
    const apiUrl = (settings.apiUrl as string) || DEFAULT_API_URL;

    try {
      // FAA API uses query params: ?ids=ICAO&format=json
      const url = `${apiUrl}?ids=${icao}&format=json`;

      streamDeck.logger.info(`Fetching METAR for ${icao} from ${url}`);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AwcMetarResponse = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No data returned");
      }

      const category = data[0].fltCat;
      if (!category) {
        throw new Error("No flight category in response");
      }

      const image = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.ERR;

      // Show ICAO and category on button
      await actionInstance.setTitle(`${icao}\n${category}`);
      await actionInstance.setImage(image);

      streamDeck.logger.info(`Updated ${icao}: ${category}`);
    } catch (error) {
      streamDeck.logger.error(`Error fetching METAR for ${icao}:`, error);
      await actionInstance.setTitle(`${icao}\nERR`);
      await actionInstance.setImage(CATEGORY_IMAGES.ERR);
    }
  }
}
