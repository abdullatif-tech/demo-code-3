-- ======================================
-- Invoice API Database Schema (MySQL)
-- Day 3 - API Authentication & Security
-- Libyan Telecom Company
-- ======================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS invoice_api 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE invoice_api;

-- ======================================
-- Users Table
-- ======================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'accountant', 'viewer') NOT NULL DEFAULT 'viewer',
    department ENUM('finance', 'sales', 'operations', 'management') NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- Invoices Table
-- ======================================
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_address TEXT,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency ENUM('LYD', 'USD', 'EUR') NOT NULL DEFAULT 'LYD',
    status ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'pending',
    issue_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    paid_date DATETIME,
    notes TEXT,
    created_by INT NOT NULL,
    updated_by INT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_invoice_number (invoiceNumber),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_customer_name (customer_name),
    INDEX idx_issue_date (issue_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- Invoice Items Table
-- ======================================
CREATE TABLE IF NOT EXISTS invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice_id (invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- Sample Data (Optional - for testing)
-- ======================================

-- Insert a sample admin user
-- Password: Admin123! (hashed with bcrypt)
-- Note: You should register users through the API, this is just for reference
-- INSERT INTO users (name, email, password, role, department) 
-- VALUES ('Admin User', 'admin@libyatelecom.ly', '$2a$10$...', 'admin', 'management');

-- ======================================
-- Views (Optional - for reporting)
-- ======================================

-- View to get invoice summary with creator info
CREATE OR REPLACE VIEW invoice_summary AS
SELECT 
    i.id,
    i.invoiceNumber,
    i.customer_name,
    i.total,
    i.currency,
    i.status,
    i.issue_date,
    i.due_date,
    u.name AS created_by_name,
    u.email AS created_by_email,
    i.createdAt
FROM invoices i
LEFT JOIN users u ON i.created_by = u.id;

-- ======================================
-- Stored Procedures (Optional)
-- ======================================

DELIMITER //

-- Procedure to get user statistics
CREATE PROCEDURE IF NOT EXISTS get_user_stats(IN user_id INT)
BEGIN
    SELECT 
        COUNT(*) AS total_invoices,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_invoices,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_invoices,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) AS overdue_invoices,
        SUM(total) AS total_amount
    FROM invoices
    WHERE created_by = user_id;
END //

DELIMITER ;

-- ======================================
-- Grant Permissions (Optional)
-- ======================================

-- If you're using a specific database user:
-- GRANT ALL PRIVILEGES ON invoice_api.* TO 'invoice_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ======================================
-- Notes
-- ======================================

-- 1. Sequelize will automatically sync tables when the app starts
-- 2. This schema file is for reference and manual database setup if needed
-- 3. The password field stores bcrypt hashed passwords (60 characters)
-- 4. All timestamps use MySQL DATETIME with automatic updates
-- 5. Foreign keys ensure data integrity
-- 6. Indexes improve query performance

-- ======================================
-- Verification Queries
-- ======================================

-- Check if tables were created successfully
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Check invoices table structure
DESCRIBE invoices;

-- Check invoice_items table structure
DESCRIBE invoice_items;

-- ======================================
-- End of Schema
-- ======================================

