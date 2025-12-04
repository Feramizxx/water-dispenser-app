# Water Dispenser Map Application

A web-based GIS application for managing water dispenser locations using OpenLayers, Vue.js, and GeoServer.

## Project Description

This application allows users to view, add, edit, and delete water dispenser locations on an interactive map. It integrates with GeoServer using WFS (Web Feature Service) for transactional operations and WMS (Web Map Service) for visualization.

## Technology Stack

- Vue 3 (Composition API)
- TypeScript
- OpenLayers
- Tailwind CSS v4
- Vite
- GeoServer (WFS 2.0.0, WMS 1.1.0)

## Prerequisites

- Node.js (v18 or higher)
- GeoServer running on `http://localhost:8080`
- GeoServer workspace: `waterdispensers`
- GeoServer layer: `water_dispensers` with attributes: `geom` (Point), `name` (String), `is_indoor` (Boolean), `floor` (String), `water_types` (String)

## Installation

```bash
# Clone repository
git clone https://github.com/Feramizxx/water-dispenser-app.git
cd water-dispencer-vue

# Install dependencies
npm install

# Run development server
npm run dev
```

Application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## Usage

- **View**: Existing water dispensers are shown on the map
- **Add**: Click the map to select location, fill form, click "Add dispenser"
- **Edit**: Click marker or list item, modify form, click "Update selected"
- **Delete**: Select dispenser, click "Delete selected"

## Project Structure

```
water-dispencer-vue/
├── src/
│   ├── components/      # Vue components
│   ├── services/        # Business logic (GeoServer, Map, Feature)
│   ├── types/           # TypeScript definitions
│   ├── constants/       # Configuration
│   ├── App.vue          # Main component
│   └── main.ts          # Entry point
├── index.html
├── vite.config.ts
└── package.json
```

## Configuration

The application uses Vite proxy to forward GeoServer requests:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/geoserver': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});
```

## Accessibility

This application meets WCAG 2.1 Level AA standards with keyboard navigation, ARIA labels, color contrast, and screen reader compatibility.

## License

This project is part of a university course assignment.
