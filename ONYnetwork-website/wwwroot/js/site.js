
//1. changement de monnaie
// récupération des liens pour changer

const moneyUse = document.getElementById("moneyUse");
const currencyEuro = document.getElementById("changeCurrencyEuro");
const currencyDollar = document.getElementById("changeCurrencyDollar");


//ajout des events listener

window.onload = moneyEuro();
currencyEuro.addEventListener("click", moneyEuro);
currencyDollar.addEventListener("click", moneyDol);


// fonction pour modifer la monnaie

function moneyEuro() {
    moneyUse.innerHTML = "la monnaie utiliser est l'Euro";
}
function moneyDol() {
    moneyUse.innerHTML = "la monnaie utiliser est le Dollar";
}

//2. offre promo ouverture de la modale au chargement de la page
// récupération des liens pour ouvrir la modale

const modalPromo = document.getElementById("modalPromo");

//ajout des events listener

window.onload = modalPromo;
function ouvertureModale() {
    modalPromo.modal('show')
}
var myModal = new bootstrap.Modal(modalPromo, {});
document.onreadystatechange = function () {
    myModal.show();
};