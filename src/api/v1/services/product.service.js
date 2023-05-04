require("module-alias/register");
const product = require("@model/product.model");

module.exports = {
    findAll: async () => {
        return await product.find();
    },
    createProduct: async (name, cate_id, des, price, quantity) => {
        return await product.create({Product_name: name, Category_id: cate_id, Description: des, Price: price, Quantity: quantity, Create_at: new Date(), Update_at: new Date()});
    },
    findAllandCategory: async () => {
        return await product.aggregate([
        { $lookup:
            {
              from: 'categories',
              localField: 'Category_id',
              foreignField: 'id',
              as: 'categorydetail'
            }
        }]);
    },
    totalProductbyCate: async () => {
        return await product.aggregate([
        { $lookup:
            {
              from: 'categories',
              localField: 'Category_id',
              foreignField: 'id',
              as: 'categorydetail'
            }
        },
        {
            "$unwind": "$categorydetail"
        },
        {
            "$group": {
              "_id": {
                "id": "$categorydetail.id",
                "Category_name": "$categorydetail.Category_name",
                "isDeleted": "$categorydetail.isDeleted",
                "Create_at": "$categorydetail.Create_at",
                "Update_at": "$categorydetail.Update_at"
              },
              "total": {
                "$sum": 1
              }
            }
          }]);
    },
    findOnebyId: async (id) => {
        return await product.findOne({id});
    },
    findAllandCategorybyId: async (id) => {
      return await product.aggregate([
      { $lookup:
          {
            from: 'categories',
            localField: 'Category_id',
            foreignField: 'id',
            as: 'categorydetail'
          }
      },
    {
      $match : {id}
    }]);
  }

}