import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import type { LostFoundItem } from "@/data/items";
import { OPEN_CONVERSATION_KEY, startItemConversation } from "@/lib/chat";
import { getItems } from "@/lib/items";
import "@/styles/dashboard.css";

export function DashboardPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [activeType, setActiveType] =
    useState<"All" | "Lost" | "Found">("All");

  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [date, setDate] = useState("All");

  const [sort, setSort] = useState("recent");

  const [selectedItem, setSelectedItem] =
    useState<LostFoundItem | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadItems() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const loadedItems = await getItems();
        if (isCurrent) setItems(loadedItems);
      } catch (error) {
        console.error("Failed to load items from Supabase.", error);
        if (isCurrent) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load items. Please try again.",
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadItems();

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const categories = [
    "All",
    ...Array.from(
      new Set(items.map((item) => item.category))
    ),
  ];

  const locations = [
    "All",
    ...Array.from(
      new Set(items.map((item) => item.location))
    ),
  ];

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (activeType !== "All") {
      result = result.filter(
        (item) => item.type === activeType
      );
    }

    if (category !== "All") {
      result = result.filter(
        (item) => item.category === category
      );
    }

    if (location !== "All") {
      result = result.filter(
        (item) => item.location === location
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    if (sort === "old") {
      result.reverse();
    }

    return result;
  }, [
    items,
    activeType,
    category,
    location,
    search,
    sort,
  ]);

  return (
    <div className="dashboard-page">

      {/* Background */}
      <div className="dashboard-background">
        <div className="dashboard-glow" />
      </div>

      {/* Main */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div className="dashboard-heading">
            <span className="dashboard-label">
              LOST & FOUND
            </span>

            <h1>
              Find what you're
              <span>looking for.</span>
            </h1>

            <p>
              Browse lost and found items from your
              community.
            </p>
          </div>

          {/* Search */}
          <div className="dashboard-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </header>

        {/* Filters */}
        <section className="filter-section">

          <div className="filter-type">
            {(["All", "Lost", "Found"] as const).map(
              (type) => (
                <button
                  key={type}
                  className={
                    activeType === type
                      ? "filter-tab active"
                      : "filter-tab"
                  }
                  onClick={() =>
                    setActiveType(type)
                  }
                >
                  {type}
                </button>
              )
            )}
          </div>

          <div className="filter-dropdowns">

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "Category"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            >
              {locations.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "Location"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            >
              <option value="All">
                Date
              </option>
              <option value="today">
                Today
              </option>
              <option value="week">
                This week
              </option>
              <option value="month">
                This month
              </option>
            </select>

            <button
              className="clear-filters"
              onClick={() => {
                setActiveType("All");
                setCategory("All");
                setLocation("All");
                setDate("All");
                setSearch("");
              }}
            >
              Clear filters
            </button>

          </div>
        </section>

        {/* Result header */}
        <div className="results-header">
          <span>
            <strong>
              {filteredItems.length}
            </strong>{" "}
            items found
          </span>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option value="recent">
              Most Recent
            </option>

            <option value="old">
              Oldest
            </option>
          </select>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="empty-state">
            <p>Loading items...</p>
          </div>
        ) : loadError ? (
          <div className="empty-state">
            <h2>Could not load items</h2>
            <p>{loadError}</p>
            <button
              className="clear-filters"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          <section className="items-grid">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() =>
                  setSelectedItem(item)
                }
              />
            ))}
          </section>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              🔎
            </div>

            <h2>No items found</h2>

            <p>
              Try changing your filters or search
              for something else.
            </p>
          </div>
        )}
      </main>

      {/* Detail modal */}
      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          onClose={() =>
            setSelectedItem(null)
          }
          onStartChat={async () => {
            const conversationId = await startItemConversation(selectedItem.id);
            sessionStorage.setItem(OPEN_CONVERSATION_KEY, conversationId);
            await navigate({ to: "/chat" });
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}

/* =========================================================
   ITEM CARD
   ========================================================= */

function ItemCard({
  item,
  onClick,
}: {
  item: LostFoundItem;
  onClick: () => void;
}) {
  return (
    <article
      className="item-card"
      onClick={onClick}
    >
      <div className="item-image-wrapper">

        <img
          src={item.image || undefined}
          alt={item.title}
          className="item-image"
          loading="lazy"
        />

        <span
          className={`item-status ${
            item.type === "Lost"
              ? "lost"
              : "found"
          }`}
        >
          {item.type}
        </span>

      </div>

      <div className="item-content">

        <h2>{item.title}</h2>

        <div className="item-meta">

          <span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 10C20 15 12 21 12 21C12 21 4 15 4 10C4 5.58 7.58 3 12 3C16.42 3 20 5.58 20 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />

              <circle
                cx="12"
                cy="10"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>

            {item.location}
          </span>

          <span>
            {item.category}
          </span>

        </div>

        <p>
          {item.description}
        </p>

        <div className="item-footer">

          <span className="item-date">
            {item.date}
          </span>

          <span className="view-item">
            View details
            <span>→</span>
          </span>

        </div>
      </div>
    </article>
  );
}

/* =========================================================
   ITEM DETAILS
   ========================================================= */

function ItemDetails({
  item,
  onClose,
  onStartChat,
}: {
  item: LostFoundItem;
  onClose: () => void;
  onStartChat: () => Promise<void>;
}) {
  const [showVerification, setShowVerification] =
    useState(false);

  const [answer, setAnswer] = useState("");

  const [verificationResult, setVerificationResult] =
    useState<
      "idle" | "success" | "failed"
    >("idle");
  const [chatError, setChatError] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);

  const canVerify = Boolean(
    item.verificationQuestion &&
      item.verificationAnswer &&
      item.founderName &&
      item.founderContact,
  );

  const normalize = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");
  };

  const calculateSimilarity = (
    userAnswer: string,
    correctAnswer: string
  ) => {
    const a = normalize(userAnswer);
    const b = normalize(correctAnswer);

    if (!a || !b) return 0;

    if (a === b) return 100;

    const wordsA = new Set(a.split(" "));
    const wordsB = new Set(b.split(" "));

    const intersection = [...wordsA].filter(
      (word) => wordsB.has(word)
    ).length;

    const union = new Set([
      ...wordsA,
      ...wordsB,
    ]).size;

    return (intersection / union) * 100;
  };

  const checkAnswer = () => {
    const score = calculateSimilarity(
      answer,
      item.verificationAnswer ?? "",
    );

    if (score >= 90) {
      setVerificationResult("success");
    } else {
      setVerificationResult("failed");
    }
  };

  return (
    <div
      className="item-modal-overlay"
      onClick={onClose}
    >
      <div
        className="item-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* Close */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Image */}
        <div className="modal-image-wrapper">
          <img
            src={item.image}
            alt={item.title}
            className="modal-image"
          />

          <span
            className={`modal-status ${
              item.type === "Lost"
                ? "lost"
                : "found"
            }`}
          >
            {item.type}
          </span>
        </div>

        {/* Details */}
        <div className="modal-content">

          <div className="modal-category">
            {item.category}
          </div>

          <h2>{item.title}</h2>

          <div className="modal-location">

            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 10C20 15 12 21 12 21C12 21 4 15 4 10C4 5.58 7.58 3 12 3C16.42 3 20 5.58 20 10Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <circle
                cx="12"
                cy="10"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>

            <span>{item.location}</span>

            <span className="location-dot">
              •
            </span>

            <span>{item.date}</span>

          </div>

          <div className="modal-divider" />

          <h3>About this item</h3>

          <p className="modal-description">
            {item.description}
          </p>

          <button
            className="contact-founder-button"
            disabled={isStartingChat}
            onClick={async () => {
              setChatError("");
              setIsStartingChat(true);
              try {
                await onStartChat();
              } catch (error) {
                console.error("Could not start item conversation.", error);
                setChatError(
                  error instanceof Error
                    ? error.message
                    : "Could not start a conversation. Please try again.",
                );
              } finally {
                setIsStartingChat(false);
              }
            }}
          >
            {isStartingChat ? "Opening chat..." : "Chat with reporter"}
            <span>→</span>
          </button>

          {chatError && <p role="alert">{chatError}</p>}

          {canVerify && !showVerification &&
            verificationResult === "idle" && (
              <button
                className="is-yours-button"
                onClick={() =>
                  setShowVerification(true)
                }
              >
                Is it Yours?
                <span>→</span>
              </button>
            )}

          {/* Verification */}
          {showVerification &&
            canVerify &&
            verificationResult === "idle" && (
              <div className="verification-box">

                <div className="verification-title">
                  <div className="verification-lock">
                    🔐
                  </div>

                  <div>
                    <h3>Verify ownership</h3>

                    <p>
                      Answer the question to
                      prove this item belongs to
                      you.
                    </p>
                  </div>
                </div>

                <div className="question-box">
                  <span>
                    Verification question
                  </span>

                  <strong>
                    {item.verificationQuestion}
                  </strong>
                </div>

                <input
                  className="answer-input"
                  type="text"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkAnswer();
                    }
                  }}
                />

                <button
                  className="check-answer-button"
                  onClick={checkAnswer}
                  disabled={!answer.trim()}
                >
                  Verify answer
                  <span>→</span>
                </button>

                <button
                  className="cancel-verification"
                  onClick={() => {
                    setShowVerification(false);
                    setAnswer("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

          {/* Success */}
          {verificationResult ===
            "success" && (
            <div className="verification-result success">

              <div className="result-icon">
                ✓
              </div>

              <h3>Ownership verified</h3>

              <p>
                Your answer matches the
                verification information.
              </p>

              <button
                className="contact-founder-button"
                onClick={() => {
                  alert(
                    `Contact ${item.founderName ?? ""}: ${item.founderContact ?? ""}`
                  );
                }}
              >
                Access contact info of founder
                <span>→</span>
              </button>

            </div>
          )}

          {/* Failed */}
          {verificationResult ===
            "failed" && (
            <div className="verification-result failed">

              <div className="result-icon">
                ×
              </div>

              <h3>Verification failed</h3>

              <p>
                The answer doesn't match the
                information provided by the
                item's owner.
              </p>

              <button
                className="try-again-button"
                onClick={() => {
                  setVerificationResult(
                    "idle"
                  );
                  setAnswer("");
                  setShowVerification(true);
                }}
              >
                Try again
              </button>

            </div>
          )}

          {!canVerify && (
            <p>
              Ownership verification is not available for this listing yet.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}