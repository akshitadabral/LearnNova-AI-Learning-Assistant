import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";

export const getWeeklyAnalytics = async (req, res, next) => {
    try {

        const userId = req.user._id;

        const today = new Date();

        // Beginning of current week (Monday)
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        startOfWeek.setDate(startOfWeek.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);


        const allDocs = await Document.find({ userId });


        // Weekly totals
        const documents = await Document.countDocuments({
            userId,
            createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek,
            },
        });

        const quizzes = await Quiz.countDocuments({
            userId,
            createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek,
            },
        });

        const flashcards = await Flashcard.find({
            userId,
            createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek,
            },
        });

        // Total flashcards generated
        let flashcardCount = 0;

        flashcards.forEach((deck) => {
            flashcardCount += deck.cards.length;
        });

        // Activity for each day (Mon-Sun)

        const labels = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ];

        const weeklyActivity = [];

        for (let i = 0; i < 7; i++) {

            const dayStart = new Date(startOfWeek);
            dayStart.setDate(startOfWeek.getDate() + i);

            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const docs = await Document.countDocuments({
                userId,
                createdAt: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

            const quiz = await Quiz.countDocuments({
                userId,
                createdAt: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

            const flash = await Flashcard.find({
                userId,
                createdAt: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

            let flashCount = 0;

            flash.forEach((deck) => {
                flashCount += deck.cards.length;
            });

            weeklyActivity.push({
                day: labels[i],
                uploads: docs,
                quizzes: quiz,
                flashcards: flashCount,
                total: docs + quiz + flashCount,
            });
        }

        res.status(200).json({
            success: true,
            data: {
                documents,
                quizzes,
                flashcards: flashcardCount,
                weeklyActivity,
            },
        });

    } catch (error) {
        next(error);
    }
};