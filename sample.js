<% if (game.Status === 'Cancelled') { %>
    <!-- If the game is cancelled, do not display the dropdown -->
<% } else { %>
    <div class="form-group col-md-2">
        <label for="statusSelect" style="font-size: 16px; color: black;">Status</label>
        <select class="form-control statusSelect" id="statusSelect<%= index %>" data-orderid="<%= order._id %>" data-gameid="<%= game.gameId._id %>">
            <option style="font-size: 16px; color: black;" value="Confirmed" <%= game.Status === 'Confirmed' ? 'selected' : '' %>>Confirmed</option>
            <option style="font-size: 16px; color: black;" value="Shipped" <%= game.Status === 'Shipped' ? 'selected' : '' %>>Shipped</option>
            <option style="font-size: 16px; color: black;" value="Delivered" <%= game.Status === 'Delivered' ? 'selected' : '' %>>Delivered</option>
            <option style="font-size: 16px; color: black;" value="Cancelled" <%= game.Status === 'Cancelled' ? 'selected' : '' %>>Cancelled</option>
        </select>
    </div>
<% } %>


<script>
    document.querySelectorAll('.statusSelect').forEach(selectElement => {
        selectElement.addEventListener('change', function() {
            const selectedValue = this.value;
            const orderId = this.getAttribute('data-orderid');
            const gameId = this.getAttribute('data-gameid');

            fetch('/admin/changeStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: selectedValue, orderId: orderId , gameId: gameId})
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    });
</script>

// ********** FOR CHANGING THE STATUS IN ADMIN SIDE ********** 
const changeStatus = async (req,res)=>{
    try {
        
    const {status , orderId , gameId} = req.body
    const order = await Order.findById(orderId);
    if(!order){
        return res.status(404).json({message: 'Order not found'})
    }
    const game = order.games.find(item=>item.gameId.toString()===gameId)
    game.Status = status;
    await order.save()
   
    }catch(error){
        console.log(error);
    }
}