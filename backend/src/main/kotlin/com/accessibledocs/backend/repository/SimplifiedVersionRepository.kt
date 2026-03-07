package com.accessibledocs.backend.repository

import com.accessibledocs.backend.domain.SimplifiedVersion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SimplifiedVersionRepository : JpaRepository<SimplifiedVersion, UUID> {
    fun findByDocumentId(documentId: UUID): List<SimplifiedVersion>
    fun findByDocumentIdAndLevel(documentId: UUID, level: String): SimplifiedVersion?
}