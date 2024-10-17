(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.addEventListener("DOMContentLoaded", function() {
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
      var _a;
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
              <span class="font-semibold">Author:</span> ${(_a = book.authors[0]) == null ? void 0 : _a.name}
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
      var _a;
      const bookCard = `
      <div class="card-container">
        <div class="rounded-lg overflow-hidden shadow-custom1">
          <div class="w-full image-container">
            <img class="w-full object-cover object-center card-image !h-[400px]" src="${book.formats["image/jpeg"] || "https://via.placeholder.com/400x250"}" alt="Book Cover" />
          </div>
          <div class="p-6 d-flex">
            <h3 class="h3 font-semibold text-dark mb-4 card-title">${book.title}</h3>
            <p class="m-text text-neutral-700 mb-2">
              <span class="font-semibold">Author:</span> ${((_a = book.authors[0]) == null ? void 0 : _a.name) || "Unknown"}
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
  const languageBtn = document.getElementById("language-btn");
  languageBtn && languageBtn.addEventListener("click", () => toggleDropdown("language-btn", "language"));
  dropdownActive("language-btn", "language");
  const nextPageButton = document.querySelector(".next-btn");
  document.querySelector(".prev-btn");
  nextPageButton && nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchBookList(currentPage);
    }
  });
  let scrollHeight;
  const scrollTopButton = document.querySelector(".scroll-top");
  window.addEventListener("scroll", function() {
    scrollHeight = window.scrollY;
    const desktopNav = document.querySelector(".desktop-nav");
    const loginButton = document.querySelector(".home-three-login");
    if (scrollHeight > 50) {
      desktopNav == null ? void 0 : desktopNav.classList.add("bg-white-1");
      loginButton == null ? void 0 : loginButton.classList.remove("text-white-1");
      loginButton == null ? void 0 : loginButton.classList.add("text-black-4");
    } else {
      loginButton == null ? void 0 : loginButton.classList.remove("text-black-4");
      loginButton == null ? void 0 : loginButton.classList.add("text-white-1");
      desktopNav == null ? void 0 : desktopNav.classList.remove("bg-white-1");
    }
    if (scrollHeight > 500) {
      scrollTopButton == null ? void 0 : scrollTopButton.classList.add("opacity-1");
      scrollTopButton == null ? void 0 : scrollTopButton.classList.add("visible");
      scrollTopButton == null ? void 0 : scrollTopButton.classList.remove("invisible");
      scrollTopButton == null ? void 0 : scrollTopButton.classList.remove("opacity-0");
    } else {
      scrollTopButton == null ? void 0 : scrollTopButton.classList.remove("opacity-1");
      scrollTopButton == null ? void 0 : scrollTopButton.classList.remove("visible");
      scrollTopButton == null ? void 0 : scrollTopButton.classList.add("invisible");
      scrollTopButton == null ? void 0 : scrollTopButton.classList.add("opacity-0");
    }
  });
  const currentUrl = window.location.pathname;
  let withoutSlash;
  if (currentUrl.length > 1) {
    withoutSlash = currentUrl.split("/")[1];
  } else {
    withoutSlash = currentUrl;
  }
  const singleMenu = document.querySelectorAll(".single-menu");
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
    item.addEventListener("click", function() {
      allList.forEach((item2) => {
        item2.classList.remove("mobile-nav-list-active");
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
      const currentUrl2 = window.location.pathname;
      let withoutSlash2;
      if (currentUrl2.length > 1) {
        withoutSlash2 = currentUrl2.split("/")[1];
      } else {
        withoutSlash2 = currentUrl2;
      }
      if (withoutSlash2 === menuItemUrl) {
        item.parentElement.classList.add("mobile-nav-active");
        mobileMenu.classList.add("parent-nav-active");
      }
    });
  });
});
