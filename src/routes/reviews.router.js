import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 리뷰 등록
router.post('/reviews', async (req, res, next) => {
    const {
        bookTitle,
        reviewTitle,
        reviewContent,
        starRating,
        author,
        password,
    } = req.body;

    if (
        !bookTitle ||
        !reviewTitle ||
        !reviewContent ||
        !starRating ||
        !author ||
        !password
    ) {
        return res
            .status(400)
            .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const newReview = await prisma.reviews.create({
        data: {
            bookTitle: bookTitle,
            reviewTitle: reviewTitle,
            reviewContent: reviewContent,
            starRating: starRating,
            author: author,
            password: password,
        },
    });

    return res
        .status(200)
        .json({ data: newReview, message: '책 리뷰를 등록하였습니다.' });
});

// 리뷰 목록 조회
router.get('/reviews', async (req, res, next) => {});

// 리뷰 상세 조회
router.get('/reviews/:reviewId', async (req, res, next) => {});

// 리뷰 정보 수정
router.put('/reviews/:reviewId', async (req, res, next) => {});

// 리뷰 삭제
router.delete('/reviews/:reviewId', async (req, res, next) => {});

export default router;
