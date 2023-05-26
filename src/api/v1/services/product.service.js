require("module-alias/register");
const product = require("@model/product.model");

module.exports = {
    findAll: async () => {      // lọc tất cả các dòng => 1 mảng
        return await product.find();
    },
    createProduct: async (name, cate_id, des, price, quantity) => {    // Tạo 1 dữ liệu mới
        return await product.create({Product_name: name, Category_id: cate_id, Description: des, Price: price, Quantity: quantity, Create_at: new Date(), Update_at: new Date()});
    },
    findAllandCategory: async () => {      // Kết bảng Product và Category lưu vào 1 thuộc tính là categorydetail (1 mảng)
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
    totalProductbyCate: async () => {       // tìm tổng sản phẩm thuộc Category (bỏ)
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
    findOnebyId: async (id) => {    // lọc 1 dòng theo Id
        return await product.findOne({id});
    },
    findAllandCategorybyId: async (id) => { // Kết bảng Product với Category và lọc theo productId
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
      $match : {id} // giống Where in SQL
    }]);
  },
  findOnebyName: async (name) => {   // Lọc 1 dòng theo Product_name
    return await product.findOne({Product_name: name});
},
  updateProduct: async (id, Product_name, Category_id, Description, Price, Quantity) => {   // Cập nhật dữ liệu
    return await product.updateOne({id}, {Product_name, Category_id, Description, Price, Quantity, Update_at: new Date()});
  },
  deleteProduct: async (id) => { // // Cập nhật dữ liệu
    return await product.updateOne({id},{isDeleted: true});
  },
  pagingAndfilterCate: async (page,cateId,sortProduct) => { // lọc Category và phân trang và sort
    let pageSize = 6;
    if(!cateId){
      if(sortProduct === "0"){
        return await product.find({isDeleted: false}).skip((page - 1) * pageSize).limit(pageSize);
      }
      else if(sortProduct === "1"){
        return await product.find({isDeleted: false}).skip((page - 1) * pageSize).limit(pageSize).sort({"Price":1});
      }
      else if(sortProduct === "2"){
        return await product.find({isDeleted: false}).skip((page - 1) * pageSize).limit(pageSize).sort({"Price":-1});
      }
      else if(sortProduct === "3"){
        return await product.find({isDeleted: false}).skip((page - 1) * pageSize).limit(pageSize).sort({"Create_at":-1});
      }
    }
    if(sortProduct === "0"){
      return await product.find({isDeleted: false, Category_id:{$in: cateId}}).skip((page - 1) * pageSize).limit(pageSize);
    }
    else if(sortProduct === "1"){
      return await product.find({isDeleted: false, Category_id:{$in: cateId}}).skip((page - 1) * pageSize).limit(pageSize).sort({"Price":1});
    }
    else if(sortProduct === "2"){
      return await product.find({isDeleted: false, Category_id:{$in: cateId}}).skip((page - 1) * pageSize).limit(pageSize).sort({"Price":-1});
    }
    else if(sortProduct === "3"){
      return await product.find({isDeleted: false, Category_id:{$in: cateId}}).skip((page - 1) * pageSize).limit(pageSize).sort({"Create_at":-1});
    }
  },
  countProductFilterCate: async (cateId) => { // tổng số sản phẩm khi lọc Category
    if(!cateId){
      return await product.find({isDeleted: false});
    }
    return await product.find({isDeleted: false, Category_id:{$in: cateId}});
  },
  findProductName: async (name) => { // tìm theo tên của sản phẩm
      return await product.find({Product_name: {$regex: name}});
  },
  paging: async (page) => { // phân trang
    let pageSize = 6;
    return await product.find({isDeleted: false}).skip((page - 1) * pageSize).limit(pageSize);
  },
  updateQuantity: async (id, Quantity) => {  // Cập nhật số lượng sản phẩm đã bán
    return await product.updateOne({id},{$inc: {Sold: Quantity}});
  }

}