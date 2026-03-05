# RidgeRestore - AI-Powered Fingerprint Restoration

![RidgeRestore Banner](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)

## 📋 Overview

**RidgeRestore** is an advanced AI-powered web application designed for forensic professionals, law enforcement, and security specialists to restore degraded, partial, or low-quality fingerprint images. Using state-of-the-art deep learning models, the application enhances ridge details in damaged fingerprints, making them suitable for biometric analysis and forensic investigation.

The application processes **TIFF (Tagged Image File Format)** fingerprint images uploaded by users, applies AI-driven enhancement algorithms, and delivers restored images with significantly improved ridge clarity and definition—all processed locally within your browser for maximum security and privacy.

---

## ✨ Key Features

- **🤖 AI-Powered Ridge Enhancement**: Uses TensorFlow-based generative models for intelligent fingerprint restoration
- **🖼️ TIFF Format Support**: Optimized for standard forensic fingerprint formats
- **⚡ Real-time Processing**: Fast client-side to server processing with live progress indicators
- **🔒 Privacy-First**: Sensitive biometric data never leaves your infrastructure
- **🎯 Before/After Comparison**: Side-by-side view of original and restored fingerprints
- **📥 Direct Downloads**: Export restored fingerprints as high-quality PNG images
- **🌐 Modern Web UI**: Clean, intuitive interface built with React and shadcn/ui
- **📱 Responsive Design**: Works seamlessly on desktop and tablet devices
- **🚀 Production Ready**: Full-stack application ready for enterprise deployment

---

## 🏗️ Technology Stack

### Frontend
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript for reliability
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide Icons** - Beautiful, consistent icon set
- **React Router** - Client-side routing

### Backend
- **Python 3.8+** - Core backend language
- **Flask** - Lightweight web framework for REST API
- **TensorFlow/Keras** - Deep learning framework for AI models
- **NumPy** - Numerical computing for image processing
- **Pillow (PIL)** - Python Imaging Library for image manipulation
- **Flask-CORS** - Cross-Origin Resource Sharing support

### DevOps & Deployment
- **Docker** - Containerization for consistent deployments
- **Railway** - Cloud hosting for backend
- **Vercel** - Hosting for frontend (optional)
- **Git** - Version control

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Python 3.8+** ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))
- **npm** or **yarn** (comes with Node.js)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/FingerprintRestoration.git
cd FingerprintRestoration
```

#### 2. Frontend Setup

```bash
# Install Node dependencies
npm install

# Create .env.local for local development
echo "VITE_API_URL=http://localhost:5000" > .env.local
```

#### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Return to root directory
cd ..
```

#### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
python app.py
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Server runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser to access the application.

---

## 🎯 How to Use

1. **Upload a TIFF Image**
   - Click the upload area or drag & drop a TIFF fingerprint image
   - Maximum file size: 20MB
   - Supported formats: `.tif`, `.tiff`

2. **Process the Image**
   - The backend processes the image through the AI model
   - Live progress bar shows processing status
   - Typical processing time: 2-5 seconds

3. **View Results**
   - Original and restored images shown side-by-side
   - Use zoom controls to inspect ridge details
   - Switch between original, restored, and comparison views

4. **Download**
   - Download the restored image as PNG
   - Download the original converted image if needed

---

## 🔌 API Documentation

### POST `/restore`

Restores a fingerprint image using the AI model.

**Request:**
```
Content-Type: multipart/form-data

file: <TIFF image file>
```

**Response:**
```json
{
  "original": "data:image/png;base64,iVBORw0KGgo...",
  "restored": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Status Codes:**
- `200` - Success
- `400` - No file uploaded
- `500` - Server error

**Example Request (cURL):**
```bash
curl -X POST \
  -F "file=@fingerprint.tiff" \
  http://localhost:5000/restore
```

---

## 📁 Project Structure

```
FingerprintRestoration/
├── src/
│   ├── components/
│   │   ├── FileUploader.tsx        # TIFF file upload component
│   │   ├── RestorePanel.tsx        # Main restoration UI
│   │   ├── RestoredOutput.tsx      # Results display & comparison
│   │   ├── NavLink.tsx             # Navigation components
│   │   └── ui/                     # shadcn/ui components
│   ├── hooks/
│   │   ├── useAuth.ts              # Authentication logic
│   │   └── use-mobile.tsx          # Mobile detection hook
│   ├── lib/
│   │   ├── firebase.ts             # Firebase config
│   │   ├── fingerprintProcessor.ts # Image processing utilities
│   │   └── utils.ts                # Helper functions
│   ├── pages/
│   │   ├── Index.tsx               # Home/landing page
│   │   └── NotFound.tsx            # 404 page
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── backend/
│   ├── app.py                      # Flask application
│   ├── generator__model.h5         # Pre-trained ML model
│   └── requirements.txt            # Python dependencies
├── public/
│   └── robots.txt                  # SEO robots
├── package.json                    # Node dependencies
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind CSS config
├── vite.config.ts                  # Vite config
└── README.md                       # This file
```

---

## 🚀 Deployment

### Backend Deployment (Railway)

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy on Railway**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set root directory to `/backend`
   - Start command: `pip install -r requirements.txt && python app.py`
   - Railway will provision your backend URL (e.g., `https://your-app.railway.app`)

3. **Configure Environment Variables**
   - Set `PORT=5000` in Railway dashboard

### Frontend Deployment (Vercel)

1. **Create `.env.production`**
   ```
   VITE_API_URL=https://your-backend-railway-url
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Vercel auto-deploys on push to main branch

3. **Alternative Hosting**
   - **Netlify**: Drag & drop `dist/` folder
   - **GitHub Pages**: Add to workflow (requires API proxy)

### Docker Deployment (Optional)

Build and run in Docker:

```bash
# Backend
cd backend
docker build -t fingerprint-restore-backend .
docker run -p 5000:5000 fingerprint-restore-backend

# Frontend
docker build -t fingerprint-restore-frontend .
docker run -p 3000:80 fingerprint-restore-frontend
```

---

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local or .env.production):**
```
VITE_API_URL=http://localhost:5000  # For development
VITE_API_URL=https://api.yourdomain.com  # For production
```

**Backend (Set in deployment platform):**
```
PORT=5000
FLASK_ENV=production
MODEL_PATH=generator__model.h5
```

---

## 🛠️ Development

### Building for Production

```bash
# Frontend build
npm run build

# Output: dist/ folder ready for deployment
```

### Running Tests

```bash
npm run test          # Run tests once
npm run test:watch   # Run tests in watch mode
```

### Code Quality

```bash
npm run lint  # Check code with ESLint
```

---

## 📊 Performance Considerations

- **Model Size**: The TensorFlow model (~200MB) is loaded once on backend startup
- **Processing Time**: 2-5 seconds per fingerprint on standard hardware
- **Memory**: Recommends 2GB+ RAM for backend
- **GPU Support**: Optional CUDA support for faster processing on GPU-enabled servers

---

## 🔒 Security & Privacy

- ✅ **Client-First Processing**: Initial validation happens in browser
- ✅ **No Data Logging**: Processed images are not stored or logged
- ✅ **HTTPS Required**: All production deployments must use HTTPS
- ✅ **CORS Restricted**: Backend only accepts requests from authorized domains
- ✅ **Input Validation**: All file uploads validated for size and type

---

## 🐛 Troubleshooting

### Backend won't start: `ModuleNotFoundError`
```bash
# Ensure virtual environment is activated
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Model file not found: `FileNotFoundError`
```bash
# Verify generator__model.h5 exists in backend/
ls backend/generator__model.h5

# If missing, ensure it's in Git LFS or download separately
```

### Frontend can't reach backend
```bash
# Check VITE_API_URL in .env.local
cat .env.local

# Verify backend is running on port 5000
curl http://localhost:5000/restore
```

### CORS errors in browser console
```
# Update backend app.py with your frontend domain
CORS(app, origins=["https://yourdomain.com"])
```

---

## 📈 Roadmap

- [ ] Batch processing for multiple images
- [ ] Image format conversion (JPG, PNG to TIFF)
- [ ] Advanced enhancement parameters (contrast, brightness controls)
- [ ] Processing history and results storage
- [ ] Mobile app (iOS/Android)
- [ ] GPU acceleration support
- [ ] API authentication and rate limiting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, please:
- Open an issue on GitHub
- Contact: support@yourdomain.com
- Documentation: [Wiki](https://github.com/yourusername/FingerprintRestoration/wiki)

---

## 🙏 Acknowledgments

- TensorFlow team for the deep learning framework
- shadcn/ui for beautiful component library
- Vite team for excellent build tooling
- Flask team for lightweight web framework

---

**Built with ❤️ for forensic professionals and security specialists.**
