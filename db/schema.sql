-- Drop existing tables if they exist (optional but helpful during development)
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS department CASCADE;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,             -- Automatically incrementing id
    name VARCHAR(30) UNIQUE NOT NULL   -- Department name (must be unique and not null)
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,             -- Automatically incrementing id
    title VARCHAR(30) UNIQUE NOT NULL, -- Role title (must be unique and not null)
    salary DECIMAL NOT NULL,           -- Salary for the role
    department_id INTEGER NOT NULL,    -- Foreign key linking to department table
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,             -- Automatically incrementing id
    first_name VARCHAR(30) NOT NULL,   -- Employee's first name
    last_name VARCHAR(30) NOT NULL,    -- Employee's last name
    role_id INTEGER NOT NULL,          -- Foreign key linking to role table
    manager_id INTEGER,                -- Self-referencing foreign key for employee's manager (can be null)
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
