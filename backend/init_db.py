import mysql.connector
from config import DB_CONFIG
from werkzeug.security import generate_password_hash

# Extract DB_CONFIG without database to connect first
connection_config = DB_CONFIG.copy()
db_name = connection_config.pop("database", "intern_management")

try:
    # Connect to MySQL server
    conn = mysql.connector.connect(**connection_config)
    cursor = conn.cursor()
    
    # Create database if not exists
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
    print(f"Database '{db_name}' checked/created successfully.")
    
    # Select database
    cursor.execute(f"USE {db_name}")
    
    # Create admins table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admins (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )
    """)
    print("Table 'admins' checked/created.")
    
    # Create interns table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interns (
        intern_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        join_date DATE,
        phone VARCHAR(20),
        age INT,
        gender VARCHAR(20),
        dob DATE,
        address TEXT,
        profile_image VARCHAR(255)
    )
    """)
    print("Table 'interns' checked/created.")
    
    # Create work_logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS work_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        intern_id INT,
        work_date DATE NOT NULL,
        task_title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        hours_worked DECIMAL(5,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        file_name VARCHAR(255),
        FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE
    )
    """)
    print("Table 'work_logs' checked/created.")
    
    # Create attendance table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        intern_id INT,
        attendance_date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE,
        UNIQUE KEY unique_intern_date (intern_id, attendance_date)
    )
    """)
    print("Table 'attendance' checked/created.")
    
    # Create leave_requests table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leave_requests (
        leave_id INT AUTO_INCREMENT PRIMARY KEY,
        intern_id INT,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE
    )
    """)
    print("Table 'leave_requests' checked/created.")
    
    # Check if admin user exists, if not create default admin
    cursor.execute("SELECT * FROM admins WHERE username = 'admin'")
    if not cursor.fetchone():
        hashed_password = generate_password_hash("admin123")
        cursor.execute("INSERT INTO admins (username, password) VALUES (%s, %s)", ("admin", hashed_password))
        print("Default admin created successfully.")
    else:
        print("Admin user already exists.")
        
    conn.commit()
    cursor.close()
    conn.close()
    print("Database initialization completed successfully.")
    
except Exception as e:
    print(f"Error initializing database: {e}")
