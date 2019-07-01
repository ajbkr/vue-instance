/* global Vue */
Vue.config.devtools = true

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },

  template: `
    <div class="product">
      <div class="product-image">
        <img v-bind:src="image" />
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
        <p>Shipping: {{ shipping }}</p>
        <product-details :details="details"></product-details>
        <div v-for="(variant, index) in variants"
             :key="variant.variantId"
             class="color-box"
             :style="{ backgroundColor: variant.variantColor }"
             @mouseover="updateProduct(index)">
        </div>
        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>
        <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }">
          Add to Cart
        </button>
        <!--<button v-on:click="removeFromCart">Remove</button>-->
      </div>
      <product-tabs :reviews="reviews"></product-tabs>
    </div>
  `,

  data: function () {
    return {
      brand: 'Vue Mastery',
      details: [
        '80% cotton',
        '20% polyester',
        'Gender-neutral'
      ],
      product: 'Socks',
      reviews: [],
      selectedVariant: 0,
      sizes: [
        'small',
        'medium',
        'large',
        'x-large'
      ],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0
        }
      ]
    }
  },

  methods: {
    addReview: function (productReview) {
      this.reviews.push(productReview)
    },

    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },

    removeFromCart: function () {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    },

    updateProduct: function (index) {
      this.selectedVariant = index
    }
  },

  computed: {
    image: function () {
      return this.variants[this.selectedVariant].variantImage
    },

    inStock: function () {
      return this.variants[this.selectedVariant].variantQuantity
    },

    shipping: function () {
      return this.premium ? 'Free' : 2.99
    },

    title: function () {
      return this.brand + ' ' + this.product
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },

  template: `
    <ul>
      <li v-for="detail in details"
          v-bind:details="details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name" />
      </p>
      <p>
        <label for="review">Review:</label>
        <input id="review" v-model="review"></textarea>
      </p>
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend" />
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend" />
      </label>
      <p>
        <input type="submit" value="Submit" />
      </p>
    </form>
  `,

  data: function () {
    return {
      errors: [],
      name: null,
      rating: null,
      recommend: null,
      review: null
    }
  },

  methods: {
    onSubmit: function () {
      const { name, rating, recommend, review } = this

      if (name && rating && recommend && review) {
        const productReview = {
          name,
          rating,
          recommend,
          review
        }

        this.$emit('review-submitted', productReview)

        this.name = null
        this.rating = null
        this.recommend = null,
        this.review = null
      } else {
        if (!this.name) {
          this.errors.push('Name required.')
        }
        if (!this.review) {
          this.errors.push('Review required.')
        }
        if (!this.rating) {
          this.errors.push('Rating required.')
        }
        if (!this.recommend) {
          this.errors.push('Recommendation required.')
        }
      }
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      required: true,
      type: Array
    }
  },

  template: `
    <div>
      <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectedTab = tab">
            {{ tab }}</span>
    </div>
    <div>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
        </li>
      </ul>
    </div>
    <product-review @review-submitted="addReview"></product-review>
  `,

  data: function () {
    return {
      selectedTab: 'Reviews',
      tabs: ['Reviews', 'Make a Review']
    }
  }
})

// eslint-disable-next-line no-unused-vars
var app = new Vue({
  el: '#app',

  data: {
    cart: [],
    premium: true
  },

  methods: {
    removeCart: function (id) {
      this.cart.splice(this.cart.indexOf(id), 1)
    },

    updateCart: function (id) {
      this.cart.push(id)
    }
  }
})
