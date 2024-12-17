'use client';
import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import { useSearchParams } from 'next/navigation';
import { Button } from './Button';

export default function MapViewer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView>(null);
  const layerId = '5881a8933a264ab98df6aface0b7a678';
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map();

    // Telling the library where it should render the map in the HTML
    const view = new MapView({
      container: mapRef.current,
      map: map,
    });

    // Pulling the feature layer from Open Data
    const layer = new FeatureLayer({
      url: 'https://maps.matsugov.us/map/rest/services/OpenData/Administrative_AssemblyDistricts/FeatureServer/0',
      id: layerId,
    });

    // Pulling the basemap from Open data
    const tileLayer = new VectorTileLayer({
      url: 'https://tiles.arcgis.com/tiles/fX5IGselyy1TirdY/arcgis/rest/services/MSB_Streets_standard/VectorTileServer',
    });

    // Add basemap and feature layer to map
    map.add(tileLayer);
    map.add(layer);

    // Saving the reference to the view
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
    // The map is the class object of the map we are rendering, contains all the metadata.
    const map = viewRef.current?.map;

    // The view the actual HTML element the map is rendered on
    const view = viewRef.current;

    // Grabbing the layer we want to filter
    const layer = map?.findLayerById(layerId) as FeatureLayer;
    if (layer) {
      // Filter by DISTNUM if districtNumber is defined.
      layer.definitionExpression = districtNumber === 'all' ? '' : `DISTNUM = ${districtNumber}`;

      // Grab the geometric coordinates and zoom the view.
      if (districtNumber !== 'all') {
        const query = layer.createQuery();

        // Finding the District we are focusing
        query.where = `DISTNUM = ${districtNumber}`;

        // This tells the query to return geometry coordinates
        query.returnGeometry = true;

        // Send the request.
        const response = await layer.queryFeatures(query);

        if (response.features.length) {
          //Grab the geometry
          const geometry = response.features[0].geometry;

          if (view && geometry) {
            // Zoom to the geometry location.
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
          <Button href="?district=all">All</Button>
          <Button href="?district=1">Dist 1</Button>
          <Button href="?district=2">Dist 2</Button>
          <Button href="?district=3">Dist 3</Button>
          <Button href="?district=4">Dist 4</Button>
          <Button href="?district=5">Dist 5</Button>
          <Button href="?district=6">Dist 6</Button>
          <Button href="?district=7">Dist 7</Button>
        </div>
        <div style={{ height: '100vh', width: '100vw' }} ref={mapRef}></div>
      </main>
    </div>
  );
}
