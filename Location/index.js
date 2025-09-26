import cors from "cors";
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// --- Autocomplete ---
app.get("/api/autocomplete", async (req, res) => {
  const input = req.query.input;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&types=geocode&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Autocomplete failed" });
  }
});

// --- Place Details ---
app.get("/api/place-details", async (req, res) => {
  const placeId = req.query.placeId;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Place details failed" });
  }
});

// --- Geocode (supports both forward & reverse) ---
app.get("/api/geocode", async (req, res) => {
  const { lat, lng, address } = req.query;
  let url = "";

  if (lat && lng) {
    // Reverse geocode (lat,lng → address)
    url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  } else if (address) {
    // Forward geocode (address → lat,lng)
    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_API_KEY}`;
  } else {
    return res.status(400).json({ error: "Provide either lat/lng or address" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

// --- Explicit Reverse Geocode ---
app.get("/api/reverse-geocode", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

// --- Explicit Forward Geocode ---
app.get("/api/forward-geocode", async (req, res) => {
  const address = req.query.address;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Forward geocoding failed" });
  }
});

app.listen(5003, () => console.log("✅ Server running on port 5003"));
