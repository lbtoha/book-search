# Book Search App 📚

A modern, responsive book search application built with Vanilla JavaScript and powered by the Gutendex API. Dynamic search, wishlist functionality, and a clean user interface.

## Live Link
https://book-search-ruby.vercel.app/

## 🚀 Features

- **Real-time Book Search**: Instant search
- **Genre Filtering**: Filter books by different genres
- **Wishlist System**: Save favorite books locally
- **Responsive Design**: Works seamlessly on all devices
- **Book Details**: Detailed view for each book with download options
- **Pagination**: Easy navigation through book listings
- **Loading States**: Skeleton loaders for better UX


## 🛠️ Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime & package manager
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Vanilla JS


## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/lbtoha/book-search
```
2. Navigate to project directory:
```bash
cd book-search
```

3. Install dependencies:
```bash
bun install
```
or
```bash
npm install
```

4. Start development server:
```bash
bun run dev
```
or
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

6. To build the project:
```bash
bun run build
```
or
```bash
npm run build
```
7. To show the build output:
```bash
bun run preview
```
or
```bash
npm run preview
```

8. Open http://localhost:4173/ in your browser

9. If you feel everything is ready, you can now deploy the project.

10. To deploy the project use *dist* as the root directory.

## 📁 Project Structure

```bash
Book-Search-App/
├── public/
│   └── images/
│       ├── add-to-favorites.png
│       ├── logo.png
│       └── no-data-found.jpg
├── src/
│   └── partials/
├── .gitignore
├── book-details.html
├── index.html
│── wishlist.html
├── main.js
├── style.css
├── tailwind.config.js
├── bun.lockb
├── package.json
├── postcss.config.js
└── vite.config.js
```