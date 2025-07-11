"use client";

import Artwork from './content';
import { Suspense } from 'react';

export default function Page () {
    return (
        <Suspense fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Generated Artwork</h1>
            <div>Loading...</div>
          </div>
        }>
          {/* <Artwork 
          emotions={['innovative', 'humble', 'pessimistic']} 
          colors={['#E19147', '#BCBA7E', '#B66D6D', '#F2F0CD']}
          overallTone='She is optimistic'/> */}
        </Suspense>
      );

}