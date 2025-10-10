// object for storing items in cart
var cartList = {}

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
            <h2 x-show="!large">$${product.price['25cl']}</h2>
            <h2 x-show="large">$${product.price['50cl']}</h2>
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

addBtns.forEach((button)=>{
  button.addEventListener('click', ()=>{
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

// get cart container
const cartContainer = document.getElementById("cart-container")
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
    //check if cart is empty
    var emptyCart = cartContainer.classList.contains('empty');
    if (emptyCart){
      cartContainer.classList.remove('empty')
      cartContainer.innerHTML = ''
    }
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
                <span>$${Number(quantity)*Number(price)}</span>
                <img onclick='deleteItem(this)' x-show="hovered" class="h-5 cursor-pointer" src="https://img.icons8.com/small/64/delete.png" alt="delete"/>
              </div>             
            </li>
    `    
    Cart(originId,name,size, quantity, id, price)
  }
}

// create funtion to add products to cart
const Cart = (originId,name, size, quantity, id, price)=>{
  cartList[`${originId}-${size}`] = {"name":name, "size": size, "quantity":quantity, "price":price, "id":id}
  updateOrder(cartList)
  updateItem(cartList)
}

// add event listener to delete button
const deleteItem = (btn)=>{
  const item = btn.parentElement.parentElement
  const id = item.dataset.id
  const size = item.dataset.size
  item.remove()
  delete cartList[`${id}-${size}`]

  // check if cart is empty
  if (Object.keys(cartList).length == 0){
    cartContainer.classList.add('empty')
    cartContainer.innerHTML += `<span>Cart is empty</span>`
  }
  updateOrder(cartList)
}

// add event listener 


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
