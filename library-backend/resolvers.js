const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()
const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author")
      }

      if (!args.author) {
        return Book.find({
          genres: { $in: args.genre }
        }).populate("author")
      }

      let author
      if (args.author) {
        author = await Author.findOne({
          name: args.author
        })
      }

      if (!args.genre) {
        return Book.find({
          author: { $in: author.id }
        }).populate("author")
      }

      return Book.find({
        $and: [
          {author: { $in: author.id }},
          {genres: { $in: args.genre }}
        ]
      }).populate("author")
    },
    allGenres: async () => {
      let categories = []
      const books = await Book.find({})
      books.forEach(b => {
        categories.push(...b.genres)
      })
      return categories.filter((item, index) => categories.indexOf(item) === index)
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author})

      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null,
          books: []
        })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author,
        genres: args.genres
      })

      author.books = author.books.concat(book)
      await author.save()

      try {
        book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({  name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre
      })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== process.env.PASSWORD ) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
  Author: {
    bookCount: async (root) => root.books.length
  }
}

module.exports = resolvers