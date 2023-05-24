$(document).ready(function(){
    $(document).on('focusout',".search", function(){
        setTimeout(function ()
        {
            $("#result_content").html("");
        }, 101);
    })


    $(document).on('focus',".search", function(){
        if($(this).val().trim().length == 0){
        $("#result_content").html("");
        }
        else{
            $("#result_content").html("");
        $.ajax({
            url: "/api/v1/shop/search",
            type: "post",
            data: {data: $(this).val()},
            dataType: "json",
            success: function(resp){
                resp.data.forEach(function(product){
                    for(let i = 0; i < resp.imagem.length; i++){
                            if(resp.imagem[i].Product_Id == product.id){
                $("#result_content").append("<a href='/api/v1/product_detail/"+ product.id +"' class='cursor-pointer py-2 px-3 hover:bg-slate-100 flex gap-x-2'>"
                                               + "<img class='w-10 h-10' src='https://drive.google.com/uc?export=view&id="+ resp.imagem[i].Image +"' alt='Product'>"  
                                               + "<div>"
                                                +"<p class='text-sm font-medium text-gray-600'>"+ product.Product_name +"</p>"
                                               + "<p class='text-sm text-gray-500'>$"+ product.Price +"</p>"
                                                    +"</div>"
                                               + "</a>");
                                          break;
                                               }
                                            }
                                        })                        
            }
        })
    }
    })


    $(document).on('input',".search", function(){
        if($(this).val().trim().length == 0){
        $("#result_content").html("");
        }
        else{
        $.ajax({
            url: "/api/v1/shop/search",
            type: "post",
            data: {data: $(this).val()},
            dataType: "json",
            success: function(resp){
                resp.data.forEach(function(product){
                    for(let i = 0; i < resp.imagem.length; i++){
                           if(resp.imagem[i].Product_Id == product.id){
                $("#result_content").append("<a href='/api/v1/product_detail/"+ product.id +"' class='cursor-pointer py-2 px-3 hover:bg-slate-100 flex gap-x-2'>"
                                               + "<img class='w-10 h-10 'src='https://drive.google.com/uc?export=view&id="+ resp.imagem[i].Image +"' alt='Product'>"  
                                               + "<div>"
                                                +"<p class='text-sm font-medium text-gray-600'>"+ product.Product_name +"</p>"
                                               + "<p class='text-sm text-gray-500'>$"+ product.Price +"</p>"
                                                    +"</div>"
                                               + "</a>");
                                          break;
                                               }
                                         }
                                        })                        
            }
        })
    }
    });
})