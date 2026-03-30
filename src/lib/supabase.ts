import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = "https://kcnczikreywcnyxjsriu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbmN6aWtyZXl3Y255eGpzcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNDI5MDMsImV4cCI6MjA3NzYxODkwM30.6tPT7_9C3OeuQ5c-46zczhaLg3rzZq3lnNPayb_B0Fo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface Project {
  id: string
  title: string
  name?: string // For backward compatibility
  description: string | null
  project_type: string | null
  status: string
  priority: string | null
  progress_percentage: number | null
  owner_id: string | null
  client_name: string | null
  start_date: string | null
  due_date: string | null
  budget: number | null
  currency: string | null
  is_template: boolean | null
  template_category: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface Task {
  id: string
  project_id: string | null
  title: string
  description: string | null
  status: string
  completed_at: string | null
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  status: string
  email: string | null
  avatar: string | null
  created_at: string
}

export interface Asset {
  id: string
  name: string
  asset_type: string
  file_path: string | null
  file_size: number | null
  mime_type: string | null
  created_at: string
}

export interface AIGeneration {
  id: string
  type: string
  prompt: string
  result_url: string | null
  status: string
  created_at: string
}

// API functions
export const api = {
  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Project[]
  },

  async createProject(project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data as Project
  },

  // Tasks
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Task[]
  },

  async getTasksByStatus(status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Task[]
  },

  async createTask(task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data as Task
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data as Task
  },

  // Team Members
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as TeamMember[]
  },

  async createTeamMember(member: Partial<TeamMember>) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data as TeamMember
  },

  async updateTeamMemberStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data as TeamMember
  },

  // Assets
  async getAssets(type?: string) {
    let query = supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (type && type !== 'all') {
      query = query.eq('asset_type', type)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data as Asset[]
  },

  async createAsset(asset: Partial<Asset>) {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data as Asset
  },

  // AI Generations
  async generateContent(
    type: string, 
    prompt: string, 
    style?: string, 
    openaiApiKey?: string,
    videoOptions?: {
      provider?: string
      duration?: number
      quality?: 'low' | 'medium' | 'high'
      resolution?: '720p' | '1080p'
      kieAiApiKey?: string
      falAiApiKey?: string
      runwayApiKey?: string
      googleVeoApiKey?: string
      openaiSoraApiKey?: string
    }
  ) {
    const requestBody: any = { type, prompt, style }
    
    // Include OpenAI API key if provided
    if (openaiApiKey) {
      requestBody.openaiApiKey = openaiApiKey
    }
    
    // Include video-specific options
    if (videoOptions) {
      requestBody.videoDuration = videoOptions.duration || 8
      requestBody.videoQuality = videoOptions.quality || 'medium'
      requestBody.videoResolution = videoOptions.resolution || '1080p'
      requestBody.provider = videoOptions.provider || 'auto'
      
      // Include video provider API keys
      if (videoOptions.kieAiApiKey) requestBody.kieAiApiKey = videoOptions.kieAiApiKey
      if (videoOptions.falAiApiKey) requestBody.falAiApiKey = videoOptions.falAiApiKey
      if (videoOptions.runwayApiKey) requestBody.runwayApiKey = videoOptions.runwayApiKey
      if (videoOptions.googleVeoApiKey) requestBody.googleVeoApiKey = videoOptions.googleVeoApiKey
      if (videoOptions.openaiSoraApiKey) requestBody.openaiSoraApiKey = videoOptions.openaiSoraApiKey
    }
    
    const { data, error } = await supabase.functions.invoke('ai-content-generator', {
      body: requestBody
    })
    
    if (error) throw error
    return data.data as AIGeneration
  },

  async getGenerations() {
    const { data, error } = await supabase
      .from('ai_generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data as AIGeneration[]
  }
}
