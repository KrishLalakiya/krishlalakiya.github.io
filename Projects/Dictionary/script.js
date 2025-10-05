// --- Element References ---
const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const resultHeaderContainer = document.getElementById('result-header-container');
const resultBodyContainer = document.getElementById('result-body-container');
const stackedViewBtn = document.getElementById('stacked-view-btn');
const gridViewBtn = document.getElementById('grid-view-btn');
const wotdContent = document.getElementById('wotd-content');

// --- Event Listeners ---
searchBtn.addEventListener('click', () => searchWord(wordInput.value));
wordInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {1
    searchWord(wordInput.value);
  }
});
stackedViewBtn.addEventListener('click', setStackedView);
gridViewBtn.addEventListener('click', setGridView);

// --- Main Search Function ---
async function searchWord(word) {
  word = word.trim();
  if (word === '') {
    resultHeaderContainer.innerHTML = '';
    resultBodyContainer.innerHTML = '<p class="error">Please enter a word.</p>';
    return;
  }
  setStackedView(); // Default to stacked view for new searches

  // Clear previous results and show a loading state
  resultHeaderContainer.innerHTML = '';
  resultBodyContainer.innerHTML = '<p>Searching...</p>';


  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || 'Word not found.');
    }
    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error("API Fetch Error:", error); // Log the actual error for debugging

    // Display a more user-friendly message
    let userMessage = 'An unexpected error occurred.';
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        userMessage = 'Could not connect to the dictionary API. Please check your internet connection and ensure you are running this from a web server.';
    } else {
        userMessage = error.message; // Use the API's message for "Word not found" etc.
    }
    resultHeaderContainer.innerHTML = '';
    resultBodyContainer.innerHTML = `<p class="error">${userMessage}</p>`;
  }
}

// --- Display Function (no changes needed here) ---
function displayResult(data) {
  const entry = data[0];
  const word = entry.word;

  let headerHtml = `<div class="result-header"><h1>${word}</h1><div class="phonetics-container">`;
  const audioUrls = new Set();
  entry.phonetics.forEach(phonetic => {
      if (phonetic.audio) {
          audioUrls.add(phonetic.audio);
      }
      if (phonetic.text) {
          headerHtml += `<div class="phonetic-item"><span class="phonetic">${phonetic.text}</span></div>`;
      }
  });

  audioUrls.forEach(audioUrl => {
      const id = `audio-${Math.random().toString(36).substr(2, 9)}`;
      headerHtml += `
        <div class="phonetic-item">
          <button onclick="document.getElementById('${id}').play()" class="audio-btn">🔊</button>
          <audio id="${id}" src="${audioUrl}"></audio>
        </div>`;
  });
  
  headerHtml += `</div></div>`;
  resultHeaderContainer.innerHTML = headerHtml;

  let bodyHtml = '';
  entry.meanings.forEach(meaning => {
    bodyHtml += `<div class="part-of-speech-section"><h2><em>${meaning.partOfSpeech}</em></h2><ol class="definitions-list">`;
    meaning.definitions.forEach(def => {
      bodyHtml += `<li><p>${def.definition}</p>${def.example ? `<p class="example">"${def.example}"</p>` : ''}</li>`;
    });
    bodyHtml += `</ol>`;

    if (meaning.synonyms?.length) {
      bodyHtml += `<div class="related-words synonym-section"><h3>Synonyms</h3><div class="tags-container">${meaning.synonyms.map(s => `<button class="tag" onclick="searchWord('${s}')">${s}</button>`).join('')}</div></div>`;
    }
    if (meaning.antonyms?.length) {
      bodyHtml += `<div class="related-words antonym-section"><h3>Antonyms</h3><div class="tags-container">${meaning.antonyms.map(a => `<button class="tag" onclick="searchWord('${a}')">${a}</button>`).join('')}</div></div>`;
    }
    bodyHtml += `</div>`;
  });

  resultBodyContainer.innerHTML = bodyHtml;
}

// --- View Controls ---
function setStackedView() {
  resultBodyContainer.classList.remove('grid-view');
  stackedViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
}
function setGridView() {
  resultBodyContainer.classList.add('grid-view');
  gridViewBtn.classList.add('active');
  stackedViewBtn.classList.remove('active');
}

// --- Word of the Day ---
async function fetchWordOfTheDay() {
  try {
    const words = ["serendipity", "eloquent", "resilient", "ephemeral", "benevolent", "lucid", "ubiquitous", "mellifluous"];
    const today = new Date().toDateString();
    const index = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % words.length;
    const word = words[index];

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error('API connection failed for WOTD.'); // Add check here
    
    const data = await res.json();
    const entry = data[0];
    const def = entry.meanings[0].definitions[0].definition;

    wotdContent.innerHTML = `
      <div class="wotd-entry">
        <h3>${entry.word}</h3>
        <p><strong>${entry.meanings[0].partOfSpeech}</strong></p>
        <p>${def}</p>
      </div>
    `;
  } catch (err) {
    console.error("WOTD Fetch Error:", err);
    wotdContent.innerHTML = "<p class='error'>Could not load Word of the Day. Please check your connection.</p>";
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', fetchWordOfTheDay);
/* document.addEventListener('DOMContentLoaded', () => {

    const wordInput = document.getElementById('word-input');
    const searchBtn = document.getElementById('search-btn');
    const resultHeaderContainer = document.getElementById('result-header-container');
    const resultBodyContainer = document.getElementById('result-body-container');
    const stackedViewBtn = document.getElementById('stacked-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const wotdContent = document.getElementById('wotd-content');

    // --- Event Listeners ---
    searchBtn.addEventListener('click', () => searchWord(wordInput.value));
    wordInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') searchWord(wordInput.value);
    });
    stackedViewBtn.addEventListener('click', setStackedView);
    gridViewBtn.addEventListener('click', setGridView);

    // --- Main Search Function ---
    async function searchWord(word) {
        word = word.trim();
        if (word === '') {
            resultBodyContainer.innerHTML = '<p class="error">Please enter a word.</p>';
            return;
        }
        setStackedView();
        resultHeaderContainer.innerHTML = '';
        resultBodyContainer.innerHTML = '<p>Searching...</p>';

        try {
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.title || 'Word not found.');
            }
            const data = await response.json();
            displayResult(data);
        } catch (error) {
            let userMessage = 'An unexpected error occurred.';
            if (error.message.includes('Failed to fetch')) {
                userMessage = 'Could not connect to the API. Check your internet and run this from a web server.';
            } else {
                userMessage = error.message;
            }
            resultHeaderContainer.innerHTML = '';
            resultBodyContainer.innerHTML = `<p class="error">${userMessage}</p>`;
        }
    }

    // --- Display Function ---
    function displayResult(data) {
        const entry = data[0];
        const word = entry.word;
                                                        //yaha entry.word likha tha
        let headerHtml = `<div class="result-header"><h1>${word}</h1><div class="phonetics-container">`;
        const audioUrls = new Set(entry.phonetics.map(p => p.audio).filter(Boolean));

        audioUrls.forEach(url => {
            const id = `audio-${Math.random()}`;
            headerHtml += `<button onclick="document.getElementById('${id}').play()" class="audio-btn">🔊</button><audio id="${id}" src="${url}"></audio>`;
        });
        headerHtml += `</div></div>`;
        resultHeaderContainer.innerHTML = headerHtml;

        let bodyHtml = entry.meanings.map(meaning => {
            const definitions = meaning.definitions.map(def => `<li><p>${def.definition}</p></li>`).join('');
            const synonyms = meaning.synonyms?.length ? `<div class="related-words"><h3>Synonyms</h3><div class="tags-container">${meaning.synonyms.map(s => `<button class="tag" onclick="searchWord('${s}')">${s}</button>`).join('')}</div></div>` : '';
            return `<div class="part-of-speech-section"><h2><em>${meaning.partOfSpeech}</em></h2><ol class="definitions-list">${definitions}</ol>${synonyms}</div>`;
        }).join('');
        resultBodyContainer.innerHTML = bodyHtml;
    }

    // --- View Controls ---
    function setStackedView() {
        resultBodyContainer.classList.remove('grid-view');
        stackedViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
    function setGridView() {
        resultBodyContainer.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        stackedViewBtn.classList.remove('active');
    }

    // --- Word of the Day ---
    async function fetchWordOfTheDay() {
        try {
            const words = ["serendipity", "eloquent", "resilient", "ephemeral", "benevolent", "lucid", "ubiquitous", "mellifluous"];
            const word = words[new Date().getDate() % words.length];
           
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();
            const entry = data[0];
            const def = entry.meanings[0].definitions[0].definition;
            wotdContent.innerHTML = `<h3>${entry.word}</h3><p><strong>${entry.meanings[0].partOfSpeech}</strong></p><p>${def}</p>`;
        } catch (err) {
            wotdContent.innerHTML = "<p class='error'>Could not load Word of the Day.</p>";
        }
    }

    fetchWordOfTheDay();
});

*/