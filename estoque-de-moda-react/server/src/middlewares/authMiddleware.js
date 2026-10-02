import jwt from "jsonwebtoken";

export default function autenticarToken(
req,
res,
next
) {
const authHeader =
req.headers.authorization;

if (
!authHeader ||
!authHeader.startsWith("Bearer ")
) {
return res.status(401).json({
mensagem:
"Acesso negado: token não fornecido.",
});
}

const token =
authHeader.substring(7);

try {


const usuario = jwt.verify(
  token,
  process.env.JWT_SECRET
);

// Usuário autenticado fica disponível
// para as próximas rotas
req.usuario = usuario;

next();


} catch (erro) {


return res.status(401).json({
  mensagem:
    "Token inválido ou expirado.",
});


}
}
