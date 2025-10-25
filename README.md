# Goomer Menu API

## Cenário do projeto
Decidi conduzir o projeto com o seguinte cenário fictício em mente:
1. Esta API irá crescer exponencialmente e se tornar o núcleo principal de um grande sistema ao longo dos anos (um backend core que irá ser o pivô do sistema ofertado aos clientes finais).
2. Com isso em mente, mesmo que hoje ela possua poucas funcionalidades concretas, será construída tendo como principal objetivo a **escalabilidade.** Com isso, fácil manutenção, facilidade de testes, baixo acoplamento e potencial de expansão estarão sendo a principal prioridade.

Com isso em mente, abaixo descrevo as decisões arquiteturais tomadas para suprir a demanda deste cenário.

## Decisões arquiteturais
- **Metodologia**: TDD (Test-Driven Design)
- **Padrão arquitetural:** Arquitetura Hexagonal (Portas e Adaptadores)
- **Linguagem e ambiente:** NodeJS, JavaScript e TypeScript
- **Framework:** Express
- **Ferramenta de testes:** Jest
- **Escopo de testes:** Unitário, Integração e E2E
- **Banco de dados:** PostgreSQL
- **ORM:** PrismaORM (somente migrations)
- **Autenticação:** State-less (JWT)
- **Containerização:** Docker com Docker Compose
- **Padrão de versionamento:** GitFlow
- **Ferramenta auxiliar de versionamento:** Lint-Staged
- **Ferramenta auxiliar de desenvolvimento:** Prettier e ESLint
- **Documentação da API:** Swagger
- **Bibliotecas importantes:** Zod, Husky
- **Logging:** Pino
- Rate Limit

### Padrão arquitetural escolhido

#### Arquitetura Hexagonal
Visando 
