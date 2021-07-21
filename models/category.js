const mongoose = require('mongoose');
const Product = require('./product')
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

categorySchema.post('findOneAndDelete', async function (data) {
    if (data.products.length) {
        const res = await Product.deleteMany({ _id: { $in: data.products } })
        console.log(res);
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;