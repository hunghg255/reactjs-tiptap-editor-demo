'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Editor = dynamic(() => import('@/components/Editor/Editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const EditorClient = () => {
  return (
    <>
      <Editor />
    </>
  );
}



export default EditorClient;
