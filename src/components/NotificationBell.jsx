import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCircle, Info } from "lucide-react";
import echo from "../echo";


const ToastNotification = ({ title, message, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-80">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 rounded-lg">
              <Bell className="h-4 w-4 text-teal-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  
  useEffect(() => {
    if (toast) {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
    }

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.ok) {
          const data = await response.json();
          const formatted = data.notifications?.map((n) => ({
            ...n,
            notification_id: parseInt(n.notification_id, 10),
          })) || [];

          setNotifications(formatted);
          setUnreadCount(data.unread_count || 0);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
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

      
      setToast({
        title: e.title,
        message: e.message,
        id: Date.now()
      });

      
      if (Notification.permission === "granted") {
        new Notification(e.title, {
          body: e.message,
          icon: "/logo192.png" // Add your logo path here
        });
      }
    };

    channel.listen(".notification.sent", listener);

    return () => {
      channel.stopListening(".notification.sent");
      echo.leave(`user.${userId}`);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:8000/api/notifications/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      
      {toast && (
        <ToastNotification
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="h-6 w-6 text-gray-700" />
          
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        
        {showDropdown && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
           
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="p-3 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.notification_id}
                    onClick={() => !n.is_read && markAsRead(n.notification_id)}
                    className={`p-4 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${
                      n.is_read 
                        ? 'hover:bg-gray-50' 
                        : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        n.is_read ? 'bg-gray-100' : 'bg-blue-100'
                      }`}>
                        {n.is_read ? (
                          <CheckCircle className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`font-medium ${
                            n.is_read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {n.title}
                          </h4>
                          {!n.is_read && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(n.created_at)}
                          </span>
                          {!n.is_read && (
                            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Navigate to notifications page or clear all
                  }}
                  className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}

       
        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      
    </>
  );
}