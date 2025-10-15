// object for storing items in cart and create a dict for totals
if (JSON.parse(localStorage.getItem('cart'))){
  var cartList = JSON.parse(localStorage.getItem('cart'))
  var cartTotals = JSON.parse(localStorage.getItem('cart-total'))
  checkoutBtn.classList.remove('!hidden')
}else{
  var cartList = {}
  var cartTotals = {}
}


// var adminProducts;
// var products;
// async function getProducts(){
//   const res = await fetch('http://localhost:8000/client-api/products/')
//   const data = await res.json()
//   adminProducts =  data
//   products = customProductList(adminProducts)
// }

// get products from server 
const data = await fetch('http://localhost:8000/client-api/products/').then(res => res.json())
var adminProducts = data;
var products = customProductList(adminProducts)
console.log('order')

for (let key in products){
  const product = products[key]
  productsContainer.innerHTML += `
        <product data-origin-key=${key} x-data="{large:false,
        availability: ${product.stock["25cl"]}, toggle() {this.large = !this.large},
        
        init(){
          this.$watch('large', () =>{
            this.availability = $el.dataset.stock
          })
        }
        
        }"
        x-bind:data-id="large ? ${product.id["50cl"]} : ${product.id["25cl"]}" x-bind:data-stock="large ? ${product.stock["50cl"]} : ${product.stock["25cl"]}" class="">
          <figure>
            <img class="" src="./icons/JuiceTrybe.png" alt="">
          </figure>
          <div class="">
            <h2 class="mb-2">${product.name}</h2>
            <span>Options: 2sizes</span>
            <span x-show="!large">${product.month_sale['25cl']} sold this month</span>
            <span x-show="large">${product.month_sale['50cl']} sold this month</span>
            <h2 x-show="!large">₦${product.price['25cl']}</h2>
            <h2 x-show="large">₦${product.price['50cl']}</h2>
            <div class="text-sm mt-4">
              <span x-show="availability == 0" class="text-red-400">*Out of stock</span> 
              <div>
                <div x-show="availability > 0" class="flex justify-between mb-4">
                  <span>Choose Quantity</span>
                  <input class="w-12 outline rounded-md text-center shadow" type="number">                  
                </div>
                <div class="flex justify-between">
                  <span>select size</span>
                  <select @change="toggle" class="cursor-pointer" name="" id="">
                    <option value="25cl">25cl</option>
                    <option value="50cl">50cl</option>
                  </select>
                </div>    
              </div>
            </div>
          </div>
          <div x-show="availability > 0" x-bind:data-size-id="large ? '50cl' : '25cl'"  class="flex justify-center" data-button-id=${key}>
            <a class="button text-sm">Add to Cart</a>
          </div>
        </product>    
  `
}

// get all the buttons
const addBtns = productsContainer.querySelectorAll('[data-button-id]')

// get cart container
const cartContainer = document.getElementById("cart-container")

addBtns.forEach((button)=>{
  button.addEventListener('click', ()=>{

    // check if checkout btn is hidden
    if (checkoutBtn.classList.contains('!hidden')){
      checkoutBtn.classList.remove('!hidden')
    }

    const productInfo = button.parentElement
    const id = productInfo.dataset.id
    const originId = productInfo.dataset.originKey
    const sizeId = button.dataset.sizeId
    const productCard = productsContainer.querySelector(`[data-origin-key="${originId}"]`)
    const product = products[originId]
    const name = product.name
    const stock = product.stock[`${sizeId}`]
    const price = product.price[`${sizeId}`]
    const quantity = productCard.querySelector('input').value
    const size = productCard.querySelector('select').value
    toCart(originId,name,size, quantity,id,price, stock)
  })
})

// create function to add items to cart
const toCart = (originId,name, size, quantity,id,price, stock)=>{
  // check if quantity field is empty or 0
  if (quantity==0 || quantity == ''){
    alert('please enter a quantity')
  } else if (quantity>= 50) {
    alert('proceed to pre-order page for orders on or above 50')
  } else if (quantity > Number(stock)){
    alert(`quantity greater than what is left in stock : ${stock}`)
  } else if(`${originId}-${size}` in cartList){
      alert('this item is already in the cart')
  }
  else{
    Alpine.$data(cartContainer.parentElement).empty = false

    // add to cart block
    cartContainer.innerHTML += `
            <li data-id=${originId} data-size=${size} x-data="{hovered:false}"
              @mouseenter="hovered = true"
              @mouseleave="hovered = false" 
            >
              <span class="col-span-2 truncate">${name}</span>
              <span>${size}</span>               
              <div class="">
                <span>${quantity}</span>
                <img data-action="add" class="h-5 cursor-pointer" src="https://img.icons8.com/small/64/plus.png" alt="add"/>
                <img data-action="minus" class="h-5 cursor-pointer" src="https://img.icons8.com/small/64/minus.png" alt="minus"/>
              </div>
              <div>
                <span>₦${Number(quantity)*Number(price)}</span>
                <img id="delete-btn" x-show="hovered" class="h-5 cursor-pointer" src="https://img.icons8.com/small/64/delete.png" alt="delete"/>
              </div>             
            </li>
    `    
    Cart(originId,name,size, quantity, id, price)
  }
}

// create funtion to add products to cart
const Cart = (originId,name, size, quantity, id, price)=>{
  cartList[`${originId}-${size}`] = {"name":name, "size": size, "quantity":quantity, "price":price, "id":id, "originId":originId}
  updateOrder()
  updateItem()
  //save list in local storage
  localStorage.setItem('cart', JSON.stringify(cartList))
  localStorage.setItem('cart-total', JSON.stringify(cartTotals))
}

// function for updating order
const updateOrder = ()=>{
  let itemTotalValue = 0;
  let costTotalValue = 0;
  for (let key in cartList){
    const item = cartList[key]
    let quantity = Number(item.quantity)
    let price= Number(item.price)
    let total = quantity * price
    itemTotalValue+=quantity
    costTotalValue+=total
  }
  orderTotal.querySelector('span:nth-child(2)').innerHTML = `₦${costTotalValue}`
  orderTotal.querySelector('span:first-child span').innerHTML = itemTotalValue
  cartTotals.cost = costTotalValue
  cartTotals.items = itemTotalValue
  try{
    document.getElementById('cart-count').innerHTML = itemTotalValue    
  }catch(err){}
}

// function for updating items using the item btns
const updateItem = ()=>{
  const updateBtns = document.querySelectorAll('[data-action]')
  updateBtns.forEach((button)=>{
    button.addEventListener('click', ()=>{
      const item = button.parentElement.parentElement
      const id = item.dataset.id
      const size = item.dataset.size
      const action = button.dataset.action
      var cartItem = cartList[`${id}-${size}`]
      let quantity = Number(cartItem.quantity)
      let price = cartItem.price
      if (action == 'add'){
        if(quantity == 100){
          alert('you surpassed the maximum bulk order of 100 bottles')
        }else{
          quantity += 1
        }
        
      }
      else{ 
        if (quantity != 1){
          quantity -= 1
        }else{
          alert('click on the delete icon to delete item from cart')
        }
      }
      // update the cart list and append the quantity to the div
      cartItem.quantity = quantity
      button.parentElement.querySelector('span').innerHTML = quantity
      updateTotal(quantity, price, item)
    })
  })
}

// create function to update order items total and total
const orderTotal = document.getElementById('order-total')

// function for calculating the total price per product
const updateTotal = (quantity, price, item)=>{
  // let quantity = Number(quantity)
  price = Number(price)
  let total = quantity * price
  const totalSpan = item.querySelector('div:last-child span')
  totalSpan.innerHTML = `₦${total}`
  price = ''
  updateOrder()
}

// function for deleting item from cart
const deleteItem = (btn)=>{
  const item = btn.parentElement.parentElement
  const id = item.dataset.id
  const size = item.dataset.size
  item.remove()
  delete cartList[`${id}-${size}`]

  // check if cart is empty
  if (Object.keys(cartList).length == 0){

    localStorage.removeItem('cart');
    localStorage.removeItem('cart-total');
    // change the alpine data empty to true
    Alpine.$data(cartContainer.parentElement).empty = true
    
    // make checkout btn hidden
    checkoutBtn.classList.add('!hidden')
  }
  updateOrder()
}

// implement event listener for delete function and update item function on page load
updateItem()

try{
  document.querySelectorAll("aside #delete-btn").forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      deleteItem(btn)
    })
  })
}catch(err){}

// add event listener to checkout btn
checkoutBtn.addEventListener('click', (e)=>{
  localStorage.setItem('page', 'index')
})

// confirm all parameters with backend for submitting
// const checkoutBtn = document.getElementById('checkout')
// checkoutBtn.addEventListener('click', (e)=>{
//   fetch('/confirm-order/', {
//     method: 'POST',
//     headers: {
//       'Content-Type':
//       'application/json',
//       'X-CSRFToken': getCSRF(),
//     },
//     credentials: "include",
//     body: JSON.stringify(cartList)
//     .then(res => res.json())
//     .then(data => console.log('Token saved:', data))
//     .catch(err => console.log(err))
//   })
// })


