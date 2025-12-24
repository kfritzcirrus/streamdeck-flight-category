import streamDeck from "@elgato/streamdeck";
import { FlightCategoryAction } from "./actions/flight-category";

streamDeck.actions.registerAction(new FlightCategoryAction());

streamDeck.connect();
