<%-include('../layouts/header')%>
    <%-include('../layouts/navbar')%>
        <style>
            .discount-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 10px;
                padding: 10px;
            }

            .checkout-discount form {
                display: inline-block;
            }

            .form-control {
                font-size: 14px;
                border: 1px solid #ced4da;
                border-radius: 5px;
            }

            .text-truncate span {
                color: #007bff;
                cursor: pointer;
            }

            .action-buttons button {
                margin-left: 10px;
                padding: 10px 10px;
                font-size: 14px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            #checkout-discount-input {
                margin-top: 17px;
                width: 340px;
            }

            #apply-coupon {
                background-color: #28a745;
                color: white;
            }

            #apply-coupon:hover {
                background-color: #218838;
            }

            #remove-coupon {
                background-color: #dc3545;
                color: white;
            }

            #remove-coupon:hover {
                background-color: #c82333;
            }

            .discount-container,
            .checkout {
                max-width: 100%;
                margin: auto;
            }

            .checkout-discount form {
                display: block;
                width: 100%;
            }

            .form-control,
            .action-buttons button {
                font-size: 16px;
                padding: 12px 20px;
            }

            .right-container {
                display: flex;
                align-items: center;
            }

            @media (max-width: 768px) {
                .discount-container {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .right-container {
                    flex-direction: column;
                    align-items: flex-start;
                    width: 100%;
                }

                .checkout-discount form,
                .action-buttons {
                    width: 100%;
                }

                .action-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1px;
                }

                .action-buttons button {
                    width: 48%;
                    margin-left: 0;
                }

                #checkout-discount-input {
                    width: 100%;
                }
            }

            .card-body p {
                margin: 0;
            }

            .card-body h4 {
                font-size: 1.25rem;
                margin-bottom: 0.5rem;
            }

            .text-center button a {
                color: inherit;
                text-decoration: none;
            }

            .text-center button {
                background: none;
                border: none;
                padding: 0;
                cursor: pointer;
                color: #007bff;
            }

            .text-center button a:hover {
                text-decoration: underline;
            }

            .view-button-container {
                position: relative;
                display: inline-block;

            }

            .view-button {
                background-color: #b9c2cb;
                color: white;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s ease;
                cursor: pointer;
                border-radius: 5px;
            }

            .view-button:hover {
                background-color: #778ca3;
            }

            .view-button:active {
                background-color: #c5ccd4;
                box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.3);
            }

            .card-body-1 {

                width: 300px;
                border: none;
                height: 300px;
                border-radius: 15px;
                padding: 20px;
                margin-left: 15px;
                background-image: linear-gradient(to bottom right, #393131, #FF8A80);
            }

            .percent {

                font-size: 56px;
                color: #fff;
            }

            .discount {

                font-size: 27px;
                color: #fff;
            }


            .line {

                color: #fff;
            }



            .form-check-input:checked {
                background-image: linear-gradient(to bottom right, #393131, #FF8A80);
                border-color: #F44336;
            }


            .form-check-input:focus {
                border-color: #d50000;
                outline: 0;
                box-shadow: none;
            }


            .form-check {
                display: block;
                min-height: 1.5rem;
                padding-left: 1.75em;
                margin-bottom: -5px;
            }

            .input-container {
                position: relative;
                width: 100%;
                height: 100%;
            }

            .copy-button input {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                font-size: 15px;
                background-image: linear-gradient(to bottom right, #393131, #FF8A80);
                padding-right: 80px;
                box-sizing: border-box;
                color: #fff;
            }

            .copy-button button {
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                padding: 5px 20px;
                background-color: #dc143c;
                color: #fff;
                border: 1px solid transparent;
                height: 80%;
                cursor: pointer;
            }

            .copy-button {
                margin: 12px 0 -5px 0;
                height: 45px;
                border-radius: 4px;
                padding: 0 5px;
                border: 1px solid #e1e1e1;
            }

            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.4);
            }

            .modal-content {
                background-color: #fefefe;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                position: relative;
            }

            .close {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 28px;
                font-weight: bold;
                color: #000;
                cursor: pointer;
            }

            @media (max-width: 576px) {
                .discount-container, .right-container {
                    flex-direction: column;
                }

                .action-buttons button {
                    width: 100%;
                    margin: 5px 0;
                }

                .discount-container, .checkout {
                    padding: 10px;
                }

                .form-control, .action-buttons button {
                    padding: 10px 15px;
                }

                .view-button, .copy-button button {
                    padding: 7px 15px;
                }

                .modal-content {
                    width: 90%;
                    margin: 5% auto;
                }

                .card-body-1 {
                    width: 95%;
                    margin: 10px auto;
                }
            }
               
        </style>
        <main class="main">
            <div class="page-header text-center" style="background-image: url('assets/images/page-header-bg.jpg')">
                <div class="container">
                    <h1 class="page-title">Checkout</h1>
                </div><!-- End .container -->
            </div><!-- End .page-header -->
            <nav aria-label="breadcrumb" class="breadcrumb-nav">
                <div class="container">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/product">Shop</a></li>
                        <li class="breadcrumb-item active">Checkout</li>
                    </ol>
                </div><!-- End .container -->
            </nav><!-- End .breadcrumb-nav -->

            <div class="page-content">
                <div class="checkout">
                    <div class="container">

                        <div class="discount-container">
                            <div class="view-button-container">
                                <button class="view-button" onclick="toggleCoupons()" aria-label="Toggle Coupons">View</button>                            
                            </div>
                            <div id="myModal" class="modal">
                                <div class="modal-content">
                                    <span class="close" onclick="closeModal()">&times;</span>
                                    <div id="couponSection" class="col-lg-12 col-md-6 hidden">
                                        <div class="card">
                                            <div class="card-header">My Coupons</div>
                                            <% if (coupons && coupons.length> 0) { %>
                                                <div class="row">
                                                    <% coupons.forEach((item, index)=> { %>
                                                        <% if (item) { %>
                                                            <div
                                                                class="col-lg-4 col-md-6 m-2 d-flex flex-column align-items-center">
                                                                <div class="card-body-1">
                                                                    <div class="text-center">
                                                                        <div class="d-flex flex-row text-center">
                                                                            <div
                                                                                class="d-flex flex-column text-center text-white">
                                                                                <span>min purchase:</span>
                                                                                <span>₹<%= item.minimumPrice %></span>
                                                                            </div>
                                                                            <div class="d-flex flex-column ml-1">
                                                                                <h1 class="mb-0 percent pl-5">
                                                                                    <%= item.discount %>%
                                                                                </h1>
                                                                                <span
                                                                                    class="discount pl-5">Discount</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <hr class="line">
                                                                    <div class="copy-button">
                                                                        <div class="input-container">
                                                                            <input id="copyvalue-<%= index %>" type="text" readonly value="<%= item.couponCode %>" >
                                                                            <button onclick="copyIt('<%= index %>')" class="copybtn">COPY</button>
                                                                        </div>
                                                                    </div>
                                                                    <p
                                                                        class="d-flex justify-content-end mt-4 text-dark">
                                                                        Exp : <%= new
                                                                            Date(item.expiryDate).toLocaleString('en-IN',
                                                                            {year: 'numeric' , month: '2-digit' ,
                                                                            day: '2-digit' }) %>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <% } %>
                                                                <% }) %>
                                                </div>
                                                <% } else { %>
                                                    <p>you have no coupon.</p>
                                                    <% } %>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="right-container">
                                <div class="checkout-discount">
                                    <form id="coupon-form">
                                        <input type="text" class="form-control" required id="checkout-discount-input">
                                        <label for="checkout-discount-input" class="text-truncate">Have a coupon?
                                            <span>Click here to enter your code</span>
                                        </label>
                                    </form>
                                </div>
                                <div class="action-buttons">
                                    <button type="submit" form="coupon-form" id="apply-coupon" aria-label="Apply Coupon">Apply</button>
                                    <button type="reset" form="coupon-form" id="remove-coupon" aria-label="Remove Coupon">Remove</button>
                                </div>
                            </div>
                        </div>
                        <form action="/placeOrder" method='POST' id="orderForm">
                            <h5 class="modal-title" id="billingModalLabel">Billing Address</h5>
                            <% if (errormsg) { %>
                                <div class="text-center" style="color: red; background: white;">
                                    <%= errormsg %>
                                </div>
                                <% } %>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-8">
                                                <div class="text-right mb-3">
                                                    <button id="addAddressBtn" class="btn btn-primary" type="button"
                                                        data-toggle="modal" data-target="#addAddressModal">
                                                        Add New Address
                                                    </button>
                                                </div>
                                                <div class="card mb-4">
                                                    <div class="card-body">
                                                        <div class="row">
                                                            <% if(addressData && addressData.address){ %>
                                                                <% addressData.address.forEach((addresses, index)=> { %>
                                                                    <div class="col-md-6 col-lg-4 mb-3">
                                                                        <div class="card">
                                                                            <div class="card-body">
                                                                                <h4>Address <%= index + 1 %>
                                                                                </h4>
                                                                                <p>
                                                                                    <%= addresses.name %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.email %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.mobile %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.pincode %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.state %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.dist %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.city %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.area %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.houseName %>
                                                                                </p>
                                                                                <p>
                                                                                    <%= addresses.houseNo %>
                                                                                </p>
                                                                                <div class="text-center mb-2 mt-2">
                                                                                    <input type="radio"
                                                                                        name="selectedAddress"
                                                                                        value="<%= addresses._id %>">
                                                                                    <label>Select</label>
                                                                                    <button><a href="#"
                                                                                            onclick="editAddress('<%= addresses._id %>')">Edit</a></button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <% }) %>
                                                                        <% } %>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <form action="">
                                                    <div class="summary">
                                                        <h3 class="summary-title">Your Order</h3>
                                                        <table class="table table-summary">
                                                            <thead>
                                                                <tr>
                                                                    <th>Product</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                <% if(cartData && cartData.length> 0) { %>
                                                                    <% let subtotal=0; %>
                                                                        <% cartData.forEach(product=> { %>
                                                                            <tr>
                                                                                <td><a>
                                                                                        <%= product.productId.name %>
                                                                                    </a></td>
                                                                                <% if(product.productId.finalPrice) { %>
                                                                                    <td>₹<%= product.productId.finalPrice
                                                                                            %>
                                                                                    </td>
                                                                                    <% } else { %>
                                                                                        <td>₹<%= product.productId.price
                                                                                                %>
                                                                                        </td>
                                                                                        <% } %>
                                                                            </tr>
                                                                            <% subtotal +=product.totalAmount; %>
                                                                                <% }); %>
                                                                                    <tr class="summary-subtotal">
                                                                                        <td>Subtotal:</td>
                                                                                        <td>₹<%= subtotal %>
                                                                                        </td>
                                                                                    </tr><!-- End .summary-subtotal -->
                                                                                    <% if(deliveryCharge> 0) { %>
                                                                                        <tr>
                                                                                            <td>Shipping:</td>
                                                                                            <td>₹<%= deliveryCharge %>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <% } else { %>
                                                                                            <tr>
                                                                                                <td>Shipping:</td>
                                                                                                <td>
                                                                                                    <%= deliveryCharge>
                                                                                                        0 ? '₹' +
                                                                                                        deliveryCharge :
                                                                                                        'Free shipping'
                                                                                                        %>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <% } %>

                                                                                                <% if(discount) { %>
                                                                                                    <tr>
                                                                                                        <td>Coupon (<%=
                                                                                                                discount
                                                                                                                %>%):
                                                                                                        </td>
                                                                                                        <td>-₹<%=
                                                                                                                discountAmount
                                                                                                                %>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <% } %>
                                                                                                        <tr
                                                                                                            class="summary-total">
                                                                                                            <td>Total:
                                                                                                            </td>
                                                                                                            <td
                                                                                                                id="cart-total-price">
                                                                                                                ₹<%= deliveryCharge?
                                                                                                                    (totalCartPrice
                                                                                                                    +
                                                                                                                    deliveryCharge)
                                                                                                                    :
                                                                                                                    totalCartPrice
                                                                                                                    %>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        <!-- End .summary-total -->
                                                                                                        <% } else { %>
                                                                                                            <tr>
                                                                                                                <td
                                                                                                                    colspan="2">
                                                                                                                    Your
                                                                                                                    cart
                                                                                                                    is
                                                                                                                    empty
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <% } %>
                                                            </tbody>


                                                        </table>
                                                        <div class="accordion-summary" id="accordion-payment">
                                                            <div class="card">
                                                                <div class="card-header" id="heading-1">
                                                                    <h2 class="card-title">
                                                                        <label>
                                                                            <input type="radio" name="payment-method"
                                                                                value="Wallet">
                                                                            Wallet
                                                                        </label>
                                                                    </h2>
                                                                </div><!-- End .card-header -->
                                                                <div id="collapse-1" class="collapse"
                                                                    aria-labelledby="heading-1"
                                                                    data-parent="#accordion-payment">
                                                                </div><!-- End .collapse -->
                                                            </div><!-- End .card -->

                                                            <div class="card">
                                                                <div class="card-header" id="heading-3">
                                                                    <h2 class="card-title">
                                                                        <label>
                                                                            <input type="radio" name="payment-method"
                                                                                value="cash-on-delivery">
                                                                            Cash on delivery
                                                                        </label>
                                                                    </h2>
                                                                </div><!-- End .card-header -->
                                                                <div id="collapse-3" class="collapse"
                                                                    aria-labelledby="heading-3"
                                                                    data-parent="#accordion-payment">
                                                                </div><!-- End .collapse -->
                                                            </div><!-- End .card -->

                                                            <div class="card">
                                                                <div class="card-header" id="heading-4">
                                                                    <h2 class="card-title">
                                                                        <label>
                                                                            <input type="radio" name="payment-method"
                                                                                value="online-payment">
                                                                            Online Payment
                                                                        </label>
                                                                    </h2>
                                                                </div><!-- End .card-header -->
                                                                <div id="collapse-4" class="collapse"
                                                                    aria-labelledby="heading-4"
                                                                    data-parent="#accordion-payment">
                                                                </div><!-- End .collapse -->
                                                            </div><!-- End .card -->

                                                            <div class="card">
                                                                <div class="card-header" id="heading-5">
                                                                    <h2 class="card-title">
                                                                        <label>
                                                                            <img src="/user/assets/images/payments-summary.png"
                                                                                alt="payments cards">
                                                                        </label>
                                                                    </h2>
                                                                </div><!-- End .card-header -->
                                                                <div id="collapse-5" class="collapse"
                                                                    aria-labelledby="heading-5"
                                                                    data-parent="#accordion-payment">
                                                                </div><!-- End .collapse -->
                                                            </div><!-- End .card -->

                                                        </div>
                                                        <button type="submit"
                                                            class="btn btn-outline-primary-2 btn-order btn-block">
                                                            <span>Place Order</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- Modal -->
                                    <div class="modal fade" id="addAddressModal" tabindex="-1" role="dialog"
                                        aria-labelledby="addAddressModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="addAddressModalLabel">Add Address</h5>
                                                    <button type="button" class="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <form method="post" action="/addnewAddress"
                                                        onsubmit="return validation()">
                                                        <div class="form-group px-2">
                                                            <label for="Name">Name:</label>
                                                            <input type="text" class="form-control" id="Name"
                                                                name="Name" placeholder="Enter your Name">
                                                            <span id="errorName" class="text-danger"></span>
                                                        </div>
                                                        <div class="form-group px-2">
                                                            <label for="Mobile">Mobile:</label>
                                                            <input type="text" class="form-control" id="Mobile"
                                                                name="Mobile" placeholder="Enter your Mobile number">
                                                            <span id="errorMobile" class="text-danger"></span>
                                                        </div>
                                                        <div class="form-row px-2">
                                                            <div class="form-group col">
                                                                <label for="Pincode">Pincode:</label>
                                                                <input type="text" class="form-control" id="Pincode"
                                                                    name="Pincode" placeholder="Enter Pincode">
                                                                <span id="errorPincode" class="text-danger"></span>
                                                            </div>
                                                            <div class="form-group col">
                                                                <label for="State">State:</label>
                                                                <input type="text" class="form-control" id="State"
                                                                    name="State" placeholder="Enter state">
                                                                <span id="errorState" class="text-danger"></span>
                                                            </div>
                                                        </div>
                                                        <div class="form-row px-2">
                                                            <div class="form-group col">
                                                                <label for="District">District:</label>
                                                                <input type="text" class="form-control" id="District"
                                                                    name="District" placeholder="Enter District">
                                                                <span id="errorDistrict" class="text-danger"></span>
                                                            </div>
                                                            <div class="form-group col">
                                                                <label for="City">City:</label>
                                                                <input type="text" class="form-control" id="City"
                                                                    name="City" placeholder="Enter City">
                                                                <span id="errorCity" class="text-danger"></span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group px-2">
                                                            <label for="houseAddress">House Address:</label>
                                                            <input type="text" class="form-control" id="houseAddress"
                                                                name="houseAddress" placeholder="Enter House Address">
                                                            <span id="errorhouseAddress" class="text-danger"></span>
                                                        </div>
                                                        <div class="form-row px-2">
                                                            <div class="col-6">
                                                                <label>House No:</label>
                                                                <input type="text" class="form-control" id="houseNumber"
                                                                    name="houseNumber" placeholder="Enter House Number">
                                                                <span id="errorhouseNumber" class="text-danger"></span>
                                                            </div>
                                                        </div>
                                                        <div class="text-center">
                                                            <button type="submit"
                                                                class="btn btn-primary">Submit</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                    </div><!-- End .col-lg-9 -->

                </div><!-- End .row -->
                </form>
            </div><!-- End .container -->
            </div><!-- End .checkout -->
            </div><!-- End .page-content -->
        </main><!-- End .main -->

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script>
            function validation() {
                const name = document.getElementById('Name').value.trim();
                const mobile = document.getElementById('Mobile').value.trim();
                const pincode = document.getElementById('Pincode').value.trim()
                const state = document.getElementById('State').value.trim()
                const district = document.getElementById('District').value.trim()
                const city = document.getElementById('City').value.trim()
                const houseAddress = document.getElementById('houseAddress').value.trim()
                const houseNo = document.getElementById('houseNumber').value.trim()




                document.getElementById('errorName').innerText = '';
                document.getElementById('errorMobile').innerText = '';
                document.getElementById('errorPincode').innerText = '';
                document.getElementById('errorState').innerText = '';
                document.getElementById('errorDistrict').innerText = '';
                document.getElementById('errorCity').innerText = '';
                document.getElementById('errorhouseAddress').innerText = '';
                document.getElementById('errorhouseNumber').innerText = '';

                let nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
                const mobileRegex = /^\d{10}$/;
                let pincodeRegex = /^.{6,}$/;
                let stateRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
                let cityRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

                let districtRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
                let houseAddressRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
                let houseNoRegex = /^.{4,}$/;

                if (name === '') {
                    errorName.innerText = 'name cannot be empty';
                    return false;
                } else if (!nameRegex.test(name)) {
                    errorName.innerText = 'name can only contain letters and spaces';
                    return false;
                } else if (name.charAt(0) === '') {
                    errorName.innerText = 'please remove the space'
                    return false
                }



                if (mobile === "") {
                    errorMobile.innerText = "Mobile number cannot be empty";
                    return false;
                } else if (!mobileRegex.test(mobile)) {
                    errorMobile.innerText = "Please enter a valid 10-digit mobile number";
                    return false;
                }


                if (pincode === "") {
                    errorPincode.innerText = "Pincode cannot be empty";
                    return false;
                } else if (!pincodeRegex.test(pincode)) {
                    errorPincode.innerText = "Pincode must be at least 5 characters";
                    return false;
                }

                if (state === "") {
                    errorState.innerText = "State cannot be empty";
                    return false;
                } else if (!stateRegex.test(state)) {
                    errorState.innerText = "only enter characters";
                    return false;
                }

                if (district === "") {
                    errorDistrict.innerText = "district cannot be empty";
                    return false;
                } else if (!districtRegex.test(district)) {
                    errorDistrict.innerText = "only enter characters";
                    return false;
                }

                if (city === "") {
                    errorCity.innerText = "Email cannot be empty";
                    return false;
                } else if (!cityRegex.test(city)) {
                    errorCity.innerText = "only enter characters";
                    return false;
                }


                if (houseAddress === "") {
                    errorhouseAddress.innerText = "Email cannot be empty";
                    return false;
                } else if (!houseAddressRegex.test(houseAddress)) {
                    errorhouseAddress.innerText = "only enter characters";
                    return false;
                }
                if (houseNo === "") {
                    errorhouseNumber.innerText = "Email cannot be empty";
                    return false;
                } else if (!houseNoRegex.test(houseNo)) {
                    errorhouseNumber.innerText = "house number can only contain numbers";
                    return false;
                }


                return true;
            }


            function editAddress(addressId) {
                var checkouteditAddressUrl = '/checkoutAdsedit?addressId=' + addressId;
                window.location.href = checkouteditAddressUrl
            }


            document.addEventListener('DOMContentLoaded', () => {
                function placeOrder(paymentMethodType, addressId, status) {
                    const body = JSON.stringify({ paymentMethodType, addressId, status });
                    fetch('/placeOrder', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: body,
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Order Successful',
                                text: data.message || 'Your order was placed successfully!',
                            }).then(() => {
                                window.location.href = '/';
                            });
                        } else {
                            let title = 'Order Failed';
                            let text = data.message;
                            let icon = 'error';
                            if (data.message === 'not_available') {
                                title = 'Error';
                                text = 'Cash on delivery not available for purchases above 2500';
                            } else if (data.message === 'no_wallet') {
                                title = 'No Wallet';
                                text = 'You have no wallet';
                            } else if (data.message === 'insufficient_balance') {
                                title = 'Insufficient Balance';
                                text = `You don't have enough balance in your wallet.`;
                            } else if (data.message === 'your payment failed') {
                                icon = 'info';
                                text = 'Your payment failed';
                            }
                            Swal.fire({
                                icon: icon,
                                title: title,
                                text: text,
                            }).then(() => {
                                window.location.href = '/orderHistoryList';
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                }

                let totalCartPrice = $('#cart-total-price').text().replace('₹', '').trim();
                function razorPay(paymentMethodType, addressId) {
                    let cartTotal = totalCartPrice * 100;
                    fetch('/razorpay', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cartTotal
                        })
                    }).then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                let options = {
                                    "key": data.key_id,
                                    "amount": data.amount,
                                    "currency": "INR",
                                    "name": "Sportkit",
                                    "order_id": data.orderid,
                                    "handler": function (response) {
                                        placeOrder(paymentMethodType, addressId, 'Success');
                                    },
                                    "prefill": {
                                        "name": data.name,
                                        "email": data.email
                                    }
                                };

                                let razorpayObject = new Razorpay(options);
                                razorpayObject.on('payment.failed', (response) => {
                                    placeOrder(paymentMethodType, addressId, 'Failed');
                                });
                                razorpayObject.open();
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }



                document.querySelector('#orderForm').addEventListener('submit', (event) => {
                    event.preventDefault();
                    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
                    const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked');

                    if (!selectedAddress) {
                        Swal.fire({
                            icon: 'info',
                            title: 'No Address',
                            text: 'Please select an address ',
                        });
                        return;
                    }

                    if (!paymentMethod) {
                        Swal.fire({
                            icon: 'info',
                            title: 'No Payment Method',
                            text: 'Please select a payment',
                        });
                        return;
                    }

                    if (paymentMethod.value === 'online-payment') {
                        razorPay(paymentMethod.value, selectedAddress.value);
                    } else {
                        placeOrder(paymentMethod.value, selectedAddress.value);
                    }
                });
            });
        </script>

        <script>
            document.getElementById('apply-coupon').addEventListener('click', function (event) {
                event.preventDefault()
                let couponNumber = document.getElementById('checkout-discount-input').value;
                fetch('/couponVerify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        couponNumber
                    })
                }).then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire(
                                'success',
                                'your coupon successfully applied',
                                'success'
                            ).then(() => {
                                window.location.reload()
                            })
                        } else {
                            Swal.fire(
                                'error',
                                'coupon not found',
                                'error'
                            )
                        }
                    })

            });
        </script>
        <script>
            function toggleCoupons() {
                var modal = document.getElementById('myModal');
                modal.style.display = 'block';
            }

            function closeModal() {
                var modal = document.getElementById('myModal');
                modal.style.display = 'none';
            }
        </script>

        <script>
            function copyIt(index) {
                let copyInput = document.querySelector('#copyvalue-' + index);
                copyInput.select();
                document.execCommand("copy");
                let copybtn = copyInput.nextElementSibling;
                copybtn.textContent = "COPIED";
            }
        </script>
        <%-include('../layouts/footbar') %>
            <%-include('../layouts/footer') %>