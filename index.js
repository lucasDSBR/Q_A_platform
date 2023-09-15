const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');

//Models
const QuestionModel = require('./models/Question');
const ResponseModel = require('./models/Response');
//Database
connection.authenticate().then(() => {
	console.log("Connection with database OK");
}).catch((erro) => {
	console.log(erro);
});


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get("/", (req, res) => {
	QuestionModel.findAll({ raw: true, order: [['id', 'DESC']]}).then(questions => {
		res.render('index', {
			questions: questions
		});
	});

});
app.get("/newquestion", (req, res) => {
	res.render('newquestion');
});

app.post("/savequestion", (req, res) => {
	let title = req.body.title;
	let description = req.body.description
	QuestionModel.create({
		title: title,
		description: description
	}).then(() => {
		res.redirect('/');
	}).catch((error) => {
		console.log('erro:'+error)
	})
});

app.get("/question/:id", (req, res) => {
	var id = req.params.id;
	QuestionModel.findOne({ where: {id: id} })
	.then(question => {
		if(question != undefined){
			ResponseModel.findAll({
				where: { questionId: question.id },
				order: [['id', 'DESC']]
			}).then(responses => {
				res.render('question', {
					responses: responses,
					question: question
				});
			});
		}
		else res.redirect('/');
	}).catch(() =>{

	});
})

app.post("/respond", (req, res) => {
	var bodyResponse = req.body.bodyResponse;
	var questionId = req.body.questionId
	ResponseModel.create({
		body: bodyResponse,
		questionId: questionId
	}).then(() => {
		res.redirect(`/question/${questionId}`);
	}).catch((error) => {
		console.log('erro:'+error)
	});

})

app.listen(8080, (error) => {
	console.log("Server OK");
});