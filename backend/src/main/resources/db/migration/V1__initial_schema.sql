-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       name VARCHAR(255),
                       tier VARCHAR(50) DEFAULT 'FREE',
                       enabled BOOLEAN DEFAULT true,
                       email_verified BOOLEAN DEFAULT false,
                       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                           filename VARCHAR(500) NOT NULL,
                           original_text TEXT,
                           file_path VARCHAR(1000),
                           file_size BIGINT,
                           mime_type VARCHAR(100),
                           status VARCHAR(50) DEFAULT 'UPLOADED',
                           metadata JSONB DEFAULT '{}'::jsonb,
                           error_message TEXT,
                           processing_started_at TIMESTAMP,
                           processing_completed_at TIMESTAMP,
                           created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                           updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Simplified versions table
CREATE TABLE simplified_versions (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                     document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                                     level VARCHAR(50) NOT NULL,
                                     simplified_text TEXT NOT NULL,
                                     grade_level DECIMAL(4,2),
                                     word_count INTEGER,
                                     improvement INTEGER,
                                     metadata JSONB DEFAULT '{}'::jsonb,
                                     created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Refresh tokens for JWT
CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token VARCHAR(500) UNIQUE NOT NULL,
                                expires_at TIMESTAMP NOT NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_log (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                           action VARCHAR(100) NOT NULL,
                           entity_type VARCHAR(100),
                           entity_id UUID,
                           details JSONB,
                           ip_address VARCHAR(50),
                           user_agent TEXT,
                           created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_created ON users(created_at DESC);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created ON documents(created_at DESC);
CREATE INDEX idx_documents_user_status ON documents(user_id, status);

CREATE INDEX idx_simplified_document ON simplified_versions(document_id);
CREATE INDEX idx_simplified_level ON simplified_versions(level);
CREATE INDEX idx_simplified_document_level ON simplified_versions(document_id, level);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo user (for testing)
INSERT INTO users (email, password_hash, name, tier)
VALUES (
           'demo@accessibledocs.io',
           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: demo123
           'Demo User',
           'FREE'
       );

COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON TABLE documents IS 'Uploaded documents with extracted text';
COMMENT ON TABLE simplified_versions IS 'Simplified versions of documents at different reading levels';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for maintaining sessions';
COMMENT ON TABLE audit_log IS 'Audit trail of user actions';