import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();


//router.post('/', async (req, res) => {});


// 댓글 등록 API
router.post('/reviews/:reviewId/comments', async (req, res) => {
    const {content, author, password} = req.body;
    const {reviewId} = req.params;

    if(!content || !author || !password || !reviewId){
        return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."}) // body 또는 params를 입력받지 못한 경우
    }

    const review = await prisma.reviews.findUnique({
        where: { id: +reviewId }
    });
    
    if(!review){
        return res.status(404).json({message: "존재하지않는 리뷰 입니다."})
    }

    if(comment.password !== password){
        return res.status(401).json({message: "비밀번호가 일치하지 않습니다."})
    }

    const comment = await prisma.comments.create({ // 댓글을 데이터베이스에 push하는 부분
        data : {
            content: content,
            author: author,
            password: password,
            reviewId: +reviewId,
        }
    });

    return res.status(201).json({message: "댓글을 등록하였습니다."}) // 성공적으로 댓글등록 완료
});


// 댓글 목록 조회 API  
//::=> ID명이랑 commentId명이랑 데이터테이블에서 변경 필요 400 body 에러메세지 생성 필요
router.get('/reviews/:reviewId/comments', async (req, res) => {
    const {reviewId} = req.params;

    if(!reviewId) {
        return res.status(400).json({errorMessage: '데이터 형식이 올바르지 않습니다.'})
    }

    const review = await prisma.comments.findUnique({
        where: {
            reviewId: +reviewId
        }
    });

    if(!review) {
        return res.status(404).json({errorMessage: '존재하지 않는 리뷰입니다.'})
    };

    const data = await prisma.comments.findMany({ // reviewId가 일치하는 목록 생성
        where: {
            reviewId: +reviewId,
        },
        select: {
            id: true,
            content: true,
            author: true,
            createdAt: true,
            updatedAt:true,
        },
        orderBy: {
            createdAt: 'desc', // 시간 최신 순으로 정렬
        }
    });

    return res.status(200).json({data}) // 목록 리턴
});


// 댓글 수정 API
router.put('/reviews/:reviewId/comments/:commentId', async (req, res) => {
    const { reviewId, commentId } = req.params;
    const {content, password} = req.body;

    if(!reviewId || !commentId || !content || !password) {
        return res.status(400).json({errorMessage: '데이터 형식이 올바르지 않습니다.'})
    }

    const review = await prisma.comments.findUnique({
        where: {
            reviewId: +reviewId
        }
    });

    if(!review) {
        return res.status(404).json({errorMessage: '존재하지 않는 리뷰입니다.'})
    }

    const findcommentId = await prisma.comments.findUnique({ // reviews테이블안에 reviewId를 찾음
        where: {
            id: +commentId
    }});
    
    if (!findcommentId) { // commentId가 존재하지 않을 경우 에러메세지
        return res.status(404).json({message: "댓글 내용을 입력해주세요"});
    };

    if (findcommentId.password !== password) {  // 비밀번호 일치하지 않을 경우
        return res.status(401).json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    };

    await prisma.comments.update({
        data: {
            content: content,
        },
        where: {
            id: +commentId,
            password: password,
        }
    });

    return res.status(200).json({message: "댓글을 수정하였습니다."})
});

// 댓글 삭제 API
router.delete('/reviews/:reviewId/comments/:commentId', async(req,res,next)=>{
    const {reviewId, commentId} = req.params;
    const {password} = req.body;

    if(!reviewId || !commentId || !password ) {
        return res.status(400).json({errorMessage: '데이터 형식이 올바르지 않습니다.'});
    }

    const comment = await prisma.comments.findUnique({
        where: {
            id: +commentId
        }
    });

    if(!comment) {
        return res.status(404).json({errorMessage: '존재하지 않는 리뷰입니다.'})
    }

    if(comment.password !== password) {
        return res.status(401).json({errorMessage: '비밀번호가 일치하지 않습니다.'});
    }

    await prisma.comments.delete({
        where: {
            id: +commentId
        }
    });
    return res.status(200).json({data: '댓글을 삭제하였습니다.'})
});

export default router;