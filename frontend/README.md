# Creative Pilot - Retail Media Creative Tool

Creative Pilot is an AI-powered design tool built for the Tesco Hackathon. It empowers advertisers to create professional, guideline-compliant creatives with ease, leveraging Generative AI for background generation and asset management.

## 🚀 Key Features

### 🎨 Advanced UI/UX
- **Premium Glassmorphism**: A modern, sleek interface with frosted glass effects, subtle noise textures, and refined borders.
- **Dynamic Backgrounds**: The application background automatically adapts to the color palette of the selected image using `colorthief`, creating an immersive experience.
- **Sidebar Navigation**: Intuitive navigation for Assets, Templates, and Brand Kit.
- **Interactive Elements**: Smooth hover effects, tooltips, and animations powered by Tailwind CSS.

### 🤖 AI & Asset Management
- **Asset Library**: Upload, manage, and select creative assets.
- **AI Background Generation**: Generate unique backgrounds using the FLUX.1 model via the backend API.
- **Background Removal**: One-click background removal for uploaded assets.
- **Smart Upload**: Drag-and-drop interface with progress indicators.

### ✏️ Canvas Editor
- **Fabric.js Integration**: Robust canvas for composing images and text.
- **Text Manipulation**: Add and edit text layers with custom fonts and styling.
- **Parallax Effect**: Subtle mouse-tracking parallax effect on the background.

### 🛠️ Technical Highlights
- **Frontend**: React, Vite, Tailwind CSS, Radix UI, Lucide React.
- **Backend**: FastAPI (Python) for AI processing and file management.
- **Error Handling**: Global Error Boundary to catch and display runtime errors gracefully.
- **Code Quality**: Linted codebase with optimized component structure (e.g., `button-variants.js`).

## 📦 Project Structure

- **frontend/**: React application
  - `src/components/`: Reusable UI components (`GlassPanel`, `CanvasEditor`, `AssetManager`).
  - `src/lib/`: Utility functions (`color-utils.js`, `utils.js`).
  - `src/App.jsx`: Main application layout and logic.
- **backend/**: FastAPI server
  - `main.py`: API endpoints and server configuration.
  - `app/routers/`: Route handlers for creative operations.

## 🏃‍♂️ Getting Started

1.  **Start the Backend**:
    ```bash
    cd backend
    source venv/bin/activate
    uvicorn main:app --reload --port 8000
    ```

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

3.  **Open the App**:
    Visit [http://localhost:5173](http://localhost:5173) in your browser.

## ✅ Recent Updates
- Implemented **Dynamic Backgrounds** with cache-busting for instant updates.
- Fixed **"Maximum update depth exceeded"** crash in Asset Manager.
- Resolved all **ESLint errors** for a clean production build.
- Enhanced **Glassmorphism** with noise textures and premium shadows.
