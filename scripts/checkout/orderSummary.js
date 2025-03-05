import {cart, removeFromCart, updateCartQuantity, updateDelivaryOption} from '../../data/cart.js';
import {products} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {delivaryOptions} from '../../data/delivaruOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';


export function renderOrderSummary(){
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {


    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }

    });



    const delivaryOptionId = cartItem.delivaryOptionId;
    
    let delivaryOption;

    delivaryOptions.forEach((option) => {
      if (option.id === delivaryOptionId){
        delivaryOption = option;
      }
    });

    const today = dayjs();
    const delivaryDate = delivaryOption ? today.add(delivaryOption.delivaryDays, 'days'): today
    
    const dateString = delivaryDate.format('dddd, MMMM D');



    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${delivaruOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function delivaruOptionsHTML(matchingProduct, cartItem){
    let html = '';
    delivaryOptions.forEach((delivaryOption) => {
      
      const today = dayjs();
      const delivaryDate = today.add(
        delivaryOption.delivaryDays ,'days');
      
      const dateString = delivaryDate.format('dddd, MMMM D');
      const priceString = delivaryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(delivaryOption.priceCents)}-`

      const isChecked = delivaryOption.id === cartItem.delivaruOptionId;
      
      html += `
        <div class="delivery-option js-delivary-option"
        data-product-id="${matchingProduct.id}"
        data-delivary-option-id="${delivaryOption.id}">
          <input type="radio"
            ${isChecked?'checked':''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    })

    return html;
  }


  updateCartQuantity()

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.remove();
        updateCartQuantity()
        renderPaymentSummary()
      });
    });
    ((cartItem) => {
      cartQuantity += cartItem.quantity;
    });




  document.querySelectorAll('.js-delivary-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId , delivaryOptionId} = element.dataset;
        updateDelivaryOption(productId,delivaryOptionId);
        renderOrderSummary()
        renderPaymentSummary()
      })
    })
  }
