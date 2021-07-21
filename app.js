const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product');
const Category = require('./models/category');

mongoose.connect('mongodb://localhost:27017/farms', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const categories = ['fruit', 'vegetable', 'dairy']

// category route

app.get('/categories', async (req, res) => {
    const cats = await Category.find({});
    res.render('categories/index', { cats })
})

app.get('/categories/new', (req, res) => {
    res.render('categories/new')
});

app.post('/categories', async (req, res) => {
    const cat = new Category(req.body);
    await cat.save();
    res.redirect(`/categories/${cat._id}`);
})

app.get('/categories/:id', async (req, res) => {
    const cat = await Category.findById(req.params.id).populate('products');
    // console.log(cat)
    res.render('categories/show', { cat })
})

app.get('/categories/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const cat = await Category.findById(id);
    res.render('products/new', { categories, cat });
})

app.post('/categories/:id/products', async (req, res) => {
    const { id } = req.params;
    const cat = await Category.findById(id);
    const { name, qty, price, leftQty, category } = req.body;
    const product = new Product({ name, qty, price, leftQty, category });
    cat.products.push(product);
    product.cat = cat;
    await cat.save();
    await product.save();
    res.redirect(`/categories/${cat._id}`);
})

app.delete('/categories/:id', async (req, res) => {
    // console.log('deleting!!!')
    const farm = await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
})


//product Route
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: "ALL" });
    }
});

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('categories', 'name');
    // console.log(product);
    res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log('App is listening!!');
})