require("module-alias/register");
const ImageModel = require("@model/listimage.model");

module.exports = {
    createImage: async (Product_Id, Image) => {    // Tạo dữ liệu mới
        const listimage = await ImageModel.find({Product_Id});
        if(listimage.length != 0){
            return await ImageModel.create({Image, Product_Id, Create_at: new Date(), Update_at: new Date()});
        }
        return await ImageModel.create({Image, Product_Id, Main_Image:true, Create_at: new Date(), Update_at: new Date()});
    },
    findbyProductId: async (Product_Id) => {     // lọc tất cả các dòng theo Product_id => 1 mảng
        return await ImageModel.find({Product_Id});
    },
    findbyId: async (id) => {       // Lọc 1 dòng theo ID
        return await ImageModel.findOne({id});
    },
    getAll: async () => {  // lọc tất cả các dòng
        return await ImageModel.find();
    },
    updateMain_Image: async (id, Product_Id) => { // cập nhật lại ảnh chính
        await ImageModel.findOneAndUpdate({Product_Id,Main_Image: true},{Main_Image: false});
        return await ImageModel.updateOne({id},{Main_Image: true});
    },
    updateImage: async (id,image) => { // cập nhật lại hình ảnh
        return await ImageModel.updateOne({id},{Image: image});
    },
    getMainImage: async () => { // lọc tất cả các ảnh chính
        return await ImageModel.find({Main_Image: true});
    },
    dellistimage: async (id) => {
        return await ImageModel.updateOne({id},{isDeleted: true});
    },
    getImageByProductId: async (id) => { // lọc tất cả các dòng theo ProductId và isDeleted = false
        return await ImageModel.find({Product_Id: id, isDeleted: false});
    }
}