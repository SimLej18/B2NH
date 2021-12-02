# B2NH
Frontend of Back To Natural Hazards make with **D3.js**, **paper.js** and some ❤️.

Live at https://b2nh.world

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
`docker run -it --rm -d -p 86:80 --name web webserver`

Then open your browser to `http://localhost:86`
