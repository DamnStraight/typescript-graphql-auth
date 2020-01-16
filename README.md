# typescript-graphql-auth

Intended to be used as a base for any future small projects I decide to use with a node/graphql authenticated backend. 
Pretty opinionated implementation, not barebones at all, but feel free to use it or take a look if you're interested.

Features/Stack:
- Typescript
- TypeORM
- type-graphql with authentication middleware configured
- JWT-authentication with a redis blacklist for token rejection
- Dependency injection using typedi
- Joi validation middleware
