package com.accessibledocs.backend.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.util.UUID

@Service
class StorageService(
    @Value("\${storage.local.base-path:./uploads}") private val basePath: String
) {
    init {
        File(basePath).mkdirs()
    }

    fun store(file: MultipartFile): String {
        val filename = "${UUID.randomUUID()}_${file.originalFilename}"
        val path = Paths.get(basePath, filename)
        Files.write(path, file.bytes)
        return filename
    }
}