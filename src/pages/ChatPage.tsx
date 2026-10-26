import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCheck,
  MapPin,
  MoreVertical,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import {
  getChatConversations,
  getChatMessages,
  markChatRead,
  OPEN_CONVERSATION_KEY,
  sendChatMessage,
  type ChatConversation,
  type ChatMessage,
} from "@/lib/chat";
import { supabase } from "@/lib/supabase";
import "@/styles/chat.css";

function formatTime(value: string) {
  const date = new Date(value);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    const conversations = await getChatConversations();
    setChatList(conversations);
    return conversations;
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const conversationMessages = await getChatMessages(conversationId);
    setMessages(conversationMessages);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function initialize() {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError) throw authError;

        if (!session) {
          if (isCurrent) {
            setUserId(null);
            setChatList([]);
            setMessages([]);
          }
          return;
        }

        const conversations = await getChatConversations();
        if (!isCurrent) return;

        setUserId(session.user.id);
        setChatList(conversations);

        const requestedId = sessionStorage.getItem(OPEN_CONVERSATION_KEY);
        sessionStorage.removeItem(OPEN_CONVERSATION_KEY);
        const initialChat =
          conversations.find((chat) => chat.conversation_id === requestedId) ?? conversations[0];

        if (initialChat) {
          setSelectedChatId(initialChat.conversation_id);
          setMobileChatOpen(Boolean(requestedId));
          const initialMessages = await getChatMessages(initialChat.conversation_id);
          if (isCurrent) setMessages(initialMessages);
          await markChatRead(initialChat.conversation_id);
        }
      } catch (loadError) {
        console.error("Failed to load chats.", loadError);
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load chats. Please try again.",
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void initialize();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedChatId || !userId) return;

    let isCurrent = true;
    const channel = supabase
      .channel(`chat:${selectedChatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${selectedChatId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (!isCurrent) return;

          setMessages((current) =>
            current.some((entry) => entry.id === newMessage.id)
              ? current
              : [...current, newMessage],
          );

          void loadConversations().catch((refreshError: unknown) => {
            console.error("Failed to refresh chat list.", refreshError);
          });

          if (newMessage.sender_id !== userId) {
            void markChatRead(selectedChatId).catch((readError: unknown) => {
              console.error("Failed to mark chat as read.", readError);
            });
          }
        },
      )
      .subscribe();

    return () => {
      isCurrent = false;
      void supabase.removeChannel(channel);
    };
  }, [loadConversations, selectedChatId, userId]);

  const selectedChat = chatList.find((chat) => chat.conversation_id === selectedChatId);

  const filteredChats = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return chatList;

    return chatList.filter(
      (chat) =>
        chat.other_user_name.toLowerCase().includes(query) ||
        chat.item_title.toLowerCase().includes(query) ||
        chat.last_message.toLowerCase().includes(query),
    );
  }, [chatList, search]);

  async function openChat(chat: ChatConversation) {
    setSelectedChatId(chat.conversation_id);
    setMobileChatOpen(true);
    setMessages([]);
    setError(null);

    try {
      await Promise.all([loadMessages(chat.conversation_id), markChatRead(chat.conversation_id)]);

      setChatList((current) =>
        current.map((entry) =>
          entry.conversation_id === chat.conversation_id ? { ...entry, unread_count: 0 } : entry,
        ),
      );
    } catch (loadError) {
      console.error("Failed to open conversation.", loadError);
      setError(
        loadError instanceof Error ? loadError.message : "Could not open this conversation.",
      );
    }
  }

  async function handleSendMessage() {
    const text = message.trim();
    if (!text || !selectedChat || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      await sendChatMessage(selectedChat.conversation_id, text);
      setMessage("");
      await Promise.all([loadMessages(selectedChat.conversation_id), loadConversations()]);
    } catch (sendError) {
      console.error("Failed to send chat message.", sendError);
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Your message could not be sent. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="chat-page">
      <main className="chat-main">
        <aside className={`chat-sidebar ${mobileChatOpen ? "mobile-hidden" : ""}`}>
          <div className="chat-sidebar-header">
            <div>
              <span className="chat-label">MESSAGES</span>
              <h1>Chats</h1>
              <p>Conversations about your lost & found items.</p>
            </div>
          </div>

          <div className="chat-search">
            <Search />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="conversation-list">
            {isLoading ? (
              <div className="no-chats">
                <p>Loading conversations...</p>
              </div>
            ) : !userId ? (
              <div className="no-chats">
                <h3>Log in to use chat</h3>
                <p>Your conversations are saved to your account.</p>
                <Link to="/">Log in</Link>
              </div>
            ) : error && chatList.length === 0 ? (
              <div className="no-chats">
                <h3>Could not load chats</h3>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() =>
                    void loadConversations()
                      .then((items) => {
                        setChatList(items);
                        setError(null);
                      })
                      .catch((retryError: unknown) => {
                        setError(
                          retryError instanceof Error
                            ? retryError.message
                            : "Could not load chats.",
                        );
                      })
                  }
                >
                  Try again
                </button>
              </div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <button
                  key={chat.conversation_id}
                  className={`conversation ${
                    selectedChatId === chat.conversation_id ? "selected" : ""
                  }`}
                  onClick={() => void openChat(chat)}
                >
                  <div className="avatar-wrapper">
                    <img src="https://i.pravatar.cc/150?img=12" alt="" />
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-top">
                      <strong>{chat.other_user_name}</strong>
                      <time>{formatTime(chat.last_message_at)}</time>
                    </div>
                    <div className="conversation-item">
                      <span>{chat.item_title}</span>
                    </div>
                    <div className="conversation-bottom">
                      <p>{chat.last_message || "Conversation started"}</p>
                      {chat.unread_count > 0 && (
                        <span className="unread-badge">{chat.unread_count}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="no-chats">
                <Search size={30} />
                <h3>{search ? "No conversations found" : "No conversations yet"}</h3>
                <p>
                  {search
                    ? "Try another search."
                    : "Open a listing and choose Chat with reporter to start one."}
                </p>
              </div>
            )}
          </div>
        </aside>

        <section className={`chat-window ${mobileChatOpen ? "mobile-visible" : ""}`}>
          {selectedChat ? (
            <>
              <header className="chat-header">
                <button
                  className="mobile-back"
                  onClick={() => setMobileChatOpen(false)}
                  aria-label="Back to chats"
                >
                  <ArrowLeft />
                </button>
                <div className="chat-user-avatar">
                  <img src="https://i.pravatar.cc/150?img=12" alt="" />
                </div>
                <div className="chat-user-info">
                  <h2>{selectedChat.other_user_name}</h2>
                  <span>Item conversation</span>
                </div>
                <button className="chat-more" aria-label="More options">
                  <MoreVertical />
                </button>
              </header>

              <div className="chat-item-preview">
                {selectedChat.item_image_url ? (
                  <img src={selectedChat.item_image_url} alt={selectedChat.item_title} />
                ) : (
                  <div className="chat-item-image-placeholder" />
                )}
                <div className="chat-item-info">
                  <span>ITEM DISCUSSION</span>
                  <strong>{selectedChat.item_title}</strong>
                  <small>
                    <MapPin size={12} />
                    {selectedChat.item_location}
                  </small>
                </div>
                <div className="chat-item-verified">
                  <ShieldCheck size={15} />
                  <span>Protected</span>
                </div>
              </div>

              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="no-chat-messages">
                    <p>Send a message to start this conversation.</p>
                  </div>
                ) : (
                  messages.map((entry) => {
                    const mine = entry.sender_id === userId;
                    return (
                      <div key={entry.id} className={`message-row ${mine ? "mine" : "theirs"}`}>
                        <div className="message-bubble">
                          <p>{entry.body}</p>
                          <div className="message-time">
                            <span>{formatTime(entry.created_at)}</span>
                            {mine && <CheckCheck size={13} />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {error && (
                <p className="chat-error" role="alert">
                  {error}
                </p>
              )}

              <div className="message-composer">
                <div className="message-input-wrapper">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={message}
                    maxLength={4000}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button
                  className="send-button"
                  onClick={() => void handleSendMessage()}
                  disabled={!message.trim() || isSending}
                  aria-label="Send message"
                >
                  <Send />
                </button>
              </div>

              <div className="chat-safety-note">
                <ShieldCheck size={12} />
                Never share passwords, OTPs or sensitive personal information.
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-chat-icon">
                <MessageIcon />
              </div>
              <h2>{userId ? "Select a conversation" : "Your chats are private"}</h2>
              <p>
                {userId
                  ? "Choose a conversation to start chatting."
                  : "Log in to access conversations saved to your account."}
              </p>
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function MessageIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
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
