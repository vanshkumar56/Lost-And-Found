import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";

import {
  getReportDraft,
  saveReportDraft,
} from "@/lib/report-draft";

import "@/styles/report-location.css";

export function ReportLocationPage() {
  /*
   * Load whatever the user already entered.
   * This is important when the user comes back
   * from the Review page.
   */
  const draft = getReportDraft();

  const [searchLocation, setSearchLocation] =
    useState(draft.location);

  const [city, setCity] =
    useState(draft.city);

  const [area, setArea] =
    useState(draft.area);

  const [dateLost, setDateLost] =
    useState(draft.dateLost);

  const [approxTime, setApproxTime] =
    useState(draft.approxTime);

  const [error, setError] =
    useState("");

  /*
   * -------------------------------------------------------
   * Save location information
   * -------------------------------------------------------
   */

  function handleNext() {
    if (!searchLocation.trim()) {
      setError(
        "Please enter where you lost the item.",
      );

      return;
    }

    if (!city.trim()) {
      setError(
        "Please enter the city.",
      );

      return;
    }

    if (!dateLost) {
      setError(
        "Please select the date when you lost the item.",
      );

      return;
    }

    setError("");

    saveReportDraft({
      location: searchLocation.trim(),
      city: city.trim(),
      area: area.trim(),
      dateLost,
      approxTime,
    });
  }

  /*
   * -------------------------------------------------------
   * Use current location
   *
   * For now this uses the browser's Geolocation API.
   *
   * Later we can connect this to Leaflet + geocoding
   * so coordinates automatically become an address.
   * -------------------------------------------------------
   */
async function useCurrentLocation() {
  if (!navigator.geolocation) {
    setError(
      "Location services are not supported by your browser.",
    );

    return;
  }

  setError("");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const {
        latitude,
        longitude,
      } = position.coords;

      /*
       * Save coordinates separately.
       * DO NOT put them into `location`.
       */

      saveReportDraft({
        latitude,
        longitude,
      });

      try {
        /*
         * Reverse geocoding:
         * Coordinates → readable address
         */

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              Accept:
                "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            "Reverse geocoding failed",
          );
        }

        const data =
          await response.json();

        const address =
          data.address || {};

        const readableLocation =
          [
            address.road,
            address.neighbourhood,
            address.suburb,
          ]
            .filter(Boolean)
            .slice(0, 2)
            .join(", ");

        const detectedCity =
          address.city ||
          address.town ||
          address.village ||
          "";

        const detectedArea =
          address.postcode || "";

        setSearchLocation(
          readableLocation ||
            data.display_name ||
            "Current location",
        );

        if (detectedCity) {
          setCity(detectedCity);
        }

        if (detectedArea) {
          setArea(detectedArea);
        }

        /*
         * Save the human-readable address.
         */

        saveReportDraft({
          location:
            readableLocation ||
            data.display_name ||
            "Current location",

          city: detectedCity,

          area: detectedArea,

          latitude,

          longitude,
        });
      } catch {
        /*
         * If reverse geocoding fails,
         * don't show coordinates to the user.
         */

        setSearchLocation(
          "Current location",
        );

        saveReportDraft({
          location:
            "Current location",

          latitude,
          longitude,
        });
      }
    },

    () => {
      setError(
        "Unable to access your location. Please enter it manually.",
      );
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
    },
  );
}
  /*
   * Display location in map header.
   */

  const mapLocation =
    searchLocation ||
    city ||
    "Select a location";

  return (
    <div className="report-location-page">

      <main className="location-content">

        {/* =================================================
            INTRO
            ================================================= */}

        <section className="location-intro">

          <span className="location-eyebrow">
            LOST & FOUND
          </span>

          <h1>
            Where did you lose it?
          </h1>

          <p>
            Tell us where the item was last seen so we can
            narrow down the search area.
          </p>

        </section>

        {/* =================================================
            PROGRESS
            ================================================= */}

        <div className="report-progress">

          <div className="progress-line">

            <div className="progress-line-fill" />

          </div>

          {/* STEP 1 */}

          <div className="progress-step completed">

            <span className="step-circle">
              1
            </span>

            <span className="step-label">
              Item
            </span>

          </div>

          {/* STEP 2 */}

          <div className="progress-step active">

            <span className="step-circle">
              2
            </span>

            <span className="step-label">
              Location
            </span>

          </div>

          {/* STEP 3 */}

          <div className="progress-step">

            <span className="step-circle">
              3
            </span>

            <span className="step-label">
              Details
            </span>

          </div>

          {/* STEP 4 */}

          <div className="progress-step">

            <span className="step-circle">
              4
            </span>

            <span className="step-label">
              Review
            </span>

          </div>

        </div>

        {/* =================================================
            LOCATION CARD
            ================================================= */}

        <section className="location-card">

          {/* =================================================
              FORM
              ================================================= */}

          <div className="location-form">

            <div className="location-form-heading">

              <div>

                <span className="location-step-tag">
                  STEP 2
                </span>

                <h2>
                  Where did you lose it?
                </h2>

                <p>
                  Provide as much detail as possible to
                  narrow down the search area.
                </p>

              </div>

            </div>

            {/* =================================================
                SEARCH LOCATION
                ================================================= */}

            <div className="location-field">

              <label htmlFor="search-location">
                Search Location
                <span className="required-star">
                  *
                </span>
              </label>

              <div className="location-search">

                <Search />

                <input
                  id="search-location"
                  type="text"
                  value={searchLocation}
                  onChange={(e) => {
                    setSearchLocation(
                      e.target.value,
                    );

                    setError("");
                  }}
                  placeholder="e.g. Central Park, Near the boathouse"
                />

              </div>

              <span className="location-hint">
                Enter a landmark, station, street or
                nearby place.
              </span>

            </div>

            {/* =================================================
                CITY + AREA
                ================================================= */}

            <div className="location-grid">

              <div className="location-field">

                <label htmlFor="city">
                  City
                  <span className="required-star">
                    *
                  </span>
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);

                    setError("");
                  }}
                  placeholder="e.g. Meerut"
                />

              </div>

              <div className="location-field">

                <label htmlFor="area">
                  Area / Zip
                </label>

                <input
                  id="area"
                  type="text"
                  value={area}
                  onChange={(e) =>
                    setArea(e.target.value)
                  }
                  placeholder="e.g. 250001"
                />

              </div>

            </div>

            {/* =================================================
                DATE + TIME
                ================================================= */}

            <div className="location-grid">

              <div className="location-field">

                <label htmlFor="date-lost">
                  Date Lost
                  <span className="required-star">
                    *
                  </span>
                </label>

                <div className="input-with-icon">

                  <input
                    id="date-lost"
                    type="date"
                    value={dateLost}
                    onChange={(e) => {
                      setDateLost(
                        e.target.value,
                      );

                      setError("");
                    }}
                  />

                  <CalendarDays />

                </div>

              </div>

              <div className="location-field">

                <label htmlFor="approx-time">
                  Approx. Time
                </label>

                <div className="input-with-icon">

                  <input
                    id="approx-time"
                    type="time"
                    value={approxTime}
                    onChange={(e) =>
                      setApproxTime(
                        e.target.value,
                      )
                    }
                  />

                  <Clock3 />

                </div>

              </div>

            </div>

            {/* =================================================
                CURRENT LOCATION
                ================================================= */}

            <button
              type="button"
              className="current-location-button"
              onClick={
                useCurrentLocation
              }
            >

              <Navigation />

              <span>
                Use my current location
              </span>

            </button>

            {/* =================================================
                ERROR
                ================================================= */}

            {error && (
              <div className="location-error">
                {error}
              </div>
            )}

          </div>

          {/* =================================================
              MAP
              ================================================= */}

          <div className="location-map">

            <div className="map-header">

              <div>

                <span>
                  LOCATION PREVIEW
                </span>

                <strong>
                  {mapLocation}
                </strong>

              </div>

              <button
                type="button"
                className="map-locate-button"
                aria-label="Use current location"
                onClick={
                  useCurrentLocation
                }
              >
                <Navigation />
              </button>

            </div>

            {/* =================================================
                MAP AREA

                This is currently a visual map placeholder.
                We can replace this with Leaflet next.
                ================================================= */}

            <div className="map-surface">

              <div className="map-road road-one" />
              <div className="map-road road-two" />
              <div className="map-road road-three" />
              <div className="map-road road-four" />

              <div className="map-block block-one" />
              <div className="map-block block-two" />
              <div className="map-block block-three" />
              <div className="map-block block-four" />
              <div className="map-block block-five" />

              <div className="map-water" />

              <div className="map-marker">

                <MapPin />

                <span>
                  Last seen
                </span>

              </div>

              <div className="map-location-label label-one">
                Main Street
              </div>

              <div className="map-location-label label-two">
                Central Area
              </div>

              <div className="map-location-label label-three">
                Station Road
              </div>

            </div>

            <div className="map-footer">

              <MapPin />

              <span>
                {searchLocation
                  ? `Last seen: ${searchLocation}`
                  : "Your selected location will appear here"}
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className="location-actions">

          <Link
            to="/report"
            className="location-back-button"
          >
            <ArrowLeft />

            <span>
              Back
            </span>

          </Link>

          <Link
            to="/report/review"
            className={`location-next-button ${
              !searchLocation.trim() ||
              !city.trim() ||
              !dateLost
                ? "disabled"
                : ""
            }`}
            onClick={(e) => {
              if (
                !searchLocation.trim() ||
                !city.trim() ||
                !dateLost
              ) {
                e.preventDefault();

                handleNext();
              } else {
                handleNext();
              }
            }}
          >

            <span>
              Next: Additional Details
            </span>

            <ArrowRight />

          </Link>

        </div>

      </main>

    </div>
  );
}