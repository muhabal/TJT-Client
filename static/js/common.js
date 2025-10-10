const products = {
  "0": {
    "name":"Cafe Mocha",
    "id":{"25cl":"0", "50cl":"1"},
    "stock":{"25cl":"20", "50cl":"0"},
    "price":{"25cl":"10", "50cl":"30"},
    "month_sale":{"25cl":"100", "50cl":"300"}
  },
  "1": {
    "name":"Hint Of Coffee",
    "id":{"25cl":"0", "50cl":"1"},
    "stock":{"25cl":"20", "50cl":"20"},
    "price":{"25cl":"10", "50cl":"30"},
    "month_sale":{"25cl":"100", "50cl":"300"}
  },
  "2": {
    "name":"Creamy",
    "id":{"25cl":"0", "50cl":"1"},
    "stock":{"25cl":"20", "50cl":"20"},
    "price":{"25cl":"10", "50cl":"30"},
    "month_sale":{"25cl":"100", "50cl":"300"}
  },
}

const productsContainer= document.getElementById("products-container")

// // get all the buttons
// const addBtns = productsContainer.querySelectorAll('[data-button-id]')

// // get cart container
// const cartContainer = document.getElementById("cart-container")

const updateItem = (cart)=>{
  const updateBtns = document.querySelectorAll('[data-action]')
  updateBtns.forEach((button)=>{
    button.addEventListener('click', ()=>{
      const item = button.parentElement.parentElement
      const id = item.dataset.id
      const size = item.dataset.size
      const action = button.dataset.action
      var cartItem = cart[`${id}-${size}`]
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
      updateTotal(cart,quantity, price, item)
    })
  })
}

// create function to update order items total and total
const orderTotal = document.getElementById('order-total')
const updateOrder = (cart)=>{
  let itemTotalValue = 0;
  let costTotalValue = 0;
  for (let key in cart){
    const item = cart[key]
    let quantity = Number(item.quantity)
    let price= Number(item.price)
    let total = quantity * price
    itemTotalValue+=quantity
    costTotalValue+=total
  }
  orderTotal.querySelector('span:nth-child(2)').innerHTML = `$${costTotalValue}`
  orderTotal.querySelector('span:first-child span').innerHTML = itemTotalValue
}

// function for calculating the total price per product
const updateTotal = (cart,quantity, price, item)=>{
  // let quantity = Number(quantity)
  price = Number(price)
  let total = quantity * price
  const totalSpan = item.querySelector('div:last-child span')
  totalSpan.innerHTML = `$${total}`
  price = ''
  updateOrder(cart)
}