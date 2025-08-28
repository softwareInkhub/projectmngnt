"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function TestPage() {
  const params = useParams();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>This is a test page to verify routing is working.</p>
      <p>Params: {JSON.stringify(params)}</p>
    </div>
  );
}


