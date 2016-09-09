erstikarte
==========

Übersichtskarte -- insbesondere interessant für GI Erstis :^)

Die Daten liegen als GeoJSON in folgender Struktur vor:

```
FeatureCollection
  - [FeatureCollection] // jede FeatureCollection stellt eine "Gruppe dar"
    - properties
      - title           // Titel der Gruppe
      - description     // Beschreibung der Gruppe
    - [Feature]
      - properties
        - title         // Titel des Features
        - description   // Beschreibung des Features
        - urls          // key:value Paare von zugehörigen URLs
                        // optional mit Link zu einem Bild, zB:
                        // { "https://geofs.de": "GEOFS", "https://geofs.de/geoloek":"./kappa.gif" }
        - marker-symbol // sämtliche simplestyle-spec attribute werden zum styling verwendet!
        - ...
```

zum Bearbeiten der Daten: [geojson.io](http://geojson.io)
