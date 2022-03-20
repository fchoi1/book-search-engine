import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        username
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        _id
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation Mutation(
    $authors: [String!]!
    $description: String!
    $title: String!
    $bookId: String!
    $image: String!
    $link: String
  ) {
    saveBook(
      authors: $authors
      description: $description
      title: $title
      bookId: $bookId
      image: $image
      link: $link
    ) {
      username
      _id
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation Mutation($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
      }
    }
  }
`;
