// src/data/clients.js
// Single source of truth for every client and video on the site.
//
// HOW TO ADD WORK:
// 1. Put the video in public/work/<client-slug>/ (run `npm run videos` to compress it).
// 2. Add an entry to that client's `videos` array below.
// 3. Optional: add `featured: true` to the video to show it under
//    "Recent work" on the Home page.
// A client with an empty `videos` array is hidden from the site automatically.
//
// `npm run videos` also writes a poster (<name>.jpg) and a short muted hover
// preview (<name>.preview.mp4) next to each video. Cards find the preview
// automatically from `src`.
//
// HOSTED VIDEOS: `src` and `poster` can also be full URLs, e.g.
//   src: "https://cdn.example.com/lockheart/reel-2.mp4"
// so big files can move off GitHub later with no code changes. For a hosted
// video, add `preview: "https://.../reel-2.preview.mp4"` if you have one;
// without it the card just shows the poster on hover.

export const clients = [
  {
    slug: "childrens-cove",
    name: "Children's Cove",
    category: "Nonprofit",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: true,
    cover: "",
    videos: [
      {
        id: "cc-pass-the-phone",
        title: "Pass the Phone",
        src: "/work/childrens-cove/pass-the-phone.mp4",
        poster: "/work/childrens-cove/pass-the-phone.jpg",
        orientation: "vertical",
        length: "short",
        featured: true,
      },
      {
        id: "cc-day-in-the-life",
        title: "A day in the life",
        src: "/work/childrens-cove/day-in-the-life.mp4",
        poster: "/work/childrens-cove/day-in-the-life.jpg",
        orientation: "vertical",
        length: "short",
        featured: true,
      },
      {
        id: "cc-three-things",
        title: "3 things to know",
        src: "/work/childrens-cove/three-things.mp4",
        poster: "/work/childrens-cove/three-things.jpg",
        orientation: "vertical",
        length: "short",
        featured: true,
      },
    ],
  },
  {
    slug: "impactidol",
    name: "ImpactIdol",
    category: "Nonprofit",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: true,
    cover: "",
    videos: [
      {
        id: "ii-video-1",
        title: "Volunteer coordination",
        src: "/work/impactidol/impactidol-1.mp4",
        poster: "/work/impactidol/impactidol-1.jpg",
        orientation: "vertical",
        length: "short",
        featured: true,
      },
      {
        id: "ii-video-2",
        title: "Better tools, less time",
        src: "/work/impactidol/impactidol-2.mp4",
        poster: "/work/impactidol/impactidol-2.jpg",
        orientation: "vertical",
        length: "short",
        featured: true,
      },
      {
        id: "ii-video-3",
        title: "Get more time",
        src: "/work/impactidol/impactidol-3.mp4",
        poster: "/work/impactidol/impactidol-3.jpg",
        orientation: "vertical",
        length: "short",
        // featured: true,
      },
    ],
  },
  {
    slug: "cafe-st-petersburg",
    name: "Café St. Petersburg",
    category: "Restaurant", // "Restaurant" | "Nonprofit"
    location: "", // e.g. "Newton, MA" (leave blank if unknown)
    summary: "", // one or two plain sentences, written by Alex
    services: ["Short-form video"], // shown as small tags
    instagram: "", // optional client profile link
    featured: true, // client is featured (see featuredVideos below)
    cover: "/work/cafe-st-petersburg/reel-1.jpg",
    videos: [
      {
        id: "csp-reel-1",
        title: "Promo reel",
        src: "/work/cafe-st-petersburg/reel-1.mp4",
        poster: "/work/cafe-st-petersburg/reel-1.jpg",
        orientation: "vertical", // "vertical" (9:16) | "horizontal" (16:9)
        length: "short", // "short" | "full"
        // featured: true,   // add to put this video in "Recent work" on Home
      },
    ],
  },
  {
    slug: "lockheart",
    name: "Lockheart",
    category: "Restaurant",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: true,
    cover: "/work/lockheart/reel-2.jpg",
    videos: [
      {
        id: "lockheart-reel-2",
        title: "Full-length video",
        src: "/work/lockheart/reel-2.mp4",
        poster: "/work/lockheart/reel-2.jpg",
        orientation: "vertical",
        length: "full",
      },
    ],
  },
  {
    slug: "centre-street-food-pantry",
    name: "Centre Street Food Pantry",
    category: "Nonprofit",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: true,
    cover: "/work/centre-street-food-pantry/centre-st-food-pantry.jpg",
    videos: [
      {
        id: "csfp-pantry",
        title: "Food pantry video",
        src: "/work/centre-street-food-pantry/centre-st-food-pantry.mp4",
        poster: "/work/centre-street-food-pantry/centre-st-food-pantry.jpg",
        orientation: "vertical",
        length: "short",
      },
    ],
  },
  {
    slug: "cafe-sol-azteca",
    name: "Café Sol Azteca",
    category: "Restaurant",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: false,
    cover: "",
    videos: [],
  },
  {
    slug: "bills-pizzeria",
    name: "Bill's Pizzeria",
    category: "Restaurant",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: false,
    cover: "",
    videos: [],
  },
  {
    slug: "newton-tree-conservators",
    name: "Newton Tree Conservators",
    category: "Nonprofit",
    location: "",
    summary: "",
    services: ["Short-form video"],
    instagram: "",
    featured: false,
    cover: "",
    videos: [],
  },
];

/* ---------- helpers (nothing below needs editing) ---------- */

// Clients that have at least one video. Everything on the site uses this.
export const visibleClients = clients.filter((c) => c.videos.length > 0);

// Visible clients marked `featured: true`.
export const featuredClients = visibleClients.filter((c) => c.featured);

// "Recent work" on Home: every video marked `featured: true`, in the order
// above. The first one gets the big card. If no video is marked, it falls
// back to the first video of each featured client.
export const featuredVideos = (() => {
  const picked = allVideosList().filter((v) => v.featured);
  if (picked.length) return picked;
  return featuredClients.map((c) => videosFor(c)[0]);
})();

export function getClient(slug) {
  return clients.find((c) => c.slug === slug);
}

// A client's videos with the client name and slug attached to each.
export function videosFor(client) {
  return client.videos.map((v) => ({
    ...v,
    clientName: client.name,
    clientSlug: client.slug,
    category: client.category,
  }));
}

// Every video on the site, flattened, with its client attached.
export const allVideos = allVideosList();

function allVideosList() {
  return visibleClients.flatMap(videosFor);
}

// Cover image for a client: its `cover`, or the first video's poster.
export function coverFor(client) {
  return client.cover || client.videos[0]?.poster || "";
}

// Hover preview clip for a video. Local files get the `.preview.mp4` that
// `npm run videos` writes; hosted videos use `preview` if it is set.
export function previewFor(video) {
  if (video.preview) return video.preview;
  if (/^https?:\/\//.test(video.src)) return "";
  return video.src.replace(/\.(mp4|mov)$/i, ".preview.mp4");
}

// Small poster (`<name>.thumb.jpg`, written by `npm run videos`) for tiles.
// Hosted posters use `thumb` if set, otherwise the full poster.
export function thumbFor(video) {
  if (video.thumb) return video.thumb;
  if (!video.poster || /^https?:\/\//.test(video.poster)) return video.poster || "";
  return video.poster.replace(/\.jpg$/i, ".thumb.jpg");
}

// srcset for a poster: the thumbnail for small slots, the full still otherwise.
export function posterSrcSet(video) {
  const thumb = thumbFor(video);
  if (!video.poster || thumb === video.poster) return undefined;
  return `${thumb} 360w, ${video.poster} 720w`;
}

// URL filter value for a category ("Restaurant" -> "restaurant").
export function categoryKey(category) {
  return category.toLowerCase();
}
