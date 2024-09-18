-- Connect to the database
\c company_db;

-- Insert initial departments
INSERT INTO department (name) VALUES 
('Engineering'), 
('HR'), 
('Sales');

-- Insert initial roles
INSERT INTO role (title, salary, department_id) 
VALUES 
('Software Engineer', 80000, 1),
('Sales Manager', 75000, 3),
('HR Specialist', 60000, 2);

-- Insert initial employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 3, NULL),
('Mark', 'Johnson', 2, 1);
