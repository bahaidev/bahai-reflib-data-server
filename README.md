# bahai-reflib-data-server

A Node.js Express service and web app for retrieving data out of the
[Bahá'í Reference Library](https://bahai.org/library).

Utilizes [bahai-reflib-data](https://github.com/bahaidev/bahai-reflib-data) for
the data.

Note that although this uses data from the Bahá'í Reference Library, this is
just an individual effort not related to the site.

The web-service and web app is currently available at
<https://bahai-browser.org/bahai-reflib-data-server/>.

## Potential to-dos

1. Add API to redirect directly to site (and URL-with-ID to
    work-section-paragraph in case already have)
1. Could make web app version which was entirely offline capable, using
    `bahai-reflib-data`'s browser build and a service worker.
