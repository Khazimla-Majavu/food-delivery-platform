"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  getDeliveryLocation,
  getDriverTrackingLocation,
  DriverLocationResponse,
} from "../../lib/api";
import "leaflet/dist/leaflet.css";

interface Destination {
  latitude: number;
  longitude: number;
  address: string;
}

const driverIcon = L.divIcon({
  className: "",
  html: '<div style="width:20px;height:20px;border:3px solid white;border-radius:50%;background:#111;box-shadow:0 1px 6px #666"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const destinationIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border:3px solid white;border-radius:50%;background:#737373;box-shadow:0 1px 6px #666"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function RecenterMap({ latitude, longitude }: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], Math.max(map.getZoom(), 14));
  }, [latitude, longitude, map]);

  return null;
}

export default function DriverTrackingMap({ orderId }: { orderId: number }) {
  const [driverLocation, setDriverLocation] =
    useState<DriverLocationResponse | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [waiting, setWaiting] = useState(true);
  const [mapError, setMapError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMapError("Please log in again to track this delivery.");
      setWaiting(false);
      return;
    }

    let active = true;

    async function loadDestination() {
      try {
        const result = await getDeliveryLocation(orderId, token!);


        if (
          active &&
          result.latitude !== null &&
          result.longitude !== null
        ) {
          setDestination({
            latitude: result.latitude,
            longitude: result.longitude,
            address: result.address,
          });
        }
      } catch {
        // Tracking can still work if destination coordinates are unavailable.
      }
    }

    async function refreshDriverLocation() {
      try {
        const result = await getDriverTrackingLocation(orderId, token!);

        if (active) {
          setDriverLocation(result);
          setWaiting(false);
          setMapError("");
        }
      } catch {
        if (active && !driverLocation) {
          setWaiting(true);
        }
      }
    }

    void loadDestination();
    void refreshDriverLocation();

    const interval = window.setInterval(() => {
      void refreshDriverLocation();
    }, 8000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [orderId]);

  if (!apiKey) {
    return (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="font-semibold">Live tracking map unavailable</p>
        <p className="mt-1 text-sm text-neutral-500">
          The map has not been configured yet.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8 border-t border-neutral-200 pt-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Live delivery tracking
          </p>
          <h3 className="mt-1 text-xl font-semibold">Your driver is on the way</h3>
        </div>

        {driverLocation && (
          <p className="text-xs text-neutral-500">
            Updated {new Date(driverLocation.updatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      {mapError && (
        <p className="mb-3 text-sm text-neutral-600">{mapError}</p>
      )}

      {!driverLocation ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="font-medium">
            {waiting
              ? "Waiting for your driver’s first location..."
              : "Driver location is not available yet."}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            This will update automatically when the driver shares their location.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <MapContainer
            center={[driverLocation.latitude, driverLocation.longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "340px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
              url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
            />

            <RecenterMap
              latitude={driverLocation.latitude}
              longitude={driverLocation.longitude}
            />

            <Marker
              position={[driverLocation.latitude, driverLocation.longitude]}
              icon={driverIcon}
            >
              <Popup>Your driver’s latest location</Popup>
            </Marker>

            {destination && (
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={destinationIcon}
              >
                <Popup>{destination.address || "Delivery destination"}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        Driver location refreshes approximately every 8 seconds while tracking is active.
      </p>
    </section>
  );
}
