import { useState, useEffect } from "react";
import echo from "../echo";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch existing notifications
    const fetchNotifications = async () => {
      const response = await fetch("http://localhost:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      // Ensure notification_id is always an integer
      const fetchedNotifications = data.notifications.map((n) => ({
        ...n,
        notification_id: parseInt(n.notification_id, 10),
      }));

      setNotifications(fetchedNotifications);
      setUnreadCount(data.unread_count);
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    const channel = echo.private(`user.${userId}`);
    const listener = (e) => {
      console.log("🔔 RAW EVENT:", e);
      console.log("Type of notification_id:", typeof e.notification_id);
      console.log("Value:", e.notification_id);

      const newNotification = {
        notification_id: e.notification_id,
        title: e.title,
        message: e.message,
        is_read: e.is_read || false,
        created_at: e.created_at,
      };

      console.log("Processed notification:", newNotification);

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

  const markAsRead = async (notificationId) => {
    const id = parseInt(notificationId, 10);

    await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setUnreadCount((prev) => prev - 1);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n)),
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: "#4CAF50",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "20px",
          position: "relative",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h3
            style={{
              padding: "15px",
              margin: 0,
              borderBottom: "1px solid #eee",
            }}
          >
            Notifications
          </h3>

          {notifications.length === 0 ? (
            <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>
              No notifications
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.notification_id}
                onClick={() => markAsRead(notif.notification_id)}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: notif.is_read ? "white" : "#f0f8ff",
                }}
              >
                <strong>{notif.title}</strong>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  {notif.message}
                </p>
                <small style={{ color: "#999" }}>
                  {new Date(notif.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
