package com.accessibledocs.backend.controller

import com.accessibledocs.backend.service.AuthResponse
import com.accessibledocs.backend.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = ["*"])
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        val response = authService.register(request.email, request.password, request.name)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        println("LOGIN ATTEMPT: ${request.email}") // add this line
        val response = authService.login(request.email, request.password)
        return ResponseEntity.ok(response)
    }
}

data class RegisterRequest(val email: String, val password: String, val name: String)
data class LoginRequest(val email: String, val password: String)