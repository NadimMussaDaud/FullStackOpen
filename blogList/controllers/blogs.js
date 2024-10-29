const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')

  response.json(blogs)  
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.user)

  if(!body.url || !body.title){
    return response.status(400).json({error: "title or url missing"})
  }else{  
    const blog = await new Blog(body).save()
    
    // Updating the users info 
    user.blogs = user.blogs.concat(blog._id.toString())
    await user.save()

    return response.status(201).json(blog)
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  
  if(!blog){
    return response.status(404).json({error: "Blog not found"})
  }
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, runValidators: true})

  if(!updatedBlog){
    return response.status(404).end()
  }
  response.json(updatedBlog)
})


module.exports = blogsRouter
