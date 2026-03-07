package com.accessibledocs.backend.service

import com.accessibledocs.backend.domain.User
import com.accessibledocs.backend.repository.UserRepository
import com.accessibledocs.backend.security.JwtTokenProvider
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
@Transactional
class AuthService(
    private val userRepository: UserRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val passwordEncoder: PasswordEncoder
) {

    fun register(email: String, password: String, name: String): AuthResponse {
        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("Email already exists")
        }

        val user = User(
            email = email,
            passwordHash = passwordEncoder.encode(password),
            name = name,
            tier = "FREE"
        )

        val savedUser = userRepository.save(user)
        val token = jwtTokenProvider.generateToken(savedUser.id!!, savedUser.email)

        return AuthResponse(
            token = token,
            user = UserDTO(
                id = savedUser.id!!,
                email = savedUser.email,
                name = savedUser.name,
                tier = savedUser.tier
            )
        )
    }

    fun login(email: String, password: String): AuthResponse {
        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("Invalid credentials")

        if (!passwordEncoder.matches(password, user.passwordHash)) {
            throw IllegalArgumentException("Invalid credentials")
        }

        val token = jwtTokenProvider.generateToken(user.id!!, user.email)

        return AuthResponse(
            token = token,
            user = UserDTO(
                id = user.id!!,
                email = user.email,
                name = user.name,
                tier = user.tier
            )
        )
    }

    fun getUserByEmail(email: String): User? = userRepository.findByEmail(email)
}

data class AuthResponse(val token: String, val user: UserDTO)
data class UserDTO(val id: UUID, val email: String, val name: String?, val tier: String)