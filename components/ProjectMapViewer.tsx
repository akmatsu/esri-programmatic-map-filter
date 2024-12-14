'use client';
import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ProjectMapViewer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView>(null);
  const layerId = 'd208ae226b1244b9b08adeb14a26d2c9';
  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map();

    const view = new MapView({
      container: mapRef.current,
      map: map,
    });

    // Making the project areas a coral color so they're easier to see.
    const greenFillSymbol = new SimpleFillSymbol({
      color: [255, 127, 80, 0.4],
      outline: {
        color: [255, 127, 80],
        width: 1,
      },
    });

    const layer = new FeatureLayer({
      url: 'https://services.arcgis.com/fX5IGselyy1TirdY/arcgis/rest/services/InfrastructureProjects_Public/FeatureServer',
      id: layerId,
      renderer: new SimpleRenderer({
        symbol: greenFillSymbol,
      }),
    });

    const tileLayer = new VectorTileLayer({
      url: 'https://tiles.arcgis.com/tiles/fX5IGselyy1TirdY/arcgis/rest/services/MSB_Streets_standard/VectorTileServer',
    });

    map.add(tileLayer);
    map.add(layer);

    viewRef.current = view;

    view.on('click', async (e) => {
      const response = await view.hitTest(e);

      const clickedResult = response.results.find((r) => r.layer && r.layer.id === layerId);

      if (clickedResult) {
        const OID = (
          clickedResult as __esri.MapViewViewHit & { graphic: { attributes: { OBJECTID: string } } }
        ).graphic.attributes?.OBJECTID;

        if (OID) {
          router.push(`?project=${OID}`);
        }
      }
    });

    view.popupEnabled = true;

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [router]);

  useEffect(() => {
    const objectId = searchParams.get('project');

    filterProject(objectId);
  }, [searchParams]);

  async function filterProject(objectId?: string | null) {
    const map = viewRef.current?.map;
    const view = viewRef.current;
    const layer = map?.findLayerById(layerId) as FeatureLayer;
    if (layer) {
      layer.definitionExpression = !objectId || objectId === 'all' ? '' : `OBJECTID = ${objectId}`;

      if (objectId !== 'all') {
        const query = layer.createQuery();
        query.where = `OBJECTID = ${objectId}`;
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
          {searchParams.get('project') && (
            <Link
              className="bg-blue-600 shadow transition-colors hover:bg-blue-500 active:bg-blue-400 active:transition-none px-4 py-2 rounded"
              href="?"
            >
              Clear
            </Link>
          )}
        </div>
        <div style={{ height: '100vh', width: '100vw' }} ref={mapRef}></div>
      </main>
    </div>
  );
}
