import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 리뷰 등록
router.post('/reviews', async (req, res, next) => {
    // 사용자로부터 입력값 받아오기.
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

    // 새 리뷰 생성
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
router.get('/reviews', async (req, res, next) => {
    const reviews = await prisma.reviews.findMany({
        select: {
            reviewId: true,
            bookTitle: true,
            reviewTitle: true,
            author: true,
            starRating: true,
            createdAt: true,
            updatedAt: true,
        },
        // createdAt 필드를 기준으로 내림차순으로 정렬
        orderBy: {
            createdAt: 'desc',
        },
    });
    return res.status(200).json({ data: reviews });
});

// 리뷰 상세 조회
router.get('/reviews/:reviewId', async (req, res, next) => {
    const { reviewId } = req.params;

    // reviewId가 없는 경우
    if (!reviewId) {
        return res
            .status(400)
            .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const review = await prisma.reviews.findFirst({
        where: {
            // params로 전달 받은 값은 String 타입이기 때문에 숫자형으로 타입 변경해준다.
            reviewId: +reviewId,
        },
        select: {
            reviewId: true,
            bookTitle: true,
            reviewTitle: true,
            reviewContent: true,
            author: true,
            starRating: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // reviewId에 해당하는 review가 없는 경우
    if (!review) {
        return res
            .status(404)
            .json({ errorMessage: '해당하는 리뷰가 존재하지 않습니다.' });
    }

    return res.status(200).json({ data: review });
});

// 리뷰 정보 수정
router.put('/reviews/:reviewId', async (req, res, next) => {
    const { reviewId } = req.params;
    const { bookTitle, reviewTitle, reviewContent, starRating, password } =
        req.body;

    const review = await prisma.reviews.findUnique({
        where: {
            reviewId: +reviewId,
        },
    });

    // reviewId가 없는 경우
    if (!reviewId || !password) {
        return res
            .status(400)
            .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    // reviewId에 해당하는 리뷰가 존재하지 않을 경우
    if (!review) {
        return res
            .status(404)
            .json({ errorMessage: '존재하지 않는 리뷰입니다.' });
    }
    // 비밀번호 일치하지 않을 경우
    if (review.password !== password) {
        return res
            .status(401)
            .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.reviews.update({
        data: {
            bookTitle: bookTitle,
            reviewTitle: reviewTitle,
            reviewContent: reviewContent,
            starRating: starRating,
            password: password,
        },
    });
    return res.status(200).json({ data: '책 리뷰를 수정하였습니다.' });
});

// 리뷰 삭제
router.delete('/reviews/:reviewId', async (req, res, next) => {
    const { reviewId } = req.params;
    const { password } = req.body;

    const review = await prisma.reviews.findUnique({
        where: {
            reviewId: +reviewId,
        },
    });

    // reviewId가 없는 경우
    if (!reviewId || !password) {
        return res
            .status(400)
            .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    // reviewId에 해당하는 리뷰가 존재하지 않을 경우
    if (!review) {
        return res
            .status(404)
            .json({ errorMessage: '존재하지 않는 리뷰입니다.' });
    }
    // 비밀번호 일치하지 않을 경우
    if (review.password !== password) {
        return res
            .status(401)
            .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.reviews.delete({
        where: { reviewId: +reviewId },
    });
    return res.status(200).json({ data: '책 리뷰를 삭제하였습니다.' });
});

export default router;
