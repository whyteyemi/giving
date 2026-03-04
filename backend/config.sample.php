<?php
// Copy to config.php and fill values (do not commit secrets).
// On cPanel, prefer environment variables (SetEnv) and keep this file OUTSIDE public_html.

return [
  'APP_ENV' => getenv('APP_ENV') ?: 'development', // development|production
  'APP_URL' => getenv('APP_URL') ?: 'http://localhost:5173',
  'APP_SECRET' => getenv('APP_SECRET') ?: 'CHANGE_ME_LONG_RANDOM_SECRET',

  // Comma-separated list of allowed origins for CORS (no trailing slash)
  // Example: https://givingwithoutlimit.org,https://www.givingwithoutlimit.org
  'CORS_ORIGINS' => getenv('CORS_ORIGINS') ?: '*',

  'DB_HOST' => getenv('DB_HOST') ?: '127.0.0.1',
  'DB_PORT' => getenv('DB_PORT') ?: '',
  'DB_NAME' => getenv('DB_NAME') ?: 'giving',
  'DB_USER' => getenv('DB_USER') ?: 'giving_user',
  'DB_PASS' => getenv('DB_PASS') ?: 'CHANGE_ME',

  // Paystack
  'PAYSTACK_SECRET_KEY' => getenv('PAYSTACK_SECRET_KEY') ?: '',
];
