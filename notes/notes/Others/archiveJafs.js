



allCompanyElements = document.querySelectorAll('mat-accordion mat-expansion-panel');

function getCompanyName(domElem) {
    // here domElement is mat-expansion-panel
    let companyName = domElem.querySelector('mat-expansion-panel-header > span > mat-panel-title > div > div > p.company-title')
    companyName = companyName.firstChild.nodeValue; //to get the company name string
    companyName = companyName.replace(/\s+/g, '') //remove all spaces
    return companyName
}

allCompanyNames = [] // array to store company names
allCompanyButtons = [] // array to store button dom elements

/* Build the allCompanyNames array */
allCompanyElements.forEach(element => {
    console.log(getCompanyName(element));
    allCompanyNames.push(getCompanyName(element));
});


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

    if (archList.includes(companyName)) {
        /* unarchive the JAF */
        // Remove .ignore-entry from class of company
        companyIdx = allCompanyNames.indexOf(companyName)
        if (companyIdx > -1) {
            elem = allCompanyElements[companyIdx]
            elem.classList.remove('ignore-entry')
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
        }

        // Update localStorage
        archList.push(companyName)
        encodeAndSave(archList)
        console.log("Archived    : " + companyName);
    }
}

/* Create allCompanyButtons for each companyElement */
const archiveBtn = '<mat-icon _ngcontent-bro-c361="" role="img" matsuffix="" class="mat-icon notranslate material-icons mat-icon-no-color" style="color: blue;" aria-hidden="true" data-mat-icon-type="font">archive</mat-icon>'
allCompanyNames.forEach(name => {
    button = document.createElement("button");
    button.innerHTML = archiveBtn;
    button.type = 'button'
    button.classList.add("btn"); // bootstrap-5 classes
    // button.classList.add("btn-info");

    button.addEventListener("click", function () {
        onArchClick(name);
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

// Setup when the page loads
function setupArchEntries() {
    archList = fetchAndDecode()

    const akashStr = encodeArrtoStr(archList)
    console.log(akashStr);
    console.log(decodeStrtoArr(akashStr));


    archList.forEach(name => {
        companyIdx = allCompanyNames.indexOf(name)
        if (companyIdx > -1) {
            // company with given name exists
            elem = allCompanyElements[companyIdx]
            elem.classList.add('ignore-entry')
        }
    });

}

setupArchEntries();