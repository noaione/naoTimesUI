# naoTimes Web Panel

[![CI](https://github.com/noaione/naoTimesUI/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/noaione/naoTimesUI/actions/workflows/ci.yml) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/noaione/naoTimesUI.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/noaione/naoTimesUI/context:javascript) [![Vercel Deploy Status](https://img.shields.io/endpoint?url=https://naotimes-og.glitch.me/deploy-status)](https://panel.naoti.me/tentang)

A web panel for naoTimes Showtimes Module


This project use [pnpm](https://pnpm.js.org/)
```
npm install -g pnpm
```

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fnoaione%2FnaoTimesUI%2Ftree%2Fmaster&env=TOKEN_SECRET,MONGODB_URI,BOT_SOCKET_HOST,BOT_SOCKET_PORT,BOT_SOCKET_PASSWORD&envDescription=All%20required%20Environment%20Variables%20for%20the%20Process%20to%20run&envLink=https%3A%2F%2Fgithub.com%2Fnoaione%2FnaoTimesUI%2Fblob%2Fnext%2F.env-example&demo-title=naoTimesUI&demo-description=Atur%20progress%20utang%20Fansub%20anda%20via%20WebUI%20naoTimes!&demo-url=https%3A%2F%2Fpanel.naoti.me)

### Requirements
- naoTimes Bot with `naotimesui` cogs enabled
- Redis Server
- MongoDB with Showtimes DB in it.

You need to have naoTimes bot ready with the `naotimesui` cogs enabled since it will be use to fetch some information from Discord.
After that, set the IP and Port of the deployed `naotimesui` cogs Socket to the `.env` file.

You can use `openssl rand` to generate a new TOKEN_SECRET<br>
```bash
openssl rand -hex 32
```

### Running
Install everything first with
```bash
pnpm install
```

The run the server with
```bash
pnpm run start
```

## Development

```bash
pnpm install
pnpm run dev
```

## License
This project is licensed with [MIT License](LICENSE)

## Acknowledgements
The dashboard design is adapted from [dashboard-template](https://github.com/tailwindcomponents/dashboard-template) by [Tailwind Components](https://github.com/tailwindcomponents).

The Embed design is adapted from [are-we-there-yet](https://github.com/GrygrFlzr/are-we-there-yet) by [GrygrFlzr](https://github.com/GrygrFlzr).

The Login screen is adapted from [Simple Register/Sign Up Form](https://tailwindcomponents.com/component/simple-registersign-up-form) by [Scott Windon](https://tailwindcomponents.com/u/scott-windon)

Credits originally to the Author.
This project also heavily utilized TailwindCSS, and React (with Next.js as it's Framework)!
