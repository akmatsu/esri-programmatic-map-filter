'use client';
import dynamic from 'next/dynamic';

const MapViewer = dynamic(() => import('../components/MapViewer'), {
  ssr: false,
});

export default function Home() {
  return <MapViewer />;
}
