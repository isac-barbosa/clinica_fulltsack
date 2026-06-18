# clinic_backend
Backend with Node, Typescript and Prisma. For students with medical clinic context;

## Prisma

### Toda vez que mexemos no arquivo schema.prisma
```npx prisma format```

#### Ao atualizar qualquer model no schema.prisma, devemos:

```npx prisma migrate dev --name nome_alteracao```

## Toda vez que eu fizer alterações no banco e rodar migrations
```npx prisma generate```


# Adicionar o token no postman

Tab Headers
![alt text](<Captura de tela 2026-04-22 194710.png>)

Seleciona o Authorization e cola o token de acesso obtido no login com o prefixo Bearer. Exemplo: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpvYW8zQGdtYWlsLmNvbSIsIm5vbWUiOiJKb2FvIiwiaWF0IjoxNzc2ODk3NTE0LCJleHAiOjE3NzY5MDExMTR9.j0obBIxMXegeyCCHJOJXFSPf-_1nX78ja6kclXmGxrg