export const allowlist = [
  "http://localhost:5173",
  "https://admin-descart-farm-app.vercel.app",
];

export const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
