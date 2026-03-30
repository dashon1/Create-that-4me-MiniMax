import { useState } from 'react'
import { Wand2, Image as ImageIcon, Video, Music, Loader2 } from 'lucide-react'
import { api } from '../lib/supabase'
import { SafeImage } from './SafeImage'

export function AIContentGenerator() {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio'>('video')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{ url: string; type: string; provider?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openaiApiKey, setOpenaiApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || ''
  })
  
  // Video-specific state
  const [videoProvider, setVideoProvider] = useState<string>('auto')
  const [videoDuration, setVideoDuration] = useState<number>(8)
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [videoResolution, setVideoResolution] = useState<'720p' | '1080p'>('1080p')
  const [kieAiApiKey, setKieAiApiKey] = useState<string>(() => {
    return localStorage.getItem('kie_ai_api_key') || ''
  })
  const [falAiApiKey, setFalAiApiKey] = useState<string>(() => {
    return localStorage.getItem('fal_ai_api_key') || ''
  })
  const [runwayApiKey, setRunwayApiKey] = useState<string>(() => {
    return localStorage.getItem('runway_api_key') || ''
  })
  const [googleVeoApiKey, setGoogleVeoApiKey] = useState<string>(() => {
    return localStorage.getItem('google_veo_api_key') || ''
  })
  const [openaiSoraApiKey, setOpenaiSoraApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_sora_api_key') || ''
  })

  // Save API keys to localStorage
  const handleKieAiKeyChange = (value: string) => {
    setKieAiApiKey(value)
    localStorage.setItem('kie_ai_api_key', value)
  }
  
  const handleFalAiKeyChange = (value: string) => {
    setFalAiApiKey(value)
    localStorage.setItem('fal_ai_api_key', value)
  }
  
  const handleRunwayKeyChange = (value: string) => {
    setRunwayApiKey(value)
    localStorage.setItem('runway_api_key', value)
  }
  
  const handleGoogleVeoKeyChange = (value: string) => {
    setGoogleVeoApiKey(value)
    localStorage.setItem('google_veo_api_key', value)
  }
  
  const handleOpenaiSoraKeyChange = (value: string) => {
    setOpenaiSoraApiKey(value)
    localStorage.setItem('openai_sora_api_key', value)
  }

  const quickSuggestions = [
    'Intro animation',
    'Product showcase',
    'Transition effects',
    'Social media clip',
  ]

  async function handleGenerate() {
    console.log('🚀 AI Generation started:', { type: activeTab, prompt })
    
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setGenerating(true)
    setError(null)
    setResult(null)
    console.log('📋 Generation parameters:', { type: activeTab, prompt, style: 'standard' })

    try {
      console.log('🔄 Calling API generateContent...')
      
      let generation
      if (activeTab === 'video') {
        // Video generation with provider options
        generation = await api.generateContent(
          activeTab, 
          prompt, 
          'standard', 
          openaiApiKey, 
          {
            provider: videoProvider,
            duration: videoDuration,
            quality: videoQuality,
            resolution: videoResolution,
            kieAiApiKey: kieAiApiKey || undefined,
            falAiApiKey: falAiApiKey || undefined,
            runwayApiKey: runwayApiKey || undefined,
            googleVeoApiKey: googleVeoApiKey || undefined,
            openaiSoraApiKey: openaiSoraApiKey || undefined
          }
        )
      } else {
        // Image/Audio generation
        generation = await api.generateContent(activeTab, prompt, 'standard', openaiApiKey)
      }
      
      console.log('✅ API response received:', generation)
      
      if (generation.provider) {
        setResult({ 
          url: generation.result_url, 
          type: activeTab, 
          provider: generation.provider 
        })
      } else {
        setResult({ url: generation.result_url, type: activeTab })
      }
      
      if (generation.result_url) {
        setResult({ url: generation.result_url, type: activeTab })
        setPrompt('')
        console.log('🎯 Generation successful! Result URL:', generation.result_url)
      } else {
        console.error('❌ Generation failed: No result URL in response')
        setError('Generation completed but no result URL')
      }
    } catch (err: any) {
      console.error('💥 Generation error:', err)
      setError(err.message || 'Failed to generate content')
    } finally {
      setGenerating(false)
      console.log('🏁 Generation process completed')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Wand2 className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI Content Generator
        </h2>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Create professional content with AI assistance
      </p>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            console.log('🎨 Tab switched to: Image')
            setActiveTab('image')
          }}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'image'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="font-medium">Image</span>
        </button>
        <button
          onClick={() => {
            console.log('🎥 Tab switched to: Video')
            setActiveTab('video')
          }}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'video'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Video className="w-4 h-4" />
          <span className="font-medium">Video</span>
        </button>
        <button
          onClick={() => {
            console.log('🎵 Tab switched to: Audio')
            setActiveTab('audio')
          }}
          className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'audio'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="font-medium">Audio</span>
        </button>
      </div>

      {/* Video Generation Controls */}
      {activeTab === 'video' && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">
            Video Generation Settings
          </h3>
          
          {/* Provider Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
              Video Provider
            </label>
            <select
              value={videoProvider}
              onChange={(e) => setVideoProvider(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-purple-900/30 dark:text-white"
            >
              <option value="auto">Auto (Try All Available)</option>
              <option value="kie-ai">Kie.ai (Fast & Affordable)</option>
              <option value="fal-ai">Fal.AI (Premium Quality)</option>
              <option value="runway">RunwayML (Creative Control)</option>
              <option value="google-veo">Google Veo 3 (Cinematic)</option>
              <option value="openai-sora">OpenAI Sora (Coming Soon)</option>
            </select>
          </div>
          
          {/* Video Quality and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                Duration (seconds)
              </label>
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-purple-900/30 dark:text-white"
              >
                <option value={4}>4 seconds</option>
                <option value={8}>8 seconds</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                Quality
              </label>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-purple-900/30 dark:text-white"
              >
                <option value="low">Standard (Faster)</option>
                <option value="medium">Medium</option>
                <option value="high">High Quality (Slower)</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
              Resolution
            </label>
            <select
              value={videoResolution}
              onChange={(e) => setVideoResolution(e.target.value as '720p' | '1080p')}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-purple-900/30 dark:text-white"
            >
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
            </select>
          </div>
        </div>
      )}

      {/* OpenAI API Key Input */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
          OpenAI API Key (Optional)
        </label>
        <input
          type="password"
          value={openaiApiKey}
          onChange={(e) => {
            setOpenaiApiKey(e.target.value)
            localStorage.setItem('openai_api_key', e.target.value)
          }}
          placeholder="sk-... (leave empty for mock generation)"
          className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-blue-900/30 dark:text-white text-sm"
        />
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          {openaiApiKey ? '✅ Real AI generation enabled' : '⚠️ Using mock generation (SVG placeholders)'}
        </p>
      </div>

      {/* Video Provider API Keys */}
      {activeTab === 'video' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4">
            Video Provider API Keys
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            Add your API keys to enable real video generation. Leave blank to use mock mode.
          </p>
          
          <div className="space-y-4">
            {/* Kie.ai API Key */}
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Kie.ai API Key
              </label>
              <input
                type="password"
                value={kieAiApiKey}
                onChange={(e) => handleKieAiKeyChange(e.target.value)}
                placeholder="kie-... (Fast & affordable: $0.005/credit)"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-green-900/30 dark:text-white text-sm"
              />
            </div>
            
            {/* Fal.AI API Key */}
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Fal.AI API Key
              </label>
              <input
                type="password"
                value={falAiApiKey}
                onChange={(e) => handleFalAiKeyChange(e.target.value)}
                placeholder="fal-... (600+ models, $0.05-$0.40/video)"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-green-900/30 dark:text-white text-sm"
              />
            </div>
            
            {/* RunwayML API Key */}
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                RunwayML API Key
              </label>
              <input
                type="password"
                value={runwayApiKey}
                onChange={(e) => handleRunwayKeyChange(e.target.value)}
                placeholder="runway-... (13 models, credit-based)"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-green-900/30 dark:text-white text-sm"
              />
            </div>
            
            {/* Google Veo API Key */}
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                Google Veo API Key
              </label>
              <input
                type="password"
                value={googleVeoApiKey}
                onChange={(e) => handleGoogleVeoKeyChange(e.target.value)}
                placeholder="AIza... (Cinematic quality, $0.15-$0.40/sec)"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-green-900/30 dark:text-white text-sm"
              />
            </div>
            
            {/* OpenAI Sora API Key (Coming Soon) */}
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                OpenAI Sora API Key
              </label>
              <input
                type="password"
                value={openaiSoraApiKey}
                onChange={(e) => handleOpenaiSoraKeyChange(e.target.value)}
                placeholder="sk-... (Coming Q2 2026)"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-green-900/30 dark:text-white text-sm"
              />
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                🔮 Sora coming Q2 2026 - leave blank for now
              </p>
            </div>
          </div>
          
          {/* Provider Status Indicator */}
          <div className="mt-4 p-3 bg-white dark:bg-green-800/30 border border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Provider Status:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center space-x-2 ${kieAiApiKey ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${kieAiApiKey ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Kie.ai: {kieAiApiKey ? 'Ready' : 'Mock Mode'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${falAiApiKey ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${falAiApiKey ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Fal.AI: {falAiApiKey ? 'Ready' : 'Mock Mode'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${runwayApiKey ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${runwayApiKey ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>RunwayML: {runwayApiKey ? 'Ready' : 'Mock Mode'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${googleVeoApiKey ? 'text-green-600' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${googleVeoApiKey ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Google Veo: {googleVeoApiKey ? 'Ready' : 'Mock Mode'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            AI Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create..."
            rows={4}
            disabled={generating}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none disabled:opacity-50"
          />
        </div>

        {/* Quick Suggestions */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                disabled={generating}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Generation complete!
              </p>
              {result.provider && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">
                  {result.provider}
                </span>
              )}
            </div>
            
            {result.type === 'image' && (
              <SafeImage
                src={result.url}
                alt="Generated content"
                className="w-full h-48 object-cover rounded-lg"
                fallbackText="Generated content"
                width={400}
                height={192}
              />
            )}
            
            {result.type === 'audio' && (
              <audio controls className="w-full">
                <source src={result.url} type="audio/mpeg" />
              </audio>
            )}
            
            {result.type === 'video' && (
              <video 
                controls 
                className="w-full h-48 object-cover rounded-lg bg-gray-100"
                poster=""
              >
                <source src={result.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2 inline-block"
            >
              View full result
            </a>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate with AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
