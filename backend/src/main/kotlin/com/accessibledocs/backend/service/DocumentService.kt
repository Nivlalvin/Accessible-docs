package com.accessibledocs.backend.service

import com.accessibledocs.backend.domain.Document
import com.accessibledocs.backend.domain.SimplifiedVersion
import com.accessibledocs.backend.repository.DocumentRepository
import com.accessibledocs.backend.repository.SimplifiedVersionRepository
import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@Service
@Transactional
class DocumentService(
    private val documentRepository: DocumentRepository,
    private val simplifiedVersionRepository: SimplifiedVersionRepository,
    private val aiEngineClient: AIEngineClient,
    private val storageService: StorageService
) {

    fun uploadDocument(file: MultipartFile, userId: UUID): Document = runBlocking {
        val filename = file.originalFilename ?: "untitled"
        val filePath = storageService.store(file)

        var document = Document(
            userId = userId,
            filename = filename,
            filePath = filePath,
            fileSize = file.size,
            mimeType = file.contentType ?: "application/octet-stream",
            status = "EXTRACTING"
        )

        document = documentRepository.save(document)

        try {
            val extraction = aiEngineClient.extractText(
                file.bytes,
                filename,
                file.contentType ?: "application/octet-stream"
            )

            document.originalText = extraction.text
            document.status = "COMPLETED"
            document.metadata["wordCount"] = extraction.wordCount
            document.metadata["pageCount"] = extraction.pageCount ?: 0

            documentRepository.save(document)
        } catch (e: Exception) {
            document.status = "FAILED"
            documentRepository.save(document)
            throw e
        }

        document
    }

    fun getDocument(id: UUID, userId: UUID): Document {
        return documentRepository.findByIdAndUserId(id, userId)
            ?: throw IllegalArgumentException("Document not found")
    }

    fun getUserDocuments(userId: UUID): List<Document> {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId)
    }

    fun simplifyDocument(documentId: UUID, level: String, userId: UUID): SimplifiedVersion = runBlocking {
        val document = getDocument(documentId, userId)

        if (document.originalText == null) {
            throw IllegalStateException("Document text not extracted yet")
        }

        val existing = simplifiedVersionRepository.findByDocumentIdAndLevel(documentId, level)
        if (existing != null) return@runBlocking existing

        val result = aiEngineClient.simplifyText(document.originalText!!, level)

        val simplified = SimplifiedVersion(
            documentId = documentId,
            level = level,
            simplifiedText = result.simplified,
            gradeLevel = result.gradeLevel,
            wordCount = result.wordCount
        )

        simplifiedVersionRepository.save(simplified)
    }
}