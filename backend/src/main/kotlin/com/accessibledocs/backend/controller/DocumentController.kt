package com.accessibledocs.backend.controller

import com.accessibledocs.backend.domain.Document
import com.accessibledocs.backend.domain.SimplifiedVersion
import com.accessibledocs.backend.service.DocumentService
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/api/v1/documents")
@CrossOrigin(origins = ["*"])
class DocumentController(private val documentService: DocumentService) {

    @PostMapping("/upload")
    fun uploadDocument(
        @RequestParam("file") file: MultipartFile,
        authentication: Authentication
    ): ResponseEntity<DocumentResponse> {
        val userId = UUID.fromString(authentication.name)
        val document = documentService.uploadDocument(file, userId)
        return ResponseEntity.status(HttpStatus.CREATED).body(DocumentResponse.from(document))
    }

    @GetMapping("/my")
    fun getMyDocuments(authentication: Authentication): ResponseEntity<List<DocumentResponse>> {
        val userId = UUID.fromString(authentication.name)
        val documents = documentService.getUserDocuments(userId)
        return ResponseEntity.ok(documents.map { DocumentResponse.from(it) })
    }

    @GetMapping("/{id}")
    fun getDocument(
        @PathVariable id: UUID,
        authentication: Authentication
    ): ResponseEntity<DocumentResponse> {
        val userId = UUID.fromString(authentication.name)
        val document = documentService.getDocument(id, userId)
        return ResponseEntity.ok(DocumentResponse.from(document))
    }

    @PostMapping("/{id}/simplify")
    fun simplifyDocument(
        @PathVariable id: UUID,
        @RequestParam level: String,
        authentication: Authentication
    ): ResponseEntity<SimplificationResponse> {
        val userId = UUID.fromString(authentication.name)
        val simplified = documentService.simplifyDocument(id, level, userId)
        return ResponseEntity.ok(SimplificationResponse.from(simplified))
    }
}

data class DocumentResponse(
    val id: UUID,
    val filename: String,
    val status: String,
    val originalText: String?,
    val wordCount: Int?,
    val createdAt: String
) {
    companion object {
        fun from(doc: Document) = DocumentResponse(
            id = doc.id!!,
            filename = doc.filename,
            status = doc.status,
            originalText = doc.originalText,
            wordCount = doc.metadata["wordCount"] as? Int,
            createdAt = doc.createdAt.toString()
        )
    }
}

data class SimplificationResponse(
    val documentId: UUID,
    val level: String,
    val simplifiedText: String,
    val gradeLevel: Double?
) {
    companion object {
        fun from(s: SimplifiedVersion) = SimplificationResponse(
            documentId = s.documentId,
            level = s.level,
            simplifiedText = s.simplifiedText,
            gradeLevel = s.gradeLevel
        )
    }
}