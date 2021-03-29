# naoTimes Web Panel
A web panel for naoTimes Showtimes Module

This project use [pnpm](https://pnpm.js.org/)

## Deployment

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

Then run the server with
```bash
pnpm run prod
```

If you don't want to rebuild everything, you could just execute:
```bash
pnpm run prod:start
```

## Development

```bash
pnpm install
pnpm run dev
```

You can also just run this to build everything without running ts-node
```bash
pnpm run build:dev
```

This will generate a sourcemaps for the `lib` js, will not minify/uglify anything and the main css file will contains every tailwind css since it's needed for development.

## License
This project is licensed with [MIT License](LICENSE)
