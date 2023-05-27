require("module-alias/register");
const reviewModel = require("@model/review.model");

module.exports = {
    createReview: async (UserId, ProductId, rating, content) => { // Tạo 1 reivew
        return await reviewModel.create({Product_id: ProductId, User_Id: UserId, rating, content, Create_at: new Date(), Update_at: new Date()});
    },
    getAllReview: async () => { // Láy tất cả dữ liệu trong bảng Reivew
        return await reviewModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "User_Id",
                    foreignField: "id",
                    as: "userdetail"
                }
            },
            {
                $unwind: "$userdetail"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "Product_id",
                    foreignField: "id",
                    as: "productdetail"
                }
            },
            {
                $unwind: "$productdetail"
            }
        ]);
    },
    updateApproved: async (id, approved) => { // duyệt or hủy review
        return await reviewModel.updateOne({id},{isApproved: approved});
    },
    getAllReviewbyApproved: async (id) => { // Lấy tất cả các đánh giá đã duyệt và theo ProductId
        return await reviewModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "User_Id",
                    foreignField: "id",
                    as: "userdetail"
                }
            },
            {
                $unwind: "$userdetail"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "Product_id",
                    foreignField: "id",
                    as: "productdetail"
                }
            },
            {
                $unwind: "$productdetail"
            },
            {
                $match: {isApproved: true, Product_id: id}
            }
        ]);
    },
    getAllReviewbyProductId: async () => {
        return await reviewModel.aggregate([
            {
                $group: {
                    _id: "$Product_id",
                    infor: {$push: "$$ROOT"}
                }
            },
            {
                $match: {"infor.isApproved": true}
            }
        ]);
    }
}