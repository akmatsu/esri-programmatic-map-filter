'use client';
import dynamic from 'next/dynamic';

const ProjectMapViewer = dynamic(() => import('../../components/ProjectMapViewer'), {
  ssr: false,
});

export default function Home() {
  return <ProjectMapViewer />;
}
