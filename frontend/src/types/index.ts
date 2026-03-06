export type DocumentAction = 'Simplified' | 'Q&A' | 'ReadAloud'

export interface Document {
  id: string
  title: string
  uploadedAt: string
  actions: DocumentAction[]
}