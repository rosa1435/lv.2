import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();


//router.post(('/', async (req, res) => {}));


// 댓글 등록 API
router.post('/reviews/:reviewId/comments', async (req, res) => {
    const {content, author, password} = req.body;
    const {reviewId} = req.params


    if(!content || !author || !password || !reviewId){
        return res.status(400).json({errormessage: "데이터 형식이 올바르지 않습니다."}) // body 또는 params를 입력받지 못한 경우
    }

    if(!reviewId){
        return res.status(400).json({errormessage: "데이터 형식이 올바르지 않습니다."}) // body 또는 params를 입력받지 못한 경우
    }

    const comment = await prisma.Comments.create({ // 댓글을 데이터베이스에 push하는 부분
        data : {
            content: content,
            author: author,
            password: password,
            reviewId: +reviewId,
        }
    });


    return res.status(201).json({message: "댓글을 등록하였습니다."}) // 성공적으로 댓글등록 완료
});






export default router;