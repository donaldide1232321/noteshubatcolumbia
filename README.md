<h1>DESCRIPTION</h1>

A full-stack, public‐access notes‐sharing platform built with modern web tools and a serverless backend. Students can instantly upload, browse, and download study materials without ever needing to log in. 

<h1>KEY FEATURES:</h1>
<ul> 
  <li><strong></strong>End-to-end TypeScript & React:</strong> Developed a component-driven UI with React 18 and TypeScript for zero-runtime type errors. Every view—from the search bar to the document cards—benefits from strict typings and predictable state management</li>

  <li><strong>Serverless Backend Powered by Supabase:</strong> Leveraged Supabase’s Storage buckets and REST API to handle file uploads, metadata storage, and paginated data retrieval. Without writing a single line of custom backend code, we achieved secure file hosting, efficient search (ILike filters), and seamless pagination</li>

  <li><strong>Instant Public Access:</strong> Removed all authentication hurdles—anyone can browse, upload, and download materials without signing in. This required careful configuration of Supabase RLS policies and CORS rules to keep everything open, reliable, and performant</li>

  <li><strong>Optimized Data Fetching with React Query:</strong> Implemented infinite scrolling and “Load More” pagination with React Query’s caching and background refetching. Users see up to 12 results at a time (filtered by course, professor, or material label) with a single click to load more, and near-instant reloads on navigation</li>

  <li><strong>Static-Site Deployment on GitHub Pages:</strong> Configured Vite to build hashed asset bundles, then deployed via a docs/ folder to GitHub Pages. Served through a custom domain (e.g., noteshubcolumbia.com) with proper CNAME and DNS A records—no need for Vercel or heavy-weight hosting</li>
</ul>

<h1>FRONTEND</h1>
<ul>
  <li>React 18 + TypeScript for type-safe, componentized user interfaces</li>
  <li>Vite as the dev server and build tool—fast HMR, optimized production bundling, and hashed filenames</li>
  <li>Tailwind CSS for utility-first styling and theme toggling</li>
  <li>shadcn/ui components (cards, modals, buttons) for consistent design primitives</li>
  <li>React Query for caching, pagination, and background refetching of Supabase data</li>
</ul>

<h1>BACKEND</h1>
<ul>
  <li>Supabase (PostgreSQL + Storage) for database, file storage, and REST API</li>
  <li>Storage Bucket: Store uploaded files, serve public URLs</li>
  <li>PostgreSQL: Store upload metadata; create descending index on upload_date for fast sorting</li>
  <li>REST API: Perform .select(), .or().ilike(), and .range() queries with zero‐server overhead</li>
</ul>
