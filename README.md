# Back 2 Natural Hazards

<p align="center">
<a href="https://b2nh.world">
<img src="https://github.com/SimLej18/B2NH/blob/main/assets/css/logo.png?raw=true" alt="B2NH logo" width="400"/>
</a>
</p>

Demo at https://b2nh.world

Frontend of *Back To Natural Hazards* made with **D3.js**, **paper.js** and some ❤️.

Backend of *Back To Natural Hazards* made with **Sqlite3** and **Lumen (Laravel)** and available at https://github.com/tintamarre/b2nh-api

# Credits

- @alexandreperrot
- @SimLej18
- @tintamarre
- @Ushien

# Development

- `yarn serve`

Then open your browser to `http://localhost:8080`

# Deployment with Docker

## Build the image
`docker build -t webserver .`

## Run the image
`docker run -it --rm -d -p 8088:80 --name web webserver`

Then open your browser to `http://localhost:8088`

## License

This project is licensed under the GPLv3 license.