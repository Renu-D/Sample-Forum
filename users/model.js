const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

userSchema.set('toJSON', { virtuals: true });

//module.exports = mongoose.model('User', userSchema);

const commentSchema = new Schema({
    text: { type: String, required: true },
    onArticle: { type: Schema.Types.ObjectId, ref: 'Post' },
    commentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    commentedOn: { type: Date, default: Date.now }
});

commentSchema.set('toJSON', { virtuals: true });

const postSchema = new Schema( {
    postId: {type: String, unique: true, required: true},
    title: {type: String,required: true},
    description: {type:String, required: true},
    createdDate: { type: Date, default: Date.now},
    author: {
        type: Schema.Types.ObjectId,
        //type:String,
        ref:'User'
    },
    comments:[{type: Schema.Types.ObjectId, ref:'Comment'}]
});


postSchema.set('toJSON', {virtuals: true});


//module.exports = 
//mongoose.model('Post',postSchema);
//The first argument is the singular name of the collection your model is for.
// ** Mongoose automatically looks for the plural, lowercased version of your model name. 
//** Thus, for the example above, the model Post is for the posts collection in the database.


//Use like this for multiple schema
module.exports = {
    User: mongoose.model('User',userSchema),
    Post: mongoose.model('Post',postSchema),
    Comment: mongoose.model('Comment',commentSchema)
};