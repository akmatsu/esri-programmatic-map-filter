'use client';
import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function MapViewer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView>(null);
  const layerId = '5881a8933a264ab98df6aface0b7a678';
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map();

    const view = new MapView({
      container: mapRef.current,
      map: map,
    });

    const layer = new FeatureLayer({
      url: 'https://maps.matsugov.us/map/rest/services/OpenData/Administrative_AssemblyDistricts/FeatureServer/0',
      id: layerId,
    });
    const tileLayer = new VectorTileLayer({
      url: 'https://tiles.arcgis.com/tiles/fX5IGselyy1TirdY/arcgis/rest/services/MSB_Streets_standard/VectorTileServer',
    });

    map.add(tileLayer);
    map.add(layer);

    viewRef.current = view;

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const distNum = searchParams.get('district');
    if (distNum) {
      filterDistrict(distNum);
    }
  }, [searchParams]);

  async function filterDistrict(districtNumber: string) {
    const map = viewRef.current?.map;
    const view = viewRef.current;
    const layer = map?.findLayerById(layerId) as FeatureLayer;
    if (layer) {
      layer.definitionExpression = districtNumber === 'all' ? '' : `DISTNUM = ${districtNumber}`;

      if (districtNumber !== 'all') {
        const query = layer.createQuery();
        query.where = `DISTNUM = ${districtNumber}`;
        query.returnGeometry = true;

        const response = await layer.queryFeatures(query);

        if (response.features.length) {
          const geometry = response.features[0].geometry;

          if (view && geometry) {
            view.goTo(geometry).catch((error) => console.error('Error zooming to geometry', error));
          }
        }
      }
    }
  }

  return (
    <div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="fixed flex gap-2 p-2 bottom-0 right-0">
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=all"
          >
            All
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=1"
          >
            Dist 1
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=2"
          >
            Dist 2
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=3"
          >
            Dist 3
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=4"
          >
            Dist 4
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=5"
          >
            Dist 5
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=6"
          >
            Dist 6
          </Link>
          <Link
            className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
            href="?district=7"
          >
            Dist 7
          </Link>
        </div>
        <div style={{ height: '100vh', width: '100vw' }} ref={mapRef}></div>
      </main>
    </div>
  );
}
