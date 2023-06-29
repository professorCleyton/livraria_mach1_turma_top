import express, { Request, Response } from 'express';

const app = express();

// Buscar dados 
app.get('/api/livros', (req: Request, res: Response) => {
    res.send('Busca todos os livros');
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