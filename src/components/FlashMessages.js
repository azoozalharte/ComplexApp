import React from "react";

export default function FlashMessages({ messages, isDanger }) {
  return (
    <div className="floating-alerts">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`alert alert-${
            !isDanger ? "success" : "danger"
          } text-center floating-alert shadow-sm`}
        >
          {message}
        </div>
      ))}
    </div>
  );
}
