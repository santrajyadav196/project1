const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farms', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// const p = new Product({
//     name: 'dairy milk',
//     qty: 10,
//     price: 2,
//     leftQty: 3,
//     category: 'dairy'
// })
// p.save()
//     .then(p => {
//         console.log(p)
//     })
//     .catch(e => {
//         console.log(e)
//     })

const seedProducts = [
    {
        name: 'apple',
        qty: 100,
        price: 4,
        leftQty: 76,
        category: 'fruit'
    },
    {
        name: 'mango',
        qty: 12,
        price: 5,
        leftQty: 10,
        category: 'fruit'
    },
    {
        name: 'dairy bar',
        qty: 100,
        price: 10,
        leftQty: 22,
        category: 'dairy'
    },
    {
        name: 'carrot',
        qty: 10,
        price: 1.50,
        leftQty: 6,
        category: 'vegetable'
    },
    {
        name: 'broccoli',
        qty: 5,
        price: 30,
        leftQty: 4,
        category: 'vegetable'
    },
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })