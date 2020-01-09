//Nothing added here...
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../controllers/db');
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    changePassword,
    addPost,
    getPost,
    viewPosts,
    viewMyPosts,
    addComment,
    deletePost,
    deleteComment
    //delete: _delete
    //viewComments
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {

    //if(!userParam.firstName || !userParam.lastName || !userParam.username || !userParam.password)
    //    throw "All fields are required!";
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }


    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);
    //console.log(user);

    // validate
    if (!user) throw 'User not found';
    if (!userParam.firstName && !userParam.lastName && !userParam.username) throw 'Atleast one field is required!';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function changePassword(userToken,userParam) {
    const user = await User.findById(userToken);

    if(!user) throw 'User not found';

    if(!userParam.oldPassword || !userParam.newPassword)
        throw "Old or New Password is required!";

    if(!bcrypt.compareSync(userParam.oldPassword,user.hash))
        throw 'Password is incorrect';
    
    if(bcrypt.compareSync(userParam.newPassword,user.hash))
        throw 'Old Password and new Password both are same';

    user.hash = bcrypt.hashSync(userParam.newPassword, 10);
    

    user.hash = bcrypt.hashSync(userParam.newPassword, 10);
    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function deletePost(userToken,postId) {
    const user = await User.findById(userToken);

    if(!await Post.findOne({_id:postId,author:user._id}))
        throw "Post not found or You can't delete it";
    
    //delete comments on that post first
    await Comment.deleteMany({onArticle:postId});
    //delete post
    await Post.findOneAndDelete({_id:postId,author:user._id});
}

async function deleteComment(userToken,params) {
    const user = await User.findById(userToken);

    //console.log('userId: '+user._id);
    //console.log('postId: ' + params.postId);
    //console.log('commentId: ' + params.commentId);

    if (!await Comment.findById(params.commentId))
        throw "Comment not found!";

    if(!await Post.findOne({_id:params.postId,author:user._id}))
        throw "Comment not found or You can't delete it";
    
    await Comment.findByIdAndDelete(params.commentId);
}

async function addPost(req,postParam) {
    //validate postId exist or not
    if( await Post.findOne({postId: postParam.postId})) {
        throw "Post Id: "+postParam.postId+" is already taken";
    }


    const newPost = new Post(postParam);

    //assign author to the post
    newPost.author = await User.findById(req.user.sub).select('-hash');

    //save new post
    await newPost.save();
}

async function getPost(postId) {
    //console.log(postId);
    const post = await Post.findById(postId);
    if(!post) throw "Post not found";

    //to get comments and commentBy in it
    post.comments = await Comment.find({ onArticle: post._id })
    .populate('commentBy','username').sort({commentedOn:-1});

    //to get author who posted
    //console.log(post.author);
    post.author = await User.findById({_id:post.author});
    //.populate('author'); we can't populate because we don't hava reference of Post in User
    //post.comments = await Comment.find({onArticle:post._id}).sort({commentedOn:-1});
    //console.log(post.comments);
    return post;
}

async function viewPosts() {
    return await Post.find().sort({createdDate:-1});
}

async function viewMyPosts(id) {
    const user = await User.findById(id).select('-hash');
    return await Post.find({author:user}).sort({createdDate:-1});
}

async function addComment(commentParam) {
    //console.log(commentParam.onArticle);
    commentParam.commentBy = await User.findById(commentParam.commentBy).select('-hash');

    if(!await Post.findById(commentParam.onArticle)) {
        throw "Post Id: "+commentParam.onArticle+" is not exist";
    }
    /*console.log(post.title);
    post.comments.push(newComment);
    console.log(post.comments);*/
    const newComment = new Comment(commentParam);

    await newComment.save();
}

/*async function viewComments() {
    return await Comment.find().sort({ commentedOn: -1 });
}*/