const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const connection = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Haasteam20#",
    database: "NodeJSData"
});

connection.connect((err) => {
    if (err) {
        console.error('Connection Error:', err.stack);
    } else {
        console.log("Database Connected Successfully");
    }
});

app.get('/', (req, res) => {
    res.send("Hii");
});

app.get('/get-expense', (req, result) => {
    const query = 'SELECT * FROM "Expenses_Table"';
    connection.query(query, (err, res) => {
        if (err) {
            return res.status(500).send("Error fetching Data");
        }

        return result.json(res.rows);
    })
});

app.post('/add-expense', (req, res) => {
    const creation = `
    CREATE TABLE IF NOT EXISTS "Expenses_Table" (
        expense_id SERIAL PRIMARY KEY,
        expense_Name VARCHAR(255),
        expense_Amount NUMERIC,
        expense_Date DATE,
        expense_Invoice VARCHAR(255),
        expense_Category VARCHAR(255)
    )
`;
    connection.query(creation, (createErr, createResult) => {
        if (createErr) {
            console.error("Error creating table:", createErr);
            return res.status(500).send('Error creating table');
        }

        console.log("Table Created Successfully.");
        const { expense_Name, expense_Amount, expense_Date, expense_Invoice, expense_Category } = req.body;

        const sql = 'INSERT INTO "Expenses_Table" (expense_name, expense_amount, expense_date, expense_invoice, expense_category) VALUES ($1, $2, $3, $4, $5)';
        const values = [expense_Name, expense_Amount, expense_Date, expense_Invoice, expense_Category];

        connection.query(sql, values, (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Error inserting data", insertErr);
                return res.status(500).send('Error inserting data');
            } else {
                console.log("Expenses Added Successfully");
                res.send('Expense Data added successfully!');
            }
        });
    });
});

app.get('/get-expense/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Expenses Data for ID ${id} fetched successfully!`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
