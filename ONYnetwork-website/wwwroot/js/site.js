
/*1. changement de monnaie */
/* récupération des liens pour changer */

const moneyUse = document.getElementById("moneyUse");
const currencyEuro = document.getElementById("changeCurrencyEuro");
const currencyDollar = document.getElementById("changeCurrencyDollar");


/*ajout des events listener */

window.onload = moneyEuro();
currencyEuro.addEventListener("click", moneyEuro);
currencyDollar.addEventListener("click", moneyDol);

/* fonction pour modifer la monnaie */

function moneyEuro() {
    moneyUse.innerHTML = "la monnaie utiliser est l'Euro";
}
function moneyDol() {
    moneyUse.innerHTML = "la monnaie utiliser est le Dollar";
}

/*2. offre promo ouverture de la modale au chargement de la page */
/* récupération des liens pour ouvrir la modale */

const modalPromo = document.getElementById("modalPromo");

/*ajout des events listener*/

let myModal = new bootstrap.Modal(modalPromo, {});
//window.onload = openModale();

function openModale() {
    myModal.show();
};

// gestion du panier
// fonction de création du stockage local storage ou du chargement des anciens produit ajouter au panier

/* déclaration des variables */
let tabListeProd = [0];

/*ajout event listener*/
window.onload = creatStorage();
window.onload = recupBouton();

/* récupération des boutons et ajout des events listener */
function recupBouton() {
    //récupération des boutons d'ajout au panier
    let ajoutPanierProd = document.getElementsByClassName("ajoutPanierProd");
    // ajout des event listener aux boutons
    for (let i = 0; i < ajoutPanierProd.length; i++) {
        ajoutPanierProd[i].addEventListener("click", (event) => { ajoutPanier(event) });
    }
}

function creatStorage() {
    if (typeof localStorage != "undefined" && JSON) {
        if (localStorage.getItem("tabSave") == null) {
            localStorage.setItem("tabSave", JSON.stringify(tabListeProd));
        } else {
            let tabListeProd = JSON.parse(localStorage.getItem("tabSave"));
            for (i = 1; i < tabListeProd.length; i++) {
                let nomProd = tabListeProd[i][0];
                let descProduit = tabListeProd[i][1];
                let prixProduit = tabListeProd[i][2];
                let numIdProd = tabListeProd[i][3];
                insert(numIdProd, nomProd, descProduit, prixProduit);
            }
        }
    } else {
        alert("Le stockage sur votre PC n'a pu etre effectuer.")
    }
}

/*fonction d'insertion dans le DOM */


/*fonction insertion nouveau produit au panier */
function ajoutPanier(event) {
    //récupération du tableau dans le local storage
    let tabListeProd = JSON.parse(localStorage.getItem("tabSave"));

    //recupération du numéro de l'id
    let idBtn = event.target.id;
    let numIdProd = idBtn.substr(idBtn.length - 1);

    //boucle pour parcourir le tableau sauvegarder et trouver le produit
    for (let i = 1; i < tabListeProd.length; i++) {
        if (numIdProd === tabListeProd[i][3]) {

            //recupération de la quantité du produit
            let quantProdPasse = parseInt(tabListeProd[i][1]);
            // ajout d'un produit
            quantProdPasse = quantProdPasse + 1;

            // modification de la quantité dans le tableau
            tabListeProd[i][1] = quantProdPasse;

            //modification de la quantité dans l'html
            document.getElementById("quanProdPanier" + i).innerHTML = quantProdPasse;

            //stockage des modification dans localStorage
            localStorage.setItem("tabSave", JSON.stringify(tabListeProd));
            return;
        }
    }

    //recupération des données

    let tabProd = [];
    let nomProd = document.getElementById("nomProduit" + numIdProd).innerHTML;
    let decription = document.getElementById("quanProduit" + numIdProd).innerHTML;
    let prixProduit = document.getElementById("prixProduit" + numIdProd).innerHTML;

    //ajout dans un tableau des valeurs entrées
    tabProd.push(nomProd, decription, prixProduit, numIdProd);
    tabListeProd.push(tabProd);

    //utilisation de la fonction d'insertion
    insert(numIdProd, nomProd, decription, prixProduit);
    //stockage des modification dans localStorage
    localStorage.setItem("tabSave", JSON.stringify(tabListeProd));
}

/*fonction d'insertion dans le DOM*/
function insert(position, nomProd, decription, prixProduit) {
    /*insertion du texte dans html, j'ai utiliser "insertAdjacentHTML" plutôt que appendChild, 
    car je trouve cela plus lisible et manipulable. Je ne sais pas quelle méthode est la plus rapide en revanche*/
    document.getElementById("listePanier").insertAdjacentHTML("beforeend",
        `
    <li>
        <div name="produitPanierTemp" class="produitPanier">
            <div name="nomProdTemp" class="nomProd"> produits </div>
            <div name="quanTemp" class="quantProd"> quantité </div>
            <div name="plusTemp" class="ajoutProd"> + </div>
            <div name="moinsTemp" class="soutraireProd"> - </div>
            <div name="suppProd"> SUPP </div>
            <div name="prixTemp""> prix </div>
        </div>
    </li>
    `)

    //modification des éléments insérés
    //recupération des éléments par leur tagName
    document.getElementsByName("nomProdTemp")[0].innerHTML = nomProd;
    document.getElementsByName("quanTemp")[0].innerHTML = decription;
    document.getElementsByName("prixTemp")[0].innerHTML = prixProduit;

    //Ajout de l'ID aux éléments
    document.getElementsByName("produitPanierTemp")[0].setAttribute("id", "produitPanier" + position);
    document.getElementsByName("nomProdTemp")[0].setAttribute("id", "nomProdPanier"+position);
    document.getElementsByName("quanTemp")[0].setAttribute("id", "quanProdPanier" + position);
    document.getElementsByName("prixTemp")[0].setAttribute("id", "prixProdPanier" + position);
    document.getElementsByName("plusTemp")[0].setAttribute("id", "plusProdPanier" + position);
    document.getElementsByName("moinsTemp")[0].setAttribute("id", "moinsProdPanier" + position);
    document.getElementsByName("suppProd")[0].setAttribute("id", "suppProd" + position);

    //Ajout des adventlisterner
    document.getElementsByName("plusTemp")[0].addEventListener("click", ajout);
    document.getElementsByName("moinsTemp")[0].addEventListener("click", soustraction);
    document.getElementsByName("suppProd")[0].addEventListener("click", suppression);

    //Suppression de tagName qui ne sont plus utile
    document.getElementsByName("produitPanierTemp")[0].removeAttribute("name");
    document.getElementsByName("nomProdTemp")[0].removeAttribute("name");
    document.getElementsByName("quanTemp")[0].removeAttribute("name");
    document.getElementsByName("prixTemp")[0].removeAttribute("name");
    document.getElementsByName("plusTemp")[0].removeAttribute("name");
    document.getElementsByName("moinsTemp")[0].removeAttribute("name");
    document.getElementsByName("suppProd")[0].removeAttribute("name");
}

/* fonction ajout d'un produit avec le bouton plus */
function ajout(event) {
    //récupération du tableau dans le local storage
    let tabListeProd = JSON.parse(localStorage.getItem("tabSave"));

    //recupération des données
    let idBtn = event.target.id;
    let numIdProd = idBtn.substr(idBtn.length - 1);

    //boucle pour parcourir le tableau sauvegarder et trouver le produit
    for (let i = 1; i < tabListeProd.length; i++) {
        if (numIdProd === tabListeProd[i][3]) {
            let quantProdPasse = parseInt(tabListeProd[i][1]);
            // ajout d'un produit
            quantProdPasse = quantProdPasse + 1;
            // modification de la quantité dans le tableau
            tabListeProd[i][1] = quantProdPasse;

            //modification de la quantité dans l'html
            document.getElementById("quanProdPanier" + numIdProd).innerHTML = quantProdPasse;

            //stockage des modification dans localStorage
            localStorage.setItem("tabSave", JSON.stringify(tabListeProd));
        }
    }
}

/* fonction soustraction d'un produit avec le bouton moins */
function soustraction(event) {
    //récupération du tableau dans le local storage
    let tabListeProd = JSON.parse(localStorage.getItem("tabSave"));

    //recupération des données
    let idBtn = event.target.id;
    let numIdProd = idBtn.substr(idBtn.length - 1);

    //boucle pour parcourir le tableau sauvegarder et trouver le produit
    for (let i = 1; i < tabListeProd.length; i++) {
        if (numIdProd === tabListeProd[i][3]) {
            let quantProdPasse = parseInt(tabListeProd[i][1]);
            // soustraction d'un produit
            quantProdPasse = quantProdPasse - 1;

            //vérification qu'il reste au moins un produit
            if (quantProdPasse > 0) {
                // modification de la quantité dans le tableau
                tabListeProd[i][1] = quantProdPasse;

                //modification de la quantité dans l'html
                document.getElementById("quanProdPanier" + numIdProd).innerHTML = quantProdPasse;

                //stockage des modification dans localStorage
                localStorage.setItem("tabSave", JSON.stringify(tabListeProd));
            } else {
                suppression(event);
            }
        }
    }
}

/*fonction pour supprimer un produit*/
function suppression(event) {
    // récupération du tableau dans le localStorage
    let tabListeProd = JSON.parse(localStorage.getItem("tabSave"));

    // récuprétation de du numéro de l'id du bouton
    let idBtn = event.target.id;
    let numIdProd = idBtn.substr(idBtn.length - 1);
    // récupération de l'element a supprimer
    let produit = document.getElementById("produitPanier" + numIdProd);
    //suppression dans le DOM
    produit.remove();

    //recupération de l'élément à supprimer dans le tableau de sauvegarde
    for (let i = 1; i < tabListeProd.length; i++) {
        if (numIdProd === tabListeProd[i][3]) {
            tabListeProd.splice(i, 1);
        }
        localStorage.setItem("tabSave", JSON.stringify(tabListeProd));
    }
}


/*ajout de la fonctionalité de soulignement des liens dans la nav barre */


/* appel de la focntion d'ajout effet*/
window.onload = recupLien();

/* ajoute des event listener */
function recupLien() {
    //récupération des liens 
    let tabLien = document.getElementsByClassName("lien");
    // ajout des event listener aux boutons
    for (let i = 0; i < tabLien.length; i++) {
        tabLien[i].addEventListener("mouseover", (event) => { ajoutSoulignement(event) });
        tabLien[i].addEventListener("mouseleave", (event) => { supSoulignement(event) });
    }
}

/*déclaration des fonctions de suvole des liens*/
/* ajout du soulignement */
function ajoutSoulignement(event) {
    event.target.classList.add("lienSouligner");
}
/*suppression du soulignement */
function supSoulignement(event) {
    event.target.classList.remove("lienSouligner");
}


/* effet promotion*/
/*appel de la fonction au chargement*/
window.onload = () => { loop() };


function loop(finish) { 
    let time = 1500;
    let timeOut;
    animTexte(timeOut);
    timeOut = setTimeout(animTexte, time);
    time += time;
}

function animTexte(timeOut) {
    clearTimeout(timeOut);
    // récupération du text à animer
    let animationTexte = document.getElementById("animationTexte");
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