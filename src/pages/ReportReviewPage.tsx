import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  Tag,
} from "lucide-react";

import {
  getReportDraft,
  type ReportDraft,
} from "@/lib/report-draft";

import "@/styles/report-review.css";

export function ReportReviewPage() {
  const [draft, setDraft] =
    useState<ReportDraft | null>(null);

  /*
   * Read the saved report when this page loads.
   */
  useEffect(() => {
    const savedDraft = getReportDraft();

    console.log(
      "REVIEW PAGE DATA:",
      savedDraft,
    );

    setDraft(savedDraft);
  }, []);

  /*
   * Prevent rendering before sessionStorage
   * has been read.
   */
  if (!draft) {
    return (
      <div className="report-review-page">
        <div className="review-loading">
          Loading your report...
        </div>
      </div>
    );
  }

  return (
    <div className="report-review-page">

      <main className="review-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <section className="review-header">

          <div>

            <span className="review-eyebrow">
              FINAL STEP
            </span>

            <h1>
              Review & Submit
            </h1>

            <p>
              Please review your lost item report before
              submitting it.
            </p>

          </div>

          <div className="review-step">
            Step 4 of 4
          </div>

        </section>

        {/* ==================================================
            PROGRESS
            ================================================== */}

        <div className="review-progress">

          <div className="review-progress-line">
            <div className="review-progress-fill" />
          </div>

          <div className="review-progress-step completed">

            <span>
              <Check />
            </span>

            <small>
              Item
            </small>

          </div>

          <div className="review-progress-step completed">

            <span>
              <Check />
            </span>

            <small>
              Location
            </small>

          </div>

          <div className="review-progress-step completed">

            <span>
              <Check />
            </span>

            <small>
              Details
            </small>

          </div>

          <div className="review-progress-step active">

            <span>
              4
            </span>

            <small>
              Review
            </small>

          </div>

        </div>

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="review-grid">

          {/* =================================================
              LEFT SIDE
              ================================================= */}

          <div className="review-left">

            {/* REPORT DETAILS */}

            <section className="review-card">

              <div className="review-card-top">

                <div>

                  <span className="review-card-eyebrow">
                    YOUR REPORT
                  </span>

                  <h2>
                    Confirm Details
                  </h2>

                </div>

                <div className="review-success-icon">
                  <Check />
                </div>

              </div>

              <div className="review-divider" />

              {/* ITEM */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <Tag />
                  <span>
                    Item
                  </span>
                </div>

                <strong>
                  {draft.itemName ||
                    "Not provided"}
                </strong>

              </div>

              {/* CATEGORY */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <span>
                    Category
                  </span>
                </div>

                <strong>
                  {draft.category ||
                    "Not provided"}
                </strong>

              </div>

              {/* BRAND */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <span>
                    Brand
                  </span>
                </div>

                <strong>
                  {draft.brand ||
                    "Not provided"}
                </strong>

              </div>

              {/* COLOR */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <span>
                    Color
                  </span>
                </div>

                <strong>
                  {draft.color ||
                    "Not provided"}
                </strong>

              </div>

              {/* LOCATION */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <MapPin />
                  <span>
                    Location
                  </span>
                </div>

                <strong>
                  {draft.location ||
                    "Not provided"}
                </strong>

              </div>

              {/* CITY */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <span>
                    City
                  </span>
                </div>

                <strong>
                  {draft.city ||
                    "Not provided"}
                </strong>

              </div>

              {/* AREA */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <span>
                    Area / Zip
                  </span>
                </div>

                <strong>
                  {draft.area ||
                    "Not provided"}
                </strong>

              </div>

              {/* DATE */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <CalendarDays />
                  <span>
                    Date Lost
                  </span>
                </div>

                <strong>
                  {formatDate(
                    draft.dateLost,
                  )}
                </strong>

              </div>

              {/* TIME */}

              <div className="review-detail-row">

                <div className="review-detail-label">
                  <span>
                    Approx. Time
                  </span>
                </div>

                <strong>
                  {draft.approxTime ||
                    "Not provided"}
                </strong>

              </div>

            </section>

            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <section className="review-description-card">

              <span>
                DESCRIPTION
              </span>

              <p>
                {draft.description ||
                  "No description provided."}
              </p>

            </section>

            {/* =================================================
                PRIVACY
                ================================================= */}

            <section className="review-protection">

              <div className="protection-icon">
                <Check />
              </div>

              <div>

                <strong>
                  Your information is protected
                </strong>

                <p>
                  Contact information will only be shared
                  after ownership verification.
                </p>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDE — PREVIEW
              ================================================= */}

          <div className="review-preview">

            <div className="preview-title-row">

              <div>

                <span>
                  LISTING PREVIEW
                </span>

                <h2>
                  How others will see it
                </h2>

              </div>

              <span className="preview-badge">
                Preview
              </span>

            </div>

            {/* =================================================
                LISTING CARD
                ================================================= */}

            <article className="listing-preview-card">

              {/* IMAGE */}

              <div className="listing-preview-image">

                {draft.images &&
                draft.images.length > 0 ? (
                  <img
                    src={draft.images[0]}
                    alt={
                      draft.itemName ||
                      "Lost item"
                    }
                  />
                ) : (
                  <div className="listing-no-image">
                    <span>
                      No photo uploaded
                    </span>
                  </div>
                )}

                <span className="lost-badge">
                  LOST
                </span>

              </div>

              {/* CONTENT */}

              <div className="listing-preview-content">

                <h3>
                  {draft.itemName ||
                    "Item name not provided"}
                </h3>

                {/* LOCATION */}

                <div className="listing-preview-meta">

                  <div>

                    <MapPin />

                    <span>
                      {getLocationText(
                        draft,
                      )}
                    </span>

                  </div>

                  {/* DATE */}

                  <div>

                    <CalendarDays />

                    <span>
                      {draft.dateLost
                        ? `Lost ${formatDate(
                            draft.dateLost,
                          )}`
                        : "Date not provided"}
                    </span>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p>
                  {draft.description ||
                    "No description provided."}
                </p>

              </div>

              {/* FOOTER */}

              <div className="listing-preview-footer">

                <span>
                  Reported just now
                </span>

                <span>
                  View Details

                  <ArrowRight />
                </span>

              </div>

            </article>

            <p className="preview-note">
              This preview is visible to people browsing
              lost & found items.
            </p>

          </div>

        </div>

        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div className="review-actions">

          <Link
            to="/report/location"
            className="review-back-button"
          >
            <ArrowLeft />

            <span>
              Back
            </span>
          </Link>

          <Link
            to="/report/questions"
            className="review-submit-button"
          >
            <span>
              Submit Lost Item
            </span>

            <ArrowRight />

          </Link>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(
  date: string,
) {
  if (!date) {
    return "Not provided";
  }

  const parsedDate =
    new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}


function getLocationText(
  draft: ReportDraft,
) {
  const parts = [
    draft.location,
    draft.area,
    draft.city,
  ].filter(Boolean);

  if (parts.length === 0) {
    return "Location not provided";
  }

  return parts.join(", ");
}