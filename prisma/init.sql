-- Initialize database for Next Store
-- This file will be executed when MySQL container starts for the first time

CREATE DATABASE IF NOT EXISTS nextstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE nextstore;

-- Grant permissions to the nextstore user
GRANT ALL PRIVILEGES ON nextstore.* TO 'nextstore'@'%';

FLUSH PRIVILEGES;
