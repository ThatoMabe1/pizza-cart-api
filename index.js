document.addEventListener('alpine:init', () => {
    Alpine.data('cart', () => {
        return {
            title: 'Pizza Menu',
            pizzas: [],
            cartPizzas: [],
            username: '',
            paymentAmount: 0,
            cartTotal: 0,
            cartId: '',
            message: '',
            loggedIn: false,
            userHistory: '',
            login() {
                if (this.username.length > 1) {
                    localStorage['username'] = this.username;
                    this.createCart();
                    this.loggedIn = true;
                }
                else {
                    alert("Not a username");
                }
            },

            logout() {
                if (confirm('Are you sure you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = '';
                    localStorage['username'] = '';
                    // this.createCart() = '';
                    this.loggedIn = false;
                }
            },

            createCart() {
                if (!this.username) {
                    this.cartId = "Username required"
                    return Promise.resolve();;
                }

                const cartId = localStorage['cartId'];

                if (cartId) {
                    this.cartId = cartId;
                }
                else {
                    const creatCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=ThatoMabe1=${this.username}`
                    return axios.get(creatCartURL).then(result => {
                        this.cartId = result.data.cart_code;
                        localStorage['cartId'] = this.cartId;
                    });
                }
            },

            Image() {
                return `/img/${pizza.size}.png`
            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCartURL);
            },

            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    cart_code: this.cartId,
                    pizza_id: pizzaId
                })
            },

            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    cart_code: this.cartId,
                    pizza_id: pizzaId
                })
            },

            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                    cart_code: this.cartId,
                    amount,
                })
            },

            showCartData() {
                this.getCart().then(result => {
                    console.log(result.data);
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                });
            },

            init() {
                const storedUsername = localStorage['username'];
                const storedCartId = localStorage['cartId'];

                if (storedUsername && storedCartId) {
                    this.loggedIn = true;
                    this.createCart()
                        .then(() => {
                            this.showCartData();
                        })
                }else {
                    console.log('user not logged in');
                }

                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        console.log(result.data);
                        this.pizzas = result.data.pizzas;
                    });

                // if (!this.cartId) {

                // }
                // this.showCartData();
            },

            addPizzaToCart(pizzaId) {
                this
                    .addPizza(pizzaId)
                    .then(this.showCartData)
            },

            addPizzaToCart(pizzaId) {
                this.addPizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },

            removePizzaFromCart(pizzaId) {
                this.removePizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },

            getUserHistory() {
                axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=ThatoMabe1=${this.username}`)
                    .then((result) => {
                        this.userHistory = result.data;
                        console.log(result.data)
                    })
            },

            payForCart() {
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 2000);
                        }
                        else {
                            this.message = 'Payment Successful';

                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0;
                                this.cartId = '';
                                this.createCart();
                                this.paymentAmount = 0;
                                localStorage['cartId'] = '';
                            }, 3000)
                        }
                    })
            }
        }
    });
});