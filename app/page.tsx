"use client";

import { useState } from 'react';
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/question-prompt"
          className="px-6 py-3 rounded-md font-medium"
        >
        🔍 Analyze Story Patterns
        </Link>
      </div>
    </div>
  );
}