module.exports = {
  // Run ESLint on changes to JavaScript/TypeScript files
  '**/*.(ts|*.ts)': (filenames) => `yarn lint . ${filenames.join(' ')}`,
  // Run Prettier check on all valid format changes
  '*.{js,jsx,ts,tsx,md,html,css}': 'yarn format',
};
