var express = require("express");
var mongoose = require("mongoose");
var parser = require("body-parser");
var app = express();
var methovrd = require("method-override");
var sanitizer = require("express-sanitizer")

//mongoose.connect('mongodb://localhost/restfulBlog');
 mongoose.connect('mongodb://blogger:my0blog@ds015584.mlab.com:15584/restful_blog');


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(parser.urlencoded({extended:true}));
app.use(sanitizer());
app.use(methovrd("_method"))

var blogSchema = mongoose.Schema({
    header: String,
    img:  {type: String, default: 'http://40.media.tumblr.com/tumblr_lrlxj6CKLq1qjtn5jo1_500.jpg'},
    bd: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);


//Routes

// Blog.create({
//     header:"demo",
//     bd: "demo so we have something to look at."
// })

app.get('/', function(req, res){
    res.redirect('/blogs')
})
app.get('/blogs', function(req, res){
Blog.find({}, function(err, found){
    if(err){
        console.log('ahhh nooo!', err);
    }else{
        res.render("index", {blogs: found})
    }
})
    
})


app.get('/blogs/new', function(req,res){
    res.render('new');
})


app.post('/blogs', function(req,res){
    console.log("bf:",req.body);
    req.body.blog.bd=req.sanitize(req.body.blog.bd)
    console.log("af:",req.body);
    Blog.create(req.body.blog, function(err,nblog){
        if(err){
            res.render('new');
        }else{
            res.redirect('/blogs')
        }
    })
})


app.get('/blogs/:id', function(req,res){
    
    Blog.findById(req.params.id, function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render('show', {b:foundblog});
        }
    })
    
})


app.get('/blogs/:id/edit', function(req,res){
    
    Blog.findById(req.params.id, function(err,foundblog){
        if(err){
            console.log("Uh oh!!!", err)
            res.redirect("/blogs");
        }else{
            res.render('edit', {b:foundblog});
        }
    })
       
    
})


app.put('/blogs/:id',function(req,res){
        console.log("bf:",req.body);
    req.body.blog.bd=req.sanitize(req.body.blog.bd)
    console.log("af:",req.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,upblog){
        if(err){console.log("SHIT!", err), res.redirect('/')}
        else{res.redirect("/blogs/"+req.params.id)}
    })
})


app.delete('/blogs/:id', function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){console.log("SHIT!", err), res.redirect('/')}
        else{res.redirect("/blogs")}
    })
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog App Server Up!");
})