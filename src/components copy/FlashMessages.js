import React from "react";

export default function FlashMessages({ messages }) {
  return (
    <div className="floating-alerts">
      {messages.map((message, index) => (
        <div
          key={index}
          className="alert alert-success text-center floating-alert shadow-sm"
        >
          {message}
        </div>
      ))}
    </div>
  );
}
