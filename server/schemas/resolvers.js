const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');
        return userData;
      }
      throw new AuthenticationError('User is not logged in');
    }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Incorrect credentials');

      const correctPW = await User.isCorrectPassword(password);
      if (!correctPW) throw new AuthenticationError('Incorrect credentials');

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const book = await Book.create(args);
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book._id } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError('User is not logged in');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({ bookId });
        const user = await User.findOneAndUpdate(
          { _id: user.context._id },
          { $pull: { savedBooks: book._id } },
          { new: true }
        );
      }
      throw new AuthenticationError('User is not logged in');
    }
  }
};

module.exports = resolvers;
