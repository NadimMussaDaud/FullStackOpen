const _ = require('lodash'); // Make sure to import Lodash
const User = require('../models/user') 

const initialUsers = [
    {
        username: "lukao",
        name: "lucas",
        password: "lucaslukao",
    },
    {
        username: "daniels",
        name: "Daniel",
        password: "dans",
    },
    {
        username: "danyboy",
        name: "Daniel",
        password: "dunadanyboy131",
    },
    {
        username: "patts",
        name: "patricia",
        password: "patapatricia",
    }

]



const initialBlogs = [
                {
                    title: "CDN's",
                    author: "Iulia Malen",
                    url:"www.blogOnCDN.pt",
                    likes: 78,
                },
                {
                    title: "Arrays",
                    author: "Daniel Homes",
                    url:"www.java.co.mz",
                    likes: 121,
                },
                {
                    title: "Collections",
                    author: "Robert Van Hoopen",
                    url:"www.java.co.mz",
                    likes: 2,
                }
    ]


const mostBlogs = (blogs) => {
    const authorCount = _.countBy(blogs, 'author');
    const bestAuthor = _.keys(authorCount)[0]
    const bestCounter = authorCount[bestAuthor]
    return { author: bestAuthor, blogs: bestCounter }
}

const mostLikes = (blogs) => {

    if(!blogs) {return null}

    const mostLikesPeople = _.reduce(blogs, function(result, person) {
        const obj = result.find( p => p.author === person.author)
        obj ? obj.likes += person.likes : result.push({ author: person.author, likes: person.likes })
        return result;
      }, []);

    return _.reduce( mostLikesPeople, (highest, current) => {
        return (highest.likes >= current.likes) ? highest : current
    }, mostLikesPeople[0])
}

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    if(blogs.lenght === 0){return 0}

    return blogs.reduce( (acc, current) => {
        return acc + current.likes;
    }, 0)
}

const favoriteBlog = (blogs) => {

    if(blogs.length === 0) {return null}

    object = blogs.reduce( (highest, current) => {
        return (current.likes > highest.likes) ? current : highest
    }, blogs[0])

    return { 
            title: object.title, 
            author: object.author, 
            likes: object.likes 
            }
}

module.exports = {
    initialBlogs,
    initialUsers,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}