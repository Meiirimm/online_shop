const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/shop').then(() => {
    console.log('Connected to mongoDB');
}).catch((e) => {
    console.log('Failed to connect to mongoDB');
})

const ShopSchema = new mongoose.Schema({
    title: String,
    price: String,
    sale: String,
    url: String,
})

const Shop = mongoose.model("shop" , ShopSchema)

app.use(express.urlencoded())
app.use(express.static(__dirname + '/public'))
app.post('/new' , async(req, res) => {
    if(req.body.title.length != 0){
        await new Shop({
            title: req.body.title,
            price: req.body.price,
            sale: req.body.sale,
            url: req.body.url,
        }).save()
        res.redirect('/')    
    }else{
        res.redirect('/new?error=1')
    }
})

app.post('/edit' , async(req, res) => {
    await Shop.updateOne(
        {_id: req.body.id},
        {
            title: req.body.title,
            price: req.body.price,
            sale: req.body.sale,
            url: req.body.url,
        }
    )
    res.redirect('/')
})

app.delete('/delete/:id' , async(req, res) => {
    // console.log(req.params.id);
    await Shop.deleteOne({_id: req.params.id})
    res.status(200).send('ok')
})

app.set("view engine" , "ejs")
app.use(express.static(__dirname + '/public'))

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

app.get('/', async(req, res) =>{
    const data = await Shop.find()
    res.render('index' , {data})
})

app.get('/edit/:id' , async(req, res) => {
    const shopData = await Shop.findById(req.params.id)
    res.render('edit' , {data: shopData})
})

app.get('/new' , (req, res) => {
    res.render('new')
})