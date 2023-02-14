const BASEURL = "data/";
let url = window.location.pathname;
function ajaxCallBack(fileName, result){
  $.ajax({
      url: BASEURL + fileName,
      method: "get",
      dataType: "json", 
      success: result,
      error: function(xhr){
          console.log(formatErrorMessage(xhr, xhr.status));
      }
  })
};
function formatErrorMessage(jqXHR, exception) {
  if (jqXHR.status === 0) {
      return ('Not connected.\nPlease verify your network connection.');
  } else if (jqXHR.status == 404) {
      return ('The requested page not found. [404]');
  } else if (jqXHR.status == 500) {
      return ('Internal Server Error [500].');
  } else if (exception === 'parsererror') {
      return ('Requested JSON parse failed.');
  } else if (exception === 'timeout') {
      return ('Time out error.');
  } else if (exception === 'abort') {
      return ('Ajax request aborted.');
  } else {
      return ('Uncaught Error.\n' + jqXHR.responseText);
  }
};
if(!localStorage.getItem('wishlist')){
 addToLocalStorage('wishlist', []);
}
let users = fetch(BASEURL + 'users.json')
.then(response => response.json()).then(data => {
    addToLocalStorage('users', data);
});
let comments = fetch(BASEURL + 'comments.json')
.then(response => response.json()).then(data => {
  addToLocalStorage('comments', data);
});
ajaxCallBack('categories.json', function(data){
  addToLocalStorage('categories', data);
});
ajaxCallBack('productsSections.json' , function(data){
  addToLocalStorage('sectionsProducts', data);
});
ajaxCallBack('colors.json', function(data){
  addToLocalStorage('colors', data);
});
ajaxCallBack('menu.json', function(data){
  printMenu(data)
});
if(getFromLocalStorage('cart')){
  let numberInCart = document.querySelector('.aa-cart-notify');
  numberInCart.innerHTML = getFromLocalStorage('cart').length;
}
else{
  numberInCart = document.querySelector('.aa-cart-notify');
  numberInCart.innerHTML = '0';
  addToLocalStorage('cart', []);
}
let navBar = document.querySelector('.navbar-nav');
let navBtn = document.querySelector('.navbar-toggle');
navBtn.addEventListener('click', function(){
  navBar.classList.add('active');
});
function printMenu(menu){
    $('.navbar-nav').html('');
    $('.navbar-nav').html(menu.map(item => `
    <li><a href="${item.href}">${item.name}</a></li>
    `));
};
function productsAndTheirSections(product, sectionProducts){
    let returnValue = '';
        if(product.productsSectionId == null)
        {
            return returnValue;
        }
        for(let i = 0; i < sectionProducts.length; i++)
        {
        if(sectionProducts[i].id == product.productsSectionId){
            if(sectionProducts[i].id == 1){
              returnValue = `<span class="aa-badge aa-sale" href="#">${sectionProducts[i].name.toUpperCase()}</span>`;
            }
            if(sectionProducts[i].id == 2){
              returnValue = `<span class="aa-badge aa-sold-out" href="#">${sectionProducts[i].name.toUpperCase()}</span>`;
            }
            if(sectionProducts[i].id == 3){
              returnValue = `<span class="aa-badge aa-popular" href="#">${sectionProducts[i].name.toUpperCase()}</span>`;
            }
            if(sectionProducts[i].id == 4){
              returnValue = `<span class="aa-badge aa-hot" href="#">${sectionProducts[i].name.toUpperCase()}</span>`;
            }
        }
    }
   
    return returnValue;
};
function productDiscount(product){
    let returnValue = '';
    if(product.price.oldPrice == null){
      returnValue = `<span class="aa-product-price">$${product.price.activePrice}</span>`;
    }
    else{
      returnValue = `<span class="aa-product-price">$${product.price.activePrice} </span> <span class="aa-product-price"><del>$${product.price.oldPrice}</del> <span class="red-discount">(-${product.discountPercent}%)</span></span>`;
    }
    return returnValue;
};
function indexProducts(products, category, divName){
  let filteredProducts;
  if(category == 'male'){
    filteredProducts = products.filter(product => product.genderId == 1);
  }
  if(category == 'female'){
    filteredProducts = products.filter(product => product.genderId == 2);
  }
  if(category == 'sport'){
    filteredProducts = products.filter(product => product.genderId == 3);
  }
    let divWrapper = document.querySelector(divName);
    let sections = getFromLocalStorage('sectionsProducts');
    for(let i=0; i<8; i++){
            divWrapper.innerHTML += ` 
            <li>
            <figure>
              <a class="aa-product-img" href="product-detail.html" data-prid="${filteredProducts[i].id}" onclick="storeSingleProductToLS(this)"><img src="${filteredProducts[i].image}" alt="${filteredProducts[i].name}"></a>
              ${disableCartButton(filteredProducts[i], 'hover')}
                <figcaption>
                <h4 class="aa-product-title"><a href="#">${filteredProducts[i].name}</a></h4>
                ${productDiscount(filteredProducts[i])}
              </figcaption>
            </figure>                        
            <div class="aa-product-hvr-content">
              <a data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><span class="fa fa-heart-o wish-btn pr-btns" data-prid="${filteredProducts[i].id}"></span></a>
              <a data-toggle2="tooltip" data-placement="top" title="Quick View" data-prid="${filteredProducts[i].id}" data-toggle="modal" data-target="#quick-view-modal" onclick="getClickedModal(this)"><span class="fa fa-search pr-btns"></span></a>                          
            </div>
            <!-- product badge -->
          ${productsAndTheirSections(filteredProducts[i],sections)}
          </li>` 
    }
    let emptySpans = document.querySelectorAll('.aa-badge');
    for(let i = 0; i < emptySpans.length; i++){
        if(emptySpans[i].innerHTML == ''){
            emptySpans[i].style.display = 'none';
        }
    }
};
function printBlogs(blogs){
let sortedBlogs = blogs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
if(url == '/index.html' || url == '/dailywebshop/index.html'){
let latestBlogsWrapper = document.querySelector(`.aa-latest-blog-area .row`);
let comments = getFromLocalStorage('comments');
latestBlogsWrapper.innerHTML = '';
for(let i = 0; i < 3; i++){
  latestBlogsWrapper.innerHTML += `
                <div class="col-md-4 col-sm-4">
                  <div class="aa-latest-blog-single">
                    <figure class="aa-blog-img">                    
                      <a><img src="${sortedBlogs[i].image}" alt="${sortedBlogs[i].title}"></a>  
                        <figcaption class="aa-blog-img-caption">
                        <span><i class="fa fa-eye"></i>${socialNumbers(sortedBlogs[i].viewsCount)}</span>
                        <a><i class="fa fa-thumbs-o-up"></i>${socialNumbers(sortedBlogs[i].likesCount)}</a>
                        <a><i class="fa fa-comment-o"></i>${numberOfComments(comments,sortedBlogs[i])}</a>
                        <span><i class="fa fa-clock-o"></i>${dateOfBlogs(sortedBlogs[i].createdAt)}</span>
                      </figcaption>                          
                    </figure>
                    <div class="aa-blog-info">
                      <h3 class="aa-blog-title"><a>${sortedBlogs[i].title}</a></h3>
                      <p>${sortedBlogs[i].contentForShortBlog}</p> 
                      <a href="blog-single.html" class="aa-read-mor-btn" data-blogid="${sortedBlogs[i].id}" onclick="singlePageBlog(this)">Read more <span class="fa fa-long-arrow-right"></span></a>
                    </div>
                  </div>
                </div>
            `;
}
}
if(url == '/blog-archive-2.html' || url == '/dailywebshop/blog-archive-2.html'){
  let BlogsWrapper = document.querySelector('.aa-blog-content .row');
  let comments = getFromLocalStorage('comments');
  BlogsWrapper.innerHTML = '';
  for(let i = 0; i < sortedBlogs.length; i++){
    BlogsWrapper.innerHTML += `
                    <div class="col-md-4 col-sm-4">
                      <div class="aa-latest-blog-single">
                        <figure class="aa-blog-img">                    
                          <a href="#"><img src="${sortedBlogs[i].image}" alt="${sortedBlogs[i].title}"></a>  
                            <figcaption class="aa-blog-img-caption">
                            <span href="#"><i class="fa fa-eye"></i>${socialNumbers(sortedBlogs[i].viewsCount)}</span>
                            <a href="#"><i class="fa fa-thumbs-o-up"></i>${socialNumbers(sortedBlogs[i].likesCount)}</a>
                            <a href="#"><i class="fa fa-comment-o"></i>${numberOfComments(comments,sortedBlogs[i])}</a>
                            <span href="#"><i class="fa fa-clock-o"></i>${dateOfBlogs(sortedBlogs[i].createdAt)}</span>
                          </figcaption>                          
                        </figure>
                        <div class="aa-blog-info">
                          <h3 class="aa-blog-title"><a href="#">${sortedBlogs[i].title}</a></h3>
                          <p>${sortedBlogs[i].contentForShortBlog}</p> 
                          <a href="blog-single.html" class="aa-read-mor-btn" data-blogid="${sortedBlogs[i].id}" onclick="singlePageBlog(this)">Read more <span class="fa fa-long-arrow-right"></span></a>
                        </div>
                      </div>
                    </div>
                `;
    }
};
};
function UsersAndTheirBlogs(users,blog){
  let returnValue = '';
  for(let i = 0; i < users.length; i++){
    if(users[i].id == blog.authorId){
      returnValue = users[i].name;
    }
  }
  return returnValue;
};
function commentsOnBlogs(users,comments,blog){
  let commArray = [];
  let returnValue = '';
  comments.forEach(comment => {
    if(comment.blogId == blog.id){
      commArray.push(comment);
    }
  });
  commArrayOut = commArray;
  for(let i=0;i<commArray.length;i++){
    for(let j=0;j<users.length;j++){
      if(commArray[i].authorId == users[j].id){
        commArray[i].avatar = users[j].avatar;
        commArray[i].user = users[j].name;
      }
    }
  }
  for(let i = 0; i<commArray.length; i++){
      returnValue += `
      <li>
              <div class="media">
                <div class="media-left">    
                    <img class="media-object news-img" src="${commArray[i].avatar}" alt="${commArray[i].user}">      
                </div>
                <div class="media-body">
                 <h4 class="author-name">${commArray[i].user}</h4>
                 <span class="comments-date"> ${dateOfBlogs(commArray[i].createdAt)}</span>
                 <p>${commArray[i].content}</p>
                </div>
            </li>`
     }
      return returnValue;
};
function socialNumbers(number){
    let numberToString = number.toString();
    let returnValue;
    switch(numberToString.length){
    case 1:
    case 2:
    case 3:
    returnValue = numberToString;
    break;
    case 4:
    var parK = numberToString.substring(0,1);
    returnValue = parK + 'K';
    break;
    case 5:
    var parK = numberToString.substring(0,2);
    returnValue = parK + 'K';
    break;
    case 6:
    var parK = numberToString.substring(0,3);
    returnValue = parK + 'K';
    break;
    case 7:
    var parM = numberToString.substring(0,1);
    returnValue = parM + 'M';
    break;
    case 8:
    var parM = numberToString.substring(0,2);
    returnValue = parM + 'M';
    break;
    }

    return returnValue;
};
function dateOfBlogs(blogDate){
  const date = new Date(blogDate); 
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return month + ' ' + day + ', ' + year;
};
function getClickedModal(button){
  let prId = parseInt(button.getAttribute('data-prid'));
  addToLocalStorage('modalProduct', {"id": prId});
  productModalView();
};
function productPrice(product){
  let returnValue = '';
  if(product.price.oldPrice == null){
    returnValue = `<span class="aa-product-view-price">$${product.price.activePrice}</span>`;
  }
  else{
    returnValue = `<span class="aa-product-view-price">$${product.price.activePrice} </span><span class="aa-product-view-price"><del>$${product.price.oldPrice}</del></span>`;
  }
  return returnValue;
};
function productInStock(product){
  let returnValue = '';
  if(product.productsSectionId == 2){
    returnValue = `<span class="outOfStock">Out of stock</span>`;
  }
  else{
    returnValue = `<span class="inStock">In stock</span>`;
  }
  return returnValue;
};
function disableCartButton(product, type){
  let returnValue = '';
  if(product.productsSectionId == 2){
    returnValue = ``;
  }
  else{
    if(type == 'hover')
    {
    returnValue = `<a class="aa-add-card-btn cart-btn" data-prid="${product.id}"><span class="fa fa-shopping-cart"></span>Add To Cart</a>`;
    }
    if(type == 'click'){
    returnValue = `<a class="aa-add-to-cart-btn cart-btn" data-prid="${product.id}"><span class="fa fa-shopping-cart"></span>Add To Cart</a>`;
    }
  }
  return returnValue;
};
function productsAndTheirSizes(product){
  let returnValue = '';
  product.availableSizes.forEach(size => {
    returnValue += `<a>${size}</a>`;
  });
  return returnValue;
};
function productsAndTheirColors(product){
  let returnValue = '';
  let colors = getFromLocalStorage('colors');
  colors.forEach(color => {
  if(color.id == product.colorId){
    returnValue += `
    <a class="aa-color-${color.name}"></a>
    `;
  }
 });
  return returnValue;
};
function productsAndTheirCategories(product,categories){
    let returnValue = '';
    categories.forEach(category => {
      if(category.id == product.categoryId){
        returnValue += `${category.name}`;
      }
    });
      return returnValue;
  
};
function productModalView(){
  let productQuickView = document.querySelector('.modal-body .row');
  let modalProductFromLocalStorage = getFromLocalStorage('modalProduct');
  let categories = getFromLocalStorage('categories');
  ajaxCallBack('products.json', function(products){
    products.forEach(product => {
        if(product.id == modalProductFromLocalStorage.id){
          productQuickView.innerHTML = `
          <div class="col-md-6 col-sm-6 col-xs-12">                              
          <div class="aa-product-view-slider">                                
            <div class="simpleLens-gallery-container" id="demo-1">
              <div class="simpleLens-container">
                  <div class="simpleLens-big-image-container">
                      <a class="simpleLens-lens-image" data-lens-image="${product.image}">
                          <img src="${product.image}" class="simpleLens-big-image">
                      </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal view content -->
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="aa-product-view-content">
            <h3>${product.name}</h3>
            <div class="aa-price-block">
            ${productDiscount(product)}
              <p class="aa-product-avilability">Avilability: ${productInStock(product)}</p>
            </div>
            <h4>Available sizes:</h4>
            <div class="aa-prod-view-size">
            ${productsAndTheirSizes(product)}
            </div>
            <div class="aa-prod-quantity">
              <p class="aa-prod-category">
                Category: <a>${productsAndTheirCategories(product,categories)}</a>
              </p>
            </div>
            <div class="aa-prod-view-bottom">
              <a href="product-detail.html" class="aa-add-to-cart-btn" data-prid="${product.id}" onclick="storeSingleProductToLS(this)">View Details</a>
            </div>
          </div>
        </div>
          `;
        }
  });
});
};
function singlePageBlog(button){
  let blogId = parseInt(button.getAttribute('data-blogid'));
  addToLocalStorage('clickedBlog', {"id": blogId});
};
function numberOfComments(comments,blog){
  let commArray = [];
  comments.forEach(comment => {
    if(comment.blogId == blog.id){
      commArray.push(comment);
    }
  });
  return commArray.length;
};
function printProducts(products){
  let productsContainer = document.querySelector('.aa-product-catg');
  let sections = getFromLocalStorage('sectionsProducts');
  productsContainer.innerHTML = '';
  products.forEach(product => {
    productsContainer.innerHTML += `
    <li>
    <figure>
      <a class="aa-product-img" href="product-detail.html" data-prid="${product.id}" onclick="storeSingleProductToLS(this)"><img src="${product.image}" alt="${product.name}"></a>
      ${disableCartButton(product,'hover')}
      <figcaption>
        <h4 class="aa-product-title"><a>${product.name}</a></h4>
        ${productDiscount(product)}
      </figcaption>
    </figure>                         
    <div class="aa-product-hvr-content">
      <a data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><span class="fa fa-heart-o wish-btn pr-btns" data-prid="${product.id}"></span></a>
      <a data-toggle2="tooltip" data-placement="top" title="Quick View" data-prid="${product.id}" data-toggle="modal" data-target="#quick-view-modal" onclick="getClickedModal(this)"><span class="fa fa-search pr-btns"></span></a>                            
    </div>
    <!-- product badge -->
    ${productsAndTheirSections(product,sections)}
  </li>`
});
};
function storeSingleProductToLS(button){
  let producId = parseInt(button.getAttribute('data-prid'));
  addToLocalStorage('clickedProduct', {"id": producId});
};
function printSidebar(){
  ajaxCallBack('brands.json', function(data){
    let brandsForm = document.querySelector('#brands-filter');
    brandsForm.innerHTML = '';
    for(let i = 0; i < data.length; i++){
      brandsForm.innerHTML += `<div class="input-brand">
      <input type="checkbox" value="${data[i].id}" name="${data[i].name}"/> ${data[i].name}
      </div>`;
    }
  });
  ajaxCallBack('colors.json', function(data){
    let colorsDiv = document.querySelector('.aa-color-tag');
    colorsDiv.innerHTML = '';
    for(let i = 0; i < data.length; i++){
      colorsDiv.innerHTML += `
      <div class="single-color">
      <a class="aa-color-${data[i].name}" id="color${data[i].id}" data-color="${data[i].id}"></a>
      </div>
      `;
    }
  });
  ajaxCallBack('genders.json', function(data){
    let genderDiv = document.querySelector('#gender-filter');
    genderDiv.innerHTML = '';
    for(let i = 0; i < data.length; i++){
      genderDiv.innerHTML += `
      <div class="input-gender">
      <input type="radio" value="${data[i].id}" name="gender"/> ${data[i].name}
      </div>
      `;
    }
  });
  let categories = getFromLocalStorage('categories');
  let sections = getFromLocalStorage('sectionsProducts');
  let catSideBar = document.querySelector('#category-filter');
  catSideBar.innerHTML = '';
  let sectionSideBar = document.querySelector('#section-filter');
  categories.forEach(category => {
    catSideBar.innerHTML += `
    <div class="input-category">
    <input type="checkbox" value="${category.id}" name="${category.name}"/> ${category.name}
    </div>`;
  });
  sections.forEach(section => {
    sectionSideBar.innerHTML += `<div class="input-section">
    <input type="checkbox" value="${section.id}" name="${section.name}"/> ${section.name}
    </div>`;
  });
};
function freeShipping(product){
  if(product.freeShipping){
    return `<span class="aa-badge aa-sale freeShipping">FREE SHIPPING</span>`;
  }
  else{
    return `<span class="shippFee">Shipping fee: $${product.shippingFee}</span>`;
  }
};
function addingProducts(btnClass, type){
  let elements = document.querySelectorAll(btnClass);
  let addedParagraph = document.querySelector('#addedText');
  let alreadyParagraph = document.querySelector('#alreadyText');
  for(let i = 0; i < elements.length; i++){
    elements[i].addEventListener('click', function(){
      let popupAdded = document.querySelector('#popupbgAdded');
      let popupAlready = document.querySelector('#popupbgAlready');
      let typeOfAdd = getFromLocalStorage(type);
      let productId = this.getAttribute('data-prid');
      let count = 0;
    if(getFromLocalStorage(type) !== null){
       for(let i = 0; i < typeOfAdd.length; i++){
      if(typeOfAdd[i].id == productId){
        count++;
      }
    }
    }
    if(count == 0){
      if(type == 'cart'){
        typeOfAdd.push({"id": parseInt(productId), "quantity": 1});
        document.querySelector('#popupbgAdded #popup img').src = "img/bag.png";
      }
      if(type == 'wishlist'){
        typeOfAdd.push({"id": parseInt(productId)});
        document.querySelector('#popupbgAdded #popup img').src = "img/heart.png";
      }
      addToLocalStorage(type, typeOfAdd);
      addedParagraph.innerHTML = `Product added to ${type}!`;
      if(type == 'cart'){
        let numberInCart = document.querySelector('.aa-cart-notify');
        numberInCart.innerHTML = getFromLocalStorage('cart').length;
      }
      popupAdded.style.display = 'block';
      setTimeout(function(){
        popupAdded.style.display = 'none';
      }, 1000);
    }
    else if(count > 0){
      alreadyParagraph.innerHTML = `Product already in ${type}!`;
      popupAlready.style.display = 'block';
      setTimeout(function(){
        popupAlready.style.display = 'none';
      }, 1000);
    }
  })
}
};
function mailCheck(){
  let mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let newsButton = document.querySelector('.aa-subscribe-form input[type="button"]');
  let email = document.querySelector('.aa-subscribe-form input[type="email"]');
  let message = document.querySelector('#message');
  email.addEventListener('blur', function(){
    if(!mailRegex.test(email.value)){
      message.textContent = 'Please enter a valid email address. Example: jhondoe@gmail.com';
    }
    else{
      message.textContent = '';
    }
  });
  newsButton.addEventListener('click', function(e){
    e.preventDefault();
    if(!mailRegex.test(email.value)){
      message.textContent = 'Please enter a valid email address. Example: jhondoe@gmail.com';
    }
    else{
      message.className = '';
      message.textContent = 'Thanks for subscribing to our newsletter!';
      email.value = '';
    }
  });
};
function deleteProduct(type)
{
  let deleteProductBtn = document.querySelectorAll('.aa-remove-product');
  for(let i = 0; i < deleteProductBtn.length; i++){
    deleteProductBtn[i].addEventListener('click', function(e){
      e.preventDefault();
      let table = document.querySelector('#cart-view .container');   
      // let productId = this.parentElement.parentElement.children[2].children[0].innerHTML;
      let productId = this.getAttribute('data-prid');
      let idNumber = parseInt(productId);
      let item = getFromLocalStorage(type);
      const newItem = item.filter((product) => product.id !== idNumber);
      let index = item.indexOf(productId);
      item.splice(index, 1);
      addToLocalStorage(type, newItem);
      this.parentElement.parentElement.remove();
      if(type == 'cart'){
        let numberInCart = document.querySelector('.aa-cart-notify');
        numberInCart.innerHTML = getFromLocalStorage('cart').length;
        let totalPriceFromDeleted = this.parentElement.parentElement.children[5].innerHTML.slice(1);
        let NumberPrice = Number(totalPriceFromDeleted);
        let totalPrice = document.querySelector('#TotalCartPrice');
        totalPrice.innerHTML = `$${Number(totalPrice.innerHTML.slice(1)) - NumberPrice}`;
      }
      if(getFromLocalStorage(type) == null || getFromLocalStorage(type).length == 0){
        localStorage.removeItem(type);
        if(type == 'cart'){
        table.innerHTML = `<h1 class="text-center empty-cart">Your cart is empty.</h1>
                            <br/>
                            <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
        }
        if(type == 'wishlist'){
          table.innerHTML = `<h1 class="text-center empty-cart">Your wishlist is empty.</h1>
                            <br/>
                            <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
        }
      }
  }
  )}
};
function productTotalPrice(quantity,price){
  let total = quantity * price;
  return total;
};
function totalPrice(){
  let totalPrice = document.querySelector('#TotalCartPrice');
  let totalProductPrice = document.querySelectorAll('#totalProductPrice');
  let sum=0;
  totalProductPrice.forEach(function(item){
    sum += parseInt(item.innerHTML.slice(1));
  });
  totalPrice.innerHTML = `$${sum}`;
};
function getProductQuantity(){
  let pluses = document.querySelectorAll('.plus');
  let minuses = document.querySelectorAll('.minus');
  pluses.forEach(plus => plus.addEventListener('click', function(){
    let quanNumber = parseInt(this.parentElement.children[1].innerHTML);
    this.parentElement.children[1].innerHTML = quanNumber + 1;
    let productId = this.parentElement.children[1].getAttribute('data-prid');
    console.log(productId);
    let cart = getFromLocalStorage('cart');
    let price = this.parentElement.previousElementSibling.innerHTML.slice(1);
    this.parentElement.nextElementSibling.innerHTML = `$${productTotalPrice(quanNumber + 1, price)}`;
    for(let i = 0; i < cart.length; i++){
            if(cart[i].id == productId){
             cart[i].quantity = parseInt(this.parentElement.children[1].innerHTML);
            }
          }
    addToLocalStorage('cart', cart);
    totalPrice();
  }));
  minuses.forEach(minus => minus.addEventListener('click', function(){
    let quanNumber = parseInt(this.parentElement.children[1].innerHTML);
    if(quanNumber > 1){
      this.parentElement.children[1].innerHTML = quanNumber - 1;
      let productId = this.parentElement.children[1].getAttribute('data-prid');
      let cart = getFromLocalStorage('cart');
      let price = this.parentElement.previousElementSibling.innerHTML.slice(1);
      this.parentElement.nextElementSibling.innerHTML = `$${productTotalPrice(quanNumber - 1, price)}`;
      for(let i = 0; i < cart.length; i++){
        if(cart[i].id == productId){
         cart[i].quantity = parseInt(this.parentElement.children[1].innerHTML);
        }
      }
      addToLocalStorage('cart', cart);
      totalPrice();
    }
   
  }));
};
function changeProducts(){
  let products = getFromLocalStorage('allProducts');
  
  products = filterProducts(products, 'gender', 'genderId');
  products = filterProducts(products, 'category', 'categoryId');
  products = filterProducts(products, 'brand', 'brandId');
  products = filterProducts(products, 'section', 'productsSectionId');
  products = filterProducts(products, 'price', 'price.activePrice');
  products = filterProducts(products, 'color', 'colorId');
  products = sortProducts(products);
  products = searchProducts(products);
  
  if(products.length == 0){
    document.querySelector('#aler-pr').innerHTML = `Sorry! We currently do not have any products that match Your criterium!`;
  }
  else{
    document.querySelector('#aler-pr').innerHTML = '';
  }
  printProducts(products);

  addingProducts('.wish-btn','wishlist');
  addingProducts('.cart-btn','cart');
};
function changeBlogs(){
  ajaxCallBack("blogs.json", function(blogs){
  blogs = filterBlogs(blogs, 'category', 'genderId');
  blogs = filterBlogs(blogs, 'tag', 'tags');
  if(blogs.length == 0){
    document.querySelector('#aler-pr').innerHTML = `Sorry! We currently do not have any products that match Your criterium!`;
  }
  else{
    document.querySelector('#aler-pr').innerHTML = '';
  }

  printBlogs(blogs);
});
  
};
function filterProducts(products, type, filter){
  let filteredProducts;
  let brandArr = [];
  let secArr = [];
  let catArr = [];
  let colorArr = [];
  let genders = document.querySelectorAll('.input-gender input')
  let brands = document.querySelectorAll('.input-brand input');
  let sections = document.querySelectorAll('.input-section input');
  let colors = document.querySelectorAll('.aa-color-tag a');
  let categories = document.querySelectorAll('.input-category input');
 
    if(type == 'gender'){
      let value = [];
      genders.forEach(gender => {
        if(gender.checked == true){
          value.push(gender.value);
        }
      });
      if(value.length == 0){
        filteredProducts = products;
      }
      else{
        filteredProducts = products.filter(product => value.some(value => product[filter] == value));
      }
     
    }
    if(type == 'category'){
      categories.forEach(category => {
        if(category.checked == true){
          catArr.push(category.value);
        }
      });
      if(catArr.length == 0){
        filteredProducts = products;
      }
      else{
        filteredProducts = products.filter(product => catArr.some(catArr => product[filter] == catArr));
      }
    
    }
    if(type == 'brand'){
      brands.forEach(brand => {
        if(brand.checked == true){
          brandArr.push(brand.value);
        }
      });
      if(brandArr.length == 0){
        filteredProducts = products;
      }
      else{
        filteredProducts = products.filter(product => brandArr.some(brandArr => product[filter] == brandArr));
      }
      
    }
    if(type == 'section'){
      sections.forEach(section => {
        if(section.checked == true){
          secArr.push(section.value);
        }
      });
      if(secArr.length == 0){
        filteredProducts = products;
      }
      else{
        filteredProducts = products.filter(product => secArr.some(secArr => product[filter] == secArr));
      }
    }
    if(type == 'price'){
      let priceFilerUpper = document.querySelector('#skip-value-upper');
      let priceFilerLower = document.querySelector('#skip-value-lower');
      let lowerValue = parseInt(priceFilerLower.textContent);
      let upperValue = parseInt(priceFilerUpper.textContent);
      if(lowerValue == 0 && upperValue == 200){
        filteredProducts = products;
      }
      else{
        filteredProducts = products.filter(product => product.price.activePrice >= lowerValue);
        filteredProducts = filteredProducts.filter(product => product.price.activePrice <= upperValue);
        }
     
      }
      if(type == 'color'){
        colors.forEach(color => {
          if(color.parentElement.classList.contains('active')){
            colorArr.push(color.id.slice(5));
            filteredProducts = products.filter(product => colorArr.some(colorArr => product[filter] == colorArr));
          }
        });
        if(colorArr.length == 0){
          filteredProducts = products;
        }
       }
      
    return filteredProducts;
};
function filterBlogs(blogs, type, filter){
  let filteredBlogs;
  let values = [];
  if(type == 'category'){
    let value;
    let activeCategory = document.querySelector('.aa-catg-nav li .active');
    if(activeCategory){
      value = activeCategory.getAttribute('data-genid');
      filteredBlogs = blogs.filter(blog => blog[filter] == value);
    }
    else{
      filteredBlogs = blogs;
    }
   
  }
  if(type == 'tag'){
    let tags = document.querySelectorAll('.tag-cloud a');
    tags.forEach(tag => {
      if(tag.classList.contains('active')){
        values.push(tag.innerHTML.toLowerCase());
      }
    });
    if(values.length == 0){
      filteredBlogs = blogs;
    }
    else{
      filteredBlogs = blogs.filter(blog => blog[filter].some(tag => values.includes(tag)));
    }
  }
  return filteredBlogs;
};
function sortProducts(products){
  let sortValue = document.querySelector('#sortProducts').value;
  if(sortValue == 'default'){
    return products;
  }
  if(sortValue == 'name-asc'){
    products.sort(function(a, b){
      return a.name.localeCompare(b.name);
    });
  }
  if(sortValue == 'name-desc'){
    products.sort(function(a, b){
      return b.name.localeCompare(a.name);
    });
  }
  if(sortValue == 'price-asc'){
    products.sort(function(a, b){
      return a.price.activePrice - b.price.activePrice;
    });
  }
  if(sortValue == 'price-desc'){
    products.sort(function(a, b){
      return b.price.activePrice - a.price.activePrice;
    });
  }
  if(sortValue == 'discount-desc'){
    products = products.filter(product => product.discount == true);
    products.sort(function(a, b){
      return b.discountPercent - a.discountPercent;
    });
  }
  return products;
};
function searchProducts(products){
  let searchValue = document.querySelector('#searchProducts').value;
  let filteredProducts = [];
  if(searchValue == ''){
    return products;
  }
  else{
    return products.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));
  }
};
var countErrors = 0;
function validateInput(input,regex,type){
  if(type == 'country'){
    if(input.value == '0'){
      input.className = 'is-invalid';
      $(input).next().html('Please select country.');
      countErrors++;
    }
    else{
      input.className = 'is-valid';
      $(input).next().html('');
    }
  }
  else{  
  if(input.value == ''){
    if(type == 'companyname'){
      $(input).next().html('');
      input.className = '';
    }
    else{
    input.className = 'is-invalid';
    $(input).next().html('This field is required and can not be empty.');
    countErrors++;
    }
  }
  else if(!regex.test(input.value)){
    input.className = 'is-invalid';
    switch(type){
      case 'firstname':
        $(input).next().html('Inccorect first name format. First letter must be capital and name must contain only letters. Example: John');
        countErrors++;
        break;
      case 'lastname':
        $(input).next().html('Inccorect first name format. First letter must be capital and name must contain only letters. Example: Doe');
        countErrors++;
        break;
      case 'companyname':
        $(input).next().html('Inccorect company name format. First letter must be capital or number. Example: Company1');
        countErrors++;
        break;
      case 'email':
        $(input).next().html('Inccorect email format. Example: jhondoe@gmail.com');
        countErrors++;
        break;
      case 'phone':
        $(input).next().html('Inccorect phone format. Example: +381601234567 or 0601234567');
        countErrors++;
        break;
      case 'address':
        $(input).next().html('Inccorect address format. Example: Street 1');
        countErrors++;
        break;
      case 'city':
        $(input).next().html('Inccorect city format. First letter must be capital and name must contain only letters. Example: Belgrade');
        countErrors++;
        break;
      case 'zip':
        $(input).next().html('Inccorect zip format. Example: 11000');
        countErrors++;
        break;
    }
  }
  else{
    input.className = 'is-valid';
    $(input).next().html('');
    countErrors = 0;
  }
}
  return countErrors;
};
function validation(){
  const firstName = document.querySelector('input[name="first_name"]');
  const lastName = document.querySelector('input[name="last_name"]');
  const companyName = document.querySelector('input[name="company_name"]');
  const email = document.querySelector('input[name="email"]');
  const phone = document.querySelector('input[name="phone"]');
  const address = document.querySelector('input[name="address"]');
  const city = document.querySelector('input[name="city"]');
  const country = document.querySelector('select[name="countries"]');
  const zip = document.querySelector('input[name="zip"]');
  const nameRegex = /^[A-ZČĆĐŽŠ][a-zčćđžš]{2,}(\s[A-ZČĆĐŽŠ][a-zčćđžš]{2,})*$/;
  const emailRegex = /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/;
  const phoneRegex = /^(\+381|0)[6-9][0-9]{7,8}$/;
  const addressRegex = /[A-Z0-9][a-zA-Z0-9\s]{5,}?/;
  const companyRegex = /^[A-Z]\w[\w.\-#&\s]{3,}$/;
  const cityRegex = /^[A-ZČĆĐŽŠ][a-zčćđžš]{2,}(\s[A-ZČĆĐŽŠ][a-zčćđžš]{2,})*$/;
  const zipRegex = /^[0-9]{5}$/;
  let cartTotalPrice = document.querySelector('.aa-order-summary-area .table tfoot tr td');
  firstName.addEventListener('blur',function(){
    validateInput(this,nameRegex,'firstname');
  });
  lastName.addEventListener('blur',function(){
    validateInput(this,nameRegex,'lastname');
  });
  companyName.addEventListener('blur',function(){
    validateInput(this,companyRegex,'companyname');
  });
  email.addEventListener('blur',function(){
    validateInput(this,emailRegex,'email');
  });
  phone.addEventListener('blur',function(){
    validateInput(this,phoneRegex,'phone');
  });
  address.addEventListener('blur',function(){
    validateInput(this,addressRegex,'address');
  });
  city.addEventListener('blur',function(){
    validateInput(this,cityRegex,'city');
  });
  zip.addEventListener('blur',function(){
    validateInput(this,zipRegex,'zip');
  });
  country.addEventListener('change',function(){
    validateInput(this,'','country');
  });
  document.querySelector('.aa-payment-method input[type="submit"]').addEventListener('click',function(e){
    e.preventDefault();
    let modal = document.querySelector('#billModal');
    let closeModal = document.querySelector('#closeBill');
    let countErrors = 0;
    if(country.value == '0'){
      country.className = 'is-invalid';
      $(country).next().html('Please select country.');
      countErrors++;
    }
    else{
      country.className = 'is-valid';
      $(country).next().html('');
      countErrors = 0;
    }
    countErrors += validateInput(phone,phoneRegex,'phone');
    countErrors += validateInput(firstName,nameRegex,'firstname');
    countErrors += validateInput(lastName,nameRegex,'lastname');
    countErrors += validateInput(email,emailRegex,'email');
    countErrors += validateInput(address,addressRegex,'address');
    countErrors += validateInput(city,cityRegex,'city');
    countErrors += validateInput(zip,zipRegex,'zip');
    console.log(countErrors);
    if(countErrors == 0){
      let information = [];
      document.querySelectorAll('.aa-checkout-single-bill input').forEach(function(input){
        information.push({"name":input.getAttribute('data-name'),"value":input.value});
      });
      let paymentMethod = document.querySelector('.aa-payment-method input[type="radio"]:checked').value;
      let billInfo = document.querySelector('.bill-info');
      let billFrom = document.querySelector('.bill-from');
      let today = new Date();
      let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      let randomNum = Math.floor(Math.random() * 1000000);
      billInfo.innerHTML = `
      <p>Bill Number: <span id="billNumber">#${randomNum}</span></p>
      <p>Bill Date: <span id="billDate">${date}</span></p>
      `;
      information.push({"name":"Payment Method","value":paymentMethod});
      document.querySelector('.bill-footer #totalPrice').innerHTML = `Total: ${cartTotalPrice.innerHTML}`;
      information.forEach(function(info){
        billFrom.innerHTML += `
        <p>${info.name}: <span class="form-info">${info.value}</span></p>
        `;
      });
     modal.style.display = 'block';
    document.querySelectorAll('.aa-checkout-single-bill input').forEach(function(input){
      input.value='';
      input.className = '';
    });
    document.querySelector('.aa-checkout-single-bill select').value = '0';
    document.querySelector('.aa-checkout-single-bill select').className = '';
    document.querySelector('.aa-order-summary-area .table tbody').innerHTML = '';
    document.querySelector('.aa-order-summary-area .table tfoot tr td').innerHTML = '';
    localStorage.removeItem('cart');
    localStorage.removeItem('cartForCheckout');
    let cartNum = document.querySelector('.aa-cart-notify');
    cartNum.innerHTML = '0';
      closeModal.addEventListener('click',function(){
        modal.style.display = 'none';
        location.href = 'index.html';
      });
    };
  });
};
function printBlogTags(blogTags){
  let returnValue = '';
  for(let i = 0; i < blogTags.length; i++){
    if(i == blogTags.length - 1){
      returnValue += ` ${blogTags[i]} `;
    }
    else{
    returnValue += ` ${blogTags[i]} ,`;
    }
  }
  return returnValue;
};
function getFromLocalStorage(key){
  return JSON.parse(localStorage.getItem(key));
};
function addToLocalStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value));
};
function removeFromLocalStorage(value){
  localStorage.removeItem(value);
};
if(url.includes('/index.html')){  
  ajaxCallBack('products.json', function(data){
    indexProducts(data,'male','#men .aa-product-catg');
    indexProducts(data, 'female', '#women .aa-product-catg');
    indexProducts(data, 'sport', '#sports .aa-product-catg');
});
  window.onload = function(){
    addingProducts('.wish-btn','wishlist');
    addingProducts('.cart-btn','cart');
    removeFromLocalStorage('cartForCheckout');
    mailCheck();
    ajaxCallBack('blogs.json', function(blogs){
    printBlogs(blogs);
    });
  }
};
if(url.includes('/blog-archive-2.html')){
  ajaxCallBack('blogs.json', function(blogs){
  printBlogs(blogs);
    let categories = document.querySelectorAll('.aa-catg-nav li a');
    let tags = document.querySelectorAll('.tag-cloud a');
    categories.forEach(category => {
      category.addEventListener('click', function(e){
        e.preventDefault();
        categories.forEach(category => {
          category.classList.remove('active');
        });
        category.classList.add('active');
        changeBlogs();
      });
    });
    tags.forEach(tag => {
      tag.addEventListener('click', function(e){
        e.preventDefault();
        tag.classList.toggle('active');
        changeBlogs();
      });
    });
  });
  window.onload = function(){
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('clickedProduct');
    removeFromLocalStorage('cartForCheckout');
  };
};
if(url.includes('/blog-single.html')){
  window.onload = function(){
    // localStorage.removeItem('modalProduct');
    // localStorage.removeItem('colors');
    // localStorage.removeItem('sectionsProducts');
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('clickedProduct');
    removeFromLocalStorage('cartForCheckout');
    ajaxCallBack('blogs.json', function(blogs){
      let clickedBlog = getFromLocalStorage('clickedBlog');
      let usersFromLocalStorage = getFromLocalStorage('users');    
      let blogContent = document.querySelector('.aa-blog-content');
      let getComments = getFromLocalStorage('comments');
      blogContent.innerHTML = '';
      blogs.forEach(blog => {
        if(blog.id == clickedBlog.id){
          blogContent.innerHTML = `
          <article class="aa-blog-content-single">                        
          <h2>${blog.title}</h2>
           <div class="aa-article-bottom">
            <div class="aa-post-author">
              Posted By <a>${UsersAndTheirBlogs(usersFromLocalStorage,blog)}</a>
            </div>
            <div class="aa-post-date">
              ${dateOfBlogs(blog.createdAt)}
            </div>
          </div>
          <figure class="aa-blog-img">
            <a><img src="${blog.image}" alt="fashion img"></a>
          </figure>
          <span>${blog.content}</span>
          <div>
        
          </div>
          <div class="blog-single-bottom">
            <div class="row all-tags">
              <div class="col-md-8 col-sm-6 col-xs-12">
                <div class="blog-single-tag">
                  <span>Tags: ${printBlogTags(blog.tags)}</span>
              <!-- </div>
        
              </div> -->
              <div class="col-12">
                <div class="blog-single-social">
                  <a href="https://sr-rs.facebook.com/"><i class="fa fa-facebook"></i></a>
                  <a href="https://twitter.com/"><i class="fa fa-twitter"></i></a>
                  <a href="https://www.linkedin.com/"><i class="fa fa-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
         
        </article>
        
        <div class="aa-blog-comment-threat">
        <h3>Comments (${numberOfComments(getComments,blog)})</h3>
        <div class="comments">
          <ul class="commentlist">
          ${commentsOnBlogs(usersFromLocalStorage,getComments,blog)}
          </ul>
        </div>
        `;
        }
      });
     
      
    });
  };
};
if(url.includes('/products.html')){
ajaxCallBack('products.json', function(data){
  addToLocalStorage('allProducts', data);
  printProducts(data);
  printSidebar(data);
});
let priceFilerUpper = document.querySelector('#skip-value-upper');
let priceFilerLower = document.querySelector('#skip-value-lower');
priceFilerLower.addEventListener('DOMSubtreeModified', function(){
  changeProducts();
});
priceFilerUpper.addEventListener('DOMSubtreeModified', function(){
  changeProducts();
});
let sortProducts = document.querySelector('#sortProducts');
sortProducts.addEventListener('change', function(){
  changeProducts();
});
let search = document.querySelector('#searchProducts');
search.addEventListener('keyup', function(){
  changeProducts();
});
window.onload= function(){
  addingProducts('.wish-btn','wishlist');
  addingProducts('.cart-btn','cart');
  removeFromLocalStorage('clickedBlog');
  removeFromLocalStorage('cartForCheckout');
  let genders = document.querySelectorAll('.input-gender input')
  let categories = document.querySelectorAll('.input-category input');
  let brands = document.querySelectorAll('.input-brand input');
  let sections = document.querySelectorAll('.input-section input');
  let colors = document.querySelectorAll('.aa-color-tag a');
  let filters = document.querySelectorAll('.aa-sidebar-widget form');
  let filtersColor = document.querySelector('.aa-sidebar-widget .aa-color-tag');
  let filterNames = document.querySelectorAll('.aa-sidebar-widget h3');
  filterNames.forEach(filterName => {
    filterName.addEventListener('click', function(){
      if(filterName.innerHTML == 'Shop By Price'){
        let priceSlider = filterName.parentElement.children[1].children[0];
        if(priceSlider.style.display == 'none'){    
          $(priceSlider).css('display','block');
        }
        else{
          $(priceSlider).css('display','none');
        }
      }
      else{
      if(filterName.nextElementSibling.style.display == 'none'){
        $(filterName).next().slideDown();
      }
      else{
        $(filterName).next().slideUp();
      }
    }
    });
  });
  $(filters).css('display','none');
  $(filtersColor).css('display','none');
  categories.forEach(category => {
    category.addEventListener('click', function(){
      changeProducts();
    });
  });
  genders.forEach(gender => {
    gender.addEventListener('click', function(){
      changeProducts();
    });
  });
  colors.forEach(color => {
    color.addEventListener('click', function(){
      this.parentElement.classList.toggle('active');
      changeProducts();
    });
  });
  brands.forEach(brand => {
    brand.addEventListener('click', function(){
      changeProducts();
    });
  });
  sections.forEach(section => {
    section.addEventListener('click', function(){
      changeProducts();
    });
  });
}
};
if(url.includes('/product-detail.html')){
 let productInfoWrapper = document.querySelector('.aa-product-details-content .row');
  let clickedProduct = getFromLocalStorage('clickedProduct');
  let categories = getFromLocalStorage('categories');
  let sections = getFromLocalStorage('sectionsProducts');
  productInfoWrapper.innerHTML = '';
  ajaxCallBack('products.json', function(products){
    products.forEach(product => {
      if(product.id == clickedProduct.id){
        productInfoWrapper.innerHTML = `
        <div class="col-md-5 col-sm-5 col-xs-12">                              
                        <div class="aa-product-view-slider">                                
                          <div id="demo-1" class="simpleLens-gallery-container">
                            <div class="simpleLens-container">
                              <div class="simpleLens-big-image-container"><a data-lens-image="${product.image}" class="simpleLens-lens-image"><img src="${product.image}" class="simpleLens-big-image"></a></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Modal view content -->
                      <div class="col-md-7 col-sm-7 col-xs-12">
                        <div class="aa-product-view-content">
                          <h3>${product.name}</h3>
                          <div class="aa-price-block">
                            ${productDiscount(product)}
                            <p class="aa-product-avilability">Avilability: ${productInStock(product)}</p>
                          </div>
                          <h4>Available sizes:</h4>
                          <div class="aa-prod-view-size">
                           ${productsAndTheirSizes(product)}
                          </div>
                          <h4>Color</h4>
                          <div class="aa-color-tag">
                          ${productsAndTheirColors(product)}                  
                          </div>
                          <div class="aa-prod-quantity">
                            <p class="aa-prod-category">
                              Category: <a>${productsAndTheirCategories(product,categories)}</a>
                            </p>
                          </div>
                          <br/>
                          ${freeShipping(product)}
                          <br/><br/>
                          <div class="aa-prod-view-bottom">
                          ${disableCartButton(product,'click')}
                            <a class="aa-add-to-cart-btn wish-btn pr-btns" data-prid="${product.id}">Add to Wishlist</a>
                          </div>
                        </div>
                      </div>
        `;
      }
    });
    let relatedProductsWrapper = document.querySelector('.aa-product-catg');
    let filteredProducts = [];
    products.forEach(product => {
      if(product.id == clickedProduct.id){
      filteredProducts = products.filter(relproduct => relproduct.id !== product.id && relproduct.categoryId == product.categoryId && relproduct.genderId == product.genderId);
      relatedProductsWrapper.innerHTML = '';
      for(let i = 0; i < filteredProducts.length; i++){
        relatedProductsWrapper.innerHTML += `
        <li>
        <figure>
          <a class="aa-product-img" href="product-detail.html" data-prid="${filteredProducts[i].id}" onclick="storeSingleProductToLS(this)"><img src="${filteredProducts[i].image}" alt="${filteredProducts[i].name}"></a>
          <a class="aa-add-card-btn cart-btn" data-prid="${filteredProducts[i].id}"><span class="fa fa-shopping-cart"></span>Add To Cart</a>
          <figcaption>
            <h4 class="aa-product-title"><a href="#">${filteredProducts[i].name}</a></h4>
            ${productDiscount(filteredProducts[i])}
          </figcaption>
        </figure>                         
        <div class="aa-product-hvr-content">
          <a data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><span class="fa fa-heart-o wish-btn pr-btns" data-prid="${filteredProducts[i].id}"></span></a>
          <a data-toggle2="tooltip" data-placement="top" title="Quick View" data-prid="${filteredProducts[i].id}" data-toggle="modal" data-target="#quick-view-modal" onclick="getClickedModal(this)"><span class="fa fa-search pr-btns"></span></a>                            
        </div>
        <!-- product badge -->
        ${productsAndTheirSections(filteredProducts[i],sections)}
      </li>`;
      }
    }
    });
  });
  window.onload= function(){
    addingProducts('.wish-btn','wishlist');
    addingProducts('.cart-btn','cart');
    removeFromLocalStorage('cartForCheckout');
    // localStorage.removeItem('users');
    // localStorage.removeItem('comments');
  } 
};
if(url.includes('/wishlist.html')){
  let wishlistWrapper = document.querySelector('.table tbody');
  let table = document.querySelector('#cart-view .container');
  let wishlist = getFromLocalStorage('wishlist');
  wishlistWrapper.innerHTML = '';
  if(getFromLocalStorage('wishlist') == null || getFromLocalStorage('wishlist').length == 0){
    table.innerHTML = `<h1 class="text-center empty-cart">Your wishlist is empty.</h1>
                       <br/>
                       <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
   }
  else{
  ajaxCallBack('products.json', function(data){
    for(let i = 0; i < wishlist.length; i++){
      for(let j = 0; j < data.length; j++){
        if(wishlist[i].id == data[j].id){
          wishlistWrapper.innerHTML += `
          <tr>
          <td><a class="aa-remove-product red-remove" data-prid="${data[j].id}" href="#" onclick="deleteProduct(this)"><span class="fa fa-times"></span></a></td>
          <td><a class="aa-cartbox-img"><img src="${data[j].image}" alt="img"></a></td>
          <td><a class="aa-cart-title">${data[j].name}</a></td>
          <td>${productPrice(data[j])}</td>
          <td>${productInStock(data[j])}</td>
          <td>${disableCartButton(data[j],'click')}</td>`;
        }
        }
}
}
  )
window.onload = function(){
  addingProducts('.cart-btn','cart');
  deleteProduct('wishlist');
  removeFromLocalStorage('clickedBlog');
  removeFromLocalStorage('clickedProduct');
  removeFromLocalStorage('modalProduct');
  removeFromLocalStorage('cartForCheckout');
  // localStorage.removeItem('users');
  // localStorage.removeItem('comments');
  // localStorage.removeItem('modalProduct');
  // localStorage.removeItem('colors');
  // localStorage.removeItem('sectionsProducts');
}
};
};
if(url.includes('/cart.html')){
  let cartWrapper = document.querySelector('.table tbody');
  let table = document.querySelector('#cart-view .container');
  let cart = getFromLocalStorage('cart');
  if(cart == null || cart.length == 0){
    table.innerHTML = `<h1 class="text-center empty-cart">Your cart is empty.</h1>
                        <br/>
                        <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
    }
  else{
    ajaxCallBack('products.json', function(data){
      for(let i = 0; i < cart.length; i++){
        for(let j = 0; j < data.length; j++){
          if(cart[i].id == data[j].id){
            cartWrapper.innerHTML += `
            <tr>
            <td><a class="aa-remove-product red-remove" href="#" data-prid="${data[j].id}" onclick="deleteProduct(this)"><span class="fa fa-times"></span></a></td>
            <td><a class="aa-cartbox-img"><img src="${data[j].image}" alt="${data[j].name}"></a></td>
            <td><a class="aa-cart-title" data-prid="${data[j].id}">${data[j].name}</a></td>
            <td>$${data[j].price.activePrice}</td>
            <td><span class="minus">-</span><span class="quantity" data-prid="${data[j].id}">${cart[i].quantity}</span><span class="plus">+</span></td>
            <td id="totalProductPrice" data-prid="${data[j].id}">$${productTotalPrice(cart[i].quantity,data[j].price.activePrice)}</td>`;
          }
        }   
      }
    })
  }
  window.onload = function(){
    if(cart){
      getProductQuantity();
      totalPrice();
      deleteProduct('cart');
      removeFromLocalStorage('clickedBlog');
      removeFromLocalStorage('clickedProduct');
      removeFromLocalStorage('modalProduct');
      removeFromLocalStorage('cartForCheckout');
    }
  $('.clear-cart').click(function(){
    localStorage.removeItem('cart');
    location.reload();
  });
  let cartTitles = document.querySelectorAll('.table .aa-cart-title');
  let checkoutBtn = document.querySelector('.checkout-cart');
  checkoutBtn.addEventListener('click', function(){
    let cartForCheckout = [];
    let cartTitle, cartQuantity, productTotalPrice, cartTotalPrice;
    cartTitles.forEach(function(title){
      cartTitle = title.innerHTML;
      let titlePrid = title.getAttribute('data-prid');
      console.log(titlePrid);
      cartQuantity = document.querySelector(`.quantity[data-prid="${titlePrid}"]`).innerHTML;
      productTotalPrice = document.querySelector(`#totalProductPrice[data-prid="${titlePrid}"]`).innerHTML;
      cartForCheckout.push({"productName": cartTitle,"productQuantity": cartQuantity,"productTotalPrice": productTotalPrice});
    });
    cartTotalPrice = document.querySelector('#TotalCartPrice').innerHTML;
    cartForCheckout.push({cartTotalPrice});
    addToLocalStorage('cartForCheckout',cartForCheckout);
  });
 
 };
};
if(url.includes('/checkout.html')){
  window.onload = function(){
    // localStorage.removeItem('users');
    // localStorage.removeItem('comments');
    // localStorage.removeItem('modalProduct');
    // localStorage.removeItem('colors');
    // localStorage.removeItem('sectionsProducts');
    validation();
    if(cart == null || cart.length == 0 || cartForCheckout == null || cartForCheckout.length == 0){
      location.href = 'index.html';
    }
    else{
      for(let i = 0; i < cartForCheckout.length - 1; i++){
        prWrapper.innerHTML += `<tr>
        <td>${cartForCheckout[i].productName} <strong> x ${cartForCheckout[i].productQuantity}<strong></td>
        <td>${cartForCheckout[i].productTotalPrice}</td>`;
      }
      cartTotalPrice.innerHTML = cartForCheckout[cartForCheckout.length - 1].cartTotalPrice;
    }
  };
  let cartForCheckout = getFromLocalStorage('cartForCheckout');
  let prWrapper = document.querySelector('.aa-order-summary-area .table tbody');
  let cart = getFromLocalStorage('cart');
  let cartTotalPrice = document.querySelector('.aa-order-summary-area .table tfoot tr td');

};
if(url.includes('/author.html')){
  window.onload = function(){
    removeFromLocalStorage('clickedBlog');
    removeFromLocalStorage('clickedProduct');
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('cartForCheckout');
  };
};