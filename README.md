# Personal Link-in-Bio Website

A professional, dark-themed personal link-in-bio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion for page transitions and interactions
- **Cyber Aesthetic**: Dark mode with cyan/blue accents
- **Fully Responsive**: Mobile-first design
- **SEO Optimized**: Complete metadata configuration
- **Accessibility**: ARIA labels and semantic HTML
- **Static Export Ready**: Deployable on Vercel or any static hosting

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Update the links in `app/page.tsx` with your actual URLs:
   - Phone number
   - Personal website
   - LinkedIn profile
   - Instagram profile
   - Facebook profile
   - Telegram username
   - GitHub username

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
```

This will create a static export in the `out` directory, ready to deploy.

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/
│   ├── LinkCard.tsx    # Reusable animated link card
│   └── animations.ts   # Framer Motion variants
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── package.json        # Dependencies
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
- `cyber-bg`: Background color
- `cyber-accent`: Accent color (cyan/blue)
- `cyber-text`: Text color

### Animations
Modify `components/animations.ts` to adjust animation timings and effects.

### Links
Update the `links` array in `app/page.tsx` to add, remove, or modify links.

## 📝 License

Personal project - All rights reserved.

