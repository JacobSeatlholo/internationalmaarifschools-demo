#!/usr/bin/env bash
# Download real IMS Cape Town images from the official CDN into public/images/site
set -e
CDN="https://cdn.internationalmaarifschools.co.za/media/images"
OUT="/home/z/my-project/public/images/site"
mkdir -p "$OUT"

dl() { curl -sL --max-time 60 --retry 2 -o "$OUT/$1" "$CDN/$2" && echo "ok  $1  ($(stat -c%s "$OUT/$1") bytes)"; }

# Hero / featured (4461x2799)
dl hero-main.jpg      4aP5EDAS_-hpQcCoIDLQcA.jpg

# Campus gallery (site payload order)
dl gallery-01.jpg     uqKmlerKvNigSvvCFCCPqg.jpg
dl gallery-02.jpg     Hscr9Yx1xHYJtXJzCNGNIw.jpg
dl gallery-03.jpg     N47aQaRg-skTkrjBh12CYg.jpg
dl gallery-04.jpg     XfaceLDdNPDBvaaRe99jAw.jpg
dl gallery-05.jpg     F2OO_rbkj6SfHdA3vkMQAw.jpg
dl gallery-06.jpg     4C_ciNZS1vpQt71-NfD_uA.jpg
dl gallery-07.jpg     dGZst8ZLfz7jSFeqU3S5Nw.jpg
dl gallery-08.jpg     55cTPioqQ8SDairEvGhuMQ.jpg
dl gallery-09.jpg     4IbRz66TtePM8J_YAz5uOg.jpg
dl gallery-10.jpg     7bNlg26J2K8JTPRyT5hb9g.jpg
dl gallery-11.jpg     OcNQM7nNZLtoaM_ZTUtixA.jpg
dl gallery-12.jpg     I3I1Azg82Ftz0gRMeNzX4g.jpg
dl gallery-13.jpg     NFfVSv8ISnJ0Rv2sDTfmPA.jpg
dl gallery-14.jpg     lZzhJ3ojRyp4c8VxUu9pEQ.jpg
dl gallery-15.jpg     Sc9IMF79rmzEnyY9HvGOvg.jpg
dl gallery-16.jpg     uycJOfaF2xHkqDOfwXfJ3Q.jpg
dl gallery-17.jpg     P7TtDBdnSnqIVEiOZiVxuA.jpg
dl gallery-18.jpg     9oUcdwvx08dvEny2OxUobw.jpg

# Team (official head-office team portraits)
dl team-lebogang.jpg  ksvUFj-i_fIpPKxEwZOwdw.jpg
dl team-dimakatso.jpg zJyoJjsNfhEftog8c02LlA.jpg
dl team-nomvula.jpg   GWmQJ5k02YLPDQRUNKkiWg.jpg
dl team-hasan.jpg     Fmxnvm2Bnu83rqU1fK9knA.jpg
dl team-abdullah.jpg  lijcDk_a8W1VaYMOJJI9ng.jpg
dl team-ebrahim.png   noOag3pPjB00NvMB8CVT2w.png

echo "---"; ls "$OUT" | wc -l; du -sh "$OUT"
