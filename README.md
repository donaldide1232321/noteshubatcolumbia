A full-stack, public‐access notes‐sharing platform built with modern web tools and a serverless backend. Students can instantly upload, browse, and download study materials without ever needing to log in. This project showcases expertise in frontend engineering, RESTful API integration, and static‐site deployment strategies—everything you need to build a polished, real-world application.

KEY FEATURES:
<ul> 
  <li><strong></strong>End-to-end TypeScript & React:</strong> Developed a component-driven UI with React 18 and TypeScript for zero-runtime type errors. Every view—from the search bar to the document cards—benefits from strict typings and predictable state management. </li>

  <li><strong>Serverless Backend Powered by Supabase:</strong> Leveraged Supabase’s Storage buckets and REST API to handle file uploads, metadata storage, and paginated data retrieval. Without writing a single line of custom backend code, we achieved secure file hosting, efficient search (ILike filters), and seamless pagination.</li>

  <li><strong>Instant Public Access:</strong> Removed all authentication hurdles—anyone can browse, upload, and download materials without signing in. This required careful configuration of Supabase RLS policies and CORS rules to keep everything open, reliable, and performant.</li>

  <li><strong>Optimized Data Fetching with React Query:</strong> Implemented infinite scrolling and “Load More” pagination with React Query’s caching and background refetching. Users see up to 12 results at a time (filtered by course, professor, or material label) with a single click to load more, and near-instant reloads on navigation.</li>

  <li><strong>Static-Site Deployment on GitHub Pages:</strong> Configured Vite to build hashed asset bundles, then deployed via a docs/ folder to GitHub Pages. Served through a custom domain (e.g., noteshubcolumbia.com) with proper CNAME and DNS A records—no need for Vercel or heavy-weight hosting.</li>
</ul>

FRONTEND
