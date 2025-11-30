import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import echo from "../echo";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();

      const formatted = data.notifications.map((n) => ({
        ...n,
        notification_id: parseInt(n.notification_id, 10),
      }));

      setNotifications(formatted);
      setUnreadCount(data.unread_count);
    };

    fetchNotifications();

    const channel = echo.private(`user.${userId}`);
    const listener = (e) => {
      const newNotification = {
        notification_id: e.notification_id,
        title: e.title,
        message: e.message,
        is_read: e.is_read || false,
        created_at: e.created_at,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      if (Notification.permission === "granted") {
        new Notification(newNotification.title, {
          body: newNotification.message,
        });
      }
    };

    channel.listen(".notification.sent", listener);

    return () => {
      channel.stopListening(".notification.sent");
      echo.leave(`user.${userId}`);
    };
  }, [userId]);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setUnreadCount((prev) => prev - 1);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === id ? { ...n, is_read: true } : n
      )
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <Bell size={24} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "red",
              color: "white",
              fontSize: "10px",
              borderRadius: "50%",
              padding: "2px 5px",
              minWidth: "18px",
              textAlign: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "32px",
            width: "300px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "10px",
            zIndex: 1000,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
            Notifications
          </h4>

          {notifications.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.notification_id}
                onClick={() => !n.is_read && markAsRead(n.notification_id)}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: n.is_read ? "#f5f5f5" : "#e8f0ff",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong style={{ display: "block", marginBottom: "5px" }}>
                  {n.title}
                </strong>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  {n.message}
                </p>
                <small style={{ color: "#999", fontSize: "12px" }}>
                  {new Date(n.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}