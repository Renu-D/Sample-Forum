const express = require('express');
const router = express.Router();
const userService = require('./service');

// routes
router.post('/login', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/getUsername', getUsername);
router.get('/:id', getById);
router.put('/updateProfile', update);
router.delete('/:id', _delete);
router.delete('/posts/deletePost/:id',deletePost);
router.post('/posts/addPost',addPost); //creating post
router.get('/posts/getPost/:id',getPost);
router.get('/posts/viewPosts',viewPosts);
router.get('/posts/viewMyPosts',viewMyPosts);
router.post('/posts/:id/addComment',addComment);
router.delete('/posts/:postId/deleteComment/:commentId',deleteComment);
router.put('/changePassword',changePassword);
//router.post('/posts/addComment',addComment);
//router.get('/posts/viewComments',viewComments);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user.token) : res.status(401).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({message: "Successfully registered"}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getUsername(req, res, next) {
    //console.log(req.user.sub);
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user.username) : res.sendStatus(404))
        .catch(err => next(err));
}

function getCurrent(req,res,next) {
    //console.log(req.user.sub);
    userService.getById(req.user.sub)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/*function getUser(req,res,next) {
    userService.getById(req.params.id)
    .then(user => user ? res.json(user.username) : res.sendStatus(404))
    .catch(err => next(err));
}*/

function update(req, res, next) {
    userService.update(req.user.sub, req.body)
        .then(() => res.status(200).json({message:"Successfully updated"}))
        .catch(err => next(err));
}

function changePassword(req,res,next) {
    userService.changePassword(req.user.sub,req.body)
        .then(() => res.status(200).json({ message: "Successfully changed" }))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deletePost(req,res,next) {
    //console.log("accessing");
    userService.deletePost(req.user.sub,req.params.id)
        .then(() => res.status(200).json({message:"Successfully deleted"}))
        .catch(err => next(err));
}

function deleteComment(req,res,next) {
    userService.deleteComment(req.user.sub,req.params)
        .then(() => res.status(200).json({ message: "Successfully deleted" }))
        .catch(err => next(err));
}
function addPost(req,res,next) {
    userService.addPost(req,req.body)
    .then(() => res.status(200).json({message: "Successfully posted"}))
    .catch(err => next(err));
}

function getPost(req,res,next) {
    userService.getPost(req.params.id)
    .then(post => post ? res.json(post) : res.status(404).json({message: "Data not found"}))
    .catch(err => next(err));
}

function viewPosts(req,res,next) {
    userService.viewPosts()
    .then(posts => res.json(posts))
    .catch(err => next(err));
}

function viewMyPosts(req,res,next) {
    userService.viewMyPosts(req.user.sub)
    .then(posts => res.status(200).json(posts))
    .catch(err => next(err));
}

function addComment(req,res,next) {
    userService.addComment({
        text: req.body.text,
        onArticle: req.params.id,
        commentBy: req.user.sub
    })
    .then(() => res.status(200).json({message: "Successfully commented"}))
    .catch(err => next(err));
}

/*function viewComments(req,res,next) {
    userService.viewComments()
    .then(comments => {res.status(200).json(comments)})
    .catch(err => next(err));
}*/