import mongoose from 'mongoose'

const args = process.argv
const password = args[2]
const argSize = args.length
const url = `mongodb+srv://Nadim:${password}@cluster0.uhsjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Contact = mongoose.model('Contact', contactSchema)

mongoose.connect(url).then( () => {

    mongoose.set('strictQuery', false)

    if(argSize > 3){

        const contact = new Contact({
            name : args[3],
            number : args[4],
        })
    
        contact.save().then(result => {
            console.log(`added ${contact.name} number ${contact.number} to phonebook`)
            mongoose.connection.close()
        })
    
    }else{
        Contact.find({}).then(result => {
            console.log("phonebook:")
            result.forEach( contact => {
                console.log(`${contact.name} ${contact.number}`)
            })
            mongoose.connection.close()
        })
    
    }

} )
.catch(err => {console.log(err.message)});




