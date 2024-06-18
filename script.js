document.addEventListener('DOMContentLoaded', function () {
  fetch('https://api.quotable.io/quotes/random?limit=4')
    .then((response) => response.json())
    .then((data) => {
      const quoteContainer = document.getElementById('quote-container');
      const authorsContainer = document.getElementById('authors-container');
      const resultMessage = document.getElementById('result-message');
      const authorPicture = document.getElementById('author-picture');

      quoteContainer.innerHTML = ''; // Clear previous quote
      authorsContainer.innerHTML = ''; // Clear previous authors
      resultMessage.innerHTML = ''; // Clear previous result message
      authorPicture.innerHTML = ''; // Clear previous author picture

      // Display one random quote
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      const displayedQuoteContent = `
              <p id="quote-content">${randomQuote.content}</p>
          `;
      quoteContainer.innerHTML = displayedQuoteContent;

      // Disable the game after a guess
      const disableGame = () => {
        const buttons = document.querySelectorAll('.author-button');
        buttons.forEach((button) => (button.disabled = true));
      };

      // Display all authors as buttons
      data.forEach((quote) => {
        const authorButton = document.createElement('button');
        authorButton.textContent = quote.author;
        authorButton.classList.add('author-button');
        authorButton.addEventListener('click', function () {
          if (quote.author === randomQuote.author) {
            authorButton.style.backgroundColor = 'green';
            resultMessage.textContent = 'You win!';
            // Fetch and display author picture using Wikimedia API
            fetchAuthorImage(randomQuote.author, authorPicture);
          } else {
            authorButton.style.backgroundColor = 'red';
            resultMessage.textContent = `Incorrect! The correct author is ${randomQuote.author}.`;
          }
          disableGame();
        });
        authorsContainer.appendChild(authorButton);
      });
    })
    .catch((error) => {
      console.error('Error fetching quotes:', error);
    });
});

function fetchAuthorImage(author, authorPicture) {
  fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages&format=json&pithumbsize=200&origin=*`
  )
    .then((response) => response.json())
    .then((data) => {
      const pages = data.query.pages;
      const page = Object.values(pages)[0];
      if (page && page.thumbnail) {
        const imgUrl = page.thumbnail.source;
        authorPicture.innerHTML = `<img src="${imgUrl}" alt="${author}" style="max-width: 200px; margin-top: 20px;">`;
      } else {
        authorPicture.innerHTML = `<p>No image found for ${author}.</p>`;
      }
    })
    .catch((error) => {
      console.error('Error fetching image:', error);
    });
}
