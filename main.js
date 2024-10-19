"user strict";
import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  let bookListData = [];
  let searchTimeout;
  let wishlistBooks = [];
  let genres = new Set();
  let prevUrl;
  let nextUrl;
  const endPoint = "https://gutendex.com/books";
  const searchInput = document.querySelector(".search-input");
  const bookListContainer = document.querySelector("#book-card-container");

  function generateUrl(pageNumber = 1, searchTerm = "") {
    if (searchTerm) {
      return `${endPoint}?search=${searchTerm}&page=${pageNumber}`;
    } else {
      return `${endPoint}?page=${pageNumber}`;
    }
  }

  async function fetchBookList(api = endPoint) {
    renderSkeletonCards();
    try {
      const response = await fetch(api);

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      bookListData = await response.json();
      console.log({ bookListData });

      extractGenres(bookListData.results);
      renderBookCards(bookListData.results);
      renderGenreDropdown();

      prevUrl = bookListData.previous;
      nextUrl = bookListData.next;
      pagination();
      wishlist();
    } catch (error) {
      console.error(error);
    }
  }
  const mainPageCardContainer = document.querySelector("#book-card-container");
  if (mainPageCardContainer) {
    fetchBookList();
  }

  function renderBookCards(books, containerId = "#book-card-container") {
    const cardContainer = document.querySelector(containerId);
    if (cardContainer) {
      cardContainer.innerHTML = "";

      if (books.length === 0) {
        bookListContainer.innerHTML = `<div class="no-data-found-container">
        <img src="./public/images/no-data-found.jpg" class="no-data-found-image" alt="image" />
      </div>`;
        return;
      }
      let wishlistActive = false;
      books.forEach((book) => {
        const localStorageWishlist = localStorage.getItem("wishlistIds");
        let wishlistActive = false;
        if (localStorageWishlist) {
          wishlistBooks = JSON.parse(localStorageWishlist).map((id) => parseInt(id));
          console.log({ wishlistBooks });
          wishlistBooks.forEach((id) => {
            if (id == book.id) {
              wishlistActive = true;
            }
          });
        }

        const bookCard = `
      <div class="card-container">
        <div class="card-inner">
          <div class="image-container">
          <button class="wishlist-btn ${wishlistActive ? "wishlist-btn-active" : ""}"><i class="ph ph-heart"></i></button>
            <img class="card-image" src="${book.formats["image/jpeg"]}" alt="Book Cover" />
          </div>
          <div class="card-content">
          <div class="card-info">
            <h3 class="card-title">${book.title}</h3>
            <p class="card-text card-subtitle">
              <span class="font-semibold">Author:</span> ${book.authors[0]?.name}
            </p>
            <p class="card-text card-subtitle">
              <span class="font-semibold">Genre:</span> ${book.subjects[0] || book.bookshelves[0]}
            </p>
            <p class="card-text card-id">
              <span class="font-semibold">ID:</span> <span class="book-id">${book.id}</span>
            </p>
            </div>
            <a href="${book.formats["text/html"]}" target="_blank" class="primary-btn">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;

        cardContainer.innerHTML += bookCard;
      });
    }
  }

  function renderSkeletonCards(containerId = "#book-card-container") {
    const cardContainer = document.querySelector(containerId);
    if (cardContainer) {
      cardContainer.innerHTML = "";

      for (let i = 0; i < 6; i++) {
        const skeletonCard = `
          <div class="scalaton-card">
            <div class="scalaton-card-inner">
              <div class="scalaton-card-placeholder"></div>
              <div class="scalaton-card-content">
                <div class="scalaton-card-title"></div>
                <div class="scalaton-card-subtitle-1"></div>
                <div class="scalaton-card-subtitle-2"></div>
                <div class="scalaton-card-subtitle-3 mb-6"></div>
                <div class="scalaton-card-footer"></div>
              </div>
            </div>
          </div>`;
        cardContainer.innerHTML += skeletonCard;
      }
    }
  }

  // --------------------------- Search ---------------------------

  searchInput &&
    searchInput.addEventListener("input", (event) => {
      clearTimeout(searchTimeout);
      const searchTerm = event.target.value.trim();

      if (searchTerm) {
        renderSkeletonCards();
        searchTimeout = setTimeout(async () => {
          const url = generateUrl(1, searchTerm);
          console.log(url);
          fetchBookList(url);
        }, 300);
      } else {
        renderBookCards(bookListData.results);
      }
    });

  // --------------------------- Wishlist ---------------------------

  async function fetchBookListForWishlist(api = endPoint) {
    renderSkeletonCards();
    try {
      const response = await fetch(api);

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      bookListData = await response.json();

      renderBookCards(bookListData.results, "#wishlist-book-card-container");

      wishlist();
    } catch (error) {
      console.error(error);
    }
  }

  function wishlist() {
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    const totalWishlist = document.querySelector(".total-wishlist");
    console.log({ totalWishlist });

    if (wishlistBooks.length > 0 && totalWishlist) {
      totalWishlist.textContent = wishlistBooks.length;
    }
    wishlistBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();

        btn.classList.toggle("wishlist-btn-active");

        const cardContainer = btn.closest(".card-container");
        const bookId = cardContainer.querySelector(".book-id").textContent;
        if (wishlistBooks.includes(bookId)) {
          wishlistBooks = wishlistBooks.filter((id) => id != bookId);
          localStorage.setItem("wishlistIds", JSON.stringify(wishlistBooks));
        } else {
          wishlistBooks.push(bookId);
          localStorage.setItem("wishlistIds", JSON.stringify(wishlistBooks));
        }
      });
    });
    console.log(wishlistBooks);
  }

  const localStorageWishlist = localStorage.getItem("wishlistIds");

  if (localStorageWishlist) {
    wishlistBooks = JSON.parse(localStorageWishlist).map((id) => parseInt(id));
    console.log({ wishlistBooks });
  }
  // wishlist page
  let wishlistEndpoint;
  if (wishlistBooks.length > 0) {
    wishlistEndpoint = endPoint + "?ids=" + wishlistBooks.join(",");
  }

  if (wishlistEndpoint) {
    fetchBookListForWishlist(wishlistEndpoint);
  }
  console.log({ wishlistEndpoint });

  // --------------------------- Pagination ---------------------------
  function pagination() {
    const nextPageNumber = nextUrl ? parseInt(nextUrl.split("page=")[1]) : 1;
    const paginationEndPoints = [];
    let currentPage;

    if (nextPageNumber <= 3) {
      currentPage = 1;
    } else if (nextPageNumber <= 4) {
      currentPage = 3;
    } else {
      const groupIndex = Math.floor((nextPageNumber - 5) / 2);
      currentPage = 5 + groupIndex * 2;
      console.log({ groupIndex });
    }

    // Generate endpoints
    for (let i = currentPage; i < currentPage + 3; i++) {
      if (i === currentPage) {
        paginationEndPoints.push(generateUrl(i));
      } else if (i === currentPage + 1) {
        paginationEndPoints.push(generateUrl(i));
      } else {
        // Calculate last number based on current group
        let lastNumber;
        if (currentPage === 1) {
          lastNumber = 10;
        } else if (currentPage === 3) {
          lastNumber = 12;
        } else {
          lastNumber = currentPage + 10;
        }
        paginationEndPoints.push(generateUrl(lastNumber));
      }
    }

    const paginationContainer = document.querySelector(".pagination-container");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    paginationEndPoints.forEach((url, index) => {
      if (index == 0) {
        const pageButton = `
                <button class="pagination-btn">
                    ${currentPage}
                </button>
            `;
        paginationContainer.innerHTML += pageButton;
      } else if (index == 1) {
        const pageButton = `
                <button class="pagination-btn">
                    ${currentPage + 1}
                </button>
            `;
        paginationContainer.innerHTML += pageButton;
      } else {
        // Calculate last button number
        let lastNumber;
        if (currentPage === 1) {
          lastNumber = 10;
        } else if (currentPage === 3) {
          lastNumber = 12;
        } else {
          lastNumber = currentPage + 10;
        }

        const pageButton = `
                <div class="pagination-dots">...</div>
                <button class="pagination-btn">
                    ${lastNumber}
                </button>
            `;
        paginationContainer.innerHTML += pageButton;
      }
    });
    console.log({ paginationEndPoints, currentPage, nextPageNumber });
    const newButtons = paginationContainer.querySelectorAll(".pagination-btn");
    newButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        fetchBookList(paginationEndPoints[index]);
      });
    });
  }

  const nextPageButton = document.querySelector(".next-btn");
  const prevPageButton = document.querySelector(".prev-btn");

  prevPageButton &&
    prevPageButton.addEventListener("click", () => {
      if (prevUrl && prevUrl !== null) {
        fetchBookList(prevUrl);
      }
    });

  nextPageButton &&
    nextPageButton.addEventListener("click", () => {
      if (nextUrl && nextUrl !== null) {
        fetchBookList(nextUrl);
      }
    });

  // filter dropdown
  function toggleDropdown(btnId, dropdownId) {
    const dropdownBtn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);

    if (dropdown.classList.contains("hide")) {
      dropdown.classList.remove("hide");
      dropdown.classList.add("show");
      document.addEventListener("click", closeDropdownOutside);
    } else {
      dropdown.classList.add("hide");
      dropdown.classList.remove("show");
      document.removeEventListener("click", closeDropdownOutside);
    }

    function closeDropdownOutside(event) {
      const isClickedInsideDropdown = dropdown.contains(event.target);
      const isClickedOnDropdownBtn = dropdownBtn.contains(event.target);

      if (!isClickedInsideDropdown && !isClickedOnDropdownBtn) {
        dropdown.classList.add("hide");
        dropdown.classList.remove("show");
        document.removeEventListener("click", closeDropdownOutside);
      }
      const arrow = dropdownBtn.querySelector("#drop-arrow");
      if (arrow) {
        if (dropdown.classList.contains("show")) {
          arrow.classList.add("rotate-180");
        } else {
          arrow.classList.remove("rotate-180");
        }
      }
    }
  }

  function dropdownActive(btnId, dropdownId) {
    const dropdownBtn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);
    let dropdownList;
    if (dropdown) {
      dropdownList = dropdown.querySelectorAll("li");
    }

    if (dropdownList) {
      dropdownList.forEach((item) => {
        item.addEventListener("click", (event) => {
          dropdownList.forEach((otherItem) => {
            otherItem.classList.remove("active");
          });
          dropdownBtn.querySelector("span").innerText = item.innerText;

          item.classList.add("active");

          toggleDropdown(btnId, dropdownId);

          event.stopPropagation();
        });
      });
    }
  }

  // Use Filter Dropdown
  const genreBtn = document.getElementById("genre-btn");

  genreBtn && genreBtn.addEventListener("click", () => toggleDropdown("genre-btn", "genre-dropdown"));

  dropdownActive("genre-btn", "genre-dropdown");

  // Function to extract unique genres from the book list
  function extractGenres(books) {
    genres.clear();
    console.log({ genres });
    books.forEach((book) => {
      const genre = book.subjects[0] || book.bookshelves[0];
      if (genre) {
        genres.add(genre);
      }
    });
  }

  // Function to render the genre dropdown
  function renderGenreDropdown() {
    const genreList = document.querySelector("#genre-dropdown ul");
    let genreItems = "";
    genreList.innerHTML = "";

    genreItems = `<li class="active block cursor-pointer rounded-md px-4 py-2 duration-300 hover:text-dark2 hover:bg-tertiary">All Genres</li>`;

    genres.forEach((genre) => {
      genreItems += `<li class="block cursor-pointer rounded-md px-4 py-2 duration-300 hover:text-dark2 hover:bg-tertiary">${genre}</li>`;
    });

    genreList.innerHTML += genreItems;

    // Add event listener for filtering by genre
    genreList.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", function () {
        const selectedGenre = this.innerText;
        const genreBtn = document.getElementById("genre-btn");
        genreBtn.querySelector("span").innerText = selectedGenre;

        if (selectedGenre === "All Genres") {
          renderBookCards(bookListData.results);
        } else {
          const filteredBooks = bookListData.results.filter((book) => {
            return (book.subjects[0] || book.bookshelves[0]) === selectedGenre;
          });
          renderBookCards(filteredBooks);
        }

        toggleDropdown("genre-btn", "genre-dropdown");
      });
    });
  }

  let scrollHeight;

  // -------------------------- Desktop Nav ---------------------------
  window.addEventListener("scroll", function () {
    scrollHeight = window.scrollY;
    console.log({ scrollHeight });
    const desktopNav = document.querySelector(".desktop-nav");

    if (scrollHeight > 100) {
      desktopNav?.classList.add("navbar-active");
    } else {
      desktopNav?.classList.remove("navbar-active");
    }
  });

  // Get the current page URL
});
