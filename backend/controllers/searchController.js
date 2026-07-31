import Document from "../models/Document.js";
import SearchHistory from "../models/SearchHistory.js";

export const searchDocuments = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const query = req.query.q?.trim();

        if (!query) {
            return res.status(400).json({
                success: false,
                error: "Search query is required"
            });
        }

        const startTime = Date.now();

        const documents = await Document.find({
            userId,
            chunks: {
                $elemMatch: {
                    content: {
                        $regex: query,
                        $options: "i"
                    }
                }
            }
        }).select("title chunks");

        const results = [];

        documents.forEach(doc => {
            doc.chunks.forEach(chunk => {
                if (chunk.content.toLowerCase().includes(query.toLowerCase())) {

                    const index = chunk.content
                        .toLowerCase()
                        .indexOf(query.toLowerCase());

                    const start = Math.max(0, index - 60);
                    const end = Math.min(chunk.content.length, index + 120);

                    results.push({
                        documentId: doc._id,
                        title: doc.title,
                        pageNumber: chunk.pageNumber,
                        chunkIndex: chunk.chunkIndex,
                        snippet: chunk.content.substring(start, end)
                    });
                }
            });
        });

        const searchTime = Date.now() - startTime;

        // Analytics
        const allDocuments = await Document.find({ userId })
            .select("extractedText chunks");

        const documentsIndexed = allDocuments.length;

        let chunksIndexed = 0;
        let wordsIndexed = 0;

        allDocuments.forEach(doc => {
            chunksIndexed += doc.chunks.length;

            if (doc.extractedText) {
                wordsIndexed += doc.extractedText
                    .trim()
                    .split(/\s+/).length;
            }
        });

        const documentsMatched = documents.length;

      
        /* Save Search History */
        

        await SearchHistory.create({
            userId,
            query,
            resultsCount: results.length,
            searchTime
        });

        res.status(200).json({
            success: true,
            data: {
                query,
                totalResults: results.length,
                searchTime,

                analytics: {
                    documentsIndexed,
                    documentsMatched,
                    chunksIndexed,
                    wordsIndexed,
                    searchTime
                },

                results
            }
        });

    } catch (error) {
        next(error);
    }
};