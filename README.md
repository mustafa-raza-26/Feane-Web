# Feane – React + Vite + Bootstrap

Premium dark-and-gold restaurant site: React 19, Vite, Bootstrap 5, React Router, Supabase auth.

## Run it

Requires Node 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Supabase

Open `src/lib/supabase.js` and paste your project URL and anon key
(or put `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in a `.env` file – see `.env.example`).
Without them the site still works; sign in / sign up / profile show a "not configured" message.

Table used: `user_food` (`uid`, `firstName`, `lastName`, `email`, `number`, `address`, `created_at`).
The password is never stored in it – Supabase Auth keeps it.

## Pages

| Route          | Page                                                        |
| -------------- | ----------------------------------------------------------- |
| `/`            | Home: hero, offers, popular dishes, features, about, booking |
| `/menu`        | Menu with category tabs, search and sorting                 |
| `/product/:id` | Dish page: portion option, quantity, add to cart / order now |
| `/cart`        | **Cart**: change quantities, remove items, totals, checkout |
| `/bill`        | Checkout with validation, payment choice, order confirmation |
| `/profile`     | **Profile**: account details (editable), order + booking history |
| `/signin` `/signup` | Auth pages with validation and show/hide password      |
| `/about` `/book` | About and table booking (saved to your profile history)    |

## Structure

```
src/
  main.jsx, App.jsx        entry + routes (all pages share Layout: navbar + footer)
  context/                 AuthContext, CartContext (saved in localStorage), ToastContext
  components/              Navbar, Footer, PageHero, HeroCarousel, MenuSection, RecipeCard,
                           QtyStepper, BookTable, LoginModal, Reveal, ...
  pages/                   one file per route
  lib/                     supabase, pricing, storage, validate
  hooks/                   useRecipes, useOrderOnline
  styles/base.css          theme tokens, navbar, buttons, forms, toasts, modal
  styles/pages.css         page/section styles
```
