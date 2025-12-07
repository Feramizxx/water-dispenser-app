# Water Dispenser Map Application

A web-based GIS application for managing water dispenser locations using OpenLayers, Vue.js, and GeoServer.

## Project Description

This application allows users to view, add, edit, and delete water dispenser locations on an interactive map. It integrates with GeoServer using WFS (Web Feature Service) for transactional operations and WMS (Web Map Service) for visualization.

## Technology Stack

### Frontend
- **Vue 3** (v3.5.24) - Composition API with `<script setup>`
- **TypeScript** (v5.9.3) - 100% type-safe code
- **OpenLayers** (v10.7.0) - Interactive mapping library
- **Tailwind CSS** (v4.1.17) - Utility-first CSS framework
- **Vite** (v7.2.4) - Build tool and dev server

### Backend/GIS
- **GeoServer** (v2.23.x) - OGC-compliant GIS server
- **PostGIS** (v16-3.4) - Spatial database
- **Docker** & **Docker Compose** - Containerized deployment
- **WFS 2.0.0** - Transactional feature operations
- **WMS 1.1.0** - Map visualization service

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/Feramizxx/water-dispenser-app.git
cd water-dispencer-vue
```

### Step 2: Start Backend (GeoServer + PostGIS)

The backend runs in Docker containers using Docker Compose:

```bash
# Start GeoServer and PostGIS database
docker-compose up -d

# Check if containers are running
docker-compose ps

# View logs (optional)
docker-compose logs -f
```

**What this does:**
- Starts **PostGIS** database on `http://localhost:5432`
  - Database: `geodata`
  - User: `geoserver`
  - Password: `geoserver`
- Starts **GeoServer** on `http://localhost:8080/geoserver`
  - Admin user: `admin`
  - Admin password: `geoserver`

### Step 3: Configure GeoServer

1. Open GeoServer admin interface: `http://localhost:8080/geoserver`
2. Login with credentials: `admin` / `geoserver`
3. Create a workspace named `waterdispensers`
4. Add PostGIS datastore connection:
   - Host: `postgis`
   - Port: `5432`
   - Database: `geodata`
   - User: `geoserver`
   - Password: `geoserver`
5. Create layer `water_dispensers` with schema:
   - `geom` (Point, EPSG:4326)
   - `name` (String)
   - `is_indoor` (Boolean)
   - `floor` (String)
   - `water_types` (String)

### Step 4: Install Frontend Dependencies

```bash
npm install
```

### Step 5: Run Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Built files will be in the `dist` directory.

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v

# View logs
docker-compose logs -f geoserver
docker-compose logs -f postgis

# Restart services
docker-compose restart
```

## Usage

### Application Features

- **View Dispensers**: All water dispensers are displayed on the interactive map
- **Add Dispenser**: 
  1. Click on the map to select a location
  2. Fill in the form (name is required)
  3. Click "Add dispenser"
- **Edit Dispenser**: 
  1. Click a marker on the map or select from the list
  2. Modify the form fields
  3. Click "Update selected"
- **Delete Dispenser**: 
  1. Select a dispenser
  2. Click "Delete selected"
- **Toggle Layers**: Use layer controls to see difference between WMS and WFS

### Layer Types

- **WFS Layer** (Recommended): Interactive vector features that you can click and edit
- **WMS Layer**: Server-rendered image overlay for visualization only

## Project Structure

```
water-dispencer-vue/
├── src/
│   ├── components/           # Vue components (4 files)
│   │   ├── AppHeader.vue     # Application header
│   │   ├── MapView.vue       # OpenLayers map component
│   │   ├── DispenserForm.vue # CRUD form component
│   │   └── DispenserList.vue # Feature list component
│   ├── services/             # Business logic (3 services)
│   │   ├── geoserver.service.ts  # WFS-T operations (206 LOC)
│   │   ├── map.service.ts        # Map initialization (101 LOC)
│   │   └── feature.service.ts    # Data conversions (57 LOC)
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── constants/
│   │   └── index.ts          # Configuration constants
│   ├── assets/               # Static assets
│   ├── App.vue               # Root component (state management)
│   └── main.ts               # Application entry point
├── public/                   # Public static files
├── index.html                # HTML entry point
├── index.css                 # Global styles (accessibility, OpenLayers)
├── docker-compose.yml        # Backend services configuration
├── vite.config.ts            # Vite configuration
├── eslint.config.js          # ESLint configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── README.md                 # This file
├── ARCHITECTURE.md           # System architecture documentation
├── ACCESSIBILITY.md          # WCAG 2.1 AA compliance details
└── RESPONSIVE-DESIGN.md      # Responsive design documentation
```

## Configuration

### Vite Proxy Configuration

The application uses Vite proxy to forward GeoServer requests during development:

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

### GeoServer Configuration

Update `src/constants/index.ts` if your GeoServer runs on a different URL:

```typescript
export const GEOSERVER_URL = '/geoserver'
export const WORKSPACE = 'waterdispensers'
export const LAYER_NAME = 'water_dispensers'
```

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Type check
npm run type-check
```

## Code Quality

- **TypeScript**: 100% type-safe, zero `any` types
- **ESLint**: Strict configuration with `@dataport/eslint-config-geodev`
- **Lines of Code**: 1,217 LOC (excluding node_modules)
- **Components**: 4 Vue components
- **Services**: 3 business logic modules
- **Zero Linter Errors**: ✅ All code passes ESLint

## Accessibility

This application meets **WCAG 2.1 Level AA** standards:
- ✅ Keyboard navigation support
- ✅ ARIA labels and live regions
- ✅ Screen reader compatibility
- ✅ Sufficient color contrast (4.5:1 minimum)
- ✅ Touch target sizes (44x44px minimum)
- ✅ Focus indicators

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for details.

## Architecture

Component-based architecture with clear separation of concerns:
- **Presentation Layer**: Vue components
- **Application Layer**: State management in App.vue
- **Business Logic Layer**: Service modules
- **Data Layer**: GeoServer WFS/WMS

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture diagrams.

## Troubleshooting

### GeoServer not accessible
```bash
# Check if containers are running
docker-compose ps

# Restart services
docker-compose restart

# Check logs
docker-compose logs geoserver
```

### Frontend can't connect to GeoServer
- Ensure GeoServer is running on `http://localhost:8080`
- Check Vite proxy configuration in `vite.config.ts`
- Verify CORS is enabled in GeoServer

### PostGIS connection failed
```bash
# Check PostGIS logs
docker-compose logs postgis

# Verify connection from GeoServer admin interface
# Host should be 'postgis' (not localhost)
```

## License

This project is part of a university course assignment (Geographic Information Systems Development).

## Contributing

This is an academic project. For questions or suggestions, please open an issue.

## Author

**Faramiz Bahaddinov**  
University Course: Geographic Information Systems Development  
Date: December 2025
