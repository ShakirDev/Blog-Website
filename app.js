const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const _ = require('lodash');

const app = express();
const port = 3000;

const homePageStaticContent =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
const aboutContent =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.";
const contactContent =
  "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.";

  //Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//golobal variables
let posts = []




// Set content type for static files
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  switch (ext) {
    case ".css":
      res.contentType("text/css");
      break;
    case ".js":
      res.contentType("application/javascript");
      break;
    default:
      break;
  }
  next();
});

// Handle homepage route
app.get("/", (req, res) => {
  res.render("home", {
    homeContent: homePageStaticContent,
    posts: posts 
  });
});

// Handle about page route
app.get("/about", (req, res) => {
  res.render("about.ejs", {
    homeContent: aboutContent,
  });
});


// Handle contact page route
app.get("/contact", (req, res) => {
    res.render("contact.ejs", {
      contactContent: contactContent,
    });
  });

app.get("/compose", (req, res)=>{
    res.render("compose.ejs")

})

//handle /compose post request
app.post("/compose", (req, res) => {
    const postTitle = req.body.title;
    const postBody = req.body.formbody;
    const postImage = req.body.image;
  
    // Create a post object to store the data
    
    const post = {
      title: postTitle,
      body: postBody,
      image: postImage
    };
    posts.push(post);
    res.redirect("/");
  });


//route parameter
app.get('/posts/:singlePost', (req, res) => {
    const singlePost = _.kebabCase(req.params.singlePost);
    let matchFound = false;
  
    posts.forEach((post) => {
      if (_.kebabCase(post.title) === singlePost) {
        matchFound = true;
        res.render("singlePost.ejs", {
          post: post, // Pass the post object to the template
        });
      }
    });
  
    if (!matchFound) {
      console.log("No Match Found!");
    }
  });
// Handle post.ejs request
app.get("/posts", (req, res) => {
    if (posts.length > 0) {
      res.render("post.ejs", {
        posts: posts // Pass the posts array to the template
      });
    } else {
      // Handle the case when no posts are available
      res.send("404 Nothing Found.");
    }
  });





//Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
