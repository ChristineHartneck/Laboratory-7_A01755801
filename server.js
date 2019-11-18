
let express = require( "express" );
let morgan = require( "morgan" );
let bodyParser = require( "body-parser" ); //caching the bodyformat to a jsonformat
let uuid = require ( "uuid/v4" );

let app = express();
let jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false}));
app.use (jsonParser);


app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );

/*const post = {
	id: uuid.v4(),
	title: string,
	content: string,
	author: string,
	publishDate: Date
}*/

let blog_posts = [{
	id : uuid(),
	title : "First-Blog",
	content : "Hello, my name is...",
	author : "Christine",
	publishDate: new Date(2019, 10, 25)
},
{
	id : uuid(),
	title : "Blog",
	content : "Hey, how are you?",
	author : "Brain",
	publishDate: new Date(2019, 10, 26)
},
{
	id : uuid(),
	title : "Blog-3",
	content : "I like..",
	author : "Fabian",
	publishDate: new Date(2019, 10, 27)
}];
app.get( "/api/blog-posts", ( req, res, next ) => {
	return res.status( 200 ).json( blog_posts );
});

app.get( "/api/blog-post", ( req, res, next ) => {
	let author = req.query.author;
	if (!author){
		return res.status( 406 ).json(
		{message : "Missing author on query!",
		status : 406
	});
}
//filtering the blog posts by looking throw each element by matching author
	let responseArray = blog_posts.filter(elem => elem.author == author);
	if (responseArray.length == 0){
		return res.status( 404 ).json(
		{message : "Author doesn't exist!",
		status : 404
	});
}

	return res.status( 200 ).json( responseArray );
});



app.post( "/api/blog-posts", jsonParser, ( req, res, next ) => {
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;

console.log(title);
console.log(content);
console.log(author);
console.log(publishDate);
console.log(req.body)

	if ( ! title || ! content || ! author || !publishDate ){
		res.statusMessage = "Missing all fields in body!";
		return res.status( 406 ).json({
			message : "Missing all fields in body!",
			status : 406
		});
	}


	let newPost = {
		id : uuid(),
		title : title,
		content: content,
		author: author,
		publishDate: new Date(publishDate)

	};

	blog_posts.push( newPost );

	return res.status( 201 ).json({
		message : "New post is created",
		status : 201,
		posts : newPost
	});


});

app.delete("/api/blog-posts/:id", (req, res) =>{
	let id = req.params.id;
	for (let i=0; i<blog_posts.length; i++){
		if (blog_posts[i].id == id){
			blog_posts.splice(i, 1); //i position/index, number of items to delete

			return res.status(200).json({
				message : "Post successful deleted!",
				status : 200
			});
		}
	}

	return res.status(404).json({
		message: "ID of the post doesn't exist!",
		status: 404
	});

});

app.put("/api/blog-posts/:id", jsonParser, (req, res) => {
	let id = req.body.id;
	let id2 = req.params.id;
console.log(req.body);
console.log(req.params);
//check if the ID's exists
	if(!id || !id2) {
		res.statusMessage = "Missing the ID!";
		return res.status(406).json({
			message: "Missing the ID!",
			status: 406
		});
	}

// check if the ID's are the same
if (id != id2){
	res.statusMessage = "The ID's are different!";
	return res.status(409).json({
		message: "The ID's are different!",
		status: 409
	});
}

let postInfo = req.body;
for (let i=0; i<blog_posts.length; i++){
	if (blog_posts[i].id == id){
		let currentPost = blog_posts[i]
		console.log(currentPost)
		console.log(postInfo)
		let newPost = currentPost
		if(postInfo.title)
			newPost.title = postInfo.title

		if(postInfo.content)
			newPost.content = postInfo.content

		if(postInfo.author)
			newPost.author = postInfo.author

		if(postInfo.publishDate)
			newPost.publishDate = postInfo.publishDate

		blog_posts[i] = newPost
		console.log(currentPost)

		return res.status(202).json(currentPost);
	}
}

return res.status(404).json({
	message: "ID of the post doesn't exist!",
	status: 404
});

});





app.listen( "8181", () => {
	console.log( "App is running on port 8181" );
});
