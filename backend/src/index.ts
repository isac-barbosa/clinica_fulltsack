import express from 'express';
import { auth } from './middleware/auth';
import cors from "cors"
import { authRouter } from './routes/auth';
import { usuarioRouter } from './routes/usuario';
import { exameRouter } from './routes/exame';
import { pacienteRouter } from './routes/paciente';
import { consultaRouter } from './routes/consulta';
import { prontuarioRouter } from './routes/prontuario';

const app = express();
app.use(express.json())
app.use(cors())
const port = 3000;

app.get('/', (req, res) => {
  console.log(req)
  res.send("Hello world")
})

app.use(authRouter)

//midleware de autenticação
app.use(auth)

app.use(usuarioRouter)
app.use(exameRouter)
app.use(pacienteRouter)
app.use(consultaRouter)
app.use(prontuarioRouter)

app.listen(port, () => {
  console.log("Servidor ta de pé :p")
})