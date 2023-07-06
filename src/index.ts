import express, { Request, Response } from 'express';
import { executeQuery } from './pool';

const app = express();

// Funcao para buscar todos os livros
async function getBooks() {
    const query = 'select * from livros';
    const booksBD = await executeQuery(query, []);
    return booksBD;
}

async function getBookById(id: number) {
    const query = 'select id, nome as name, preco as price, estoque as stock from livros where id=$1';
    const params = [id];
    const book = await executeQuery(query, params);
    return book;
}

// Funcao para buscar todos os atendentes
async function getUsers() {
    const query = 'Select * from atendentes';
    const usersDB = await executeQuery(query, []);
    return usersDB;
}

app.get('/api/users', async (req: Request, res: Response) => {
    const users = await getUsers();
    res.json(users)
})

// Buscar dados 
app.get('/api/livros', async (req: Request, res: Response) => {
    const books = await getBooks();
    res.json(books);
});

// Buscar dados
app.get('/api/livros/:id', async (req: Request, res: Response) => {
    const bookId = Number(req.params.id);
    const book = await getBookById(bookId);
    res.json(book);
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