require("module-alias/register");
const category = require("@model/category.model");

module.exports = {
    createCategory: async (name) => {  // tạo 1 dữ liệu mới
        return await category.create({Category_name: name, Create_at: new Date(), Update_at: new Date()});
    },
    findOnebyName: async (name) => {  // lọc 1 dòng theo Category_name
        return await category.findOne({Category_name: name});
    },
    findAll: async () => {  // lọc tất cả các dòng => 1 mảng
        return await category.find();
    },
    findOnebyId: async (id) => {  // lọc 1 dòng theo Id
        return await category.findOne({id});
    },
    updateCategory: async (id, name) => { // Cập nhật dữ liệu theo Id
        return await category.updateOne({id},{Category_name: name, Update_at: new Date()});
    },
    deleteCategory: async (id) => { // Cập nhật dữ liệu isDeleted theo Id
        return await category.updateOne({id},{isDeleted: true, Update_at: new Date()});
    },
    totalProductbyCate: async () => { // Kết bảng Category với Product
        return await category.aggregate([
        { $lookup:
            {
              from: 'products',
              localField: 'id',
              foreignField: 'Category_id',
              as: 'productdetail'
            }
        }]);
    },
    catejoinProductbyDel: async () => { // Kết bảng Category với Product và lọc những dòng có isDeleted = false
        return await category.aggregate([
        { $lookup:
            {
              from: 'products',
              localField: 'id',
              foreignField: 'Category_id',
              as: 'productdetail'
            }
        },
    {
        $match: {isDeleted: false}
    }]);
    }
}
