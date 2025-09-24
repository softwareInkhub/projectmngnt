'use client';

import React, { useEffect, useState } from 'react';
import { handleGoogleCalendarCallback } from '../utils/googleCalendarClient';
import { useUser } from '../contexts/UserContext';

export default function OAuthCallbackPage() {
  const { currentUser } = useUser();
  const [message, setMessage] = useState('Connecting Google Calendar...');

  useEffect(() => {
    async function run() {
      try {
        if (!currentUser?.id) {
          setMessage('Please login first.');
          return;
        }
        await handleGoogleCalendarCallback(currentUser.id);
        setMessage('Google Calendar connected! You can close this tab.');
        setTimeout(() => window.location.replace('/'), 1200);
      } catch (e: any) {
        setMessage(`Failed to connect: ${e?.message || 'Unknown error'}`);
      }
    }
    void run();
  }, [currentUser?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
}


