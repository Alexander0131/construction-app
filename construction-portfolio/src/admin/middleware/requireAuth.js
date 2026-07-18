const { requireAuth } = require("@clerk/express");

// Verifies the Clerk session token sent by the frontend and rejects the
// request with 401 if it's missing or invalid. Attach to any route that
// mutates data (create/update/delete) or exposes admin-only reads.
module.exports = requireAuth();