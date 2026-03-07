package com.accessibledocs.backend.service

import com.fasterxml.jackson.databind.ObjectMapper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class AIEngineClient(
    @Value("\${ai.engine.url:http://localhost:5000}") private val aiEngineUrl: String,
    private val objectMapper: ObjectMapper
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(120, TimeUnit.SECONDS)
        .readTimeout(120, TimeUnit.SECONDS)
        .build()

    private val jsonMediaType = "application/json".toMediaType()

    suspend fun extractText(
        fileBytes: ByteArray,
        filename: String,
        mimeType: String
    ): ExtractionResult = withContext(Dispatchers.IO) {

        // MOCK DATA FOR DEMO - Replace when AI service is ready
        return@withContext ExtractionResult(
            text = "Sample medical document: The patient presents with hypertension requiring pharmaceutical intervention.",
            pageCount = 1,
            wordCount = 100
        )

        /* UNCOMMENT WHEN AI SERVICE IS READY
        val request = mapOf(
            "file" to java.util.Base64.getEncoder().encodeToString(fileBytes),
            "filename" to filename,
            "mimeType" to mimeType
        )

        val json = objectMapper.writeValueAsString(request)
        val httpRequest = Request.Builder()
            .url("$aiEngineUrl/api/extract")
            .post(json.toRequestBody(jsonMediaType))
            .build()

        client.newCall(httpRequest).execute().use { response ->
            if (!response.isSuccessful) {
                throw Exception("AI Engine error: ${response.code}")
            }
            val body = response.body?.string() ?: throw Exception("Empty response")
            objectMapper.readValue(body, ExtractionResult::class.java)
        }
        */
    }

    suspend fun simplifyText(text: String, level: String): SimplificationResult =
        withContext(Dispatchers.IO) {

            // MOCK DATA FOR DEMO - Replace when AI service is ready
            val simplified = when(level) {
                "CHILD" -> "The patient has high blood pressure and needs medicine."
                "TEEN" -> "The patient has high blood pressure that needs medication."
                else -> "The patient presents with hypertension requiring treatment."
            }

            return@withContext SimplificationResult(
                simplified = simplified,
                gradeLevel = when(level) { "CHILD" -> 3.5; "TEEN" -> 6.5; else -> 9.5 },
                wordCount = simplified.split(" ").size,
                improvement = 5
            )

            /* UNCOMMENT WHEN AI SERVICE IS READY
            val request = mapOf("text" to text, "level" to level)
            val json = objectMapper.writeValueAsString(request)

            val httpRequest = Request.Builder()
                .url("$aiEngineUrl/api/simplify")
                .post(json.toRequestBody(jsonMediaType))
                .build()

            client.newCall(httpRequest).execute().use { response ->
                if (!response.isSuccessful) {
                    throw Exception("AI Engine error: ${response.code}")
                }
                val body = response.body?.string() ?: throw Exception("Empty response")
                objectMapper.readValue(body, SimplificationResult::class.java)
            }
            */
        }
}

data class ExtractionResult(val text: String, val pageCount: Int?, val wordCount: Int)
data class SimplificationResult(val simplified: String, val gradeLevel: Double, val wordCount: Int, val improvement: Int)