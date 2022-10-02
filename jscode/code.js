var blink = document.getElementById('blink');
setInterval(function () {
    blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
}, 500);


/* GO-TO-TOP BUTTON */
//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
/* GO-TO-TOP BUTTON */


/* Trying to remove the jotforms branding */
/* Wont work due to same-origin policy */
/* JS wont access inside a iframe */
// contactFormDiv = document.getElementById('contactForm')

// function noneFormFooter() {

//     formFooter = document.querySelector("body > div.formFooter");
//     console.log(contactFormDiv);
//     console.log(formFooter);
//     console.log(formFooter.style);
//     formFooter.style.display = "none"

// }


// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(noneFormFooter);

// const config = { attributes: true, childList: true, subtree: true };

// // Start observing the target node for configured mutations
// observer.observe(contactFormDiv, config);


/* These old jotforms allow custom CSS, i can change formFooter there itself */

// var doc = document.getElementsByTagName("iframe");
// doc = document.getElementsByTagName("iframe")[doc.length - 1].contentDocument;
// var footElem = doc.lastChild.lastChild
// var newStyle = document.createElement('style')
// newStyle.innerHTML = ".formFooter {display:none;}";
// footElem.insertBefore(newStyle, footElem.lastChild)

