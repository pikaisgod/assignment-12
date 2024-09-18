const { Client } = require('pg');
const inquirer = require('inquirer');
const cTable = require('console.table');

// PostgreSQL client connection setup
const db = new Client({
    host: 'localhost',
    user: 'postgres',         // Your PostgreSQL username
    password: 'kirit1221', // Your PostgreSQL password
    database: 'company_db',    // This is the database name
    port: 5432                 // Default PostgreSQL port
});

// Connect to PostgreSQL
db.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the PostgreSQL database.');
        startPrompt();
    }
});

// Main prompt logic
const startPrompt = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                db.end();
        }
    });
};

// Function to view all departments
const viewDepartments = () => {
    const query = 'SELECT * FROM department';
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
    });
};

// Function to view all roles
const viewRoles = () => {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON role.department_id = department.id
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
    });
};

// Function to view all employees
const viewEmployees = () => {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
    });
};

// Function to add a department
const addDepartment = () => {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        const query = 'INSERT INTO department (name) VALUES ($1)';
        db.query(query, [answer.name], (err, res) => {
            if (err) throw err;
            console.log('Department added successfully.');
            startPrompt();
        });
    });
};

// Function to add a role (no manual id, PostgreSQL will generate it)
const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary of the role:'
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'Enter the department ID the role belongs to:'
        }
    ]).then(answer => {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
        db.query(query, [answer.title, answer.salary, answer.department_id], (err, res) => {
            if (err) throw err;
            console.log('Role added successfully.');
            startPrompt();
        });
    });
};

// Function to add an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the role ID for the employee:'
        },
        {
            name: 'manager_id',
            type: 'input',
            message: 'Enter the manager ID for the employee (leave blank if none):',
            default: null
        }
    ]).then(answers => {
        // Convert manager_id to null if the input is blank
        const managerId = answers.manager_id.trim() === '' ? null : answers.manager_id;

        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        db.query(query, [answers.first_name, answers.last_name, answers.role_id, managerId], (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully.');
            startPrompt();
        });
    });
};

// Function to update an employee's role
const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: 'employee_id',
            type: 'input',
            message: 'Enter the ID of the employee whose role you want to update:'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the new role ID for the employee:'
        }
    ]).then(answer => {
        const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
        db.query(query, [answer.role_id, answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log('Employee role updated successfully.');
            startPrompt();
        });
    });
};
