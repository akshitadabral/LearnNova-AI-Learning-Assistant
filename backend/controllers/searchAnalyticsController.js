import SearchHistory from "../models/SearchHistory.js";

export const getSearchAnalytics = async(req,res,next)=>{
    try{
        const userId=req.user._id;

        const totalSearches=await SearchHistory.countDocuments({userId});

        const avgResult=await SearchHistory.aggregate([
            {$match:{userId}},
            {$group:{_id:null,averageTime:{$avg:"$searchTime"}}}
        ]);

        const averageSearchTime=avgResult.length?Math.round(avgResult[0].averageTime):0;

        const topKeywords=await SearchHistory.aggregate([
            {$match:{userId}},
            {$group:{_id:"$query",count:{$sum:1}}},
            {$sort:{count:-1}},
            {$limit:5}
        ]);

        const noResultSearches=await SearchHistory.countDocuments({
            userId,
            resultsCount:0
        });

        const sevenDaysAgo=new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);

        const searchesThisWeek=await SearchHistory.countDocuments({
            userId,
            createdAt:{$gte:sevenDaysAgo}
        });

        const searchesPerDay=await SearchHistory.aggregate([
            {
                $match:{
                    userId,
                    createdAt:{$gte:sevenDaysAgo}
                }
            },
            {
                $group:{
                    _id:{
                        $dateToString:{
                            format:"%Y-%m-%d",
                            date:"$createdAt"
                        }
                    },
                    count:{$sum:1}
                }
            },
            {
                $sort:{_id:1}
            }
        ]);

        res.status(200).json({
            success:true,
            data:{
                totalSearches,
                averageSearchTime,
                topKeywords,
                noResultSearches,
                searchesThisWeek,
                searchesPerDay
            }
        });

    }catch(error){
        next(error);
    }
};