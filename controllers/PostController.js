import PostModel from "../models/Post.js"

export const getAll=async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить пост',
        });
    }
}

export const getOne=(req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findByIdAndUpdate(
            { _id: postId },
            {
                $inc:{viewsCount: 1}
            },
            {returnDocument:"after"},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть пост',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найдена',
                    });
                }

                res.json(doc)
            },
        ).populate('user')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить пост',
        });
    }
}

export const remove= (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить пост',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найдена',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить Пост',
        });
    }
}

export const create=async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save();
        res.json(post)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

export const update=async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            { _id: postId },
            {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                user: req.userId
            }
        )
        res.json({
            succes: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
}

