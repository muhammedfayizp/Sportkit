<div class="mobile-menu-overlay"></div>
<div class="mobile-menu-container">
    <div class="mobile-menu-wrapper">
        <span class="mobile-menu-close"><i class="icon-close"></i></span>
        <form action="#" method="get" class="mobile-search">
            <label for="mobile-search" class="sr-only">Search</label>
            <input type="search" class="form-control" name="mobile-search" id="mobile-search" placeholder="Search in..." required>
            <button class="btn btn-primary" type="submit"><i class="icon-search"></i></button>
        </form>
        <nav class="mobile-nav ">
            <ul class="mobile-menu ml-3">
                <li><a href="/">Home</a></li>
                <li>
                    <a class="sf-with-ul" style="color: #000;">Category</a>
                    <div class="megamenu">
                        <div class="col-md-6">
                            <ul>
                                <% categories.forEach(category => { %>
                                    <li>
                                        <a href="<%= category.link %>">
                                            <span><%= category.name %></span>
                                        </a>
                                    </li>
                                <% }); %>
                            </ul>
                        </div>
                    </div>
                </li>
                <li><a href="/product">Product</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
        <div class="social-icons">
            <a class="social-icon" target="_blank" title="Facebook"><i class="icon-facebook-f"></i></a>
            <a class="social-icon" target="_blank" title="Twitter"><i class="icon-twitter"></i></a>
            <a class="social-icon" target="_blank" title="Instagram"><i class="icon-instagram"></i></a>
            <a class="social-icon" target="_blank" title="Youtube"><i class="icon-youtube"></i></a>
        </div>
    </div>
</div>
</div>  






<style>
    
    .mobile-menu-container {
    height: 500px; /* Set your desired height */
    overflow: hidden; /* Hide the scrollbar */
    margin-left: 79px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1001; /* Ensure the mobile menu is above other elements */
    transform: translateX(-100%); /* Initially hide the menu */
    transition: transform 0.3s ease-in-out;
}

.mobile-menu-container.active {
    transform: translateX(0); /* Show the menu */
}

.mobile-menu-wrapper {
    height: 100%; /* Ensure the wrapper takes the full height of the container */
    display: flex;
    flex-direction: column;
}

.mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none; /* Hide by default */
    z-index: 1000; /* Ensure the overlay is below the menu but above other elements */
}

.header-bottom .main-nav .menu > li {
    position: relative;
}

.header-bottom .main-nav .menu > li .dropdown-menu {
    display: none;
    position: absolute;
    background-color: white;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;
    min-width: 200px;
    padding: 12px 16px;
}

.header-bottom .main-nav .menu > li:hover .dropdown-menu {
    display: block;
}

.custom-control-input:checked ~ .custom-control-label::before {
    border-color: #007bff;
    background-color: #007bff;
}

.custom-control-input:focus ~ .custom-control-label::before {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}


    </style>

<div class="page-wrapper">
    <!-- Header -->
    <header class="header header-6">
        <!-- Header Top -->
        <div class="header-top">
            <div class="container">
                <div class="header-left">
                    <ul class="top-menu top-link-menu d-none d-md-block">
                        <li>
                            <ul>
                                <li><a href="tel:#"><i class="icon-phone"></i>Call: +91 23456 45789</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="header-right">
                    <div class="header-dropdown">
                        <a href="#">USD</a>
                        <div class="header-menu">
                            <ul>
                                <li><a href="#">Eur</a></li>
                                <li><a href="#">Usd</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Header Middle -->
        <div class="header-middle">
            <div class="container">
                <div class="header-left">
                    <div class="header-search header-search-extended header-search-visible d-none d-lg-block">
                        <a href="#" class="search-toggle" role="button"><i class="icon-search"></i></a>
                        <form id="search-form" action="#" method="get">
                            <div class="header-search-wrapper search-wrapper-wide">
                                <label for="q" class="sr-only">Search</label>
                                <button class="btn btn-primary" type="submit"><i class="icon-search"></i></button>
                                <input type="search" class="form-control" id="search-input" name="input" placeholder="Search product ..." required oninput="showApplyButton()">
                            </div>
                        </form>
                    </div>
                </div>
                <div class="header-center">
                    <a class="logo">
                        <img src="user/assets/images/demos/demo-6/logo.png" alt="Molla Logo" width="150" height="40">
                    </a>
                </div>
                <nav class="header__menu mobile-menu">
                    <div class="header-right">
                        <% if (locals.userData) { %>
                            <div style="margin-right: 15px;">
                                <a href="/userProfile">
                                    <i class="icon-user"></i>
                                </a>
                            </div>
                            <a href="/logout">
                                <i class="icons-signout"></i>
                                <span>Logout</span>
                            </a>
                        <% } else { %>
                            <div style="padding-left: 20px;">
                                <a href="/login">Login</a>
                            </div>
                        <% } %>
                        <a href="/wishlist" class="wishlist-link">
                            <i class="icon-heart-o" style="font-size: 20px;"></i>
                        </a>
                        <a href="/cart">
                            <i class="icon-shopping-cart" style="font-size: 25px; padding-left: 20px;"></i>
                        </a>
                    </div>
                </nav>
            </div>
        </div>
        <!-- Header Bottom -->
        <div class="header-bottom sticky-header">
            <div class="container">
                <div class="header-center">
                    <nav class="main-nav">
                        <ul class="menu sf-arrows">
                            <li class="megamenu-container">
                                <a href="/">Home</a>
                            </li>

                            <li class="dropdown">
                                <a class="sf-with-ul dropdown-toggle" id="dropdownMenuButton">Category</a>
                                <div class="dropdown-menu" id="widget-1">
                                    <div class="widget-body">
                                        <div class="filter-items filter-items-count">
                                            <% categories.forEach(category => { %>
                                            <div class="filter-item">
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input" id="<%= category._id %>" name="checkbox" value="<%= category._id %>">
                                                    <label class="custom-control-label" for="<%= category._id %>">
                                                        <a href="/product?categories=<%= category._id %>"><%= category.name %></a>
                                                    </label>
                                                </div>
                                            </div>
                                            <% }) %>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li><a href="/product">Product</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </nav>
                    <button class="mobile-menu-toggler">
                        <span class="sr-only">Toggle mobile menu</span>
                        <i class="icon-bars"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

  

<div class="mobile-menu-overlay"></div><!-- End .mobil-menu-overlay -->

<div class="mobile-menu-container">
    <div class="mobile-menu-wrapper">
        <span class="mobile-menu-close"><i class="icon-close"></i></span>

        <form action="#" method="get" class="mobile-search">
            <label for="mobile-search" class="sr-only">Search</label>
            <input type="search" class="form-control" name="mobile-search" id="mobile-search" placeholder="Search in..." required>
            <button class="btn btn-primary" type="submit"><i class="icon-search"></i></button>
        </form>
        
        <nav class="mobile-nav">
            <ul class="mobile-menu">
                <li class="active">
                    <a href="index.html">Home</a>

                    <ul>
                        <li><a href="index-1.html">01 - furniture store</a></li>
                        <li><a href="index-2.html">02 - furniture store</a></li>
                        <li><a href="index-3.html">03 - electronic store</a></li>
                        <li><a href="index-4.html">04 - electronic store</a></li>
                        <li><a href="index-5.html">05 - fashion store</a></li>
                        <li><a href="index-6.html">06 - fashion store</a></li>
                        <li><a href="index-7.html">07 - fashion store</a></li>
                        <li><a href="index-8.html">08 - fashion store</a></li>
                        <li><a href="index-9.html">09 - fashion store</a></li>
                        <li><a href="index-10.html">10 - shoes store</a></li>
                        <li><a href="index-11.html">11 - furniture simple store</a></li>
                        <li><a href="index-12.html">12 - fashion simple store</a></li>
                        <li><a href="index-13.html">13 - market</a></li>
                        <li><a href="index-14.html">14 - market fullwidth</a></li>
                        <li><a href="index-15.html">15 - lookbook 1</a></li>
                        <li><a href="index-16.html">16 - lookbook 2</a></li>
                        <li><a href="index-17.html">17 - fashion store</a></li>
                        <li><a href="index-18.html">18 - fashion store (with sidebar)</a></li>
                        <li><a href="index-19.html">19 - games store</a></li>
                        <li><a href="index-20.html">20 - book store</a></li>
                        <li><a href="index-21.html">21 - sport store</a></li>
                        <li><a href="index-22.html">22 - tools store</a></li>
                        <li><a href="index-23.html">23 - fashion left navigation store</a></li>
                        <li><a href="index-24.html">24 - extreme sport store</a></li>
                    </ul>
                </li>
                <li>
                    <a href="category.html">Shop</a>
                    <ul>
                        <li><a href="category-list.html">Shop List</a></li>
                        <li><a href="category-2cols.html">Shop Grid 2 Columns</a></li>
                        <li><a href="category.html">Shop Grid 3 Columns</a></li>
                        <li><a href="category-4cols.html">Shop Grid 4 Columns</a></li>
                        <li><a href="category-boxed.html"><span>Shop Boxed No Sidebar<span class="tip tip-hot">Hot</span></span></a></li>
                        <li><a href="category-fullwidth.html">Shop Fullwidth No Sidebar</a></li>
                        <li><a href="product-category-boxed.html">Product Category Boxed</a></li>
                        <li><a href="product-category-fullwidth.html"><span>Product Category Fullwidth<span class="tip tip-new">New</span></span></a></li>
                        <li><a href="cart.html">Cart</a></li>
                        <li><a href="checkout.html">Checkout</a></li>
                        <li><a href="wishlist.html">Wishlist</a></li>
                        <li><a href="#">Lookbook</a></li>
                    </ul>
                </li>
                <li>
                    <a href="product.html" class="sf-with-ul">Product</a>
                    <ul>
                        <li><a href="product.html">Default</a></li>
                        <li><a href="product-centered.html">Centered</a></li>
                        <li><a href="product-extended.html"><span>Extended Info<span class="tip tip-new">New</span></span></a></li>
                        <li><a href="product-gallery.html">Gallery</a></li>
                        <li><a href="product-sticky.html">Sticky Info</a></li>
                        <li><a href="product-sidebar.html">Boxed With Sidebar</a></li>
                        <li><a href="product-fullwidth.html">Full Width</a></li>
                        <li><a href="product-masonry.html">Masonry Sticky Info</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">Pages</a>
                    <ul>
                        <li>
                            <a href="about.html">About</a>

                            <ul>
                                <li><a href="about.html">About 01</a></li>
                                <li><a href="about-2.html">About 02</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="contact.html">Contact</a>

                            <ul>
                                <li><a href="contact.html">Contact 01</a></li>
                                <li><a href="contact-2.html">Contact 02</a></li>
                            </ul>
                        </li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="faq.html">FAQs</a></li>
                        <li><a href="404.html">Error 404</a></li>
                        <li><a href="coming-soon.html">Coming Soon</a></li>
                    </ul>
                </li>
                <li>
                    <a href="blog.html">Blog</a>

                    <ul>
                        <li><a href="blog.html">Classic</a></li>
                        <li><a href="blog-listing.html">Listing</a></li>
                        <li>
                            <a href="#">Grid</a>
                            <ul>
                                <li><a href="blog-grid-2cols.html">Grid 2 columns</a></li>
                                <li><a href="blog-grid-3cols.html">Grid 3 columns</a></li>
                                <li><a href="blog-grid-4cols.html">Grid 4 columns</a></li>
                                <li><a href="blog-grid-sidebar.html">Grid sidebar</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Masonry</a>
                            <ul>
                                <li><a href="blog-masonry-2cols.html">Masonry 2 columns</a></li>
                                <li><a href="blog-masonry-3cols.html">Masonry 3 columns</a></li>
                                <li><a href="blog-masonry-4cols.html">Masonry 4 columns</a></li>
                                <li><a href="blog-masonry-sidebar.html">Masonry sidebar</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Mask</a>
                            <ul>
                                <li><a href="blog-mask-grid.html">Blog mask grid</a></li>
                                <li><a href="blog-mask-masonry.html">Blog mask masonry</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Single Post</a>
                            <ul>
                                <li><a href="single.html">Default with sidebar</a></li>
                                <li><a href="single-fullwidth.html">Fullwidth no sidebar</a></li>
                                <li><a href="single-fullwidth-sidebar.html">Fullwidth with sidebar</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="elements-list.html">Elements</a>
                    <ul>
                        <li><a href="elements-products.html">Products</a></li>
                        <li><a href="elements-typography.html">Typography</a></li>
                        <li><a href="elements-titles.html">Titles</a></li>
                        <li><a href="elements-banners.html">Banners</a></li>
                        <li><a href="elements-product-category.html">Product Category</a></li>
                        <li><a href="elements-video-banners.html">Video Banners</a></li>
                        <li><a href="elements-buttons.html">Buttons</a></li>
                        <li><a href="elements-accordions.html">Accordions</a></li>
                        <li><a href="elements-tabs.html">Tabs</a></li>
                        <li><a href="elements-testimonials.html">Testimonials</a></li>
                        <li><a href="elements-blog-posts.html">Blog Posts</a></li>
                        <li><a href="elements-portfolio.html">Portfolio</a></li>
                        <li><a href="elements-cta.html">Call to Action</a></li>
                        <li><a href="elements-icon-boxes.html">Icon Boxes</a></li>
                    </ul>
                </li>
            </ul>
        </nav><!-- End .mobile-nav -->

        <div class="social-icons">
            <a href="#" class="social-icon" target="_blank" title="Facebook"><i class="icon-facebook-f"></i></a>
            <a href="#" class="social-icon" target="_blank" title="Twitter"><i class="icon-twitter"></i></a>
            <a href="#" class="social-icon" target="_blank" title="Instagram"><i class="icon-instagram"></i></a>
            <a href="#" class="social-icon" target="_blank" title="Youtube"><i class="icon-youtube"></i></a>
        </div><!-- End .social-icons -->
    </div><!-- End .mobile-menu-wrapper -->
</div><!-- End .mobile-menu-container -->

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const mobileMenuToggler = document.querySelector('.mobile-menu-toggler');
        const mobileMenuContainer = document.querySelector('.mobile-menu-container');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');

        mobileMenuToggler.addEventListener('click', function () {
            mobileMenuContainer.classList.add('active');
            mobileMenuOverlay.style.display = 'block';
        });

        mobileMenuClose.addEventListener('click', function () {
            mobileMenuContainer.classList.remove('active');
            mobileMenuOverlay.style.display = 'none';
        });

        mobileMenuOverlay.addEventListener('click', function () {
            mobileMenuContainer.classList.remove('active');
            mobileMenuOverlay.style.display = 'none';
        });
    });
</script>

<script>
    function showApplyButton() {
        const searchInput = document.getElementById('search-input');
        const applyButton = document.getElementById('apply');

        if (searchInput.value.trim().length > 0) {
            applyButton.style.display = 'inline-block';
        } else {
            applyButton.style.display = 'none';
        }
    }
</script>

