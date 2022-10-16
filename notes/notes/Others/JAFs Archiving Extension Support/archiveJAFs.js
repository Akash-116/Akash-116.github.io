


const JAFsURL = "https://campus.placements.iitb.ac.in/applicant/jobs"

var lastURL = "";


var allCompanyElements;
function buildCompanyElements() {
    allCompanyElements = document.querySelectorAll('mat-accordion mat-expansion-panel');
}
let allCompanyNames = [] // array to store company names
let allCompanyButtons = [] // array to store button dom elements

function getCompanyName(domElem) {
    // here domElement is mat-expansion-panel
    let companyName = domElem.querySelector('mat-expansion-panel-header > span > mat-panel-title > div > div > p.company-title')
    companyName = companyName.firstChild.nodeValue; //to get the company name string
    companyName = companyName.replace(/\s+/g, '') //remove all spaces
    return companyName
}

/* Build the allCompanyNames array */
function buildCompanyNames() {
    allCompanyNames = []
    allCompanyElements.forEach(element => {
        // console.log(getCompanyName(element));
        allCompanyNames.push(getCompanyName(element));
    });

}


/* Helper Functions to save and retreat the JAFs from localStorage */
const encodeDecodeSep = "###"
const localSaveKey = 'archivedJafs'

function encodeArrtoStr(arr) {
    let arrStr = arr.join(encodeDecodeSep);
    return arrStr
}
function decodeStrtoArr(arrStr) {
    let arr = arrStr.split(encodeDecodeSep);
    return arr
}

function encodeAndSave(arr) {
    const arrStr = encodeArrtoStr(arr);
    localStorage.setItem(localSaveKey, arrStr)
}

function fetchAndDecode() {
    const arrStr = localStorage.getItem(localSaveKey);
    if (arrStr === null) {
        arr = []
    } else {
        arr = decodeStrtoArr(arrStr)
    }
    return arr
}
/* Helper Functions Completed */


function onArchClick(companyName) {
    archList = fetchAndDecode();
    buildCompanyElements();
    buildCompanyNames();


    if (archList.includes(companyName)) {
        /* unarchive the JAF */
        // Remove .ignore-entry from class of company
        companyIdx = allCompanyNames.indexOf(companyName)
        if (companyIdx > -1) {
            elem = allCompanyElements[companyIdx]
            elem.classList.remove('ignore-entry')
            elem.classList.add('dont-ignore-entry')
        }

        // Update localStorage
        const index = archList.indexOf(companyName);
        if (index > -1) { // only splice array when item is found
            archList.splice(index, 1); // 2nd parameter means remove one item only
        }

        encodeAndSave(archList)
        console.log("UN-archived : " + companyName);
    } else {
        /* Archive the company */

        // Add .ignore-entry to elem class
        companyIdx = allCompanyNames.indexOf(companyName)
        if (companyIdx > -1) {
            elem = allCompanyElements[companyIdx]
            elem.classList.add('ignore-entry')
            elem.classList.remove('dont-ignore-entry')
        }

        // Update localStorage
        archList.push(companyName)
        encodeAndSave(archList)
        console.log("Archived    : " + companyName);
    }
    setupArchEntries()

}

/* Create allCompanyButtons for each companyElement */
const archiveBtn = '<mat-icon _ngcontent-bro-c361="" role="img" matsuffix="" class="mat-icon notranslate material-icons mat-icon-no-color" style="color: blue;" aria-hidden="true" data-mat-icon-type="font">archive</mat-icon>'
function createAddButtons() {

    allCompanyNames.forEach(name => {
        button = document.createElement("button");
        button.innerHTML = archiveBtn;
        button.type = 'button'
        button.classList.add("btn"); // bootstrap-5 classes
        button.classList.add("btn-archive-company");
        // button.classList.add("btn-info");

        button.addEventListener("click", function (e) {
            onArchClick(name);
            e.stopPropagation();
        });

        allCompanyButtons.push(button);
    });

    /* Add arch button for each company element */
    for (let i = 0; i < allCompanyElements.length; i++) {
        element = allCompanyElements[i];
        button = allCompanyButtons[i];
        element = element.querySelector('mat-expansion-panel-header');
        // element.appendChild(button);

        element.insertBefore(button, element.firstChild);
    }
}


// window.onload = function () {
//     console.log('DOM fully loaded and parsed');
// };

// window.addEventListener('DOMContentLoaded', (event) => {
//     console.log('DOM fully loaded and parsed');
//     buildCompanyElements();
//     buildCompanyNames();
//     createAddButtons();
//     setupArchEntries();
// });


let toggleState = 0;
let archiveEnabled = 0;
let univViewEnabled = 1;
let univViewToggleBtn = 0;

function addViewToggle() {
    if (univViewToggleBtn === 1) {
        // window.alert("Archive already enabled");
        return;
    }
    let mainBodyElem = document.querySelectorAll("body")[0];
    console.log(mainBodyElem);
    // let newDiv = document.createElement('div')
    // newDiv.id = "viewToggleButton"
    // parent1cmpy = mainBodyElem.parentNode;
    // parent1cmpy.insertBefore(newDiv, mainBodyElem.nextElementSibling);

    // newDiv.innerHTML = "WAIT for 6 seconds to get archive options";

    let button = document.createElement('button');
    button.innerHTML = "Toggle Archived Display";
    button.type = 'button'
    button.classList.add("btn"); // bootstrap-5 classes
    button.classList.add("btn-success");
    button.classList.add("ml-5");
    button.classList.add("toggle-archived-display")

    button.addEventListener("click", function () {
        univViewEnabled = 1 - univViewEnabled;
        console.log('BUILDING COMPANY ELEMENTS');
        buildCompanyElements();
        console.log('BUILDING COMP NAMES');
        buildCompanyNames();
        console.log('SETUP ARCH ENTRIES');
        setupArchEntries();
        // toggleViewArch();

    });

    mainBodyElem.insertBefore(button, document.getElementsByClassName('archive-disable-btn')[0].nextSibling);
    univViewToggleBtn = 1;
}

function detArchiveState() {
    let arcBtnsCompany = document.getElementsByClassName("btn-archive-company")
    if (arcBtnsCompany.length > 0) { return 1; }
    else { return 0; }
}

let UnivArchEnabled = 0

function attachMutationObservers() {

    if (UnivArchEnabled === 1) {
        window.alert("Archive already enabled");
        return;
    }
    initAll();
    let impElems = document.getElementsByTagName('mat-tab-body')

    Array.from(impElems).forEach(elementFocus => {
        console.log("elementFocus is :");
        console.log(elementFocus);
        // attach a mutation to the mat-tab-body eleent passed

        const observer = new MutationObserver(() => {
            console.log("Mutation observer is called");
            initAll();
        })

        observer.observe(elementFocus, { subtree: true, childList: true });
    });

    UnivArchEnabled = 1;
}


// Setup when the page loads
function setupArchEntries() {
    archList = fetchAndDecode()

    /* Over saferty? 
        > Took care of calling these two everytime
    */
    // console.log('BUILDING COMPANY ELEMENTS');
    // buildCompanyElements();
    // console.log('BUILDING COMP NAMES');
    // buildCompanyNames();

    // console.log(archList);
    if (univViewEnabled === 1) {
        viewBtn = document.getElementsByClassName('toggle-archived-display')
        if (viewBtn.length > 0) {
            viewBtn = viewBtn[0];
            viewBtn.classList.add("btn-success")
            viewBtn.classList.remove("btn-danger")
        }

    } else {
        // view is disabled
        viewBtn = document.getElementsByClassName('toggle-archived-display')
        if (viewBtn.length > 0) {
            viewBtn = viewBtn[0];
            viewBtn.classList.remove("btn-success")
            viewBtn.classList.add("btn-danger")
        }

    }

    allCompanyNames.forEach(name => {
        companyIdx = allCompanyNames.indexOf(name)
        if (companyIdx > -1) {
            // company with given name exists
            elem = allCompanyElements[companyIdx]
            elemBiggerElem = elem.closest('div.ng-star-inserted')
            // console.log(name);
            // console.log(companyIdx);
            // console.log(elem);
            if (archList.includes(name)) {
                elem.classList.add('ignore-entry')
                if (univViewEnabled === 1) {
                    elemBiggerElem.classList.remove('ignore-entry-invisible')
                } else {
                    elemBiggerElem.classList.add('ignore-entry-invisible')
                }
                elem.classList.remove('dont-ignore-entry')
            } else {
                elem.classList.add('dont-ignore-entry')
                elem.classList.remove('ignore-entry')
                elemBiggerElem.classList.remove('ignore-entry-invisible')

            }
        }
    });

}

function initAll() {
    /* Reset state */
    allCompanyElements = []
    allCompanyButtons = []
    allCompanyNames = []

    archiveEnabled = detArchiveState();
    if (archiveEnabled === 1) {
        console.log('BUILDING COMPANY ELEMENTS');
        buildCompanyElements();
        console.log('BUILDING COMP NAMES');
        buildCompanyNames();
        console.log('SETUP ARCH ENTRIES');
        setupArchEntries();
        // window.alert("Archives already enabled!")
        return;
    }


    console.log('BUILDING COMPANY ELEMENTS');
    buildCompanyElements();
    console.log('BUILDING COMP NAMES');
    buildCompanyNames();
    console.log('CREATING ADD BUTTONS');
    createAddButtons();
    console.log('SETUP ARCH ENTRIES');
    setupArchEntries();
    console.log('');
    // addViewToggle();
    archiveEnabled = 1

    // attachMutationObserver(allCompanyElements[0].closest('mat-tab-body'));
}

// initAll();


function setMatBtns() {
    console.log("SetMatBtns() called successfully");
    let matTables = document.querySelectorAll('body')
    // console.log(matTables)

    Array.from(matTables).forEach(matTab => {
        let button = document.createElement('button');
        button.innerHTML = " Enable-Archive";
        button.type = 'button'
        button.classList.add("archive-toggle-btn");
        button.classList.add("btn"); // bootstrap-5 classes
        button.classList.add("btn-info");
        button.classList.add("ml-5");

        button.addEventListener("click", function () {
            attachMutationObservers();
            addViewToggle();
        });

        let button2 = document.createElement('button');
        button2.innerHTML = " Disable-Archive";
        button2.type = 'button'
        button2.classList.add("archive-disable-btn");
        button2.classList.add("btn"); // bootstrap-5 classes
        button2.classList.add("btn-info");
        button2.classList.add("ml-5");

        button2.addEventListener("click", function () {
            location.reload();
        });

        matTab.insertBefore(button2, matTab.firstChild.nextSibling);
        matTab.insertBefore(button, matTab.firstChild.nextSibling);
        // matTab.appendChild(button2);

    })
}


function FinalInit() {

    new MutationObserver(() => {
        const url = location.href;
        if((url !== lastURL)){
            if((lastURL === JAFsURL ) && (url !== JAFsURL) ){
                // reload window
                location.reload();
            }else if((lastURL !== JAFsURL) && (url === JAFsURL)){
                // Enable jafs
                setMatBtns();
            }

            lastURL = url;
        }
      }).observe(document, {subtree: true, childList: true});

}


if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    FinalInit();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        FinalInit();
    });
}
