"user strict";
import "./style.css";

// desktop menu
document.addEventListener("DOMContentLoaded", function () {
  let bookListData = [];
  let searchTimeout;

  async function fetchBookList() {
    const endPoint = "https://gutendex.com/books";

    renderSkeletonCards();
    try {
      const response = await fetch(endPoint);

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      bookListData = await response.json();
      console.log({ bookListData });

      renderBookCards(bookListData.results);
    } catch (error) {
      console.error(error);
    }
  }

  fetchBookList();

  function renderBookCards(books) {
    const cardContainer = document.querySelector("#book-card-container");

    cardContainer.innerHTML = "";

    books.forEach((book) => {
      const bookCard = `
      <div class="card-container">
        <div class="rounded-lg overflow-hidden shadow-custom1">
          <div class="w-full image-container">
            <img class="w-full object-cover object-center card-image !h-[400px]" src="${book.formats["image/jpeg"]}" alt="Book Cover" />
          </div>
          <div class="p-6 d-flex">
            <h3 class="h3 font-semibold text-primary mb-4 card-title">${book.title}</h3>
            <p class="m-text text-neutral-700 mb-2">
              <span class="font-semibold">Author:</span> ${book.authors[0]?.name}
            </p>
            <p class="m-text text-neutral-700 mb-2">
              <span class="font-semibold">Genre:</span> ${book.subjects[0] || book.bookshelves[0]}
            </p>
            <p class="m-text text-neutral-700 mb-6">
              <span class="font-semibold">ID:</span> ${book.id}
            </p>
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

  const searchInput = document.querySelector(".search-input");
  const bookListContainer = document.querySelector("#book-card-container");

  const fetchSearchBookList = async (searchTerm) => {
    try {
      const response = await fetch(`https://gutendex.com/books?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const renderBooks = (books) => {
    bookListContainer.innerHTML = "";

    if (books.length === 0) {
      bookListContainer.innerHTML = `<div class="no-data-found-container">
        <img src="./public/images/no-data-found.jpg" class="no-data-found-image" alt="image" />
      </div>`;
      return;
    }

    books.forEach((book) => {
      const bookCard = `
      <div class="card-container">
        <div class="rounded-lg overflow-hidden shadow-custom1">
          <div class="w-full image-container">
            <img class="w-full object-cover object-center card-image !h-[400px]" src="${book.formats["image/jpeg"] || "https://via.placeholder.com/400x250"}" alt="Book Cover" />
          </div>
          <div class="p-6 d-flex">
            <h3 class="h3 font-semibold text-dark mb-4 card-title">${book.title}</h3>
            <p class="m-text text-neutral-700 mb-2">
              <span class="font-semibold">Author:</span> ${book.authors[0]?.name || "Unknown"}
            </p>
            <p class="m-text text-neutral-700 mb-2">
              <span class="font-semibold">Genre:</span> ${book.subjects[0] || book.bookshelves[0] || "Unknown"}
            </p>
            <p class="m-text text-neutral-700 mb-6">
              <span class="font-semibold">ID:</span> ${book.id}
            </p>
            <a href="${book.formats["text/html"]}" target="_blank" class="primary-btn">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;

      bookListContainer.innerHTML += bookCard;
    });
  };

  searchInput.addEventListener("input", (event) => {
    clearTimeout(searchTimeout);
    const searchTerm = event.target.value.trim();

    if (searchTerm) {
      renderSkeletonCards();
      searchTimeout = setTimeout(async () => {
        const books = await fetchSearchBookList(searchTerm);
        renderBooks(books);
      }, 300);
    } else {
      renderBookCards(bookListData.results);
    }
  });

  // --------------------------- Pagination ---------------------------
  const nextPageButton = document.querySelector(".next-btn");
  const prevPageButton = document.querySelector(".prev-btn");
  nextPageButton &&
    nextPageButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchBookList(currentPage);
      }
    });

  let scrollHeight;
  const scrollTopButton = document.querySelector(".scroll-top");

  // const handleProgressClick = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };

  // scrollTopButton.addEventListener("click", handleProgressClick);

  /**
   * ======================================
   * 03. menu
   * ======================================
   */
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
