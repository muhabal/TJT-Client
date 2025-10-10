// objects for storing items in pre-order cart

var preOrderList = {}

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
                <h2 x-show="!large">$${product.price['25cl']}</h2>
                <h2 x-show="large">$${product.price['50cl']}</h2>           
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

// create funtion to add products to pre-order cart
const Cart = (originId,name, size, quantity, id, price)=>{
  preOrderList[`${originId}-${size}`] = {"name":name, "size": size, "quantity":quantity, "price":price, "id":id}
  updateOrder(preOrderList)
  updateItem(preOrderList)
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
    cartContainer.classList.add('empty')
    cartContainer.innerHTML += `<span>Cart is empty</span>`
  }
  updateOrder(preOrderList)
}

