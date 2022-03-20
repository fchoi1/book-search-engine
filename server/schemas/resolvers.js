const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
        return userData;
      }
      throw new AuthenticationError('User is not logged in');
    },
    users: async () => {
      return User.find().select('-__v -password');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).select('-__v -password');
    }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Incorrect credentials');

      const correctPW = await user.isCorrectPassword(password);
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
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: args } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError('User is not logged in');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError('User is not logged in');
    }
  }
};

module.exports = resolvers;
