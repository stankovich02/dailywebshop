const BASEURL = "data/";
let url = window.location.pathname;
//Ajax function for getting data from json files
function getDataWithAjax(fileName, result){
  $.ajax({
      url: BASEURL + fileName,
      method: "get",
      dataType: "json", 
      success: result,
      error: function(xhr){
        let divError = document.createElement('div');
        divError.className = 'error';
        divError.innerHTML = formatErrorMessage(xhr, xhr.status);
      }
  })
};

function formatErrorMessage(jqXHR, exception) {
  if (jqXHR.status === 0) {
      return ('Not connected.\nPlease verify your network connection.');
  } else if (jqXHR.status == 400) {
      return ('Server understood the request, but request content was invalid.');
  } else if (jqXHR.status == 403) {
      return (`Forbidden resource can't be accessed.`);
  } else if (jqXHR.status == 404) {
      location.href = '404.html';
  } else if (jqXHR.status == 500) {
      return ('Internal Server Error [500].');
  } else if (jqXHR.status == 503) {
      return ('Service unavailable.');
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
getDataWithAjax('categories.json', function(data){
  addToLocalStorage('categories', data);
});
getDataWithAjax('menu.json', function(data){
  printMenu(data)
});
numberOfProductsInCart();
let navBar = document.querySelector('.navbar-nav');
let navBtn = document.querySelector('.navbar-toggle');
navBtn.addEventListener('click', function(){
  navBar.classList.add('active');
});
//Function for getting number of products in cart
function numberOfProductsInCart(){
  if(getFromLocalStorage('cart')){
    let numberInCart = document.querySelector('.aa-cart-notify');
    numberInCart.innerHTML = getFromLocalStorage('cart').length;
  }
  else{
    numberInCart = document.querySelector('.aa-cart-notify');
    numberInCart.innerHTML = '0';
  }
}
//Function for printing menu
function printMenu(menu){
    $('.navbar-nav').html('');
    $('.navbar-nav').html(menu.map(item => `
    <li><a href="${item.href}">${item.name}</a></li>
    `));
}
//Function which returns price of product if it is on discount or not
function productDiscount(product){
    let returnValue = '';
    if(product.price.oldPrice == null){
      returnValue = `<span class="aa-product-price">$${product.price.activePrice}</span>`;
    }
    else{
      returnValue = `<span class="aa-product-price">$${product.price.activePrice} </span> <span class="aa-product-price old-price"><del>$${product.price.oldPrice}</del></span> <span class="red-discount">(-${product.discountPercent}%)</span>`;
    }
    return returnValue;
}
//Function for printing products on index page
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
              <a class="aa-product-img openProduct" href="product-detail.html" data-prid="${filteredProducts[i].id}"><img src="${filteredProducts[i].image}" alt="${filteredProducts[i].name}"></a>
              ${disableCartButton(filteredProducts[i], 'hover')}
                <figcaption>
                <h4 class="aa-product-title"><a href="#">${filteredProducts[i].name}</a></h4>
                ${productDiscount(filteredProducts[i])}
              </figcaption>
            </figure>                        
            <div class="aa-product-hvr-content">
              <a data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><span class="fa fa-heart-o wish-btn pr-btns" data-prid="${filteredProducts[i].id}"></span></a>
              <a class="openModal" data-toggle2="tooltip" data-placement="top" title="Quick View" data-prid="${filteredProducts[i].id}" data-toggle="modal" data-target="#quick-view-modal"><span class="fa fa-search pr-btns"></span></a>                          
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
}
//Function for printing blogs
function printBlogs(blogs){
let sortedBlogs = blogs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
if(url == '/index.html' || url == '/dailywebshop/index.html'){
let latestBlogsWrapper = document.querySelector(`.aa-latest-blog-area .row`);
let comments = getFromLocalStorage('comments');
latestBlogsWrapper.innerHTML = '';
if(window.innerWidth > 768){
  for(let i = 0; i < 3; i++){
    latestBlogsWrapper.innerHTML += `
                  <div class="col-md-4 col-sm-4">
                    <div class="aa-latest-blog-single">
                      <figure class="aa-blog-img">                    
                        <a><img src="${sortedBlogs[i].images.small}" alt="${sortedBlogs[i].title}"></a>  
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
                        <a href="blog-single.html" class="aa-read-mor-btn" data-blogid="${sortedBlogs[i].id}">Read more <span class="fa fa-long-arrow-right"></span></a>
                      </div>
                    </div>
                  </div>
              `;
  }
  }
  else{
    for(let i = 0; i < 3; i++){
      latestBlogsWrapper.innerHTML += `
                    <div class="col-md-4 col-sm-4">
                      <div class="aa-latest-blog-single">
                        <figure class="aa-blog-img">                    
                          <a><img src="${sortedBlogs[i].images.large}" alt="${sortedBlogs[i].title}"></a>  
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
                          <a href="blog-single.html" class="aa-read-mor-btn" data-blogid="${sortedBlogs[i].id}">Read more <span class="fa fa-long-arrow-right"></span></a>
                        </div>
                      </div>
                    </div>
                `;
    }
    
}
}
if(url == '/blog-archive-2.html' || url == '/dailywebshop/blog-archive-2.html'){
  let BlogsWrapper = document.querySelector('.aa-blog-content .row');
  let comments = getFromLocalStorage('comments');
  BlogsWrapper.innerHTML = '';
  if(window.innerWidth > 768){
  for(let i = 0; i < sortedBlogs.length; i++){
    BlogsWrapper.innerHTML += `
                    <div class="col-md-4 col-sm-6">
                      <div class="aa-latest-blog-single">
                        <figure class="aa-blog-img">                    
                          <a href="#"><img src="${sortedBlogs[i].images.small}" alt="${sortedBlogs[i].title}"></a>  
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
                          <a href="blog-single.html" class="aa-read-mor-btn" data-blogid="${sortedBlogs[i].id}">Read more <span class="fa fa-long-arrow-right"></span></a>
                        </div>
                      </div>
                    </div>
                `;
    }
  }
  else{
    for(let i = 0; i < sortedBlogs.length; i++){
      BlogsWrapper.innerHTML += `
                      <div class="col-md-4 col-sm-6">
                        <div class="aa-latest-blog-single">
                          <figure class="aa-blog-img">                    
                            <a href="#"><img src="${sortedBlogs[i].images.large}" alt="${sortedBlogs[i].title}"></a>  
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
                            <a href="blog-single.html" class="aa-read-mor-btn" data-blogid="${sortedBlogs[i].id}">Read more <span class="fa fa-long-arrow-right"></span></a>
                          </div>
                        </div>
                      </div>
                  `;
  }
}
};
}
//Function for finding author of blog
function UsersAndTheirBlogs(users,blog){
  let returnValue = '';
  for(let i = 0; i < users.length; i++){
    if(users[i].id == blog.authorId){
      returnValue = users[i].name;
    }
  }
  return returnValue;
}
//Fucntion for printing comments on blogs
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
}
//Function which cut the number of views, likes, comments and put K or M
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
}
//Function which print date in format Month Day, Year
function dateOfBlogs(blogDate){
  const date = new Date(blogDate); 
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return month + ' ' + day + ', ' + year;
}
//Funtion which gets data-id from btn and store it in local storage
function getClickedModal(){
  let btns = document.querySelectorAll('.openModal');
  btns.forEach(btn => {
    btn.addEventListener('click', function(){
      let prId = parseInt(btn.getAttribute('data-prid'));
      addToLocalStorage('modalProduct', {"id": prId});
      productModalView();
     
    });
  });
 
}
//Function which returns in stock or out of stock text
function productInStock(product){
  let returnValue = '';
  if(product.productsSectionId == 2){
    returnValue = `<span class="outOfStock">Out of stock</span>`;
  }
  else{
    returnValue = `<span class="inStock">In stock</span>`;
  }
  return returnValue;
}
//Function which returns add to cart button if product is in stock 
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
}
//Function which returns sizes of products
function productsAndTheirSizes(product){
  let returnValue = '';
  product.availableSizes.forEach(size => {
    returnValue += `<a>${size}</a>`;
  });
  return returnValue;
}
//Function which returns colros of products
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
}
//Function which returns categories of products
function productsAndTheirCategories(product,categories){
    let returnValue = '';
    categories.forEach(category => {
      if(category.id == product.categoryId){
        returnValue += `${category.name}`;
      }
    });
      return returnValue;
  
}
//Function which returns sections of products
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
}
//Function for product quick view
function productModalView(){
  let productQuickView = document.querySelector('.modal-body .row');
  let modalProductFromLocalStorage = getFromLocalStorage('modalProduct');
  let categories = getFromLocalStorage('categories');
  getDataWithAjax('products.json', function(products){
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
              <a href="product-detail.html" class="aa-add-to-cart-btn openProduct" data-prid="${product.id}">View Details</a>
            </div>
          </div>
        </div>
          `;
        storeSingleProductToLS();
        }
  });
  });
}
//Function for printing single blog
function singlePageBlog(){
  let btns = document.querySelectorAll('.aa-read-mor-btn');
  console.log(btns);
  btns.forEach(btn => {
    btn.addEventListener('click', function(){
      let blogId = parseInt(btn.getAttribute('data-blogid'));
      addToLocalStorage('clickedBlog', {"id": blogId});
    });
  });
}
//Function for getting number of comments for each blog
function numberOfComments(comments,blog){
  let commArray = [];
  comments.forEach(comment => {
    if(comment.blogId == blog.id){
      commArray.push(comment);
    }
  });
  return commArray.length;
}
//Function for printing products
function printProducts(products){
  let productsContainer = document.querySelector('.aa-product-catg');
  let sections = getFromLocalStorage('sectionsProducts');
  productsContainer.innerHTML = '';
  products.forEach(product => {
    productsContainer.innerHTML += `
    <li>
    <figure>
      <a class="aa-product-img openProduct" href="product-detail.html" data-prid="${product.id}"><img src="${product.image}" alt="${product.name}"></a>    
      ${disableCartButton(product,'hover')}
      <figcaption>
        <h4 class="aa-product-title"><a>${product.name}</a></h4>
        ${productDiscount(product)}
      </figcaption>
    </figure>                         
    <div class="aa-product-hvr-content">
      <a data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><span class="fa fa-heart-o wish-btn pr-btns" data-prid="${product.id}"></span></a>
      <a class="openModal" data-toggle2="tooltip" data-placement="top" title="Quick View" data-prid="${product.id}" data-toggle="modal" data-target="#quick-view-modal"><span class="fa fa-search pr-btns"></span></a>                            
    </div>
    <!-- product badge -->
    ${productsAndTheirSections(product,sections)}
  </li>`
});
}
//Function stores clicked product in local storage
function storeSingleProductToLS(){
  let imgs = document.querySelectorAll('.openProduct');
  imgs.forEach(img => {
    img.addEventListener('click', function(){
      let producId = parseInt(img.getAttribute('data-prid'));
      addToLocalStorage('clickedProduct', {"id": producId});
    });
  });
}
//Function populates the sidebar with data from JSON files
function printSidebar(){
  getDataWithAjax('brands.json', function(data){
    let brandsForm = document.querySelector('#brands-filter');
    brandsForm.innerHTML = '';
    for(let i = 0; i < data.length; i++){
      brandsForm.innerHTML += `<div class="input-brand">
      <input type="checkbox" value="${data[i].id}" name="${data[i].name}"/> ${data[i].name}
      </div>`;
    }
  });
  getDataWithAjax('colors.json', function(data){
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
  getDataWithAjax('genders.json', function(data){
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
}
//Function which return value if product has free shipping or not
function freeShipping(product){
  if(product.freeShipping){
    return `<span class="aa-badge aa-sale freeShipping">FREE SHIPPING</span>`;
  }
  else{
    return `<span class="shippFee">Shipping fee: $${product.shippingFee}</span>`;
  }
}
//Function for adding products to cart and wishlist
function addingProducts(productId, type){
  let count = 0;
  let typeOfAdd = getFromLocalStorage(type);
  let productArr = [];
  let addedParagraph = document.querySelector('#addedText');
  let popupAdded = document.querySelector('#popupbgAdded');
  if(typeOfAdd == null || typeOfAdd.length == 0){
    if(type == 'cart'){
      productArr[0] = {"id": parseInt(productId), "quantity": 1};
      document.querySelector('#popupbgAdded #popup img').src = "img/bag.png";
    }
    if(type == 'wishlist'){
      productArr[0] = {"id": parseInt(productId)};
      document.querySelector('#popupbgAdded #popup img').src = "img/heart.png";
    }
    addToLocalStorage(type, productArr);
    numberOfProductsInCart();
    addedParagraph.innerHTML = `Product added to ${type}!`;
    popupAdded.style.display = 'block';
    setTimeout(function(){
      popupAdded.style.display = 'none';
    }, 1000);
  }
  else
  {
  for(let i of typeOfAdd)
  {
    if(i.id == productId)
    {
      count++;
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
      numberOfProductsInCart();
    }
    popupAdded.style.display = 'block';
    setTimeout(function(){
      popupAdded.style.display = 'none';
    }, 1000);
  }
  else if(count > 0)
  {
    let alreadyParagraph = document.querySelector('#alreadyText');
    let popupAlready = document.querySelector('#popupbgAlready');
    alreadyParagraph.innerHTML = `Product already in ${type}!`;
    popupAlready.style.display = 'block';
    setTimeout(function(){
      popupAlready.style.display = 'none';
    }, 1000);
  }
  }
}
//Fucntion for mail validation on newsletter
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
      if(url.includes('index.html')){
      message.textContent = 'Thanks for subscribing to our newsletter!';
      }
      if(url.includes('product-detail.html')){
      let products = getFromLocalStorage('allProducts');
      let clickedProduct = getFromLocalStorage('clickedProduct');
      products.forEach(product => {
        if(product.id == clickedProduct.id){
          message.innerHTML = `Thanks. You'll get email update when <span class="black-pr">${product.name}</span> becomes available.`;
        }
      });
      }
      email.value = '';
    }
  });
}
//Function for deleting products from cart and wishlist
function deleteProduct(btn,productId,type)
{
      let table = document.querySelector('#cart-view .container');   
      // let productId = button.getAttribute('data-prid');
      let idNumber = parseInt(productId);
      let item = getFromLocalStorage(type);
      let newItem = item.filter(product => product.id !== idNumber);
      // let index = item.indexOf(productId);
      // item.splice(index, 1);
      addToLocalStorage(type, newItem);
      if(type == 'wishlist'){
        btn.parentElement.parentElement.parentElement.parentElement.remove();
      }
      if(type == 'cart'){
        btn.parentElement.parentElement.remove();
        let numberInCart = document.querySelector('.aa-cart-notify');
        numberInCart.innerHTML = getFromLocalStorage('cart').length;
        let totalPriceFromDeleted = btn.parentElement.parentElement.children[5].innerHTML.slice(1);
        let NumberPrice = Number(totalPriceFromDeleted);
        let totalPrice = document.querySelector('#TotalCartPrice');
        totalPrice.innerHTML = `$${Number(totalPrice.innerHTML.slice(1)) - NumberPrice}`;
      }
      if(getFromLocalStorage(type) == null || getFromLocalStorage(type).length == 0){
        localStorage.removeItem(type);
        if(type == 'cart'){
        table.innerHTML = `<h1 class="text-center empty-cart">Your cart is empty.</h1>                           
                            <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
        }
        if(type == 'wishlist'){
          let wishlistWrapper = document.querySelector('.cart-view-area');
          wishlistWrapper.style.flexDirection = 'column!important';
          wishlistWrapper.innerHTML = `<h1 class="text-center empty-cart">Your wishlist is empty.</h1>                      
                            <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
        }
      }
}
//Function for calculating total price of product in cart
function productTotalPrice(quantity,price){
  let total = quantity * price;
  return total;
}
//Function for total price in cart
function totalPrice(){
  let totalPrice = document.querySelector('#TotalCartPrice');
  let totalProductPrice = document.querySelectorAll('#totalProductPrice');
  let sum=0;
  totalProductPrice.forEach(function(item){
    sum += parseInt(item.innerHTML.slice(1));
  });
  totalPrice.innerHTML = `$${sum}`;
}
//Function for changing quantity of product in cart and total price in cart
function changeProductQuantity(){
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
}
//Function for triggering filter change on products page
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
  getButtonsForAdding();
  storeSingleProductToLS();
  getClickedModal();
}
//Function for triggering filter change on blog page
function changeBlogs(){
  getDataWithAjax("blogs.json", function(blogs){
  blogs = filterBlogs(blogs, 'category', 'genderId');
  blogs = filterBlogs(blogs, 'tag', 'tags');
 
  if(blogs.length == 0){
    document.querySelector('#aler-pr').style.display = 'block';
    document.querySelector('#aler-pr').innerHTML = `Sorry! We currently do not have any products that match Your criterium!`;
  }
  else{
    document.querySelector('#aler-pr').style.display = 'none';
    document.querySelector('#aler-pr').innerHTML = '';
  }

  printBlogs(blogs);
  singlePageBlog();
});
  
}
//Function for filtering products
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
          value.push(parseInt(gender.value));
        }
      });
      if(value.length == 0){
        filteredProducts = products;
      }
      else{
        // filteredProducts = products.filter(product => value.some(value => product[filter] == value));
        filteredProducts = products.filter(product => value.includes(product[filter]));
      }
     
    }
    if(type == 'category'){
      categories.forEach(category => {
        if(category.checked == true){
          catArr.push(parseInt(category.value));
        }
      });
      if(catArr.length == 0){
        filteredProducts = products;
      }
      else{
        // filteredProducts = products.filter(product => catArr.some(catArr => product[filter] == catArr));
        filteredProducts = products.filter(product => catArr.includes(product[filter]));
      }
    
    }
    if(type == 'brand'){
      brands.forEach(brand => {
        if(brand.checked == true){
          brandArr.push(parseInt(brand.value));
        }
      });
      if(brandArr.length == 0){
        filteredProducts = products;
      }
      else{
        // filteredProducts = products.filter(product => brandArr.some(brandArr => product[filter] == brandArr));
        filteredProducts = products.filter(product => brandArr.includes(product[filter]));
      }
      
    }
    if(type == 'section'){
      sections.forEach(section => {
        if(section.checked == true){
          secArr.push(parseInt(section.value));
        }
      });
      if(secArr.length == 0){
        filteredProducts = products;
      }
      else{
        // filteredProducts = products.filter(product => secArr.some(secArr => product[filter] == secArr));
        filteredProducts = products.filter(product => secArr.includes(product[filter]));
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
            colorArr.push(parseInt(color.id.slice(5)));
            // filteredProducts = products.filter(product => colorArr.some(colorArr => product[filter] == colorArr));
            filteredProducts = products.filter(product => colorArr.includes(product[filter]));
          }
        });
        if(colorArr.length == 0){
          filteredProducts = products;
        }
       }
      
    return filteredProducts;
}
//Function for filtering blogs
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
}
//Function for sorting products
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
}
//Function for searching products
function searchProducts(products){
  let searchValue = document.querySelector('#searchProducts').value;
  let filteredProducts = [];
  if(searchValue == ''){
    return products;
  }
  else{
    return products.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));
  }
}
//Function for validating inputs
function validateInput(input,regex,type){
  var countErrors = 0;
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
        $(input).next().html('Incorrect first name format. First letter must be capital and name must contain only letters. Example: John');
        countErrors++;
        break;
      case 'lastname':
        $(input).next().html('Incorrect first name format. First letter must be capital and name must contain only letters. Example: Doe');
        countErrors++;
        break;
      case 'companyname':
        $(input).next().html('Incorrect company name format. First letter must be capital or number. Example: Company1');
        countErrors++;
        break;
      case 'email':
        $(input).next().html('Incorrect email format. Example: jhondoe@gmail.com');
        countErrors++;
        break;
      case 'phone':
        $(input).next().html('Incorrect phone format. Example: +381601234567 or 0601234567');
        countErrors++;
        break;
      case 'address':
        $(input).next().html('Incorrect address format. Example: Street 1');
        countErrors++;
        break;
      case 'city':
        $(input).next().html('Incorrect city format. First letter must be capital and name must contain only letters. Example: Belgrade');
        countErrors++;
        break;
      case 'zip':
        $(input).next().html('Incorrect zip format. Example: 11000');
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
}
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
}
//Function for printing blog tags in single blog page
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
}
//Function for getting data from local storage
function getFromLocalStorage(key){
  return JSON.parse(localStorage.getItem(key));
}
//Function for adding data to local storage
function addToLocalStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
//Function for removing data from local storage
function removeFromLocalStorage(value){
  localStorage.removeItem(value);
}
//Function for getting buttons for adding products to cart and wishlist
function getButtonsForAdding(){
  let wishBtns = document.querySelectorAll('.wish-btn');
  wishBtns.forEach(wishBtn => {
    wishBtn.addEventListener('click', function(){
      addingProducts(this.getAttribute("data-prid"), 'wishlist');
    });
  });
  let cartBtns = document.querySelectorAll('.cart-btn');
  cartBtns.forEach(cartBtn => {
    cartBtn.addEventListener('click', function(){
      addingProducts(this.getAttribute("data-prid"), 'cart');
    });
  });
}
//Function for loading functions after 1 second
function loadFunction(func, parameter){
  setTimeout(function(){
    func(parameter);
  }, 1000);
}
//Function for printing products in cart from local storage
function printProductsInCart(){
  let cartWrapper = document.querySelector('.table tbody');
  let table = document.querySelector('#cart-view .container');
  let cart = getFromLocalStorage('cart');
  let products = getFromLocalStorage('allProducts');
  if(cart == null || cart.length == 0){
    table.innerHTML = `<h1 class="text-center empty-cart">Your cart is empty.</h1>
                      <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
    }
  else{
      for(let i = 0; i < cart.length; i++){
        for(let j = 0; j < products.length; j++){
          if(cart[i].id == products[j].id){
            cartWrapper.innerHTML += `
            <tr>
            <td><a class="btn btn-primary alert-danger aa-remove-product" data-prid="${products[j].id}" data-page="cart">Remove product</a></td>
            <td><a class="aa-cartbox-img"><img src="${products[j].image}" alt="${products[j].name}"></a></td>
            <td><a class="aa-cart-title" data-prid="${products[j].id}">${products[j].name}</a></td>
            <td>$${products[j].price.activePrice}</td>
            <td><span class="minus">-</span><span class="quantity" data-prid="${products[j].id}">${cart[i].quantity}</span><span class="plus">+</span></td>
            <td id="totalProductPrice" data-prid="${products[j].id}">$${productTotalPrice(cart[i].quantity,products[j].price.activePrice)}</td>
            </tr>`;
          }
        }   
      }
  }
}
//Function for printing products in wishlist from local storage
function printProductsInWishlist(){
  let wishlistWrapper = document.querySelector('.cart-view-area');
  let wishlist = getFromLocalStorage('wishlist');
  wishlistWrapper.innerHTML = '';
  if(getFromLocalStorage('wishlist') == null || getFromLocalStorage('wishlist').length == 0){
    wishlistWrapper.innerHTML = `<h1 class="text-center empty-cart">Your wishlist is empty.</h1>
                       <br/>
                       <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
   }
  else{
  getDataWithAjax('products.json', function(data){
    wishlistWrapper.innerHTML = '';
    for(let i = 0; i < wishlist.length; i++){
      for(let j = 0; j < data.length; j++){
        if(wishlist[i].id == data[j].id){
          wishlistWrapper.innerHTML += `
          <div class="col-sm-5 col-md-4 cardWrapper">
            <div class="card wish-card">
            <img src="${data[j].image}" class="card-img-top w-100 aa-product-img" alt="${data[j].name}">
            <div class="card-body">
              <h5 class="card-title">${data[j].name}</h5>
              <p class="card-text">${productDiscount(data[j])}</p>
              <span>
              <a class="btn btn-primary alert-danger aa-remove-product" data-prid="${data[j].id}" data-page="wishlist">Remove product</a>
              <a href="product-detail.html" data-prid="${data[j].id}" class="btn btn-primary openProduct">View product</a>
              </span>
            </div>
            </div>
          </div>
          `;
        }
        }
    }
  })
}
}
//Function for creating trigger on delete buttons
function deleteProductTrigger(){
  let deleteProductBtn = document.querySelectorAll('.aa-remove-product');
  deleteProductBtn.forEach(btn => {
    btn.addEventListener('click', function(){
      if(btn.getAttribute("data-page") == 'cart'){
        deleteProduct(this,this.getAttribute("data-prid"),'cart');
      }
      else if(btn.getAttribute("data-page") == 'wishlist'){
        deleteProduct(this,this.getAttribute("data-prid"),'wishlist');
      }
    });
  });
}
if(!url.includes('/blog-archive-2.html') && !url.includes('/index.html') && !url.includes('/blog-single.html')){
  removeFromLocalStorage('clickedBlog');
  removeFromLocalStorage('users');
  removeFromLocalStorage('comments');
}
if(!url.includes('/products.html') && !url.includes('/index.html') && !url.includes('/product-detail.html')){
  removeFromLocalStorage('clickedProduct');
  removeFromLocalStorage('modalProduct');
}
if(!url.includes('/product-detail.html')){
  removeFromLocalStorage('colors');
}
if(url.includes('/cart.html')){
  if(getFromLocalStorage('cartForCheckout') != null && getFromLocalStorage('cartForCheckout').length != 0){
    removeFromLocalStorage('cartForCheckout');
  }
}
if(url.includes('/index.html')){
  getDataWithAjax('productsSections.json' , function(data){
    addToLocalStorage('sectionsProducts', data);
  });
  let users = fetch(BASEURL + 'users.json')
  .then(response => response.json()).then(data => {
      addToLocalStorage('users', data);
  });
  let comments = fetch(BASEURL + 'comments.json')
  .then(response => response.json()).then(data => {
    addToLocalStorage('comments', data);
  });
  window.onload = function(){
    getDataWithAjax('products.json', function(data){
      addToLocalStorage('allProducts', data);
      indexProducts(data,'male','#men .aa-product-catg');
      indexProducts(data, 'female', '#women .aa-product-catg');
      indexProducts(data, 'sport', '#sports .aa-product-catg');
    });
    getDataWithAjax('blogs.json', function(blogs){
      printBlogs(blogs);
    });
    loadFunction(getButtonsForAdding);
    loadFunction(storeSingleProductToLS);
    loadFunction(getClickedModal);
    removeFromLocalStorage('cartForCheckout');
    removeFromLocalStorage('clickedPromo');
    mailCheck();
    loadFunction(singlePageBlog);
  }
};
if(url.includes('/blog-archive-2.html')){
  let users = fetch(BASEURL + 'users.json')
  .then(response => response.json()).then(data => {
      addToLocalStorage('users', data);
  });
  let comments = fetch(BASEURL + 'comments.json')
  .then(response => response.json()).then(data => {
    addToLocalStorage('comments', data);
  });
  let categories = document.querySelectorAll('.aa-catg-nav li a');
  let tags = document.querySelectorAll('.tag-cloud a');
  let filterNames = document.querySelectorAll('.aa-sidebar-widget h3');
  document.querySelector('#aler-pr').style.display = 'none';
  filterNames.forEach(filterName => {
    $(filterName).next().css('display','none');
  });
  filterNames.forEach(filterName => {
    filterName.addEventListener('click', function(){
      if(filterName.nextElementSibling.style.display == 'none'){
        $(filterName).next().slideDown();
      }
      else{
        $(filterName).next().slideUp();
      }
    });
  });
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
  window.onload = function(){
    getDataWithAjax('blogs.json', function(blogs){
      loadFunction(printBlogs,blogs);
    }); 
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('clickedProduct');
    removeFromLocalStorage('cartForCheckout');
    setTimeout(function(){
     singlePageBlog();
    }, 1500);
  
  };
};
if(url.includes('/blog-single.html')){
  window.onload = function(){
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('clickedProduct');
    getDataWithAjax('blogs.json', function(blogs){
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
            <a><img src="${blog.images.small}" alt="fashion img"></a>
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
  getDataWithAjax('productsSections.json' , function(data){
    addToLocalStorage('sectionsProducts', data);
  });
  getDataWithAjax('products.json', function(data){
    addToLocalStorage('allProducts', data);
    printProducts(data);
    printSidebar(data);
  });
let filter = document.querySelector('#filter-pr');
let filterProducts = document.querySelector('.filter-products-side');
filter.addEventListener('click', function(){
 filterProducts.classList.add('active-filter');
  $('html, body').animate({scrollTop : 0},500);
  $('#pr-overlay').css('display', 'block');
  $('body').css('overflow', 'hidden');
});
document.querySelector('#pr-overlay').addEventListener('click', function(){
  filterProducts.classList.remove('active-filter');
  $('#pr-overlay').css('display', 'none');
  $('body').css('overflow', 'auto');
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
  loadFunction(getButtonsForAdding);
  loadFunction(storeSingleProductToLS);
  loadFunction(getClickedModal);
  removeFromLocalStorage('clickedBlog');
  removeFromLocalStorage('cartForCheckout');
  setTimeout(function(){
    let genders = document.querySelectorAll('.input-gender input');
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
    let priceFilerUpper = document.querySelector('#skip-value-upper');
    let priceFilerLower = document.querySelector('#skip-value-lower');
    priceFilerLower.addEventListener('DOMSubtreeModified', function(){
      changeProducts();
    });
    priceFilerUpper.addEventListener('DOMSubtreeModified', function(){
      changeProducts();
    });
    let prView = document.querySelector('.aa-product-catg');
    window.addEventListener('resize', function(){
    if(window.innerWidth < 768){
      prView.classList.add("list");
    }
    else{
      prView.classList.remove("list");
    }
    });
  }, 200);
}
};
if(url.includes('/product-detail.html')){
  getDataWithAjax('colors.json', function(data){
    addToLocalStorage('colors', data);
  });
 
  let productInfoWrapper = document.querySelector('.aa-product-details-content .row');
  
  window.onload= function(){
    let clickedProduct;
  setTimeout(function(){
    clickedProduct = getFromLocalStorage('clickedProduct');
    getNotified = document.querySelector('#aa-getnotified');
  }, 500);
  let categories = getFromLocalStorage('categories');
  let sections = getFromLocalStorage('sectionsProducts');
  let getNotified;
  productInfoWrapper.innerHTML = '';
  setTimeout(function(){
    getDataWithAjax('products.json', function(products){
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
          if(product.productsSectionId == 2){
            getNotified.innerHTML = `
            <div class="aa-subscribe-area">
            <h3>Receive a notification when this product becomes available.</h3>
            <form action="" class="aa-subscribe-form">
              <input type="email" name="email" id="" placeholder="Enter your Email">
              <input type="button" value="Get notified">
            </form>
            <span id="message" class="error"></span>
          </div>
            `;
          }
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
            <a class="aa-product-img openProduct" href="product-detail.html" data-prid="${filteredProducts[i].id}"><img src="${filteredProducts[i].image}" alt="${filteredProducts[i].name}"></a>
            <a class="aa-add-card-btn cart-btn" data-prid="${filteredProducts[i].id}"><span class="fa fa-shopping-cart"></span>Add To Cart</a>
            <figcaption>
              <h4 class="aa-product-title"><a href="#">${filteredProducts[i].name}</a></h4>
              ${productDiscount(filteredProducts[i])}
            </figcaption>
          </figure>                         
          <div class="aa-product-hvr-content">
            <a data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><span class="fa fa-heart-o wish-btn pr-btns" data-prid="${filteredProducts[i].id}"></span></a>
            <a class="openModal" data-toggle2="tooltip" data-placement="top" title="Quick View" data-prid="${filteredProducts[i].id}" data-toggle="modal" data-target="#quick-view-modal"><span class="fa fa-search pr-btns"></span></a>                            
          </div>
          <!-- product badge -->
          ${productsAndTheirSections(filteredProducts[i],sections)}
        </li>`;
        }
      }
      });
    });
  }, 700);

  let receiveNotif;
    setTimeout(function(){
      getButtonsForAdding();
      storeSingleProductToLS();
      getClickedModal();
      receiveNotif = document.querySelector('.aa-subscribe-area');
      
    }, 1000);
    setTimeout(function(){
      if(receiveNotif != null){
        mailCheck();
      }
    }, 1300);
    removeFromLocalStorage('cartForCheckout');
  } 
};
if(url.includes('/wishlist.html')){
  printProductsInWishlist();
window.onload = function(){
  loadFunction(deleteProductTrigger);
  loadFunction(storeSingleProductToLS);
  removeFromLocalStorage('clickedProduct');
  removeFromLocalStorage('modalProduct');
  removeFromLocalStorage('cartForCheckout');
  };
};
if(url.includes('/cart.html')){
  window.onload = function(){
    printProductsInCart();
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('clickedBlog');
    removeFromLocalStorage('clickedProduct');
      
    loadFunction(deleteProductTrigger);
    if(getFromLocalStorage("cart").length){
      loadFunction(changeProductQuantity);
      loadFunction(totalPrice);
      $('.clear-cart').click(function(){
        localStorage.removeItem('cart');
        let table = document.querySelector('#cart-view .container');   
        table.innerHTML = `<h1 class="text-center empty-cart">Your cart is empty.</h1>    
                          <a href="products.html" class="aa-browse-btn">Browse Products...</a>`;
        numberOfProductsInCart();
      });
        let checkoutBtn = document.querySelector('.checkout-cart');
        checkoutBtn.addEventListener('click', function(){
          let cartTitles = document.querySelectorAll('.table .aa-cart-title');
          let cartForCheckout = [];
          cartTitles.forEach(title => {
            let cartTitle = title.innerHTML;
            cartQuantity = title.parentElement.parentElement.querySelector('.quantity').innerHTML;
            let productTotalPrice = title.parentElement.parentElement.querySelector('#totalProductPrice').innerHTML;
            cartForCheckout.push({"productName": cartTitle,"productQuantity": cartQuantity,"productTotalPrice": productTotalPrice});
          });
          let cartTotalPrice = document.querySelector('#TotalCartPrice').innerHTML;
          cartForCheckout.push({cartTotalPrice});
          addToLocalStorage('cartForCheckout',cartForCheckout);
        });
    }
  
 
 
 };
};
if(url.includes('/checkout.html')){
  window.onload = function(){
    validation();
    let cartForCheckout = getFromLocalStorage('cartForCheckout');
    let prWrapper = document.querySelector('.aa-order-summary-area .table tbody');
    let cart = getFromLocalStorage('cart');
    let cartTotalPrice = document.querySelector('.aa-order-summary-area .table tfoot tr td');
    if(cart == null || cart.length == 0){
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
 

};
if(url.includes('/author.html')){
  window.onload = function(){
    removeFromLocalStorage('clickedBlog');
    removeFromLocalStorage('clickedProduct');
    removeFromLocalStorage('modalProduct');
    removeFromLocalStorage('cartForCheckout');
  };
};