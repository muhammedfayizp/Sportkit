{/* <div class="pc-mob-header pc-header">
		<div class="pcm-toolbar">
			<a href="#!" class="pc-head-link" id="mobile-collapse">
				<div class="hamburger hamburger--arrowturn">
					<div class="hamburger-box">
						<div class="hamburger-inner"></div>
					</div>
				</div>
			</a>
			<div class="right-links">
				<a href="#!" class="pc-head-link" id="headerdrp-collapse">
					<i data-feather="more-vertical"></i>
				</a>
			</div>
		</div>
	</div> */}
    <!--
     <script>
    function change(){
        const value = document.getElementById('select').value.trim();
        if(value){
            window.location.href = `/admin/sales?type=${value}`;
        }
    }
</script>

<script>
    function apply() {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        console.log('startDate:', formattedStartDate, 'endDate:', formattedEndDate);
        window.location.href = `/admin/sales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
</script> -->










<div class="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="updateModalLabel">Update Item</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form id="updateForm">
                <div class="form-group">
                    <label for="input1">minimum price</label>
                    <input type="text" class="form-control" id="input1" value="" required>
                </div>
                <div class="form-group">
                    <label for="input2">Discount</label>
                    <input type="text" class="form-control" id="input2" required>
                </div>
                <div class="form-group">
                    <label for="input3">Expairy Date</label>
                    <input type="text" class="form-control" id="input3" required>
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
            </form>
        </div>
    </div>
</div>
</div>
