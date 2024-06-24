const Order=require('../models/order_model')
const Wallet=require('../models/wallet-model')
const Product=require('../models/product_model')

const loadOrderList=async(req,res)=>{
    try {
        let orders = await Order.find()
        .populate({
            path: 'items.productId',
            model: 'Product'
        })
        .exec();
        orders=[...orders].reverse()
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

const returnApproev=async(req,res)=>{
    try {

        const {orderId,productId}=req.body
        const order=await Order.findById(orderId)
        const userId=order.UserId._id
        const walletData=await Wallet.findOne({UserId:userId})
        const item=await Product.findById(productId)
        const product=order.items.find(item=>item.productId.toString()===productId)
        order.approvel=2
        product.status='Return'
        if(!walletData){
            const addingWalletMoney=new Wallet({
                UserId:userId,
                balance:product.price,
                history:[{
                    amount:product.price,
                    transactionType:'credit',
                    method:'purchase Return',
                    currentAmount:product.price
                }]
            })
            await addingWalletMoney.save() 
        }else{
            walletData.balance+=product.price
            walletData.history.push({
                amount:product.price,
                transactionType:'credit',
                method:'Purchase Return',
                currentAmount:product.price
            })
            await walletData.save();
        }

        if(order.approvel==2&&product.reason!=='Defective or Damaged product'){
            item.quantity+=product.quantity
            await item.save()
        }
        
        await order.save()
        res.json({success:true})
    } catch (error) {
        console.log(error);
    }
}

const returnDecline=async(req,res)=>{
    try {
        const {orderId,productId}=req.body
        const order=await Order.findById(orderId)
        const product=order.items.find(item=>item.productId.toString()===productId)
        order.approvel=3
        product.status='Delivered'
        await order.save()
        res.json({success:true})
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    loadOrderList,
    loadOrderDetailList,
    changeStatus,
    returnApproev,
    returnDecline
}