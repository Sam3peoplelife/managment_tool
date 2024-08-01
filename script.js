const products = {
    "Nuggets4": 1,
    "Nuggets6": 1.2,
    "Nuggets9": 1.3,
    "Nuggets20": 2.4,
    "Hamb": 3,
    "Cheese": 3.6,
    "Dbl Cheese": 4.7,
    "Dbl Cheese Bcn": 4.9,
    "Big Mac": 5.2,
    "Big Tasty" : 5.6
};

const coefficient = 0.5;

document.getElementById('addProduct').addEventListener('click', () => {
    const productContainer = document.createElement('div');
    productContainer.classList.add('product-container');

    const select = document.createElement('select');
    for (let product in products) {
        const option = document.createElement('option');
        option.value = product;
        option.text = product;
        select.appendChild(option);
    }

    const input = document.createElement('input');
    input.type = 'number';
    input.value = 1;
    input.min = 1;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('button-primary');
    deleteButton.addEventListener('click', () => {
        productContainer.remove();
    });

    productContainer.appendChild(select);
    productContainer.appendChild(input);
    productContainer.appendChild(deleteButton);
    document.getElementById('productsContainer').appendChild(productContainer);
});

document.getElementById('uploadOrder').addEventListener('click', () => {
    const productsContainer = document.getElementById('productsContainer');
    const productContainers = productsContainer.getElementsByClassName('product-container');

    let order = [];
    for (let productContainer of productContainers) {
        const select = productContainer.getElementsByTagName('select')[0];
        const input = productContainer.getElementsByTagName('input')[0];
        order.push({ name: select.value, quantity: parseInt(input.value) });
    }

    productsContainer.innerHTML = '';
    placeOrder(order);
});

function calculateComplexity(order) {
    return order.reduce((total, product) => total + products[product.name] * product.quantity, 0);
}

function placeOrder(order) {
    const complexity = calculateComplexity(order);
    const lines = [
        { element: document.getElementById('line1'), orders: 3, speed: 10, people: parseInt(document.getElementById('people1').value), active: document.getElementById('active1').checked },
        { element: document.getElementById('line2'), orders: 2, speed: 4, people: parseInt(document.getElementById('people2').value), active: document.getElementById('active2').checked },
        { element: document.getElementById('line3'), orders: 0, speed: 0, people: parseInt(document.getElementById('people3').value), active: document.getElementById('active3').checked }
    ];

    const activeLines = lines.filter(line => line.active);
    const calculations = activeLines.map(line => (complexity * line.orders * coefficient) / ((line.speed * line.people)));
    const minCalculation = Math.min(...calculations);
    const selectedLine = activeLines[calculations.indexOf(minCalculation)];

    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');
    orderDiv.textContent = `Order: ${JSON.stringify(order)} - Complexity: ${complexity}`;

    const doneButton = document.createElement('button');
    doneButton.textContent = 'Done';
    doneButton.addEventListener('click', () => {
        selectedLine.orders -= 1;
        orderDiv.remove();
        updateLineInfo(selectedLine);
    });

    orderDiv.appendChild(doneButton);
    selectedLine.element.querySelector('.orders').appendChild(orderDiv);
    updateLineInfo(selectedLine);
}

function updateLineInfo(line) {
    if (line.orders <= 0) {
        line.element.classList.add('inactive');
        line.element.querySelector('input[type=checkbox]').checked = false;
    } else {
        line.element.classList.remove('inactive');
        line.element.querySelector('input[type=checkbox]').checked = true;
    }
}
