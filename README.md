# LiveCard SDK

A desktop and mobile web library for capturing video, image, and text gift messages during checkout on e-commerce websites.

Library documentation is available at https://livecardapp.github.io/livecard-js

For a sample integration see https://gist.github.com/dpanzer/7bf7dc9b4f6feb7a4833d1e922b2d3be

# LiveCard SDK Release Notes

0.3.0

- Implemented native audio capture & visualization.
- Implemented flash audio capture & visualization.

0.2.4

- Simplfied flash image and video code structure.
- Implemented flash access denial handling.
- Implemented flash no camera present handling.
- Simplfied native image and video code structure.
- Implemented native access denial handling.
- Implemented native no camera present handling.

0.2.3

- Flash image integration

0.2.2

- Flash video integration
- Note: Flash dependencies are located in lib/flash. For production, need to place in static path /livecard-sdk/flash.
- Added setflash for development purposes. Before running the dev server, run 'npm run setflash'.

0.2.1

- Turn off camera when not in use.
- Cap image size to a default max size.
- Cap video size to a default max size.
- Updated styling code.
- Updated JS Documentation.

0.2.0

- Re-architectured code base to MVC format.
- Convert from ES5 to ES6
- Added transpilation from ES6 to ES5
- Added packaging

# Copyright & Licensing

Copyright (c) 2019 LiveCard LLC. All rights reserved