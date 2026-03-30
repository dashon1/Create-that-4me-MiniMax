import { useState, useEffect } from 'react'
import { Upload, Image as ImageIcon, Video, Music, FileText } from 'lucide-react'
import { api, Asset } from '../lib/supabase'

type AssetType = 'all' | 'images' | 'videos' | 'audio' | 'documents'

export function Assets() {
  const [activeTab, setActiveTab] = useState<AssetType>('all')
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(`Assets: Loading assets for tab: ${activeTab}`)
    loadAssets()
  }, [activeTab])

  async function loadAssets() {
    setLoading(true)
    console.log(`Assets: Starting to load assets with filter: ${activeTab === 'all' ? 'none' : activeTab.slice(0, -1)}`)
    try {
      const typeFilter = activeTab === 'all' ? undefined : activeTab.slice(0, -1) as 'image' | 'video' | 'audio' | 'document'
      console.log('Assets: Calling api.getAssets with filter:', typeFilter)
      const data = await api.getAssets(typeFilter)
      console.log(`Assets: Successfully loaded ${data.length} assets:`, data)
      setAssets(data)
    } catch (error) {
      console.error('Failed to load assets:', error)
    } finally {
      setLoading(false)
      console.log('Assets: Finished loading assets')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-12 h-12 text-gray-400" />
      case 'video':
        return <Video className="w-12 h-12 text-gray-400" />
      case 'audio':
        return <Music className="w-12 h-12 text-gray-400" />
      case 'document':
        return <FileText className="w-12 h-12 text-gray-400" />
      default:
        return <FileText className="w-12 h-12 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Assets</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your media files and documents
          </p>
        </div>
        <button 
          onClick={() => {
            console.log('Upload button clicked')
            // TODO: Implement upload functionality
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span className="font-medium">Upload Files</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            console.log('Tab clicked: All Assets')
            setActiveTab('all')
          }}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="font-medium">All Assets</span>
        </button>
        <button
          onClick={() => {
            console.log('Tab clicked: Images')
            setActiveTab('images')
          }}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'images'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="font-medium">Images</span>
        </button>
        <button
          onClick={() => {
            console.log('Tab clicked: Videos')
            setActiveTab('videos')
          }}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'videos'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Video className="w-4 h-4" />
          <span className="font-medium">Videos</span>
        </button>
        <button
          onClick={() => {
            console.log('Tab clicked: Audio')
            setActiveTab('audio')
          }}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'audio'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="font-medium">Audio</span>
        </button>
        <button
          onClick={() => {
            console.log('Tab clicked: Documents')
            setActiveTab('documents')
          }}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium">Documents</span>
        </button>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse h-48" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">No assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  {getIcon(asset.asset_type)}
                </div>

                {/* File Info */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate w-full">
                  {asset.name}
                </h3>
                <p className="text-xs text-gray-500 mb-1">{formatFileSize(asset.file_size)}</p>
                <p className="text-xs text-gray-400">{asset.mime_type}</p>
                <p className="text-xs text-gray-400">{new Date(asset.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
