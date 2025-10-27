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
- **Escopo de testes:** Unitários
- **Banco de dados:** PostgreSQL
- **ORM:** PrismaORM (somente migrations)
- **Containerização:** Docker com Docker Compose
- **Padrão de versionamento:** GitFlow
- **Ferramenta auxiliar de desenvolvimento:** ESLint
- **Logging:** Pino

## TODOS
### Products
- [ ] Delete use case
- [ ] Update use case 

### Category
- [ ] Delete use case
- [ ] Update use case 
- [ ] Create use case 
- [ ] Get use case 

### Promotion
- [ ] Delete use case
- [ ] Update use case 
- [ ] Create use case 
- [ ] Get use case 

### Exceptions
- [ ] Create and implement custom exceptions on all returns
