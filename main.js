"user strict";
import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  let bookListData = [];
  let searchTimeout;
  let currentPage = 1;
  let totalPages;
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
      totalPages = bookListData.count;
      prevUrl = bookListData.previous;
      nextUrl = bookListData.next;
    } catch (error) {
      console.error(error);
    }
  }
  console.log({ genres });
  fetchBookList();

  function renderBookCards(books) {
    const cardContainer = document.querySelector("#book-card-container");

    cardContainer.innerHTML = "";

    if (books.length === 0) {
      bookListContainer.innerHTML = `<div class="no-data-found-container">
        <img src="./public/images/no-data-found.jpg" class="no-data-found-image" alt="image" />
      </div>`;
      return;
    }

    books.forEach((book) => {
      const bookCard = `
      <div class="card-container">
        <div class="card-inner">
          <div class="image-container">
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
              <span class="font-semibold">ID:</span> ${book.id}
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

  function renderSkeletonCards() {
    const cardContainer = document.querySelector("#book-card-container");
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

  // search

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

  // --------------------------- Pagination ---------------------------
  function pagination ()  {

  }
  const nextPageButton = document.querySelector(".next-btn");
  const prevPageButton = document.querySelector(".prev-btn");
  const firstPageButton = document.querySelector(".first-page-btn");
  const secondPageButton = document.querySelector(".second-page-btn");
  const nthPageButton = document.querySelector(".tenth-page-btn");

  function updateButtonNumbers() {
    firstPageButton.innerHTML = currentPage;
    secondPageButton.innerHTML = currentPage + 1;
    nthPageButton.innerHTML = currentPage + 10;
  }

  prevPageButton &&
    prevPageButton.addEventListener("click", () => {
      if (prevUrl && prevUrl !== null) {
        fetchBookList(prevUrl);
      }
    });

  nextPageButton &&
    nextPageButton.addEventListener("click", () => {
      if (condition && nextUrl && nextUrl !== null) {
        fetchBookList(nextUrl);
      }
    });

  firstPageButton &&
    firstPageButton.addEventListener("click", () => {
      if (currentPage < totalPages && currentPage >= 1) {
        currentPage = currentPage + 1;
        fetchBookList(currentPage);
        updateButtonNumbers();
      }
    });

  secondPageButton &&
    secondPageButton.addEventListener("click", () => {
      if (currentPage < totalPages && currentPage >= 1) {
        currentPage = currentPage + 2;
        fetchBookList(currentPage);
        updateButtonNumbers();
      }
    });

  nthPageButton &&
    nthPageButton.addEventListener("click", () => {
      if (currentPage < totalPages && currentPage >= 1) {
        currentPage = currentPage + 10;
        fetchBookList(currentPage);
        updateButtonNumbers();
      }
    });

  // nextPageButton.querySelector(".next-page").innerHTML = currentPage;

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
  const scrollTopButton = document.querySelector(".scroll-top");

  // menu
  window.addEventListener("scroll", function () {
    scrollHeight = window.scrollY;
    const desktopNav = document.querySelector(".desktop-nav");
    const loginButton = document.querySelector(".home-three-login");

    if (scrollHeight > 50) {
      desktopNav?.classList.add("bg-white-1");
      loginButton?.classList.remove("text-white-1");
      loginButton?.classList.add("text-black-4");
    } else {
      loginButton?.classList.remove("text-black-4");
      loginButton?.classList.add("text-white-1");
      desktopNav?.classList.remove("bg-white-1");
    }

    if (scrollHeight > 500) {
      scrollTopButton?.classList.add("opacity-1");
      scrollTopButton?.classList.add("visible");
      scrollTopButton?.classList.remove("invisible");
      scrollTopButton?.classList.remove("opacity-0");
    } else {
      scrollTopButton?.classList.remove("opacity-1");
      scrollTopButton?.classList.remove("visible");
      scrollTopButton?.classList.add("invisible");
      scrollTopButton?.classList.add("opacity-0");
    }
  });

  // Get the current page URL
  const currentUrl = window.location.pathname;
  let withoutSlash;
  if (currentUrl.length > 1) {
    withoutSlash = currentUrl.split("/")[1];
  } else {
    withoutSlash = currentUrl;
  }

  const singleMenu = document.querySelectorAll(".single-menu");
  // Get all menu items
  const menuItems = document.querySelectorAll(".menu li a");

  menuItems.forEach((item) => {
    const menuItemUrl = item.getAttribute("href");

    if (withoutSlash === menuItemUrl) {
      item.parentElement.classList.add("active-nav");

      item.parentElement.parentElement.parentElement.querySelector("li p").classList.add("parent-nav-active");
      item.parentElement.classList.add("parent-nav-active");
    }
  });

  singleMenu.forEach((item) => {
    const menuItemUrl = item.getAttribute("href");

    if (withoutSlash === menuItemUrl) {
      item.classList.add("parent-nav-active");
    }
  });

  // mobile menu
  const menuToggleButton = document.querySelector(".mobile-nav-toggle");
  const mobileMenuOverlay = document.querySelector(".sidebar-overlay");

  menuToggleButton && menuToggleButton.addEventListener("click", sidebarToggle);
  mobileMenuOverlay && mobileMenuOverlay.addEventListener("click", sidebarToggle);

  function sidebarToggle() {
    const menuSidebar = document.querySelector(".menu-sidebar");

    menuSidebar.classList.forEach((item) => {
      if (item === "menu-sidebar-active") {
        menuSidebar.classList.remove("menu-sidebar-active");
      } else {
        menuSidebar.classList.add("menu-sidebar-active");
      }
    });

    mobileMenuOverlay.classList.forEach((item) => {
      if (item === "menu-sidebar-overlay-active") {
        mobileMenuOverlay.classList.remove("menu-sidebar-overlay-active");
      } else {
        mobileMenuOverlay.classList.add("menu-sidebar-overlay-active");
      }
    });
  }

  const mobileNavListParent = document.querySelectorAll(".mobile-nav-dropdown");

  const allList = document.querySelectorAll(".mobile-menu-container .mobile-nav-list");

  mobileNavListParent.forEach((item) => {
    item.addEventListener("click", function () {
      allList.forEach((item) => {
        item.classList.remove("mobile-nav-list-active");
      });

      const mobileNavList = item.querySelector(".mobile-nav-list");
      mobileNavList.classList.toggle("mobile-nav-list-active");
    });
  });

  const mobileMenus = document.querySelectorAll(".mobile-nav-list-parent");

  mobileMenus.forEach((mobileMenu) => {
    const mobileMenuItems = mobileMenu.nextElementSibling.querySelectorAll(".mobile-nav-item a");

    mobileMenuItems.forEach((item) => {
      const menuItemUrl = item.getAttribute("href");
      const currentUrl = window.location.pathname;
      let withoutSlash;
      if (currentUrl.length > 1) {
        withoutSlash = currentUrl.split("/")[1];
      } else {
        withoutSlash = currentUrl;
      }

      if (withoutSlash === menuItemUrl) {
        item.parentElement.classList.add("mobile-nav-active");
        mobileMenu.classList.add("parent-nav-active");
      }
    });
  });
});
