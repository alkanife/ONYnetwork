//
// CHARGEMENT DE LA PAGE
//
window.onload = () => {
    retrieveCookies(); // on récupère les cookies

    updateTotalItems(); // On met à jour le nombre d'articles dans le panier
    updateBagBadge(); // On met à jour le badge de l'icone du papier
    updateBagModal(); // On met à jour le modal du panier
    updateItemsButtons();

    loop();
}


//
// UTILS
//
// Fonction pour ouvrir une modale Bootstrap
function openBootModal(modal) {
    new bootstrap.Modal(document.getElementById(modal), {}).show();
}


//
// TOGGLE .FR ET .EU
//
function changeDomain(choice, cookie) {
    if (choice === null)
        return;

    document.getElementById('domainExtension').innerText = choice;

    if (cookie)
        localStorage.setItem('lastSelectedDomain', choice)
}


//
// TOGGLE MONNAIE
//
let currencyButton = document.getElementById('currency');
let currentCurrency = '€ EUR' // euro de base

/* fonction pour modifer la monnaie */
function changeCurrency(choice, cookie) {
    if (choice === null)
        return;

    updateCurrencyFor('Cloud', 3, currencyToSymbol(currentCurrency), currencyToSymbol(choice))
    updateCurrencyFor('Web', 3, currencyToSymbol(currentCurrency), currencyToSymbol(choice))
    currencyButton.innerText = choice;
    currentCurrency = choice;
    updateBagModal();

    if (cookie)
        localStorage.setItem('lastCurrency', choice)
}

// Mettre à jour la monnaie pour une catégorie en particulier
function updateCurrencyFor(category, max, from, to) {
    for (let i = 1; i < (max+1); i++) {
        let priceTag = document.getElementById('price' + category + i);
        priceTag.innerText = priceTag.innerText.replaceAll(from, to)
    }
}

// garde uniquement le symbole de la monnaie
// '$ USD' ==> '$'
function currencyToSymbol(currency) {
    return currency.split(' ')[0];
}


//
// PANIER
//
let items = new Map();
let totalItems = 0;

// Met à jour le badge du panier
function updateBagBadge() {
    document.getElementById('bagBadge').innerText = ''+totalItems;
}

// Calcul le prix total du panier
function getTotalPrice() {
    let t = 0;

    items.forEach((value, key, map) => {
        t += value.price * value.quantity;
    })

    return t;
}

// Met à jour le modal du panier
function updateBagModal() {
    const bagBody = document.getElementById('bagBody');
    const nextStep = document.getElementById('nextStep');

    // Si il n'y a rien, on masque le bouton et on affiche un message
    if (items.size === 0) {
        nextStep.style.display = 'none';
        bagBody.innerHTML = 'Panier vide !'
    } else {
        // Sinon on contruit le contenu du modal
        nextStep.style.display = 'block';
        bagBody.innerHTML = '';
        items.forEach((value, key, map) => {
            /*insertion du texte dans html, j'ai utiliser "insertAdjacentHTML" plutôt que appendChild,
            car je trouve cela plus lisible et manipulable. Je ne sais pas quelle méthode est la plus rapide en revanche*/

            let price = value.price + currencyToSymbol(currentCurrency);

            bagBody.insertAdjacentHTML('beforeend', `
                <div class="row d-flex justify-content-between align-items-center">
                    <h5 class="text-black mb-0">${value.name}</h5>
                    <div class="col-4 col-sm-4">
                      <p class="d-none d-sm-block" style="margin-bottom: 5px">Prix unitaire : ${price}</p>
                      
                      <p class="d-block d-sm-none" style="margin-bottom: 5px">${price}/unité</p>
                    </div>
                    
                    <div class="col-4 col-sm-3 text-center">
                        <h5 class="mb-0">
                            <a href="#nu" class="bagItemQuantitySelector" onclick="removeFromBag('${key}', 1)">-</a>
                            <span class="bagItemQuantity">${value.quantity}</span>
                            <a href="#nu" class="bagItemQuantitySelector" onclick="addToBag(document.getElementById('${'addBag'+key}'), '${key}')">+</a>
                        </h5>
                    </div>
                    
                    <div class="col-3 col-sm-3">
                      <h5 class="mb-0">${value.price * value.quantity + currencyToSymbol(currentCurrency)}</h5>
                    </div>
                </div>
                <a href="#nuu" onclick="removeFromBag('${key}', 0)" class="delete-from-bag">Supprimer du panier</a>  
                <hr>
            `);
        })

        // Ajout total
        bagBody.insertAdjacentHTML('beforeend', `
            <div class="row mb-4 d-flex justify-content-between align-items-center">
                <div class="col-8 col-md-4">
                  <h5 class="text-black mb-0">Total TTC</h5>
                </div>
                
                <div class="col-3 col-sm-3">
                  <h5 class="mb-0">${getTotalPrice() + currencyToSymbol(currentCurrency)}</h5>
                </div>
            </div>
        `);
    }

}

// quantité d'articles (tout y comporis quantité)
function updateTotalItems() {
    let t = 0;

    items.forEach((value, key, map) => {
        t += value.quantity;
    })

    totalItems = t;
}

// Mise à jour du bouton quand on clique sur un article
function updateButton(addButton, quantity) {
    if (quantity === 0) {
        addButton.className.replaceAll('btn-added', '');
        addButton.innerText = 'Ajouter au panier';
        return;
    }

    if (!addButton.className.includes('btn-added')) {
        addButton.className = addButton.className += ' btn-added';
    }

    addButton.innerText = 'Ajouté (' + quantity + ')';

    console.log(addButton.parent)
}

// Mettre à jour tous les boutons
function updateItemsButtons() {
    items.forEach((value, key, map) => {
        updateButton(document.getElementById('addBag' + key), value.quantity);
    })
}

// Ajouter un article au panier
function addToBag(addButton, product) {
    let itemName = document.getElementById('name' + product).innerText;
    let itemPrice = document.getElementById('price' + product).innerText.replaceAll(currencyToSymbol(currentCurrency), '').split(' ')[3];

    if (items.has(product)) {
        let prod = items.get(product);

        if (prod.quantity >= 10)
            return;

        prod.quantity++;
        updateButton(addButton, prod.quantity)
    } else {
        items.set(product, {
            name: itemName,
            price: itemPrice,
            quantity: 1
        })
        updateButton(addButton, 1)
    }

    updateTotalItems();
    updateBagBadge();
    updateBagModal();
    updateBagCookie();
}

// Retirer un article du panier
function removeFromBag(product, quantity) {
    if (quantity === 0) {
        items.delete(product)
    } else {
        let prod = items.get(product);
        let newQuantity = prod.quantity - quantity;

        if (newQuantity <= 0)
            return;

        prod.quantity = newQuantity;
    }

    updateButton(document.getElementById('addBag' + product), quantity);

    updateTotalItems();
    updateBagBadge();
    updateBagModal();
    updateBagCookie();
}

// Mettre à jour le local storage avec le panier
function updateBagCookie() {
    localStorage.setItem('cart', JSON.stringify(Object.fromEntries(items)));
}



//
// LOCAL STORAGE
//
function retrieveCookies() {
    // retrouver domaine
    changeDomain(localStorage.getItem('lastSelectedDomain'), false)

    // retrouver dernière monnaie
    changeCurrency(localStorage.getItem('lastCurrency'), false)

    // retrouver panier
    let storedCart = localStorage.getItem('cart');

    if (storedCart !== null) {
        items = new Map(Object.entries(JSON.parse(storedCart)))
    }

    // offre promo s'affiche qu'une fois
    if (localStorage.getItem('ad') === null) {
        openBootModal('modalPromo');
        localStorage.setItem('ad', "true")
    }
}

/* effet promotion*/
/*appel de la fonction au chargement*/
function loop(finish) {
    let time = 5000;
    let timeOut;
    animTexte(timeOut);
    timeOut = setTimeout(animTexte, time);
    time += time;
}
let x=1.
function animTexte(timeOut) {
    x++;
    clearTimeout(timeOut);
    // récupération du text à animer
    let animationTexte = document.getElementById("promoLink");
    //ajout de la classe visible
    animationTexte.classList.add("visibility");

    //création du délai d'affichage des lettres
    let delay = 200;
    // création du délais de commencement
    let delay_start = 2;
    //déclaration des variables utile à la fonction
    let contents;
    let letters;

    // ajout des lettres composent le message dans un tableau
    contents = animationTexte.textContent.trim();
    animationTexte.textContent = "";
    letters = contents.split("");

    //application pour toutes les tettres du tableau récupéré
    letters.forEach(function (letter, index) {
        // creation du minuteur de l'affichage
        setTimeout(function () {
            animationTexte.textContent += letter;
        }, delay_start + delay * index);
    });
    delay_start += delay * letters.length;
}