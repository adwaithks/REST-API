const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const jwtVerification = require('./jwtVerification');

router.post('/create', jwtVerification,async (req, res) => {
    const user = await User.findOne({
        email: req.user.email
    });
    if (!user) return res.status(500).json('Internal Server Error');
 
    const title = req.body.title;
    const content = req.body.content;
    try {
        user.posts.push({
            title: title,
            content: content,
            author: user.username
         })
         await user.save().then(doc => {
            res.status(200).json(doc.posts[doc.posts.length-1]);
        }).catch(err => {
            res.status(500).json('Internal Server Error');
        })
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
})


router.post('/delete/:postid', jwtVerification,async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postid)) return res.status(500).json('Internal Server Error');
    const user = await User.findOne({
        email: req.user.email
    })
    if (!user) return res.status(500).json('Internal Server Error');

    try {
        user.posts.id(req.params.postid).remove();
        await user.save().then(doc => {
            res.status(200).json('Post Successfully Deleted');
        }).catch(err => {
            res.status(500).json('Internal Server Error');
        })
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
})


router.post('/:postid/delete/comment/:commentid', jwtVerification,async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postid)) return res.status(500).json('Internal Server Error');
    if (!mongoose.Types.ObjectId.isValid(req.params.commentid)) return res.status(500).json('Internal Server Error');

    const user = await User.findOne({
        email: req.user.email,
        'posts._id': req.params.postid
    })

    if (!user) {
        try {
            const doc = await User.findOne({
                'posts._id': req.params.postid,
                'posts.comments.commenter': req.user.username
            })
            if (!doc) return res.status(403).json('Forbidden');
            
            doc.posts.map(eachPost => {
                eachPost.comments.id(req.params.commentid).remove();
            })
            await doc.save().then(doc => {
                res.status(200).json('Comment Successfully Deleted');
            }).catch(err => {
               
                res.status(500).json('Internal Server Error');
            })
        } catch (err) {
            res.status(500).json('Internal Server Error');
        }
    }else{
    try {
        user.posts.map(eachPost => {
            eachPost.comments.id(req.params.commentid).remove();
        })
        await user.save().then(doc => {
            res.status(200).json('Comment Successfully Deleted');
        }).catch(err => {
            res.status(500).json('Internal Server Error');
        })
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
}

})


router.post('/:postid/comment', jwtVerification,async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postid)) return res.status(500).json('Internal Server Error');
    if (!req.body.comment) return res.status(400).json('No comment passed');

    const toUser = await User.findOne({'posts._id': req.params.postid});
    if (!toUser) return res.status(500).json('Internal Server Error');

    try {
        toUser.posts.map(eachPost => {
            if (eachPost._id == req.params.postid) {
                eachPost.comments.push({
                    comment: req.body.comment,
                    commenter: req.user.username
                })
            }})
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }

    try {
        await toUser.save().then(doc => {
                res.status(200).json('Comment Created Successfully')
            }).catch(err => {
                res.status(500).json('Internal Server Error');
            })
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
})



router.get('/:postid', jwtVerification,async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postid)) return res.status(500).json('Internal Server Error');
    const user = await User.findOne({
        email: req.user.email
    })
    if (!user) return res.status(500).json('Internal Server Error');

    try {
        if (user.posts.length === 0) return res.status(404).json('You dont have any posts');
        const post = user.posts.id(req.params.postid);
        if (post) return res.status(200).json(post); 
        res.status(404).json('No post found')
    } catch (err) {
        res.status(500).json('Internal Server Error')
    }
    
})


router.post('/:postid/like', jwtVerification,async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postid)) return res.status(500).json('Internal Server Error');
    const user = await User.findOne({
        'posts._id': req.params.postid 
    })
    if (!user) return res.status(500).json('Internal Server Error');

    if (user.username === req.user.username) return res.status(403).json('Cannot like own Post')

    if (!user.likedPeoples.includes(req.user.username)){
    user.posts.id(req.params.postid).likes += 1;
    user.likedPeoples.push(req.user.username);
    await user.save().then(doc => {
        res.status(200).json('OK');
    }).catch(err => {
        res.status(500).json('Internal Server Error');
    })
    }else{
        res.status(403).json('Cannot like more than once');
    }

})


router.post('/:postid/dislike', jwtVerification,async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postid)) return res.status(500).json('Internal Server Error');
    const user = await User.findOne({
        'posts._id': req.params.postid 
    })
    if (!user) return res.status(500).json('Internal Server Error');

    if (user.username === req.user.username) return res.status(403).json('Cannot dislike own Post')

    if (user.likedPeoples.includes(req.user.username)){
    user.posts.id(req.params.postid).likes -= 1;
    let index = user.likedPeoples.indexOf(req.user.username)
    if (index > -1) {
        user.likedPeoples.splice(index, 1);
     }
     await user.save().then(doc => {
        res.status(200).json('OK');
    }).catch(err => {
        res.status(500).json('Internal Server Error');
    })
    }else{
        res.status(403).json('Cannot dislike if not liked');
    }
     
})


module.exports = router;