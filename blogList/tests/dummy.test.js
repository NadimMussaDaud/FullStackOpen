const { test, describe , after, beforeEach } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach( async () => {
  await User.deleteMany({})

  const userPromises = listHelper.initialUsers.map(async user => {
    return await api.post('/api/users').send(user)
  })
  await Promise.all(userPromises)
})

beforeEach( async () => {
  await Blog.deleteMany({})

  const user = await User.aggregate([{ $sample: { size: 1 } }]);

  const blogsToInsert = listHelper.initialBlogs.map(blog => ({...blog, user: user[0]._id.toString()}))

  for (const blog of blogsToInsert){
      await api
          .post('/api/blogs')
          .send(blog)
          .expect(201) 
  }
  //const blogsPromises = blogsToInsert.map(async (blog) => {
  //  const response = await api
  //           .post('/api/blogs')
  //          .send(blog)
  //          .expect(201)

   // console.log("DEBUGGING: \n This is the blog created: ", response.body)
   // return response.body
  //})

  //console.log("DEBUGGING: \n These are the promises: ", blogsPromises)

  //const createdBlogs = await Promise.all(blogsPromises)

  //console.log("Created blogs", createdBlogs)
})


test.only('right amount of JSON blogs', async () => {
  const response = await api.get('/api/blogs')
  const response2 = await api.get('/api/users')

  //console.log(response.body) //Debug
  //console.log(response2.body) //Debug


  assert(response.body.length, 2)
})

test.only('unique identifier with name "id" ', async () => {
  const response = await api.get('/api/blogs')
  const fields = Object.keys(response.body[0])

  assert(fields.includes('id'))
})

test.only('post works correctly ', async () => {
  const response1 = await api.get('/api/blogs')

  const user = await User.aggregate([{ $sample: { size: 1 } }]);

  const newBlog = {
      title: "Content Delivery Networks",
      author: "Jean Pierre",
      url: "www.blogsByJean.co.mz",
      likes: 111,
      user: user[0]._id.toString()
  }

  await api
   .post('/api/blogs')
   .send(newBlog)
   .expect(201)

  const response2 = await api.get('/api/blogs')

  assert.strictEqual(response2.body.length, response1.body.length + 1)
})

test.only('default like set to 0', async () => {

  const user = await User.aggregate([{ $sample: { size: 1 } }]);

  const newBlog = {
      title: "Content Delivery Networks",
      author: "Jean Pierre",
      url: "www.blogsByJean.co.mz",
      user: user[0]._id.toString()
  }

  const response = await api
   .post('/api/blogs')
   .send(newBlog)
   .expect(201)

  
  assert.strictEqual(response.body.likes, 0)
})

test.only('bad request expected 400', async () => {
  const user = await User.aggregate([{ $sample: { size: 1 } }]);

  const badBlog = {
      author: "Khabib Nurmagomedov",
      url: "www.khabib.com",
      likes: 11111,
      user: user[0]._id.toString()
  }

  const response = await api
   .post('/api/blogs')
   .send(badBlog)
   .expect(400)

  assert.strictEqual(response.body.error,"title or url missing")
})

test.only('deleting one resource', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
   .delete(`/api/blogs/${blogToDelete.id}`)
    
  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})


test.only("updating a blog's likes number", async () => {
  const blogs = await Blog.find({})
  const blogToUpdate = blogs[0]

  const updatedBlog = {
      ...blogToUpdate, likes: 1000
  }

  const response = await api
   .put(`/api/blogs/${blogToUpdate.id}`)
   .send(updatedBlog)

  assert.deepStrictEqual(response.body.likes, updatedBlog.likes)
})


after(async () => {
  await mongoose.connection.close()
})

test.only('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


describe.only('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]
  
    test.only('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  })

  describe.only('favorite blog', () => {

    const blogs = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        },
        {
            _id: '5a422aa71b54a676',
            title: 'Arrays',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 10,
            __v: 0
          }
      ]

      test.only('list with 2 blogs', () => {
          const result = listHelper.favoriteBlog(blogs)
          assert.deepStrictEqual(result, {title: 'Arrays', author: 'Edsger W. Dijkstra', likes: 10})
      })
  })

describe('most number of blogs and likes', () => {

  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
        _id: '5a422aa71b54a676',
        title: 'Arrays',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676',
        title: 'Numbers',
        author: 'Mario Pennali',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 100,
        __v: 0
      }
  ]


    test.only('biggest number of blogs with 3', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 2 })
    })

    test.only('most liked author', () => {
      const result = listHelper.mostLikes(blogs)
      assert.deepStrictEqual(result, { author: "Mario Pennali", likes: 100 })
    })
  })
