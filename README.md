# Travis Hale & Sayali Dharpal Wedding Invitation

A mobile-first Christian wedding invitation built with React, TypeScript, and Vite. Couple names, Scripture, ceremony details, map destination, WhatsApp contact, and image paths live in `src/content/wedding.ts`.

Travis Hale and Sayali Dharpal are the current names. The WhatsApp number remains a placeholder. Replace `REPLACE_WITH_HOST_NUMBER` in the wedding config when it is available, using international digits without spaces or punctuation.

The opening animation plays automatically, can be skipped, and is omitted when reduced motion is preferred. Its beat timings are in `src/content/intro.ts`; the visual sequence is in `src/styles.css`.

## Run locally

```sh
npm install
npm run dev
```

## Verify

```sh
npm test
npm run build
```
