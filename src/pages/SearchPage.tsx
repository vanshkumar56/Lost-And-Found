import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import type { LostFoundItem } from "@/data/items";
import { OPEN_CONVERSATION_KEY, startItemConversation } from "@/lib/chat";
import { getItems } from "@/lib/items";
import "@/styles/search.css";

/* =========================================================
   PAGE
   ========================================================= */

export function SearchPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");

  const [type, setType] = useState<"All" | "Lost" | "Found">("All");

  const [category, setCategory] = useState("All Categories");

  const [location, setLocation] = useState("All Locations");

  const [showFilters, setShowFilters] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [startingChatItemId, setStartingChatItemId] = useState<string | null>(null);
  const [chatError, setChatError] = useState<{ itemId: string; message: string } | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadListings() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const listings = await getItems();
        if (isCurrent) setItems(listings);
      } catch (error) {
        console.error("Failed to load search listings from Supabase.", error);
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load listings. Please try again.",
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadListings();
    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const categories = useMemo(
    () => ["All Categories", ...new Set(items.map((item) => item.category))],
    [items],
  );

  const locations = useMemo(
    () => ["All Locations", ...new Set(items.map((item) => item.location))],
    [items],
  );

  /* =======================================================
     FILTER ITEMS
     ======================================================= */

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesType = type === "All" || item.type === type;

      const matchesCategory = category === "All Categories" || item.category === category;

      const matchesLocation = location === "All Locations" || item.location === location;

      return matchesSearch && matchesType && matchesCategory && matchesLocation;
    });
  }, [search, type, category, location, items]);

  /* =======================================================
     SEARCH SUBMIT
     ======================================================= */

  function handleSearch() {
    const value = search.trim();

    if (!value) {
      return;
    }

    setRecentSearches((current) =>
      [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5),
    );
  }

  /* =======================================================
     USE RECENT SEARCH
     ======================================================= */

  function applyRecentSearch(value: string) {
    setSearch(value);
  }

  /* =======================================================
     REMOVE RECENT SEARCH
     ======================================================= */

  function removeRecentSearch(value: string) {
    setRecentSearches((current) => current.filter((item) => item !== value));
  }

  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  function clearFilters() {
    setCategory("All Categories");

    setLocation("All Locations");

    setType("All");
  }

  async function handleStartChat(item: LostFoundItem) {
    const itemId = String(item.id);
    setStartingChatItemId(itemId);
    setChatError(null);

    try {
      const conversationId = await startItemConversation(item.id);
      sessionStorage.setItem(OPEN_CONVERSATION_KEY, conversationId);
      await navigate({ to: "/chat" });
    } catch (error) {
      console.error("Could not start item conversation.", error);
      setChatError({
        itemId,
        message:
          error instanceof Error
            ? error.message
            : "Could not start a conversation. Please try again.",
      });
    } finally {
      setStartingChatItemId(null);
    }
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
            <span className="search-eyebrow">FIND IT FASTER</span>

            <h1>
              Search lost & found
              <br />
              <span>items near you.</span>
            </h1>

            <p>Search through items listed by your community.</p>
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
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search for an item, brand, category or location..."
            />

            {search && (
              <button type="button" className="clear-search" onClick={() => setSearch("")}>
                <X />
              </button>
            )}

            <button type="button" className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* MOBILE FILTER BUTTON */}

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal />
            Filters
            <span>
              {
                [
                  category !== "All Categories",
                  location !== "All Locations",
                  type !== "All",
                ].filter(Boolean).length
              }
            </span>
          </button>
        </section>

        {/* =================================================
            TYPE TABS
            ================================================= */}

        <div className="search-type-tabs">
          {(["All", "Lost", "Found"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={type === item ? "active" : ""}
              onClick={() => setType(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* =================================================
            FILTERS
            ================================================= */}

        <section className={`search-filters ${showFilters ? "mobile-visible" : ""}`}>
          <div className="filter-field">
            <label>Category</label>

            <div className="filter-select">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown />
            </div>
          </div>

          <div className="filter-field">
            <label>Location</label>

            <div className="filter-select">
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown />
            </div>
          </div>

          <div className="filter-date">
            <CalendarDays />

            <span>Recent reports</span>
          </div>

          <button type="button" className="clear-filters" onClick={clearFilters}>
            Clear filters
          </button>
        </section>

        {/* =================================================
            RECENT SEARCHES
            ================================================= */}

        {!search && recentSearches.length > 0 && (
          <section className="recent-searches">
            <div className="section-mini-heading">
              <span>RECENT SEARCHES</span>

              <Clock3 />
            </div>

            <div className="recent-list">
              {recentSearches.map((item) => (
                <button
                  type="button"
                  key={item}
                  className="recent-chip"
                  onClick={() => applyRecentSearch(item)}
                >
                  <SearchIcon />

                  {item}

                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();

                      removeRecentSearch(item);
                    }}
                  >
                    <X />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            RESULTS HEADER
            ================================================= */}

        <section className="results-header">
          <div>
            <span className="results-eyebrow">COMMUNITY LISTINGS</span>

            <h2>{search ? `Results for "${search}"` : "Recently reported"}</h2>
          </div>

          <span className="results-count">
            {isLoading
              ? "Loading..."
              : `${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"}`}
          </span>
        </section>

        {/* =================================================
            RESULTS
            ================================================= */}

        {isLoading ? (
          <section className="no-results" role="status">
            <p>Loading listed items...</p>
          </section>
        ) : loadError ? (
          <section className="no-results" role="alert">
            <h2>Could not load listings</h2>
            <p>{loadError}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
              Try again
            </button>
          </section>
        ) : filteredItems.length > 0 ? (
          <section className="search-results">
            {filteredItems.map((item) => (
              <article key={item.id} className="search-result-card">
                <div className="result-image-wrapper">
                  <img src={item.image || undefined} alt={item.title} loading="lazy" />

                  <span className={`result-status ${item.type.toLowerCase()}`}>{item.type}</span>
                </div>

                <div className="result-content">
                  <div className="result-top">
                    <span className="result-category">{item.category}</span>
                  </div>

                  <h3>{item.title}</h3>

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

                  <p>{item.description}</p>

                  <Link to="/dashboard" className="view-result">
                    View details
                    <span>→</span>
                  </Link>

                  <button
                    type="button"
                    className="search-chat-button"
                    disabled={startingChatItemId !== null}
                    onClick={() => void handleStartChat(item)}
                  >
                    {startingChatItemId === String(item.id)
                      ? "Opening chat..."
                      : "Chat with reporter"}
                  </button>
                  {chatError?.itemId === String(item.id) && (
                    <p className="search-chat-error" role="alert">
                      {chatError.message}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : (
          /* =================================================
             NO RESULTS
             ================================================= */

          <section className="no-results">
            <div className="no-results-icon">
              <SearchIcon />
            </div>

            <h2>No matching items</h2>

            <p>
              We couldn't find anything matching your search. Try another keyword, category or
              location.
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
