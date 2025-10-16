const checkoutBtn = document.getElementById('checkout')

// objects for storing items in pre-order cart and create a dict for totals
try{
  if (JSON.parse(localStorage.getItem('preOrderCart'))){
    var preOrderList = JSON.parse(localStorage.getItem('preOrderCart'))
    var preOrderTotals = JSON.parse(localStorage.getItem('pcart-total'))
    checkoutBtn.classList.remove('!hidden')
  }else{
    var preOrderList = {}
    var preOrderTotals = {}
  }
}catch(err){

}


// get products from server 
const data = await fetch('http://localhost:8000/client-api/products/').then(res => res.json())
var adminProducts = data;
var products = customProductList(adminProducts)
console.log('order')

for (let key in products){
const product = products[key]
productsContainer.innerHTML += `
    <div data-origin-key=${key} 
      x-data="{large:false, toggle() {this.large = !this.large}}" x-bind:data-id="large ? ${product.id["50cl"]} : ${product.id["25cl"]}"        
        class="product-card gap-5 md:gap-2">
          <figure>
            <img class="max-h-35 md:max-h-30" src="./icons/JuiceTrybe.png" alt="">
          </figure>
          <div class="flex flex-col md:flex-row items-top gap-2 md:gap-5 [&>div>h2]:!text-sm [&>div>h2]:!font-semibold">
            <div>
              <h2>${product.name}</h2>
              <span class="text-sm hidden md:inline ">Options: 2sizes</span>
              <h2 x-show="!large">₦${product.price['25cl']}</h2>
              <h2 x-show="large">₦${product.price['50cl']}</h2>           
            </div>
            <div>
              <h2>Size</h2>
              <select @change="toggle" class="shadow-md text-sm rounded-md max-w-15 cursor-pointer" name="size" id="size">
                <option value="25cl">25cl</option>
                <option value="50cl">50cl</option>
              </select>
            </div>            
            <div class="">
              <h2>Qty</h2>
              <input placeholder="0" class="shadow-md text-sm rounded-md max-w-15 px-2" type="number">
            </div>
          </div>
          <div x-bind:data-size-id="large ? '50cl' : '25cl'" data-button-id=${key}>
            <a class="button !text-xs md:!text-sm">Add to Cart</a>
          </div>
        </div>
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
    const price = product.price[`${sizeId}`]
    const quantity = productCard.querySelector('input').value
    const size = productCard.querySelector('select').value
    toCart(originId,name,size, quantity,id,price)
  })
})

// create function to add items to cart
const toCart = (originId,name, size, quantity,id,price)=>{
  // check if quantity field is empty or 0
  if (quantity==0 || quantity == ''){
    alert('please enter a quantity')
  } 
  else if(`${originId}-${size}` in preOrderList){
    alert('this item is already in the cart')
  }
  else if(quantity > 100){
    alert('you surpassed the maximum bulk order of 100 bottles')
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
    deleteEvent()
  }
}

// create funtion to add products to pre-order cart
const Cart = (originId,name, size, quantity, id, price)=>{
  var total = Number(price) * Number(quantity)
  preOrderList[`${originId}-${size}`] = {"name":name, "size": size, "quantity":quantity, "price":price, "id":id, "originId":originId, "total":total}
  updateOrder()
  updateItem()
  //save list in local storage
  localStorage.setItem('preOrderCart', JSON.stringify(preOrderList))
  localStorage.setItem('pcart-total', JSON.stringify(preOrderTotals))
}

// create function to update order items total and total
const orderTotal = document.getElementById('order-total')
const updateOrder = ()=>{
  let itemTotalValue = 0;
  let costTotalValue = 0;
  for (let key in preOrderList){
    const item = preOrderList[key]
    let quantity = Number(item.quantity)
    let price= Number(item.price)
    let total = quantity * price
    itemTotalValue+=quantity
    costTotalValue+=total
  }
  orderTotal.querySelector('span:nth-child(2)').innerHTML = `₦${costTotalValue}`
  orderTotal.querySelector('span:first-child span').innerHTML = itemTotalValue
  preOrderTotals.cost = costTotalValue
  preOrderTotals.items = itemTotalValue
  // localStorage.setItem('cart', cartList)
}

const updateItem = ()=>{
  const updateBtns = document.querySelectorAll('[data-action]')
  updateBtns.forEach((button)=>{
    button.addEventListener('click', ()=>{
      const item = button.parentElement.parentElement
      const id = item.dataset.id
      const size = item.dataset.size
      const action = button.dataset.action
      var cartItem = preOrderList[`${id}-${size}`]
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

// add event listener to delete button
const deleteItem = (btn)=>{
  const item = btn.parentElement.parentElement
  const id = item.dataset.id
  const size = item.dataset.size
  item.remove()
  delete preOrderList[`${id}-${size}`]

  // check if cart is empty
  if (Object.keys(preOrderList).length == 0){
    localStorage.removeItem('preOrderCart');
    localStorage.removeItem('pcart-total');
    // change the alpine data empty to true
    Alpine.$data(cartContainer.parentElement).empty = true

    // make checkout btn hidden
    checkoutBtn.classList.add('!hidden')
  }else{
    //save list in local storage
    localStorage.setItem('cart', JSON.stringify(cartList))
    localStorage.setItem('cart-total', JSON.stringify(cartTotals))    
  }
  updateOrder()
}

const deleteEvent = ()=>{
  try{
    document.querySelectorAll("aside #delete-btn").forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        deleteItem(btn)
      })
    })
  }catch(err){}  
}

// implement event listener for delete function and update item function on page load
updateItem()
deleteEvent()

// add event listener to checkout btn
var page = "pre-order"
checkoutBtn.addEventListener('click', (e)=>{
  console.log(preOrderList)
  e.preventDefault();
  fetch('http://localhost:8000/client-api/products-confirm/',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "omit",
    body: JSON.stringify({preOrderList, page})
  }
  ) 
  .then(res => res.json())
  .then(data => {
    console.log(data)
    preOrderTotals.cost = data.total
    localStorage.setItem('pcart-total', JSON.stringify(preOrderTotals))
    localStorage.setItem('page', 'pre-order')
    window.location.href = 'checkout.html'
  })
  .catch(err => console.log(err))
})



