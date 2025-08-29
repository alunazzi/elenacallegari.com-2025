// NAVBAR MANAGER ///////////////////////////////////////////////////////////////////////
const navToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.primary-navigation');

navToggle.addEventListener('click', () => {
  primaryNav.hasAttribute('data-visible') 
    ? navToggle.setAttribute('aria-expanded', false)
    : navToggle.setAttribute('aria-expanded', true);
  primaryNav.toggleAttribute('data-visible');
})



// THEME SWITCHER ///////////////////////////////////////////////////////////////////////
let theme = localStorage.getItem('theme');
const btnSwitch = document.querySelector("#btn-switch");
const themeswitcherbtn = document.querySelector('#img-themeswitcher');
const logoNavbar = document.querySelector("#logo-navbar");
const logoFooter = document.querySelector("#logo-footer");

// theme switch logic
const switchTheme = () => {
  // console.log("pressed");
  theme = localStorage.getItem('theme');
  // if the variable does not exist force the value for the light theme (firefox fix)
  if (theme === null) {   // BEGIN: firefox fix
    theme = 'light';
  }   // END: firefox fix
  if (theme === 'light') {
    activateDarkTheme();
    // console.log("Activate DARK");
  } else if (theme === 'dark'){
    activateLightTheme();
    // console.log("Activate LIGHT");
  }
}

// steps to activate the dark theme
const activateDarkTheme = () => {
  localStorage.setItem('theme', 'dark')
  themeswitcherbtn.src = 'images/sun.png';
  document.documentElement.setAttribute('data-theme', 'dark');
}

// steps to activate the light theme
const activateLightTheme = () => {
  localStorage.setItem('theme', 'light')
  themeswitcherbtn.src = 'images/moon.png';
  document.documentElement.setAttribute('data-theme', 'light');
}

// if the active theme is the dark one, then activate it on page load
if (theme === 'dark') {
  activateDarkTheme();
}

// event handler for the button
btnSwitch.addEventListener('click', switchTheme);



// TYPEWRITE FUNTION ////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const hasVisited = localStorage.getItem('hasVisited');
  const image = document.querySelector('.hero-image');
  const headers = document.querySelectorAll('.typewriter');
  const bioWrapper = document.querySelector('.elena-callegari-bio');
  const bio = document.createElement('p');
  bio.className = 'bio';
  bioWrapper.appendChild(bio);

  const bioContent = [
    'I am an <strong>Italian linguist based in Reykjavík</strong>, Iceland.<br>',
    'I have a Ph.D. in Linguistics (Syntax - Pragmatics interface) from the <strong>University of Oslo</strong>, an MA in Psycholinguistics from <strong>Utrecht University</strong> (Netherlands) and a BA in Language Sciences from Ca\' Foscari <strong>University of Venice</strong> (Italy).<br>',
    'At the moment I am working as a postdoctoral researcher in Language and Technology at the University of Iceland. My main focus is <strong>developing software that can automatically detect dementia</strong> based on how an individual speaks.<br>',
    'I am also the <strong>co-founder of SageWrite, an Icelandic startup</strong> that is developing text-generation tools for academic writing using deep learning. SageWrite was born in late 2021 and we currently have 5 permanent staff in our team.<br>',
    'In 2023, I won a Horizon-2020 <strong>Women TechEU grant</strong>, which is a grant for women that have founded deep-tech startups in Europe. This is the <strong>first time an applicant from Iceland ever wins this grant</strong>!<br>',
    'Some of the topics I am interested in are <strong>word order variation in the left periphery,</strong> topicalization in Romance and Germanic languages, focus particles in Mande and Slavic languages, <strong>natural language generation</strong> and transformers, clinical applications of NLP, and <strong>modeling the complexity</strong> found in human languages.<br>',
    'Outside of linguistics I am also interested in politics, astronomy, complexity science and science fiction.'
    ];

  if (hasVisited) {
    // Skip animations — show static content
    image.classList.add('visible');
    headers.forEach(el => {
      el.classList.add('visible');
      // Optional: If headers have static text, you can set it directly
      // el.textContent = el.dataset.staticText || el.textContent;
    });
    bio.classList.add('visible');
    bio.innerHTML = bioContent.join('');
    return;
  }

  // First-time visitor — run animations
  localStorage.setItem('hasVisited', 'true');

  async function typeWriter(el, speed) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    const nodes = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode);

    const texts = nodes.map(n => n.textContent);
    nodes.forEach(n => n.textContent = '');

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const text = texts[i];
      for (let j = 0; j < text.length; j++) {
        node.textContent += text[j];
        await new Promise(res => setTimeout(res, speed));
      }
    }

    cursor.remove();
  }

  async function revealBio(contentArray, el, speed = 20) {
    el.classList.add('visible');

    for (const line of contentArray) {
      const temp = document.createElement('div');
      temp.innerHTML = line;

      const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      for (const node of textNodes) {
        const words = node.textContent.split(/(\s+)/);
        for (const word of words) {
          if (word.trim() === '') {
            el.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement('span');
            span.textContent = word;
            span.classList.add('word');
            el.appendChild(span);
            await new Promise(res => setTimeout(res, speed));
            span.classList.add('visible');
            span.offsetHeight;
          }
        }
      }

      el.appendChild(document.createElement('br'));
    }
  }

  (async () => {
    image.classList.add('visible');
    await new Promise(res => setTimeout(res, 1500));

    for (const el of headers) {
      el.classList.add('visible');
      const tag = el.tagName.toLowerCase();
      const speed = tag === 'h4' ? 20 : 20;
      await typeWriter(el, speed);
    }

    bio.classList.add('visible');
    await revealBio(bioContent, bio, 30);
  })();
});



// DOCUMENT MANAGER (show more / show less) /////////////////////////////////////////////
const NUMBER_OF_ITEMS = 6;
// targeting the container inside the "#papers" div
const papersContainer = document.querySelectorAll('#papers .container');
// getting all the publication cards
const publications = document.querySelectorAll('.publication-card');
// counting all the publication cards
const initialPublicationNo = document.querySelectorAll('.publication-card').length;
let currentPublicationNo = initialPublicationNo;

initializeLayout();

function initializeLayout() {

  const actionContainer = document.createElement('div');
  actionContainer.setAttribute("id", "action-container");
  actionContainer.innerHTML = (`
    <hr class="actions-hr">
    <div id="actions">
    </div>
    <div id="message">
      <p></p>
    </div>
    <div id="number-of-items">
    </div>
  `);

  papersContainer[0].appendChild(actionContainer);

  // targeting the created divs (se above)
  const actionsDiv = document.getElementById('actions');
  const itemNoDiv = document.getElementById('number-of-items');

  // create a p tag
  const numberOfItems = document.createElement('p');
  numberOfItems.innerText = 'Showing ' + currentPublicationNo + ' of ' + initialPublicationNo + ' items.';

  // append the links to the "#actions" div
  itemNoDiv.appendChild(numberOfItems);

  // create the anchor tags
  const linkMore = document.createElement('a');
  const linkLess = document.createElement('a');
  const linkAll = document.createElement('a');
  const linkReset = document.createElement('a');

  // assign the text and the function to the anchor tags
  linkMore.innerText = 'Show More';
  linkMore.setAttribute('href', '#');
  linkMore.setAttribute('onclick','javascript: showMore(NUMBER_OF_ITEMS)');

  linkAll.innerText = 'Show All';
  linkAll.setAttribute('href', '#');
  linkAll.setAttribute('onclick','javascript: showAll()');

  linkLess.innerText = 'Show Less';
  linkLess.setAttribute('href', '#');
  linkLess.setAttribute('onclick','javascript: showLess(NUMBER_OF_ITEMS)');

  linkReset.innerText = 'Reset';
  linkReset.setAttribute('href', '#');
  linkReset.setAttribute('onclick','javascript: initializeAndReset(NUMBER_OF_ITEMS, true)');

  // append the anchor tags to the "#actions" div
  actionsDiv.appendChild(linkMore);
  actionsDiv.appendChild(linkAll);
  actionsDiv.appendChild(linkLess);
  actionsDiv.appendChild(linkReset);

  initializeAndReset(NUMBER_OF_ITEMS, true);

}

function showAll() {
  publications.forEach(publication => { publication.classList.add('card-shown');
                                        publication.classList.remove('card-hidden'); });
  updateNumberOfItems(publications.length, initialPublicationNo);
}

function initializeAndReset(howMany, skipChecks) {
  for(i = 0; i < initialPublicationNo; i++) {
    if (i < howMany) {
      publications[i].classList.add('card-shown');
      publications[i].classList.remove('card-hidden');
    } else {
      publications[i].classList.add('card-hidden');
      publications[i].classList.remove('card-shown');
    }
  }
  updateNumberOfItems(howMany, initialPublicationNo, skipChecks);
  // if the button is pressed it takes the user back to the papers section
  if (!skipChecks) {
    window.location.href = '#papers';
  }
}

function showMore(howMany) {
  currentPublicationNo = document.querySelectorAll('.card-shown').length;
  for(i = currentPublicationNo; i <= currentPublicationNo + (howMany - 1); i++) {
    if (i < initialPublicationNo) {
      publications[i].classList.remove('card-hidden');
      publications[i].classList.add('card-shown');
    }
  }
  currentPublicationNo = currentPublicationNo + howMany;
  // currentPubblicationNo cannot be higher than the initial number of publications (initialiPublicationNo)
  if (currentPublicationNo > initialPublicationNo) {
    currentPublicationNo = initialPublicationNo;
  }
  updateNumberOfItems(currentPublicationNo, initialPublicationNo, false);
}

function showLess(howMany) {
  currentPublicationNo = document.querySelectorAll('.card-shown').length;
  if (currentPublicationNo > howMany) {
    // "reverse for loop" to target the last items of the array
    for(i = currentPublicationNo - 1; i >= currentPublicationNo - howMany; i--) {
      publications[i].classList.remove('card-shown');
      publications[i].classList.add('card-hidden');
    }
    currentPublicationNo = currentPublicationNo - howMany;
  }
  updateNumberOfItems(currentPublicationNo, initialPublicationNo, false);
}

function updateNumberOfItems(currentItemsNo, maxItemsNo, skipChecks) {
  // updating the inner text of the p tag inside the div "#number-of-items"
  document.querySelectorAll('#number-of-items p')[0].innerHTML = 'Showing <strong>' + currentItemsNo + '</strong> of <strong>' + maxItemsNo + '</strong> items.';
  message(currentItemsNo, maxItemsNo, skipChecks);
}

async function message(currentItemsNo, maxItemsNo, skipChecks) {  
  if (skipChecks === true) {
    document.querySelectorAll('#message p')[0].innerText = 'Click on the buttons to see more.';
    document.querySelectorAll('#message p')[0].classList.remove('red-message');
  } else {
    if (currentItemsNo >= maxItemsNo){
      //console.log("a");
      document.querySelectorAll('#message p')[0].innerText = 'All documents are listed.';
      document.querySelectorAll('#message p')[0].classList.add('red-message');
      document.querySelectorAll('#message p')[0].classList.add('shake');
      await sleep(500);
      document.querySelectorAll('#message p')[0].classList.remove('shake');
    } else if (currentItemsNo <= NUMBER_OF_ITEMS) { 
      //console.log("b");
      document.querySelectorAll('#message p')[0].innerText = 'Cannot show fewer documents.';
      document.querySelectorAll('#message p')[0].classList.add('red-message');
      document.querySelectorAll('#message p')[0].classList.add('shake');
      await sleep(500);
      document.querySelectorAll('#message p')[0].classList.remove('shake');
    } else {
      document.querySelectorAll('#message p')[0].innerText = 'Click on the buttons to see more.';
      document.querySelectorAll('#message p')[0].classList.remove('red-message');
    }
  }
}

// sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}