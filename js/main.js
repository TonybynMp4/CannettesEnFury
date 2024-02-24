document.addEventListener('DOMContentLoaded', function () {
	setup();
});

function setup() {
	if (document.getElementById('productList')) {
		let products = JSON.parse(localStorage.getItem('list'));
		if (products) {
			addProducts();
		}
        const buyButton = document.getElementsByTagName('button')[0];
        buyButton.addEventListener('mouseover', function () {
            let products = JSON.parse(localStorage.getItem('list'));
            if (!products || products.length === 0) {
                buyButton.style.backgroundColor = "grey";
                buyButton.style.cursor = "not-allowed";
            }
        });
        buyButton.addEventListener('click', function (event) {
            let products = JSON.parse(localStorage.getItem('list'));
            if (!products || products.length === 0) {
                alert("Votre panier est vide.");
                event.preventDefault();
                return;
            } else {
                localStorage.removeItem('list');
                const list = document.getElementById('productList');
                list.innerHTML = "";
                alert("Merci pour votre achat !");
                event.preventDefault();
                return;
            }
        });
	} else {
		const buttons = document.getElementsByTagName('button');
		for (let i = 0; i < buttons.length; i++) {
			const button = buttons[i];
			button.addEventListener('click', function (event) {
				let article = event.target.parentElement.parentElement;
				let name = article.getElementsByTagName('h2')[0].innerHTML;
				let list = JSON.parse(localStorage.getItem('list'));
				if (!list) {
					list = [];
				}

				if (list.length > 0) {
					let product = list.find(product => product.name === name);
					if (product) {
						product.quantity++;
						localStorage.setItem('list', JSON.stringify(list));
						return;
					}
				}

				let price = article.getElementsByClassName('price')[0].innerHTML.split('€')[0];
				let image = article.getElementsByTagName('img')[0].src.split('/').pop().split('.')[0];
				let quantity = 1;
				let product = {
					name: name,
					price: price,
					image: image,
					quantity: quantity
				};

				list.push(product);
				localStorage.setItem('list', JSON.stringify(list));
			});
		}
	}
};

function totalPrice() {
	const total = document.getElementById('totalPrice');

	let list = JSON.parse(localStorage.getItem('list'));
	if (!list) {
		total.innerHTML = `Total: 0.00€`;
		return;
	}

	let price = 0;
	list.forEach(product => {
		price += product.price * product.quantity;
	});
	total.innerHTML = `Total: ${Math.round(100 * price) / 100}€`;
}

function addProducts() {
	let products = JSON.parse(localStorage.getItem('list'));
	for (let i = 0; i < products.length; i++) {
		let product = products[i];
		let index = i;

		const article = document.createElement('article');
		article.id = "article" + index;
		let listHTML = `
			<div>
				<input name="quantity" type="number" value="${product.quantity}" min="1" max="50">
				<img src="../images/${product.image}.png" alt="${product.name}">
				<h2>${product.name}</h2>
			</div>
			<div>
				<p class="price">${product.price}€</p>
				<div class="button">
					Supprimer
				</div>
			</div>`;

		const list = document.getElementById('productList');
		article.innerHTML = listHTML;
		list.appendChild(article);

		addListeners(product, index);

		totalPrice();
	}
};

function addListeners(product, index) {
	const article = document.getElementById("article" + index);
	const button = article.getElementsByClassName('button')[0];
	button.addEventListener('click', function () {
		article.remove();
		let list = JSON.parse(localStorage.getItem('list'));
		let index = list.findIndex(p => p.name === product.name);
		list.splice(index, 1);
		localStorage.setItem('list', JSON.stringify(list));
		totalPrice();
	});

	const input = article.getElementsByTagName('input')[0];
	const price = article.getElementsByClassName('price')[0];
	input.addEventListener('change', function () {
		let list = JSON.parse(localStorage.getItem('list'));
		let index = list.findIndex(p => p.name === product.name);
		list[index].quantity = input.value;
		price.innerHTML = `${Math.round(100 * product.price * input.value) / 100}€`;
		localStorage.setItem('list', JSON.stringify(list));
		totalPrice();
	});

	price.innerHTML = `${Math.round(100 * product.price * product.quantity) / 100}€`;
}