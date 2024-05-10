const { User, Post, Attachment } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate('posts');
    },
    posts: async () => {
      return await Post.find({}).limit(2000);
    },
    attachments: async () => {
      return await Attachment.find();
    },
    getAttachment: async (_, { id }) => {
      return await Attachment.findById(id);
    }
  },
  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    createPost: async (_, { input }) => {
      try {
        // Create a new post
        const post = new Post({
          user: input.user,
          message: input.message,
          timestamp: new Date().toISOString()
        });

        const newPost = await post.save();

        // Create an attachment and associate it with the post
        const attachment = await Attachment.findOne(); // Assuming there's only one attachment, you might need to adjust this based on your actual data structure
        if (!attachment) {
          // If there's no attachment yet, create a new one
          const newAttachment = new Attachment({
            posts: [newPost._id]
          });
          await newAttachment.save();
        } else {
          // If attachment exists, add the new post to its posts array
          attachment.posts.push(newPost._id);
          await attachment.save();
        }

        return newPost;
      } catch (error) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
    },
    deletePost: async (_, { id }) => {
      try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (deletedPost) {
          return { success: true, message: "Post deleted successfully." };
        } else {
          return { success: false, message: "Post not found." };
        }
      } catch (error) {
        throw new Error(`Failed to delete post: ${error.message}`);
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (deletedUser) {
          return { success: true, message: "User deleted successfully." };
        } else {
          return { success: false, message: "User not found." };
        }
      } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers;