# Pin npm packages by running ./bin/importmap

# Pin the application JavaScript file
pin "application", preload: true

# Pin Stimulus and Turbo
pin "stimulus", to: "stimulus.js", preload: true
pin "turbo", to: "turbo.js"
