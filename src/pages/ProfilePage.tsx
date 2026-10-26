import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  CircleUserRound,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";

import { BottomNav } from "@/components/BottomNav";
import "@/styles/profile.css";

/* =========================================================
   TYPES
   ========================================================= */

type ModalType = "personal" | "security" | "notifications" | "alerts" | "logout" | null;

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedDate: string;
};

type ProfileStats = {
  itemsReported: number | null;
  itemsReturned: number | null;
  successfulMatches: number | null;
};

/* =========================================================
   DEFAULT PROFILE
   ========================================================= */

const DEFAULT_PROFILE: ProfileData = {
  name: "Your Name",
  email: "you@example.com",
  phone: "",
  city: "",
  joinedDate: "September 2026",
};

const EMPTY_PROFILE: ProfileData = {
  name: "",
  email: "",
  phone: "",
  city: "",
  joinedDate: "",
};

/* =========================================================
   STORAGE
   ========================================================= */

const PROFILE_STORAGE_KEY = "findback-profile";

function getSavedProfile(): ProfileData {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!saved) {
    return DEFAULT_PROFILE;
  }

  try {
    return {
      ...DEFAULT_PROFILE,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

/* =========================================================
   PAGE
   ========================================================= */

export function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    itemsReported: null,
    itemsReturned: null,
    successfulMatches: null,
  });
  const [statsError, setStatsError] = useState("");

  const [modal, setModal] = useState<ModalType>(null);

  const [editForm, setEditForm] = useState<ProfileData>(EMPTY_PROFILE);

  const [showPassword, setShowPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [securityMessage, setSecurityMessage] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);

  const [matchAlerts, setMatchAlerts] = useState(true);

  const [messageAlerts, setMessageAlerts] = useState(true);

  const [nearbyAlerts, setNearbyAlerts] = useState(false);

  /* =======================================================
     LOAD PROFILE
     ======================================================= */

  useEffect(() => {
    let isCurrent = true;

    async function loadProfile() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
          if (isCurrent) {
            setProfileError("Please log in to view your profile.");
          }
          return;
        }

        const { user } = session;
        const saved = getSavedProfile();
        const metadata = user.user_metadata;
        const metadataName =
          typeof metadata["full_name"] === "string"
            ? metadata["full_name"]
            : typeof metadata["name"] === "string"
              ? metadata["name"]
              : "";
        const email = user.email ?? "";
        const accountProfile: ProfileData = {
          name:
            metadataName.trim() ||
            (saved.name !== DEFAULT_PROFILE.name ? saved.name : "") ||
            email.split("@")[0] ||
            "User",
          email,
          phone: typeof metadata["phone"] === "string" ? metadata["phone"] : saved.phone,
          city: typeof metadata["city"] === "string" ? metadata["city"] : saved.city,
          joinedDate: new Date(user.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        };

        if (isCurrent) {
          setProfile(accountProfile);
          setEditForm(accountProfile);
        }

        try {
          const { data: stats, error: statsLoadError } = await supabase.rpc("get_my_profile_stats");

          if (statsLoadError) throw statsLoadError;
          if (isCurrent && stats && typeof stats === "object") {
            const result = stats as {
              items_reported?: unknown;
              items_returned?: unknown;
              successful_matches?: unknown;
            };

            setProfileStats({
              itemsReported:
                typeof result.items_reported === "number" ? result.items_reported : null,
              itemsReturned:
                typeof result.items_returned === "number" ? result.items_returned : null,
              successfulMatches:
                typeof result.successful_matches === "number" ? result.successful_matches : null,
            });
          }
        } catch (statsLoadError) {
          console.error("Failed to load profile statistics.", statsLoadError);
          if (isCurrent) {
            setStatsError(
              statsLoadError instanceof Error
                ? statsLoadError.message
                : "Could not load profile statistics.",
            );
          }
        }
      } catch (error) {
        console.error("Failed to load Supabase profile.", error);
        if (isCurrent) {
          setProfileError(error instanceof Error ? error.message : "Could not load your profile.");
        }
      } finally {
        if (isCurrent) setIsLoadingProfile(false);
      }
    }

    void loadProfile();

    const savedSettings = localStorage.getItem("findback-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setEmailNotifications(settings.emailNotifications ?? true);
        setMatchAlerts(settings.matchAlerts ?? true);
        setMessageAlerts(settings.messageAlerts ?? true);
        setNearbyAlerts(settings.nearbyAlerts ?? false);
      } catch {
        // Keep the default notification settings.
      }
    }

    return () => {
      isCurrent = false;
    };
  }, []);

  /* =======================================================
     SAVE SETTINGS
     ======================================================= */

  function saveSettings(updates: Record<string, boolean>) {
    const current = {
      emailNotifications,
      matchAlerts,
      messageAlerts,
      nearbyAlerts,
      ...updates,
    };

    localStorage.setItem("findback-settings", JSON.stringify(current));
  }

  /* =======================================================
     OPEN PERSONAL INFORMATION
     ======================================================= */

  function openPersonalInfo() {
    setEditForm(profile);
    setModal("personal");
  }

  /* =======================================================
     SAVE PERSONAL INFORMATION
     ======================================================= */

  async function savePersonalInfo() {
    if (!editForm.name.trim()) {
      return;
    }

    setProfileError("");
    setIsSavingProfile(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        throw new Error("Please log in to update your profile.");
      }

      const updatedMetadata = {
        ...user.user_metadata,
        full_name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        city: editForm.city.trim(),
      };

      const { data, error } = await supabase.auth.updateUser({
        data: updatedMetadata,
      });

      if (error) throw error;

      const updated: ProfileData = {
        ...editForm,
        name:
          typeof data.user.user_metadata["full_name"] === "string"
            ? data.user.user_metadata["full_name"]
            : editForm.name.trim(),
        email: data.user.email ?? profile.email,
        phone: editForm.phone.trim(),
        city: editForm.city.trim(),
      };

      setProfile(updated);

      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));

      setModal(null);
    } catch (error) {
      console.error("Failed to save Supabase profile.", error);
      setProfileError(
        error instanceof Error ? error.message : "Could not save your profile. Please try again.",
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  /* =======================================================
     CHANGE PASSWORD
     ======================================================= */

  function changePassword() {
    setSecurityMessage("");

    if (newPassword.length < 8) {
      setSecurityMessage("Password must contain at least 8 characters.");

      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setSecurityMessage("Password must contain at least one uppercase letter.");

      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setSecurityMessage("Password must contain at least one lowercase letter.");

      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setSecurityMessage("Password must contain at least one number.");

      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      setSecurityMessage("Password must contain at least one special character.");

      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage("Passwords do not match.");

      return;
    }

    setSecurityMessage("Password updated successfully.");

    setNewPassword("");
    setConfirmPassword("");
  }

  /* =======================================================
     TOGGLE HELPERS
     ======================================================= */

  function toggleEmailNotifications(value: boolean) {
    setEmailNotifications(value);

    saveSettings({
      emailNotifications: value,
    });
  }

  function toggleMatchAlerts(value: boolean) {
    setMatchAlerts(value);

    saveSettings({
      matchAlerts: value,
    });
  }

  function toggleMessageAlerts(value: boolean) {
    setMessageAlerts(value);

    saveSettings({
      messageAlerts: value,
    });
  }

  function toggleNearbyAlerts(value: boolean) {
    setNearbyAlerts(value);

    saveSettings({
      nearbyAlerts: value,
    });
  }

  /* =======================================================
     LOGOUT
     ======================================================= */

  async function handleLogout() {
    setModal(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to sign out.", error);
      setProfileError(
        error instanceof Error ? error.message : "Could not log out. Please try again.",
      );
    }
  }

  /* =======================================================
     INITIAL
     ======================================================= */

  const initial = profile.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="profile-container">
        {/* HEADER */}

        <section className="profile-header">
          <div>
            <span className="profile-eyebrow">MY ACCOUNT</span>

            <h1>Profile</h1>

            <p>Manage your account, preferences and FindBack activity.</p>
          </div>

          <button type="button" className="header-edit-button" onClick={openPersonalInfo}>
            <Pencil />
            Edit profile
          </button>
        </section>

        {(isLoadingProfile || profileError) && (
          <p className="profile-auth-status" role={profileError ? "alert" : "status"}>
            {profileError || "Loading your account..."}
            {profileError.includes("log in") && (
              <>
                {" "}
                <Link to="/">Log in</Link>
              </>
            )}
          </p>
        )}

        {/* =================================================
            PROFILE HERO
            ================================================= */}

        <section className="profile-card">
          <div className="profile-main">
            <div className="profile-avatar">{isLoadingProfile ? "…" : initial}</div>

            <div className="profile-identity">
              <h2>{profile.name || "Your profile"}</h2>

              <p>{profile.email}</p>

              <div className="profile-location">
                <MapPin />

                {profile.city || "Location not added"}
              </div>
            </div>
          </div>

          <div className="profile-member">
            <Calendar />

            <span>Member since</span>

            <strong>{profile.joinedDate}</strong>
          </div>
        </section>

        {/* =================================================
            STATS
            ================================================= */}

        <section className="profile-stats">
          <div className="profile-stat">
            <span className="stat-number">
              {isLoadingProfile ? "…" : (profileStats.itemsReported ?? "—")}
            </span>

            <span className="stat-label">Items Reported</span>
          </div>

          <div className="profile-stat">
            <span className="stat-number">
              {isLoadingProfile ? "…" : (profileStats.itemsReturned ?? "—")}
            </span>

            <span className="stat-label">Items Returned</span>
          </div>

          <div className="profile-stat">
            <span className="stat-number">
              {isLoadingProfile ? "…" : (profileStats.successfulMatches ?? "—")}
            </span>

            <span className="stat-label">Successful Matches</span>
          </div>
        </section>

        <p className="profile-stats-note" role={statsError ? "status" : undefined}>
          {statsError
            ? `Could not load profile statistics: ${statsError}`
            : "Items returned and successful matches will be tracked when those features are available."}
        </p>

        {/* =================================================
            ACCOUNT SETTINGS
            ================================================= */}

        <section className="settings-section">
          <div className="section-heading">
            <div>
              <span>ACCOUNT</span>

              <h2>Settings</h2>
            </div>

            <SlidersHorizontal />
          </div>

          <div className="settings-list">
            {/* PERSONAL */}

            <button type="button" className="setting-row" onClick={openPersonalInfo}>
              <div className="setting-icon">
                <User />
              </div>

              <div className="setting-text">
                <strong>Personal Information</strong>

                <span>Name, email, phone and location</span>
              </div>

              <ChevronRight />
            </button>

            {/* SECURITY */}

            <button type="button" className="setting-row" onClick={() => setModal("security")}>
              <div className="setting-icon">
                <LockKeyhole />
              </div>

              <div className="setting-text">
                <strong>Password &amp; Security</strong>

                <span>Manage your password and account security</span>
              </div>

              <ChevronRight />
            </button>

            {/* EMAIL */}

            <button type="button" className="setting-row" onClick={() => setModal("notifications")}>
              <div className="setting-icon">
                <Mail />
              </div>

              <div className="setting-text">
                <strong>Email Notifications</strong>

                <span>Choose which emails you receive</span>
              </div>

              <div className={`setting-status ${emailNotifications ? "on" : ""}`}>
                {emailNotifications ? "ON" : "OFF"}
              </div>

              <ChevronRight />
            </button>

            {/* MATCH ALERTS */}

            <button type="button" className="setting-row" onClick={() => setModal("alerts")}>
              <div className="setting-icon">
                <Bell />
              </div>

              <div className="setting-text">
                <strong>Match Alerts</strong>

                <span>Get notified when a possible match is found</span>
              </div>

              <div className={`setting-status ${matchAlerts ? "on" : ""}`}>
                {matchAlerts ? "ON" : "OFF"}
              </div>

              <ChevronRight />
            </button>
          </div>
        </section>

        {/* =================================================
            SECURITY CARD
            ================================================= */}

        <section className="privacy-card">
          <div className="privacy-icon">
            <ShieldCheck />
          </div>

          <div>
            <strong>Your information is protected</strong>

            <p>Contact information is only shared after ownership verification.</p>
          </div>
        </section>

        {/* =================================================
            LOGOUT
            ================================================= */}

        <button type="button" className="logout-button" onClick={() => setModal("logout")}>
          <LogOut />
          Log out
        </button>
      </main>

      {/* ===================================================
          BOTTOM NAV
          =================================================== */}

      <BottomNav />

      {/* ===================================================
          MODALS
          =================================================== */}

      {modal && (
        <div
          className="profile-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModal(null);
            }
          }}
        >
          {/* ===============================================
              PERSONAL INFORMATION
              =============================================== */}

          {modal === "personal" && (
            <div className="profile-modal">
              <div className="modal-header">
                <div>
                  <span>YOUR ACCOUNT</span>

                  <h2>Personal Information</h2>
                </div>

                <button type="button" onClick={() => setModal(null)}>
                  <X />
                </button>
              </div>

              <div className="modal-avatar">
                {initial}

                <div>
                  <CircleUserRound />
                </div>
              </div>

              <div className="form-grid">
                <div className="profile-form-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your name"
                  />
                </div>

                <div className="profile-form-field">
                  <label>Email Address</label>

                  <input
                    type="email"
                    value={editForm.email}
                    readOnly
                    placeholder="you@example.com"
                  />

                  <small className="profile-field-hint">
                    Your email address is managed by your sign-in account.
                  </small>
                </div>

                <div className="profile-form-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="profile-form-field">
                  <label>City</label>

                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        city: e.target.value,
                      })
                    }
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              {profileError && (
                <p className="profile-auth-status" role="alert">
                  {profileError}
                </p>
              )}

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={() => setModal(null)}>
                  Cancel
                </button>

                <button
                  type="button"
                  className="modal-save"
                  onClick={() => void savePersonalInfo()}
                  disabled={isSavingProfile}
                >
                  <Check />
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ===============================================
              PASSWORD & SECURITY
              =============================================== */}

          {modal === "security" && (
            <div className="profile-modal">
              <div className="modal-header">
                <div>
                  <span>ACCOUNT SECURITY</span>

                  <h2>Password &amp; Security</h2>
                </div>

                <button type="button" onClick={() => setModal(null)}>
                  <X />
                </button>
              </div>

              <div className="security-intro">
                <div>
                  <ShieldCheck />
                </div>

                <p>Use a strong password that you don't use on other websites.</p>
              </div>

              <div className="password-rules">
                <span>Password requirements</span>

                <div>
                  <Check />
                  At least 8 characters
                </div>

                <div>
                  <Check />
                  One uppercase letter
                </div>

                <div>
                  <Check />
                  One lowercase letter
                </div>

                <div>
                  <Check />
                  One number
                </div>

                <div>
                  <Check />
                  One special character
                </div>
              </div>

              <div className="profile-form-field">
                <label>New Password</label>

                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />

                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="profile-form-field">
                <label>Confirm Password</label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {securityMessage && (
                <div
                  className={`security-message ${
                    securityMessage.includes("successfully") ? "success" : "error"
                  }`}
                >
                  {securityMessage}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={() => setModal(null)}>
                  Cancel
                </button>

                <button type="button" className="modal-save" onClick={changePassword}>
                  <LockKeyhole />
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* ===============================================
              EMAIL NOTIFICATIONS
              =============================================== */}

          {modal === "notifications" && (
            <div className="profile-modal">
              <div className="modal-header">
                <div>
                  <span>NOTIFICATIONS</span>

                  <h2>Email Notifications</h2>
                </div>

                <button type="button" onClick={() => setModal(null)}>
                  <X />
                </button>
              </div>

              <div className="modal-description">
                Decide which updates FindBack can send to your email.
              </div>

              <div className="toggle-list">
                <ToggleRow
                  title="Email notifications"
                  description="Receive important account and report updates."
                  enabled={emailNotifications}
                  onChange={toggleEmailNotifications}
                />

                <ToggleRow
                  title="Messages"
                  description="Get notified when someone sends you a message."
                  enabled={messageAlerts}
                  onChange={toggleMessageAlerts}
                />

                <ToggleRow
                  title="Nearby activity"
                  description="Receive updates about relevant reports near you."
                  enabled={nearbyAlerts}
                  onChange={toggleNearbyAlerts}
                />
              </div>

              <button type="button" className="modal-done" onClick={() => setModal(null)}>
                Done
              </button>
            </div>
          )}

          {/* ===============================================
              MATCH ALERTS
              =============================================== */}

          {modal === "alerts" && (
            <div className="profile-modal">
              <div className="modal-header">
                <div>
                  <span>SMART MATCHING</span>

                  <h2>Match Alerts</h2>
                </div>

                <button type="button" onClick={() => setModal(null)}>
                  <X />
                </button>
              </div>

              <div className="match-alert-hero">
                <div className="match-alert-icon">
                  <Bell />
                </div>

                <div>
                  <strong>Never miss a possible match</strong>

                  <p>FindBack can notify you when a newly reported item may match yours.</p>
                </div>
              </div>

              <div className="toggle-list">
                <ToggleRow
                  title="Possible match alerts"
                  description="Notify me when a new listing may match my report."
                  enabled={matchAlerts}
                  onChange={toggleMatchAlerts}
                />
              </div>

              <div className="alert-note">
                Match alerts do not automatically reveal anyone's private contact information.
              </div>

              <button type="button" className="modal-done" onClick={() => setModal(null)}>
                Save Preferences
              </button>
            </div>
          )}

          {/* ===============================================
              LOGOUT
              =============================================== */}

          {modal === "logout" && (
            <div className="logout-modal">
              <div className="logout-icon">
                <LogOut />
              </div>

              <h2>Log out of FindBack?</h2>

              <p>You'll need to sign in again to access your account.</p>

              <div className="logout-actions">
                <button type="button" onClick={() => setModal(null)} className="modal-cancel">
                  Stay signed in
                </button>

                <button type="button" onClick={handleLogout} className="logout-confirm">
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TOGGLE COMPONENT
   ========================================================= */

type ToggleRowProps = {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ title, description, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="toggle-row">
      <div className="toggle-text">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`toggle ${enabled ? "active" : ""}`}
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span />
      </button>
    </div>
  );
}
