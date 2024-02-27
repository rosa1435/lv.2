import express from 'express';
import reviewRouter from './routes/comments.router.js';
import commentRouter from './routes/reviews.router.js';

const app = express();
const PORT = 3017;

app.use(express.json());
app.use('/api', [reviewRouter, commentRouter]);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});
