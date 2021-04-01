const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const users = require("./users.json");
const posts = require("./posts.json");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getOneUser(id: Int): User
    getAllUser: [User]
    getAllPost(id: Int): [Post]
  }

  type Mutation {
    createNewUser(name: String,age: Int!,email: String,phon: String!,internationalCode: String): User
    updateAUser(id: Int,name: String,age: Int!,email: String,phon: String!,internationalCode: String): User
    deleteAUser(id: Int): error
  }
  type error {
    message: String
  }
  type User {
    name: String
    age: Int
    admin: Boolean
    email: String
    phon: String
    internationalCode: String
  }

  type Post {
    title: String
    publishDate: String
    resources: String
    detail: String
    users: User @deprecated(reason: "use user")
    user: User
  }
`;

const resolvers = {
  Query: {
    getOneUser: (args) => {
      const user = users.find((item) => item.id === args.id);
      if (!user) {
        throw "Not Found";
      }
      return user;
    },
    getAllUser: () => {
      return users;
    },
    getAllPost: (args) => {
      return posts;
    },
  },
  Mutation: {
    createNewUser: (parents,args) => {
      const newUser = {...args,id: NewId(users)};
      users.push(newUser);
      return newUser;
    },
    updateAUser: (parents,args) => {
      const userIndex = users.findIndex(item=> item.id === args.id);
      users[userIndex] = {...users[user],...args}
      return users[userIndex] ;
    },
    deleteAUser: (parents,args) => {
      const userIndex = users.findIndex(item=> item.id === args.id);
      users.splice(userIndex,1);
      return {message:"deleted successfully"};
    },
  },
  Post: {
    user: (parent, args) => {
      return users.find((item) => item.id === parent.userId);
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

app.get("/", (req, res) => {
  res.send("hello");
});
server.applyMiddleware({ app });
app.listen(3232, () => {
  console.log("Connect To Server.....");
});

const NewId = (list = [])=>{
  const lastItem = list[list.length-1]
  return lastItem.id + 1
}