# 🎨 CreativePilot AI - Retail Media Creative Builder

> **AI-Powered Creative Studio for Retail Media** | Built for the Tesco Retail Media Hackathon

CreativePilot is a next-generation creative builder that combines the power of **Generative AI** with a professional **Figma-like editing experience**. Designed specifically for retail media advertisers, it enables rapid creation of guideline-compliant, brand-consistent creatives at scale.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Use Cases](#-use-cases)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Detailed Setup](#-detailed-setup)
- [🎨 Usage Guide](#-usage-guide)
- [🔌 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎨 **Professional Creative Editor**

#### **3-Column Layout**
- **Left Sidebar**: Asset library, AI generation tools, brand kit
- **Center Canvas**: High-fidelity Fabric.js canvas with smart auto-scaling
- **Right Sidebar**: Context-aware properties, layers management, brand controls

#### **Fabric.js Canvas Engine**
- Full support for text, images, shapes, and complex compositions
- Real-time object manipulation (drag, resize, rotate, scale)
- Multi-object selection and grouping
- Undo/Redo support (coming soon)

#### **Smart Responsive Scaling**
- Automatically adapts canvas view to fit any screen size
- Maintains aspect ratios for accurate preview
- Zoom indicator shows current scale percentage

---

### 🧠 **Generative AI Integration**

#### **AI Background Generation**
- Powered by **FLUX.1-dev** via HuggingFace Inference API (Nebius provider)
- Generate unique, high-quality backgrounds from text prompts
- Examples:
  - "Futuristic retail store with neon lights, photorealistic, 8k"
  - "Minimalist studio background, soft gradient, professional"
  - "Abstract geometric pattern, vibrant colors, modern"

#### **Background Removal**
- One-click background removal using `rembg` library
- Perfect for product photography and asset preparation
- Preserves transparency for layering

---

### 🛠️ **Advanced Creative Tools**

#### **Brand Kit Panel** 🎨
Persist your brand identity across sessions with localStorage-backed brand management:

- **Brand Colors**
  - Add/remove custom colors with color picker
  - Visual swatch display
  - Apply colors to selected canvas objects
  - Persisted to `localStorage`

- **Brand Fonts**
  - Curated Google Fonts library (Inter, Roboto, Poppins, Montserrat, Lato, Open Sans, Playfair Display)
  - Add/remove fonts from your brand kit
  - Apply fonts to selected text objects

- **Brand Logo**
  - Upload and store brand logo
  - Preview in Brand Kit panel
  - One-click insertion to canvas
  - Persisted as base64 in `localStorage`

#### **Layers Panel** 📚
Full layer management system synced with Fabric.js canvas:

- **Layer List**
  - Real-time sync with canvas objects
  - Visual thumbnails and type indicators (Text, Image, Shape)
  - Click to select layer on canvas

- **Layer Controls**
  - **Visibility Toggle**: Show/hide layers (Eye icon)
  - **Lock/Unlock**: Prevent accidental modifications
  - **Delete**: Remove layers from composition
  - **Reorder**: Drag-and-drop layer ordering (coming soon)

#### **Properties Panel** ⚙️
Context-aware editing based on selected object:

**Text Properties**
- Font family dropdown (Google Fonts)
- Font size slider
- Color picker
- Text styling: Bold, Italic, Underline
- Alignment: Left, Center, Right
- Letter spacing slider
- Line height slider

**Image Properties**
- Brightness filter (-100% to +100%)
- Contrast filter (-100% to +100%)
- Blur filter (0% to 100%)

**Canvas Settings** (when no object selected)
- Width/Height inputs
- Preset formats:
  - 1080x1080 (Instagram Square)
  - 1080x1920 (Instagram Story)
  - 1200x628 (Facebook/LinkedIn)
- Background color picker
- Scale objects on resize toggle

---

### 🎯 **Draggable Floating Toolbar**

- **Repositionable**: Drag anywhere on the canvas
- **Bottom-Centered**: Default position for easy access
- **Quick Actions**:
  - Format presets (Instagram, Story, Banner)
  - Undo/Redo
  - Add Text
  - AI Layout (coming soon)
  - Validate Guidelines
  - Export PNG

---

## 🎯 Use Cases

1. **Retail Product Ads**: Generate backgrounds, add product images, overlay text
2. **Social Media Posts**: Quick Instagram/Facebook post creation with brand consistency
3. **Banner Ads**: Multi-format banner generation for display advertising
4. **Brand Templates**: Create reusable templates with saved brand kits
5. **A/B Testing**: Rapidly generate creative variations for testing

---

## 🏗️ Architecture

### **Frontend Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Asset Manager│  │ Canvas Editor│  │ Right Sidebar│  │
│  │              │  │              │  │              │  │
│  │ - Upload     │  │ - Fabric.js  │  │ - Properties │  │
│  │ - AI Gen     │  │ - Layers     │  │ - Layers     │  │
│  │ - Library    │  │ - Selection  │  │ - Brand Kit  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│              Zustand Store (State Management)            │
│  - Creative State  - Brand Kit  - Layers  - Settings    │
└─────────────────────────────────────────────────────────┘
```

### **Backend Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Server                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │              API Routers                          │   │
│  │  /api/creative/upload                            │   │
│  │  /api/creative/generate-bg                       │   │
│  │  /api/creative/remove-bg                         │   │
│  │  /api/creative/validate                          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Services Layer                       │   │
│  │  - Image Processing (Flux, rembg)               │   │
│  │  - Guideline Validation                          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| Tailwind CSS | 3.4.18 | Styling |
| Fabric.js | 6.9.0 | Canvas Engine |
| Zustand | 5.0.9 | State Management |
| Radix UI | Latest | Headless UI Components |
| Lucide React | 0.555.0 | Icon Library |
| Axios | 1.13.2 | HTTP Client |
| React Query | 5.90.12 | Server State |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | Latest | Web Framework |
| Python | 3.8+ | Runtime |
| HuggingFace Hub | Latest | AI Inference |
| Pillow (PIL) | Latest | Image Processing |
| rembg | Latest | Background Removal |
| python-multipart | Latest | File Uploads |

---

## 🚀 Quick Start

### **One-Command Setup** (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd tesco

# Start backend (Terminal 1)
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Start frontend (Terminal 2)
cd frontend && npm install && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📖 Detailed Setup

### **Prerequisites**

- **Node.js**: v16+ ([Download](https://nodejs.org/))
- **Python**: v3.8+ ([Download](https://www.python.org/))
- **HuggingFace Token**: [Get your token](https://huggingface.co/settings/tokens)

### **Backend Setup**

#### 1. Navigate to backend directory
```bash
cd backend
```

#### 2. Create virtual environment
```bash
python -m venv venv
```

#### 3. Activate virtual environment
```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

#### 4. Install dependencies
```bash
pip install -r requirements.txt
```

#### 5. Configure environment variables

Create a `.env` file in the `backend` directory:

```env
# Required: HuggingFace API Token
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Gemini API Key (for future features)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get HuggingFace Token:**
1. Go to [HuggingFace Settings](https://huggingface.co/settings/tokens)
2. Create a new token with "Read" access
3. Copy and paste into `.env`

#### 6. Start the server
```bash
uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### 7. Verify backend is running
Open `http://127.0.0.1:8000/docs` to see the interactive API documentation.

---

### **Frontend Setup**

#### 1. Navigate to frontend directory
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start development server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.2.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 4. Open in browser
Navigate to `http://localhost:5173`

---

## 🎨 Usage Guide

### **1. Upload Assets**

1. Click the **Upload** area in the left sidebar
2. Drag and drop images or click to browse
3. Uploaded assets appear in the **Library** section
4. Click any asset to add it to the canvas

### **2. Generate AI Backgrounds**

1. Navigate to the **AI Generation** section in the left sidebar
2. Enter a descriptive prompt (e.g., "sunset gradient background")
3. Click **Generate Background**
4. Wait for generation (5-10 seconds)
5. Generated image appears in your library
6. Click to add to canvas

### **3. Add and Edit Text**

1. Click **Text** button in the floating toolbar
2. Text object appears on canvas
3. Double-click to edit text content
4. Select text object to show **Properties Panel**
5. Adjust font, size, color, spacing, alignment

### **4. Manage Layers**

1. Open **Layers** tab in right sidebar
2. See all canvas objects listed
3. Click layer to select on canvas
4. Use eye icon to hide/show
5. Use lock icon to prevent editing
6. Click trash icon to delete

### **5. Build Your Brand Kit**

1. Open **Brand** tab in right sidebar
2. **Add Colors**: Click + button, choose color
3. **Add Fonts**: Select from dropdown
4. **Upload Logo**: Click upload area
5. All changes persist to localStorage

### **6. Export Your Creative**

1. Click **Export** in the floating toolbar
2. PNG file downloads automatically
3. File includes all visible layers at canvas resolution

---

## 🔌 API Reference

### **Base URL**
```
http://127.0.0.1:8000/api/creative
```

### **Endpoints**

#### **Upload Asset**
```http
POST /upload
Content-Type: multipart/form-data

Body:
  file: <image file>

Response:
{
  "filename": "image.png",
  "url": "/static/image.png"
}
```

#### **Generate Background**
```http
POST /generate-bg
Content-Type: multipart/form-data

Body:
  prompt: "futuristic retail store"

Response:
{
  "url": "/static/ai_gen_uuid.png",
  "name": "ai_gen_uuid.png"
}
```

#### **Remove Background**
```http
POST /remove-bg
Content-Type: multipart/form-data

Body:
  image_url: "/static/image.png"

Response:
{
  "url": "/static/no_bg_image.png"
}
```

---

## 🧪 Testing

### **Test AI Generation**

```bash
cd backend
source venv/bin/activate
python test_flux_real.py
```

Expected output:
```
Token: hf_NM...
Generating image...
Success! Saved to static/test_flux_real.png
```

---

## 📂 Project Structure

```
tesco/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   └── creative.py          # API endpoints
│   │   └── services/
│   │       └── image_processing.py  # AI & image logic
│   ├── static/                      # Generated/uploaded assets
│   ├── main.py                      # FastAPI app entry
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables
│   └── test_flux_real.py            # AI generation test
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx           # Main 3-column layout
│   │   │   │   └── FloatingToolbar.jsx     # Draggable toolbar
│   │   │   ├── panels/
│   │   │   │   ├── BrandKitPanel.jsx       # Brand management
│   │   │   │   ├── LayersPanel.jsx         # Layer tree
│   │   │   │   └── PropertiesPanel.jsx     # Context properties
│   │   │   ├── ui/
│   │   │   │   ├── button.jsx
│   │   │   │   ├── slider.jsx
│   │   │   │   └── ...                     # Shadcn components
│   │   │   ├── AssetManager.jsx            # Upload & AI gen
│   │   │   └── CanvasEditor.jsx            # Fabric.js canvas
│   │   ├── store/
│   │   │   └── useCreativeStore.js         # Zustand store
│   │   ├── lib/
│   │   │   └── utils.js                    # Utilities
│   │   ├── App.jsx                         # App root
│   │   ├── main.jsx                        # React entry
│   │   └── index.css                       # Global styles
│   ├── public/                             # Static assets
│   ├── package.json                        # Node dependencies
│   ├── vite.config.js                      # Vite config
│   └── tailwind.config.js                  # Tailwind config
│
└── README.md                               # This file
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### **Code Style**
- Frontend: ESLint + Prettier
- Backend: Black + isort
- Commit messages: Conventional Commits

---

## 📄 License

This project was built for the **Tesco Retail Media Hackathon**.

---

## 🙏 Acknowledgments

- **Tesco** for the hackathon opportunity
- **HuggingFace** for FLUX.1-dev model access
- **Fabric.js** community for the amazing canvas library
- **Shadcn UI** for beautiful component primitives

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for Retail Media Innovation**
