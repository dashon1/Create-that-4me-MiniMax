# DAT 4ME - AI-Powered Content Creation Pipeline

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Supabase-2.78+-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase">
</p>

DAT 4ME is a comprehensive **AI-Powered Content Creation Pipeline** designed to help users create, manage, and deliver marketing content projects through an intelligent workflow system. The platform features an "AI Emergence" theme with futuristic AI concepts like robot awakening, neural networks, digital consciousness, and cyborg characters.

![DAT 4ME Dashboard](https://via.placeholder.com/1200x600?text=DAT+4ME+Dashboard)

## ✨ Features

### 🎨 AI Content Generator
- **Image Generation**: Create AI images with style controls (Cinematic, Artistic, Realistic)
- **Quality Levels**: Draft, Standard, High Quality
- **Video Generation**: Text-to-video and image-to-video capabilities
- **Real-time Processing**: Status updates during generation
- **Content Library**: Automatic saving to your content library

### 📊 Project Management
- Create and manage multiple projects
- Project types: Marketing, Branding, Content Creation
- Progress tracking with workflow stages
- Budget and deadline management
- Team collaboration features

### 🔄 Workflow Automation
- Visual workflow timeline
- Stage progression: Briefing → Planning → Content Creation → Review → Delivery
- Task tracking and assignment
- Automated stage transitions
- Progress analytics

### 👥 Team Collaboration
- Invite team members to projects
- Role-based permissions (Owner, Designer, Manager, Viewer)
- Activity tracking and contribution metrics
- Real-time collaboration features

### 📁 Assets Management
- Centralized media library
- Categories: Images, Videos, Documents, Audio
- File upload and organization
- Tagging and search functionality

### 📈 Analytics
- Project performance metrics
- Team productivity insights
- Content generation statistics
- Budget utilization tracking

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| TailwindCSS | Styling |
| Radix UI | UI components |
| React Router | Navigation |
| Recharts | Data visualization |
| Supabase | Backend-as-a-Service |

## 🏗️ Architecture

```
Frontend (React)
    ↓
Supabase Client
    ↓
Edge Functions (Deno)
    ↓
AI Services (External APIs)
    ↓
Supabase Storage
    ↓
PostgreSQL (Database)
```

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Supabase account (for backend)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/dashon1/Create-that-4me-MiniMax.git

# Navigate to the project directory
cd dat4me-comprehensive

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project credentials
3. Update the Supabase client configuration:

```typescript
// src/lib/supabase.ts
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Pages

| Page | Description |
|------|-------------|
| Dashboard | Overview metrics and quick actions |
| Projects | Create and manage projects |
| Assets | Media library management |
| Analytics | Performance insights |
| Team | Team collaboration |
| Settings | User preferences |

## 🔌 API Endpoints

### AI Image Generator
```
POST /functions/v1/ai-image-generator
{
  "prompt": "AI robot awakening in a futuristic lab",
  "style": "cinematic",
  "quality": "standard"
}
```

### AI Video Generator
```
POST /functions/v1/ai-video-generator
{
  "prompt": "Digital consciousness emerging",
  "duration": 5
}
```

### Content Manager
```
POST /functions/v1/content-manager
{
  "action": "get_recent_content",
  "assetType": "image"
}
```

## 🎨 AI Emergence Theme

The application embraces a futuristic AI aesthetic throughout:

- **Dark mode** primary interface
- **Glowing accent colors**: Cyan, Purple, Blue
- **Neural network** visual motifs
- **Digital consciousness** themes
- **Professional yet futuristic** typography

### Sample Prompts

**Image Generation:**
- "AI robot awakening in a futuristic lab"
- "Neural network visualization"
- "Digital consciousness emerging"
- "Cyborg character portrait"

**Video Generation:**
- "AI entity coming to life"
- "Digital transformation sequence"
- "Consciousness awakening"
- "Futuristic AI interface"

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

<p align="center">Built with ❤️ using React + Supabase</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=dashon1&repo=Create-that-4me-MiniMax&style=flat-square" alt="Profile views">
</p>
