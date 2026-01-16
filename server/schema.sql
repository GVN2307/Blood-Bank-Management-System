CREATE DATABASE IF NOT EXISTS blood_bank_db;
USE blood_bank_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('hospital', 'bloodbank', 'user', 'admin') NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- In a real app, hash this!
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bloodbank_id INT,
  blood_group VARCHAR(5) NOT NULL, -- A+, B-, etc.
  units INT DEFAULT 0,
  FOREIGN KEY (bloodbank_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT,
  blood_group VARCHAR(5) NOT NULL,
  units INT NOT NULL,
  status ENUM('pending', 'fulfilled', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  bloodbank_id INT,
  units INT DEFAULT 1,
  donation_date DATE NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bloodbank_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS test_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  hospital_id INT,
  test_type VARCHAR(100) NOT NULL, -- e.g., 'Blood Test', 'Urine Test'
  status ENUM('pending', 'completed') DEFAULT 'pending',
  result_summary TEXT, -- URL or text summary
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bloodbank_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE,
  location TEXT,
  FOREIGN KEY (bloodbank_id) REFERENCES users(id)
);

-- Seed Data (Telangana Examples)
INSERT IGNORE INTO users (type, name, email, password, address, latitude, longitude, phone) VALUES 
('hospital', 'NIMS Hyderabad', 'admin@nims.edu.in', 'password123', 'Punjagutta, Hyderabad', 17.4116, 78.4489, '040-23489000'),
('hospital', 'Apollo Hospitals Jubilee Hills', 'info@apollo.com', 'password123', 'Film Nagar, Hyderabad', 17.4156, 78.4077, '040-23607777'),
('bloodbank', 'Indian Red Cross Society', 'redcross@gmail.com', 'password123', 'Vidya Nagar, Hyderabad', 17.4042, 78.5026, '040-27633087'),
('bloodbank', 'Chiranjeevi Blood Bank', 'cbb@gmail.com', 'password123', 'Jubilee Hills, Hyderabad', 17.4265, 78.4128, '040-23547209'),
('bloodbank', 'NTR Trust Blood Bank', 'ntr@trust.org', 'password123', 'Banjara Hills, Hyderabad', 17.4107, 78.4356, '040-30799999'),
('admin', 'System Admin', 'admin@lifelink.com', 'admin123', 'Hyderabad', 17.3850, 78.4867, '9999999999'),
('user', 'Ravi Kumar', 'ravi@gmail.com', 'password123', 'Kukatpally, Hyderabad', 17.4875, 78.3953, '9876543210');

INSERT IGNORE INTO inventory (bloodbank_id, blood_group, units) VALUES 
(3, 'A+', 10), (3, 'O+', 15), (3, 'B-', 5),
(4, 'AB+', 8), (4, 'O-', 2),
(5, 'A+', 20), (5, 'B+', 12);

INSERT IGNORE INTO events (bloodbank_id, title, description, event_date, location) VALUES
(3, 'Blood Donation Camp', 'Mega donation camp at OU Campus.', '2023-11-15', 'Osmania University, Hyderabad'),
(4, 'Health Awareness Run', '5K run for heart health.', '2023-12-01', 'KBR Park, Hyderabad');
