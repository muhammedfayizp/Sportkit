const Order=require('../models/order_model')

const loadOrderList=async(req,res)=>{
    try {
        const orders = await Order.find()
        .populate({
            path: 'items.productId',
            model: 'Product'
        })
        
        .exec();
        res.render('ordersList',{orders})
} catch (error) {
        console.log(error);
    }
}

const loadOrderDetailList=async(req,res)=>{
    try {
        const orderId = req.query.orderId;
        const orders = await Order.find({ _id: orderId })
        .populate({
            path: 'items.productId',
            model: 'Product'
        })
        .populate({
            path: 'UserId',
            model: 'User' 
        })
        .exec();

    res.render('orderDetailsList', { orders });

    } catch (error) {
        console.log(error);
    }
}

const changeStatus = async (req,res)=>{
    try {
    const {status , orderId , productId} = req.body
    const order = await Order.findById(orderId);
    if(!order){
        return res.status(404).json({message: 'Order not found'})
    }
    const product = order.items.find(item=>item.productId.toString()===productId)
    product.status = status;
    await order.save()
   
    }catch(error){
        console.log(error);
    }
}


module.exports={
    loadOrderList,
    loadOrderDetailList,
    changeStatus,
}