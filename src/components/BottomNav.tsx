import { Link } from "@tanstack/react-router";
import {
  Home,
  MessageCircle,
  Plus,
  Search,
  User,
} from "lucide-react";

import "@/styles/bottom-nav.css";

export function BottomNav() {
  return (
    <nav className="bottom-nav">

      <Link
        to="/dashboard"
        className="bottom-nav-item"
        activeProps={{
          className: "bottom-nav-item active",
        }}
      >
        <Home className="bottom-nav-icon" />
        <span>Home</span>
      </Link>

      <Link
        to="/chat"
        className="bottom-nav-item"
        activeProps={{
          className: "bottom-nav-item active",
        }}
      >
        <MessageCircle className="bottom-nav-icon" />
        <span>Chat</span>
      </Link>

      <Link
        to="/report"
        className="bottom-nav-add"
        aria-label="Report an item"
      >
        <Plus />
      </Link>

      <Link
        to="/search"
        className="bottom-nav-item"
        activeProps={{
          className: "bottom-nav-item active",
        }}
      >
        <Search className="bottom-nav-icon" />
        <span>Search</span>
      </Link>

      <Link
        to="/profile"
        className="bottom-nav-item"
        activeProps={{
          className: "bottom-nav-item active",
        }}
      >
        <User className="bottom-nav-icon" />
        <span>Profile</span>
      </Link>

    </nav>
  );
}