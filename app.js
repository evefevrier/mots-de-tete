/** WORDLE version TIMCSF
 *  à la suite du "bonhomme pendu" de Michelle Decorte... ;)
 * @author Ève Février, efevrier@csfoy.ca
 * @todo DES TONNES d'améliorations possibles... FAITES VOS SUGGESTIONS!!!
 * (0) optimiser l'algorithme!
 * (1) ajouter des niveaux de difficultés selon la liste utilisée (faire une liste facile avec des mots très courants...)
 * (2) ajouter un bouton aide qui fournit un indice pour chaque mot (modifier en conséquence la structure de données)
 * (3) ajouter des animations de transition lorsqu'on Rejoue
 * */

function afficherCacher(strId, blnIsHidden){
    document.getElementById(strId).hidden = blnIsHidden;
}

let wordle = {
    strMotHasard: null,
    intNombreEssai: 0,
    getMotAleatoire: async function () {
        try {
            const response = await fetch("https://api.dicolink.com/v1/mots/motauhasard?avecdef=true&minlong=5&maxlong=5&verbeconjugue=false&api_key=vIZN5M213LnPy5M8isceExH5sYNBg35h");
            const data = await response.json();
            this.strMotHasard = data[0].mot;
            console.log(this.strMotHasard);
        } catch (error) {
            console.error("Erreur lors de la récupération du mot aléatoire :", error);
        }
    },
    pigerMot: async function () {
        document.getElementById("btnJouer").className = "";
        document.getElementById("btnJouer").disabled = true; 
        afficherCacher("etape2", false);
         
        await this.getMotAleatoire();
        
        document.getElementById("consigne").innerText = "Vous avez 6 essais pour deviner le mot de 5 lettres"
        document.getElementById("consigne").className = "animate animate__pulse";
    },
    evaluerMot: function (strMotAEvaluer) {
        strMotAEvaluer = strMotAEvaluer.toLowerCase();
        // réinitialiser le message et vider le champ de saisie
        let strMessage = "&nbsp;";
        document.getElementById("champMot").value = ""

        if (strMotAEvaluer != "" && this.intNombreEssai < 6) {
            this.intNombreEssai += 1;
            // Mettre à jour le témoin
            document.getElementById("nombreEssai").innerHTML = "Essai numéro: <strong>" + this
                .intNombreEssai + "</strong>";
            // boucler sur le mot à évaluer pour examiner chaque lettre
            for (let intCpt = 0; intCpt < strMotAEvaluer.length; intCpt++) {
                // Littéraux de gabarit pour un sélecteur complexe
                // console.log(`#mot${this.intNombreEssai} span:nth-of-type(${intCpt+1})`);
                let tagSpan = document.querySelector(
                    `#mot${this.intNombreEssai} span:nth-of-type(${intCpt+1})`);
                let strLettre = strMotAEvaluer.charAt(intCpt);
                tagSpan.innerText = strLettre;
                // pour chaque lettre du mot vérifier si la lettre existe dans le mot
                // //  si elle est au bon endroit c'est vert
                // //  sinon c'est jaune
                // sinon c'est gris
                if (this.strMotHasard.indexOf(strLettre) != -1) {
                    if (strMotAEvaluer.charAt(intCpt) == this.strMotHasard.charAt(intCpt)) {
                        tagSpan.className = "vert";
                    } else {
                        tagSpan.className = "jaune";
                    }
                } else {
                    tagSpan.className = "gris";

                }

            }
            // donner une rétroaction
            if (strMotAEvaluer == this.strMotHasard) {
                strMessage = "Bravo vous avez réussi!"; 
                console.log()
            } else {
                if (this.intNombreEssai == 6) {
                    strMessage = "SCROGNEUGNEU! iel est désolé(e), le mot était: " + this.strMotHasard;
                 
                }
            }
            if (strMessage != "&nbsp;") {
                document.getElementById("btnReset").disabled = false;
                document.getElementById("btnReset").className = "animate animate__jello";
            }
            document.getElementById("message").innerHTML = strMessage;

        }
    },
    reset: function () {
        // Vider (ou presque) le paragraphe de message; 
        // l'espace insécable &nbsp; permet de conserver le display block de l'élément vide
        document.getElementById("message").innerHTML = "&nbsp;";
        // Effacer tous les essais du jeu précédent
        let arrSpan = document.querySelectorAll(".mot span");
        for (let intCpt = 0; intCpt < arrSpan.length; intCpt++) {
            arrSpan[intCpt].innerText = "_";
            arrSpan[intCpt].className = "";
        }
        document.getElementById("nombreEssai").innerText = ""
        document.getElementById("consigne").className = "";
        this.intNombreEssai = 0; 

        // Gérer l'état des boutons
        document.getElementById("btnJouer").className = "animate animate__jello";
        document.getElementById("btnJouer").disabled = false; 
        document.getElementById("btnReset").disabled = true;
        document.getElementById("btnReset").className = ""; 
        afficherCacher("etape2", true);
    }

};

// utiliser DOMContentLoaded plutôt que load
// https://developer.mozilla.org/fr/docs/Web/API/Window/DOMContentLoaded_event
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnJouer").className = "animate animate__jello";
})
document.getElementById("btnJouer").addEventListener("click", function () {
    wordle.pigerMot();
})
document.getElementById("btnEvaluer").addEventListener("click", function () {
    let strMot = document.getElementById("champMot").value;
    wordle.evaluerMot(strMot);
})
document.getElementById("btnReset").addEventListener("click", function () {
    wordle.reset();
})
// choix de remplacer <form> par div.form plutôt que:
/* document.getElementById("champMot").addEventListener("keyup", function(objEvenement){
    if(objEvenement.key == "Enter"){
        objEvenement.preventDefault();
    }
}) */
 