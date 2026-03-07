import axios from 'axios'

// primary API used for document-related endpoints
const api = axios.create({
  baseURL: 'http://localhost:8000',
})

// separate instance for authentication if backend auth server uses a different port
const authClient = axios.create({
  baseURL: 'http://localhost:8080',
})

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const authAPI = {
  login: async (email: string, password: string) => {
    // forward request to real backend running on port 8080
    const res = await authClient.post('/login', { email, password })

    // assume backend responds with { token, user }
    const { token, user } = res.data

    // persist token locally for other calls
    localStorage.setItem('token', token)

    return { token, user }
  },

  register: async (name: string, email: string, password: string) => {
    const res = await authClient.post('/register', { name, email, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    return { token, user }
  },
}

export const documentAPI = {

  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    // 1 extract text
    const textRes = await api.post("/extract-text", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    const text = textRes.data.text

    // 2 store in vector DB
    const processRes = await api.post("/process-document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    const documentId = processRes.data.document_id

    return {
      id: documentId,
      text: text,
      status: "READY"
    }
  },

  simplify: async (text: string) => {
    const res = await api.post("/simplify", { text })

    return res.data
  },

  extractTerms: async (text: string) => {
    const res = await api.post("/extract-terms", { text })

    return res.data
  },

  askQuestion: async (documentId: string, question: string) => {
    const res = await api.post("/ask", {
      document_id: documentId,
      question
    })

    return res.data
  }
}


