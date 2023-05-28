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
    getAllReviewbyProductId: async (userid) => {
        return await reviewModel.aggregate([
            {
                $match: {isApproved: true, User_Id: userid}
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
                $lookup:
                    {
                      from: 'listimages',
                      localField: 'Product_id',
                      foreignField: 'Product_Id',
                      as: 'image_product'
                    }
            },
            {
                $unwind: "$image_product"
            },
            {
                $match: {"image_product.Main_Image": true}
            },
            {
                $group: {
                    _id: "$Product_id",
                    infor: {$push: "$$ROOT"}
                }
            }
        ]);
    }
}