import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { BottomNav } from "@/components/BottomNav";
import "@/styles/search.css";

/* =========================================================
   TYPES
   ========================================================= */

type SearchItem = {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image: string;
  type: "Lost" | "Found";
};

/* =========================================================
   TEMPORARY DATA
   Replace this later with Supabase data.
   ========================================================= */

const ITEMS: SearchItem[] = [
  {
    id: 1,
    title: "Black Leather Backpack",
    category: "Bags",
    location: "Central Park",
    date: "Oct 24, 2023",
    description:
      "Black backpack with multiple compartments found near the main entrance.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },

  {
    id: 2,
    title: "Silver Wireless Headphones",
    category: "Electronics",
    location: "Subway Line 4",
    date: "Oct 23, 2023",
    description:
      "Silver wireless headphones found on a seat near the station.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },

  {
    id: 3,
    title: "Brown Leather Wallet",
    category: "Wallets",
    location: "Main Street",
    date: "Oct 22, 2023",
    description:
      "Brown leather wallet reported missing near the city center.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    type: "Lost",
  },

  {
    id: 4,
    title: "Set of Car Keys",
    category: "Keys",
    location: "City Library",
    date: "Oct 21, 2023",
    description:
      "A set of keys found near the entrance of the library.",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },

  {
    id: 5,
    title: "Grey Laptop Sleeve",
    category: "Bags",
    location: "Co-working Space",
    date: "Oct 20, 2023",
    description:
      "Grey laptop sleeve left behind in a meeting area.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },

  {
    id: 6,
    title: "Blue Water Bottle",
    category: "Bottles",
    location: "University Campus",
    date: "Oct 19, 2023",
    description:
      "Blue reusable water bottle reported lost near the cafeteria.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    type: "Lost",
  },

  {
    id: 7,
    title: "Black Smart Watch",
    category: "Watches",
    location: "Railway Station",
    date: "Oct 18, 2023",
    description:
      "Black smartwatch found near platform two.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },

  {
    id: 8,
    title: "Student ID Card",
    category: "ID Cards",
    location: "College Road",
    date: "Oct 17, 2023",
    description:
      "Student identification card found outside the college gate.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },

  {
    id: 9,
    title: "White Earbuds Case",
    category: "Electronics",
    location: "Food Court",
    date: "Oct 16, 2023",
    description:
      "White earbuds case lost somewhere around the food court.",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    type: "Lost",
  },

  {
    id: 10,
    title: "Red Umbrella",
    category: "Other",
    location: "Bus Terminal",
    date: "Oct 15, 2023",
    description:
      "Red umbrella found near the waiting area of the main bus terminal.",
    image:
      "https://images.unsplash.com/photo-1550857724-b6eecb5f4b0a?auto=format&fit=crop&w=900&q=80",
    type: "Found",
  },
];

/* =========================================================
   CATEGORIES
   ========================================================= */

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Bags",
  "Wallets",
  "Keys",
  "Bottles",
  "Watches",
  "ID Cards",
  "Other",
];

/* =========================================================
   LOCATIONS
   ========================================================= */

const LOCATIONS = [
  "All Locations",
  "Central Park",
  "Railway Station",
  "Bus Terminal",
  "University Campus",
  "City Library",
  "Food Court",
  "Main Street",
];

/* =========================================================
   RECENT SEARCHES
   ========================================================= */

const INITIAL_RECENT_SEARCHES = [
  "black backpack",
  "wallet",
  "headphones",
];

/* =========================================================
   PAGE
   ========================================================= */

export function SearchPage() {
  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState<
      "All" | "Lost" | "Found"
    >("All");

  const [category, setCategory] =
    useState("All Categories");

  const [location, setLocation] =
    useState("All Locations");

  const [showFilters, setShowFilters] =
    useState(false);

  const [recentSearches, setRecentSearches] =
    useState(
      INITIAL_RECENT_SEARCHES,
    );

  /* =======================================================
     FILTER ITEMS
     ======================================================= */

  const filteredItems =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return ITEMS.filter(
        (item) => {
          const matchesSearch =
            !query ||
            item.title
              .toLowerCase()
              .includes(query) ||
            item.category
              .toLowerCase()
              .includes(query) ||
            item.location
              .toLowerCase()
              .includes(query) ||
            item.description
              .toLowerCase()
              .includes(query);

          const matchesType =
            type === "All" ||
            item.type === type;

          const matchesCategory =
            category ===
              "All Categories" ||
            item.category ===
              category;

          const matchesLocation =
            location ===
              "All Locations" ||
            item.location ===
              location;

          return (
            matchesSearch &&
            matchesType &&
            matchesCategory &&
            matchesLocation
          );
        },
      );
    }, [
      search,
      type,
      category,
      location,
    ]);

  /* =======================================================
     SEARCH SUBMIT
     ======================================================= */

  function handleSearch() {
    const value =
      search.trim();

    if (!value) {
      return;
    }

    setRecentSearches(
      (current) => [
        value,
        ...current.filter(
          (item) =>
            item.toLowerCase() !==
            value.toLowerCase(),
        ),
      ].slice(0, 5),
    );
  }

  /* =======================================================
     USE RECENT SEARCH
     ======================================================= */

  function useRecentSearch(
    value: string,
  ) {
    setSearch(value);
  }

  /* =======================================================
     REMOVE RECENT SEARCH
     ======================================================= */

  function removeRecentSearch(
    value: string,
  ) {
    setRecentSearches(
      (current) =>
        current.filter(
          (item) =>
            item !== value,
        ),
    );
  }

  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  function clearFilters() {
    setCategory(
      "All Categories",
    );

    setLocation(
      "All Locations",
    );

    setType("All");
  }

  return (
    <div className="search-page">

      {/* =================================================
          MAIN
          ================================================= */}

      <main className="search-container">

        {/* HEADER */}

        <section className="search-header">

          <div>

            <span className="search-eyebrow">
              FIND IT FASTER
            </span>

            <h1>
              Search lost & found
              <br />

              <span>
                items near you.
              </span>
            </h1>

            <p>
              Search through items reported by
              your community.
            </p>

          </div>

        </section>


        {/* =================================================
            SEARCH BOX
            ================================================= */}

        <section className="search-box-section">

          <div className="main-search">

            <SearchIcon />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  handleSearch();
                }
              }}
              placeholder="Search for an item, brand, category or location..."
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                <X />
              </button>
            )}

            <button
              type="button"
              className="search-button"
              onClick={
                handleSearch
              }
            >
              Search
            </button>

          </div>

          {/* MOBILE FILTER BUTTON */}

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() =>
              setShowFilters(
                !showFilters,
              )
            }
          >
            <SlidersHorizontal />

            Filters

            <span>
              {[
                category !==
                  "All Categories",
                location !==
                  "All Locations",
                type !== "All",
              ].filter(Boolean)
                .length}
            </span>

          </button>

        </section>


        {/* =================================================
            TYPE TABS
            ================================================= */}

        <div className="search-type-tabs">

          {(
            [
              "All",
              "Lost",
              "Found",
            ] as const
          ).map(
            (item) => (

              <button
                key={item}
                type="button"
                className={
                  type === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setType(item)
                }
              >
                {item}
              </button>

            ),
          )}

        </div>


        {/* =================================================
            FILTERS
            ================================================= */}

        <section
          className={`search-filters ${
            showFilters
              ? "mobile-visible"
              : ""
          }`}
        >

          <div className="filter-field">

            <label>
              Category
            </label>

            <div className="filter-select">

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value,
                  )
                }
              >

                {CATEGORIES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ),
                )}

              </select>

              <ChevronDown />

            </div>

          </div>


          <div className="filter-field">

            <label>
              Location
            </label>

            <div className="filter-select">

              <select
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value,
                  )
                }
              >

                {LOCATIONS.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ),
                )}

              </select>

              <ChevronDown />

            </div>

          </div>


          <div className="filter-date">

            <CalendarDays />

            <span>
              Recent reports
            </span>

          </div>


          <button
            type="button"
            className="clear-filters"
            onClick={
              clearFilters
            }
          >
            Clear filters
          </button>

        </section>


        {/* =================================================
            RECENT SEARCHES
            ================================================= */}

        {!search &&
          recentSearches.length >
            0 && (

          <section className="recent-searches">

            <div className="section-mini-heading">

              <span>
                RECENT SEARCHES
              </span>

              <Clock3 />

            </div>

            <div className="recent-list">

              {recentSearches.map(
                (item) => (

                  <button
                    type="button"
                    key={item}
                    className="recent-chip"
                    onClick={() =>
                      useRecentSearch(
                        item,
                      )
                    }
                  >

                    <SearchIcon />

                    {item}

                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(
                        e,
                      ) => {
                        e.stopPropagation();

                        removeRecentSearch(
                          item,
                        );
                      }}
                    >
                      <X />
                    </span>

                  </button>

                ),
              )}

            </div>

          </section>

        )}


        {/* =================================================
            RESULTS HEADER
            ================================================= */}

        <section className="results-header">

          <div>

            <span className="results-eyebrow">
              COMMUNITY LISTINGS
            </span>

            <h2>
              {search
                ? `Results for "${search}"`
                : "Recently reported"}
            </h2>

          </div>

          <span className="results-count">
            {filteredItems.length}{" "}
            {filteredItems.length ===
            1
              ? "item"
              : "items"}
          </span>

        </section>


        {/* =================================================
            RESULTS
            ================================================= */}

        {filteredItems.length >
        0 ? (

          <section className="search-results">

            {filteredItems.map(
              (item) => (

                <Link
                  key={item.id}
                  to="/dashboard"
                  className="search-result-card"
                >

                  <div className="result-image-wrapper">

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.title
                      }
                      loading="lazy"
                    />

                    <span
                      className={`result-status ${
                        item.type.toLowerCase()
                      }`}
                    >
                      {item.type}
                    </span>

                  </div>


                  <div className="result-content">

                    <div className="result-top">

                      <span className="result-category">
                        {item.category}
                      </span>

                    </div>

                    <h3>
                      {item.title}
                    </h3>

                    <div className="result-meta">

                      <span>
                        <MapPin />

                        {item.location}
                      </span>

                      <span>
                        <CalendarDays />

                        {item.date}
                      </span>

                    </div>

                    <p>
                      {
                        item.description
                      }
                    </p>

                    <div className="view-result">
                      View details
                      <span>
                        →
                      </span>
                    </div>

                  </div>

                </Link>

              ),
            )}

          </section>

        ) : (

          /* =================================================
             NO RESULTS
             ================================================= */

          <section className="no-results">

            <div className="no-results-icon">
              <SearchIcon />
            </div>

            <h2>
              No matching items
            </h2>

            <p>
              We couldn't find anything matching
              your search. Try another keyword,
              category or location.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");

                clearFilters();
              }}
            >
              Clear search
            </button>

          </section>

        )}

      </main>


      {/* ===================================================
          BOTTOM NAV
          =================================================== */}

      <BottomNav />

    </div>
  );
}