# Feane – React + Vite + Bootstrap

The original multi-page HTML/CSS/JS site, converted into a single-page React app built with Vite.
Bootstrap 5 and Font Awesome now come from npm (no CDN links).

## Run it

Requires Node 20.19+ (or 22.12+).

```bash
npm install
cp .env.example .env     # then fill in your Supabase values (see below)
npm run dev              # http://localhost:5173
npm run build            # production build in dist/
npm run preview          # serve the production build locally
```

## Supabase

Your old `supabase.js` was not included in the conversion. The app reads your credentials from `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`src/lib/supabase.js` creates the `client` from those values. `.env` is git-ignored.
Until it is filled in, the site still works; the sign in / sign up / profile pages show a
"Supabase is not configured" message instead of crashing.

## Pages (routes)

| Old file              | Route           | React file                    |
| --------------------- | --------------- | ----------------------------- |
| `index.html`          | `/`             | `src/pages/Home.jsx`          |
| `menu.html`           | `/menu`         | `src/pages/Menu.jsx`          |
| `about.html`          | `/about`        | `src/pages/About.jsx`         |
| `book.html`           | `/book`         | `src/pages/Book.jsx`          |
| `signin.html`         | `/signin`       | `src/pages/SignIn.jsx`        |
| `signup.html`         | `/signup`       | `src/pages/SignUp.jsx`        |
| `profile.html`        | `/profile`      | `src/pages/Profile.jsx`       |
| `product-detail.html` | `/product/:id`  | `src/pages/ProductDetail.jsx` |
| `bill.html`           | `/bill`         | `src/pages/Bill.jsx`          |

## Structure

```
src/
  main.jsx            entry: imports CSS + Bootstrap JS, mounts <App/>
  App.jsx             routes
  components/         Navbar, PageHeader, Footer, HeroCarousel, MenuSection,
                      RecipeCard, AboutSection, BookTable, LoginModal
  pages/              one file per page (table above)
  hooks/useRecipes.js shared dummyjson.com fetch
  lib/supabase.js     Supabase client (from .env)
  styles/             style.css, menu.css, auth.css, bill.css
  assets/img/         images
```

## What changed vs. the HTML version

- Page-specific CSS that used to be global (`bill.css`, `signup.css`, `signin.css`) is scoped
  (`.bill-page`, `.auth-page`) so it can't leak onto other pages.
- The current page is highlighted in the navbar (the old `about.js`/`menu.js` tried to do this).
- Home and Menu share one `MenuSection`. The category tabs (All / Chicken / Pizza / Pasta / Cookies)
  use a single active state and work on both pages. Dish cards on both pages link to the product page.
- **Sign up no longer saves the password in the `user_food` table** (Supabase Auth already stores it
  securely). It also now stops and shows the error if sign-up or the insert fails.
  If your `user_food.password` column is `NOT NULL`, make it nullable or drop it.
- Sign in shows errors on the page and redirects to the home page on success.
- User-supplied text is rendered by React, which escapes it (the old `innerHTML` code did not).
