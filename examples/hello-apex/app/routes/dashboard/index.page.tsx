import React from 'react';

interface DashboardProps {
  user?: {
    name: string;
  };
  items?: string[];
}

export default function DashboardPage({ user, items }: DashboardProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.name}!</p> : <p>Loading user...</p>}
      {items ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Loading items...</p>
      )}
      
      <form method="post" action="/dashboard">
        <input type="text" name="item" placeholder="New item" />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}