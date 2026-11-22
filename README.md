# Lau Xing Ying — Portfolio

Personal portfolio of Lau Xing Ying, Information Systems student at SMU.

Live site → [lauxingying.vercel.app](https://lauxingying.vercel.app)

The whole site is one open styrofoam cai fan box on a hawker table. Each dish
is a section, and the labels in the 3D scene are the navigation.

## Tech stack

- [React](https://react.dev/) (Create React App)
- [Tailwind CSS](https://tailwindcss.com/)
- [three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) for the box scene
- Deployed on [Vercel](https://vercel.com/)

## Project layout

| Path | What's there |
| --- | --- |
| `src/App.js` | Page sections, panels and interactions |
| `src/components/BoxScene.js` | The 3D box, dishes and Singapore objects |
| `src/data/site.js` | Copy, experience, skills and links |
| `src/data/projects.js` | Project data |
| `src/orbit.js`, `src/sound.js` | Camera orbit navigation, sound effects |
| `public/audio/` | Sound clips |
| `DESIGN.md`, `PRODUCT.md` | Design system and product brief |

## Getting started

```sh
npm install
npm start      # http://localhost:3000
npm run build  # production build in build/
```

## Contact

lauxingying@gmail.com · [LinkedIn](https://www.linkedin.com/in/lauxingying)
