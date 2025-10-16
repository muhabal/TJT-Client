// get products from api

const customProductList = (adminProducts)=>{
  // customize products list
  var products = {}

    for (let key in adminProducts){
      const item = adminProducts[key]
      console.log(item)
      // get product name without the size
      var words = item.name.split(' ')
      var name = '';
      for (let i = 0; i < words.length-1; i++){
        name = name+ ' ' + words[i]
      } 
      name = name.trimStart()

      // check if product already exists in reProducts
      for (let sub_key in products){
        const sub_item = products[sub_key]
        if (sub_item){
          const pname = String(item.name)
          const subname = String(sub_item.name)
          if (pname.includes(subname)){
            sub_item.price["50cl"] = item.price
            sub_item.stock["50cl"] = item.stock
            sub_item.month_sale["50cl"] = item.total_sold
            var subSize = true
          }
        }
      }
      if (subSize){
        
      }else{
        products[`${key}`] = {"name":name, "price":{"25cl":item.price, "50cl": 0}, "stock":{"25cl":item.stock, "50cl": 0}, "month_sale":{"25cl":item.total_sold, "50cl": 0}, "id":{"25cl":0, "50cl":1}}
      }
    }
    return products
  }

const productsContainer= document.getElementById("products-container")

// // get all the buttons
// const addBtns = productsContainer.querySelectorAll('[data-button-id]')

// // get cart container
// const cartContainer = document.getElementById("cart-container")

// const updateItem = ()=>{
//   const updateBtns = document.querySelectorAll('[data-action]')
//   updateBtns.forEach((button)=>{
//     button.addEventListener('click', ()=>{
//       const item = button.parentElement.parentElement
//       const id = item.dataset.id
//       const size = item.dataset.size
//       const action = button.dataset.action
//       var cartItem = cart[`${id}-${size}`]
//       let quantity = Number(cartItem.quantity)
//       let price = cartItem.price
//       if (action == 'add'){
//         if(quantity == 100){
//           alert('you surpassed the maximum bulk order of 100 bottles')
//         }else{
//           quantity += 1
//         }
        
//       }
//       else{ 
//         if (quantity != 1){
//           quantity -= 1
//         }else{
//           alert('click on the delete icon to delete item from cart')
//         }
//       }
//       // update the cart list and append the quantity to the div
//       cartItem.quantity = quantity
//       button.parentElement.querySelector('span').innerHTML = quantity
//       updateTotal(totals, cart,quantity, price, item)
//     })
//   })
// }

// // create function to update order items total and total
// const orderTotal = document.getElementById('order-total')
// const updateOrder = (cart, totals)=>{
//   let itemTotalValue = 0;
//   let costTotalValue = 0;
//   for (let key in cart){
//     const item = cart[key]
//     let quantity = Number(item.quantity)
//     let price= Number(item.price)
//     let total = quantity * price
//     itemTotalValue+=quantity
//     costTotalValue+=total
//   }
//   orderTotal.querySelector('span:nth-child(2)').innerHTML = `$${costTotalValue}`
//   orderTotal.querySelector('span:first-child span').innerHTML = itemTotalValue
//   totals.cost = costTotalValue
//   totals.items = itemTotalValue
//   try{
//     document.getElementById('cart-count').innerHTML = itemTotalValue    
//   }catch(err){}
//   localStorage.setItem()
// }

// // function for calculating the total price per product
// const updateTotal = (totals, cart,quantity, price, item)=>{
//   // let quantity = Number(quantity)
//   price = Number(price)
//   let total = quantity * price
//   const totalSpan = item.querySelector('div:last-child span')
//   totalSpan.innerHTML = `$${total}`
//   price = ''
//   updateOrder(cart, totals)
// }