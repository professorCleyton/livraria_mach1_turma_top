import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
// Configuracao da conexao com o banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'livraria',
    password: 'MeAcs#7oU$pNs3',
    port: 5432,
})

//Funcao generica assincrona para executar consultas
async function executeQuery(query: string, params: any[]) {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params)
        return result.rows
    } finally {
        client.release()
    }
}

async function getBooks() {
    const query = 'select * from livros'
    const booksBD = await executeQuery(query, [])
    return booksBD
}

// Buscar dados 
app.get('/api/livros', async (req: Request, res: Response) => {
    const books = await getBooks();
    res.json(books);
});

// Buscar dados
app.get('/api/livros/:id', (req: Request, res: Response) => {
    const bookId = req.params.id;
    res.send(`Get user with ID ${bookId}`);
});

// Para criar registros
app.post('/api/livros/cadastro', (req: Request, res: Response) => {
    res.send('Create Livro');
});

// Atualizar um registro
app.put('/api/livros/update/:id', (req: Request, res: Response) => {
    const bookId = req.params.id;
    res.send(`Atualiza livro ${bookId}`);
});

// Remove registro
app.delete('/api/livros/delete/:id', (req: Request, res: Response) => {
    const bookId = req.params.id;
    res.send(`Delete user with ID ${bookId}`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});