import { buildSchema } from "graphql";
import express from "express";
import { graphqlHTTP } from "express-graphql";

// Data hårdkodad in vår kod istället för att hämta från en databas
//............//
export const users = [
  { id: 1, name: "banan", email: "Kurt@gmail.com" },
  { id: 2, name: "apelsin", email: "Sofia@gmail.com" },
  { id: 3, name: "Äpple", email: "Bruce@gmail.com" },
];

// Schema
//--------------------//
export const schema = buildSchema(`
    type Query {
        getUser(id: Int!): User
        getUsers: [User]
    }

    type User {
        id: Int!
        name: String!
        email: String!
    }

    input UserInput {
        name: String!
        email: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }
`);
//--------------------//

type User = {
  id: number;
  name: string;
  email: string;
};
type UserInput = Pick<User, "name" | "email">;

// Resolver

const getUser = (args: { id: number }): User | undefined =>
  users.find((user) => user.id === args.id);

const getUsers = (): User[] => users;

const createUser = (args: { input: UserInput }): User => {
  const user = {
    id: users.length + 1,
    ...args.input,
  };
  users.push(user);
  return user;
};

const updateUser = (args: { user: User }): User => {
  const index = users.findIndex((user) => user.id === args.user.id);
  const targetUser = users[index];

  if (targetUser) users[index] = args.user;

  return targetUser;
};

const root = {
  getUser,
  getUsers,
  createUser,
  updateUser,
};
//------------------//

// Server

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 3000;

app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
