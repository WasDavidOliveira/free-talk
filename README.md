# 💬 FreeTalk API

Uma API completa para aplicação de chat em tempo real construída com Node.js e TypeScript, oferecendo funcionalidades de conversas, mensagens, participantes e sistema de autenticação robusto.

---

## 📚 Tecnologias Incluídas

### 🔧 Core
- **Express 5.1.0**: Framework web rápido e minimalista para Node.js
- **TypeScript 5.8.3**: Superset tipado de JavaScript  
- **Zod 3.24.3**: Validação de schemas com inferência de tipos
- **Zod-OpenAPI 4.2.4**: Integração de Zod com OpenAPI para documentação automática

### 💾 Banco de Dados
- **Drizzle ORM 0.42.0**: ORM TypeScript-first com excelente experiência de desenvolvimento
- **PostgreSQL**: Banco de dados relacional (via pg 8.15.6)
- **Drizzle Kit 0.31.1**: Ferramentas CLI para migrações e gerenciamento de esquema

### 🔒 Segurança & Autenticação
- **Bcrypt 5.1.1**: Hashing de senhas
- **Helmet 8.1.0**: Segurança para aplicações Express
- **Express Rate Limit 7.5.0**: Limitação de requisições
- **CORS 2.8.5**: Configuração de Cross-Origin Resource Sharing
- **JsonWebToken 9.0.2**: Implementação de JWT para autenticação
- **Sistema de Roles e Permissões**: Controle granular de acesso

### 🛠️ Utilidades & Documentação
- **Dotenv 16.5.0**: Gerenciamento de variáveis de ambiente
- **Winston 3.17.0**: Logger para Node.js
- **Scalar API Reference 0.6.8**: Documentação interativa da API

### 👨‍💻 Desenvolvimento & Testes
- **ESLint 9.25.0**: Linting de código
- **Prettier 3.5.3**: Formatação de código
- **Vitest 3.1.1**: Framework de testes rápido com UI
- **Faker.js 9.7.0**: Geração de dados fictícios para testes
- **Supertest 7.1.0**: Testes de integração para APIs HTTP
- **ts-node-dev**: Reinicialização automática durante desenvolvimento

---

## 📂 Estrutura do Projeto

```
src/
├── 📁 configs/          # Configurações da aplicação (CORS, Helmet, etc.)
├── 📁 constants/        # Constantes da aplicação (status codes, paginação)
├── 📁 controllers/      # Controladores organizados por versão e módulos
│   └── v1/modules/      # Controllers v1: auth, conversation, messages, etc.
├── 📁 db/               # Banco de dados e migrações
│   ├── schema/v1/       # Schemas Drizzle: users, conversations, messages
│   ├── migrations/      # Migrações do banco de dados
│   └── seeds/           # Dados iniciais (roles, permissions, users)
├── 📁 docs/             # Documentação da API (OpenAPI)
├── 📁 enums/            # Enumerações (message types, roles)
├── 📁 middlewares/      # Middlewares (auth, validation, error handling)
├── 📁 repositories/     # Camada de acesso a dados
├── 📁 resources/        # Formatação de respostas da API
├── 📁 routes/           # Definições de rotas organizadas por módulos
├── 📁 services/         # Lógica de negócios
├── 📁 tests/            # Testes de integração e factories
├── 📁 types/            # Definições de tipos TypeScript
├── 📁 utils/            # Funções utilitárias
├── 📁 validations/      # Schemas Zod para validação
└── 📄 server.ts         # Ponto de entrada da aplicação
```

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/WasDavidOliveira/free-talk.git
cd free-talk

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto com as variáveis mostradas abaixo

# Execute as migrações do banco de dados
npm run db:migrate

# Execute os seeds (dados iniciais)
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📋 Scripts Disponíveis

### 🚀 Desenvolvimento
- `npm run dev` - ▶️ Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - 🏗️ Compila o código TypeScript para JavaScript
- `npm run start` - 🚀 Inicia o servidor em modo de produção (após o build)

### 🧹 Qualidade de Código
- `npm run lint` - 🔍 Executa a verificação de linting com ESLint
- `npm run lint:fix` - 🔧 Corrige automaticamente problemas de linting
- `npm run format` - ✨ Formata o código com Prettier

### 💾 Banco de Dados
- `npm run db:generate` - 📝 Gera migrações com base nas alterações do schema
- `npm run db:migrate` - 📊 Executa as migrações pendentes
- `npm run db:studio` - 🔬 Inicia o Drizzle Studio para visualização e edição do banco
- `npm run db:push` - 📤 Sincroniza o banco de dados com o schema atual
- `npm run db:seed` - 🌱 Executa os seeds (dados iniciais)

### 🧪 Testes
- `npm run test` - 🧪 Executa todos os testes
- `npm run test:watch` - 👀 Executa testes em modo watch
- `npm run test:coverage` - 📊 Executa testes com relatório de cobertura
- `npm run test:view` - 🖥️ Abre a interface visual do Vitest

---

## 📖 Documentação da API

A documentação da API é gerada automaticamente usando Zod-OpenAPI e pode ser acessada em:

```
http://localhost:3000/docs
```

## 🚀 Funcionalidades Principais

### 💬 **Sistema de Chat Completo**
- **Conversas**: Criação, edição, listagem e exclusão de conversas
- **Mensagens**: Envio, edição, exclusão e marcação como lidas
- **Participantes**: Adição e remoção de usuários em conversas
- **Tipos de Mensagem**: Texto, arquivo e conteúdo misto

### 🔐 **Sistema de Autenticação**
- **JWT Authentication**: Autenticação segura com tokens
- **Registro/Login**: Sistema completo de gerenciamento de usuários
- **Middleware de Autenticação**: Proteção de rotas sensíveis

### 🛡️ **Sistema de Roles e Permissões**
- **Controle Granular**: Sistema baseado em roles e permissões
- **Middleware de Autorização**: Verificação automática de permissões
- **Seeds Configurados**: Dados iniciais para roles e permissões

### 📊 **API RESTful Completa**
- **Versionamento**: API versionada (v1)
- **Paginação**: Sistema completo de paginação
- **Validação**: Schemas Zod para validação de dados
- **Documentação**: OpenAPI/Swagger automático

---

## 📖 Documentação da API

A documentação interativa da API está disponível em:

```
http://localhost:3000/docs
```

### 🔑 **Endpoints de Autenticação**
- `POST /api/v1/auth/register` - 📝 Registrar novo usuário
- `POST /api/v1/auth/login` - 🔑 Login para obter token JWT
- `GET /api/v1/auth/me` - 👤 Dados do usuário autenticado

### 💬 **Endpoints de Conversas**
- `GET /api/v1/conversations` - 📋 Listar conversas do usuário
- `POST /api/v1/conversations` - ✨ Criar nova conversa
- `GET /api/v1/conversations/:id` - 🔍 Buscar conversa específica
- `PUT /api/v1/conversations/:id` - ✏️ Editar conversa
- `DELETE /api/v1/conversations/:id` - 🗑️ Deletar conversa

### 👥 **Endpoints de Participantes**
- `POST /api/v1/conversations/:id/participants` - ➕ Adicionar participantes
- `DELETE /api/v1/conversations/:id/participants/:userId` - ➖ Remover participante
- `GET /api/v1/conversations/:id/participants` - 📋 Listar participantes

### 💌 **Endpoints de Mensagens**
- `GET /api/v1/conversations/:id/messages` - 📋 Listar mensagens (paginado)
- `POST /api/v1/conversations/:id/messages` - ✨ Enviar mensagem
- `GET /api/v1/conversations/:id/messages/:messageId` - 🔍 Buscar mensagem
- `PUT /api/v1/conversations/:id/messages/:messageId` - ✏️ Editar mensagem
- `DELETE /api/v1/conversations/:id/messages/:messageId` - 🗑️ Deletar mensagem
- `POST /api/v1/conversations/:id/messages/mark-as-read` - ✅ Marcar como lidas
- `GET /api/v1/conversations/:id/messages/unread-count` - 🔢 Contar não lidas

### 🛡️ **Endpoints de Roles e Permissões**
- `GET /api/v1/roles` - 📋 Listar roles
- `POST /api/v1/roles` - ✨ Criar nova role
- `GET /api/v1/permissions` - 📋 Listar permissões
- `POST /api/v1/roles-permissions/attach` - 🔗 Vincular permissão a role

---

## 🗃️ Estrutura do Banco de Dados

O projeto utiliza **Drizzle ORM** com **PostgreSQL**:

### 📋 **Principais Tabelas**
- **users**: Usuários do sistema
- **conversations**: Conversas entre usuários
- **conversation_participants**: Participantes das conversas
- **messages**: Mensagens das conversas
- **message_attachments**: Anexos das mensagens
- **roles**: Roles do sistema
- **permissions**: Permissões específicas
- **role_permissions**: Relacionamento roles-permissões
- **user_roles**: Roles dos usuários

### 🔄 **Gerenciamento do Schema**
1. ✏️ Modifique os schemas em `src/db/schema/v1/`
2. 🔄 Gere migrações: `npm run db:generate`
3. ⬆️ Aplique migrações: `npm run db:migrate`
4. 🌱 Execute seeds: `npm run db:seed`

---

## 🧪 Testes

O projeto possui **cobertura completa de testes**:

### 🏭 **Test Factories**
- Factories para criação de dados fictícios
- Cenários complexos pré-configurados
- Integração com Faker.js

### 🔬 **Testes de Integração**
- Testes completos de API
- Validação de autenticação e autorização
- Cenários de edge cases

### 📊 **Cobertura**
- Todos os endpoints testados
- Validações de dados
- Casos de erro e sucesso

---

## 🔌 Adicionando Novas Funcionalidades

### 📝 **Para Novos Endpoints:**
1. 🎯 Crie o schema no banco: `src/db/schema/v1/`
2. 📋 Defina os tipos: `src/types/models/v1/`
3. ✅ Crie validações: `src/validations/v1/modules/`
4. 💾 Implemente o repository: `src/repositories/v1/modules/`
5. 🔧 Crie o service: `src/services/v1/modules/`
6. 🎮 Desenvolva o controller: `src/controllers/v1/modules/`
7. 🛣️ Configure as rotas: `src/routes/v1/modules/`
8. 🧪 Escreva os testes: `src/tests/`

### 🏗️ **Arquitetura em Camadas:**
- **Routes** → **Controllers** → **Services** → **Repositories** → **Database**
- Cada camada tem responsabilidade bem definida
- Separação clara entre lógica de negócio e acesso a dados

---

## 🛠️ Configuração de Ambiente

### 🐘 **Configuração do Banco de Dados**

1. **Instale e configure o PostgreSQL** no seu sistema
2. **Crie um banco de dados** chamado `freetalk`
3. **Configure as variáveis de ambiente** (veja abaixo)
4. **Execute os comandos do projeto** para configurar o schema:

```bash
# Gera as migrações baseadas nos schemas
npm run db:generate

# Aplica as migrações no banco
npm run db:migrate

# Popula o banco com dados iniciais (roles, permissions, etc.)
npm run db:seed
```

> **💡 Dica:** Use `npm run db:studio` para visualizar e gerenciar o banco através do Drizzle Studio

### 📋 **Variáveis de Ambiente Necessárias**

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senha
DB_NAME=freetalk

# JWT (gere chaves seguras para produção)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRATION=1h
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret-different-from-above
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Aplicação
NODE_ENV=development
PORT=3000

# CORS (opcional - para múltiplas origens)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

> **⚠️ Importante:** Para produção, use chaves JWT seguras com pelo menos 32 caracteres e senhas fortes para o banco de dados.

---

## 🚀 Deploy

### 📦 **Build para Produção**
```bash
npm run build
npm start
```

### 🌐 **Considerações para Deploy**
- Configure variáveis de ambiente de produção
- Execute migrações no banco de produção
- Configure proxy reverso (Nginx)
- Implemente logs de produção (Winston)
- Configure monitoramento de saúde

---

## 📈 Performance e Escalabilidade

### ⚡ **Otimizações Implementadas**
- **Rate Limiting**: Proteção contra spam
- **Helmet**: Headers de segurança
- **CORS**: Configuração adequada
- **Pagination**: Evita sobrecarga em listagens
- **Indexes**: Otimização de consultas no banco

### 🔮 **Melhorias Futuras**
- WebSocket para mensagens em tempo real
- Redis para cache e sessões
- Upload de arquivos (AWS S3)
- Push notifications
- Microserviços para escalabilidade

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. 🍴 Fork o projeto
2. 🌟 Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. ✍️ Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push para a branch (`git push origin feature/AmazingFeature`)
5. 🔄 Abra um Pull Request

### 📝 **Diretrizes de Contribuição**
- Siga o padrão de código existente
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

---

## 📞 Suporte

Para dúvidas ou problemas:
- 🐛 Abra uma [Issue](https://github.com/WasDavidOliveira/free-talk/issues)
- 💬 Entre em contato via [Discussions](https://github.com/WasDavidOliveira/free-talk/discussions)
- 📧 Email: [wasdavidoliveira@gmail.com](mailto:david-oliveira.code@proton.me)

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## ⭐ Agradecimentos

- **Express.js** - Framework web robusto
- **Drizzle ORM** - ORM TypeScript-first fantástico
- **Vitest** - Framework de testes rápido e moderno
- **Zod** - Validação e inferência de tipos
- Toda a comunidade open source que torna projetos como este possíveis! 🙏
