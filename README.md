This is a proof of concept that uses the ArcGIS JavaScript SDK to programmatically render and filter ArcGIS maps using URL query parameters.

## Links to Documentation

- ArcGIS
  - [Official ArcGIS JavaScript SDK Documentation](https://developers.arcgis.com/javascript/latest/)
- NextJS (Optional) _This project uses NextJS but you don't have to._
  - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
  - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## How this app works

This app is using NextJS which is a React Framework for building website frontends. And it uses the ArcGIS JavaScript SDK to programmatically render a map with a open data layer and uses query parameters to filter the items within the layer.

Please review [MapViewer.TSX](/components/MapViewer.tsx) and [ProjectMapViewer.tsx](/components/ProjectMapViewer.tsx) to see how we use the ArcGIS JavaScript SDK. Please refer to the [documentation links](#links-to-documentation) you need

## Getting Started

### Install Dependencies

```bash
npm i
```

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
