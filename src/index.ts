import express, { Request, Response, query } from 'express';
import { executeQuery } from './pool';
import authMiddleware from './auth';
import jwt from 'jsonwebtoken';

const app = express();
// Configurando o recebimento de body POST com JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json())

type book = {
  name: string
  barcode?: number
  publisherId?: number
  price?: number
  stock?: number
  languageId?: number
}


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

async function insertBook(name: string, barcode: number, publisherId: number,
  price: number, stock: number, languageId: number) {
  const query = `INSERT INTO livros(
        nome, codigo_barras, id_editora, preco, 
        estoque, id_idioma)
        VALUES ($1, $2, $3, $4, $5, $6)`;
  const params = [name, barcode, publisherId, price, stock, languageId];
  executeQuery(query, params);
}

function isObjectEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Melhora de atualizando o livro segundo GPT
async function updateBook(reqBody: any, id: number) {
  if (isObjectEmpty(reqBody)) {
    console.log('vazio');
    return false;
  }
  const { name, barcode, publisherId, price, stock, languageId } = reqBody;
  const params = [id];
  const updateFields = [];

  if (name) {
    updateFields.push('nome=$2');
    params.push(name);
  }
  if (barcode) {
    updateFields.push('codigo_barras=$3');
    params.push(barcode);
  }
  if (publisherId) {
    updateFields.push('id_editora=$4');
    params.push(publisherId);
  }
  if (price) {
    updateFields.push('preco=$5');
    params.push(price);
  }
  if (stock) {
    updateFields.push('estoque=$6');
    params.push(stock);
  }
  if (languageId) {
    updateFields.push('id_idioma=$7');
    params.push(languageId);
  }

  const updateQuery = 'UPDATE livros SET ' + updateFields.join(', ') + ' WHERE id=$1';
  console.log(updateQuery);
  executeQuery(updateQuery, params);
}


app.get('/api/users', authMiddleware, async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users)
})

// Buscar dados 
app.get('/api/livros', authMiddleware, async (req: Request, res: Response) => {
  const books = await getBooks();
  res.json(books);
});

// Buscar dados
app.get('/api/livros/:id', async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  const book = await getBookById(bookId);
  res.json(book);
});

// Para criar livro
app.post('/api/livros/cadastro', (req: Request, res: Response) => {
  insertBook(req.body.name, req.body.barcode, req.body.publisherId,
    req.body.price, req.body.stock, req.body.languageId)
  res.json({ sucess: "Livro criado com sucesso!" });
});

// Fazendo autenticacao 
// Fazendo autenticacao 
app.post('/api/users/autentication', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'teste' && password === 'teste') {
    const token = jwt.sign({ username }, 'your-secret-key-here', { expiresIn: '1h' }); // Assinando o token com o secretKey
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// Atualizar um registro
app.put('/api/livros/update/:id', (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  updateBook(req.body, bookId)
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