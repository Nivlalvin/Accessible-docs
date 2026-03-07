package com.accessibledocs.backend.repository

import com.accessibledocs.backend.domain.Document
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface DocumentRepository : JpaRepository<Document, UUID> {
    fun findByUserIdOrderByCreatedAtDesc(userId: UUID): List<Document>

    @Query("SELECT d FROM Document d WHERE d.userId = :userId AND d.id = :id")
    fun findByIdAndUserId(id: UUID, userId: UUID): Document?
}