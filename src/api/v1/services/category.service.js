require("module-alias/register");
const category = require("@model/category.model");

module.exports = {
    createCategory: async (name) => {
        return await category.create({Category_name: name, Create_at: new Date(), Update_at: new Date()});
    },
    findOnebyName: async (name) => {
        return await category.findOne({Category_name: name});
    },
    findAll: async () => {
        return await category.find();
    },
    findOnebyId: async (id) => {
        return await category.findOne({id});
    },
    updateCategory: async (id, name) => {
        return await category.updateOne({id},{Category_name: name, Update_at: new Date()});
    },
    deleteCategory: async (id) => {
        return await category.updateOne({id},{isDeleted: true, Update_at: new Date()});
    },
    totalProductbyCate: async () => {
        return await category.aggregate([
        { $lookup:
            {
              from: 'products',
              localField: 'id',
              foreignField: 'Category_id',
              as: 'productdetail'
            }
        }]);
    }
}
