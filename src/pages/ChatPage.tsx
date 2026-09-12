import { useMemo, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import {
  ArrowLeft,
  CheckCheck,
  Image as ImageIcon,
  MapPin,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
} from "lucide-react";
import "@/styles/chat.css";

type Message = {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
};

type Conversation = {
  id: number;
  name: string;
  avatar: string;
  itemName: string;
  itemImage: string;
  location: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?img=12",
    itemName: "Black Leather Backpack",
    itemImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
    location: "Central Park",
    lastMessage: "I think this might be my backpack.",
    time: "10:42 AM",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        text: "Hi, I saw your post about the black leather backpack.",
        sender: "them",
        time: "10:35 AM",
      },
      {
        id: 2,
        text: "I think this might be my backpack.",
        sender: "them",
        time: "10:36 AM",
      },
      {
        id: 3,
        text: "Can you tell me where you lost it?",
        sender: "me",
        time: "10:40 AM",
        read: true,
      },
      {
        id: 4,
        text: "Near the central park entrance.",
        sender: "them",
        time: "10:42 AM",
      },
    ],
  },

  {
    id: 2,
    name: "Aditya Singh",
    avatar: "https://i.pravatar.cc/150?img=11",
    itemName: "Silver Wireless Headphones",
    itemImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
    location: "Subway Line 4",
    lastMessage: "Yes, I found them yesterday.",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hello! Are these the headphones you found?",
        sender: "me",
        time: "Yesterday",
        read: true,
      },
      {
        id: 2,
        text: "Yes, I found them yesterday.",
        sender: "them",
        time: "Yesterday",
      },
      {
        id: 3,
        text: "Great. I'll verify the ownership details.",
        sender: "me",
        time: "Yesterday",
        read: true,
      },
    ],
  },

  {
    id: 3,
    name: "Vivek Kumar",
    avatar: "https://i.pravatar.cc/150?img=13",
    itemName: "Brown Leather Wallet",
    itemImage:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80",
    location: "Main City Cafe",
    lastMessage: "Can you share more details?",
    time: "Mon",
    unread: 1,
    online: true,
    messages: [
      {
        id: 1,
        text: "Hi! I think the wallet in your listing could be mine.",
        sender: "them",
        time: "Mon",
      },
      {
        id: 2,
        text: "Can you share more details?",
        sender: "them",
        time: "Mon",
      },
    ],
  },

  {
    id: 4,
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?img=14",
    itemName: "Set of Car Keys",
    itemImage:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=300&q=80",
    location: "City Library",
    lastMessage: "Thank you for your help!",
    time: "Sun",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "I believe these are my keys.",
        sender: "them",
        time: "Sun",
      },
      {
        id: 2,
        text: "I've completed the ownership verification.",
        sender: "me",
        time: "Sun",
        read: true,
      },
      {
        id: 3,
        text: "Thank you for your help!",
        sender: "them",
        time: "Sun",
      },
    ],
  },

  {
    id: 5,
    name: "Karan Verma",
    avatar: "https://i.pravatar.cc/150?img=15",
    itemName: "Blue Water Bottle",
    itemImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80",
    location: "University Campus",
    lastMessage: "I'll check the details.",
    time: "Sat",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hello, I'm interested in the water bottle listing.",
        sender: "me",
        time: "Sat",
        read: true,
      },
      {
        id: 2,
        text: "I'll check the details.",
        sender: "them",
        time: "Sat",
      },
    ],
  },
];

export function ChatPage() {
  const [chatList, setChatList] =
    useState<Conversation[]>(conversations);

  const [selectedChatId, setSelectedChatId] =
    useState<number | null>(1);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const [mobileChatOpen, setMobileChatOpen] =
    useState(false);

  const selectedChat = chatList.find(
    (chat) => chat.id === selectedChatId
  );

  const filteredChats = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return chatList;
    }

    return chatList.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.itemName.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
    );
  }, [chatList, search]);

  const openChat = (id: number) => {
    setSelectedChatId(id);
    setMobileChatOpen(true);

    setChatList((previous) =>
      previous.map((chat) =>
        chat.id === id
          ? { ...chat, unread: 0 }
          : chat
      )
    );
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) {
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      text: message.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setChatList((previous) =>
      previous.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              lastMessage: newMessage.text,
              time: "Now",
              messages: [
                ...chat.messages,
                newMessage,
              ],
            }
          : chat
      )
    );

    setMessage("");
  };

  return (
    <div className="chat-page">

      {/* =================================================
          MAIN CHAT AREA
          ================================================= */}

      <main className="chat-main">

        {/* =================================================
            LEFT — CONVERSATION LIST
            ================================================= */}

        <aside
          className={`chat-sidebar ${
            mobileChatOpen
              ? "mobile-hidden"
              : ""
          }`}
        >
          <div className="chat-sidebar-header">

            <div>
              <span className="chat-label">
                MESSAGES
              </span>

              <h1>Chats</h1>

              <p>
                Conversations about your
                lost & found items.
              </p>
            </div>

          </div>

          {/* Search */}
          <div className="chat-search">

            <Search />

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* Conversation list */}
          <div className="conversation-list">

            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`conversation ${
                    selectedChatId === chat.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    openChat(chat.id)
                  }
                >
                  {/* Avatar */}

                  <div className="avatar-wrapper">

                    <img
                      src={chat.avatar}
                      alt={chat.name}
                    />

                    {chat.online && (
                      <span className="online-dot" />
                    )}

                  </div>

                  {/* Conversation info */}

                  <div className="conversation-info">

                    <div className="conversation-top">

                      <strong>
                        {chat.name}
                      </strong>

                      <time>
                        {chat.time}
                      </time>

                    </div>

                    <div className="conversation-item">
                      <span>
                        {chat.itemName}
                      </span>
                    </div>

                    <div className="conversation-bottom">

                      <p>
                        {chat.lastMessage}
                      </p>

                      {chat.unread > 0 && (
                        <span className="unread-badge">
                          {chat.unread}
                        </span>
                      )}

                    </div>

                  </div>
                </button>
              ))
            ) : (
              <div className="no-chats">
                <Search size={30} />

                <h3>
                  No conversations
                </h3>

                <p>
                  Try another search.
                </p>
              </div>
            )}

          </div>
        </aside>

        {/* =================================================
            RIGHT — ACTIVE CHAT
            ================================================= */}

        <section
          className={`chat-window ${
            mobileChatOpen
              ? "mobile-visible"
              : ""
          }`}
        >

          {selectedChat ? (
            <>
              {/* Chat header */}

              <header className="chat-header">

                <button
                  className="mobile-back"
                  onClick={() =>
                    setMobileChatOpen(false)
                  }
                  aria-label="Back to chats"
                >
                  <ArrowLeft />
                </button>

                <div className="chat-user-avatar">

                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                  />

                  {selectedChat.online && (
                    <span />
                  )}

                </div>

                <div className="chat-user-info">

                  <h2>
                    {selectedChat.name}
                  </h2>

                  <span>
                    {selectedChat.online
                      ? "Online"
                      : "Offline"}
                  </span>

                </div>

                <button
                  className="chat-more"
                  aria-label="More options"
                >
                  <MoreVertical />
                </button>

              </header>

              {/* =================================================
                  ITEM PREVIEW
                  ================================================= */}

              <div className="chat-item-preview">

                <img
                  src={selectedChat.itemImage}
                  alt={selectedChat.itemName}
                />

                <div className="chat-item-info">

                  <span>
                    ITEM DISCUSSION
                  </span>

                  <strong>
                    {selectedChat.itemName}
                  </strong>

                  <small>
                    <MapPin size={12} />
                    {selectedChat.location}
                  </small>

                </div>

                <div className="chat-item-verified">
                  <ShieldCheck size={15} />
                  <span>
                    Protected
                  </span>
                </div>

              </div>

              {/* =================================================
                  MESSAGES
                  ================================================= */}

              <div className="messages-area">

                <div className="message-date">
                  <span>
                    TODAY
                  </span>
                </div>

                {selectedChat.messages.map(
                  (msg) => (
                    <div
                      key={msg.id}
                      className={`message-row ${
                        msg.sender === "me"
                          ? "mine"
                          : "theirs"
                      }`}
                    >
                      <div className="message-bubble">

                        <p>
                          {msg.text}
                        </p>

                        <div className="message-time">

                          <span>
                            {msg.time}
                          </span>

                          {msg.sender === "me" && (
                            <CheckCheck
                              size={13}
                              className={
                                msg.read
                                  ? "read"
                                  : ""
                              }
                            />
                          )}

                        </div>

                      </div>
                    </div>
                  )
                )}

              </div>

              {/* =================================================
                  MESSAGE COMPOSER
                  ================================================= */}

              <div className="message-composer">

                <button
                  className="composer-icon"
                  aria-label="Attach file"
                >
                  <Paperclip />
                </button>

                <button
                  className="composer-icon image-button"
                  aria-label="Add image"
                >
                  <ImageIcon />
                </button>

                <div className="message-input-wrapper">

                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />

                  <button
                    className="emoji-button"
                    aria-label="Emoji"
                  >
                    <Smile />
                  </button>

                </div>

                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  aria-label="Send message"
                >
                  <Send />
                </button>

              </div>

              <div className="chat-safety-note">
                <ShieldCheck size={12} />

                Never share passwords, OTPs or
                sensitive personal information.
              </div>
            </>
          ) : (
            <div className="no-chat-selected">

              <div className="empty-chat-icon">
                <MessageIcon />
              </div>

              <h2>
                Select a conversation
              </h2>

              <p>
                Choose a conversation to start
                chatting.
              </p>

            </div>
          )}

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

/* =========================================================
   SIMPLE MESSAGE ICON
   ========================================================= */

function MessageIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 11.5C20 15.6421 16.4183 19 12 19C10.6818 19 9.44509 18.6956 8.36364 18.1591L4 20L5.27273 16.2273C4.468 14.9032 4 13.3758 4 11.5C4 7.35786 7.58172 4 12 4C16.4183 4 20 7.35786 20 11.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}