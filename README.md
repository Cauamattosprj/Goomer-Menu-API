# Goomer Menu API
## 📋 Cenário do Projeto

Decidi conduzir o projeto com o seguinte cenário fictício em mente:

1. Esta API irá crescer exponencialmente e se tornar o núcleo principal de um grande sistema ao longo dos anos
    
2. Será construída tendo como principal objetivo a **escalabilidade** - fácil manutenção, facilidade de testes, baixo acoplamento e potencial de expansão
    

## 🏗️ Decisões Arquiteturais

- **Metodologia**: TDD (Test-Driven Design)
    
- **Padrão Arquitetural**: Arquitetura Hexagonal (Portas e Adaptadores)
    
- **Linguagem**: TypeScript
    
- **Framework**: Express
    
- **Banco de Dados**: PostgreSQL
    
- **ORM**: PrismaORM (somente para migrations)
    
- **Containerização**: Docker com Docker Compose
    
- **Logging**: Pino
    
- **Testes**: Jest (Unitários)
    

## 🚀 Funcionalidades

### ✅ Implementadas

- **Produtos**: CRUD completo com controle de visibilidade
    
- **Categorias**: CRUD para organizar produtos
    
- **Promoções**: Criação e busca de promoções, adição e remoção de produtos da promoção
    
- **Cardápio**: Retorno consolidado com produtos visíveis e promoções ativas
    

### 🔄 Melhorias possíveis

- Ordenação personalizada de produtos no cardápio
    
- Tratamento de timezone para diferentes regiões
    
- Testes unitários abrangentes
    
- Documentação Swagger/OpenAPI
- Testes de integração e E2E
- 
    

## 📁 Estrutura do Projeto

text

src/
├── adapters/                 # Adaptadores para frameworks externos
│   ├── repository/          # Implementações concretas dos repositórios
│   └── rest/               # Controladores HTTP
├── application/             # Casos de uso da aplicação
│   ├── category/
│   ├── menu/
│   ├── product/
│   └── promotion/
├── domain/                  # Lógica de negócio central
│   ├── entities/           # Entidades do domínio
│   ├── services/           # Serviços de domínio
│   ├── value-objects/      # Objetos de valor
│   └── dto/               # Data Transfer Objects
├── ports/                  # Portas (interfaces)
│   └── repository/         # Contratos dos repositórios
├── infra/                  # Infraestrutura
│   └── database/          # Conexão com banco
├── config/                 # Configurações
└── shared/                 # Utilitários compartilhados

## 🛠️ Tecnologias

- **Runtime**: Node.js
    
- **Linguagem**: TypeScript
    
- **Framework Web**: Express
    
- **Banco de Dados**: PostgreSQL
    
- **ORM**: Prisma (apenas migrations)
    
- **Query Builder**: SQL puro (requisito do desafio)
    
- **Containerização**: Docker + Docker Compose
    
- **Logging**: Pino
    
- **Testes**: Jest
    
- **Linting**: ESLint
    

## 📋 Requisitos Atendidos

### ✅ Obrigatórios

- Desenvolvido em TypeScript
    
- Framework não-opinado (Express)
    
- Banco SQL (PostgreSQL) com consultas em SQL puro
    
- ORM apenas para migrations (Prisma)
    
- CRUD completo de produtos
    
- CRUD completo de promoções
    
- Cardápio consolidado
    
- Controle de visibilidade de produtos
    
- Promoções com horários e dias específicos
    

### 🔄 Opcionais (Em Desenvolvimento)

- Ordenação de produtos no cardápio
    
- Tratamento de timezone
    

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
    
- Node.js 18+
    

### 1. Clone o repositório

bash

git clone <repository-url>
cd goomer-menu-api

### 2. Execute com Docker

```bash
docker-compose up -d
```

### 3. Execute as migrations

bash

npm run db:migrate

### 4. Execute a aplicação

bash

npm run dev

A API estará disponível em `http://localhost:3000`

## 🧪 Testes

bash

# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch

## 📚 Documentação da API

### Endpoints Principais

#### Produtos

- `GET /api/products` - Listar produtos
    
- `POST /api/products` - Criar produto
    
- `GET /api/products/:id` - Buscar produto
    
- `PUT /api/products/:id` - Atualizar produto
    
- `DELETE /api/products/:id` - Excluir produto
    

#### Promoções

- `GET /api/promotions` - Listar promoções
    
- `POST /api/promotions` - Criar promoção
    
- `GET /api/promotions/:id` - Buscar promoção
    
- `PUT /api/promotions/:id` - Atualizar promoção
    
- `DELETE /api/promotions/:id` - Excluir promoção
    
- `POST /api/promotions/:id/products` - Adicionar produtos à promoção
    
- `DELETE /api/promotions/:id/products` - Remover produtos da promoção
    

#### Categorias

- `GET /api/categories` - Listar categorias
    
- `POST /api/categories` - Criar categoria
    

#### Cardápio

- `GET /api/menu` - Obter cardápio consolidado
    

## 🎯 Exemplos de Uso

### Criar um produto

bash

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cerveja Artesanal",
    "price": 22.50,
    "category": "Bebidas",
    "visible": true
  }'

### Criar uma promoção

bash

curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Happy Hour - 20% off",
    "discountPercentage": 20,
    "validDays": ["MON", "TUE", "WED", "THU", "FRI"],
    "timeRange": {
      "start": "17:00",
      "end": "19:00"
    },
    "validUntil": "2024-12-31T23:59:59.000Z",
    "products": ["prod-1", "prod-2"]
  }'

### Obter cardápio

bash

curl -X GET http://localhost:3000/api/menu

## 🔧 Configuração

### Variáveis de Ambiente

env

DATABASE_URL="postgresql://user:password@localhost:5432/goomer_menu"
PORT=3000
NODE_ENV=development

### Banco de Dados

As migrations são gerenciadas via Prisma:

bash

# Criar nova migration
npm run db:migrate:create

# Executar migrations
npm run db:migrate

# Reset do banco
npm run db:reset

## 🚧 Desafios e Problemas Encontrados

### Principais Dificuldades

1. **Complexidade do SQL puro**: Realizar todas as consultas manualmente em SQL aumentou significativamente a complexidade do desenvolvimento
    
2. **Arquitetura Hexagonal**: Implementar corretamente o padrão de Portas e Adaptadores em tempo hábil foi desafiador
    
3. **Mapeamento objeto-relacional**: Converter resultados de SQL puro para objetos de domínio mantendo a integridade
    
4. **Gestão de transações**: Garantir consistência em operações complexas sem um ORM
    

### Soluções Implementadas

1. **Repositórios especializados**: Cada entidade possui seu repositório com queries otimizadas
    
2. **Serviços de domínio**: Lógica de negócio centralizada e testável
    
3. **DTOs de resposta**: Separação clara entre entidades de domínio e dados de API
    
4. **Validações robustas**: Garantia de integridade dos dados em todos os níveis