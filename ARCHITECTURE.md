# Water Dispenser Map Application - System Architecture

## System Architecture Overview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                           CLIENT BROWSER                                  ┃
┃ ┌───────────────────────────────────────────────────────────────────────┐ ┃
┃ │                      PRESENTATION LAYER (Vue.js 3)                    │ ┃
┃ │                                                                       │ ┃
┃ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │ ┃
┃ │  │ AppHeader   │  │  MapView    │  │  Dispenser  │  │ Dispenser  │ │ ┃
┃ │  │  Component  │  │  Component  │  │    Form     │  │    List    │ │ ┃
┃ │  │             │  │             │  │  Component  │  │  Component │ │ ┃
┃ │  │  (18 LOC)   │  │  (244 LOC)  │  │  (220 LOC)  │  │  (87 LOC)  │ │ ┃
┃ │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │ ┃
┃ │         │                │                 │                │        │ ┃
┃ │         └────────────────┴─────────────────┴────────────────┘        │ ┃
┃ └───────────────────────────────────┬───────────────────────────────────┘ ┃
┃                                     │                                     ┃
┃ ┌───────────────────────────────────▼───────────────────────────────────┐ ┃
┃ │                     APPLICATION LAYER (App.vue)                       │ ┃
┃ │                                                                       │ ┃
┃ │  • State Management (Vue Composition API)                            │ ┃
┃ │  • Event Coordination & Handlers                                     │ ┃
┃ │  • CRUD Operation Controllers                                        │ ┃
┃ │  • Feature Selection & Editing Logic                                 │ ┃
┃ └───────────────────────────────────┬───────────────────────────────────┘ ┃
┃                                     │                                     ┃
┃ ┌───────────────────────────────────▼───────────────────────────────────┐ ┃
┃ │                   BUSINESS LOGIC LAYER (Services)                     │ ┃
┃ │                                                                       │ ┃
┃ │  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────┐  │ ┃
┃ │  │  GeoServer       │  │   Map Service    │  │  Feature Service  │  │ ┃
┃ │  │  Service         │  │                  │  │                   │  │ ┃
┃ │  │                  │  │  • Map Init      │  │  • OL ↔ GeoJSON  │  │ ┃
┃ │  │  • WFS-T Insert  │  │  • Layers Setup  │  │  • Type Conv.    │  │ ┃
┃ │  │  • WFS-T Update  │  │  • Interactions  │  │  • Validation    │  │ ┃
┃ │  │  • WFS-T Delete  │  │  • Projections   │  │  • Formatting    │  │ ┃
┃ │  │  • WFS GetFeature│  │                  │  │                   │  │ ┃
┃ │  │                  │  │                  │  │                   │  │ ┃
┃ │  │  (206 LOC)       │  │  (101 LOC)       │  │  (57 LOC)         │  │ ┃
┃ │  └────────┬─────────┘  └──────────────────┘  └───────────────────┘  │ ┃
┃ └───────────┼────────────────────────────────────────────────────────────┘ ┃
┃             │                                                              ┃
┃ ┌───────────▼──────────────────────────────────────────────────────────┐ ┃
┃ │              MAPPING LIBRARY (OpenLayers 10.7.0)                     │ ┃
┃ │                                                                      │ ┃
┃ │  • Map Rendering            • Vector Layers      • WMS Integration  │ ┃
┃ │  • User Interactions        • Feature Styling   • Coordinate Trans  │ ┃
┃ └──────────────────────────────────────────────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                │
                       HTTP/HTTPS Requests
                    (WFS-T XML, WFS GetFeature,
                         WMS GetMap)
                                │
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                           GIS SERVER LAYER                               ┃
┃ ┌───────────────────────────────────────────────────────────────────────┐ ┃
┃ │                    GeoServer (Docker Container)                       │ ┃
┃ │                                                                       │ ┃
┃ │  ┌────────────────────┐           ┌────────────────────┐            │ ┃
┃ │  │   WFS 2.0.0        │           │   WMS 1.1.0        │            │ ┃
┃ │  │   (Transactional)  │           │   (Visualization)  │            │ ┃
┃ │  │                    │           │                    │            │ ┃
┃ │  │  • GetFeature      │           │  • GetMap          │            │ ┃
┃ │  │  • Transaction     │           │  • GetCapabilities │            │ ┃
┃ │  │    - Insert        │           │                    │            │ ┃
┃ │  │    - Update        │           │                    │            │ ┃
┃ │  │    - Delete        │           │                    │            │ ┃
┃ │  └─────────┬──────────┘           └──────────┬─────────┘            │ ┃
┃ └────────────┼─────────────────────────────────┼──────────────────────┘ ┃
┃              │                                  │                        ┃
┃ ┌────────────▼──────────────────────────────────▼──────────────────────┐ ┃
┃ │                     SPATIAL DATA STORE                                │ ┃
┃ │                                                                       │ ┃
┃ │  Workspace: waterDispensers                                          │ ┃
┃ │  Layer: water_dispensers                                             │ ┃
┃ │                                                                       │ ┃
┃ │  Schema:                                                             │ ┃
┃ │  ┌─────────────┬──────────┬────────────────────────────────┐        │ ┃
┃ │  │ Field       │ Type     │ Description                    │        │ ┃
┃ │  ├─────────────┼──────────┼────────────────────────────────┤        │ ┃
┃ │  │ geom        │ Point    │ Location (EPSG:4326)          │        │ ┃
┃ │  │ name        │ String   │ Dispenser identifier          │        │ ┃
┃ │  │ is_indoor   │ Boolean  │ Indoor/outdoor flag           │        │ ┃
┃ │  │ floor       │ String   │ Floor level                   │        │ ┃
┃ │  │ water_types │ String   │ Water types (comma-separated) │        │ ┃
┃ │  └─────────────┴──────────┴────────────────────────────────┘        │ ┃
┃ └───────────────────────────────────────────────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Data Flow Diagrams

### 1. CREATE Operation Flow

```
┌──────────┐    Click Map    ┌──────────┐   Capture     ┌──────────┐
│   User   │───────────────▶ │ MapView  │──Coordinates─▶│ App.vue  │
└──────────┘                 └──────────┘               └─────┬────┘
                                                               │
     ▲                                                         │
     │                                                         ▼
     │                                                  ┌─────────────┐
     │                                                  │ Dispenser   │
     │                            Fill Form Data        │    Form     │
     │                          ◀───────────────────────┤             │
     │                                                  └──────┬──────┘
     │                                                         │
     │                                                         │ Submit
     │                                                         ▼
     │                                                  ┌────────────┐
     │                                                  │  App.vue   │
     │                                                  │  Handler   │
     │                                                  └──────┬─────┘
     │                                                         │
     │                                                         │ WFS-T Insert
     │                                                         ▼
     │                                                  ┌────────────────┐
     │                                                  │   GeoServer    │
     │                                                  │    Service     │
     │                                                  └───────┬────────┘
     │                                                          │
     │                                                          │ HTTP POST
     │                                                          │ (WFS-T XML)
     │                                                          ▼
     │      Success                                      ┌─────────────┐
     │     Message      Refresh      Reload              │  GeoServer  │
     └──────────────────Map◀────────Source◀──────────────┤             │
                                     Update              └─────────────┘
```

### 2. READ Operation Flow

```
┌──────────┐   Page Load    ┌──────────┐   onMounted    ┌────────────┐
│   User   │───────────────▶│ App.vue  │───────────────▶│ loadFeatures()│
└──────────┘                └──────────┘                └──────┬─────┘
                                                               │
     ▲                                                         │
     │                                                         │ WFS GetFeature
     │                                                         ▼
     │                                                  ┌────────────────┐
     │                                                  │   GeoServer    │
     │                                                  │    Service     │
     │                                                  └───────┬────────┘
     │                                                          │
     │                                                          │ HTTP GET
     │                                                          │ (WFS Request)
     │                                                          ▼
     │                                                   ┌─────────────┐
     │         GeoJSON                                   │  GeoServer  │
     │        Response        Parse                      │             │
     │    ◀─────────────────────────────────────────────┤  Returns    │
     │                                                   │  GeoJSON    │
     │                                                   └─────────────┘
     ▼
┌──────────────────┐                           ┌──────────────────┐
│ DispenserList    │      Display Features     │    MapView       │
│   Component      │◀──────────────────────────│   (OpenLayers)   │
│                  │                           │                  │
│ • Feature List   │                           │ • Vector Layer   │
│ • Search/Filter  │                           │ • Map Markers    │
└──────────────────┘                           └──────────────────┘
```

### 3. UPDATE Operation Flow

```
┌──────────┐  Click Feature  ┌──────────┐  Feature ID   ┌──────────┐
│   User   │────────────────▶│ MapView  │──────────────▶│ App.vue  │
└──────────┘                 └──────────┘               └─────┬────┘
                                                               │
     ▲                                                         │
     │                                                         ▼
     │                                                  ┌─────────────┐
     │                                                  │ Load Feature│
     │                           Populate Form          │    Data     │
     │                          ◀───────────────────────┤             │
     │                                                  └──────┬──────┘
     │                                                         │
     │                                                         ▼
     │                                                  ┌────────────┐
     │                                                  │ Dispenser  │
     │                            Edit Data             │    Form    │
     │                          ◀───────────────────────┤  (EDIT)    │
     │                                                  └──────┬─────┘
     │                                                         │
     │                                                         │ Submit
     │                                                         ▼
     │                                                  ┌────────────┐
     │                                                  │  App.vue   │
     │                                                  │  Handler   │
     │                                                  └──────┬─────┘
     │                                                         │
     │                                                         │ WFS-T Update
     │                                                         ▼
     │                                                  ┌────────────────┐
     │                                                  │   GeoServer    │
     │                                                  │    Service     │
     │                                                  └───────┬────────┘
     │                                                          │
     │                                                          │ HTTP POST
     │                                                          │ (WFS-T XML)
     │                                                          ▼
     │      Success                                      ┌─────────────┐
     │     Message      Refresh      Reload              │  GeoServer  │
     └──────────────────Map◀────────Source◀──────────────┤   Updates   │
                                     Update              │   Record    │
                                                         └─────────────┘
```

### 4. DELETE Operation Flow

```
┌──────────┐ Delete Button  ┌────────────┐   Feature ID  ┌──────────┐
│   User   │───────────────▶│ Dispenser  │──────────────▶│ App.vue  │
└──────────┘                │    List    │               └─────┬────┘
                            └────────────┘                     │
     ▲                                                         │
     │                                                         │ WFS-T Delete
     │                                                         ▼
     │                                                  ┌────────────────┐
     │                                                  │   GeoServer    │
     │                                                  │    Service     │
     │                                                  └───────┬────────┘
     │                                                          │
     │                                                          │ HTTP POST
     │                                                          │ (WFS-T XML)
     │                                                          ▼
     │      Success                                      ┌─────────────┐
     │     Message      Refresh      Reload              │  GeoServer  │
     └──────────────────Map◀────────Source◀──────────────┤   Deletes   │
                                     Update              │   Record    │
                                                         └─────────────┘
```

## Technology Stack Details

### Frontend Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Vue.js 3.5.24                          │
│                   (Composition API)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            TypeScript 5.9.3                          │  │
│  │           (100% Type Safety)                         │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │       OpenLayers 10.7.0                        │  │  │
│  │  │      (Map Rendering Engine)                    │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         ┌──────▼──────┐        ┌──────▼──────┐
         │ Tailwind    │        │   Vite      │
         │ CSS 4.1.17  │        │   7.2.4     │
         │ (Styling)   │        │  (Build)    │
         └─────────────┘        └─────────────┘
```

### Backend/GIS Stack

```
┌─────────────────────────────────────────────────────────┐
│              GeoServer (Docker)                         │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  WFS 2.0.0       │      │   WMS 1.1.0      │       │
│  │  (Transactions)  │      │ (Visualization)  │       │
│  └──────────────────┘      └──────────────────┘       │
│                                                         │
│  Protocols:                                            │
│  • OGC Web Feature Service - Transactional            │
│  • OGC Web Map Service                                │
│  • GeoJSON, WKT, GML output formats                   │
└─────────────────────────────────────────────────────────┘
```

### Development Tools

```
┌─────────────────────────────────────────────────────────┐
│            Code Quality & Standards                     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ESLint 9.39.1                                   │  │
│  │  @dataport/eslint-config-geodev                  │  │
│  │                                                  │  │
│  │  Rules Enforced:                                 │  │
│  │  • No 'any' types (100% type safety)            │  │
│  │  • No console.log() in production               │  │
│  │  • Strict null checks                           │  │
│  │  • WCAG 2.1 AA compliance                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Service Layer Architecture

### GeoServer Service (geoserver.service.ts)

```typescript
┌────────────────────────────────────────────────────────┐
│         GeoServer Service (206 LOC)                    │
│                                                        │
│  loadFeatures()                                        │
│  ├─ Builds WFS GetFeature request                     │
│  ├─ Fetches GeoJSON from GeoServer                    │
│  └─ Returns Feature array                             │
│                                                        │
│  insertFeature(coordinates, properties)                │
│  ├─ Creates WFS-T Insert XML                          │
│  ├─ Sends POST request to GeoServer                   │
│  └─ Returns transaction result                        │
│                                                        │
│  updateFeature(featureId, coordinates, properties)     │
│  ├─ Creates WFS-T Update XML                          │
│  ├─ Includes filter by feature ID                     │
│  └─ Returns transaction result                        │
│                                                        │
│  deleteFeature(featureId)                              │
│  ├─ Creates WFS-T Delete XML                          │
│  ├─ Includes filter by feature ID                     │
│  └─ Returns transaction result                        │
└────────────────────────────────────────────────────────┘
```

### Map Service (map.service.ts)

```typescript
┌────────────────────────────────────────────────────────┐
│          Map Service (101 LOC)                         │
│                                                        │
│  createMap(target, vectorSource)                       │
│  ├─ Initializes OpenLayers Map                        │
│  ├─ Adds OSM base layer                               │
│  ├─ Adds WMS layer from GeoServer                     │
│  ├─ Adds Vector layer for features                    │
│  ├─ Configures map view (center, zoom)                │
│  └─ Returns Map instance                              │
│                                                        │
│  addClickHandler(map, callback)                        │
│  ├─ Registers map click event                         │
│  ├─ Extracts coordinates                              │
│  ├─ Transforms to EPSG:4326                           │
│  └─ Invokes callback with coordinates                 │
│                                                        │
│  addSelectInteraction(map, callback)                   │
│  ├─ Creates Select interaction                        │
│  ├─ Configures feature selection                      │
│  └─ Triggers callback on feature select               │
└────────────────────────────────────────────────────────┘
```

### Feature Service (feature.service.ts)

```typescript
┌────────────────────────────────────────────────────────┐
│         Feature Service (57 LOC)                       │
│                                                        │
│  olFeatureToFormData(olFeature)                        │
│  ├─ Extracts properties from OL Feature               │
│  ├─ Gets geometry coordinates                         │
│  ├─ Converts to form data structure                   │
│  └─ Returns DispenserFormData                         │
│                                                        │
│  createFeatureSummary(feature)                         │
│  ├─ Extracts essential properties                     │
│  ├─ Formats for list display                          │
│  └─ Returns FeatureSummary                            │
│                                                        │
│  formatWaterTypes(waterTypes)                          │
│  ├─ Parses comma-separated string                     │
│  ├─ Formats for display                               │
│  └─ Returns formatted string                          │
└────────────────────────────────────────────────────────┘
```

## Component Communication

```
┌──────────────────────────────────────────────────────────────────┐
│                          App.vue (Root)                          │
│                                                                  │
│  State:                                                          │
│  • map: Map | null                                               │
│  • vectorSource: VectorSource                                    │
│  • featureList: Ref<FeatureSummary[]>                           │
│  • form: Ref<DispenserFormData>                                 │
│  • selectedFeatureId: Ref<string | null>                        │
│  • isEditMode: Ref<boolean>                                     │
└────┬────────────────────┬────────────────────┬─────────────┬────┘
     │                    │                    │             │
     │ Props: None        │ Props: map,        │ Props:      │ Props:
     │ Events: None       │   vectorSource     │   form,     │   features
     │                    │ Events: ready      │   isEditMode│ Events:
     ▼                    ▼                    │ Events:     │   select,
┌──────────┐      ┌────────────┐              │   submit,   │   delete
│AppHeader │      │  MapView   │              │   cancel    ▼
│          │      │            │              ▼        ┌────────────┐
│          │      │ • Map      │        ┌──────────┐  │ Dispenser  │
│          │      │ • Layers   │        │Dispenser │  │    List    │
│          │      │ • Click    │        │   Form   │  │            │
│          │      │ • Select   │        │          │  │ • Search   │
└──────────┘      └────────────┘        └──────────┘  │ • Display  │
                                                       └────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Development Environment                     │
│                                                                  │
│  ┌──────────────────────┐        ┌─────────────────────────┐   │
│  │   Vite Dev Server    │        │   Docker Compose        │   │
│  │   localhost:5173     │◀──────▶│                         │   │
│  │                      │  HTTP  │   ┌─────────────────┐   │   │
│  │   • Hot Reload       │        │   │   GeoServer     │   │   │
│  │   • Source Maps      │        │   │   Port: 8080    │   │   │
│  │   • TypeScript       │        │   │                 │   │   │
│  │   • Vue SFC          │        │   │   Workspace:    │   │   │
│  └──────────────────────┘        │   │   water...      │   │   │
│                                  │   └─────────────────┘   │   │
│                                  │                         │   │
│                                  │   ┌─────────────────┐   │   │
│                                  │   │   PostgreSQL    │   │   │
│                                  │   │   PostGIS       │   │   │
│                                  │   │   (Optional)    │   │   │
│                                  │   └─────────────────┘   │   │
│                                  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Production Environment                       │
│                                                                  │
│  ┌──────────────────────┐        ┌─────────────────────────┐   │
│  │   Web Server         │        │   GeoServer Instance    │   │
│  │   (Nginx/Apache)     │◀──────▶│                         │   │
│  │                      │  HTTP  │   • Production Config   │   │
│  │   Serves:            │        │   • Optimized Layers   │   │
│  │   • index.html       │        │   • Security Rules     │   │
│  │   • *.js bundles     │        │   • CORS Enabled       │   │
│  │   • *.css            │        │                         │   │
│  │   • assets/          │        └─────────────────────────┘   │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Security & Performance Considerations

```
┌────────────────────────────────────────────────────────────┐
│                    Security Measures                        │
│                                                            │
│  • CORS configuration on GeoServer                        │
│  • Input validation on all form fields                    │
│  • Type safety with TypeScript (no 'any')                 │
│  • XSS prevention via Vue's template escaping             │
│  • Coordinate validation before WFS-T operations          │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 Performance Optimizations                   │
│                                                            │
│  • Vector source caching for features                     │
│  • Debounced search functionality                         │
│  • Lazy loading of map tiles                              │
│  • Minified production bundles                            │
│  • Tree-shaking unused code                               │
│  • Efficient Vue reactivity (ref/reactive)                │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 Accessibility Features                      │
│                                                            │
│  • WCAG 2.1 Level AA compliant                            │
│  • Semantic HTML structure                                │
│  • ARIA labels on interactive elements                    │
│  • Keyboard navigation support                            │
│  • Screen reader compatible                               │
│  • Sufficient color contrast (4.5:1 minimum)              │
└────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. **Component-Based Architecture**
   - **Decision**: Separate UI into reusable Vue components
   - **Rationale**: Improves maintainability, testability, and code reuse
   - **Components**: AppHeader, MapView, DispenserForm, DispenserList

### 2. **Service Layer Pattern**
   - **Decision**: Extract business logic into service modules
   - **Rationale**: Separation of concerns, easier testing, reusability
   - **Services**: GeoServer, Map, Feature services

### 3. **Centralized State Management**
   - **Decision**: Manage state in App.vue using Vue Composition API
   - **Rationale**: Simple enough for this app, avoids Pinia/Vuex overhead
   - **State**: map, vectorSource, featureList, form, selectedFeatureId

### 4. **TypeScript for Type Safety**
   - **Decision**: 100% TypeScript, zero 'any' types
   - **Rationale**: Compile-time error detection, better IDE support
   - **Types**: DispenserFeature, DispenserFormData, FeatureSummary

### 5. **WFS-T for Data Persistence**
   - **Decision**: Use GeoServer's WFS-T for CRUD operations
   - **Rationale**: Standard OGC protocol, transactional support
   - **Operations**: Insert, Update, Delete via XML transactions

### 6. **OpenLayers for Mapping**
   - **Decision**: OpenLayers over Leaflet/MapLibre
   - **Rationale**: Better WFS-T integration, WMS support, proj4 included
   - **Features**: Vector layers, interactions, coordinate transformations

## System Metrics

```
┌──────────────────────────────────────────────────────────┐
│                   Codebase Statistics                     │
│                                                          │
│  Total Lines of Code:        1,217 LOC                  │
│  Components:                 4 files (569 LOC)          │
│  Services:                   3 files (364 LOC)          │
│  Types & Constants:          2 files (45 LOC)           │
│                                                          │
│  TypeScript Coverage:        100%                       │
│  'any' Type Usage:           0                          │
│  ESLint Violations:          0                          │
│                                                          │
│  Dependencies:               12 packages                │
│  Dev Dependencies:           11 packages                │
│  Total Package Size:         ~150 MB (with node_modules)│
└──────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** December 4, 2025  
**Maintainer:** GIS Development Team

