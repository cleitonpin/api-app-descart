export const allowlist = [
  "http://127.0.0.1:5173",
  "https://admin-descart-farm-app.vercel.app",
  "https://admin-descart-farm-app-git-master-cleitonpin.vercel.app",
  "https://admin-descart-farm-app.vercel.app",
];

export const corsOptionsDelegate = (req: any, callback: any) => {
  callback(null, {origin: true}); // callback expects two parameters: error and options
};
