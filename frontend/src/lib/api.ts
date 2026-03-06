import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
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
    // Fake delay
    await new Promise((res) => setTimeout(res, 800))

    // Fake token
    localStorage.setItem('token', 'fake-jwt-token')

    return {
      token: 'fake-jwt-token',
      user: { email },
    }
  },

  register: async (name: string, email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 800))

    localStorage.setItem('token', 'fake-jwt-token')

    return {
      token: 'fake-jwt-token',
      user: { name, email },
    }
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


