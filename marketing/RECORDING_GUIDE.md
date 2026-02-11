# Recording Guide: How to Capture Your Ad

I have created a dedicated **Promo Sequence** in the code that automates the visuals for your 30-second ad.

## Step 1: Enable the Promo Scene
Open `src/App.tsx` and temporarily swap the main app with the promo scene.

1.  Add the import at the top:
    ```typescript
    import { PromoScene } from './components/PromoScene';
    ```

2.  In the `App` component return statement, comment out the main logic and return just `<PromoScene />`:
    ```typescript
    // ... inside App component
    return <PromoScene />; 
    /* 
      The rest of your app code...
    */
    ```

## Step 2: Record
1.  Open the app in your browser (`npm run dev`).
2.  Use a screen recorder (OBS, QuickTime, Loom).
3.  Set the capture area to the center "Main Stage" (the component adds cinematic black bars to help you frame it).
4.  Hit record. The scene will loop every 30 seconds automatically.

## Step 3: Edit
1.  Take the video file.
2.  Add the AI Voiceover (Script in `TIKTOK_AD_SCRIPT.md`).
3.  Add high-energy background music.
4.  Upload to TikTok!

## Step 4: Revert
Don't forget to undo the changes to `App.tsx` when you're done to get your app back!
