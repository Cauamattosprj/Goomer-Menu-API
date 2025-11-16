**Esse projeto foi um estudo de aplicação de arquitetura hexagonal em ecossistema NodeJS. Essa arquitetura não é adequada para projetos pequenos.**

## 📋 Cenário do Projeto

Decidi conduzir o projeto com o seguinte cenário fictício em mente:

1. Esta API irá crescer exponencialmente e se tornar o núcleo principal de um grande sistema ao longo dos anos
    
2. Será construída tendo como principal objetivo a **escalabilidade** - fácil manutenção, facilidade de testes, baixo acoplamento e potencial de expansão

Com isso em mente, a decisão da arquitetura hexagonal foi visando trazer o mínimo de acoplamento possível para o código, onde cada meio de contato com o "mundo exterior" do código foi feito através de portas (interfaces) implementadas através de adaptadores (uma camada adicional entre o core e o exterior ou uma implementação concreta de uma interface (porta) já definida).

Também foram criados DTOs para padronizar o retorno da API, com DTOs para as próprias entidades.
Um middleware para realizar o logging das requisições com Pino também foi criado. Assim, cada requisição HTTP gera um log com request e return e informações importantes para debug.

### Fluxo de dados típico
1. Requisição HTTP (mundo externo) -> ProductController (Adaptor de entrada. Nesse caso, não possui uma porta (interface) já estabelecida, mas serve o mesmo propósito dos demais adaptadores)
2. Validação -> CreateProductUseCase (Camada de aplicação)
3. Regras de Negócio -> ProductService (Serviços de domínio)
4. Persistência -> PostgresProductRepository (Adapter de Saída)
5. Resposta -> ProductDTO -> ApiResponseDTO -> Retorno HTTP

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
-  **Repositórios especializados**: Cada entidade possui seu repositório com queries em SQL puro
-  **DTOs de resposta**: Separação entre entidades e dados retornados da API
    

### 🔄 Melhorias possíveis (não implementadas)

- Ordenação personalizada de produtos no cardápio    
- Tratamento de timezone para diferentes regiões    
- Documentação Swagger/OpenAPI
- Testes de integração e E2E
    

## 📁 Estrutura do Projeto

text

```bash

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

```
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
    

## 📋 Funcionalidades

- Desenvolvido em TypeScript
    
- Express
    
- Banco Relacional em SQL (PostgreSQL) com consultas em SQL
    
- ORM apenas para migrations
    
- CRUD completo de produtos
    
- CRUD completo de promoções
    
- Cardápio final consolidado
        
- Promoções com horários e dias específicos
- Teste unitários com Jest
    

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
    
- Node.js 18+
    

### 1. Clone o repositório
```bash
git clone git@github.com:Cauamattosprj/NodeJS-Restaurant-Menu-API.git
cd restaurant-menu-api
```

### 2. Execute com Docker

```bash
docker-compose up -d
```

A API estará disponível em `http://localhost:3000`

## 🧪 Testes

# Testes unitários
Basta executar `npm run test` e ele já irá rodar os testes do Jest com a opção de coverage habilitada.

## 📚 Documentação da API
### Importar no Postman
Dentro do repositório, você encontrará o arquivo `restaurant-menu-api.postman_collection.json`, onde já haverá uma collection do Postman pronta para você importar e testar as rotas.

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
  
## 🚧 Desafios e Problemas Encontrados

### Principais Dificuldades

1. **Complexidade do SQL puro**: Realizar todas as consultas manualmente em SQL aumentou significativamente a complexidade do desenvolvimento
    
2. **Arquitetura Hexagonal**: Implementar corretamente o padrão de Portas e Adaptadores dentro do prazo foi um desafio
    
3. **Mapeamento de retornos das queries**: Converter resultados de SQL puro para objetos de domínio mantendo a integridade dos dados foi algo que também precisou ser bastante testado
    
4. **Gestão das operações da API**: Garantir consistência em operações complexas sem ORM foi bastante desafiador também

    
